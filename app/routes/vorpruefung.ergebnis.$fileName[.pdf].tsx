import * as fs from "node:fs";
import * as path from "node:path";
import { PDFBool, PDFDocument, PDFName } from "pdf-lib";
import { preCheck } from "~/resources/content";
import { userAnswers } from "~/utils/cookies.server";
import trackCustomEvent from "~/utils/trackCustomEvent.server";
import type { Route } from "./+types/vorpruefung.ergebnis.$fileName[.pdf]";
import { PreCheckAnswers } from "./vorpruefung.$questionId/route";

export const FIELD_NAME_POLICY_TITLE = "Titel des Regelungsvorhabens";
export const FIELD_NAME_PRE_CHECK_POSITIVE_1 = "Vorprüfung positiv - 1";
export const FIELD_NAME_PRE_CHECK_POSITIVE_2 = "Vorprüfung positiv - 2";
export const FIELD_NAME_PRE_CHECK_POSITIVE_3 = "Vorprüfung positiv - 3";
export const FIELD_NAME_PRE_CHECK_POSITIVE_4 = "Vorprüfung positiv - 4";
export const FIELD_NAME_PRE_CHECK_POSITIVE_5 = "Vorprüfung positiv - 5";
export const FIELD_NAME_PRE_CHECK_NEGATIVE = "Vorprüfung negativ";
export const FIELD_NAME_PRE_CHECK_NEGATIVE_REASONING =
  "Vorprüfung negativ - Erläuterung";

const ALL_QUESTIONS = [
  "it-system",
  "verpflichtungen-fuer-beteiligte",
  "datenaustausch",
  "kommunikation",
  "automatisierung",
];

const QUESTION_FIELD_MAP: Record<(typeof ALL_QUESTIONS)[number], string> = {
  "it-system": FIELD_NAME_PRE_CHECK_POSITIVE_1,
  "verpflichtungen-fuer-beteiligte": FIELD_NAME_PRE_CHECK_POSITIVE_2,
  datenaustausch: FIELD_NAME_PRE_CHECK_POSITIVE_3,
  kommunikation: FIELD_NAME_PRE_CHECK_POSITIVE_4,
  automatisierung: FIELD_NAME_PRE_CHECK_POSITIVE_5,
};

function isPreCheckAnswers(
  obj: Record<string, FormDataEntryValue>,
): obj is PreCheckAnswers {
  return ALL_QUESTIONS.every(
    (question) => typeof obj[question] === "string" && !!obj[question],
  );
}

interface UserInput {
  title: string;
  negativeReasoning?: string;
  answers: PreCheckAnswers;
}

const POSITIVE_RESULT = "yes";
const NEGATIVE_RESULT = "no";

const createPreCheckPDF = async function (
  userInput: UserInput,
): Promise<Uint8Array> {
  const filePath = path.resolve(
    "public/documents/digitalcheck-vorpruefung.pdf",
  );
  const fileData = fs.readFileSync(filePath);

  try {
    const rawPdfBytes = new Uint8Array(fileData);
    const pdfDoc = await PDFDocument.load(rawPdfBytes);
    const form = pdfDoc.getForm();

    const { title, answers, negativeReasoning } = userInput;

    const titleField = form.getTextField(FIELD_NAME_POLICY_TITLE);
    titleField.setText(title);
    titleField.setFontSize(12);

    ALL_QUESTIONS.forEach((question) => {
      if (answers[question] === POSITIVE_RESULT) {
        form.getCheckBox(QUESTION_FIELD_MAP[question]).check();
      }
    });

    if (
      ALL_QUESTIONS.every((question) => answers[question] === NEGATIVE_RESULT)
    ) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_NEGATIVE).check();
    }

    const negativeReasoningField = form.getTextField(
      FIELD_NAME_PRE_CHECK_NEGATIVE_REASONING,
    );
    negativeReasoningField.setText(negativeReasoning);
    negativeReasoningField.setFontSize(12);
    if (negativeReasoning && negativeReasoning?.length > 2000) {
      negativeReasoningField.setFontSize(10);
    }
    negativeReasoningField.enableScrolling();

    // prevent invisible text
    form.acroForm.dict.set(PDFName.of("NeedAppearances"), PDFBool.True);

    return await pdfDoc.save();
  } catch (err) {
    console.error("Error processing PDF:", err);
    throw err;
  }
};

export function loader({ request }: Route.LoaderArgs) {
  if (request.method !== "POST") {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Must be a POST request", { status: 405 });
  }
}

export async function action({ params, request }: Route.ActionArgs) {
  const { fileName } = params;
  const formData = await request.formData();
  const { title, negativeReasoning, ...answers } = Object.fromEntries(formData);
  const filteredAnswers = Object.fromEntries(
    Object.entries(answers).filter(([key]) => ALL_QUESTIONS.includes(key)),
  );

  if (!isPreCheckAnswers(filteredAnswers)) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(preCheck.result.form.precheckAnswersRequired, {
      status: 400,
    });
  }

  if (typeof title !== "string" || title === "") {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(preCheck.result.form.policyTitleRequired, {
      status: 400,
    });
  }

  if (
    (negativeReasoning && typeof negativeReasoning !== "string") ||
    (ALL_QUESTIONS.every(
      (question) => filteredAnswers[question] === NEGATIVE_RESULT,
    ) &&
      negativeReasoning === "")
  ) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(preCheck.result.form.reasonRequired, {
      status: 400,
    });
  }

  // reject requests with long titles or negativeReasonings to prevent DOS and maybe memory overflow attacks
  if (title && title.length > 500) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(preCheck.result.form.policyTitleTooLong, {
      status: 413,
    });
  }

  if (negativeReasoning && negativeReasoning.length > 5000) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(preCheck.result.form.reasonTooLong, {
      status: 413,
    });
  }

  const pdfData = await createPreCheckPDF({
    title,
    negativeReasoning,
    answers: filteredAnswers,
  });

  let result = "Negativ";
  if (Object.values(filteredAnswers).find((a) => a === "yes")) {
    result = "Positiv";
  } else if (Object.values(filteredAnswers).find((a) => a === "unsure")) {
    result = "Unsicher";
  }

  void trackCustomEvent(request, {
    name: "Download Vorprüfung",
    props: { result },
  });

  // Update the cookie expiration to 60 minutes
  const updatedCookie = await userAnswers.serialize(
    {
      answers: filteredAnswers,
      hasViewedResult: false,
    },
    { maxAge: 3600 },
  );

  return new Response(pdfData, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
      "Content-Length": `${pdfData.byteLength}`,
      "Set-Cookie": updatedCookie,
    },
  });
}

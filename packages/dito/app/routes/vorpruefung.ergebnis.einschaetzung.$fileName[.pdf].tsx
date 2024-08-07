import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import * as fs from "node:fs";
import * as path from "node:path";
import { PDFBool, PDFDocument, PDFName } from "pdf-lib";
import { assessment } from "resources/content";
import { getAnswersFromCookie } from "utils/cookies.server";
import trackCustomEvent from "utils/trackCustomEvent.server";

export const FIELD_NAME_POLICY_TITLE = "Titel des Regelungsvorhabens";
export const FIELD_NAME_PRE_CHECK_POSITIVE_1 = "Vorprüfung positiv - 1";
export const FIELD_NAME_PRE_CHECK_POSITIVE_2 = "Vorprüfung positiv - 2";
export const FIELD_NAME_PRE_CHECK_POSITIVE_3 = "Vorprüfung positiv - 3";
export const FIELD_NAME_PRE_CHECK_POSITIVE_4 = "Vorprüfung positiv - 4";
export const FIELD_NAME_PRE_CHECK_POSITIVE_5 = "Vorprüfung positiv - 5";
export const FIELD_NAME_PRE_CHECK_NEGATIVE = "Vorprüfung negativ";
export const FIELD_NAME_PRE_CHECK_NEGATIVE_REASONING =
  "Vorprüfung negativ - Erläuterung";

interface PreCheckAnswer {
  [k: string]: string;
}

interface UserInput {
  title: string;
  answers: PreCheckAnswer;
  negativeReasoning?: string;
}

const POSITIVE_RESULT = "yes";
const NEGATIVE_RESULT = "no";

const createPreCheckPDF = async function (
  userInput: UserInput,
): Promise<Uint8Array> {
  const filePath = path.resolve("public/assets/digitalcheck-vorpruefung.pdf");
  const fileData = fs.readFileSync(filePath);

  try {
    const rawPdfBytes = new Uint8Array(fileData);
    const pdfDoc = await PDFDocument.load(rawPdfBytes);
    const form = pdfDoc.getForm();

    const { title, answers, negativeReasoning } = userInput;

    const titleField = form.getTextField(FIELD_NAME_POLICY_TITLE);
    titleField.setText(title);
    titleField.setFontSize(12);
    if (answers["it-system"] === POSITIVE_RESULT) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_1).check();
    }

    if (answers["verpflichtungen-fuer-beteiligte"] === POSITIVE_RESULT) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_2).check();
    }

    if (answers["datenaustausch"] === POSITIVE_RESULT) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_3).check();
    }

    if (answers["kommunikation"] === POSITIVE_RESULT) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_4).check();
    }

    if (answers["automatisierung"] === POSITIVE_RESULT) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_5).check();
    }

    if (
      [
        answers["it-system"],
        answers["verpflichtungen-fuer-beteiligte"],
        answers["datenaustausch"],
        answers["kommunikation"],
        answers["automatisierung"],
      ].every((answer) => answer === NEGATIVE_RESULT)
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

export function loader({ request }: LoaderFunctionArgs) {
  if (request.method !== "POST") {
    throw new Response("Must be a POST request", { status: 405 });
  }
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { fileName } = params;
  const { answers } = await getAnswersFromCookie(request);
  const formData = await request.formData();
  const { title, negativeReasoning } = Object.fromEntries(formData);

  if (Object.keys(answers).length === 0) {
    throw new Response("No answers available in cookies", { status: 409 });
  }

  if (typeof title !== "string" || title === "") {
    throw new Response(assessment.form.policyTitleRequired, { status: 400 });
  }

  if (
    (negativeReasoning && typeof negativeReasoning !== "string") ||
    ([
      answers["it-system"],
      answers["verpflichtungen-fuer-beteiligte"],
      answers["datenaustausch"],
      answers["kommunikation"],
      answers["automatisierung"],
    ].every((answer) => answer === NEGATIVE_RESULT) &&
      negativeReasoning === "")
  ) {
    throw new Response(assessment.form.reasonRequired, {
      status: 400,
    });
  }

  // reject requests with long titles or negativeReasonings to prevent DOS and maybe memory overflow attacks
  if (title && title.length > 500) {
    throw new Response(assessment.form.policyTitleTooLong, {
      status: 413,
    });
  }

  if (negativeReasoning && negativeReasoning.length > 5000) {
    throw new Response(assessment.form.reasonTooLong, {
      status: 413,
    });
  }

  const pdfData = await createPreCheckPDF({
    title,
    negativeReasoning,
    answers,
  });

  let result = "Negativ";
  if (Object.values(answers).find((a) => a === "yes")) {
    result = "Positiv";
  } else if (Object.values(answers).find((a) => a === "unsure")) {
    result = "Unsicher";
  }
  void trackCustomEvent(request, {
    name: "Download Vorprüfung",
    props: { result },
  });

  return new Response(pdfData, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
      "Content-Length": `${pdfData.byteLength}`,
    },
  });
}

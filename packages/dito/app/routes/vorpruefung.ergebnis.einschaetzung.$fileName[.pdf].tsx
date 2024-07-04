import { LoaderFunctionArgs } from "@remix-run/node";
import * as fs from "node:fs";
import * as path from "node:path";
import { PDFDocument } from "pdf-lib";
import { assessment } from "resources/content";

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

    const positive = ["yes", "unsure"];
    const negative = "no";

    const titleField = form.getTextField(FIELD_NAME_POLICY_TITLE);
    titleField.setText(title);
    titleField.setFontSize(12);

    if (positive.includes(answers["it-system"])) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_1).check();
    }

    if (positive.includes(answers["verpflichtungen-fuer-beteiligte"])) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_2).check();
    }

    if (positive.includes(answers["datenaustausch"])) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_3).check();
    }

    if (positive.includes(answers["kommunikation"])) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_4).check();
    }

    if (positive.includes(answers["automatisierung"])) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_5).check();
    }

    if (
      [
        answers["it-system"],
        answers["verpflichtungen-fuer-beteiligte"],
        answers["datenaustausch"],
        answers["kommunikation"],
        answers["automatisierung"],
      ].every((answer) => answer === negative)
    ) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_NEGATIVE).check();
    }

    const negativeReasoningField = form.getTextField(
      FIELD_NAME_PRE_CHECK_NEGATIVE_REASONING,
    );
    negativeReasoningField.setText(negativeReasoning);
    negativeReasoningField.setFontSize(12);

    return await pdfDoc.save();
  } catch (err) {
    // TODO: Logging on failure
    console.error("Error processing PDF:", err);
    throw err;
  }
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { fileName } = params;
  const url = new URL(request.url);

  const searchParams = Object.fromEntries(url.searchParams.entries());
  const {
    title = "",
    negativeReasoning = "",
    download,
    ...answers
  } = searchParams;

  // reject requests with long titles or negativeReasonings to prevent DOS and maybe memory overflow attacks
  if (title.length > 500) {
    throw new Response(assessment.form.policyTitleTooLong, {
      status: 413,
    });
  }
  if (negativeReasoning.length > 5000) {
    throw new Response(assessment.form.reasonTooLong, {
      status: 413,
    });
  }

  const pdfData = await createPreCheckPDF({
    title,
    answers,
    negativeReasoning,
  });

  return new Response(pdfData, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      ...(download !== undefined && {
        "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
        "Content-Length": `${pdfData.byteLength}`,
      }),
    },
  });
}

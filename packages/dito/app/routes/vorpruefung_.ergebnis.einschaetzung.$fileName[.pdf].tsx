import { LoaderFunctionArgs } from "@remix-run/node";
import * as fs from "node:fs";
import * as path from "node:path";
import { PDFDocument, PDFForm, PDFTextField } from "pdf-lib";

export const FIELD_NAME_POLICY_TITLE = "Titel des Regelungsvorhabens";
export const FIELD_NAME_PRE_CHECK_POSITIVE_1 = "Vorprüfung positiv - 1";
export const FIELD_NAME_PRE_CHECK_POSITIVE_2 = "Vorprüfung positiv - 2";
export const FIELD_NAME_PRE_CHECK_POSITIVE_3 = "Vorprüfung positiv - 3";
export const FIELD_NAME_PRE_CHECK_POSITIVE_4 = "Vorprüfung positiv - 4";
export const FIELD_NAME_PRE_CHECK_POSITIVE_5 = "Vorprüfung positiv - 5";
export const FIELD_NAME_PRE_CHECK_NEGATIVE = "Vorprüfung negativ";
export const FIELD_NAME_PRE_CHECK_NEGATIVE_ASSESMENT =
  "Vorprüfung negativ - Erläuterung";

interface PreCheckAnswer {
  [k: string]: string;
}

interface UserInput {
  title: string;
  answers: PreCheckAnswer;
  negativeAssessment?: string;
}

const createPreCheckPDF = async function (
  userInput: UserInput,
): Promise<Uint8Array> {
  const filePath = path.resolve("public/assets/digitalcheck-vorpruefung.pdf");
  const fileData = fs.readFileSync(filePath);

  try {
    const rawPdfBytes = new Uint8Array(fileData);
    const pdfDoc: PDFDocument = await PDFDocument.load(rawPdfBytes);
    const form: PDFForm = pdfDoc.getForm();

    const { title, answers, negativeAssessment } = userInput;

    const positive = ["yes", "unsure"];
    const negative = "no";

    const titleField: PDFTextField = form.getTextField(FIELD_NAME_POLICY_TITLE);
    titleField.setText(title);
    titleField.setFontSize(12);

    if (positive.includes(answers?.["it-system"])) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_1).check();
    }
    if (positive.includes(answers?.["verpflichtungen-fuer-beteiligte"])) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_2).check();
    }
    if (positive.includes(answers?.["datenaustausch"])) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_3).check();
    }
    if (positive.includes(answers?.["kommunikation"])) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_4).check();
    }
    if (positive.includes(answers?.["automatisierung"])) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_5).check();
    }

    if (
      [
        answers?.["it-system"],
        answers?.["verpflichtungen-fuer-beteiligte"],
        answers?.["datenaustausch"],
        answers?.["kommunikation"],
        answers?.["automatisierung"],
      ].every((answer) => answer === negative)
    ) {
      form.getCheckBox(FIELD_NAME_PRE_CHECK_NEGATIVE).check();
    }

    const negativeAssessmentField: PDFTextField = form.getTextField(
      FIELD_NAME_PRE_CHECK_NEGATIVE_ASSESMENT,
    );
    negativeAssessmentField.setText(negativeAssessment);
    negativeAssessmentField.setFontSize(12);

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
    negativeAssessment = "",
    download,
    ...answers
  } = searchParams;

  const pdfData: Uint8Array = await createPreCheckPDF({
    title,
    answers,
    negativeAssessment,
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

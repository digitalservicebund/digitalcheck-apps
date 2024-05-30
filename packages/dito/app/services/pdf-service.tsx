import { PDFDocument, PDFForm, PDFTextField } from "pdf-lib";

const FIELD_NAME_POLICY_TITLE: string = "Titel des Regelungsvorhabens";
export const FIELD_NAME_PRE_CHECK_QUESTION_1: string = "Vorprüfung positiv - 1";
export const FIELD_NAME_PRE_CHECK_QUESTION_2: string = "Vorprüfung positiv - 2";
export const FIELD_NAME_PRE_CHECK_QUESTION_3: string = "Vorprüfung positiv - 3";
export const FIELD_NAME_PRE_CHECK_QUESTION_4: string = "Vorprüfung positiv - 4";
export const FIELD_NAME_PRE_CHECK_QUESTION_5: string = "Vorprüfung positiv - 5";
export const FIELD_NAME_PRE_CHECK_QUESTION_6: string = "Vorprüfung negativ";

interface PreCheckAnswer {
  name: string;
  checked: boolean;
}

interface UserInput {
  policyTitle: string;
  preCheckAnswers: PreCheckAnswer[];
  preCheckNegativeExplanation?: string;
}

export default async function createFilledPDF(
  rawFileData: Uint8Array,
  userInput: UserInput,
): Promise<Uint8Array> {
  try {
    const rawPdfBytes = new Uint8Array(rawFileData);
    const pdfDoc: PDFDocument = await PDFDocument.load(rawPdfBytes);
    const form: PDFForm = pdfDoc.getForm();

    const policyTitleField: PDFTextField = form.getTextField(
      FIELD_NAME_POLICY_TITLE,
    );
    policyTitleField.setText(userInput.policyTitle);

    userInput.preCheckAnswers.forEach((answer: PreCheckAnswer) => {
      if (answer.checked) {
        form.getCheckBox(answer.name).check();
      }
    });

    return await pdfDoc.save();
  } catch (err) {
    console.error("Error processing PDF:", err);
    throw err;
  }
}

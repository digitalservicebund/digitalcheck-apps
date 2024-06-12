import { LoaderFunctionArgs } from "@remix-run/node";
import * as fs from "node:fs";
import * as path from "node:path";
import { PDFDocument, PDFForm, PDFTextField } from "pdf-lib";

const FIELD_NAME_POLICY_TITLE: string = "Titel des Regelungsvorhabens";
const FIELD_NAME_PRE_CHECK_POSITIVE_1: string = "Vorprüfung positiv - 1";
const FIELD_NAME_PRE_CHECK_POSITIVE_2: string = "Vorprüfung positiv - 2";
const FIELD_NAME_PRE_CHECK_POSITIVE_3: string = "Vorprüfung positiv - 3";
const FIELD_NAME_PRE_CHECK_POSITIVE_4: string = "Vorprüfung positiv - 4";
const FIELD_NAME_PRE_CHECK_POSITIVE_5: string = "Vorprüfung positiv - 5";
const FIELD_NAME_PRE_CHECK_NEGATIVE: string = "Vorprüfung negativ";
const FIELD_NAME_PRE_CHECK_NEGATIVE_ASSESMENT: string =
  "Vorprüfung negativ - Erläuterung";

interface PreCheckAnswer {
  name: string;
  checked: boolean;
}

interface UserInput {
  title: string;
  answers: PreCheckAnswer[];
  negativeAssessment?: string;
}

const createFilledPDF = async function (
  userInput: UserInput,
): Promise<Uint8Array> {
  const filePath = path.resolve("app/resources/digitalcheck-vorpruefung.pdf");
  const fileData = fs.readFileSync(filePath);

  try {
    const rawPdfBytes = new Uint8Array(fileData);
    const pdfDoc: PDFDocument = await PDFDocument.load(rawPdfBytes);
    const form: PDFForm = pdfDoc.getForm();

    const titleField: PDFTextField = form.getTextField(FIELD_NAME_POLICY_TITLE);
    titleField.setText(userInput.title);
    titleField.setFontSize(12);

    userInput.answers.forEach((answer: PreCheckAnswer) => {
      if (answer.checked) {
        form.getCheckBox(answer.name).check();
      }
    });

    const negativeAssessmentField: PDFTextField = form.getTextField(
      FIELD_NAME_PRE_CHECK_NEGATIVE_ASSESMENT,
    );
    negativeAssessmentField.setText(userInput.negativeAssessment);
    negativeAssessmentField.setFontSize(12);

    return await pdfDoc.save();
  } catch (err) {
    console.error("Error processing PDF:", err);
    throw err;
  }
};

/* TODO:
  - Update template to accept contact email and department (ressort)
  - Update to accept reasoning for negative outcome
  - Add more error checking around parameters
  - Improve type checking
  - Force the file to download (ready, commented out)
*/

export async function loader({ request }: LoaderFunctionArgs) {
  //const { fileName } = params;
  const url = new URL(request.url);

  const searchParams = Object.fromEntries(url.searchParams.entries());
  const { title = "", negativeAssessment = "", ...answers } = searchParams;

  const positiveRegex = /^(yes|unsure)$/;
  const negativeRegex = /^(no)$/;

  const pdfData: Uint8Array = await createFilledPDF({
    title,
    answers: [
      {
        name: FIELD_NAME_PRE_CHECK_POSITIVE_1,
        checked: positiveRegex.test(answers?.["it-system"]),
      },
      {
        name: FIELD_NAME_PRE_CHECK_POSITIVE_2,
        checked: positiveRegex.test(
          answers?.["verpflichtungen-fuer-beteiligte"],
        ),
      },
      {
        name: FIELD_NAME_PRE_CHECK_POSITIVE_3,
        checked: positiveRegex.test(answers?.["datenaustausch"]),
      },
      {
        name: FIELD_NAME_PRE_CHECK_POSITIVE_4,
        checked: positiveRegex.test(answers?.["kommunikation"]),
      },
      {
        name: FIELD_NAME_PRE_CHECK_POSITIVE_5,
        checked: positiveRegex.test(answers?.["automatisierung"]),
      },
      {
        name: FIELD_NAME_PRE_CHECK_NEGATIVE,
        checked:
          negativeRegex.test(answers?.["it-system"]) &&
          negativeRegex.test(answers?.["verpflichtungen-fuer-beteiligte"]) &&
          negativeRegex.test(answers?.["datenaustausch"]) &&
          negativeRegex.test(answers?.["kommunikation"]) &&
          negativeRegex.test(answers?.["automatisierung"]),
      },
    ],
    negativeAssessment,
  });

  return new Response(pdfData, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      // "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
      // "Content-Length": `${pdfData.byteLength}`,
    },
  });
}
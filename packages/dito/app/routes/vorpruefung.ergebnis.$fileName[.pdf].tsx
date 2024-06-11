import { LoaderFunctionArgs } from "@remix-run/node";
import * as fs from "node:fs";
import * as path from "node:path";
import createFilledPDF, {
  FIELD_NAME_PRE_CHECK_QUESTION_1,
} from "../services/pdf-service";

export async function loader({ params }: LoaderFunctionArgs) {
  const { fileName } = params;
  const filePath = path.resolve("app/resources/dc-pre-check-raw.pdf");
  const fileData = fs.readFileSync(filePath);
  const pdfData: Uint8Array = await createFilledPDF(fileData, {
    policyTitle: fileName, //"Titel des Regelungsvorhabens",
    preCheckAnswers: [
      {
        name: FIELD_NAME_PRE_CHECK_QUESTION_1,
        checked: true,
      },
    ],
  });

  return new Response(pdfData, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}

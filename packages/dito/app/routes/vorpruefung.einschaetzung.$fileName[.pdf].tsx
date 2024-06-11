import { LoaderFunctionArgs } from "@remix-run/node";
import { getAnswersFromCookie } from "cookies.server";
import * as fs from "node:fs";
import * as path from "node:path";
import createFilledPDF, {
  FIELD_NAME_PRE_CHECK_QUESTION_1,
  FIELD_NAME_PRE_CHECK_QUESTION_2,
  FIELD_NAME_PRE_CHECK_QUESTION_3,
  FIELD_NAME_PRE_CHECK_QUESTION_4,
  FIELD_NAME_PRE_CHECK_QUESTION_5,
  FIELD_NAME_PRE_CHECK_QUESTION_6,
} from "../services/pdf-service";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { answers } = await getAnswersFromCookie(request);

  console.log(answers);
  const { fileName } = params;
  const filePath = path.resolve("app/resources/digitalcheck-vorpruefung.pdf");
  const fileData = fs.readFileSync(filePath);
  const pdfData: Uint8Array = await createFilledPDF(fileData, {
    policyTitle: fileName, //"Titel des Regelungsvorhabens",
    preCheckAnswers: [
      {
        name: FIELD_NAME_PRE_CHECK_QUESTION_1,
        checked: answers["it-system"] !== "no",
      },
      {
        name: FIELD_NAME_PRE_CHECK_QUESTION_2,
        checked: answers["verpflichtungen-fuer-beteiligte"] !== "no",
      },
      {
        name: FIELD_NAME_PRE_CHECK_QUESTION_3,
        checked: answers["datenaustausch"] !== "no",
      },
      {
        name: FIELD_NAME_PRE_CHECK_QUESTION_4,
        checked: answers["kommunikation"] !== "no",
      },
      {
        name: FIELD_NAME_PRE_CHECK_QUESTION_5,
        checked: answers["automatisierung"] !== "no",
      },
      {
        name: FIELD_NAME_PRE_CHECK_QUESTION_6,
        checked:
          answers["it-system"] === "no" &&
          answers["verpflichtungen-fuer-beteiligte"] === "no" &&
          answers["datenaustausch"] === "no" &&
          answers["kommunikation"] === "no" &&
          answers["automatisierung"] === "no",
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

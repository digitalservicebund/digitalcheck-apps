import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { gunzipSync, gzipSync } from "node:zlib";
import { ROUTE_RESULT_PDF } from "~/resources/staticRoutes";
import { ENCRYPTION_ALGORITHM, ENCRYPTION_KEY } from "~/utils/constants.server";
import getBaseURL from "~/utils/getBaseURL";
import type { Route } from "./+types/uniq.($encrypted).($iv)";

enum QuestionAbbreviations {
  "it-system" = "a",
  "verpflichtungen-fuer-beteiligte" = "b",
  "datenaustausch" = "c",
  "kommunikation" = "d",
  "automatisierung" = "e",
  "title" = "t",
  "negativeReasoning" = "n",
  "a" = "it-system",
  "b" = "verpflichtungen-fuer-beteiligte",
  "c" = "datenaustausch",
  "d" = "kommunikation",
  "e" = "automatisierung",
  "t" = "title",
  "n" = "negativeReasoning",
}

enum AnswerAbbreviations {
  "yes" = "y",
  "no" = "n",
  "unsure" = "u",
  "y" = "yes",
  "n" = "no",
  "u" = "unsure",
}

type TAbbreviations = {
  [key in keyof typeof QuestionAbbreviations]: FormDataEntryValue;
};

type TUnabbreviations = {
  [key in QuestionAbbreviations]: AnswerAbbreviations;
};

const abbreviate = (response: TAbbreviations) => {
  const responseEntries = Object.entries(response);

  return Object.fromEntries(
    responseEntries.map(([question, answer]) => [
      QuestionAbbreviations[question as QuestionAbbreviations],
      AnswerAbbreviations[answer as AnswerAbbreviations] ?? answer,
    ]),
  ) as TAbbreviations;
};

const unabbreviate = (response: TUnabbreviations) => {
  const responseEntries = Object.entries(response);

  return Object.fromEntries(
    responseEntries.map(([question, answer]) => [
      QuestionAbbreviations[question as QuestionAbbreviations],
      AnswerAbbreviations[answer] ?? answer,
    ]),
  ) as TUnabbreviations;
};

const encrypt = (text: string) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);

  const encrypted =
    cipher.update(text, "utf8", "base64url") + cipher.final("base64url");

  return [encrypted, iv.toString("base64url")];
};

const decrypt = (hash: string, iv: string) => {
  const decipher = createDecipheriv(
    ENCRYPTION_ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(iv, "base64url"),
  );

  const decrypted =
    decipher.update(hash, "base64url", "utf8") + decipher.final("utf8");

  return decrypted;
};

const zip = (text: string) => {
  const zipped = gzipSync(text);
  const zippedString = zipped.toString("base64");

  return zippedString;
};

const unzip = (zipped: string) => {
  const unzipped = gunzipSync(Buffer.from(zipped, "base64"));
  const unzippedText = unzipped.toString();
  return unzippedText;
};

export async function loader({ params, request }: Route.LoaderArgs) {
  const { encrypted, iv } = params;

  if (encrypted && iv) {
    const decrypted = decrypt(encrypted, iv);
    const unzipped = unzip(decrypted);
    const parsed = JSON.parse(unzipped) as TUnabbreviations;
    const unabbreviated = unabbreviate(parsed);
    const dataEntries = Object.entries(unabbreviated);

    const formData = new URLSearchParams();

    dataEntries.forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch(
        `${getBaseURL(request)}${ROUTE_RESULT_PDF.url}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(
          `Response status: ${response.status} + ${response.statusText}`,
        );
      }

      const pdfData = await response.blob();

      return new Response(pdfData, {
        status: 200,
        headers: response.headers,
      });
    } catch (error) {
      console.error("Error processing PDF:", error);
      throw error;
    }
  }

  return null;
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Must be a POST request", { status: 405 });
  }

  const formData = await request.formData();
  const combinedResponse = Object.fromEntries(formData) as TAbbreviations;
  const abbreviated = abbreviate(combinedResponse);
  const stringified = JSON.stringify(abbreviated);
  const zipped = zip(stringified);
  const [encrypted, iv] = encrypt(zipped);

  return {
    url: `${getBaseURL(request)}/uniq/${encrypted}/${iv}`,
  };
}

import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { gunzipSync, gzipSync } from "node:zlib";
import { ROUTE_RESULT_PDF } from "resources/staticRoutes";
import { ENCRYPTION_ALGORITHM, ENCRYPTION_KEY } from "utils/constants.server";
import { getAnswersFromCookie } from "utils/cookies.server";
import unleash from "utils/featureFlags.server";

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

type TAbbreviations = {
  [key in keyof typeof QuestionAbbreviations]: FormDataEntryValue;
};

type TUnabbreviations = {
  [key in QuestionAbbreviations]: AnswerAbbreviations;
};

enum AnswerAbbreviations {
  "yes" = "y",
  "no" = "n",
  "unsure" = "u",
  "y" = "yes",
  "n" = "no",
  "u" = "unsure",
}

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

export async function loader({ params, request }: LoaderFunctionArgs) {
  const quicksendNkrFlag = unleash.isEnabled("digitalcheck.quicksend-nkr");

  if (!quicksendNkrFlag) {
    return json({ quicksendNkrFlag });
  }

  const BASE_URL = new URL(request.url).origin;
  const { encrypted, iv } = params;

  if (encrypted && iv) {
    const decrypted = decrypt(encrypted, iv);
    const unzipped = unzip(decrypted);
    const parsed = JSON.parse(unzipped);
    const unabbreviated = unabbreviate(parsed);
    const dataEntries = Object.entries(unabbreviated);

    const formData = new FormData();
    dataEntries.forEach((dataEntry) =>
      formData.append(dataEntry[0], dataEntry[1]),
    );

    try {
      const response = await fetch(`${BASE_URL}${ROUTE_RESULT_PDF.url}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.log({ response, formData });

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

export async function action({ request }: ActionFunctionArgs) {
  const quicksendNkrFlag = unleash.isEnabled("digitalcheck.quicksend-nkr");

  if (!quicksendNkrFlag) {
    return json({ quicksendNkrFlag, url: "" });
  }

  if (request.method !== "POST") {
    throw new Response("Must be a POST request", { status: 405 });
  }

  const BASE_URL = new URL(request.url).origin;
  const { answers } = await getAnswersFromCookie(request);
  const formData = await request.formData();
  const { title, negativeReasoning } = Object.fromEntries(formData);

  const combinedResponse = {
    title,
    negativeReasoning,
    ...answers,
  } as TAbbreviations;

  const abbreviated = abbreviate(combinedResponse);
  const stringified = JSON.stringify(abbreviated);
  const zipped = zip(stringified);
  const [encrypted, iv] = encrypt(zipped);

  return json({
    url: `${BASE_URL}/uniq/${encrypted}/${iv}`,
  });
}

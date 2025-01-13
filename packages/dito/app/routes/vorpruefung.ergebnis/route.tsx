import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";

import { validationError } from "@rvf/remix";
import { preCheck } from "resources/content";
import { ROUTE_PRECHECK, ROUTE_RESULT } from "resources/staticRoutes";
import type { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import {
  getAnswersFromCookie,
  getHeaderFromCookie,
} from "utils/cookies.server";
import prependMetaTitle from "utils/metaTitle";
import trackCustomEvent from "utils/trackCustomEvent.server";
import { PreCheckResult, ResultType } from "./PreCheckResult";
import resolveResultContent from "./resolveResultContent";
import ResultPage from "./ResultPage";
import getResultValidatorForAnswers from "./resultValidation";

const { questions } = preCheck;
const { emailTemplate } = preCheck.result.form;

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_RESULT.title, matches);
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = await getAnswersFromCookie(request);
  const { answers } = cookie;

  // redirect to precheck if not all answers are present
  if (Object.keys(answers).length !== questions.length) {
    return redirect(ROUTE_PRECHECK.url);
  }

  const result: PreCheckResult = getResult(answers);

  void trackCustomEvent(request, {
    name: "Vorprüfung Resultat",
    props: { result: result.digital },
  });
  void trackCustomEvent(request, {
    name: "Vorprüfung Resultat Interoperability",
    props: { result: result.interoperability },
  });

  // Set cookie to store user has viewed result
  cookie.hasViewedResult = true;

  return json(
    {
      result,
      answers,
    },
    await getHeaderFromCookie(cookie),
  );
}

function getResult(answers: PreCheckAnswers): PreCheckResult {
  const digital = getResultForRelevantAnswers(answers, false);
  const interoperability =
    digital === ResultType.POSITIVE
      ? getResultForRelevantAnswers(answers, true)
      : ResultType.NEGATIVE;
  return { digital, interoperability };
}

function getResultForRelevantAnswers(
  answers: PreCheckAnswers,
  interoperability: boolean,
) {
  const relevantAnswers = questions
    .filter((question) => !!question.interoperability === interoperability)
    .map((question) => answers[question.id]);
  if (relevantAnswers.includes("yes")) {
    return ResultType.POSITIVE;
  }
  if (relevantAnswers.includes("unsure")) {
    return ResultType.UNSURE;
  }
  return ResultType.NEGATIVE;
}

function buildEmailBody(
  answers: PreCheckAnswers,
  result: PreCheckResult,
  negativeReasoning?: string,
) {
  const resultContent = resolveResultContent(answers, result);

  let resultText: string = `${resultContent.title}\n\n\n`;

  resultContent.reasoningList
    .filter((reasoning) => reasoning.reasons.length !== 0)
    .forEach(({ intro, reasons }) => {
      resultText += `➤ ${intro} \n\n`;
      reasons
        .sort((reason) => (reason.answer === "yes" ? -1 : 1))
        .forEach((reason) => {
          resultText += reason.answer === "yes" ? "+" : "";
          resultText += reason.answer === "no" ? "-" : "";
          resultText += reason.answer === "unsure" ? "?" : "";
          resultText += ` ${reason.text}\n`;
          resultText += reason.hint ? `${reason.hint}\n` : "";
        });
      resultText += "\n\n";
    });

  resultText = resultText.replaceAll("**", "");
  resultText += negativeReasoning
    ? `${preCheck.result.form.reasonLabel}:\n\n${negativeReasoning}\n\n`
    : "";

  return `${emailTemplate.bodyBefore}\n${resultText}\n\n${emailTemplate.bodyAfter}`;
}

function resolveRecipients(result: PreCheckResult) {
  const additionalRecipient =
    result.interoperability !== ResultType.NEGATIVE
      ? `,${emailTemplate.toDC}`
      : "";
  return `${emailTemplate.toNkr}${additionalRecipient}`;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { title, negativeReasoning, ...answers } = Object.fromEntries(formData);

  // server side form validation in case the user has JavaScript disabled
  const preCheckAnswers = answers as PreCheckAnswers;
  const validator = getResultValidatorForAnswers(preCheckAnswers);
  const validationResult = await validator.validate({
    title,
    negativeReasoning,
  });
  if (validationResult.error) {
    return validationError(
      validationResult.error,
      validationResult.submittedData,
    );
  }

  const result = getResult(preCheckAnswers);
  const subject = `${emailTemplate.subject}: „${formData.get("title") as string}“`;
  const email = formData.get("email");
  const cc = email ? `&cc=${email as string}` : "";
  const recipients = resolveRecipients(result);
  const body = buildEmailBody(
    preCheckAnswers,
    result,
    formData.get("negativeReasoning") as string,
  );
  const uri = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${cc}`;
  return redirect(uri);
}

export default function Result() {
  const { result, answers } = useLoaderData<typeof loader>();

  return <ResultPage answers={answers} result={result} />;
}

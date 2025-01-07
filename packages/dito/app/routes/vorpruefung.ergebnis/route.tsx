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
import resolveResultContent from "./resolveResultContent.ts";
import ResultPage from "./ResultPage.tsx";
import getResultValidatorForAnswers from "./resultValidation";
import { ResultType, TResult } from "./TResult.tsx";

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

  const result: TResult = getResult(answers);

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

function getResult(answers: PreCheckAnswers): TResult {
  const digital = getResultForRelevantAnswers(answers);
  let interoperability = ResultType.NEGATIVE;
  if (digital === ResultType.POSITIVE) {
    interoperability = getResultForRelevantAnswers(answers, true);
  }
  return { digital, interoperability };
}

function getResultForRelevantAnswers(
  answers: PreCheckAnswers,
  interoperability: boolean = false,
) {
  let result = ResultType.NEGATIVE;

  const relevantAnswers = getRelevantAnswers(answers, interoperability);

  if (Object.values(relevantAnswers).find((a) => a === "yes")) {
    result = ResultType.POSITIVE;
  } else if (Object.values(relevantAnswers).find((a) => a === "unsure")) {
    result = ResultType.UNSURE;
  }
  return result;
}

function getRelevantAnswers(
  answers: PreCheckAnswers,
  interoperability: boolean,
) {
  const relevantAnswers: PreCheckAnswers = {};
  for (const [k, v] of Object.entries(answers)) {
    const question = questions.find((question) => question.id === k);
    const questionInteroperability = question?.interoperability || false;
    if (questionInteroperability === interoperability) {
      relevantAnswers[k] = v;
    }
  }
  return relevantAnswers;
}

function buildEmailBody(
  answers: PreCheckAnswers,
  result: TResult,
  negativeReasoning?: string,
) {
  const resultContent = resolveResultContent(answers, result);

  let resultText: string = resultContent.title + "\n\n\n";

  resultContent.reasoningList
    .filter((reasoning) => reasoning.reasons.length !== 0)
    .forEach(({ intro, reasons }) => {
      resultText += intro.replaceAll("**", "") + "\n\n";
      reasons
        .sort((reason) => (reason.answer === "yes" ? -1 : 1))
        .forEach((reason) => {
          resultText += "- " + reason.text + "\n";
        });
      resultText += "\n\n";
    });

  resultText += negativeReasoning
    ? preCheck.result.form.reasonLabel + ":\n\n" + negativeReasoning + "\n\n"
    : "";

  return `${emailTemplate.bodyBefore}\n${resultText}\n\n\n${emailTemplate.bodyAfter}`;
}

function resolveRecipients(result: TResult) {
  const additionalRecipient =
    result.interoperability !== ResultType.NEGATIVE
      ? `,${emailTemplate.toDC}`
      : "";
  return `${emailTemplate.toNkr}${additionalRecipient}`;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, title, negativeReasoning, ...answers } =
    Object.fromEntries(formData);

  // server side form validation in case the user has JavaScript disabled
  const preCheckAnswers = answers as PreCheckAnswers;
  const validator = getResultValidatorForAnswers(preCheckAnswers);
  const result = await validator.validate({ title, negativeReasoning });
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  if (_action === "email") {
    const result = getResult(preCheckAnswers);
    const subject = `${emailTemplate.subject}: „${formData.get("title") as string}“`;
    const email = formData.get("email");
    const cc = email ? `&cc=${email as string}` : "";
    const negativeReasoning = formData.get("negativeReasoning") as string;
    const recipients = resolveRecipients(result);
    const mailToLink = encodeURI(
      `mailto:${recipients}?subject=${subject}&body=${buildEmailBody(preCheckAnswers, result, negativeReasoning)}${cc}`,
    );
    return redirect(mailToLink);
  }
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw new Response("Unknown action", { status: 400 });
}

export default function Result() {
  const { result, answers } = useLoaderData<typeof loader>();

  return <ResultPage answers={answers} result={result} />;
}

import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  MetaFunction,
  redirectDocument,
  useLoaderData,
} from "@remix-run/react";

import { validationError } from "@rvf/remix";
import { preCheck } from "resources/content";
import { ROUTE_PRECHECK, ROUTE_RESULT } from "resources/staticRoutes";
import type { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import {
  getAnswersFromCookie,
  getHeaderFromCookie,
} from "utils/cookies.server";
import getBaseURL from "utils/getBaseURL";
import prependMetaTitle from "utils/metaTitle";
import trackCustomEvent from "utils/trackCustomEvent.server";
import ResultNegative from "./ResultNegative";
import ResultPositive from "./ResultPositive";
import ResultUnsure from "./ResultUnsure";
import getResultValidatorForAnswers from "./resultValidation";
import { ResultType, TResult } from "./TResult.tsx";

const { questions } = preCheck;

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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, title, negativeReasoning, ...answers } =
    Object.fromEntries(formData);

  // server side form validation in case the user has JavaScript disabled
  const validator = getResultValidatorForAnswers(answers as PreCheckAnswers);
  const result = await validator.validate({ title, negativeReasoning });
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const uniqueResponse = await fetch(`${getBaseURL(request)}/uniq`, {
    method: "POST",
    body: formData,
  });
  const uniqueUrl = (await uniqueResponse.json()).url as string;
  if (_action === "email") {
    const emailTemplate = preCheck.result.form.emailTemplate;
    const subject = `${emailTemplate.subject}: „${formData.get("title") as string}“`;
    const body = `${emailTemplate.bodyBefore}\n\n${uniqueUrl}\n\n${emailTemplate.bodyAfter}`;
    const mailToLink = encodeURI(
      `mailto:${emailTemplate.to}?subject=${subject}&body=${body}`,
    );
    return redirect(mailToLink);
  } else if (_action === "download") {
    // we need to force a native navigation to trigger the download here
    return redirectDocument(uniqueUrl);
  }
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw new Response("Unknown action", { status: 400 });
}

export default function Result() {
  const { result, answers } = useLoaderData<typeof loader>();

  if (result.digital === ResultType.POSITIVE) {
    return <ResultPositive answers={answers} result={result} />;
  }

  // Some answers are unsure
  if (result.digital === ResultType.UNSURE) {
    return <ResultUnsure answers={answers} />;
  }

  // All answers are negative
  return <ResultNegative answers={answers} result={result} />;
}

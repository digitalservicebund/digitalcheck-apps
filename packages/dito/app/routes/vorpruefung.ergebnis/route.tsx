import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";

import { preCheck } from "resources/content";
import { ROUTE_PRECHECK, ROUTE_RESULT } from "resources/staticRoutes";
import type { Answers, Option } from "routes/vorpruefung.$questionId/route";
import {
  getAnswersFromCookie,
  getHeaderFromCookie,
} from "utils/cookies.server";
import prependMetaTitle from "utils/metaTitle";
import trackCustomEvent from "utils/trackCustomEvent.server";
import ResultNegative from "./ResultNegative";
import ResultPositive from "./ResultPositive";
import ResultUnsure from "./ResultUnsure";

const { questions } = preCheck;

export const meta: MetaFunction = ({ matches }) => {
  return [prependMetaTitle(ROUTE_RESULT.title, matches)];
};

const getQuestionIDsOfOption = (answers: Answers, option: Option["value"]) =>
  Object.keys(answers).filter((key) => answers[key] === option);

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = await getAnswersFromCookie(request);
  const { answers } = cookie;
  // redirect to precheck if not all answers are present
  if (Object.keys(answers).length !== questions.length) {
    return redirect(ROUTE_PRECHECK.url);
  }
  const positiveQuestions = getQuestionIDsOfOption(answers, "yes");
  const unsureQuestions = getQuestionIDsOfOption(answers, "unsure");
  const negativeQuestions = getQuestionIDsOfOption(answers, "no");

  // Track result
  let result = "Negativ";
  if (positiveQuestions.length > 0) {
    result = "Positiv";
  } else if (unsureQuestions.length > 0) {
    result = "Unsicher";
  }
  void trackCustomEvent(request, {
    name: "Vorprüfung Resultat",
    props: { result },
  });

  // Set cookie to store user has viewed result
  cookie.hasViewedResult = true;
  return json(
    { positiveQuestions, unsureQuestions, negativeQuestions },
    await getHeaderFromCookie(cookie),
  );
}

export default function Result() {
  const { positiveQuestions, unsureQuestions, negativeQuestions } =
    useLoaderData<typeof loader>();

  // We have at least one positive answer
  if (positiveQuestions.length > 0) {
    return <ResultPositive positiveQuestions={positiveQuestions} />;
  }

  // Some answers are unsure
  if (unsureQuestions.length > 0) {
    return (
      <ResultUnsure
        unsureQuestions={unsureQuestions}
        negativeQuestions={negativeQuestions}
      />
    );
  }

  // All answers are negative
  return <ResultNegative negativeQuestions={negativeQuestions} />;
}

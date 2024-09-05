import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";

import { preCheck } from "resources/content";
import { ROUTE_PRECHECK, ROUTE_RESULT } from "resources/staticRoutes";
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
  return prependMetaTitle(ROUTE_RESULT.title, matches);
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = await getAnswersFromCookie(request);
  const { answers } = cookie;

  // redirect to precheck if not all answers are present
  if (Object.keys(answers).length !== questions.length) {
    return redirect(ROUTE_PRECHECK.url);
  }

  // Track result
  let result = "Negativ";
  if (Object.values(answers).find((a) => a === "yes")) {
    result = "Positiv";
  } else if (Object.values(answers).find((a) => a === "unsure")) {
    result = "Unsicher";
  }

  void trackCustomEvent(request, {
    name: "Vorprüfung Resultat",
    props: { result },
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

export default function Result() {
  const { result, answers } = useLoaderData<typeof loader>();

  // We have at least one positive answer
  if (result === "Positiv") {
    return <ResultPositive answers={answers} />;
  }

  // Some answers are unsure
  if (result === "Unsicher") {
    return <ResultUnsure answers={answers} />;
  }

  // All answers are negative
  return <ResultNegative answers={answers} />;
}

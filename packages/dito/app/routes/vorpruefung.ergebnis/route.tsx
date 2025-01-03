import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
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

import { preCheck } from "resources/content";
import type { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import { PreCheckResult, ResultType } from "./PreCheckResult";

const { questions } = preCheck;

export default function getResultForAnswers(
  answers: PreCheckAnswers,
): PreCheckResult {
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

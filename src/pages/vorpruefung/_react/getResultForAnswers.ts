import { preCheck } from "@/resources/content/vorpruefung";
import type { PreCheckAnswerSchema } from "./preCheckDataSchema";
import type { PreCheckResult } from "./PreCheckResult";
import { ResultType } from "./PreCheckResult";

const { questions } = preCheck;

export function getResultForAnswers(
  answers: PreCheckAnswerSchema[],
): PreCheckResult {
  const digital = getResultForRelevantAnswers(answers, false);
  const interoperability =
    digital === ResultType.POSITIVE
      ? getResultForRelevantAnswers(answers, true)
      : ResultType.NEGATIVE;
  const euBezug = getResultForRelevantAnswers(answers, true);
  return { digital, interoperability, euBezug };
}

export function getResultForRelevantAnswers(
  answers: PreCheckAnswerSchema[],
  interoperability: boolean,
) {
  const relevantAnswers = new Set(
    questions
      .filter((question) => !!question.interoperability === interoperability)
      .map(
        (question) =>
          answers.find(({ questionId }) => questionId === question.id)?.answer,
      ),
  );

  if (relevantAnswers.has("yes")) {
    return ResultType.POSITIVE;
  }
  if (relevantAnswers.has("unsure")) {
    return ResultType.UNSURE;
  }
  return ResultType.NEGATIVE;
}

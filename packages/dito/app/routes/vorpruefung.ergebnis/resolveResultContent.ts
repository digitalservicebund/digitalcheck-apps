import { preCheck } from "../../resources/content.ts";
import {
  PreCheckAnswerOption,
  PreCheckAnswers,
} from "../vorpruefung.$questionId/route.tsx";
import { PreCheckResult, ResultType } from "./PreCheckResult.tsx";

const { questions } = preCheck;

export type ResultContent = {
  title: string;
  reasoningList: Reasoning[];
};

export type Reasoning = {
  intro: string;
  reasons: Reason[];
};

export type Reason = {
  answer: PreCheckAnswerOption["value"];
  text: string;
  hint?: string;
};

const title = {
  interoperability: {
    [ResultType.POSITIVE]: preCheck.result.interoperability.positive.title,
    [ResultType.NEGATIVE]: preCheck.result.interoperability.negative.title,
    [ResultType.UNSURE]: preCheck.result.interoperability.unsure.title,
  },
  digital: {
    [ResultType.POSITIVE]: preCheck.result.positive.title,
    [ResultType.NEGATIVE]: preCheck.result.negative.title,
    [ResultType.UNSURE]: preCheck.result.unsure.title,
  },
};

function getResultTitle(result: PreCheckResult) {
  return (
    title.digital[result.digital] +
    (result.digital !== ResultType.UNSURE
      ? title.interoperability[result.interoperability]
      : "")
  );
}

function getRelevantReasons(
  answers: PreCheckAnswers,
  result: PreCheckResult,
  interoperability: boolean,
  sure: boolean,
): Reason[] {
  return questions
    .filter(
      (question) =>
        !!question.interoperability === interoperability &&
        (answers[question.id] !== "unsure") === sure,
    )
    .map((question) => {
      const answer = answers[question.id];
      let reasonText;
      let reasonHint;

      switch (answer) {
        case "yes":
          reasonText = question.positiveResult;
          if (
            !!question.interoperability &&
            !!question.resultHint &&
            result.digital !== ResultType.POSITIVE
          ) {
            reasonHint = question.resultHint.positiveResult;
          }
          break;
        case "no":
          reasonText = question.negativeResult;
          reasonHint = question.resultHint?.negativeResult;
          break;
        case "unsure":
          reasonText = question.positiveResult;
          reasonHint = question.resultHint?.unsureResult;
          break;
      }

      return {
        answer: answer,
        text: reasonText,
        hint: reasonHint,
      };
    });
}

export default function resolveResultContent(
  answers: PreCheckAnswers,
  result: PreCheckResult,
): ResultContent {
  return {
    title: getResultTitle(result),
    reasoningList: [
      {
        intro: preCheck.result.reasoningIntro.digital.sure,
        reasons: getRelevantReasons(answers, result, false, true),
      },
      {
        intro: preCheck.result.reasoningIntro.digital.unsure,
        reasons: getRelevantReasons(answers, result, false, false),
      },
      {
        intro: preCheck.result.reasoningIntro.interoperability.sure,
        reasons: getRelevantReasons(answers, result, true, true),
      },
      {
        intro: preCheck.result.reasoningIntro.interoperability.unsure,
        reasons: getRelevantReasons(answers, result, true, false),
      },
    ],
  };
}

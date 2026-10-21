import type { PreCheckAnswerOption } from "@/pages/assistent/vorpruefung/_react/question";
import { preCheck } from "@/resources/content/vorpruefung";
import { preCheckResult } from "@/resources/content/vorpruefung-ergebnis";
import type { PreCheckAnswerSchema } from "./preCheckDataSchema";
import type { PreCheckResult } from "./PreCheckResult";
import { ResultType } from "./PreCheckResult";

const { questions } = preCheck;

export type ResultContent = {
  title: string;
  infoboxContent?: {
    title: string;
    text: string;
  };
  inlineNoticeContent?: {
    title: string;
    text: string;
  };
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
  tooltip?: string;
};

const title = {
  interoperability: {
    [ResultType.POSITIVE]: preCheckResult.interoperability.positive.title,
    [ResultType.NEGATIVE]: preCheckResult.interoperability.negative.title,
    [ResultType.UNSURE]: preCheckResult.interoperability.unsure.title,
  },
  digital: {
    [ResultType.POSITIVE]: preCheckResult.positive.title,
    [ResultType.NEGATIVE]: preCheckResult.negative.title,
    [ResultType.UNSURE]: preCheckResult.unsure.title,
  },
};

function getResultTitle(result?: PreCheckResult) {
  if (!result) return "";

  if (
    result.digital === ResultType.NEGATIVE &&
    result.euBezug === ResultType.POSITIVE
  ) {
    return (
      title.digital[result.digital] + title.interoperability[ResultType.UNSURE]
    );
  }

  return (
    title.digital[result.digital] +
    (result.digital === ResultType.UNSURE
      ? ""
      : title.interoperability[result.interoperability])
  );
}

function getRelevantReasons(
  answers: PreCheckAnswerSchema[],
  result: PreCheckResult | undefined,
  interoperability: boolean,
  sure: boolean,
): Reason[] {
  return questions
    .filter((question) => {
      const answer = answers.find(
        ({ questionId }) => questionId === question.id,
      )?.answer;
      if (!answer) return false;

      if (interoperability !== !!question.interoperability) return false;

      return (answer !== "unsure") === sure;
    })
    .map((question) => {
      const answer = answers.find(
        ({ questionId }) => questionId === question.id,
      )!.answer as PreCheckAnswerOption["value"];
      let reasonText;
      let reasonHint;
      let reasonTooltip;

      switch (answer) {
        case "yes":
          reasonText = question.positiveResult;
          if (
            !!question.interoperability &&
            !!question.resultHint &&
            result?.digital !== ResultType.POSITIVE
          ) {
            reasonHint = question.resultHint.positiveResult;
            reasonTooltip = question.resultTooltip?.positiveResult;
          }
          break;
        case "no":
          reasonText = question.negativeResult;
          reasonHint = question.resultHint?.negativeResult;
          reasonTooltip = question.resultTooltip?.negativeResult;
          break;
        case "unsure":
          reasonText = question.positiveResult;
          reasonHint = question.resultHint?.unsureResult;
          reasonTooltip = question.resultTooltip?.unsureResult;
          break;
      }

      return {
        answer: answer,
        text: reasonText,
        hint: reasonHint,
        tooltip: reasonTooltip,
      };
    });
}

function getInfoboxContentForResult(
  result?: PreCheckResult,
): { title: string; text: string } | null {
  const infoboxTitle = preCheckResult.infoBox.title;
  let markdownText: string | null = null;

  const isDigitalPositive = result?.digital === ResultType.POSITIVE;
  const isInteroperabilityPositive =
    result?.interoperability === ResultType.POSITIVE;

  if (isDigitalPositive && isInteroperabilityPositive) {
    markdownText =
      preCheckResult.infoBox.contentDigitalBezugAndInteroperability;
  } else if (isDigitalPositive) {
    markdownText = preCheckResult.infoBox.contentDigitalBezug;
  } else if (isInteroperabilityPositive) {
    markdownText = preCheckResult.infoBox.contentInteroperability;
  }

  if (markdownText) {
    return {
      title: infoboxTitle,
      text: markdownText,
    };
  } else {
    return null;
  }
}

function getInlineNoticeContentForResult(result?: PreCheckResult) {
  const isDigitalNegative = result?.digital === ResultType.NEGATIVE;
  const isEuBezugPositive = result?.euBezug === ResultType.POSITIVE;

  if (isDigitalNegative && isEuBezugPositive)
    return {
      title: preCheckResult.inlineNotice.title,
      text: preCheckResult.inlineNotice.content,
    };
}

export default function getContentForResult(
  answers: PreCheckAnswerSchema[],
  result?: PreCheckResult,
): ResultContent {
  return {
    title: getResultTitle(result),
    reasoningList: [
      {
        intro: preCheckResult.reasoningIntro.digital.sure,
        reasons: getRelevantReasons(answers, result, false, true),
      },
      {
        intro: preCheckResult.reasoningIntro.digital.unsure,
        reasons: getRelevantReasons(answers, result, false, false),
      },
      {
        intro: preCheckResult.reasoningIntro.interoperability.sure,
        reasons: getRelevantReasons(answers, result, true, true),
      },
      {
        intro: preCheckResult.reasoningIntro.interoperability.unsure,
        reasons: getRelevantReasons(answers, result, true, false),
      },
    ],
    infoboxContent: getInfoboxContentForResult(result) || undefined,
    inlineNoticeContent: getInlineNoticeContentForResult(result),
  };
}

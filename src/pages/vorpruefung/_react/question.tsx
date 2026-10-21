import { useEffect, useState } from "react";

import InlineNotice from "@/components/InlineNotice";
import RadioGroup from "@/components/RadioGroup";
import RichText from "@/components/RichText";
import { vorpruefung_ergebnis } from "@/config/routes";
import { preCheck } from "@/resources/content/vorpruefung";
import { answerOptions, type Answer } from "@/wizard/vorpruefungSchema";
import { usePreCheckData, useSyncedForm } from "./preCheckDataHook";
import type { PreCheckAnswerSchema } from "./preCheckDataSchema";
import { answerSchema } from "./preCheckDataSchema";
import { addOrUpdateAnswer } from "./preCheckDataService";

// data fetching moved to @/src/pages/vorpruefung/

const { questions } = preCheck;

export type TQuestion = {
  id: string;
  title: string;
  positiveResult: string;
  negativeResult: string;
  resultHint?: {
    positiveResult?: string;
    negativeResult?: string;
    unsureResult?: string;
  };
  resultTooltip?: {
    positiveResult?: string;
    negativeResult?: string;
    unsureResult?: string;
  };
  path: string;
  accordion?: {
    title: string;
    text: string;
  };
  interoperability?: boolean;
};

export type PreCheckAnswerOption = {
  value: Answer;
  label: string;
};

// Only the form: heading, text and buttons are rendered by _QuestionPage.astro.
// The "Weiter" button sits outside the form and submits it via the form id.
export function PreCheckQuestion({
  questionIdx,
  question,
  formId,
  labelledBy,
}: Readonly<{
  questionIdx: number;
  question: TQuestion;
  formId: string;
  labelledBy: string;
}>) {
  const [hasAnswerConflict, setHasAnswerConflict] = useState(false);

  const { answerForQuestionId, answers, firstUnansweredQuestionIndex } =
    usePreCheckData();
  const storedAnswer = answerForQuestionId(question.id);
  const nextLink =
    questions[questionIdx + 1]?.path ?? vorpruefung_ergebnis.path;

  const form = useSyncedForm({
    // set via RVF, which also links the inputs to this id
    id: formId,
    schema: answerSchema,
    defaultValues: {
      questionId: question.id,
      answer: "",
    },
    storedData: storedAnswer,
    initialValidate: true,
    handleSubmit: (data: PreCheckAnswerSchema) => {
      addOrUpdateAnswer(data);
      globalThis.location.href = nextLink;
    },
  });

  // if the user accesses a question where they haven't answered the previous questions, redirect them to the first unanswered question
  useEffect(() => {
    if (
      firstUnansweredQuestionIndex !== null &&
      questionIdx > firstUnansweredQuestionIndex
    ) {
      globalThis.location.href = questions[firstUnansweredQuestionIndex].path;
    }
  }, [firstUnansweredQuestionIndex, questionIdx]);

  useEffect(() => {
    if (question.id !== "eu-bezug") return;

    const checkHasAnswerConflict = (currentAnswer?: string) => {
      const allAnswersNo = answers
        .filter(({ questionId }) => questionId !== "eu-bezug")
        .every(({ answer }) => answer === "no");

      setHasAnswerConflict(
        allAnswersNo && (currentAnswer ?? storedAnswer?.answer) === "yes",
      );
    };

    const unsubscribe = form.subscribe.value("answer", checkHasAnswerConflict);
    checkHasAnswerConflict();

    return () => unsubscribe();
  }, [question.id, answers, storedAnswer, form]);

  return (
    <form {...form.getFormProps()} className="space-y-40">
      <input {...form.getHiddenInputProps("questionId")} />
      <RadioGroup
        scope={form.scope("answer")}
        options={answerOptions}
        aria-labelledby={labelledBy}
      />
      {hasAnswerConflict && (
        <InlineNotice
          className="[&_p]:mt-24"
          look="warning"
          heading={preCheck.answerConflictHint.euBezugHint.title}
        >
          <RichText
            markdown={preCheck.answerConflictHint.euBezugHint.content}
          />
        </InlineNotice>
      )}
    </form>
  );
}

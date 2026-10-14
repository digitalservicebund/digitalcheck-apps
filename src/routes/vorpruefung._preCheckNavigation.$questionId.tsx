import { useEffect, useState } from "react";

import Button, { LinkButton } from "@/components/Button.tsx";
import ButtonContainer from "@/components/ButtonContainer";
import DetailsSummary from "@/components/DetailsSummary";
import Heading from "@/components/Heading";
import InlineNotice from "@/components/InlineNotice";
import RadioGroup from "@/components/RadioGroup";
import RichText from "@/components/RichText";
import { vorpruefung } from "@/config/routes";
import { general } from "@/resources/content/shared/general";
import { preCheck } from "@/resources/content/vorpruefung";
import { usePreCheckData, useSyncedForm } from "./vorpruefung/preCheckDataHook";
import type { PreCheckAnswerSchema } from "./vorpruefung/preCheckDataSchema";
import { answerSchema } from "./vorpruefung/preCheckDataSchema";
import { addOrUpdateAnswer } from "./vorpruefung/preCheckDataService";

// data fetching moved to @/src/pages/vorpruefung/

const { questions, answerOptions, nextButton } = preCheck;

export type TQuestion = {
  id: string;
  title: string;
  question: string;
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
  text: string;
  path: string;
  prevLink: string;
  nextLink: string;
  hint?: {
    title: string;
    text: string;
  };
  accordion?: {
    title: string;
    text: string;
  };
  interoperability?: boolean;
};

export type PreCheckAnswerOption = {
  value: "yes" | "no" | "unsure";
  label: string;
};

export function PreCheckQuestion({
  questionIdx,
  question,
}: Readonly<{
  questionIdx: number;
  question: TQuestion;
}>) {
  const [hasAnswerConflict, setHasAnswerConflict] = useState(false);

  const { answerForQuestionId, answers, firstUnansweredQuestionIndex } =
    usePreCheckData();
  const storedAnswer = answerForQuestionId(question.id);
  const nextLink =
    questions.find((q) => q.id === question.id)?.nextLink ?? vorpruefung.path;

  const form = useSyncedForm({
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

  const options: PreCheckAnswerOption[] = Object.entries(answerOptions).map(
    ([value, label]) => ({
      value: value as PreCheckAnswerOption["value"],
      label,
    }),
  );

  const questionLabelId = `question${questionIdx}-label`;

  return (
    <form {...form.getFormProps()} className="space-y-40">
      <input {...form.getHiddenInputProps("questionId")} />
      <section className="space-y-32">
        <div className="space-y-16">
          <Heading
            text={question.question}
            tagName="h1"
            look="kern-heading-large"
            id={questionLabelId}
          />
          <div className="sr-only">
            Frage {questionIdx + 1} von {questions.length}
          </div>
          <div>
            <RichText markdown={question.text} />
          </div>
          {question.hint && (
            <DetailsSummary title={question.hint.title}>
              <RichText markdown={question.hint.text} />
            </DetailsSummary>
          )}
        </div>
        <RadioGroup
          scope={form.scope("answer")}
          options={options}
          aria-labelledby={questionLabelId}
        />
      </section>
      <div className="space-y-40">
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
        <ButtonContainer>
          <LinkButton
            id={"preCheck-back-button"}
            href={question.prevLink}
            look={"secondary"}
          >
            {general.buttonBack.text}
          </LinkButton>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            id={"preCheck-next-button"}
          >
            {nextButton}
          </Button>
        </ButtonContainer>
      </div>
    </form>
  );
}

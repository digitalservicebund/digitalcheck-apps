import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import Question from "@digitalcheck/shared/components/Question";
import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { MetaFunction, redirect, useLoaderData } from "@remix-run/react";
import { useForm, validationError } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { useEffect, useState } from "react";
import { preCheck, siteMeta } from "resources/content";
import { PATH_PRECHECK } from "resources/staticRoutes";
import {
  getAnswersFromCookie,
  getHeaderFromCookie,
} from "utils/cookies.server";
import { z } from "zod";
import PreCheckNavigation from "./PreCheckNavigation";

const { questions, answerOptions, nextButton } = preCheck;

export const meta: MetaFunction = () => {
  return [{ title: `${preCheck.start.title} — ${siteMeta.title}` }];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { answers } = await getAnswersFromCookie(request);
  const questionIdx = questions.findIndex((q) => q.id === params.questionId);
  // return 404 if the question is not found
  if (questionIdx === -1) {
    throw new Response("Question not found", {
      status: 404,
      statusText: "Not Found",
    });
  }
  // if the user accesses a question where they haven't answered the previous questions, redirect them to the first unanswered question
  const firstUnansweredQuestionIdx = Object.keys(answers).length;
  if (questionIdx > firstUnansweredQuestionIdx) {
    return redirect(questions[firstUnansweredQuestionIdx].url, {
      status: 302,
    });
  }

  return json({ questionIdx, question: questions[questionIdx], answers });
}

const validator = withZod(
  z.object({
    answer: z
      .string({ required_error: "Bitte wählen Sie eine Option aus." })
      .refine(
        (answer) => Object.keys(answerOptions).includes(answer),
        "Bitte wählen Sie eine existierende Option aus.",
      ),
    questionId: z
      .string({ required_error: "Bitte geben Sie eine Frage an." })
      .refine(
        (questionId) => questions.map((q) => q.id).includes(questionId),
        "Bitte wählen Sie eine existierende Frage aus.",
      ),
  }),
);

export async function action({ request }: ActionFunctionArgs) {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error);
  }
  const { questionId, answer } = result.data;

  const cookie = await getAnswersFromCookie(request);
  cookie.answers[questionId] = answer as Option["value"];
  const nextLink =
    questions.find((q) => q.id === questionId)?.nextLink ?? PATH_PRECHECK;

  return redirect(nextLink, await getHeaderFromCookie(cookie));
}

export type TQuestion = {
  id: string;
  title: string;
  question: string;
  positiveResult: string;
  negativeResult: string;
  text?: string;
  url: string;
  prevLink: string;
  nextLink: string;
  hint?: {
    title: string;
    text: string;
  };
};

export type Option = {
  value: "yes" | "no" | "unsure";
  text: string;
};

export type Answers = {
  [x: string]: Option["value"];
};

export default function Index() {
  const { question, answers } = useLoaderData<typeof loader>();
  const existingAnswer = answers?.[question.id];
  const [selectedOption, setSelectedOption] =
    useState<Option["value"]>(existingAnswer);
  const form = useForm({
    validator,
    method: "post",
  });

  useEffect(() => {
    setSelectedOption(existingAnswer);
  }, [existingAnswer, setSelectedOption, question.id]);

  const options: Option[] = Object.entries(answerOptions).map(
    ([value, text]) => ({ value: value as Option["value"], text }),
  );

  return (
    <div className="flex bg-blue-100 pt-32">
      <div className="hidden lg:block flex-none pl-32">
        <PreCheckNavigation question={question} answers={answers ?? {}} />
      </div>
      <section>
        <form {...form.getFormProps()}>
          <input type="hidden" name="questionId" value={question.id} />
          <Question
            paddingBottom="40"
            stack={40}
            heading={{
              text: question.question,
              tagName: "h1",
              look: "ds-heading-02-reg",
            }}
            content={question.text ? { markdown: question.text } : undefined}
            radio={{
              name: "answer",
              options: options,
              selectedValue: selectedOption,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setSelectedOption(e.target.value as Option["value"]),
              error: form.error("answer"),
            }}
          />
          <Container paddingTop="0" paddingBottom="40">
            <ButtonContainer>
              <Button
                id="preCheck-next-button"
                text={nextButton}
                size="large"
                type="submit"
                disabled={form.formState.isSubmitting}
              ></Button>
              <Button
                id="preCheck-back-button"
                text="Zurück"
                href={question.prevLink}
                size="large"
                look="tertiary"
              ></Button>
            </ButtonContainer>
          </Container>
        </form>
        {question.hint && (
          <Container paddingTop="0">
            <InlineNotice
              look="tips"
              title={question.hint.title}
              tagName="h2"
              content={question.hint.text}
            ></InlineNotice>
          </Container>
        )}
        <Container paddingTop="0" additionalClassNames="lg:hidden">
          <PreCheckNavigation question={question} answers={answers ?? {}} />
        </Container>
      </section>
    </div>
  );
}

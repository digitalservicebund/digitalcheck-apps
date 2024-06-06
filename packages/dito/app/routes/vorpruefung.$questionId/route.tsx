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
import { redirect, useFetcher, useLoaderData } from "@remix-run/react";
import { getCookie, userAnswers } from "cookies.server";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { precheck } from "resources/content";
import { NavigationList } from "./NavigationList";

const { questions, answerOptions, nextButton } = precheck;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { answers } = await getCookie(request);
  const questionIdx = questions.findIndex((q) => q.id === params.questionId);
  // if the user accesses a question where they haven't answered the previous questions, redirect them to the first unanswered question
  const firstUnansweredQuestionIdx = Object.keys(answers).length;
  if (questionIdx > firstUnansweredQuestionIdx) {
    return redirect(questions[firstUnansweredQuestionIdx].url, {
      status: 302,
    });
  }

  return json({ question: questions[questionIdx], answers });
}

export async function action({ request }: ActionFunctionArgs) {
  const cookie = await getCookie(request);
  const bodyParams = await request.formData();
  const { questionId, nextLink, answer } = Object.fromEntries(bodyParams);
  if (typeof questionId !== "string" || typeof nextLink !== "string") {
    return redirect("/vorpruefung", { status: 400 });
  }
  cookie.answers[questionId] = answer as Option["value"];

  return redirect(nextLink, {
    headers: {
      "Set-Cookie": await userAnswers.serialize(cookie),
    },
  });
}

export type TQuestion = {
  id: string;
  title: string;
  question: string;
  text: string;
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
  const { question, answers } = useLoaderData<{
    question: TQuestion;
    answers: Answers;
  }>();
  const existingAnswer = answers?.[question.id];
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [selectedOption, setSelectedOption] = useState<
    Option["value"] | undefined
  >(existingAnswer);

  useEffect(() => {
    setSelectedOption(existingAnswer);
    // needed to keep data in sync with the form
    setValue(question.id, existingAnswer);
  }, [question.id, existingAnswer, setValue]);

  const onSubmit = (data: Record<string, string>) => {
    fetcher.submit(
      {
        questionId: question.id,
        nextLink: question.nextLink,
        answer: data[question.id],
      },
      {
        method: "post",
      },
    );
  };

  const options: Option[] = Object.entries(answerOptions).map(
    ([value, text]) => ({ value: value as Option["value"], text }),
  );

  return (
    <div className="flex bg-blue-100">
      <div className="hidden lg:block pt-48">
        <NavigationList question={question} answers={answers} />
      </div>
      <section>
        <fetcher.Form className="pt-48" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" name="questionId" value={question.id} />
          <Question
            paddingBottom="32"
            box={{
              label: {
                text: `Frage ${Object.keys(answers).length + 1} von ${
                  questions.length
                }`,
              },
              heading: {
                text: question.question,
                tagName: "h1",
                look: "ds-heading-02-reg",
              },
              content: {
                markdown: question.text,
              },
            }}
            radio={{
              name: question.id,
              options: options,
              selectedValue: selectedOption,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setSelectedOption(e.target.value as Option["value"]),
              formRegister: register,
              error: errors[question.id],
            }}
          />
          <Container paddingTop="0">
            <ButtonContainer>
              <Button
                id="precheck-back-button"
                text="Zurück"
                href={question.prevLink}
                look="tertiary"
              ></Button>
              <Button
                id="precheck-next-button"
                text={nextButton}
                type={"submit"}
              ></Button>
            </ButtonContainer>
          </Container>
        </fetcher.Form>
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
          <NavigationList question={question} answers={answers} />
        </Container>
      </section>
    </div>
  );
}

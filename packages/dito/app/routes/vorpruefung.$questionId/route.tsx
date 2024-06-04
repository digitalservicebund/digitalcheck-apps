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
import { SideNav } from "./sideNav";
import { Answers, Option, TQuestion } from "./types";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookie = await getCookie(request);
  return json({
    question: precheck.questions.find((q) => q.id === params.questionId),
    answers: cookie.answers,
  });
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

  const options: Option[] = Object.entries(precheck.options).map(
    ([value, text]) => ({ value: value as Option["value"], text }),
  );

  return (
    <div className="flex">
      <SideNav question={question} answers={answers} />
      <section>
        <fetcher.Form className="pt-48" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" name="questionId" value={question.id} />
          <Question
            heading={question.title}
            description={question.text}
            paddingBottom="32"
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
          <Container paddingBottom="0" paddingTop="0">
            <ButtonContainer>
              <Button
                id="precheck-back-button"
                text="Zurück"
                href={question.prevLink}
                look="tertiary"
              ></Button>
              <Button
                id="precheck-next-button"
                text={precheck.nextButton}
                type={"submit"}
              ></Button>
            </ButtonContainer>
          </Container>
        </fetcher.Form>
        {question.hint && (
          <Container>
            <InlineNotice
              look="tips"
              title={question.hint.title}
              tagName="h2"
              content={question.hint.text}
            ></InlineNotice>
          </Container>
        )}
      </section>
    </div>
  );
}

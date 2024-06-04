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
import { userAnswers } from "cookies.server";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { precheck } from "resources/content";
import { SideNav } from "./sideNav";
import { Answers, Option, TQuestion } from "./types";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userAnswers.parse(cookieHeader)) || {};
  return json({
    question: precheck.questions.find(
      (question) => question.id === params.questionId,
    ),
    answers: cookie.answers,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userAnswers.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  const question = precheck.questions.find(
    (q) => q.id === bodyParams.get("questionId"),
  );
  if (!question) return redirect("/vorpruefung");

  cookie.answers = {
    ...cookie.answers,
    [question.id]: bodyParams.get(question.id),
  };

  return redirect(question.nextLink, {
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
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [selectedOption, setSelectedOption] = useState<
    Option["value"] | undefined
  >(answers?.[question.id]);

  useEffect(() => {
    setSelectedOption(answers?.[question.id]);
    // needed to keep data in sync with the form
    setValue(question.id, answers?.[question.id]);
  }, [question.id, answers, setValue]);

  const onSubmit = (data: Record<string, string>) => {
    fetcher.submit(
      {
        questionId: question.id,
        [question.id]: data[question.id],
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

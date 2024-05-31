import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import Question from "@digitalcheck/shared/components/Question";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { UseFormReturn, useForm } from "react-hook-form";
import { precheck } from "resources/content";

type Question = {
  id: string;
  title: string;
  text: string;
  url: string;
  prevLink: string;
  nextLink: string;
  hint?: {
    title: string;
    text: string;
  };
};

export function loader({ params }: LoaderFunctionArgs) {
  return json({
    question: precheck.questions.find(
      (question) => question.id === params.questionId,
    ),
  });
}

export default function Index() {
  const { question } = useLoaderData<{ question: Question }>();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  }: UseFormReturn = useForm();

  const options = [
    {
      value: "yes",
      text: "Ja",
    },
    {
      value: "no",
      text: "Nein",
    },
    {
      value: "not-sure",
      text: "Ich bin unsicher",
    },
  ];

  const onSubmit = () => {
    navigate(question.nextLink);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container paddingBottom="0">
          <Question
            heading={question.title}
            description={question.text}
            radio={{
              name: "option",
              options: options,
              formRegister: register,
              error: errors["option"],
            }}
          />
        </Container>
        <Container paddingBottom="0">
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
      </form>
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
    </>
  );
}

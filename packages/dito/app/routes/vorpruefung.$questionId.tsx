import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import Question from "@digitalcheck/shared/components/Question";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

export default function Index() {
  const { question } = useLoaderData<{ question: Question }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [selectedOption, setSelectedOption] = useState<string | undefined>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const selectedOption = localStorage.getItem(question.id) ?? undefined;
      setSelectedOption(selectedOption);
    }
  }, [question.id]);

  const onSubmit = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(question.id, selectedOption!);
    }
    navigate(question.nextLink);
  };

  return (
    <>
      <form
        key={question.id}
        onSubmit={handleSubmit(onSubmit)}
        className="pt-48"
      >
        <Question
          heading={question.title}
          description={question.text}
          radio={{
            name: question.id,
            options: options,
            selectedValue: selectedOption,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedOption(e.target.value),
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

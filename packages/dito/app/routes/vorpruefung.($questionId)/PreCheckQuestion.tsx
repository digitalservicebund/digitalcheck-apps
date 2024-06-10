import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import Question from "@digitalcheck/shared/components/Question";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { preCheck } from "resources/content";
import type { Answers, Option, TQuestion } from "./route";

const { questions, answerOptions, nextButton } = preCheck;

export default function PreCheckQuestion({
  question,
  answers,
}: {
  question: TQuestion;
  answers: Answers;
}) {
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
    <>
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
              id="preCheck-back-button"
              text="Zurück"
              href={question.prevLink}
              look="tertiary"
            ></Button>
            <Button
              id="preCheck-next-button"
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
    </>
  );
}

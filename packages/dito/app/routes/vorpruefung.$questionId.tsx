import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import Question from "@digitalcheck/shared/components/Question";
import { RadioButtonUncheckedOutlined } from "@digitalservicebund/icons";
import CheckCircleOutlineIcon from "@digitalservicebund/icons/CheckCircleOutline";
import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { userAnswers } from "cookies.server";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { precheck } from "resources/content";

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
  const { question, answers } = useLoaderData<{
    question: Question;
    answers: { [x: string]: string };
  }>();
  const {
    register,
    formState: { errors },
  } = useForm();

  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    answers?.[question.id],
  );

  return (
    <div className="flex">
      <nav className="pt-48 px-16">
        <ul className="space-y-16">
          {precheck.questions.map((q) => {
            const isAnswered = answers[q.id];
            const isSelected = q.id === question.id;
            return (
              <li key={q.id} className="flex">
                {isAnswered ? (
                  <CheckCircleOutlineIcon className="fill-green-600" />
                ) : (
                  <RadioButtonUncheckedOutlined
                    className={isSelected ? "fill-gray-900" : "fill-gray-600"}
                  />
                )}
                <a
                  href={q.url}
                  className={`ml-4${isSelected ? " font-semibold" : !isAnswered ? " text-gray-600" : ""}`}
                >
                  {q.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <section>
        <form
          key={question.id}
          method="post"
          action={`/vorpruefung/${question.id}`}
          className="pt-48"
        >
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
      </section>
    </div>
  );
}

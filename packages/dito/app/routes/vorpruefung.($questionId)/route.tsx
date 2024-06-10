import Container from "@digitalcheck/shared/components/Container";
import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { getAnswersFromCookie, getHeaderFromCookie } from "cookies.server";
import { preCheck } from "resources/content";
import PreCheckNavigation from "./PreCheckNavigation";
import PreCheckQuestion from "./PreCheckQuestion";
import PreCheckStart from "./PreCheckStart";

const { questions } = preCheck;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookie = await getAnswersFromCookie(request);

  // reset cookie if the user accesses the start page
  if (!params.questionId) {
    cookie.answers = {};
    return json({}, await getHeaderFromCookie(cookie));
  }

  // if the user accesses a question where they haven't answered the previous questions, redirect them to the first unanswered question
  const { answers } = cookie;
  const questionIdx = questions.findIndex((q) => q.id === params.questionId);
  const firstUnansweredQuestionIdx = Object.keys(answers).length;
  if (questionIdx > firstUnansweredQuestionIdx) {
    return redirect(questions[firstUnansweredQuestionIdx].url, {
      status: 302,
    });
  }

  return json({ question: questions[questionIdx], answers });
}

export async function action({ request }: ActionFunctionArgs) {
  const cookie = await getAnswersFromCookie(request);
  const bodyParams = await request.formData();
  const { questionId, nextLink, answer } = Object.fromEntries(bodyParams);
  if (typeof questionId !== "string" || typeof nextLink !== "string") {
    return redirect("/vorpruefung", { status: 400 });
  }
  cookie.answers[questionId] = answer as Option["value"];

  return redirect(nextLink, await getHeaderFromCookie(cookie));
}

export type TQuestion = {
  id: string;
  title: string;
  question: string;
  result: string;
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

export default function PreCheck() {
  const { question, answers } = useLoaderData<{
    question: TQuestion | undefined;
    answers: Answers;
  }>();
  return (
    <div className="flex bg-blue-100">
      <div className="hidden lg:block pt-48 flex-none">
        <PreCheckNavigation question={question} answers={answers} />
      </div>
      <section>
        {question ? (
          <PreCheckQuestion question={question} answers={answers} />
        ) : (
          <PreCheckStart />
        )}
        <Container paddingTop="0" additionalClassNames="lg:hidden">
          <PreCheckNavigation />
        </Container>
      </section>
    </div>
  );
}

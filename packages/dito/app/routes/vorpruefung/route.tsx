import Container from "@digitalcheck/shared/components/Container";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getAnswersFromCookie, userAnswers } from "cookies.server";
import { preCheck } from "resources/content";
import PreCheckNavigation from "./PreCheckNavigation";

const { questions } = preCheck;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookie = await getAnswersFromCookie(request);
  // reset cookie if the user accesses the start page
  if (!params.questionId) {
    cookie.answers = {};
    return json(
      { question: null, answers: {} },
      { headers: { "Set-Cookie": await userAnswers.serialize(cookie) } },
    );
  }
  const { answers } = cookie;
  const question = questions.find((q) => q.id === params.questionId);

  return json({ question, answers });
}

// layout always needs to be revalidated because the navigation depends on the cookie and param
export function shouldRevalidate() {
  return true;
}

export default function PreCheck() {
  const { question, answers } = useLoaderData<typeof loader>();

  return (
    <div className="flex bg-blue-100">
      <div className="hidden lg:block flex-none pt-48">
        <PreCheckNavigation question={question} answers={answers} />
      </div>
      <section>
        <Outlet />
        <Container paddingTop="0" additionalClassNames="lg:hidden">
          <PreCheckNavigation question={question} answers={answers} />
        </Container>
      </section>
    </div>
  );
}

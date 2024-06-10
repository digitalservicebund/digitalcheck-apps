import Container from "@digitalcheck/shared/components/Container";
import Heading from "@digitalcheck/shared/components/Heading";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import List from "@digitalcheck/shared/components/List";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAnswersFromCookie } from "cookies.server";
import { precheck } from "resources/content";
import { type Answers } from "./vorpruefung.$questionId";

export async function loader({ request }: LoaderFunctionArgs) {
  const { answers } = await getAnswersFromCookie(request);

  return json({ answers });
}

const getPositiveQuestions = (answers: Answers) => {
  return Object.entries(answers)
    .filter((answer) => answer[1] === "yes")
    .map((answer) => answer[0]);
};

export default function Result() {
  const { answers } = useLoaderData<typeof loader>();

  const reasons = getPositiveQuestions(answers).map(
    (questionId) =>
      precheck.questions.find((question) => question.id === questionId)?.result,
  );

  const reasonsText = reasons.map((reason) => `- ${reason}`).join("\n");

  const listItems = precheck.result.nextSteps.steps.map((step) => ({
    headline: {
      tagName: "h3" as const,
      text: step.title,
    },
    content: step.text,
    buttons: step.link && [
      {
        text: step.link.text,
        href: step.link.url,
      },
    ],
  }));

  return (
    <>
      <Container>
        <Heading
          tagName="h1"
          text={precheck.result.title}
          look="ds-heading-02-reg"
          className="mb-32"
        />
        <InlineNotice
          look="success"
          title={precheck.result.positive}
          tagName="h2"
          content={reasonsText}
        />
      </Container>
      <Container>
        <List
          heading={{
            text: precheck.result.nextSteps.title,
            tagName: "h2",
          }}
          items={listItems}
          isNumeric
        />
      </Container>
    </>
  );
}

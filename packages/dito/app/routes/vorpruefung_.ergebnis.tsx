import Button from "@digitalcheck/shared/components/Button";
import Container from "@digitalcheck/shared/components/Container";
import Heading from "@digitalcheck/shared/components/Heading";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import List from "@digitalcheck/shared/components/List";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getAnswersFromCookie } from "cookies.server";
import { preCheck, siteMeta } from "resources/content";
import { PATH_PRECHECK } from "resources/staticRoutes";
import type { Answers, Option } from "./vorpruefung.$questionId";

export async function loader({ request }: LoaderFunctionArgs) {
  const { answers } = await getAnswersFromCookie(request);
  // redirect to precheck if not all answers are present
  if (Object.keys(answers).length !== preCheck.questions.length) {
    return redirect(PATH_PRECHECK);
  }
  return json({ answers });
}

const getQuestionsOfOption = (answers: Answers, option: Option["value"]) => {
  return Object.entries(answers)
    .filter((answer) => answer[1] === option)
    .map((answer) => answer[0]);
};
export const meta: MetaFunction = () => {
  return [{ title: `${preCheck.result.title} — ${siteMeta.title}` }];
};

const getResult = (answers: Answers) => {
  if (getQuestionsOfOption(answers, "yes").length > 0) {
    return "positive";
  }
  if (getQuestionsOfOption(answers, "unsure").length > 0) {
    return "unsure";
  }
  return "negative";
};

export default function Result() {
  const { answers } = useLoaderData<typeof loader>();

  const result = getResult(answers);

  let reasonsTitle = "";
  let reasonsText = "";
  switch (result) {
    case "positive": {
      const reasons = getQuestionsOfOption(answers, "yes")
        .map(
          (questionId) =>
            `- ${preCheck.questions.find((question) => question.id === questionId)?.result}`,
        )
        .join("\n");
      reasonsTitle = preCheck.result.positive;
      reasonsText = `**Folgende Fragen haben Sie mit "Ja" beantwortet:**\n\n${preCheck.result.reasonIntro}\n${reasons}`;
      break;
    }
    case "unsure": {
      const reasonsUnsure = getQuestionsOfOption(answers, "unsure")
        .map(
          (questionId) =>
            `- ${preCheck.questions.find((question) => question.id === questionId)?.result}`,
        )
        .join("\n");
      const reasonsNegative = getQuestionsOfOption(answers, "no")
        .map(
          (questionId) =>
            `- ${preCheck.questions.find((question) => question.id === questionId)?.result}`,
        )
        .join("\n");
      reasonsTitle = preCheck.result.unsure;
      reasonsText = `**Folgende Fragen haben Sie mit "Unsicher" beantwortet:**\n\n${preCheck.result.reasonIntro}\n${reasonsUnsure}\n\n**Folgende Fragen haben Sie mit "Nein" beantwortet:**\n\n${preCheck.result.reasonIntro}\n${reasonsNegative}`;
      break;
    }
    case "negative": {
      // all answers are negative
      const reasons = preCheck.questions.map((question) => question.result);
      reasonsTitle = preCheck.result.negative;
      reasonsText = `**Folgende Fragen haben Sie mit "Nein" beantwortet:**\n\n${preCheck.result.reasonIntro}\n${reasons.map((reason) => `- ${reason}`).join("\n")}`;
      break;
    }
  }

  const listItems = preCheck.result.nextSteps.steps.map((step) => ({
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
          text={preCheck.result.title}
          look="ds-heading-02-reg"
          className="mb-32"
        />
        <InlineNotice
          look="info"
          title={reasonsTitle}
          tagName="h2"
          content={reasonsText}
          showIcon={false}
        />
        <div className="mt-16">
          <Button {...preCheck.result.receivePdfButton} look="tertiary" />
        </div>
      </Container>
      <Container>
        <List
          heading={{
            text: preCheck.result.nextSteps.title,
            tagName: "h2",
          }}
          items={listItems}
          isNumeric
        />
      </Container>
    </>
  );
}

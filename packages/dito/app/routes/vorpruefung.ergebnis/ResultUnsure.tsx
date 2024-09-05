import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";

import { preCheck } from "resources/content";
import { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import getReasoningText from "./getReasoningText";
import ResultHeader from "./ResultHeader";

const { title, hint, unsureIntro, negativeIntro, actionButton, nextStep } =
  preCheck.result.unsure;

export default function PositiveResult({
  answers,
}: Readonly<{
  answers: PreCheckAnswers;
}>) {
  const unsureQuestions = Object.keys(answers).filter(
    (key) => answers[key] === "unsure",
  );
  const negativeQuestions = Object.keys(answers).filter(
    (key) => answers[key] === "no",
  );

  const reasonsTextUnsure = getReasoningText(
    unsureQuestions,
    unsureIntro,
    "question",
  );

  const reasonsTextNegative = getReasoningText(
    negativeQuestions,
    negativeIntro,
    "negativeResult",
  );

  const reasonsText = `${reasonsTextUnsure}\n\n${reasonsTextNegative}`;

  return (
    <>
      <ResultHeader
        resultType="unsure"
        resultHeading={title}
        resultHint={hint}
        reasonsText={reasonsText}
        resultBackgroundColor="lightYellow"
        buttons={[{ ...actionButton, look: "tertiary" }]}
      />
      <Container>
        <Box
          heading={{
            text: nextStep.title,
          }}
          content={{
            markdown: nextStep.text,
          }}
          buttons={[
            {
              id: "result-method-button",
              text: nextStep.link.text,
              href: nextStep.link.href,
              look: "ghost",
            },
          ]}
        />
      </Container>
    </>
  );
}

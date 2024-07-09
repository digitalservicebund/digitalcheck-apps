import Container from "@digitalcheck/shared/components/Container";
import List from "@digitalcheck/shared/components/List";

import { preCheck } from "resources/content";
import getReasoningText from "./getReasoningText";
import ResultHeader from "./ResultHeader";

const { title, reasoningIntro, actionButton, nextSteps } =
  preCheck.result.positive;

export default function ResultNegative({
  positiveQuestions,
}: Readonly<{
  positiveQuestions: string[];
}>) {
  const reasonsText = getReasoningText(
    positiveQuestions,
    reasoningIntro,
    "positiveResult",
  );
  return (
    <>
      <ResultHeader
        resultType="positive"
        resultHeading={title}
        reasonsText={reasonsText}
        resultBackgroundColor="midBlue"
        buttons={[{ ...actionButton, look: "tertiary", size: "large" }]}
      />
      <Container>
        <List
          heading={{
            text: nextSteps.title,
            tagName: "h2",
          }}
          items={nextSteps.steps}
          isNumeric
        />
      </Container>
    </>
  );
}

import Container from "@digitalcheck/shared/components/Container";
import List from "@digitalcheck/shared/components/List";

import { preCheck } from "resources/content";
import getReasoningText from "./getReasoningText";
import ResultHeader from "./ResultHeader";

const { result } = preCheck;

export default function ResultNegative({
  positiveQuestions,
}: Readonly<{
  positiveQuestions: string[];
}>) {
  const reasonsText = getReasoningText(
    positiveQuestions,
    "Das Regelungsvorhaben...",
    "positiveResult",
  );
  return (
    <>
      <ResultHeader
        resultType="positive"
        resultHeading={result.positive}
        reasonsText={reasonsText}
        resultBackgroundColor="midBlue"
        buttons={[{ ...result.receivePdfButton, look: "tertiary" }]}
      />
      <Container>
        <List
          heading={{
            text: result.nextStepsPositive.title,
            tagName: "h2",
          }}
          items={result.nextStepsPositive.steps}
          isNumeric
        />
      </Container>
    </>
  );
}

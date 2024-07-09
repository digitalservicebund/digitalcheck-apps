import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";

import { preCheck } from "resources/content";
import getReasoningText from "./getReasoningText";
import ResultHeader from "./ResultHeader";

const { result } = preCheck;

export default function PositiveResult({
  unsureQuestions,
  negativeQuestions,
}: Readonly<{
  unsureQuestions: string[];
  negativeQuestions: string[];
}>) {
  const reasonsTextUnsure = getReasoningText(
    unsureQuestions,
    '**Folgende Fragen haben Sie mit "Unsicher" beantwortet:**',
    "question",
  );
  const reasonsTextNegative = getReasoningText(
    negativeQuestions,
    '**Folgende Fragen haben Sie mit "Nein" beantwortet:**',
    "negativeResult",
  );
  const reasonsText = `${reasonsTextUnsure}\n\n${reasonsTextNegative}`;
  return (
    <>
      <ResultHeader
        resultType="unsure"
        resultHeading={result.unsure}
        resultHint={result.unsureHint}
        reasonsText={reasonsText}
        resultBackgroundColor="lightYellow"
        buttons={[{ ...result.repeatPreCheckButton, look: "tertiary" }]}
      />
      <Container>
        <Box
          heading={{
            text: result.boxUnsure.title,
          }}
          content={{
            markdown: result.boxUnsure.text,
          }}
          buttons={[
            {
              id: "result-method-button",
              text: result.boxUnsure.link.text,
              href: result.boxUnsure.link.href,
              look: "ghost",
            },
          ]}
        />
      </Container>
    </>
  );
}

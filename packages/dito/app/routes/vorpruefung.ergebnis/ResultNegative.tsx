import Container from "@digitalcheck/shared/components/Container";
import { NumberedList } from "@digitalcheck/shared/components/List";
import { preCheck } from "resources/content";
import { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import getReasoningText from "./getReasoningText";
import ResultForm from "./ResultForm";
import ResultHeader from "./ResultHeader";

const { title, reasoningIntro, nextSteps } = preCheck.result.negative;

export default function ResultNegative({
  answers,
}: Readonly<{
  answers: PreCheckAnswers;
}>) {
  const negativeQuestions = Object.keys(answers).filter(
    (key) => answers[key] === "no",
  );

  const reasonsText = getReasoningText(
    negativeQuestions,
    reasoningIntro,
    "negativeResult",
  );

  return (
    <>
      <ResultHeader
        resultType="negative"
        resultHeading={title}
        reasonsText={reasonsText}
        resultBackgroundColor="midBlue"
      >
        <ResultForm answers={answers} />
      </ResultHeader>
      <Container>
        <NumberedList
          heading={{
            text: nextSteps.title,
            tagName: "h2",
          }}
          items={nextSteps.steps}
        />
      </Container>
    </>
  );
}

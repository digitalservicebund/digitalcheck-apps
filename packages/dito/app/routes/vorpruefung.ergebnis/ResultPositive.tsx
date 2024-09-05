import Container from "@digitalcheck/shared/components/Container";
import { NumberedList } from "@digitalcheck/shared/components/List";
import { preCheck } from "resources/content";
import { PreCheckAnswers } from "routes/vorpruefung.$questionId/route";
import getReasoningText from "./getReasoningText";
import ResultForm from "./ResultForm";
import ResultHeader from "./ResultHeader";

const { title, reasoningIntro, nextSteps } = preCheck.result.positive;

export default function ResultPositive({
  answers,
}: Readonly<{
  answers: PreCheckAnswers;
}>) {
  const positiveQuestions = Object.keys(answers).filter(
    (key) => answers[key] === "yes",
  );

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

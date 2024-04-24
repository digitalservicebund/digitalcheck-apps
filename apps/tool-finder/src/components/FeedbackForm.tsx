import { trackFeedbackClick } from "../services/tracking";
import Background from "./Background";
import Box from "./Box";
import Container from "./Container";

function RadioAnswer({
  name,
  value,
  onClick,
  annotation,
}: Readonly<{
  name: string;
  value: number;
  onClick: () => void;
  annotation?: string;
}>) {
  return (
    <div className="flex flex-col w-1/5 gap-16">
      {annotation && (
        <p className="hidden sm:inline text-center">{annotation}</p>
      )}
      <label className="flex flex-col items-center gap-8">
        <span className="ml-2">{value}</span>
        <input
          type="radio"
          className="ds-radio"
          name={name}
          value={value}
          onChange={onClick}
        />
      </label>
    </div>
  );
}

const disagreeAnnotation = "Ich stimme überhaupt nicht zu.";
const agreeAnnotation = "Ich stimme voll und ganz zu.";

function Question({
  question,
  name,
  onFeedbackClick,
  hasAnnotations = false,
}: Readonly<{
  question: string;
  name: string;
  onFeedbackClick: (question: string, value: number) => void;
  hasAnnotations?: boolean;
}>) {
  return (
    <fieldset className="flex flex-col sm:flex-row items-stretch sm:items-end w-full gap-16 sm:gap-32">
      <div className="w-full sm:w-1/5">
        <legend className="font-semibold">{question}</legend>
      </div>
      <div
        role="radiogroup"
        className="flex-1 flex justify-between items-end mb-8"
      >
        {[1, 2, 3, 4, 5].map((value) => {
          let annotation: string | undefined = undefined;
          if (hasAnnotations) {
            if (value === 1) annotation = disagreeAnnotation;
            if (value === 5) annotation = agreeAnnotation;
          }

          return (
            <RadioAnswer
              key={value}
              name={name}
              value={value}
              annotation={annotation}
              onClick={() => onFeedbackClick(name, value)}
            />
          );
        })}
      </div>
    </fieldset>
  );
}

export default function FeedbackForm({
  ressort,
  object,
  reason,
}: Readonly<{
  ressort: string;
  object: string;
  reason: string;
}>) {
  function sendFeedback(name: string, value: number) {
    trackFeedbackClick(name, value, ressort, object, reason);
  }

  return (
    <Background backgroundColor="yellow" paddingTop="32" paddingBottom="40">
      <Container
        paddingTop="0"
        paddingBottom="0"
        additionalClassNames="ds-stack-32"
      >
        <Box
          heading={{
            tagName: "h3",
            text: "Ihr Feedback hilft uns weiter!",
          }}
        ></Box>
        <div className="sm:hidden w-full flex flex-col">
          <p className="">1 = {disagreeAnnotation}</p>
          <p className="">5 = {agreeAnnotation}</p>
        </div>
        <Question
          name="question-useful"
          question="Ich habe gefunden, was ich brauche."
          hasAnnotations
          onFeedbackClick={sendFeedback}
        />
        <Question
          name="question-simple"
          question="Die Anwendung war einfach zu nutzen."
          onFeedbackClick={sendFeedback}
        />
      </Container>
    </Background>
  );
}

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
    <div className="flex w-1/5 flex-col gap-16">
      {annotation && (
        <p className="hidden text-center sm:inline">{annotation}</p>
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

function FeedbackQuestion({
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
    <fieldset className="flex w-full flex-col items-stretch gap-16 sm:flex-row sm:items-end sm:gap-32">
      <div className="w-full sm:w-1/5">
        <legend className="font-semibold">{question}</legend>
      </div>
      <div
        role="radiogroup"
        className="mb-8 flex flex-1 items-end justify-between"
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
  trackFeedbackClick,
}: Readonly<{
  ressort: string;
  object: string;
  reason: string;
  trackFeedbackClick: (
    name: string,
    value: number,
    ressort: string,
    object: string,
    reason: string,
  ) => void;
}>) {
  function sendFeedback(name: string, value: number) {
    trackFeedbackClick(name, value, ressort, object, reason);
  }

  return (
    <Background backgroundColor="yellow" className="pb-40 pt-32">
      <Container className="ds-stack-32 py-0">
        <Box
          heading={{
            tagName: "h3",
            look: "ds-heading-03-bold",
            text: "Ihr Feedback hilft uns weiter!",
          }}
        ></Box>
        <div className="flex w-full flex-col sm:hidden">
          <p className="">1 = {disagreeAnnotation}</p>
          <p className="">5 = {agreeAnnotation}</p>
        </div>
        <FeedbackQuestion
          name="question-useful"
          question="Ich habe gefunden, was ich brauche."
          hasAnnotations
          onFeedbackClick={sendFeedback}
        />
        <FeedbackQuestion
          name="question-simple"
          question="Die Anwendung war einfach zu nutzen."
          onFeedbackClick={sendFeedback}
        />
      </Container>
    </Background>
  );
}

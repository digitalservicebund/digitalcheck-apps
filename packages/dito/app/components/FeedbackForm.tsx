import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import RichText from "@digitalcheck/shared/components/RichText";
import ThumbDownOutlined from "@digitalservicebund/icons/ThumbDownOutlined";
import ThumbUpOutlined from "@digitalservicebund/icons/ThumbUpOutlined";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { feedbackForm } from "resources/content";

function FeedbackInput({
  children,
  value,
  selected,
  onChange,
  name,
  id,
  ariaLabel,
}: Readonly<{
  children: React.ReactNode;
  value: number;
  selected: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name: string;
  id: string;
  ariaLabel: string;
}>) {
  const classes = classNames(`rounded-lg px-24 h-64 flex items-center gap-8`, {
    "bg-blue-200 text-blue-800": !selected,
    "bg-blue-800 text-white": selected,
  });

  return (
    <label className={classes}>
      <input
        type="radio"
        name={name}
        id={id}
        value={value}
        checked={selected}
        onChange={onChange}
        aria-label={ariaLabel}
        className="sr-only"
      />
      {children}
    </label>
  );
}

function FeedbackQuestion({
  legend,
  isBinary = false,
  name,
  isLast = false,
}: Readonly<{
  legend: string;
  isBinary?: boolean;
  name: string;
  isLast?: boolean;
}>) {
  const [selected, setSelected] = useState<number | null>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(Number(event.target.value));
  };

  return (
    <fieldset
      className={classNames(
        "flex flex-col lg:flex-row gap-20 lg:gap-24 pt-24 pb-20 border-blue-300",
        { "border-b-2": !isLast }, // conditional rendering because last:border-b-0 doesn't work here
      )}
    >
      <div className="lg:w-1/2">
        <legend>
          <p>{legend}</p>
        </legend>
      </div>
      <div className="lg:w-1/2">
        {isBinary ? (
          <div className="flex gap-16">
            <FeedbackInput
              value={1}
              selected={selected === 1}
              onChange={onChange}
              name={name}
              id={`${name}-yes`}
              ariaLabel="Ja"
            >
              <ThumbUpOutlined />
              <span className="ds-label-01-bold">Ja</span>
            </FeedbackInput>
            <FeedbackInput
              value={2}
              selected={selected === 2}
              onChange={onChange}
              name={name}
              id={`${name}-no`}
              ariaLabel="Nein"
            >
              <ThumbDownOutlined />
              <span className="ds-label-01-bold">Nein</span>
            </FeedbackInput>
          </div>
        ) : (
          <div className="max-w-fit">
            <div className="flex gap-16">
              {[1, 2, 3, 4, 5].map((number) => {
                let ariaLabel: string;
                switch (number) {
                  case 1:
                    ariaLabel = "sehr schwierig";
                    break;
                  case 2:
                    ariaLabel = "schwierig";
                    break;
                  case 3:
                    ariaLabel = "mittel";
                    break;
                  case 4:
                    ariaLabel = "einfach";
                    break;
                  case 5:
                    ariaLabel = "sehr einfach";
                    break;
                  default:
                    ariaLabel = "";
                }

                return (
                  <FeedbackInput
                    key={number}
                    value={number}
                    selected={selected === number}
                    onChange={onChange}
                    name={name}
                    id={`${name}-${number}`}
                    ariaLabel={ariaLabel}
                  >
                    <span className="ds-heading-02-reg">{number}</span>
                  </FeedbackInput>
                );
              })}
            </div>
            <div className="mt-20 text-gray-900 flex justify-between">
              <span className="">{feedbackForm.labels[0]}</span>
              <span className="">{feedbackForm.labels[4]}</span>
            </div>
          </div>
        )}
      </div>
    </fieldset>
  );
}

export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const thankYouMessageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const simpleFeedback = formData.get("simple-feedback");
    const usefulFeedback = formData.get("useful-feedback");

    // Plausible event trigger with feedback values
    if (window.plausible) {
      window.plausible("Feedback", {
        props: {
          simpleFeedback: simpleFeedback?.toString() || "No Feedback",
          usefulFeedback: usefulFeedback?.toString() || "No Feedback",
        },
      });
    }

    setSubmitted(true);
  };

  // After submission, move focus to the thanks message for accessibility
  useEffect(() => {
    if (submitted && thankYouMessageRef.current) {
      thankYouMessageRef.current.focus();
    }
  }, [submitted]);

  if (submitted) {
    return (
      <div ref={thankYouMessageRef} tabIndex={-1} aria-live="polite">
        <Background backgroundColor="blue" paddingTop="40" paddingBottom="48">
          <Container backgroundColor="white" overhangingBackground>
            <h2>Vielen Dank für Ihr Feedback!</h2>
            <br />
            <p>
              Wir schätzen Ihre Rückmeldung sehr und werden sie in unsere
              Verbesserungen einfließen lassen.
            </p>
          </Container>
        </Background>
      </div>
    );
  }

  return (
    <Background backgroundColor="blue" paddingTop="40" paddingBottom="48">
      <Container backgroundColor="white" overhangingBackground>
        <h2>{feedbackForm.heading}</h2>
        <form onSubmit={handleSubmit} className="mb-48">
          <FeedbackQuestion
            legend={feedbackForm.questionSimple}
            name="simple-feedback"
          />
          <FeedbackQuestion
            legend={feedbackForm.questionUseful}
            name="useful-feedback"
            isLast={true}
          />
          <button
            type="submit"
            className="mt-16 bg-blue-800 text-white px-24 py-12 rounded-lg"
          >
            Feedback absenden
          </button>
        </form>
        <RichText markdown={feedbackForm.mail} className="ds-label-01-bold" />
      </Container>
    </Background>
  );
}

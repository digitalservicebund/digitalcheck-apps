import React, { useEffect, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";
import Background from "~/components/Background";
import Button from "~/components/Button";
import Container from "~/components/Container";
import RichText from "~/components/RichText";

type FeedbackQuestionOptionProps = {
  label: string;
  value: number;
};

type FeedbackQuestionProps = {
  id: string;
  trackingEvent: string;
  text: string;
  options: FeedbackQuestionOptionProps[];
};

type FeedbackFormProps = {
  heading: string;
  trackingEvent: string;
  questions: FeedbackQuestionProps[];
  contact: string;
  button: string;
  success: {
    heading: string;
    text: string;
  };
};

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
  const classes = twJoin(
    "px-16 h-48 sm:px-24 sm:h-64 flex items-center cursor-pointer",
    selected ? "bg-blue-800 text-white" : "bg-blue-200 text-blue-800",
  );

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
  question,
}: Readonly<{
  question: FeedbackQuestionProps;
}>) {
  const [selected, setSelected] = useState<number | null>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(Number(event.target.value));
  };

  return (
    <fieldset
      className={twJoin(
        "flex flex-col lg:flex-row gap-20 lg:gap-24 pt-24 pb-20 border-blue-300 border-b-2 last:border-b-0",
      )}
    >
      <div className="lg:w-1/2">
        <legend>
          <p>{question.text}</p>
        </legend>
      </div>
      <div className="lg:w-1/2">
        <div className="max-w-fit">
          <div className="flex gap-8 sm:gap-16">
            {question.options.map(({ value }) => {
              return (
                <FeedbackInput
                  key={value}
                  value={value}
                  selected={selected === value}
                  onChange={onChange}
                  name={question.id}
                  id={`${question.id}-${value}`}
                  ariaLabel={`${value}`}
                >
                  <span className="ds-heading-02-reg">{value}</span>
                </FeedbackInput>
              );
            })}
          </div>
          <div className="mt-20 flex justify-between text-gray-900">
            <span className="">{question.options[0].label}</span>
            <span className="">
              {question.options[question.options.length - 1].label}
            </span>
          </div>
        </div>
      </div>
    </fieldset>
  );
}

export default function FeedbackForm(props: Readonly<FeedbackFormProps>) {
  const [submitted, setSubmitted] = useState(false);
  const thankYouMessageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Plausible event trigger with feedback values
    if (window.plausible) {
      const formData = new FormData(event.currentTarget);

      const trackingEventProps: { [key: string]: string } = {};
      props.questions.forEach((question) => {
        trackingEventProps[question.trackingEvent] =
          (formData.get(question.id) as string) ?? "No Feedback";
      });

      window.plausible(props.trackingEvent, {
        props: trackingEventProps,
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
        <Background backgroundColor="blue" className="pb-48 pt-40">
          <Container backgroundColor="white" overhangingBackground>
            <h2>{props.success.heading}</h2>
            <br />
            <p>{props.success.text}</p>
          </Container>
        </Background>
      </div>
    );
  }

  return (
    <Background backgroundColor="blue" className="pb-48 pt-40">
      <Container backgroundColor="white" overhangingBackground>
        <h2>{props.heading}</h2>
        <form onSubmit={handleSubmit} className="mb-48">
          <span>
            {props.questions?.length !== 0 &&
              props.questions.map((question) => (
                <FeedbackQuestion key={question.id} question={question} />
              ))}
          </span>
          <Button text={props.button} size="large" type="submit" />
        </form>
        <RichText markdown={props.contact} className="font-bold" />
      </Container>
    </Background>
  );
}

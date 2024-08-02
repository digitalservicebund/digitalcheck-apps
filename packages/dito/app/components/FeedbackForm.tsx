import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import ThumbDownOutlined from "@digitalservicebund/icons/ThumbDownOutlined";
import ThumbUpOutlined from "@digitalservicebund/icons/ThumbUpOutlined";
import classNames from "classnames";
import React, { useState, type ReactNode } from "react";
import { feedbackForm } from "resources/content";

const TRACKING_CLASS = "plausible-event-name=Feedback plausible-event-question";

function FeedbackButton({
  children,
  value,
  selected,
  onClick,
  trackingClass,
}: Readonly<{
  children: ReactNode;
  value: number;
  selected: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  trackingClass?: string;
}>) {
  const classes = classNames(
    `rounded-lg px-24 h-64 flex items-center gap-8 ${trackingClass}`,
    {
      "bg-blue-200 text-blue-800 fill-blue-800 active:bg-blue-800 active:text-white active:fill-white":
        !selected,
    },
    { "bg-blue-800 text-white fill-white": selected },
  );

  return (
    <button className={classes} value={value} onClick={onClick}>
      {children}
    </button>
  );
}

function FeedbackQuestion({
  legend,
  trackingClass,
  isBinary = false,
}: Readonly<{ legend: string; trackingClass?: string; isBinary?: boolean }>) {
  const [selected, setSelected] = useState<number | null>();

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelected(Number(event.currentTarget.value));
  };

  return (
    <fieldset className="flex flex-col lg:flex-row gap-20 lg:gap-24 pt-24 pb-20 border-b-2 border-blue-300 last:border-0">
      <div className="lg:w-1/2">
        <legend>{legend}</legend>
      </div>
      <div className="lg:w-1/2">
        {isBinary ? (
          <div className="flex gap-16">
            <FeedbackButton
              value={1}
              selected={selected === 1}
              onClick={onClick}
              trackingClass={`${trackingClass}Ja`}
            >
              <ThumbUpOutlined />
              <span className="ds-label-01-bold">Ja</span>
            </FeedbackButton>
            <FeedbackButton
              value={2}
              selected={selected === 2}
              onClick={onClick}
              trackingClass={`${trackingClass}Nein`}
            >
              <ThumbDownOutlined />
              <span className="ds-label-01-bold">Nein</span>
            </FeedbackButton>
          </div>
        ) : (
          <div className="max-w-fit">
            <div className="flex gap-16">
              {[1, 2, 3, 4, 5].map((number) => (
                <FeedbackButton
                  key={number}
                  value={number}
                  selected={selected === number}
                  onClick={onClick}
                  trackingClass={`${trackingClass}${number}`}
                >
                  <span className="ds-heading-02-reg">{number}</span>
                  <span className="sr-only">
                    {feedbackForm.labels[number - 1]}
                  </span>
                </FeedbackButton>
              ))}
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
  return (
    <Background backgroundColor="blue" paddingTop="40" paddingBottom="48">
      <Container backgroundColor="white" overhangingBackground>
        <h2>{feedbackForm.heading}</h2>
        <div className="mb-48">
          <FeedbackQuestion
            legend={feedbackForm.questionSimple}
            trackingClass={`${TRACKING_CLASS}Simple=`}
          />
          <FeedbackQuestion
            legend={feedbackForm.questionUseful}
            trackingClass={`${TRACKING_CLASS}Useful=`}
          />
          <FeedbackQuestion
            legend={feedbackForm.questionReuse}
            isBinary
            trackingClass={`${TRACKING_CLASS}Reuse=`}
          />
        </div>
        <p className="ds-label-01-bold">{feedbackForm.mail}</p>
      </Container>
    </Background>
  );
}

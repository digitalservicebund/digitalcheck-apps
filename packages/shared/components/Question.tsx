import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { BackgroundColor } from ".";
import Box, { BoxProps } from "./Box";
import DetailsSummary from "./DetailsSummary";
import Heading, { HeadingProps } from "./Heading";
import RadioGroup, { type RadioGroupProps } from "./RadioGroup";
import RichText, { RichTextProps } from "./RichText";
import Select, { type SelectProps } from "./Select";

export type QuestionProps = {
  backgroundColor?: BackgroundColor;
  box?: BoxProps;
  heading?: HeadingProps;
  content?: RichTextProps;
  hint?: {
    title: string;
    text: string;
  };
  select?: SelectProps;
  radio?: RadioGroupProps;
  stack?: 8 | 16 | 32 | 48;
  className?: string;
  ariaLabel?: string;
};

export default function Question({
  backgroundColor = "default",
  box,
  heading,
  content,
  hint,
  select,
  radio,
  stack,
  className,
  ariaLabel = "",
}: PropsWithChildren<QuestionProps>) {
  const cssClasses = twMerge(
    "container pt-0 pb-80",
    `ds-stack-${stack ?? 16}`,
    backgroundColor !== "default" && "text-black",
    className,
  );

  return (
    <fieldset className={cssClasses}>
      <span className="sr-only">{ariaLabel}</span>
      <legend className="ds-stack-16">
        {box && <Box {...box} />}
        {heading && <Heading {...heading} />}
        {content && (
          <div>
            <RichText {...content} />
          </div>
        )}
        {hint && <DetailsSummary title={hint.title} content={hint.text} />}
      </legend>
      {select && <Select placeholder="Bitte auswählen" {...select} />}
      {radio && <RadioGroup {...radio} />}
    </fieldset>
  );
}

import classNames from "classnames";
import { PropsWithChildren } from "react";
import Box, { BoxProps } from "./Box";
import { CommonWrapperProps } from "./CommonWrapperProps";
import DetailsSummary from "./DetailsSummary";
import Heading, { HeadingProps } from "./Heading";
import RadioGroup, { type RadioGroupProps } from "./RadioGroup";
import RichText, { RichTextProps } from "./RichText";
import Select, { type SelectProps } from "./Select";

const DEFAULT_PADDING_TOP = "0";
const DEFAULT_PADDING_BOTTOM = "80";

export type QuestionProps = {
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
  additionalClassNames?: string;
  ariaLabel?: string;
} & PropsWithChildren<CommonWrapperProps>;

export default function Question({
  paddingTop = "default",
  paddingBottom = "default",
  backgroundColor = "default",
  box,
  heading,
  content,
  hint,
  select,
  radio,
  stack,
  additionalClassNames,
  ariaLabel = "",
}: QuestionProps) {
  let cssClasses = additionalClassNames ?? "";
  cssClasses = classNames(
    cssClasses,
    "container",
    `ds-stack-${stack ?? 16}`,
    `!pt-${paddingTop === "default" ? DEFAULT_PADDING_TOP : paddingTop}`,
    `!pb-${
      paddingBottom === "default" ? DEFAULT_PADDING_BOTTOM : paddingBottom
    }`,
    backgroundColor !== "default" && "text-black",
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

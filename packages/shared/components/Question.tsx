import classNames from "classnames";
import { PropsWithChildren } from "react";
import Box, { type BoxProps } from "./Box";
import { CommonWrapperProps } from "./CommonWrapperProps";
import RadioGroup, { type RadioGroupProps } from "./RadioGroup";
import Select, { type SelectProps } from "./Select";

const DEFAULT_PADDING_TOP = "0";
const DEFAULT_PADDING_BOTTOM = "80";

export type QuestionProps = {
  box: BoxProps;
  select?: SelectProps;
  radio?: RadioGroupProps;
  additionalClassNames?: string;
} & PropsWithChildren<CommonWrapperProps>;

export default function Question({
  paddingTop = "default",
  paddingBottom = "default",
  backgroundColor = "default",
  box,
  select,
  radio,
  additionalClassNames,
}: QuestionProps) {
  let cssClasses = additionalClassNames ?? "";
  cssClasses = classNames(
    cssClasses,
    "container",
    `!pt-${paddingTop === "default" ? DEFAULT_PADDING_TOP : paddingTop}`,
    `!pb-${
      paddingBottom === "default" ? DEFAULT_PADDING_BOTTOM : paddingBottom
    }`,
    backgroundColor !== "default" && "text-black",
  );

  return (
    <fieldset className={cssClasses}>
      <legend className="pb-16 ds-stack-8">
        <Box {...box} />
      </legend>
      {select && <Select placeholder="Bitte auswählen" {...select} />}
      {radio && <RadioGroup {...radio} />}
    </fieldset>
  );
}

import classNames from "classnames";
import { PropsWithChildren } from "react";
import { CommonWrapperProps } from "./CommonWrapperProps";
import RadioGroup, { RadioGroupProps } from "./RadioGroup";
import Select, { SelectProps } from "./Select";

const DEFAULT_PADDING_TOP = "0";
const DEFAULT_PADDING_BOTTOM = "80";

export type QuestionProps = {
  heading: string;
  label?: string;
  description: string;
  select?: SelectProps;
  radio?: RadioGroupProps;
  additionalClassNames?: string;
} & PropsWithChildren<CommonWrapperProps>;

export default function Question({
  paddingTop = "default",
  paddingBottom = "default",
  backgroundColor = "default",
  heading,
  label,
  description,
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
        {label && <p className="ds-label-02-reg">{label}</p>}
        <h2>{heading}</h2>
        <p>{description}</p>
      </legend>
      {select && <Select placeholder={"Bitte auswählen"} {...select} />}
      {radio && <RadioGroup {...radio} />}
    </fieldset>
  );
}

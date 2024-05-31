import RadioGroup, { RadioGroupProps } from "./RadioGroup";
import Select, { SelectProps } from "./Select";

export type QuestionProps = {
  heading: string;
  label?: string;
  description: string;
  select?: SelectProps;
  radio?: RadioGroupProps;
};

export default function Question({
  heading,
  label,
  description,
  select,
  radio,
}: QuestionProps) {
  return (
    <fieldset className="container pt-0 pb-80">
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

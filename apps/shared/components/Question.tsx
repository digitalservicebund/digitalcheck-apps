import { z } from "zod";
import RadioGroup, { RadioGroupPropsSchema } from "./RadioGroup";
import Select, { SelectPropsSchema } from "./Select";

export const QuestionPropsSchema = z.object({
  heading: z.string(),
  label: z.string(),
  description: z.string(),
  select: SelectPropsSchema.optional(),
  radio: RadioGroupPropsSchema.optional(),
});

type QuestionProps = z.infer<typeof QuestionPropsSchema>;

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
        <p className="ds-label-02-reg">{label}</p>
        <h2>{heading}</h2>
        <p>{description}</p>
      </legend>
      {select && <Select placeholder={"Bitte auswählen"} {...select} />}
      {radio && <RadioGroup {...radio} />}
    </fieldset>
  );
}

import { ChangeEvent } from "react";
import { FieldValues, GlobalError, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import InputError from "./InputError";

export const RadioOptionsPropsSchema = z.array(
  z.object({
    value: z.string(),
    text: z.string(),
    subText: z.string().optional(),
  }),
);

export type RadioOptionsProps = z.infer<typeof RadioOptionsPropsSchema>;

export const RadioGroupPropsSchema = z.object({
  name: z.string(),
  options: RadioOptionsPropsSchema,
  selectedValue: z.string().optional(),
  onChange: z
    .function()
    .args(z.custom<ChangeEvent<HTMLInputElement>>())
    .returns(z.void())
    .optional(),
  formRegister: z.custom<UseFormRegister<FieldValues>>(),
  error: z.custom<GlobalError | undefined>(),
});

type RadioGroupProps = z.infer<typeof RadioGroupPropsSchema>;

const RadioGroup = ({
  name,
  options,
  selectedValue,
  onChange,
  formRegister,
  error,
}: RadioGroupProps) => {
  const hasError = !!error;
  const errorId = hasError ? `${name}-error` : undefined;

  return (
    <div
      role="radiogroup"
      aria-required={true}
      aria-errormessage={errorId}
      aria-invalid={!!error}
    >
      <ul className="ds-stack-16 border-0 p-0 m-0">
        {options.map(({ value, text, subText }) => {
          const id = `${name}-${value}`;
          const checked = selectedValue === value;

          return (
            <li className="flex items-center" key={value}>
              <input
                type={"radio"}
                id={id}
                value={value}
                className="ds-radio"
                checked={checked}
                {...formRegister(name, {
                  required: "Bitte wählen Sie eine Option aus.",
                  onChange: onChange,
                })}
                aria-describedby={errorId}
              />
              <label htmlFor={id}>
                {text}
                <div className={"text-gray-800 ds-body-02-reg"}>{subText}</div>
              </label>
            </li>
          );
        })}
      </ul>

      {error && errorId && (
        <InputError id={errorId}>{error.message}</InputError>
      )}
    </div>
  );
};

export default RadioGroup;

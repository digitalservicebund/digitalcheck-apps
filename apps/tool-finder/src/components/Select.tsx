import classNames from "classnames";
import type { ReactNode } from "react";
import { ChangeEvent } from "react";
import { FieldValues, GlobalError, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import InputError from "./InputError";

export const SelectOptionsPropsSchema = z.array(
  z.object({ value: z.string(), text: z.string() }),
);

export type SelectOptionsProps = z.infer<typeof SelectOptionsPropsSchema>;

export const SelectPropsSchema = z.object({
  name: z.string(),
  options: SelectOptionsPropsSchema,
  label: z.custom<ReactNode>(),
  altLabel: z.string().optional(),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  onChange: z
    .function()
    .args(z.custom<ChangeEvent<HTMLInputElement>>())
    .returns(z.void())
    .optional(),
  formRegister: z.custom<UseFormRegister<FieldValues>>(),
  error: z.custom<GlobalError | undefined>(),
});

type SelectProps = z.infer<typeof SelectPropsSchema>;

const Select = ({
  name,
  label,
  options,
  placeholder,
  value,
  onChange,
  formRegister,
  error,
}: SelectProps) => {
  const hasError = !!error;
  const errorId = hasError ? `${name}-error` : undefined;
  const selectClassName = classNames("ds-select", {
    "has-error": hasError,
  });

  return (
    <>
      <label htmlFor={name}>{label}</label>

      <select
        id={name}
        className={selectClassName}
        value={value}
        {...formRegister(name, {
          required: "Bitte wählen Sie eine Option aus.",
          onChange: onChange,
        })}
        aria-required={true}
        aria-invalid={hasError}
        aria-describedby={errorId}
        aria-errormessage={errorId}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          return (
            <option value={option.value} key={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>

      {error && errorId && (
        <InputError id={errorId}>{error.message}</InputError>
      )}
    </>
  );
};

export default Select;

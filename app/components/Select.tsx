import type { ReactNode } from "react";
import { ChangeEvent } from "react";
import { twJoin } from "tailwind-merge";
import InputError from "./InputError";

export type SelectOptionsProps = {
  value: string;
  text: string;
}[];

export type SelectProps = {
  name: string;
  options: SelectOptionsProps;
  label: ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  error?: string | null;
};

const Select = ({
  name,
  label,
  options,
  placeholder,
  value,
  onChange,
  error,
}: SelectProps) => {
  const hasError = !!error;
  const errorId = hasError ? `${name}-error` : undefined;
  const selectClassName = twJoin("ds-select", hasError && "has-error");

  return (
    <>
      <label htmlFor={name}>{label}</label>

      <select
        name={name}
        id={name}
        data-testid={name}
        className={selectClassName}
        value={value}
        onChange={onChange}
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

      {error && errorId && <InputError id={errorId}>{error}</InputError>}
    </>
  );
};

export default Select;

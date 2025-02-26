import type { ChangeEvent } from "react";
import InputError from "./InputError";

export type RadioOptionsProps = {
  value: string;
  text: string;
  subText?: string;
}[];

export type RadioGroupProps = {
  name: string;
  options: RadioOptionsProps;
  selectedValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
};

const RadioGroup = ({
  name,
  options,
  selectedValue,
  onChange,
  error,
}: RadioGroupProps) => {
  const hasError = !!error;
  const errorId = hasError ? `${name}-error` : undefined;

  return (
    <div
      role="radiogroup"
      aria-required={true}
      aria-errormessage={errorId}
      aria-invalid={hasError}
    >
      <ul className="ds-stack-16 m-0 border-0 p-0">
        {options.map(({ value, text, subText }) => {
          const id = `${name}-${value}`;
          const checked = selectedValue === value;

          return (
            <li className="flex items-center" key={value}>
              <input
                name={name}
                type="radio"
                id={id}
                value={value}
                className="ds-radio"
                checked={checked}
                onChange={onChange}
                aria-describedby={errorId}
              />
              <label htmlFor={id}>
                {text}
                <div className="ds-body-02-reg text-gray-800">{subText}</div>
              </label>
            </li>
          );
        })}
      </ul>

      {error && errorId && <InputError id={errorId}>{error}</InputError>}
    </div>
  );
};

export default RadioGroup;

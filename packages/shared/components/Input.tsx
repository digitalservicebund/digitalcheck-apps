import type { ChangeEvent } from "react";
import { twJoin } from "tailwind-merge";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

export type InputProps = Readonly<{
  name: string;
  label?: string;
  type?: string;
  prefix?: string;
  suffix?: string;
  helperText?: string;
  width?: "3" | "5" | "7" | "10" | "16" | "24" | "36" | "54";
  error?: string | null;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}>;

const widthClass = (width: string) => {
  return {
    "3": "w-[9ch]",
    "5": "w-[11ch]",
    "7": "w-[13ch]",
    "10": "w-[16ch]",
    "16": "w-[22ch]",
    "24": "w-[30ch]",
    "36": "w-[42ch]",
    "54": "w-[60ch]",
  }[width];
};

export default function Input({
  name,
  label,
  type = "text",
  prefix,
  suffix,
  helperText,
  width,
  error,
  onChange,
}: InputProps) {
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <div>
      {label && (
        <InputLabel classname="text-gray-900" id={name}>
          {label}
        </InputLabel>
      )}
      <div className="ds-input-group">
        {prefix && <div className="ds-input-prefix">{prefix}</div>}
        <input
          id={name}
          name={name}
          type={type}
          className={twJoin(
            "ds-input forced-color-adjust-none",
            error && "has-error",
            width && widthClass(width),
          )}
          aria-invalid={error !== undefined}
          aria-describedby={[error && errorId, helperText && helperId].join(
            " ",
          )}
          aria-errormessage={error ? errorId : undefined}
          onChange={onChange}
        />
        {suffix && (
          <div className="ds-input-suffix" aria-hidden="true">
            {suffix}
          </div>
        )}
      </div>
      <div className="label-text mt-6" id={helperId}>
        {helperText}
      </div>
      {error && <InputError id={errorId}>{error}</InputError>}
    </div>
  );
}

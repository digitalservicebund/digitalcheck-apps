import classNames from "classnames";
import React from "react";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

export type InputProps = Readonly<{
  name: string;
  label?: string;
  type?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  helperText?: string;
  width?: "3" | "5" | "7" | "10" | "16" | "24" | "36" | "54";
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

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function InputComponent(
    {
      name,
      label,
      type = "text",
      prefix,
      suffix,
      error,
      helperText,
      width,
      ...props
    },
    ref,
  ) {
    const errorId = `${name}-error`;
    const helperId = `${name}-helper`;

    return (
      <div>
        {label && <InputLabel id={name}>{label}</InputLabel>}
        <div className="ds-input-group">
          {prefix && <div className="ds-input-prefix">{prefix}</div>}
          <input
            id={name}
            name={name}
            type={type}
            ref={ref}
            className={classNames(
              "ds-input forced-color-adjust-none",
              { "has-error": error },
              width && widthClass(width),
            )}
            aria-invalid={error !== undefined}
            aria-describedby={[error && errorId, helperText && helperId].join(
              " ",
            )}
            aria-errormessage={error && errorId}
            {...props}
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
  },
);

export default Input;
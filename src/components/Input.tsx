import type { FormScope, ValueOfInputType } from "@rvf/react";
import { useField } from "@rvf/react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useId } from "react";
import { twMerge } from "tailwind-merge";
import InputError from "./InputError";

type BaseInputProps = ComponentPropsWithRef<"input">;

interface InputProps extends BaseInputProps {
  scope: FormScope<ValueOfInputType<"checkbox"> | undefined>;
  size?: number;
  description?: ReactNode;
  error?: string | null;
  warningInsteadOfError?: boolean;
}

function Input({
  children,
  scope,
  description,
  error,
  type,
  warningInsteadOfError,
  ...rest
}: Readonly<InputProps>) {
  const field = useField(scope);
  const inputId = useId();
  const errorId = useId();
  const descriptionId = useId();
  const hasError = !!(error || field.error()) && !warningInsteadOfError;
  const hasWarning = !!(error || field.error()) && warningInsteadOfError;

  return (
    <div className="kern-form-input">
      <label htmlFor={inputId} className="kern-label">
        {children}
      </label>
      {description && (
        <p className="kern-hint" id={descriptionId}>
          {description}
        </p>
      )}
      <input
        {...field.getInputProps({
          id: inputId,
          type,
          "aria-describedby": description ? descriptionId : undefined,
          "aria-invalid": hasError || hasWarning,
          "aria-errormessage": hasError || hasWarning ? errorId : undefined,
          className: twMerge(
            "kern-form-input__input bg-white",
            hasError && "kern-form-input__input--error",
            hasWarning &&
              "bg-white border-yellow-700 text-black focus:border-4 focus:border-yellow-700 focus:outline-none",
          ),
          ...rest,
        })}
      />

      {(hasError || hasWarning) && (
        <InputError
          id={errorId}
          look={warningInsteadOfError ? "warning" : "error"}
        >
          {error || field.error()}
        </InputError>
      )}
    </div>
  );
}

export default Input;

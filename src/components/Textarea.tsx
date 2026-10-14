import type { FormScope, ValueOfInputType } from "@rvf/react";
import { useField } from "@rvf/react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useId } from "react";
import { twMerge } from "tailwind-merge";
import InputError from "./InputError";

type BaseTextareaProps = ComponentPropsWithRef<"textarea">;

interface TextareaProps extends BaseTextareaProps {
  scope: FormScope<ValueOfInputType<"textarea"> | undefined>;
  size?: number;
  description?: ReactNode;
  error?: string | null;
  warningInsteadOfError?: boolean;
}

function Textarea({
  children,
  scope,
  description,
  error,
  warningInsteadOfError,
  ...rest
}: Readonly<TextareaProps>) {
  const field = useField(scope);
  const inputId = useId();
  const errorId = useId();
  const descriptionId = useId();
  const hasError = !!(error || field.error()) && !warningInsteadOfError;
  const hasWarning = !!(error || field.error()) && warningInsteadOfError;

  return (
    <div className="kern-form-input space-y-8">
      <label htmlFor={inputId} className="kern-label">
        {children}
      </label>
      {description && (
        <div className="text-kern-layout-text-default block" id={descriptionId}>
          {description}
        </div>
      )}
      <textarea
        {...field.getInputProps({
          id: inputId,
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

export default Textarea;

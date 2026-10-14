import type { FormScope } from "@rvf/react";
import { useField } from "@rvf/react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useId } from "react";
import { twMerge } from "tailwind-merge";
import InputError from "./InputError";

export type Option<Value extends string | number> = {
  label: ReactNode;
  value: Value;
  subText?: string;
  id?: string;
};

type BaseInputProps = Omit<ComponentPropsWithRef<"input">, "type">;

interface RadioGroupProps<
  FormData,
  Value extends string | number = string,
> extends BaseInputProps {
  scope: FormScope<FormData>;
  options: readonly Option<Value>[];
  className?: string;
  error?: string | null;
  warningInsteadOfError?: boolean;
}

function RadioGroup<FormData, Value extends string | number = string>({
  scope,
  options,
  "aria-labelledby": ariaLabelledby,
  className,
  error,
  warningInsteadOfError,
  required = true,
  ...rest
}: Readonly<RadioGroupProps<FormData, Value>>) {
  const field = useField(scope);
  const errorId = useId();
  const hasError = !!(error || field.error()) && !warningInsteadOfError;
  const hasWarning = !!(error || field.error()) && warningInsteadOfError;

  /*
   Use div[role="radiogroup"] instead of a fieldset with legend since our forms
   use headings to indicate these form sections.
   The alternative, putting the heading inside the label, is generally
   discouraged because it creates extra noise.
  */
  return (
    <div
      role="radiogroup"
      className={twMerge("kern-fieldset__body", className)}
      aria-labelledby={ariaLabelledby}
      aria-errormessage={hasError ? errorId : undefined}
      aria-invalid={field.error() ? "true" : undefined}
    >
      {options.map((opt, idx) => {
        const id = opt.id ?? `${String(field.name())}-${idx}`;

        return (
          <p className="kern-form-check" key={id}>
            <input
              {...field.getInputProps({
                type: "radio",
                id: id,
                "aria-errormessage": hasError ? errorId : undefined,
                "aria-invalid": hasError || hasWarning,
                "aria-required": required,
                className: twMerge(
                  "kern-form-check__radio self-start",
                  (hasError || hasWarning) &&
                    "bg-yellow-200 border-yellow-700 text-black focus:border-4 focus:border-yellow-700 focus:outline-none",
                ),
                value: opt.value,
                ...rest,
              })}
            />
            <label htmlFor={id} className="kern-label">
              {opt.label}
              {opt.subText && (
                <span className="text-kern-layout-text-muted">
                  {opt.subText}
                </span>
              )}
            </label>
          </p>
        );
      })}

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

export default RadioGroup;

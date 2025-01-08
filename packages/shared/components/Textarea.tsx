import type { ChangeEvent, ReactNode } from "react";
import { twJoin } from "tailwind-merge";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import InputWarning from "./InputWarning.tsx";
import RichText from "./RichText";

type TextareaProps = Readonly<{
  name: string;
  description?: string;
  label?: ReactNode;
  placeholder?: string;
  formId?: string;
  error?: string | null;
  warning?: string | null;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}>;

const Textarea = ({
  name,
  description,
  label,
  error,
  warning,
  onChange,
  ...props
}: TextareaProps) => {
  const errorId = `${name}-error`;
  const warningId = `${name}-warning`;

  return (
    <div>
      {label && (
        <InputLabel
          classname={description ? "ds-heading-03-reg" : "text-gray-900"}
          id={name}
        >
          {label}
        </InputLabel>
      )}
      {description && (
        <RichText className="ds-body-01-reg" markdown={description} />
      )}
      <textarea
        name={name}
        id={name}
        className={twJoin(
          "ds-textarea forced-color-adjust-none placeholder-gray-600",
          error && "has-error",
        )}
        aria-invalid={error !== undefined}
        aria-describedby={error ? errorId : undefined}
        aria-errormessage={error ? errorId : undefined}
        onChange={onChange}
        {...props}
      />
      {error && <InputError id={errorId}>{error}</InputError>}
      {warning && <InputWarning id={warningId}>{warning}</InputWarning>}
    </div>
  );
};

export default Textarea;

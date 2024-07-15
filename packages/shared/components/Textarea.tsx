import classNames from "classnames";
import type { ReactNode } from "react";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import RichText from "./RichText";

type TextareaProps = Readonly<{
  name: string;
  description?: string;
  label?: ReactNode;
  placeholder?: string;
  formId?: string;
  error?: string;
}>;

const Textarea = ({
  name,
  description,
  label,
  error,
  ...props
}: TextareaProps) => {
  const errorId = `${name}-error`;

  return (
    <div className="ds-stack-8">
      {label && (
        <InputLabel
          classname={description ? "ds-heading-03-reg" : ""}
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
        className={classNames(
          "ds-textarea forced-color-adjust-none placeholder-gray-600",
          {
            "has-error": error,
          },
        )}
        aria-invalid={error !== undefined}
        aria-describedby={error && errorId}
        aria-errormessage={error && errorId}
        {...props}
      />
      {error && <InputError id={errorId}>{error}</InputError>}
    </div>
  );
};

export default Textarea;

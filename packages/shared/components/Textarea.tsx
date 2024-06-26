import classNames from "classnames";
import type { ReactNode } from "react";
import type {
  FieldValues,
  GlobalError,
  UseFormRegister,
} from "react-hook-form";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import RichText from "./RichText";

type TextareaProps = Readonly<{
  name: string;
  description?: string;
  label?: ReactNode;
  placeholder?: string;
  formRegister: UseFormRegister<FieldValues>;
  required?: boolean | string;
  error?: GlobalError;
  formId?: string;
}>;

const Textarea = ({
  name,
  description,
  label,
  formRegister,
  required,
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
        id={name}
        {...formRegister(name, { required })}
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
      {error && <InputError id={errorId}>{error.message}</InputError>}
    </div>
  );
};

export default Textarea;

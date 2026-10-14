import InputError from "@/components/InputError";
import type { PrinzipAspekt } from "@/content.config";
import { slugify } from "@/utils/utilFunctions";
import type { FormScope } from "@rvf/react";
import { useField } from "@rvf/react";
import type { ReactNode } from "react";
import { useCallback, useId } from "react";
import { Pill } from "./Pill";

type AspectPillsProps = {
  aspekte: PrinzipAspekt[];
  scope: FormScope<string[] | undefined>;
  children: ReactNode;
  description?: ReactNode;
  error?: string | null;
  warningInsteadOfError?: boolean;
};

export default function AspectPills({
  aspekte,
  scope,
  children,
  description,
  error,
  warningInsteadOfError,
}: Readonly<AspectPillsProps>) {
  const field = useField(scope);

  const errorId = useId();
  const descriptionId = useId();
  const control = field.getControlProps();
  const selectedAspects = control.value;

  // fix for rvfs broken validation on controlled array elements (only show error when no aspects)
  const noneSelected = !selectedAspects?.length;
  const hasError =
    !!(error || field.error()) && !warningInsteadOfError && noneSelected;
  const hasWarning =
    !!(error || field.error()) && !!warningInsteadOfError && noneSelected;

  const toggle = useCallback(
    (value: string) => {
      const next = selectedAspects?.includes(value)
        ? selectedAspects.filter((v) => v !== value)
        : [...(selectedAspects ?? []), value];
      control.onChange(next);
    },
    [selectedAspects, control],
  );

  return (
    <fieldset
      className="space-y-8"
      aria-describedby={description ? descriptionId : undefined}
      aria-invalid={!hasError || hasWarning}
      aria-errormessage={hasError || hasWarning ? errorId : undefined}
    >
      <legend>{children}</legend>
      {description && (
        <span
          className="text-kern-layout-text-default block"
          id={descriptionId}
        >
          {description}
        </span>
      )}
      <div className="flex flex-wrap gap-16">
        {aspekte.map((aspekt) => {
          const label = aspekt.Kurzbezeichnung;
          const value = slugify(label);
          const selected = !!selectedAspects?.includes(value);
          return (
            <Pill
              key={value}
              label={label}
              value={value}
              selected={selected}
              onClick={toggle}
            />
          );
        })}
      </div>
      {(hasError || hasWarning) && (
        <InputError
          id={errorId}
          look={warningInsteadOfError ? "warning" : "error"}
        >
          {error || field.error()}
        </InputError>
      )}
    </fieldset>
  );
}

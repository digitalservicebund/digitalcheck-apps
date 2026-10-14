import InputError from "@/components/InputError";
import type { Option } from "@/utils/keyValue.ts";
import { Check } from "@digitalservicebund/icons";
import {
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Field,
  Combobox as HeadlessCombobox,
  Label,
} from "@headlessui/react";
import type { FormScope } from "@rvf/react";
import { useField } from "@rvf/react";
import { type ReactNode, useId } from "react";

export type ComboboxProps = {
  options: Readonly<Option[]>;
  scope: FormScope<string[] | undefined>;
  children?: ReactNode;
  description?: ReactNode;
  error?: string | null;
  warningInsteadOfError?: boolean;
};

export default function Combobox({
  options,
  scope,
  children,
  description,
  error,
  warningInsteadOfError,
}: Readonly<ComboboxProps>) {
  const field = useField(scope);
  const legendId = useId();
  const errorId = useId();
  const descriptionId = useId();
  const control = field.getControlProps();
  const selectedValues = control.value ?? [];
  const selectedSet = new Set(selectedValues);

  // fix for rvf's broken validation on controlled array elements (only show error when no options provided)
  const noneSelected = selectedValues.length === 0;
  const hasError =
    !!(error || field.error()) && !warningInsteadOfError && noneSelected;
  const hasWarning =
    !!(error || field.error()) && !!warningInsteadOfError && noneSelected;

  const displayValue = options
    .filter((option) => selectedSet.has(option.value))
    .map((option) => option.label)
    .join(", ");

  return (
    <Field className="space-y-8">
      {children && <Label className="kern-label">{children}</Label>}
      {description && (
        <Description className="kern-body block">{description}</Description>
      )}

      <HeadlessCombobox
        multiple
        immediate
        value={selectedValues}
        onChange={control.onChange}
      >
        <div className={"h-auto"}>
          <div className={"kern-form-input__select-wrapper relative"}>
            <ComboboxInput
              data-multiple={selectedValues.length > 1 ? true : undefined}
              value={displayValue}
              className={
                "kern-form-input__select bg-white pr-32 data-multiple:text-sm"
              }
              aria-labelledby={children ? legendId : undefined}
              aria-describedby={description ? descriptionId : undefined}
            ></ComboboxInput>
          </div>
        </div>
        <ComboboxOptions
          anchor="bottom"
          className="border-kern-decorative-border w-(--input-width) space-y-8 border bg-white shadow-lg empty:invisible"
        >
          {options.map((option) => {
            return (
              <ComboboxOption
                key={option.value}
                value={option.value}
                className="group data-focus:bg-kern-darkblue-050 flex p-8"
              >
                <div className="grow">{option.label}</div>
                <Check className={"hidden group-data-selected:block"} />
              </ComboboxOption>
            );
          })}
        </ComboboxOptions>
      </HeadlessCombobox>

      {(hasError || hasWarning) && (
        <InputError
          id={errorId}
          look={warningInsteadOfError ? "warning" : "error"}
        >
          {error || field.error()}
        </InputError>
      )}
    </Field>
  );
}

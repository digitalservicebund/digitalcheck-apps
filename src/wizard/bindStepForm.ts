import type { ReadableAtom } from "nanostores";
import { z } from "zod";

type Value = string | string[] | undefined;

/** The parts of a wizard store (see createWizardStore) the form needs */
type StepFormStore = {
  $data: ReadableAtom<Record<string, unknown>>;
  $session: ReadableAtom<
    { pageSchema?: unknown; nextPath: () => string | undefined } | undefined
  >;
  // Method syntax, so stores with narrower user data are accepted
  save(this: void, values: Record<string, Value>): void;
};

// Our fields only have string values, no files
const getString = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value : undefined;
};

// Fields with an array schema (e.g. checkboxes) have several values
const isMultiValue = (schema: z.ZodType): boolean =>
  schema instanceof z.ZodOptional
    ? isMultiValue(schema.unwrap() as z.ZodType)
    : schema instanceof z.ZodArray;

/**
 * Connects a step's <form> to the wizard store, so the step itself is plain
 * markup. Fields are found by their `name`:
 *
 * - prefills the controls from the store, also when it changes later (e.g. in another tab)
 * - saves each valid value right away, so it's kept however the user leaves the page;
 *   fields with an array schema (e.g. checkboxes) are saved as a list
 * - shows/hides <ShowIf> fieldsets; their `disabled` excludes the fields from the values
 * - shows warnings from the page schema of the flow, but never blocks: they appear
 *   once the page has stored answers (e.g. when coming back) and update while typing
 * - logs an error if the page schema and the form's controls don't match
 *
 * Warnings are shown in the `[data-wizard-error]` of the field's `[data-wizard-field]`,
 * styling relies on `aria-invalid`.
 */
export const bindStepForm = (
  form: HTMLFormElement,
  { $data, $session, save }: StepFormStore,
  /** Field schemas of the wizard, to save only valid values */
  fields: Readonly<Record<string, z.ZodType>>,
) => {
  const pageSchema = $session.get()?.pageSchema as z.ZodObject | undefined;
  const shape: Record<string, z.ZodType> = pageSchema?.shape ?? {};
  const names = Object.keys(shape);
  let showWarnings = false;

  const controlsOf = (name: string) =>
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      `[name="${CSS.escape(name)}"]`,
    );

  // Without matching controls, answers are neither saved nor checked
  const checkConsistency = () => {
    const missing = names.filter((name) => controlsOf(name).length === 0);
    const unknown = Array.from(form.elements)
      .map((element) => element.getAttribute("name"))
      .filter((name): name is string => !!name && !names.includes(name));
    if (missing.length || unknown.length) {
      console.error(
        `bindStepForm: the form doesn't match the page schema of ${globalThis.location.pathname}.`,
        { missing, unknown },
      );
    }
  };

  // Disabled controls (in hidden <ShowIf>s) are missing from FormData
  const readValue = (formData: FormData, name: string): Value => {
    if (!isMultiValue(shape[name])) return getString(formData, name);
    // An empty list could also mean hidden, which has no value
    if (controlsOf(name)[0]?.matches(":disabled")) return undefined;
    return formData
      .getAll(name)
      .filter((value): value is string => typeof value === "string");
  };

  const readValues = () => {
    const formData = new FormData(form);
    return Object.fromEntries(
      names.map((name) => [name, readValue(formData, name)]),
    );
  };

  const writeValue = (name: string, value: unknown) => {
    controlsOf(name).forEach((control) => {
      if (control.type === "radio" || control.type === "checkbox") {
        (control as HTMLInputElement).checked = Array.isArray(value)
          ? value.includes(control.value)
          : control.value === value;
      } else if (control.value !== (value ?? "")) {
        // Only on change, to keep the cursor position while typing
        control.value = typeof value === "string" ? value : "";
      }
    });
  };

  const updateShowIfs = () => {
    form
      .querySelectorAll<HTMLFieldSetElement>("[data-wizard-show-if]")
      .forEach((fieldset) => {
        const {
          wizardShowIf = "",
          wizardShowIs,
          wizardShowNot,
        } = fieldset.dataset;
        // Read in document order, so a nested <ShowIf> sees the outer one's state
        const value = getString(new FormData(form), wizardShowIf);
        const is = wizardShowIs && (JSON.parse(wizardShowIs) as string[]);
        const not = wizardShowNot && (JSON.parse(wizardShowNot) as string[]);
        const isShown =
          value !== undefined &&
          (!is || is.includes(value)) &&
          (!not || !not.includes(value));
        fieldset.hidden = !isShown;
        fieldset.disabled = !isShown;
      });
  };

  const renderWarnings = () => {
    const issues = pageSchema?.safeParse(readValues()).error?.issues ?? [];
    form
      .querySelectorAll<HTMLElement>("[data-wizard-field]")
      .forEach((field) => {
        const name = field.dataset.wizardField ?? "";
        const message = issues.find((issue) => issue.path[0] === name)?.message;
        const warning = field.querySelector<HTMLElement>("[data-wizard-error]");
        if (warning) warning.hidden = !message;
        const warningText = field.querySelector("[data-wizard-error-text]");
        if (warningText) warningText.textContent = message ?? "";
        field.querySelectorAll("[aria-errormessage]").forEach((control) => {
          if (message) control.setAttribute("aria-invalid", "true");
          else control.removeAttribute("aria-invalid");
        });
      });
  };

  const handleChange = (event: Event) => {
    const { name } = event.target as HTMLInputElement;
    if (names.includes(name)) {
      const value = readValue(new FormData(form), name);
      // Invalid values (e.g. a cleared text) are removed, not kept as before
      const isValid = fields[name]?.safeParse(value).success;
      save({ [name]: isValid ? value : undefined });
    }
    updateShowIfs();
    if (showWarnings) renderWarnings();
  };

  // "Weiter" is a link in the button bar; this handles Enter in a text input
  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const nextPath = $session.get()?.nextPath();
    if (nextPath) globalThis.location.href = nextPath;
  };

  checkConsistency();
  const unsubscribe = $data.subscribe((data: Record<string, unknown>) => {
    names.forEach((name) => writeValue(name, data[name]));
    updateShowIfs();
    if (showWarnings) renderWarnings();
  });
  // Answers stored before this visit mean the page was filled before,
  // so its gaps are worth a warning. Not on the first visit, while answering.
  const storedData: Record<string, unknown> = $data.get();
  showWarnings = names.some((name) => storedData[name] !== undefined);
  if (showWarnings) renderWarnings();
  form.addEventListener("input", handleChange);
  form.addEventListener("submit", handleSubmit);

  return () => {
    unsubscribe();
    form.removeEventListener("input", handleChange);
    form.removeEventListener("submit", handleSubmit);
  };
};

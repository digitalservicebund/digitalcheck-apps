import type { ReadableAtom } from "nanostores";
import { z } from "zod";

type Item = Record<string, string | string[]>;
type Value = string | string[] | Item[] | undefined;

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

const getStrings = (formData: FormData, name: string) =>
  formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string");

const unwrap = (schema: z.ZodType): z.ZodType =>
  schema instanceof z.ZodOptional
    ? unwrap(schema.unwrap() as z.ZodType)
    : schema;

// Fields with an array schema of objects are lists of items (see ListField.astro),
// their controls are named `list.index.key`
const itemShapeOf = (schema: z.ZodType | undefined) => {
  const array = schema && unwrap(schema);
  if (!(array instanceof z.ZodArray)) return undefined;
  const item = unwrap(array.element as z.ZodType);
  return item instanceof z.ZodObject ? item.shape : undefined;
};

// Fields with any other array schema (e.g. checkboxes) have several values
const isMultiValue = (schema: z.ZodType) =>
  unwrap(schema) instanceof z.ZodArray && !itemShapeOf(schema);

/**
 * Connects a step's <form> to the wizard store, so the step itself is plain
 * markup. Fields are found by their `name`:
 *
 * - prefills the controls from the store, also when it changes later (e.g. in another tab)
 * - saves each valid value right away, so it's kept however the user leaves the page;
 *   fields with an array schema (e.g. checkboxes) are saved as a list
 * - renders the items of list fields (see ListField.astro) and adds or removes them
 * - dispatches `wizard:update` on the form after writing values from the store,
 *   for components that show them (e.g. the selection of a MultiSelectField)
 * - shows/hides <ShowIf> fieldsets; their `disabled` excludes the fields from the values
 * - shows warnings from the page schema of the flow, but never blocks: they appear
 *   once the page has stored answers (e.g. when coming back) and update while typing
 * - logs an error if the page schema and the form's controls don't match
 *
 * Warnings are shown in the `[data-wizard-error]` of the field's `[data-wizard-field]`,
 * whose name is the issue's path (e.g. `list.0.key`), styling relies on `aria-invalid`.
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
    form.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >(`[name="${CSS.escape(name)}"]`);

  const listOf = (name: string) =>
    form.querySelector<HTMLElement>(`[data-wizard-list="${CSS.escape(name)}"]`);

  const itemsOf = (list: HTMLElement) =>
    list.querySelector<HTMLElement>("[data-wizard-list-items]")!;

  // Without matching controls, answers are neither saved nor checked
  const checkConsistency = () => {
    const missing = names.filter((name) =>
      itemShapeOf(shape[name]) ? !listOf(name) : !controlsOf(name).length,
    );
    const unknown = Array.from(form.elements)
      .map((element) => element.getAttribute("name"))
      .filter(
        (name): name is string => !!name && !names.includes(name.split(".")[0]),
      );
    if (missing.length || unknown.length) {
      console.error(
        `bindStepForm: the form doesn't match the page schema of ${globalThis.location.pathname}.`,
        { missing, unknown },
      );
    }
  };

  // Renders the items of a list from its <template>, keeping existing ones
  // (and the focus in them), so the values can be written by name afterwards
  const setItemCount = (name: string, count: number) => {
    const list = listOf(name);
    if (!list) return;
    const items = itemsOf(list);
    const template = list.querySelector("template")!.innerHTML;
    while (items.children.length > count) items.lastElementChild!.remove();
    while (items.children.length < count) {
      const index = items.children.length;
      items.insertAdjacentHTML(
        "beforeend",
        template
          .replaceAll("{index}", String(index))
          .replaceAll("{number}", String(index + 1)),
      );
    }
    list
      .querySelectorAll<HTMLElement>("[data-wizard-list-remove]")
      .forEach((button) => (button.hidden = count === 1));
  };

  // Disabled controls (in hidden <ShowIf>s) are missing from FormData
  const readValue = (formData: FormData, name: string): Value => {
    const itemShape = itemShapeOf(shape[name]);
    if (itemShape) {
      const list = listOf(name);
      if (!list || list.querySelector("[name]:disabled")) return undefined;
      return Array.from(itemsOf(list).children, (_, index) =>
        Object.fromEntries(
          Object.entries(itemShape).map(([key, schema]) => {
            const control = `${name}.${index}.${key}`;
            return [
              key,
              isMultiValue(schema as z.ZodType)
                ? getStrings(formData, control)
                : (getString(formData, control) ?? ""),
            ];
          }),
        ),
      );
    }
    if (!isMultiValue(shape[name])) return getString(formData, name);
    // An empty list could also mean hidden, which has no value
    if (controlsOf(name)[0]?.matches(":disabled")) return undefined;
    return getStrings(formData, name);
  };

  const readValues = () => {
    const formData = new FormData(form);
    return Object.fromEntries(
      names.map((name) => [name, readValue(formData, name)]),
    );
  };

  const writeValue = (name: string, value: unknown) => {
    const itemShape = itemShapeOf(shape[name]);
    if (itemShape) {
      const items = (Array.isArray(value) ? value : []) as Partial<Item>[];
      // An empty list shows one item to start with
      const count = Math.max(items.length, 1);
      setItemCount(name, count);
      for (let index = 0; index < count; index++) {
        Object.keys(itemShape).forEach((key) =>
          writeValue(`${name}.${index}.${key}`, items[index]?.[key]),
        );
      }
      return;
    }
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
        const message = issues.find(
          (issue) => issue.path.join(".") === name,
        )?.message;
        // Only the field's own elements, not those of fields nested in it
        // (e.g. in a list item)
        const own = (selector: string) =>
          Array.from(field.querySelectorAll<HTMLElement>(selector)).filter(
            (element) => element.closest("[data-wizard-field]") === field,
          );
        own("[data-wizard-error]").forEach((warning) => {
          warning.hidden = !message;
          const text = warning.querySelector("[data-wizard-error-text]");
          if (text) text.textContent = message ?? "";
        });
        own("[aria-errormessage]").forEach((control) => {
          if (message) control.setAttribute("aria-invalid", "true");
          else control.removeAttribute("aria-invalid");
        });
      });
  };

  const saveValue = (name: string, value: Value) => {
    // Invalid values (e.g. a cleared text) are removed, not kept as before
    const isValid = fields[name]?.safeParse(value).success;
    save({ [name]: isValid ? value : undefined });
  };

  const handleChange = (event: Event) => {
    // Controls of list items are named `list.index.key`
    const name = (event.target as HTMLInputElement).name.split(".")[0];
    if (names.includes(name))
      saveValue(name, readValue(new FormData(form), name));
    updateShowIfs();
    if (showWarnings) renderWarnings();
  };

  const handleListClick = (event: Event) => {
    const button = (event.target as Element).closest<HTMLElement>(
      "[data-wizard-list-add], [data-wizard-list-remove]",
    );
    const list = button?.closest<HTMLElement>("[data-wizard-list]");
    const name = list?.dataset.wizardList;
    if (!button || !list || !name || !names.includes(name)) return;

    const items = (readValue(new FormData(form), name) ?? []) as Item[];
    const itemElements = Array.from(itemsOf(list).children);
    let focusIndex: number;
    if (button.hasAttribute("data-wizard-list-add")) {
      const itemShape = itemShapeOf(shape[name])!;
      const empty = Object.fromEntries(
        Object.entries(itemShape).map(([key, schema]) => [
          key,
          isMultiValue(schema as z.ZodType) ? [] : "",
        ]),
      );
      saveValue(name, [...items, empty]);
      focusIndex = items.length;
    } else {
      const index = itemElements.findIndex((item) => item.contains(button));
      saveValue(
        name,
        items.filter((_, i) => i !== index),
      );
      // The item that took its place, or the new last one
      focusIndex = Math.min(index, items.length - 2);
    }
    // The store's subscription has rendered the items by now
    itemsOf(list)
      .children[focusIndex]?.querySelector<HTMLElement>("[name]")
      ?.focus();
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
    // Writing doesn't fire input events, components showing values update on this
    form.dispatchEvent(new Event("wizard:update", { bubbles: true }));
    updateShowIfs();
    if (showWarnings) renderWarnings();
  });
  // Answers stored before this visit mean the page was filled before,
  // so its gaps are worth a warning. Not on the first visit, while answering.
  const storedData: Record<string, unknown> = $data.get();
  showWarnings = names.some((name) => storedData[name] !== undefined);
  if (showWarnings) renderWarnings();
  form.addEventListener("input", handleChange);
  form.addEventListener("click", handleListClick);
  form.addEventListener("submit", handleSubmit);

  return () => {
    unsubscribe();
    form.removeEventListener("input", handleChange);
    form.removeEventListener("click", handleListClick);
    form.removeEventListener("submit", handleSubmit);
  };
};

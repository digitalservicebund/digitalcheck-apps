import type { z } from "zod";

/**
 * A field of a step, passed to the field components instead of its name.
 * Knows the ids that the components and the page share, e.g. the heading
 * that labels a radio group.
 */
export type StepField<Value = unknown> = {
  name: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  /** Type only, never set: the field's value, e.g. to check the options of a radio group */
  readonly value?: Value;
};

const stepField = (name: string): StepField => ({
  name,
  labelId: `${name}-label`,
  descriptionId: `${name}-description`,
  errorId: `${name}-error`,
});

type StepFieldsOf<Shape extends z.ZodRawShape> = {
  [Name in Extract<keyof Shape, string>]: StepField<
    NonNullable<z.output<Shape[Name]>>
  >;
};

/** Handles for the fields of a page schema, so a step can only use its own fields. */
export const stepFields = <S extends z.ZodObject>(schema: S) =>
  Object.fromEntries(
    Object.keys(schema.shape).map((name) => [name, stepField(name)]),
  ) as StepFieldsOf<S["shape"]>;

/**
 * Handles for the fields of one item of a list field (see `ListField.astro`),
 * e.g. `verbindliche-anforderungen.{index}.titel`. The list replaces `{index}`
 * for each item it renders.
 */
export const stepListFields = <S extends z.ZodObject>(
  list: StepField<unknown[]>,
  itemSchema: S,
) =>
  Object.fromEntries(
    Object.keys(itemSchema.shape).map((key) => [
      key,
      stepField(`${list.name}.{index}.${key}`),
    ]),
  ) as StepFieldsOf<S["shape"]>;

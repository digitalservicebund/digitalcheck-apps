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

/** Handles for the fields of a page schema, so a step can only use its own fields. */
export const stepFields = <S extends z.ZodObject>(schema: S) =>
  Object.fromEntries(
    Object.keys(schema.shape).map((name) => [
      name,
      {
        name,
        labelId: `${name}-label`,
        descriptionId: `${name}-description`,
        errorId: `${name}-error`,
      },
    ]),
  ) as {
    [Name in Extract<keyof S["shape"], string>]: StepField<
      NonNullable<z.output<S["shape"][Name]>>
    >;
  };

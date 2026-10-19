import type { FieldValues, FormOpts } from "@rvf/react";
import { useForm } from "@rvf/react";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { navigate } from "astro:transitions/client";
import { useEffect, useState } from "react";

type UseSyncedFormParams<
  SchemaInput extends FieldValues,
  SchemaOutput,
  SubmitResponseData,
  T = FormOpts<SchemaInput, SchemaOutput, SubmitResponseData>["defaultValues"],
> = FormOpts<SchemaInput, SchemaOutput, SubmitResponseData> & {
  currentUrl?: string;
  setDataCallback: (data: T) => void;
  nextUrl?: string;
  storedData?: T;
  schema: StandardSchemaV1<SchemaInput, SchemaOutput>;
};

export const useSyncedForm = <
  SchemaInput extends FieldValues,
  SchemaOutput,
  SubmitResponseData,
>({
  currentUrl,
  storedData,
  schema,
  defaultValues,
  setDataCallback,
  nextUrl,
}: UseSyncedFormParams<SchemaInput, SchemaOutput, SubmitResponseData>) => {
  const [formTouched, setFormTouched] = useState(false);

  const form = useForm({
    schema,
    defaultValues,
    validationBehaviorConfig: {
      whenSubmitted: "onSubmit",
      whenTouched: "onSubmit",
      initial: "onSubmit",
    },
    onBeforeSubmit: async ({ unvalidatedData }) => {
      if (!storedData) setDataCallback(unvalidatedData);
      // bypass submission
      if (nextUrl) await navigate(nextUrl);
    },
    handleSubmit: async () => {
      if (nextUrl) await navigate(nextUrl);
    },
  });

  useEffect(() => {
    const unsubscribe = form.subscribe.value((val) => {
      setFormTouched(true);
      setDataCallback(val);
    });

    if (storedData && !formTouched) {
      form.resetForm(storedData);
      void form.validate();
    }

    return () => unsubscribe();
  }, [form, formTouched, setDataCallback, currentUrl, storedData]);

  return form;
};

import type { FieldValues, FormOpts } from "@rvf/react";
import { useForm } from "@rvf/react";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getResultForAnswers } from "./getResultForAnswers";
import type { PreCheckResultSchema } from "./preCheckDataSchema";
import {
  getPreCheckData,
  getPreCheckDataServerSnapshot,
  getPreCheckDataSnapshot,
  subscribeToPreCheckData,
} from "./preCheckDataService";

type UseSyncedFormParams<
  SchemaInput extends FieldValues,
  SchemaOutput,
  SubmitResponseData,
  T = FormOpts<SchemaInput, SchemaOutput, SubmitResponseData>["defaultValues"],
> = FormOpts<SchemaInput, SchemaOutput, SubmitResponseData> & {
  currentUrl?: string;
  storedData?: T;
  schema: StandardSchemaV1<SchemaInput, SchemaOutput>;
  initialValidate?: boolean;
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
  initialValidate,
  ...rest
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
    ...rest,
  });

  useEffect(() => {
    const unsubscribe = form.subscribe.value(() => {
      setFormTouched(true);
    });

    if (storedData && !formTouched) {
      form.resetForm(storedData);
      if (initialValidate) void form.validate();
    }

    return () => unsubscribe();
  }, [form, formTouched, currentUrl, storedData, initialValidate]);

  return form;
};

export const usePreCheckData = () => {
  const preCheckData = useSyncExternalStore(
    subscribeToPreCheckData,
    getPreCheckDataSnapshot,
    getPreCheckDataServerSnapshot,
  );

  // trigger a client-side re-render to transition from SSR to CSR
  useEffect(() => {
    getPreCheckData();
  }, []);

  if (preCheckData?.ssr)
    return {
      resultData: undefined,
      firstUnansweredQuestionIndex: null,
      answerForQuestionId: () => undefined,
      answers: [],
      hasData: true,
      result: undefined,
    };

  const hasData = preCheckData.answers && preCheckData.answers.length > 0;

  const answers = preCheckData.answers;
  const answerForQuestionId = (questionId: string) => {
    return answers.find((answer) => answer.questionId === questionId);
  };

  const firstUnansweredQuestionIndex = answers ? answers.length : -1;

  const result = getResultForAnswers(answers);

  const resultData = {
    title: preCheckData.title,
    negativeReasoning: preCheckData.negativeReasoning,
    result: result?.digital,
  } as PreCheckResultSchema;

  return {
    resultData,
    firstUnansweredQuestionIndex,
    answerForQuestionId,
    answers,
    hasData,
    result,
  };
};

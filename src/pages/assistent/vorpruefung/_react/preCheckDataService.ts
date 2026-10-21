import type { VersionedData } from "@/utils/localStorageVersioned";
import {
  readVersionedDataFromLocalStorage,
  removeFromLocalStorage,
  writeVersionedDataToLocalStorage,
} from "@/utils/localStorageVersioned";
import type {
  PreCheckAnswerSchema,
  PreCheckDataSchema,
  PreCheckResultSchema,
} from "./preCheckDataSchema";

export const DATA_SCHEMA_VERSION = "1";
export const STORAGE_KEY = "preCheckData";

export type PreCheckData = Omit<PreCheckDataSchema, "result"> &
  VersionedData & {
    ssr?: boolean;
  };

export const initialPreCheckData: PreCheckData = {
  version: DATA_SCHEMA_VERSION,
  title: "",
  negativeReasoning: "",
  answers: [],
};

const ssrPreCheckData = {
  ...initialPreCheckData,
  ssr: true,
};

let cachedPreCheckData: PreCheckData | undefined = undefined;
let listeners: (() => void)[] = [];

function writeToStorage(data: PreCheckData): void {
  writeVersionedDataToLocalStorage(data, STORAGE_KEY);
}

export function getPreCheckData(): PreCheckData {
  const storedData =
    readVersionedDataFromLocalStorage<PreCheckData>(
      STORAGE_KEY,
      DATA_SCHEMA_VERSION,
    ) ?? initialPreCheckData;

  if (cachedPreCheckData !== storedData) {
    cachedPreCheckData = storedData;
    emitChange();
  }

  return storedData;
}

export function createOrUpdatePreCheckData(data: PreCheckData): void {
  writeToStorage(data);
  cachedPreCheckData = data;
  emitChange();
}

export function deletePreCheckData(): void {
  removeFromLocalStorage(STORAGE_KEY);
  cachedPreCheckData = initialPreCheckData;
  emitChange();
}

export function setResult(result?: PreCheckResultSchema): void {
  if (!result) return;

  const data = getPreCheckData();
  createOrUpdatePreCheckData({
    ...data,
    ...result,
  });
}

export function addOrUpdateAnswer(newAnswer?: PreCheckAnswerSchema): void {
  if (!newAnswer) return;

  const data = getPreCheckData();
  const isNewAnswer = data.answers.every(
    ({ questionId }) => newAnswer.questionId !== questionId,
  );

  const updatedAnswers = isNewAnswer
    ? [...data.answers, newAnswer]
    : data.answers.map(({ questionId, answer }) => ({
        questionId,
        answer: questionId === newAnswer.questionId ? newAnswer.answer : answer,
      }));

  createOrUpdatePreCheckData({
    ...data,
    answers: updatedAnswers,
  });
}

export function subscribeToPreCheckData(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export const getPreCheckDataSnapshot = () => {
  if (cachedPreCheckData !== undefined) return cachedPreCheckData;
  return getPreCheckData();
};
export const getPreCheckDataServerSnapshot = () => ssrPreCheckData;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

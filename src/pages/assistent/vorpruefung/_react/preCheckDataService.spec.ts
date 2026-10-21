import {
  readVersionedDataFromLocalStorage,
  removeFromLocalStorage,
  writeVersionedDataToLocalStorage,
} from "@/utils/localStorageVersioned";
import { it, vi } from "vitest";
import { ResultType } from "./PreCheckResult";
import type {
  PreCheckAnswerSchema,
  PreCheckResultSchema,
} from "./preCheckDataSchema";
import type { PreCheckData } from "./preCheckDataService";
import {
  addOrUpdateAnswer,
  createOrUpdatePreCheckData,
  DATA_SCHEMA_VERSION,
  deletePreCheckData,
  getPreCheckData,
  getPreCheckDataServerSnapshot,
  getPreCheckDataSnapshot,
  initialPreCheckData,
  setResult,
  STORAGE_KEY,
  subscribeToPreCheckData,
} from "./preCheckDataService";

vi.mock("@/utils/localStorageVersioned", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/utils/localStorageVersioned")>();

  return {
    ...actual,
    readVersionedDataFromLocalStorage: vi.fn(),
    writeVersionedDataToLocalStorage: vi.fn(),
    removeFromLocalStorage: vi.fn(),
  };
});

const mockData: PreCheckData = {
  version: DATA_SCHEMA_VERSION,
  answers: [{ answer: "no", questionId: "question1" }],
  title: "Title",
  negativeReasoning: "Reasoning",
  ssr: false,
};

describe("PreCheck Data Service", () => {
  const mockSubscribeListener = vi.fn();
  let unsubscribe: () => void;

  beforeEach(() => {
    unsubscribe = subscribeToPreCheckData(mockSubscribeListener);
    vi.mocked(readVersionedDataFromLocalStorage).mockReturnValue(mockData);
  });

  afterEach(() => {
    unsubscribe();

    // to reset caching
    deletePreCheckData();

    vi.clearAllMocks();
  });

  describe("getPreCheckDataServerSnapshot", () => {
    it("returns an initial data set", () => {
      expect(getPreCheckDataServerSnapshot()).toMatchObject({
        ...initialPreCheckData,
        ssr: true,
      });
    });
  });

  describe("getPreCheckData", () => {
    it("returns stored data", () => {
      expect(getPreCheckDataSnapshot()).toBe(initialPreCheckData);
      expect(getPreCheckData()).toBe(mockData);
      expect(mockSubscribeListener).toHaveBeenCalledOnce();
      expect(getPreCheckDataSnapshot()).toBe(mockData);
    });

    it("returns initial data when nothing is stored", () => {
      expect(getPreCheckDataSnapshot()).toBe(initialPreCheckData);
      vi.mocked(readVersionedDataFromLocalStorage).mockReturnValueOnce(null);
      expect(getPreCheckData()).toBe(initialPreCheckData);
      expect(mockSubscribeListener).not.toHaveBeenCalled();
      expect(getPreCheckDataSnapshot()).toBe(initialPreCheckData);
    });
  });

  describe("createOrUpdatePreCheckData", () => {
    it("updates the preCheckData", () => {
      const newData: PreCheckData = {
        ...mockData,
        title: "different title",
      };

      expect(getPreCheckDataSnapshot()).toBe(initialPreCheckData);
      createOrUpdatePreCheckData(newData);
      expect(writeVersionedDataToLocalStorage).toHaveBeenCalledWith(
        newData,
        STORAGE_KEY,
      );
      expect(mockSubscribeListener).toHaveBeenCalledOnce();
      expect(getPreCheckDataSnapshot()).toBe(newData);
    });
  });

  describe("deletePreCheckData", () => {
    it("deletes the saved preCheckData", () => {
      const newData: PreCheckData = {
        ...mockData,
        title: "different title",
      };

      expect(getPreCheckDataSnapshot()).toBe(initialPreCheckData);

      createOrUpdatePreCheckData(newData);

      expect(getPreCheckDataSnapshot()).toBe(newData);
      expect(mockSubscribeListener).toHaveBeenCalledOnce();

      deletePreCheckData();

      expect(removeFromLocalStorage).toHaveBeenCalledWith(STORAGE_KEY);
      expect(mockSubscribeListener).toHaveBeenCalledTimes(2);
      expect(getPreCheckDataSnapshot()).toBe(initialPreCheckData);
    });
  });

  describe("setResult", () => {
    it("saves the new result data", () => {
      const newResult: PreCheckResultSchema = {
        title: "New Title",
        negativeReasoning: "New Reasoning",
        result: ResultType.NEGATIVE,
      };

      expect(getPreCheckDataSnapshot()).toBe(initialPreCheckData);

      setResult(newResult);

      expect(writeVersionedDataToLocalStorage).toHaveBeenCalledWith(
        { ...mockData, ...newResult },
        STORAGE_KEY,
      );
      expect(mockSubscribeListener).toHaveBeenCalledTimes(2);
      expect(getPreCheckDataSnapshot()).toMatchObject({
        ...mockData,
        ...newResult,
      });
    });
  });

  describe("addOrUpdateAnswer", () => {
    it("saves new answers", () => {
      const newAnswer: PreCheckAnswerSchema = {
        questionId: "question2",
        answer: "Nein",
      };

      expect(getPreCheckDataSnapshot()).toBe(initialPreCheckData);

      addOrUpdateAnswer(newAnswer);

      expect(writeVersionedDataToLocalStorage).toHaveBeenCalledWith(
        { ...mockData, answers: [...mockData.answers, newAnswer] },
        STORAGE_KEY,
      );
      expect(mockSubscribeListener).toHaveBeenCalledTimes(2);

      expect(getPreCheckDataSnapshot()).toMatchObject({
        ...mockData,
        answers: [...mockData.answers, newAnswer],
      });
    });

    it("updates existing answers", () => {
      const updatedAnswer: PreCheckAnswerSchema = {
        questionId: mockData.answers[0].questionId,
        answer: "Nein",
      };

      expect(getPreCheckDataSnapshot()).toBe(initialPreCheckData);

      addOrUpdateAnswer(updatedAnswer);

      expect(writeVersionedDataToLocalStorage).toHaveBeenCalledWith(
        { ...mockData, answers: [updatedAnswer] },
        STORAGE_KEY,
      );
      expect(mockSubscribeListener).toHaveBeenCalledTimes(2);

      expect(getPreCheckDataSnapshot()).toMatchObject({
        ...mockData,
        answers: [updatedAnswer],
      });
    });
  });
});

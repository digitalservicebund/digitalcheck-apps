// Import mocks first
import "@/pages/dokumentation/_react/testUtils/mockLocalStorageVersioned";
// End of mocks
import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  readDataFromLocalStorage,
  removeFromLocalStorage,
  writeVersionedDataToLocalStorage,
} from "@/utils/localStorageVersioned";
import {
  DocumentationDataProvider,
  STORAGE_KEY,
  useDocumentationDataService,
} from "./DocumentationDataProvider";
import type { DocumentationData, Principle } from "./documentationDataSchema";
import { DATA_SCHEMA_VERSION } from "./documentationDataSchema";

const mockRead = vi.mocked(readDataFromLocalStorage);
const mockWrite = vi.mocked(writeVersionedDataToLocalStorage);
const mockRemove = vi.mocked(removeFromLocalStorage);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DocumentationDataProvider>{children}</DocumentationDataProvider>
);

const baseData: DocumentationData = {
  version: DATA_SCHEMA_VERSION,
  initialized: true,
};

describe("DocumentationDataProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRead.mockReturnValue(null);
  });

  describe("documentationData (initial load)", () => {
    it("returns data from localStorage on mount", async () => {
      const storedData: DocumentationData = {
        ...baseData,
        policyTitle: {
          title: "Stored Title",
          organization: "Stored organization",
        },
      };
      mockRead.mockReturnValue(storedData);

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      expect(result.current.documentationData).toEqual(storedData);
    });

    it("returns empty state when localStorage returns null", async () => {
      mockRead.mockReturnValue(null);

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      expect(result.current.documentationData).toEqual(baseData);
    });
  });

  describe("deleteDocumentationData", () => {
    it("calls removeFromLocalStorage with STORAGE_KEY", async () => {
      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      act(() => result.current.deleteDocumentationData());

      expect(mockRemove).toHaveBeenCalledWith(STORAGE_KEY);
    });
  });

  describe("createOrUpdateDocumentationData", () => {
    it("writes single field data to localStorage", async () => {
      const data: DocumentationData = {
        ...baseData,
        policyTitle: { title: "My Policy", organization: "My Organization" },
      };

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      act(() => result.current.createOrUpdateDocumentationData(data));

      expect(mockWrite).toHaveBeenCalledWith(data, STORAGE_KEY);
    });

    it("writes complete data object to localStorage", async () => {
      const data: DocumentationData = {
        ...baseData,
        policyTitle: { title: "My Policy", organization: "My organization" },
        participation: { formats: "Workshops", results: "Results" },
        principles: [{ id: "p1", answer: "Nein", reasoning: "", aspects: [] }],
      };

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      act(() => result.current.createOrUpdateDocumentationData(data));

      expect(mockWrite).toHaveBeenCalledWith(data, STORAGE_KEY);
    });
  });

  describe("setPolicyTitle", () => {
    it("merges policyTitle into empty state when no prior data exists", async () => {
      mockRead.mockReturnValue(null);

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      act(() =>
        result.current.setPolicyTitle({
          title: "New Title",
          organization: "My Organization",
        }),
      );

      expect(mockWrite).toHaveBeenCalledWith(
        {
          ...baseData,
          policyTitle: { title: "New Title", organization: "My Organization" },
        },
        STORAGE_KEY,
      );
    });

    it("updates policyTitle while preserving existing data", async () => {
      const existingData: DocumentationData = {
        ...baseData,
        policyTitle: { title: "Old Title", organization: "Old Organization" },
        participation: { formats: "Online", results: "Some results" },
      };
      mockRead.mockReturnValue(existingData);

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      act(() =>
        result.current.setPolicyTitle({
          title: "Updated Title",
          organization: "Updated Organization",
        }),
      );

      expect(mockWrite).toHaveBeenCalledWith(
        {
          ...existingData,
          policyTitle: {
            title: "Updated Title",
            organization: "Updated Organization",
          },
        },
        STORAGE_KEY,
      );
    });
  });

  describe("setParticipation", () => {
    it("merges participation into empty state when no prior data exists", async () => {
      mockRead.mockReturnValue(null);

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      const participation = { formats: "Webinar", results: "Feedback" };
      act(() => result.current.setParticipation(participation));

      expect(mockWrite).toHaveBeenCalledWith(
        { ...baseData, participation },
        STORAGE_KEY,
      );
    });

    it("updates participation while preserving existing data", async () => {
      const existingData: DocumentationData = {
        ...baseData,
        policyTitle: { title: "My Policy", organization: "My Organization" },
        participation: { formats: "Old format", results: "Old results" },
      };
      mockRead.mockReturnValue(existingData);

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      const newParticipation = { formats: "Workshop", results: "New results" };
      act(() => result.current.setParticipation(newParticipation));

      expect(mockWrite).toHaveBeenCalledWith(
        { ...existingData, participation: newParticipation },
        STORAGE_KEY,
      );
    });
  });

  describe("addOrUpdatePrinciple", () => {
    const principle1: Principle = {
      id: "p1",
      answer: "Nein",
      reasoning: "",
      aspects: undefined,
    } as const;
    const principle2: Principle = {
      id: "p2",
      answer: "Nicht relevant",
      reasoning: "",
      aspects: undefined,
    } as const;

    it("adds principle when principles is undefined (no prior data)", async () => {
      mockRead.mockReturnValue(null);

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      act(() => result.current.addOrUpdatePrinciple(principle1));

      expect(mockWrite).toHaveBeenCalledWith(
        { ...baseData, principles: [principle1] },
        STORAGE_KEY,
      );
    });

    it("adds principle to an empty principles array", async () => {
      const existingData: DocumentationData = {
        ...baseData,
        principles: [],
      };
      mockRead.mockReturnValue(existingData);

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      act(() => result.current.addOrUpdatePrinciple(principle1));

      expect(mockWrite).toHaveBeenCalledWith(
        { ...existingData, principles: [principle1] },
        STORAGE_KEY,
      );
    });

    it("appends principle to existing principles array", async () => {
      const existingData: DocumentationData = {
        ...baseData,
        principles: [principle1],
      };
      mockRead.mockReturnValue(existingData);

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      act(() => result.current.addOrUpdatePrinciple(principle2));

      expect(mockWrite).toHaveBeenCalledWith(
        { ...existingData, principles: [principle1, principle2] },
        STORAGE_KEY,
      );
    });

    it("updates principle with matching id in-place, preserving other principles", async () => {
      const existingData: DocumentationData = {
        ...baseData,
        principles: [principle1, principle2],
      };
      mockRead.mockReturnValue(existingData);

      const { result } = renderHook(() => useDocumentationDataService(), {
        wrapper,
      });
      await act(async () => {});

      const updatedPrinciple1 = {
        id: "p1",
        answer: "Nicht relevant",
        reasoning: "Updated reasoning",
        aspects: undefined,
      } as const;
      act(() => result.current.addOrUpdatePrinciple(updatedPrinciple1));

      expect(mockWrite).toHaveBeenCalledWith(
        { ...existingData, principles: [updatedPrinciple1, principle2] },
        STORAGE_KEY,
      );
    });
  });
});

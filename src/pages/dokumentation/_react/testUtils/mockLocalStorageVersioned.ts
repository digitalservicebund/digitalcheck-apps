import { vi } from "vitest";

vi.mock("@/utils/localStorageVersioned", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/utils/localStorageVersioned")>();
  return {
    ...actual,
    readDataFromLocalStorage: vi.fn().mockReturnValue(null),
    readVersionedDataFromLocalStorage: vi.fn().mockReturnValue(null),
    writeVersionedDataToLocalStorage: vi.fn(),
    removeFromLocalStorage: vi.fn(),
  };
});

import { vorpruefung_hinweise } from "@/config/routes";
import { preCheck } from "@/resources/content/vorpruefung";
import { readVersionedDataFromLocalStorage } from "@/utils/localStorageVersioned";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PreCheckContinueActions } from "./PreCheckContinueActions";
import type { PreCheckData } from "./preCheckDataService";
import { DATA_SCHEMA_VERSION } from "./preCheckDataService";

vi.mock("@/utils/localStorageVersioned", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/utils/localStorageVersioned")>();
  return {
    ...actual,
    readVersionedDataFromLocalStorage: vi.fn(),
  };
});

const { questions } = preCheck;

describe("PreCheckContinueActions", () => {
  describe("with no existing data", () => {
    beforeEach(() => {
      render(<PreCheckContinueActions />);
    });

    it("renders the main CTA button to start vorpruefung", () => {
      const startButton = screen.getByRole("link", {
        name: "Vorprüfung starten",
      });
      expect(startButton).toHaveAttribute("href", vorpruefung_hinweise.path);
    });
  });

  describe("with already existing data, unfinished questions", () => {
    beforeEach(() => {
      vi.mocked(readVersionedDataFromLocalStorage).mockReturnValue({
        version: DATA_SCHEMA_VERSION,
        answers: [{ questionId: questions[0].id, answer: "yes" }],
        title: "",
        negativeReasoning: "",
        ssr: false,
      } as PreCheckData);

      render(<PreCheckContinueActions />);
    });

    it("renders the CTA button to continue vorpruefung at question 0", () => {
      const startButton = screen.getByRole("link", {
        name: "Vorprüfung fortsetzen",
      });
      expect(startButton).toHaveAttribute("href", questions[1].path);
    });

    it("renders the CTA button to restart vorpruefung", () => {
      const startButton = screen.getByRole("button", {
        name: "Neue Vorprüfung beginnen",
      });
      expect(startButton).toBeInTheDocument();
    });
  });

  describe("with already existing data, finished questions", () => {
    beforeEach(() => {
      vi.mocked(readVersionedDataFromLocalStorage).mockReturnValue({
        version: DATA_SCHEMA_VERSION,
        answers: new Array(6).fill(0).map((_, i) => ({
          questionId: questions[i].id,
          answer: "yes",
        })),
        title: "",
        negativeReasoning: "",
        ssr: false,
      } as PreCheckData);

      render(<PreCheckContinueActions />);
    });

    it("renders the CTA button to continue vorpruefung", () => {
      const startButton = screen.getByRole("link", {
        name: "Vorprüfung fortsetzen",
      });
      expect(startButton).toHaveAttribute("href", vorpruefung_hinweise.path);
    });

    it("renders the CTA button to restart vorpruefung", () => {
      const startButton = screen.getByRole("button", {
        name: "Neue Vorprüfung beginnen",
      });
      expect(startButton).toBeInTheDocument();
    });
  });
});

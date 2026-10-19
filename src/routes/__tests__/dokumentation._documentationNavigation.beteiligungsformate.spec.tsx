// Import mocks first
import "./utils/mockLocalStorageVersioned";
import "./utils/mockRouter";
// End of mocks

import { HelpPanelProvider } from "@/contexts/HelpPanelContext";
import { DocumentationParticipation } from "@/routes/dokumentation._documentationNavigation.beteiligungsformate";
import { readDataFromLocalStorage } from "@/utils/localStorageVersioned";
import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentationDataProvider } from "../dokumentation/DocumentationDataProvider";
import type { DocumentationData } from "../dokumentation/documentationDataSchema";
import { DATA_SCHEMA_VERSION } from "../dokumentation/documentationDataSchema";

const renderWithRouter = () => {
  return render(
    <HelpPanelProvider currentPath="/dokumentation/beteiligungsformate">
      <DocumentationDataProvider>
        <DocumentationParticipation />
      </DocumentationDataProvider>
    </HelpPanelProvider>,
  );
};

describe("DocumentationParticipation", () => {
  describe("no previous data", () => {
    beforeEach(() => {
      renderWithRouter();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("shows the expected heading", () => {
      expect(
        screen.getByRole("heading", {
          name: "Auswirkungen auf Betroffene und an der Umsetzung Beteiligte",
          level: 1,
        }),
      ).toBeInTheDocument();
    });

    it("shows first textarea with expected label and question", () => {
      const textarea = screen.getByRole("textbox", { name: "Erklärung" });
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");

      expect(
        screen.getByText(
          "Entspricht die Umsetzung des Regelungsvorhabens den Bedürfnissen der Betroffenen? Wie haben Sie das überprüft?",
        ),
      ).toBeInTheDocument();
    });

    it("shows second textarea with expected label and question", () => {
      const textarea = screen.getByRole("textbox", { name: "Erkenntnisse" });
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");

      expect(
        screen.getByText(
          "Wie spiegeln sich die Erkenntnisse, die durch die oben genannten Schritte gewonnen wurden, im Regelungsvorhaben wider?",
        ),
      ).toBeInTheDocument();
    });

    it("shows submit button", () => {
      const submitButton = screen.getByRole("button", {
        name: "Weiter",
      });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("type", "submit");
    });

    it("shows back button", () => {
      const backButton = screen.getByRole("link", { name: "Zurück" });
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveAttribute("href", "/previous-url");
    });
  });

  describe("validation", () => {
    beforeEach(() => {
      vi.mocked(readDataFromLocalStorage<DocumentationData>).mockReturnValue({
        version: DATA_SCHEMA_VERSION,
        participation: {
          formats: "",
          results: "",
        },
      });

      act(() => {
        renderWithRouter();
      });
    });

    it("shows an error on invalid data", async () => {
      const input1 = screen.getByRole("textbox", { name: "Erklärung" });
      const input2 = screen.getByRole("textbox", { name: "Erkenntnisse" });

      await waitFor(() => {
        expect(input1).toBeInvalid();
        expect(input2).toBeInvalid();
      });
      expect(input1).toHaveAccessibleErrorMessage(
        "Bitte geben Sie eine Antwort.",
      );
      expect(input2).toHaveAccessibleErrorMessage(
        "Bitte geben Sie eine Antwort.",
      );
    });

    it("removes the error on change", async () => {
      const user = userEvent.setup();
      const input1 = screen.getByRole("textbox", { name: "Erklärung" });
      const input2 = screen.getByRole("textbox", { name: "Erkenntnisse" });

      await waitFor(() => {
        expect(input1).toBeInvalid();
        expect(input2).toBeInvalid();
      });

      await user.type(input1, "valid");
      await user.type(input2, "valid");

      expect(input1).toBeValid();
      expect(input2).toBeValid();
    });
  });
});

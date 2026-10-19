// Import mocks first
import "./utils/mockLocalStorageVersioned";
import "./utils/mockRouter";
// End of mocks

import { HelpPanelProvider } from "@/contexts/HelpPanelContext";
import { DocumentationTitle } from "@/routes/dokumentation._documentationNavigation.regelungsvorhaben-titel";
import { readDataFromLocalStorage } from "@/utils/localStorageVersioned";
import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentationDataProvider } from "../dokumentation/DocumentationDataProvider";
import type { DocumentationData } from "../dokumentation/documentationDataSchema";
import { DATA_SCHEMA_VERSION } from "../dokumentation/documentationDataSchema";

const mockedReadDataFromLocalStorage = vi.mocked(
  readDataFromLocalStorage<DocumentationData>,
);

const renderWithRouter = () => {
  return render(
    <HelpPanelProvider currentPath="/dokumentation/regelungsvorhaben-titel">
      <DocumentationDataProvider>
        <DocumentationTitle />
      </DocumentationDataProvider>
    </HelpPanelProvider>,
  );
};

describe("DocumentationTitle", () => {
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
          name: "Tragen Sie Daten zu Ihrem Regelungsvorhaben ein",
          level: 1,
        }),
      ).toBeInTheDocument();
    });

    it("shows an input element with the expected label", () => {
      const input = screen.getByRole("textbox", {
        name: "Titel des Regelungsvorhabens",
      });
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe("INPUT");
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
      mockedReadDataFromLocalStorage.mockReturnValue({
        ...{ version: DATA_SCHEMA_VERSION },
        policyTitle: { title: "", organization: "" },
      });

      act(() => {
        renderWithRouter();
      });
    });

    it("shows an error on invalid data", async () => {
      const input = screen.getByRole("textbox", {
        name: "Titel des Regelungsvorhabens",
      });
      await waitFor(() => {
        expect(input).toBeInvalid();
      });
      expect(input).toHaveAccessibleErrorMessage(
        "Bitte geben Sie einen Titel ein.",
      );
    });

    it("removes the error on change", async () => {
      const user = userEvent.setup();

      const input = screen.getByRole("textbox", {
        name: "Titel des Regelungsvorhabens",
      });
      await waitFor(() => {
        expect(input).toBeInvalid();
      });

      await user.type(input, "valid reason");

      expect(input).toBeValid();
    });
  });
});

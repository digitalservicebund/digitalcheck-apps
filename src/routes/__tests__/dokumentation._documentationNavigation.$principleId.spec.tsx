// Import mocks first
import "./utils/mockLocalStorageVersioned";
import { mockNavigationContext } from "./utils/mockRouter";
// End of mocks
import {
  dokumentation_beteiligungsformate,
  dokumentation_hinweise,
  dokumentation_regelungsvorhabenTitel,
} from "@/config/routes";
import type { Prinzip, PrinzipAspekt } from "@/content.config";
import { HelpPanelProvider } from "@/contexts/HelpPanelContext";
import type {
  Route,
  RouteGroup,
} from "@/routes/dokumentation/DocumentationNavigationContext.tsx";
import { readDataFromLocalStorage } from "@/utils/localStorageVersioned";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentationPrinciple } from "../dokumentation._documentationNavigation.$principleId";
import { DocumentationDataProvider } from "../dokumentation/DocumentationDataProvider";
import type { DocumentationData } from "../dokumentation/documentationDataSchema";
import { DATA_SCHEMA_VERSION } from "../dokumentation/documentationDataSchema";

const routes: (RouteGroup | Route)[] = [
  dokumentation_hinweise,
  dokumentation_regelungsvorhabenTitel,
  dokumentation_beteiligungsformate,
  {
    title: "Prinzipien",
    routes: [
      {
        title: "Prinzip: Digitale Angebote",
        path: "/dokumentation/prinzip-1-digitale-angebote",
      },
    ],
  },
];

const aspekte: PrinzipAspekt[] = [
  {
    Titel: "Aspekt 1",
    Kurzbezeichnung: "A1",
    Text: "",
    Anwendung: [],
  },
];

const prinzips: Prinzip[] = [
  {
    Name: "Prinzip 1: Digitale Angebote",
    Kurzbezeichnung: "Kurzbezeichnung",
    URLBezeichnung: "prinzip-1-digitale-angebote",
    documentId: "1",
    Nummer: 1,
    order: 1,
    Kurzbeschreibung: "",
    Hilfetext: "",
    Erklaerungshilfe: "",
    Aspekte: aspekte,
  },
];

const renderWithRouter = () => {
  return render(
    <HelpPanelProvider currentPath="/dokumentation/prinzip-1-digitale-angebote">
      <DocumentationDataProvider>
        <DocumentationPrinciple principleId="prinzip-1-digitale-angebote" />
      </DocumentationDataProvider>
    </HelpPanelProvider>,
  );
};

describe("DocumentationPrinciple", () => {
  beforeEach(() => {
    mockNavigationContext.currentUrl = "/current-url";
    mockNavigationContext.navigationBaseUrl = "/current-url";
    mockNavigationContext.nextUrl = "/next-url";
    mockNavigationContext.previousUrl = "/previous-url";
    mockNavigationContext.routes = routes;
    mockNavigationContext.prinzips = prinzips;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows the expected heading", () => {
    renderWithRouter();

    expect(
      screen.getByRole("heading", {
        name: /Prinzip 1: Digitale Angebote/,
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it("shows the question heading", () => {
    renderWithRouter();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Schafft das Regelungsvorhaben/,
      }),
    ).toBeInTheDocument();
  });

  it("shows the correct answer options", () => {
    renderWithRouter();

    ["Ja, gänzlich oder teilweise", "Nein", "Nicht relevant"].forEach(
      (labelText) => {
        const input = screen.getByLabelText(labelText);
        expect(input).toBeInTheDocument();
        expect(input.tagName).toBe("INPUT");
      },
    );
  });

  it("shows submit button", () => {
    renderWithRouter();

    const submitButton = screen.getByRole("button", {
      name: "Weiter",
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("shows back button", () => {
    renderWithRouter();

    const backButton = screen.getByRole("link", { name: "Zurück" });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute("href", "/previous-url");
  });

  describe("no aspects or reasoning on this page", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
      renderWithRouter();
    });

    it("does not show aspect checkboxes after selecting positive answer", async () => {
      await user.click(screen.getByLabelText("Ja, gänzlich oder teilweise"));

      expect(screen.queryByLabelText("A1")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Eigene Erklärung hinzufügen"),
      ).not.toBeInTheDocument();
    });

    it("does not show reasoning textarea after selecting negative answer", async () => {
      await user.click(screen.getByLabelText("Nein"));

      expect(screen.queryByLabelText("Begründung")).not.toBeInTheDocument();
    });

    it("does not show reasoning textarea after selecting irrelevant answer", async () => {
      await user.click(screen.getByLabelText("Nicht relevant"));

      expect(screen.queryByLabelText("Begründung")).not.toBeInTheDocument();
    });
  });

  describe("pre-filled data from localStorage", () => {
    it("pre-selects the saved answer", () => {
      vi.mocked(readDataFromLocalStorage<DocumentationData>).mockReturnValue({
        version: DATA_SCHEMA_VERSION,
        principles: [
          {
            id: "1",
            answer: "Nein",
            reasoning: "some reasoning",
            aspects: [],
          },
        ],
      });

      act(() => {
        renderWithRouter();
      });

      const radio = screen.getByLabelText("Nein");
      expect(radio).toBeChecked();
    });
  });

  // Note: principle page uses warningInsteadOfError and navigates via onBeforeSubmit,
  // so form-level validation is intentionally lenient here. Full validation is tested
  // on the erlaeuterung page where aspects and reasoning are collected.
});

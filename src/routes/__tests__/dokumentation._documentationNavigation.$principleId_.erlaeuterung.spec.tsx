// Import mocks first
import "./utils/mockLocalStorageVersioned";
import { mockNavigationContext } from "./utils/mockRouter";
// End of mocks
import type { Route } from "@/config/routes";
import {
  dokumentation_beteiligungsformate,
  dokumentation_hinweise,
  dokumentation_regelungsvorhabenTitel,
} from "@/config/routes";
import type { Prinzip, PrinzipAspekt } from "@/content.config";
import { HelpPanelProvider } from "@/contexts/HelpPanelContext";
import type { digitalDocumentation } from "@/resources/content/dokumentation";
import { readDataFromLocalStorage } from "@/utils/localStorageVersioned";
import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentationPrincipleErlaeuterung } from "../dokumentation._documentationNavigation.$principleId_.erlaeuterung";
import { DocumentationDataProvider } from "../dokumentation/DocumentationDataProvider";
import type { DocumentationData } from "../dokumentation/documentationDataSchema";
import { DATA_SCHEMA_VERSION } from "../dokumentation/documentationDataSchema";

type RouteGroup = {
  title: string;
  routes: Route[];
};

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
        key: "prinzipA",
        parent: null,
        sitemap: false,
        isStagingOnly: false,
        navOrder: null,
        navLabel: null,
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
  {
    Titel: "Aspekt 2",
    Kurzbezeichnung: "A2",
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
    <HelpPanelProvider currentPath="/dokumentation/prinzip-1-digitale-angebote/erlaeuterung">
      <DocumentationDataProvider>
        <DocumentationPrincipleErlaeuterung principleId="prinzip-1-digitale-angebote" />
      </DocumentationDataProvider>
    </HelpPanelProvider>,
  );
};

const mockStoredData = (
  answer: (typeof digitalDocumentation.principlePages.radioOptions)[number],
  reasoning = "",
  aspects: string[] = [],
) => {
  vi.mocked(readDataFromLocalStorage<DocumentationData>).mockReturnValue({
    version: DATA_SCHEMA_VERSION,
    principles: [
      {
        id: "1",
        answer,
        reasoning,
        aspects,
      },
    ],
  });
};

describe("DocumentationPrincipleErlaeuterung", () => {
  beforeEach(() => {
    mockNavigationContext.currentUrl =
      "/dokumentation/prinzip-1-digitale-angebote/erlaeuterung";
    mockNavigationContext.navigationBaseUrl =
      "/dokumentation/prinzip-1-digitale-angebote";
    mockNavigationContext.nextUrl = "/next-url";
    mockNavigationContext.previousUrl =
      "/dokumentation/prinzip-1-digitale-angebote";
    mockNavigationContext.routes = routes;
    mockNavigationContext.prinzips = prinzips;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("positive answer", () => {
    beforeEach(() => {
      mockStoredData("Ja, gänzlich oder teilweise", "existing reasoning", [
        "a1",
      ]);
      act(() => {
        renderWithRouter();
      });
    });

    it("shows the principle heading", () => {
      expect(
        screen.getByRole("heading", {
          name: /Prinzip 1: Digitale Angebote/,
          level: 1,
        }),
      ).toBeInTheDocument();
    });

    it("shows the positive answer confirmation message", () => {
      expect(
        screen.getByText(
          "Sie haben angegeben, dass das Prinzip auf Ihr Vorhaben zutrifft.",
        ),
      ).toBeInTheDocument();
    });

    it("shows the change answer link", () => {
      const link = screen.getByRole("link", { name: "Angaben ändern" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        "href",
        "/dokumentation/prinzip-1-digitale-angebote",
      );
    });

    it("shows the explanation heading for positive answer", () => {
      expect(
        screen.getByText(
          /Erklären Sie, inwiefern Sie auf dieses Prinzip eingegangen sind/,
        ),
      ).toBeInTheDocument();
    });

    it("shows aspect pills", () => {
      expect(screen.getByText("Schwerpunkte auswählen")).toBeInTheDocument();
      expect(screen.getByText("A1")).toBeInTheDocument();
      expect(screen.getByText("A2")).toBeInTheDocument();
    });

    it("shows reasoning textarea", () => {
      expect(
        screen.getByLabelText("Erklärung", { selector: "textarea" }),
      ).toBeInTheDocument();
    });

    it("shows submit and back buttons", () => {
      expect(
        screen.getByRole("button", { name: "Weiter" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Zurück" })).toBeInTheDocument();
    });
  });

  describe("negative answer", () => {
    beforeEach(() => {
      mockStoredData("Nein", "negative reasoning");
      act(() => {
        renderWithRouter();
      });
    });

    it("shows the negative answer confirmation message", () => {
      expect(
        screen.getByText(
          "Sie haben angegeben, dass das Prinzip nicht auf Ihr Vorhaben zutrifft.",
        ),
      ).toBeInTheDocument();
    });

    it("shows the explanation heading for negative answer", () => {
      expect(
        screen.getByText("Erklären Sie, warum das Prinzip", { exact: false }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("nicht", { selector: "strong" }),
      ).toBeInTheDocument();
    });

    it("does not show aspect pills", () => {
      expect(
        screen.queryByText("Schwerpunkte auswählen"),
      ).not.toBeInTheDocument();
    });

    it("shows reasoning textarea", () => {
      expect(
        screen.getByLabelText("Erklärung", { selector: "textarea" }),
      ).toBeInTheDocument();
    });
  });

  describe("irrelevant answer", () => {
    beforeEach(() => {
      mockStoredData("Nicht relevant", "irrelevant reasoning");
      act(() => {
        renderWithRouter();
      });
    });

    it("shows the irrelevant answer confirmation message", () => {
      expect(
        screen.getByText(/nicht relevant für Ihr Vorhaben ist/),
      ).toBeInTheDocument();
    });

    it("does not show aspect pills", () => {
      expect(
        screen.queryByText("Schwerpunkte auswählen"),
      ).not.toBeInTheDocument();
    });

    it("shows reasoning textarea", () => {
      expect(
        screen.getByLabelText("Erklärung", { selector: "textarea" }),
      ).toBeInTheDocument();
    });
  });

  describe("no answer saved - redirect", () => {
    it("does not render content when no answer is saved", () => {
      mockStoredData("");
      act(() => {
        renderWithRouter();
      });

      // The component returns null when no answer is saved
      expect(screen.queryByText("Angaben ändern")).not.toBeInTheDocument();
    });
  });

  describe("form validation", () => {
    it("shows reasoning error for negative answer without reasoning", async () => {
      mockStoredData("Nein", "");
      act(() => {
        renderWithRouter();
      });

      await waitFor(() => {
        expect(
          screen.getByText("Bitte geben Sie eine Erklärung an."),
        ).toBeInTheDocument();
      });
    });

    it("shows reasoning error for irrelevant answer without reasoning", async () => {
      mockStoredData("Nicht relevant", "");
      act(() => {
        renderWithRouter();
      });

      await waitFor(() => {
        expect(
          screen.getByText("Bitte geben Sie eine Erklärung an."),
        ).toBeInTheDocument();
      });
    });

    it("shows reasoning error for positive answer without reasoning", async () => {
      mockStoredData("Ja, gänzlich oder teilweise", "", ["a1"]);
      act(() => {
        renderWithRouter();
      });

      await waitFor(() => {
        expect(
          screen.getByText("Bitte geben Sie eine Erklärung an."),
        ).toBeInTheDocument();
      });
    });

    it("shows no aspects error when aspects are selected", () => {
      mockStoredData("Ja, gänzlich oder teilweise", "", ["a1"]);
      act(() => {
        renderWithRouter();
      });

      // Aspects are selected, so no aspects error should show
      expect(
        screen.queryByText("Bitte geben Sie mindestens einen Schwerpunkt an."),
      ).not.toBeInTheDocument();
    });
  });

  describe("validation behavior", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
    });

    it("removes reasoning error on valid input", async () => {
      mockStoredData("Nein", "");
      act(() => {
        renderWithRouter();
      });

      const reasoningInput = screen.getByLabelText("Erklärung");
      await waitFor(() => {
        expect(
          screen.getByText("Bitte geben Sie eine Erklärung an."),
        ).toBeInTheDocument();
      });

      await user.type(reasoningInput, "Valid reasoning");
      expect(
        screen.queryByText("Bitte geben Sie eine Erklärung an."),
      ).not.toBeInTheDocument();
    });
  });
});

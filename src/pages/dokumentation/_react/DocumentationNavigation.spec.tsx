// Import mocks first
import "./testUtils/mockLocalStorageVersioned";
// End of mocks
import {
  dokumentation,
  dokumentation_absenden,
  dokumentation_beteiligungsformate,
  dokumentation_bewertungRechtlich,
  dokumentation_euInteroperabilitaetsbezug,
  dokumentation_hinweise,
  dokumentation_regelungsvorhabenTitel,
  dokumentation_verbindlicheAnforderungen,
  dokumentation_veroeffentlichung,
  dokumentation_zusammenfassung,
} from "@/config/routes";
import "@testing-library/jest-dom";
import { act, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Prinzip } from "@/content.config";
import { LayoutWithDocumentationNavigation } from "@/pages/dokumentation/_react/DocumentationNavigation";
import {
  type Route,
  useDocumentationNavigation,
} from "@/pages/dokumentation/_react/DocumentationNavigationContext";
import { stubResizingFunctionality } from "@/pages/dokumentation/_react/testUtils/stubResizingFunctionality.ts";
import { readDataFromLocalStorage } from "@/utils/localStorageVersioned";
import { DocumentationDataProvider } from "./DocumentationDataProvider";
import type { DocumentationData } from "./documentationDataSchema";
import { DATA_SCHEMA_VERSION } from "./documentationDataSchema";

/**
 * A minimal prinzip stub so the nav renders a "Prinzip A" entry,
 * matching the `id: "${dokumentation.path}/prinzipA"` used in test data below.
 */
const mockPrinzip: Prinzip = {
  documentId: `${dokumentation.path}/prinzipA`,
  Name: "Prinzip A",
  Kurzbezeichnung: "Kurzbezeichnung",
  URLBezeichnung: "prinzipA",
  Kurzbeschreibung: "",
  Hilfetext: "",
  Erklaerungshilfe: "",
  Nummer: 1,
  order: 1,
  Aspekte: [],
};

/**
 * Flat list of routes the component renders in its default state
 * (prinzips=[mockPrinzip], no EU interoperability data → all Bewertung routes disabled/skipped).
 */
const flattenedMockRoutes: Route[] = [
  dokumentation_hinweise,
  dokumentation_regelungsvorhabenTitel,
  dokumentation_beteiligungsformate,
  { title: "Prinzip A", path: `${dokumentation.path}/prinzipA` },
  dokumentation_euInteroperabilitaetsbezug,
  dokumentation_zusammenfassung,
  dokumentation_absenden,
];

/**
 * Routes that are relevant for forms interaction, excluding the notes page.
 */

const documentationFormRoutes = flattenedMockRoutes.filter(
  (route) => route.path !== dokumentation_hinweise.path,
);

type ValidationScenario = {
  name: string;
  documentationData: DocumentationData;
  expected: {
    completedTitle: boolean;
    completedParticipation: boolean;
    completedPrinciples: boolean;
    completedInteroperability: boolean;
    enabledInteroperability: boolean;
    warningTitle: boolean;
    warningParticipation: boolean;
    warningPrinciples: boolean;
    warningInteroperabilityLevelLegal: boolean;
  };
};

function renderPage({ path }: Route) {
  function DummyElement() {
    const { nextUrl, previousUrl } = useDocumentationNavigation();
    return (
      <>
        <h1>Foobar</h1>
        <a href={previousUrl}>Zurück</a>
        <a href={nextUrl}>Weiter</a>
      </>
    );
  }

  render(
    <DocumentationDataProvider>
      <LayoutWithDocumentationNavigation
        prinzips={[mockPrinzip]}
        currentUrl={path}
      >
        <DummyElement />
      </LayoutWithDocumentationNavigation>
    </DocumentationDataProvider>,
  );
}

const getNav = () =>
  screen.getByRole("navigation", { name: "Seitennavigation" });

const getTitel = () => within(getNav()).getByText("Regelungsvorhaben");

const getBeteiligungsformate = () =>
  within(getNav()).getByRole("link", { name: "Beteiligungsformate" });

const getPrinzipA = () =>
  within(getNav()).getByRole("link", { name: "Prinzip A" });

const getRechtlicheInteroperabilitaet = () =>
  within(getNav()).getByRole("link", {
    name: dokumentation_bewertungRechtlich.title,
  });

const expectCompleted = (element: HTMLElement) => {
  expect(element).toHaveAccessibleDescription(
    `${element.textContent} - Fertig`,
  );
  expect(within(element).getByTestId("CheckIcon")).toBeInTheDocument();
};

const expectNotCompleted = (element: HTMLElement) => {
  expect(element).not.toHaveAccessibleDescription(
    `${element.textContent} - Fertig`,
  );
  expect(within(element).queryByTestId("CheckIcon")).not.toBeInTheDocument();
};

const expectWarning = (element: HTMLElement) => {
  expect(element).toHaveAccessibleDescription(
    `${element.textContent} - Fehler`,
  );
  expect(
    within(element).getByTestId("WarningAmberOutlinedIcon"),
  ).toBeInTheDocument();
};

const expectNotWarning = (element: HTMLElement) => {
  expect(element).not.toHaveAccessibleDescription(
    `${element.textContent} - Fehler`,
  );
  expect(
    within(element).queryByTestId("WarningAmberOutlinedIcon"),
  ).not.toBeInTheDocument();
};

describe("navigation on pages of documentation", () => {
  beforeEach(() => {
    stubResizingFunctionality();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(flattenedMockRoutes)(
    "$path has back and forth navigation to previous and next page",
    (route) => {
      renderPage(route);

      const index = flattenedMockRoutes.findIndex(
        ({ path }) => path === route.path,
      );
      const previous = flattenedMockRoutes[index - 1];
      const next = flattenedMockRoutes[index + 1];

      if (previous) {
        expect(screen.getByRole("link", { name: "Zurück" })).toHaveAttribute(
          "href",
          previous.path,
        );
      }
      if (next) {
        const linkNext = screen.getByRole("link", {
          name: "Weiter",
        });
        expect(linkNext).toHaveAttribute("href", next.path);
      }
    },
  );

  it("disables all routes and only shows top-level items on the notes page", () => {
    renderPage(dokumentation_hinweise);
    const navigation = screen.getByRole("navigation", {
      name: "Seitennavigation",
    });
    const topLevelItems = [
      dokumentation_regelungsvorhabenTitel.title,
      dokumentation_beteiligungsformate.title,
      "Prinzipien",
      "EU-Interoperabilität",
    ];
    for (const title of topLevelItems) {
      const item = within(navigation).getByText(title);
      expect(item).toHaveAttribute("aria-disabled");
      expect(item).not.toHaveAttribute("href");
    }
  });

  const currentRoute = dokumentation_regelungsvorhabenTitel;
  it("renders sidebar navigation with links to all pages (except current and notes)", () => {
    renderPage(currentRoute);

    const navigation = screen.getByRole("navigation", {
      name: "Seitennavigation",
    });
    for (const route of documentationFormRoutes) {
      if (route.path === currentRoute.path) continue;
      const navItem = within(navigation).getByRole("link", {
        name: route.title,
      });
      expect(navItem).toHaveAttribute("href", route.path);
    }
  });

  describe("States", () => {
    const validationScenarios: ValidationScenario[] = [
      {
        name: "all valid completed",
        documentationData: {
          version: DATA_SCHEMA_VERSION,
          policyTitle: {
            title: "Valid Title",
            organization: "Valid Organization",
          },
          participation: {
            formats: "Valid Formats",
            results: "Valid Results",
          },
          euInteroperabilityOutcome: { outcomeId: "REQUIRED" },
          interoperabilityAssessment: {
            legal: { rating: "positive", detail: "Valid legal detail" },
            organizational: {
              rating: "positive",
              detail: "Valid organizational detail",
            },
            semantic: { rating: "positive", detail: "Valid semantic detail" },
            technical: { rating: "positive", detail: "Valid technical detail" },
          },
          principles: [
            {
              answer: "Ja, gänzlich oder teilweise",
              id: `${dokumentation.path}/prinzipA`,
              reasoning: "Some reasoning",
              aspects: ["aspect-1"],
            },
          ],
        },
        expected: {
          completedTitle: false, // is current route so no states are shown
          completedParticipation: true,
          completedPrinciples: true,
          completedInteroperability: true,
          enabledInteroperability: true,
          warningTitle: false,
          warningParticipation: false,
          warningPrinciples: false,
          warningInteroperabilityLevelLegal: false,
        },
      },
      {
        name: "unfilled form",
        documentationData: {
          version: DATA_SCHEMA_VERSION,
        },
        expected: {
          completedTitle: false,
          completedParticipation: false,
          completedPrinciples: false,
          completedInteroperability: false,
          enabledInteroperability: false,
          warningTitle: false,
          warningParticipation: false,
          warningPrinciples: false,
          warningInteroperabilityLevelLegal: false,
        },
      },
      {
        name: "partial filled form",
        documentationData: {
          version: DATA_SCHEMA_VERSION,
          policyTitle: {
            title: "",
            organization: "",
          },
          participation: {
            formats: "Valid Formats",
            results: "Valid Results",
          },
          euInteroperabilityOutcome: { outcomeId: "REQUIRED" },
          interoperabilityAssessment: {
            legal: { rating: "positive", detail: "" },
            organizational: { rating: "", detail: "" },
            semantic: { rating: "", detail: "" },
            technical: { rating: "", detail: "" },
          },
          principles: [
            {
              answer: "Ja, gänzlich oder teilweise",
              id: `${dokumentation.path}/prinzipA`,
              reasoning: "Some reasoning",
              aspects: [], // empty aspects fails validation
            },
          ],
        },
        expected: {
          completedTitle: false, // is current route so no states are shown
          completedParticipation: true,
          completedPrinciples: false, // aspects empty -> invalid
          completedInteroperability: false,
          enabledInteroperability: true,
          warningTitle: false,
          warningParticipation: false,
          warningPrinciples: true, // data exists but invalid
          warningInteroperabilityLevelLegal: true,
        },
      },
    ];

    describe.each(validationScenarios)(
      "Scenario: $name",
      ({ documentationData, expected }) => {
        beforeEach(async () => {
          vi.mocked(
            readDataFromLocalStorage<DocumentationData>,
          ).mockReturnValue(documentationData);
          // eslint-disable-next-line @typescript-eslint/require-await
          await act(async () => {
            renderPage(currentRoute);
          });
        });

        it("shows correct completed states", () => {
          if (expected.completedTitle) expectCompleted(getTitel());
          else expectNotCompleted(getTitel());
          if (expected.completedParticipation)
            expectCompleted(getBeteiligungsformate());
          else expectNotCompleted(getBeteiligungsformate());
          if (expected.enabledInteroperability) {
            if (expected.completedInteroperability)
              expectCompleted(getRechtlicheInteroperabilitaet());
            else expectNotCompleted(getRechtlicheInteroperabilitaet());
          }
          if (expected.completedPrinciples) expectCompleted(getPrinzipA());
          else expectNotCompleted(getPrinzipA());
        });

        it("shows correct warning states", () => {
          if (expected.warningTitle) expectWarning(getTitel());
          else expectNotWarning(getTitel());
          if (expected.warningParticipation)
            expectWarning(getBeteiligungsformate());
          else expectNotWarning(getBeteiligungsformate());
          if (expected.enabledInteroperability) {
            if (expected.warningInteroperabilityLevelLegal)
              expectWarning(getRechtlicheInteroperabilitaet());
            else expectNotWarning(getRechtlicheInteroperabilitaet());
          }
          if (expected.warningPrinciples) expectWarning(getPrinzipA());
          else expectNotWarning(getPrinzipA());
        });
      },
    );
  });

  describe("skips disabled routes in nextUrl and previousUrl", () => {
    /**
     * Routes that have `validate: skipIfNoInteroperabilityRequired` in routeDefinitions:
     * verbindlicheAnforderungen, bewertungRechtlich, bewertungOrganisatorisch,
     * bewertungSemantisch, bewertungTechnisch.
     *
     * When euInteroperabilityOutcome is absent (or not "REQUIRED"), all of these
     * should be skipped — so next from euInteroperabilitaetsbezug goes straight
     * to zusammenfassung, and previous from zusammenfassung goes straight back
     * to euInteroperabilitaetsbezug.
     */

    function renderPageWithRoutes(path: string) {
      function DummyElement() {
        const { nextUrl, previousUrl } = useDocumentationNavigation();
        return (
          <>
            <a href={previousUrl}>Zurück</a>
            <a href={nextUrl}>Weiter</a>
          </>
        );
      }

      render(
        <DocumentationDataProvider>
          <LayoutWithDocumentationNavigation prinzips={[]} currentUrl={path}>
            <DummyElement />
          </LayoutWithDocumentationNavigation>
        </DocumentationDataProvider>,
      );
    }

    describe("when interoperability is NOT required (disabled routes)", () => {
      beforeEach(() => {
        // No euInteroperabilityOutcome set → all bewertung routes are disabled
        vi.mocked(readDataFromLocalStorage<DocumentationData>).mockReturnValue({
          version: DATA_SCHEMA_VERSION,
        });
      });

      it("nextUrl skips all disabled EU routes when on euInteroperabilitaetsbezug", () => {
        act(() => {
          renderPageWithRoutes(dokumentation_euInteroperabilitaetsbezug.path);
        });
        expect(screen.getByRole("link", { name: "Weiter" })).toHaveAttribute(
          "href",
          dokumentation_zusammenfassung.path,
        );
      });

      it("previousUrl skips all disabled EU routes when on zusammenfassung", () => {
        act(() => {
          renderPageWithRoutes(dokumentation_zusammenfassung.path);
        });
        expect(screen.getByRole("link", { name: "Zurück" })).toHaveAttribute(
          "href",
          dokumentation_euInteroperabilitaetsbezug.path,
        );
      });

      it("nextUrl is not affected for routes before the disabled block", () => {
        act(() => {
          renderPageWithRoutes(dokumentation_beteiligungsformate.path);
        });
        // beteiligungsformate is the last route before the EU group;
        // euInteroperabilitaetsbezug is NOT disabled, so it is navigated to normally
        expect(screen.getByRole("link", { name: "Weiter" })).toHaveAttribute(
          "href",
          dokumentation_euInteroperabilitaetsbezug.path,
        );
      });
    });

    describe("when interoperability IS required (routes enabled)", () => {
      beforeEach(() => {
        vi.mocked(readDataFromLocalStorage<DocumentationData>).mockReturnValue({
          version: DATA_SCHEMA_VERSION,
          euInteroperabilityOutcome: { outcomeId: "REQUIRED" },
        });
      });

      it("nextUrl does NOT skip disabled EU routes — goes to verbindlicheAnforderungen", () => {
        act(() => {
          renderPageWithRoutes(dokumentation_euInteroperabilitaetsbezug.path);
        });
        expect(screen.getByRole("link", { name: "Weiter" })).toHaveAttribute(
          "href",
          dokumentation_verbindlicheAnforderungen.path,
        );
      });

      it("previousUrl does NOT skip — goes from zusammenfassung to the last interoperability step", () => {
        act(() => {
          renderPageWithRoutes(dokumentation_zusammenfassung.path);
        });
        expect(screen.getByRole("link", { name: "Zurück" })).toHaveAttribute(
          "href",
          dokumentation_veroeffentlichung.path,
        );
      });
    });
  });
});

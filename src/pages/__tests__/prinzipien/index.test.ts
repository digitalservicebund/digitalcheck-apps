// @vitest-environment node
import { prinzipienPoster_pdf } from "@/config/downloads";
import { prinzipien } from "@/config/routes";
import FivePrinciples from "@/pages/prinzipien/index.astro";
import { renderToDOM } from "@/utils/testUtils";
import type { BoundFunctions, queries } from "@testing-library/dom";
import { within } from "@testing-library/dom";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { beforeEach, describe, expect, it } from "vitest";

// Create mock data that simulates the entries returned by getCollection("prinzipien").
// vi.hoisted ensures this is initialized before the hoisted vi.mock() factory runs.
const mockPrinzipsData = vi.hoisted(() => [
  {
    id: "1",
    data: {
      documentId: "1",
      Name: "Prinzip Test 1: Nutzerfreundlichkeit",
      Kurzbeschreibung: "Beschreibung für Prinzip 1.",
      Hilfetext: "",
      Erklaerungshilfe: "",
      order: 1,
      Nummer: 1,
      URLBezeichnung: "prinzip-test-1",
      Aspekte: [
        {
          Titel: "Anwendung 1.1",
          Kurzbezeichnung: "Anwendung 1.1",
          Text: "Anwendung Text 1.1",
          Anwendung: [],
        },
      ],
    },
  },
  {
    id: "2",
    data: {
      documentId: "2",
      Name: "Prinzip Test 2: Datenminimierung",
      Kurzbeschreibung: "Kurze Beschreibung für Prinzip 2.",
      Hilfetext: "",
      Erklaerungshilfe: "",
      order: 2,
      Nummer: 2,
      URLBezeichnung: "prinzip-test-2",
      Aspekte: [], // No application examples
    },
  },
]);

vi.mock("astro:content", () => ({
  getCollection: vi.fn().mockResolvedValue(mockPrinzipsData),
}));

describe("FivePrinciples Route - Integration Tests", () => {
  let screen: BoundFunctions<typeof queries>;
  beforeEach(async () => {
    const { dom } = await renderToDOM(FivePrinciples as AstroComponentFactory);
    screen = within(dom.body);
  });

  it("renders the Hero section with the correct title and subtitle", () => {
    expect(
      screen.getByRole("heading", {
        name: "Die fünf Prinzipien",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Die folgenden Prinzipien helfen Ihnen dabei/),
    ).toBeInTheDocument();
  });

  it("renders the instruction section with its features", () => {
    expect(
      screen.getByRole("heading", {
        name: "So nutzen Sie die fünf Prinzipien für Ihr Regelungsvorhaben",
        level: 2,
      }),
    ).toBeInTheDocument();
    for (const name of [
      "Den Gesamtprozess überprüfen",
      "Starthilfe für den Regelungstext",
      "Unterstützung durch Schulungsangebote und Praxistipps",
    ]) {
      expect(
        screen.getByRole("heading", { name, level: 3 }),
      ).toBeInTheDocument();
    }
  });

  it("renders a card per principle, linked via its title", () => {
    const list = screen.getByTestId("prinzipien");
    expect(within(list).getAllByRole("article")).toHaveLength(
      mockPrinzipsData.length,
    );

    for (const { data } of mockPrinzipsData) {
      const heading = within(list).getByRole("heading", {
        name: data.Name,
        level: 2,
      });
      expect(within(heading).getByRole("link")).toHaveAttribute(
        "href",
        `${prinzipien.path}/${data.URLBezeichnung}`,
      );
    }
  });

  it("renders a principle-colored badge on each card", () => {
    const list = screen.getByTestId("prinzipien");

    for (const { data } of mockPrinzipsData) {
      const badge = within(list)
        .getByText(`Prinzip ${data.order}`)
        .closest(".kern-badge");
      expect(badge).toHaveClass(`kern-badge--prinzip-${data.order}`);
    }
  });

  it("renders each principle's short description", () => {
    expect(screen.getByText("Beschreibung für Prinzip 1.")).toBeInTheDocument();
    expect(
      screen.getByText("Kurze Beschreibung für Prinzip 2."),
    ).toBeInTheDocument();
  });

  it("renders the poster section", () => {
    expect(
      screen.getByRole("heading", {
        name: "Die Prinzipien als Poster",
        level: 2,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Poster herunterladen" }),
    ).toHaveAttribute("href", prinzipienPoster_pdf.path);
  });
});

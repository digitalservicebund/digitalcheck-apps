// @vitest-environment node
import Index from "@/pages/index.astro";
import {
  ZFL_BASE_URL,
  ZFL_PATH_RESSOURCEN,
  ZFL_PATH_SCHULUNGEN,
} from "@/resources/constants";
import { renderToDOM } from "@/utils/testUtils";
import type { BoundFunctions, queries } from "@testing-library/dom";
import { within } from "@testing-library/dom";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { beforeAll, describe, expect, it, vi } from "vitest";

// The content data store isn't populated in CI, so mock the collection.
const principle = vi.hoisted(() => ({
  data: { Name: "Digitale Angebote für alle nutzbar gestalten", order: 1 },
}));
vi.mock("astro:content", () => ({
  getCollection: vi.fn().mockResolvedValue([principle]),
}));

describe("Index Route - Integration Tests", () => {
  let main: BoundFunctions<typeof queries>;

  beforeAll(async () => {
    const { dom } = await renderToDOM(Index as AstroComponentFactory);
    main = within(dom.querySelector("main")!);
  });

  it("renders the Hero section with title and calls to action", () => {
    expect(
      main.getByRole("heading", {
        name: "Digitaltaugliche Regelungen erarbeiten",
        level: 1,
      }),
    ).toBeInTheDocument();

    expect(
      main.getByRole("link", { name: "Digitalcheck starten" }),
    ).toHaveAttribute("href", "/vorpruefung");
    expect(
      main.getByRole("link", { name: "Was ist Digitaltauglichkeit?" }),
    ).toHaveAttribute("href", "#was-ist-digitaltauglichkeit");
  });

  it("renders the three steps with their links", () => {
    expect(
      main.getByRole("heading", {
        name: "Der Digitalcheck in drei Schritten",
        level: 2,
      }),
    ).toBeInTheDocument();

    [
      ["Vorprüfung durchlaufen", "Vorprüfung starten", "/vorpruefung"],
      ["Regelung erarbeiten", "Zur Erarbeitung", "/methoden"],
      [
        "Digitalcheck dokumentieren",
        "Dokumentation erstellen",
        "/dokumentation",
      ],
    ].forEach(([heading, link, href]) => {
      expect(
        main.getByRole("heading", { name: heading, level: 3 }),
      ).toBeInTheDocument();
      expect(main.getByRole("link", { name: link })).toHaveAttribute(
        "href",
        href,
      );
    });

    expect(main.getByRole("link", { name: "Ressourcen" })).toHaveAttribute(
      "href",
      ZFL_BASE_URL + ZFL_PATH_RESSOURCEN,
    );
  });

  it("renders the Digitaltauglichkeit section as jump target", () => {
    const heading = main.getByRole("heading", {
      name: "Was ist Digitaltauglichkeit?",
      level: 2,
    });
    expect(heading.closest("section")).toHaveAttribute(
      "id",
      "was-ist-digitaltauglichkeit",
    );
  });

  it("renders the five principles", () => {
    expect(
      main.getByRole("heading", {
        name: "Fünf Prinzipien der Digitaltauglichkeit",
        level: 2,
      }),
    ).toBeInTheDocument();
    expect(
      main.getByText("Digitale Angebote für alle nutzbar gestalten"),
    ).toBeInTheDocument();
    expect(
      main.getByRole("link", { name: "Zu den Prinzipien" }),
    ).toHaveAttribute("href", "/prinzipien");
  });

  it("renders the EU-Interoperabilität and Bundesländer cards", () => {
    expect(
      main.getByRole("link", { name: "Zu EU-Interoperabilität" }),
    ).toHaveAttribute("href", "/interoperabel");
    expect(
      main.getByRole("link", { name: "Nationale Kontaktstelle" }),
    ).toHaveAttribute("href", "/interoperabel/nationale-kontaktstelle");
    expect(main.getByRole("link", { name: "Zur Übersicht" })).toHaveAttribute(
      "href",
      "/bundeslaender",
    );
  });

  it("renders the support section", () => {
    expect(
      main.getByRole("heading", { name: "Unterstützungsangebote", level: 2 }),
    ).toBeInTheDocument();
    expect(
      main.getByRole("link", { name: "Zum Zentrum für Legistik" }),
    ).toHaveAttribute("href", ZFL_BASE_URL);
    expect(main.getByRole("link", { name: "Schulungen" })).toHaveAttribute(
      "href",
      ZFL_BASE_URL + ZFL_PATH_SCHULUNGEN,
    );
  });
});

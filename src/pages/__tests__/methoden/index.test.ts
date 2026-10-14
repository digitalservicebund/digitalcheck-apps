// @vitest-environment node
import Methoden from "@/pages/methoden/index.astro"; // The component to test
import {
  ZFL_BASE_URL,
  ZFL_PATH_FLUSSDIAGRAMME,
  ZFL_PATH_IT_SYSTEME,
  ZFL_PATH_TECHNISCHE_UMSETZBARKEIT,
} from "@/resources/constants";
import { renderToDOM } from "@/utils/testUtils";
import type { BoundFunctions, queries } from "@testing-library/dom";
import { within } from "@testing-library/dom";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { describe, expect, it } from "vitest";

describe("Methoden Route - Integration Tests", () => {
  let screen: BoundFunctions<typeof queries>;

  beforeEach(async () => {
    const { dom } = await renderToDOM(Methoden as AstroComponentFactory);
    screen = within(dom.body);
  });

  it("renders the Hero section with the correct title", () => {
    expect(
      screen.getByRole("heading", {
        name: "Erarbeiten eines digitaltauglichen Regelungsvorhabens",
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it("renders the Timeline with all methods", () => {
    expect(
      screen.getByRole("heading", {
        name: "Erfassen des Status quo",
        level: 2,
      }),
    ).toBeInTheDocument();

    const visualisationItem = screen.getByRole("heading", {
      name: "Visualisieren Sie die aktuellen Abläufe",
      level: 3,
    }).parentElement!;

    expect(within(visualisationItem).getByRole("link")).toHaveAttribute(
      "href",
      ZFL_BASE_URL + ZFL_PATH_FLUSSDIAGRAMME,
    );

    expect(
      screen.getByRole("heading", {
        name: "Entwickeln von Digitaltauglichkeit",
        level: 2,
      }),
    ).toBeInTheDocument();

    const principleItem = screen.getByRole("heading", {
      name: "Finden Sie konkrete Möglichkeiten der Digitalisierung",
      level: 3,
    }).parentElement!;

    expect(within(principleItem).getByRole("link")).toHaveAttribute(
      "href",
      "/prinzipien",
    );

    expect(
      screen.getByRole("heading", {
        name: "Verfassen des Regelungsentwurfes",
        level: 2,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Schreiben Sie die Regelung",
        level: 3,
      }),
    ).toBeInTheDocument();
  });

  it('renders the "Further Methods" content', () => {
    expect(
      screen.getByRole("heading", {
        name: "Weitere Methoden, die Sie nutzen können",
        level: 2,
      }),
    ).toBeInTheDocument();

    const itSystemsBox = screen.getByRole("heading", {
      name: "IT-Systeme gemeinsam erfassen",
      level: 3,
    }).parentElement!;
    expect(within(itSystemsBox).getByRole("link")).toHaveAttribute(
      "href",
      ZFL_BASE_URL + ZFL_PATH_IT_SYSTEME,
    );

    const technicalFeasibilityBox = screen.getByRole("heading", {
      name: "Technische Umsetzbarkeit sicherstellen",
      level: 3,
    }).parentElement!;
    expect(within(technicalFeasibilityBox).getByRole("link")).toHaveAttribute(
      "href",
      ZFL_BASE_URL + ZFL_PATH_TECHNISCHE_UMSETZBARKEIT,
    );
  });

  it("renders the SupportBanner with correct content", () => {
    expect(
      screen.getByRole("heading", {
        name: "Sie haben Gesprächsbedarf zu Ihrem Vorhaben?",
        level: 2,
      }),
    ).toBeInTheDocument();
  });

  it('renders the NumberedList for "Next Steps" with correct items', () => {
    expect(
      screen.getByRole("heading", { name: "So machen Sie weiter", level: 2 }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Abgeschlossene Vorprüfung: Der Digitalbezug wurde eingeschätzt.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Abgeschlossene Erarbeitung eines digitaltauglichen Regelungsvorhabens.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Dokumentieren des Regelungsvorhabens"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Prüfen durch zuständige Prüfstelle"),
    ).toBeInTheDocument();
  });
});

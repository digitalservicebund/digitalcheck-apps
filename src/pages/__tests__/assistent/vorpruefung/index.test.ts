// @vitest-environment node
import Index from "@/pages/assistent/vorpruefung/index.astro";
import { renderToDOM } from "@/utils/testUtils";
import type { BoundFunctions, queries } from "@testing-library/dom";
import { within } from "@testing-library/dom";
import "@testing-library/jest-dom";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { beforeEach, describe, expect, it } from "vitest";

describe("Vorpruefung Index Route - Integration Tests", () => {
  let screen: BoundFunctions<typeof queries>;

  beforeEach(async () => {
    const { dom } = await renderToDOM(Index as AstroComponentFactory);
    screen = within(dom.body);
  });

  it("renders the Hero section with the correct title", () => {
    expect(
      screen.getByRole("heading", {
        name: "Vorprüfung: Digitalbezug einschätzen",
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it("renders the support banner", () => {
    expect(
      screen.getByRole("heading", {
        name: "Sie haben Gesprächsbedarf zu Ihrem Vorhaben?",
        level: 2,
      }),
    ).toBeInTheDocument();
  });
});

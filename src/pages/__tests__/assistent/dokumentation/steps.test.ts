// @vitest-environment node
import {
  assistent_dokumentation_beteiligungsformate,
  assistent_dokumentation_regelungsvorhaben,
} from "@/config/routes";
import Beteiligungsformate from "@/pages/assistent/dokumentation/beteiligungsformate.astro";
import Regelungsvorhaben from "@/pages/assistent/dokumentation/regelungsvorhaben.astro";
import { renderToDOM } from "@/utils/testUtils";
import {
  beteiligungsformateSchema,
  regelungsvorhabenSchema,
} from "@/wizard/dokumentationSchema";
import { within } from "@testing-library/dom";
import "@testing-library/jest-dom";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { describe, expect, it } from "vitest";
import { baseUrl } from "../../../../../vitest.config";

const renderStep = async (page: unknown, path: string) => {
  const { dom } = await renderToDOM(page as AstroComponentFactory, {
    request: new Request(baseUrl + path),
  });
  const form = dom.querySelector("form[data-wizard-step-form]")!;
  const names = new Set(
    Array.from(form.querySelectorAll("[name]"), (control) =>
      control.getAttribute("name"),
    ),
  );
  return { screen: within(dom.body), names };
};

describe("Dokumentation step Regelungsvorhaben", () => {
  it("renders the fields of its page schema", async () => {
    const { screen, names } = await renderStep(
      Regelungsvorhaben,
      assistent_dokumentation_regelungsvorhaben.path,
    );

    expect([...names]).toEqual(Object.keys(regelungsvorhabenSchema.shape));
    expect(
      screen.getByRole("textbox", { name: "Titel des Regelungsvorhabens" }),
    ).toHaveAccessibleDescription(
      "Der offizielle Titel wird in der fertigen Dokumentation verwendet.",
    );
    expect(
      screen.getByRole("textbox", { name: "Ministerium / Organisation" }),
    ).toBeInTheDocument();
  });
});

describe("Dokumentation step Beteiligungsformate", () => {
  it("renders the fields of its page schema, grouped by question", async () => {
    const { screen, names } = await renderStep(
      Beteiligungsformate,
      assistent_dokumentation_beteiligungsformate.path,
    );

    expect([...names]).toEqual(Object.keys(beteiligungsformateSchema.shape));
    const question = screen.getByRole("group", {
      name: /Entspricht die Umsetzung des Regelungsvorhabens/,
    });
    expect(
      within(question).getByRole("textbox", { name: "Erklärung" }),
    ).toHaveAccessibleDescription(/Beschreiben Sie stichpunktartig/);
    expect(
      screen.getByRole("textbox", { name: "Erkenntnisse" }),
    ).toBeInTheDocument();
  });
});

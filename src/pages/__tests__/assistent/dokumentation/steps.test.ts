// @vitest-environment node
import { dokumentationPrinzipienRoutes } from "@/config/prinzipienRoutes";
import {
  assistent_dokumentation_beteiligungsformate,
  assistent_dokumentation_euInteroperabilitaet,
  assistent_dokumentation_euInteroperabilitaet_verbindlicheAnforderungen,
  assistent_dokumentation_regelungsvorhaben,
} from "@/config/routes";
import { getPrinzipienStaticPaths } from "@/content.config";
import Prinzip from "@/pages/assistent/dokumentation/[principleId].astro";
import Beteiligungsformate from "@/pages/assistent/dokumentation/beteiligungsformate.astro";
import EuInteroperabilitaet from "@/pages/assistent/dokumentation/eu-interoperabilitaet/index.astro";
import VerbindlicheAnforderungen from "@/pages/assistent/dokumentation/eu-interoperabilitaet/verbindliche-anforderungen.astro";
import Regelungsvorhaben from "@/pages/assistent/dokumentation/regelungsvorhaben.astro";
import { renderToDOM } from "@/utils/testUtils";
import { slugify } from "@/utils/utilFunctions";
import {
  anforderungSchema,
  bereichOptions,
  beteiligungsformateSchema,
  euInteroperabilitaetSchema,
  prinzipSchema,
  regelungsvorhabenSchema,
  toPrinzipOrder,
} from "@/wizard/dokumentationSchema";
import { within } from "@testing-library/dom";
import "@testing-library/jest-dom";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { describe, expect, it } from "vitest";
import { baseUrl } from "../../../../../vitest.config";

const renderStep = async (
  page: unknown,
  path: string,
  props?: Record<string, unknown>,
) => {
  const { dom } = await renderToDOM(page as AstroComponentFactory, {
    request: new Request(baseUrl + path),
    props,
  });
  const form = dom.querySelector("form[data-wizard-step-form]")!;
  const names = new Set(
    Array.from(form.querySelectorAll("[name]"), (control) =>
      control.getAttribute("name"),
    ),
  );
  return { dom, screen: within(dom.body), names };
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

describe("Dokumentation step Prinzip", () => {
  it.each(dokumentationPrinzipienRoutes)(
    "renders the answer of $title as a radio group labelled by the question",
    async ({ path }) => {
      const staticPaths = await getPrinzipienStaticPaths();
      const { prinzip } = staticPaths.find((staticPath) =>
        path.endsWith(`/${staticPath.params.principleId}`),
      )!.props;
      const { screen, names } = await renderStep(Prinzip, path, { prinzip });

      const order = toPrinzipOrder(prinzip.order);
      expect([...names]).toEqual(Object.keys(prinzipSchema(order).shape));
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        prinzip.Name,
      );
      const radios = screen.getByRole("radiogroup", {
        name: "Schafft das Regelungsvorhaben die rechtlichen Voraussetzungen für die Umsetzung des Prinzips?",
      });
      expect(
        within(radios)
          .getAllByRole("radio")
          .map((radio) => radio.getAttribute("value")),
      ).toEqual(["yes", "no", "not-relevant"]);
    },
  );

  const renderFirstPrinzip = async () => {
    const [{ props }] = await getPrinzipienStaticPaths();
    const { prinzip } = props;
    const rendered = await renderStep(
      Prinzip,
      dokumentationPrinzipienRoutes[0].path,
      { prinzip },
    );
    return { prinzip, ...rendered };
  };

  // The conditions are applied by bindStepForm in the browser
  it("renders the content of each answer, hidden until it's chosen", async () => {
    const { prinzip, dom, screen } = await renderFirstPrinzip();
    const showIf = (heading: string) =>
      screen
        .getByRole("heading", { name: heading, hidden: true })
        .closest("[data-wizard-show-if]");

    expect(
      showIf("Erklären Sie, inwiefern Sie auf dieses Prinzip eingegangen sind"),
    ).toHaveAttribute("data-wizard-show-is", '["yes"]');
    expect(
      showIf("Erklären Sie, warum das Prinzip nicht auf Ihr Vorhaben zutrifft"),
    ).toHaveAttribute("data-wizard-show-is", '["no"]');
    expect(
      showIf(
        "Erklären Sie, warum das Prinzip nicht relevant für Ihr Vorhaben ist",
      ),
    ).toHaveAttribute("data-wizard-show-is", '["not-relevant"]');

    const schwerpunkte = screen.getByRole("group", {
      name: /^Schwerpunkte auswählen/,
      hidden: true,
    });
    expect(
      within(schwerpunkte)
        .getAllByRole("checkbox", { hidden: true })
        .map((checkbox) => checkbox.getAttribute("value")),
    ).toEqual(prinzip.Aspekte.map((aspekt) => slugify(aspekt.Kurzbezeichnung)));

    // One Erklärung for all answers, its hint only for "yes"
    const erklaerung = screen.getByRole("textbox", {
      name: "Erklärung",
      hidden: true,
    });
    const hint = dom.getElementById(
      erklaerung.getAttribute("aria-describedby")!,
    )!;
    expect(hint.querySelector("[data-wizard-show-if]")).toHaveAttribute(
      "data-wizard-show-is",
      '["yes"]',
    );
    expect(hint).toHaveTextContent(prinzip.Erklaerungshilfe.slice(0, 20));
  });

  it("shows the Prinzip's help and Schwerpunkte in the help panel", async () => {
    const { prinzip, dom, screen } = await renderFirstPrinzip();

    // next to the heading and the Schwerpunkte
    expect(
      screen.getAllByRole("button", { name: "Hilfe anzeigen", hidden: true }),
    ).toHaveLength(2);
    const help = within(dom.getElementById("help-section-prinzip")!);
    expect(help.getByRole("heading")).toHaveTextContent(
      `Hinweis zu „${prinzip.Name}“`,
    );
    expect(
      help.getByRole("link", { name: `Mehr zum Prinzip ${prinzip.order}` }),
    ).toHaveAttribute("href", expect.stringContaining(prinzip.URLBezeichnung));
    const schwerpunkte = within(
      dom.getElementById("help-section-schwerpunkte")!,
    );
    expect(
      schwerpunkte
        .getAllByRole("group")
        .map((details) =>
          details.querySelector("summary")?.textContent?.trim(),
        ),
    ).toEqual(prinzip.Aspekte.map((aspekt) => aspekt.Kurzbezeichnung));
  });
});

describe("Dokumentation step EU-Interoperabilität", () => {
  it("asks for the EU-Bezug and links the regulation in the help", async () => {
    const { dom, screen, names } = await renderStep(
      EuInteroperabilitaet,
      assistent_dokumentation_euInteroperabilitaet.path,
    );

    expect([...names]).toEqual(Object.keys(euInteroperabilitaetSchema.shape));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Bezug zu EU-Interoperabilität",
    );
    const radios = screen.getByRole("radiogroup", {
      name: "Ergab die Vorprüfung Bezug zu EU-Interoperabilität?",
    });
    expect(
      within(radios)
        .getAllByRole("radio")
        .map((radio) => radio.getAttribute("value")),
    ).toEqual(["yes", "no"]);

    const help = within(
      dom.getElementById("help-section-eu-interoperabilitaet")!,
    );
    expect(
      help.getByRole("link", { name: /Art\. 3 der Verordnung/ }),
    ).toHaveAttribute("href", expect.stringContaining("art_3"));
    expect(
      help.getByRole("link", {
        name: "Wann ist eine Interoperabilitäts-Bewertung verpflichtend?",
      }),
    ).toHaveAttribute(
      "href",
      expect.stringContaining("#verbindliche-anforderungen"),
    );
  });
});

describe("Dokumentation step Verbindliche Anforderungen", () => {
  it("renders the fields of one Anforderung as the list's template", async () => {
    const { dom, screen } = await renderStep(
      VerbindlicheAnforderungen,
      assistent_dokumentation_euInteroperabilitaet_verbindlicheAnforderungen.path,
    );

    // The items are rendered by bindStepForm in the browser
    const list = dom.querySelector(
      '[data-wizard-list="verbindliche-anforderungen"]',
    )!;
    const item = list.querySelector("template")!.content;
    // The Bereiche are checkboxes sharing a name
    expect([
      ...new Set(
        Array.from(item.querySelectorAll("[name]"), (control) =>
          control.getAttribute("name"),
        ),
      ),
    ]).toEqual(
      Object.keys(anforderungSchema.shape).map(
        (key) => `verbindliche-anforderungen.{index}.${key}`,
      ),
    );
    expect(
      Array.from(
        item.querySelectorAll(
          'input[type="checkbox"][name="verbindliche-anforderungen.{index}.bereiche"]',
        ),
        (option) => option.getAttribute("value"),
      ),
    ).toEqual(bereichOptions.map(({ value }) => value));
    expect(
      within(list as HTMLElement).getByRole("button", {
        name: "Verbindliche Anforderung hinzufügen",
      }),
    ).toBeInTheDocument();

    expect(
      dom.getElementById("help-section-verbindliche-anforderungen"),
    ).toHaveTextContent("Art. 2 Nr. 15 der Verordnung");
    expect(
      dom.getElementById("help-section-grenzueberschreitende-dienste"),
    ).toHaveTextContent("ErwG 6 der Verordnung (EU) 2024/903");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Verbindliche Anforderungen",
    );
  });
});

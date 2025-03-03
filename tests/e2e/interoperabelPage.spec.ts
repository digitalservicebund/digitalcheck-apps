import { expect, test } from "@playwright/test";
import {
  ROUTE_INTEROPERABILITY,
  ROUTE_PRECHECK,
} from "~/resources/staticRoutes";

test.describe("test interoperabel landing page", () => {
  test.beforeEach("Go to interoperabel landing page", async ({ page }) => {
    await page.goto(ROUTE_INTEROPERABILITY.url);
  });

  test("links to pre-check", async ({ page }) => {
    await page.getByRole("link", { name: "Zur Vorprüfung" }).click();
    await expect(page).toHaveURL(ROUTE_PRECHECK.url);
    await expect(page.getByRole("main")).toContainText(
      "Vorprüfung: Digitalbezug einschätzen",
    );
  });

  [
    {
      name: "Verordnung für ein interoperables Europa (EU 2024/903)",
      href: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32024R0903",
    },
    {
      name: "EUR-Lex - Verordnung für ein interoperables Europa EU 2024/903",
      href: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32024R0903",
    },
    {
      name: "Ressourcen auf dem Interoperable Europe Portal",
      href: "https://interoperable-europe.ec.europa.eu/",
    },
    {
      name: "Interoperabilitätsrahmen",
      href: "https://interoperable-europe.ec.europa.eu/collection/nifo-national-interoperability-framework-observatory/solution/european-interoperability-framework-eif-toolbox",
    },
    {
      name: "Richtlinien Interoperabilitätsbewertungen",
      href: "https://interoperable-europe.ec.europa.eu/collection/assessments/assessment-guidelines",
    },
    {
      name: "Interoperable Europe Portal - FAQs",
      href: "https://interoperable-europe.ec.europa.eu/interoperable-europe/faqs",
    },
    {
      name: "European Commission - European Interoperability Framework",
      href: "https://ec.europa.eu/isa2/eif_en/",
    },
    {
      name: "Guidelines for interoperability assessments",
      href: "https://interoperable-europe.ec.europa.eu/collection/assessments/assessment-guidelines",
    },
  ].forEach(({ name, href }) => {
    test(`link "${name}" has href "${href}"`, async ({ page }) => {
      const links = await page.getByRole("link", { name: name }).all();

      for (const link of links) {
        await expect(link).toHaveAttribute("href", href);
      }
    });
  });
});

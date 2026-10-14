import { expect, test } from "@playwright/test";

import {
  allRoutes,
  barrierefreiheit,
  datenschutz,
  dokumentation,
  grundlagen,
  home,
  impressum,
  methoden,
  prinzipien,
  type Route,
  vorpruefung,
  vorpruefung_ergebnis,
  vorpruefung_hinweise,
} from "@/config/routes";
import { preCheck } from "@/resources/content/vorpruefung";
import { waitForHydration } from "./helpers";

function getExpectedTitle(route: Pick<Route, "path" | "title">) {
  const titleSuffix = " — Digitalcheck";

  if (route.path === home.path)
    return "Digitalcheck: Digitaltaugliche Regelungen erarbeiten";
  if (
    route.path === grundlagen.path ||
    route.path === "/grundlagen/fuenf-prinzipien"
  ) {
    // this page does not exist and redirects to the sub-page
    return `${prinzipien.title}${titleSuffix}`;
  }
  if (
    route.path.startsWith(dokumentation.path) &&
    route.path !== dokumentation.path
  ) {
    // subpages of documentation
    return `Dokumentation: ${route.title}${titleSuffix}`;
  }
  if (route.path.startsWith(vorpruefung.path)) {
    return `Vorprüfung: ${route.title}${titleSuffix}`;
  }

  return `${route.title}${titleSuffix}`;
}

test.describe("page titles", () => {
  allRoutes
    .filter(
      (route) =>
        !route.isStagingOnly &&
        !route.path.endsWith(".pdf") &&
        !route.path.startsWith(vorpruefung.path),
    )
    .forEach((route) => {
      test(`${route.path} has correct title`, async ({ page }) => {
        await page.goto(route.path);
        await expect(page).toHaveTitle(getExpectedTitle(route));
      });
    });

  // pre-check pages redirect to first unanswered question
  test("pre-check page titles", async ({ page }) => {
    await page.goto(vorpruefung.path);
    await expect(page).toHaveTitle(getExpectedTitle(vorpruefung));

    await page.goto(vorpruefung_hinweise.path);
    await expect(page).toHaveTitle(getExpectedTitle(vorpruefung_hinweise));

    await page.goto(preCheck.questions[0].path);
    for (const question of preCheck.questions) {
      await page.waitForURL(question.path);
      await waitForHydration(page);
      await expect(page).toHaveTitle(getExpectedTitle(question));
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }

    await expect(page).toHaveURL(vorpruefung_ergebnis.path);
    await expect(page).toHaveTitle(getExpectedTitle(vorpruefung_ergebnis));
  });

  test("error page title is correct", async ({ page }) => {
    await page.goto("/does-not-exist");
    await expect(page).toHaveTitle("Fehler — Digitalcheck");
  });
});

test.describe("landing page", () => {
  test("landing is reachable and has h1", async ({ page }) => {
    await page.goto("/");
    // noinspection CssInvalidPseudoSelector
    await expect(
      page.locator("h1:has-text('Digitaltaugliche Regelungen erarbeiten')"),
    ).toBeVisible();
  });

  test("CTA on landing works", async ({ page }) => {
    await page.goto(home.path);
    await page
      .getByRole("link", { name: "Digitalcheck starten" })
      .first()
      .click();
    await expect(page).toHaveURL(vorpruefung.path);
  });
});

test("footer is displayed", async ({ page }) => {
  await page.goto(home.path);
  const footerEl = page.getByRole("contentinfo", { name: "Seitenfußbereich" });
  await expect(footerEl).toBeVisible();
  await expect(
    footerEl.getByRole("navigation", { name: "Schnellübersicht" }),
  ).toBeVisible();
  await expect(
    footerEl.getByRole("navigation", { name: "Externe Verlinkungen" }),
  ).toBeVisible();
});

test.describe("links", () => {
  [
    { name: "Datenschutzerklärung", url: datenschutz.path },
    { name: "Barrierefreiheit", url: barrierefreiheit.path },
    { name: "Impressum", url: impressum.path },
  ].forEach(({ name, url }) => {
    test(`link ${url} in footer works`, async ({ page }) => {
      await page.goto(home.path);
      await page.getByRole("link", { name: name }).click();
      await expect(page).toHaveURL(url);
    });
  });

  test("links in landing page work", async ({ page }) => {
    await page.goto(home.path);
    await page
      .getByRole("main")
      .getByRole("link", { name: "Zur Erarbeitung" })
      .click();
    await expect(page).toHaveURL(methoden.path);
  });

  test("links leading to external pages have icon", async ({ page }) => {
    await page.goto(home.path, { waitUntil: "domcontentloaded" });
    const linkLocator = page.getByRole("link", {
      name: "DigitalService GmbH des Bundes",
    });
    const afterBackgroundColor = await linkLocator.evaluate((el) => {
      return globalThis
        .getComputedStyle(el, "::after")
        .getPropertyValue("background-color");
    });
    expect(afterBackgroundColor).toBeTruthy();
  });
});

test.describe("error pages", () => {
  test("error page is displayed for 404s", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("main")).toContainText(
      "Seite konnte nicht gefunden werden",
    );
  });

  test("can return to landing page from an error", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await page.getByRole("link", { name: "Zurück zur Startseite" }).click();
    await expect(page).toHaveURL(home.path);
  });
});

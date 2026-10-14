import { AxeBuilder } from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { allRoutes, prinzipien, vorpruefung_ergebnis } from "@/config/routes";
import { preCheck } from "@/resources/content/vorpruefung";
import { waitForHydration } from "../e2e/helpers";
import { checkHeadingsForFlowContent } from "./utils.ts";

// The vorpruefung sub-routes redirect to the first step (/vorpruefung/it-system)
// when no answer data is stored, which causes the axe analysis to fail mid-navigation.
// A separate test with automated interaction is added below
const excludedRoutes = [
  ...preCheck.questions.map((question) => question.path),
  vorpruefung_ergebnis.path,
];

async function checkPage(page: Page) {
  await waitForHydration(page);
  const accessibilityResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityResults.violations).toEqual([]);

  await checkHeadingsForFlowContent(page);
}

test.describe("basic example a11y test", () => {
  allRoutes
    .filter((route) => !route.isStagingOnly)
    .filter((route) => !excludedRoutes.includes(route.path))
    .forEach((route, i) => {
      test(`check a11y of ${route.path} (${i})`, async ({ page }) => {
        // Listen for redirects and update URL if needed
        const response = await page.goto(route.path);

        if (response !== null && [301, 302].includes(response.status())) {
          const redirectedUrl = response.headers()["location"];
          await page.goto(redirectedUrl);
        }

        await checkPage(page);
      });
    });

  test("check a11y of principle pages", async ({ page }) => {
    const principlesUrl = prinzipien.path;
    await page.goto(principlesUrl);

    const principleLinks = page.locator(`a[href^="${principlesUrl}/"]`); // all URLs starting with current URL

    const urlPromises = (await principleLinks.all()).map((element) =>
      element.getAttribute("href"),
    );
    // dedupe, as the overview links each principle multiple times
    const urls = [
      ...new Set((await Promise.all(urlPromises)).filter((url) => !!url)),
    ] as string[];

    expect(urls.length).toBeGreaterThanOrEqual(5);

    for (const url of urls) {
      await page.goto(url);
      await checkPage(page);
    }
  });

  test("check a11y of vorpruefung question pages", async ({ page }) => {
    const { questions } = preCheck;

    // Start at the first question — subsequent questions are only reachable
    // after answering the previous ones (otherwise the route redirects back).
    await page.goto(questions[0].path);

    for (const question of questions) {
      await page.waitForURL(question.path);
      await checkPage(page);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }

    // Check the result page after all questions are answered
    await page.waitForURL(vorpruefung_ergebnis.path);
    await checkPage(page);
  });
});

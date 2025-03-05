import { expect, type Page, test } from "@playwright/test";
import { preCheck } from "~/resources/content";
import { ROUTE_RESULT } from "~/resources/staticRoutes";

const { questions } = preCheck;

test.describe("test unsure result for digital and unsure for interoperability", () => {
  let page: Page;
  test.beforeAll(
    "answer all digital questions with unsure and go to result page",
    async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page.getByLabel("Ich bin unsicher").click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test.beforeEach("go to result page", async () => {
    await page.goto(ROUTE_RESULT.url);
  });

  test.afterAll("close page", async () => {
    await page.close();
  });

  test("page headline shows unsure result", async () => {
    await expect(page.getByRole("main")).toContainText(
      "Sie haben mehrere Aussagen mit „Ich bin unsicher“ beantwortet.",
    );
  });

  test("page contains all answers in unsure form", async () => {
    await expect(page.getByRole("main")).toContainText(
      "In Bezug auf digitale Aspekte ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
    );
    await expect(page.getByRole("main")).toContainText(
      "In Bezug auf Interoperabilität ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
    );
    for (const question of questions) {
      await expect(page.getByRole("main")).toContainText(
        question.positiveResult,
      );
    }
  });

  test("page contains link to interoperability landing page", async () => {
    await expect(page.getByRole("main")).toContainText(
      "Erfahren Sie mehr über Interoperabilität",
    );
    await expect(
      page.getByRole("link", { name: "Mehr zu Interoperabilität" }),
    ).toBeVisible();
  });

  test("form is not shown", async () => {
    await expect(page.getByTestId("result-form")).not.toBeVisible();
  });
});

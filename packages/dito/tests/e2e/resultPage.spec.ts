import { expect, test } from "@playwright/test";
import { preCheck } from "resources/content";
import {
  ROUTE_DOCUMENTATION,
  ROUTE_METHODS,
  ROUTE_PRECHECK,
  ROUTE_RESULT,
} from "resources/staticRoutes";
import { PRE_CHECK_START_BUTTON_ID } from "routes/vorpruefung._index.tsx";

test.describe("test result page general content", () => {
  test.beforeEach("Click though preCheck", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    for (let i = 0; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.waitForURL(ROUTE_RESULT.url);
  });

  test("happy path leads to positive result", async ({ page }) => {
    await expect(page).toHaveURL(ROUTE_RESULT.url);
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat Digitalbezug.",
    );
  });

  test("result page links to methods", async ({ page }) => {
    await page.getByRole("link", { name: "Zu den Hilfestellungen" }).click();
    await expect(page).toHaveURL(ROUTE_METHODS.url);
  });

  test("result page links to documentation", async ({ page }) => {
    await page.getByRole("link", { name: "Dokumentation" }).click();
    await expect(page).toHaveURL(ROUTE_DOCUMENTATION.url);
  });
});

test.describe("test result page reasoning", () => {
  test.beforeEach("Start preCheck", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
  });

  test("one positive answer leads to positive result", async ({ page }) => {
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 1; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Nein").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat Digitalbezug.",
    );
  });

  test("only positive answers are shown as reasons in positive case", async ({
    page,
  }) => {
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 1; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat Digitalbezug.",
    );
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben ...",
    );
    await expect(page.getByRole("main")).not.toContainText("IT-Systems");
  });

  test("checking all negative answers leads to negative result", async ({
    page,
  }) => {
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 1; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Nein").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(ROUTE_RESULT.url);
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat keinen Digitalbezug.",
    );
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben ...",
    );
  });

  test("checking mix of unsure and negative answers leads to unsure result", async ({
    page,
  }) => {
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 1; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Nein").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(ROUTE_RESULT.url);
    await expect(page.getByRole("main")).toContainText("Digitalcheck-Support");
    await expect(page.getByRole("main")).toContainText(
      "Sie haben mehrere Aussagen mit „Ich bin unsicher“ beantwortet.",
    );
    await expect(page.getByRole("main")).toContainText(
      `mit „Ich bin unsicher“ beantwortet`,
    );
    await expect(page.getByRole("main")).toContainText(
      `mit „Nein“ beantwortet`,
    );
    await expect(page.getByRole("main")).not.toContainText("nächsten Schritte");
  });
});

test.describe("test result page redirects", () => {
  test("result page with no answers redirects to precheck", async ({
    page,
  }) => {
    await page.goto(ROUTE_RESULT.url);
    await expect(page).toHaveURL(ROUTE_PRECHECK.url);
  });

  test("result page without all answers redirects to precheck", async ({
    page,
  }) => {
    await page.goto(ROUTE_PRECHECK.url);
    await page.getByTestId(PRE_CHECK_START_BUTTON_ID).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(ROUTE_RESULT.url);
    await expect(page).toHaveURL(ROUTE_PRECHECK.url);
  });
});

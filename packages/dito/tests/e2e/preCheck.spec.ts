import { expect, test } from "@playwright/test";
import { preCheck } from "resources/content";
import * as staticRoutes from "resources/staticRoutes";

test.describe("test questions form", () => {
  test("all answer options are submittable", async ({ page }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page).toHaveURL(staticRoutes.PATH_RESULT);
  });

  test("clicking through questions works", async ({ page }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    for (let i = 0; i < 5; i++) {
      // check that the page shows correct question
      await expect(page).toHaveURL(preCheck.questions[i].url);
      await expect(page.getByLabel("navigation")).toContainText(
        preCheck.questions[i].title,
      );
      await expect(page.getByRole("main")).toContainText(`Frage ${i + 1}`);
      await expect(page.getByRole("main")).toContainText(
        preCheck.questions[i].question,
      );
      const hint = preCheck.questions[i].hint;
      if (hint) {
        await expect(page.getByRole("main")).toContainText(hint.title);
      }
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(staticRoutes.PATH_RESULT);
  });

  test("cant submit form without answers", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page).toHaveURL(preCheck.questions[0].url);
    await expect(page.getByRole("main")).toContainText(
      "Bitte wählen Sie eine Option aus.",
    );
  });

  test("back button works", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(staticRoutes.PATH_PRECHECK);
    await page.goto(preCheck.questions[0].url);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page).toHaveURL(preCheck.questions[1].url);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(preCheck.questions[0].url);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(staticRoutes.PATH_PRECHECK);
  });

  test("answers are saved and loaded from cookie and persisted across navigations and submissions", async ({
    page,
  }) => {
    // was a bit of a hassle to get the cookie and react-hook-form to work together with useEffect
    // that's why the test is a bit more extensive than it could be
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByLabel("Ja").click();
    await page.reload();
    await expect(page.getByLabel("Ja")).not.toBeChecked();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Ich bin unsicher")).toBeChecked();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.goto(preCheck.questions[0].url);
    await expect(page.getByLabel("Ja")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page.getByLabel("Ich bin unsicher")).toBeChecked();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.reload();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Ja")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page.getByLabel("Ich bin unsicher")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page.getByLabel("Ja")).not.toBeChecked();
    await expect(page.getByLabel("Nein")).not.toBeChecked();
    await expect(page.getByLabel("Ich bin unsicher")).not.toBeChecked();
  });

  test("redirect to first unanswered question", async ({ page }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(preCheck.questions[4].url);
    await expect(page).toHaveURL(preCheck.questions[2].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(preCheck.questions[4].url);
    await expect(page).toHaveURL(preCheck.questions[3].url);
  });

  // test cookie is reset
  test("answers / cookie is reset on preCheck start", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByRole("link", { name: "Zurück" }).click();
    await page.getByRole("link", { name: "Zurück" }).click();
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await expect(page.getByLabel("Ja")).not.toBeChecked();
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.goto(preCheck.questions[0].url);
    await expect(page.getByLabel("Ja")).not.toBeChecked();
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Einschätzen" }).click();
    await expect(page.getByLabel("Ja")).not.toBeChecked();
  });
});

test.describe("test result page", () => {
  test("happy path leads to positive result", async ({ page }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    // click through all 5 question pages
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(staticRoutes.PATH_RESULT);
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat einen Digitalbezug.",
    );
  });

  test("only positive answers are shown as reasons", async ({ page }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 0; i < 4; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat einen Digitalbezug.",
    );
    await expect(page.getByRole("main")).not.toContainText("IT-System");
  });

  test("result page links to documentation", async ({ page }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.getByRole("link", { name: "Dokumentation" }).click();
    await expect(page).toHaveURL(staticRoutes.PATH_DOCUMENTATION);
  });

  test("result page with no answers redirects to precheck", async ({
    page,
  }) => {
    await page.goto(staticRoutes.PATH_RESULT);
    await expect(page).toHaveURL(staticRoutes.PATH_PRECHECK);
  });

  test("result page without all answers redirects to precheck", async ({
    page,
  }) => {
    await page.goto(staticRoutes.PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(staticRoutes.PATH_RESULT);
    await expect(page).toHaveURL(staticRoutes.PATH_PRECHECK);
  });
});

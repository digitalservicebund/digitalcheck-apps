import { expect, test } from "@playwright/test";
import { preCheck } from "resources/content";
import { ROUTE_PRECHECK, ROUTE_RESULT } from "resources/staticRoutes";

const { questions } = preCheck;

test.describe("test questions form", () => {
  test("all answer options are submittable", async ({ page }) => {
    await page.goto(ROUTE_PRECHECK.url);
    await page.getByRole("link", { name: "Einschätzung starten" }).click();
    await page.waitForURL(preCheck.questions[0].url);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(preCheck.questions[1].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(preCheck.questions[2].url);
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(preCheck.questions[3].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(preCheck.questions[4].url);
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page).toHaveURL(ROUTE_RESULT.url);
  });

  test("clicking through questions works", async ({ page }) => {
    await page.goto(ROUTE_PRECHECK.url);
    await page.getByRole("link", { name: "Einschätzung starten" }).click();
    for (let i = 0; i < 5; i++) {
      // check that the page shows correct question
      await expect(page).toHaveURL(questions[i].url);
      await expect(page.getByTestId("breadcrumbs-menu")).toContainText(
        questions[i].title,
      );
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        questions[i].question.replaceAll("&#8209;", "‑"), // workaround for non-breaking hyphen present in last question
      );
      const hint = questions[i].hint;
      if (hint) {
        await expect(page.getByRole("main")).toContainText(hint.title);
      }
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(ROUTE_RESULT.url);
  });

  test("cant submit form without answers", async ({ page }) => {
    await page.goto(questions[0].url);
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page).toHaveURL(questions[0].url);
    await expect(page.getByRole("main")).toContainText(
      "Bitte wählen Sie eine Option aus.",
    );
  });

  test("back button works", async ({ page }) => {
    await page.goto(questions[0].url);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(ROUTE_PRECHECK.url);
    await page.goto(questions[0].url);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page).toHaveURL(questions[1].url);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(questions[0].url);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(ROUTE_PRECHECK.url);
  });

  test("answers are saved and loaded from cookie and persisted across navigations and submissions", async ({
    page,
  }) => {
    // was a bit of a hassle to get the cookie and react-hook-form to work together with useEffect
    // that's why the test is a bit more extensive than it could be
    // we've sinced moved to using rvf but we'll keep it like this for now
    await page.goto(ROUTE_PRECHECK.url);
    await page.getByRole("link", { name: "Einschätzung starten" }).click();
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[1].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[2].url);
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[3].url);
    await expect(page).toHaveURL(questions[3].url);
    await page.getByLabel("Ja").click();
    await page.reload();
    await expect(page).toHaveURL(questions[3].url);
    await expect(page.getByLabel("Ja")).not.toBeChecked();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Ich bin unsicher")).toBeChecked();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.goto(questions[0].url);
    await expect(page.getByLabel("Ja")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[1].url);
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[2].url);
    await expect(page.getByLabel("Ich bin unsicher")).toBeChecked();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.reload();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Ja")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[1].url);
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[2].url);
    await expect(page.getByLabel("Ich bin unsicher")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[3].url);
    await expect(page.getByLabel("Ja")).not.toBeChecked();
    await expect(page.getByLabel("Nein")).not.toBeChecked();
    await expect(page.getByLabel("Ich bin unsicher")).not.toBeChecked();
  });

  test("redirect to first unanswered question", async ({ page }) => {
    await page.goto(ROUTE_PRECHECK.url);
    await page.getByRole("link", { name: "Einschätzung starten" }).click();
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[1].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[2].url);
    await page.goto(questions[4].url);
    await expect(page).toHaveURL(questions[2].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[3].url);
    await page.goto(questions[4].url);
    await expect(page).toHaveURL(questions[3].url);
  });
});

test.describe("test question navigation", () => {
  test("navigation leads to correct pages", async ({ page }) => {
    await page.goto(ROUTE_PRECHECK.url);
    await page.getByRole("link", { name: "Einschätzung starten" }).click();
    for (let i = 0; i < 4; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }

    // Click on each question link and verify it leads to the correct page
    for (const question of questions) {
      await page.getByRole("link", { name: question.title }).click();
      await expect(page).toHaveURL(question.url);
    }
  });

  test("only answered and first unanswered question are clickable", async ({
    page,
  }) => {
    await page.goto(questions[0].url);
    for (let i = 1; i < 5; i++) {
      await expect(
        page.getByRole("link", { name: questions[i].title }),
      ).toBeDisabled();
    }

    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(
      page.getByRole("link", { name: questions[0].title }),
    ).toBeEnabled();
    for (let i = 2; i < 5; i++) {
      await expect(
        page.getByRole("link", { name: questions[i].title }),
      ).toBeDisabled();
    }

    await page.goto(questions[0].url);
    await expect(
      page.getByRole("link", { name: questions[1].title }),
    ).toBeEnabled();
    for (let i = 2; i < 5; i++) {
      await expect(
        page.getByRole("link", { name: questions[i].title }),
      ).toBeDisabled();
    }
  });

  test("navigation resets when cookie is cleared", async ({ page }) => {
    await page.goto(questions[0].url);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(
      page.getByRole("link", { name: questions[0].title }),
    ).toBeDisabled();
  });

  test("current page is disabled, has aria-current and active styling", async ({
    page,
  }) => {
    await page.goto(questions[0].url);

    // Check if the first question link is disabled and has aria-current attribute
    await expect(
      page.getByRole("link", { name: questions[0].title }),
    ).toBeDisabled();
    await expect(
      page.getByRole("link", { name: questions[0].title }),
    ).toHaveAttribute("aria-current", "true");
    await expect(
      page.getByRole("listitem").filter({ hasText: questions[0].title }),
    ).toHaveClass(/border-l-/);

    // Navigate to the second question
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();

    // Check if the second question link is disabled and has aria-current attribute
    await expect(
      page.getByRole("link", { name: questions[1].title }),
    ).toBeDisabled();
    await expect(
      page.getByRole("link", { name: questions[1].title }),
    ).toHaveAttribute("aria-current", "true");
    await expect(
      page.getByRole("listitem").filter({ hasText: questions[0].title }),
    ).toHaveClass(/border-l-/);
  });

  test("answered question have check mark icon", async ({ page }) => {
    await page.goto(questions[0].url);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();

    // Check if the first question has a check mark icon
    await expect(
      page
        .getByRole("link", { name: questions[0].title })
        .getByTestId("CheckIcon"),
    ).toBeVisible();

    // Check second question is not checked
    await expect(
      page
        .getByRole("link", { name: questions[1].title })
        .getByTestId("CheckIcon"),
    ).not.toBeVisible();

    // Answer the second question
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();

    // Check if the second question has a check mark icon
    await expect(
      page
        .getByRole("link", { name: questions[1].title })
        .getByTestId("CheckIcon"),
    ).toBeVisible();
  });
});

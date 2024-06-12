import { expect, test } from "@playwright/test";
import { preCheck } from "resources/content";
import {
  PATH_DOCUMENTATION,
  PATH_PRECHECK,
  PATH_RESULT,
} from "resources/staticRoutes";

const { questions } = preCheck;

test.describe("test questions form", () => {
  test("all answer options are submittable", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
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
    await expect(page).toHaveURL(PATH_RESULT);
  });

  test("clicking through questions works", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    for (let i = 0; i < 5; i++) {
      // check that the page shows correct question
      await expect(page).toHaveURL(questions[i].url);
      await expect(page.getByLabel("navigation")).toContainText(
        questions[i].title,
      );
      await expect(page.getByRole("main")).toContainText(`Frage ${i + 1}`);
      await expect(page.getByRole("main")).toContainText(questions[i].question);
      const hint = questions[i].hint;
      if (hint) {
        await expect(page.getByRole("main")).toContainText(hint.title);
      }
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(PATH_RESULT);
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
    await expect(page).toHaveURL(PATH_PRECHECK);
    await page.goto(questions[0].url);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page).toHaveURL(questions[1].url);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(questions[0].url);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(PATH_PRECHECK);
  });

  test("answers are saved and loaded from cookie and persisted across navigations and submissions", async ({
    page,
  }) => {
    // was a bit of a hassle to get the cookie and react-hook-form to work together with useEffect
    // that's why the test is a bit more extensive than it could be
    await page.goto(PATH_PRECHECK);
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
    await page.goto(questions[0].url);
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
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(questions[4].url);
    await expect(page).toHaveURL(questions[2].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(questions[4].url);
    await expect(page).toHaveURL(questions[3].url);
  });

  // test cookie is reset
  test("answers / cookie is reset on preCheck start", async ({ page }) => {
    await page.goto(questions[0].url);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByRole("link", { name: "Zurück" }).click();
    await page.getByRole("link", { name: "Zurück" }).click();
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await expect(page.getByLabel("Ja")).not.toBeChecked();
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.goto(questions[0].url);
    await expect(page.getByLabel("Ja")).not.toBeChecked();
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Einschätzen" }).click();
    await expect(page.getByLabel("Ja")).not.toBeChecked();
  });
});

test.describe("test question navigation", () => {
  test("navigation leads to correct pages", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    for (let i = 0; i < 4; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }

    // Click on each question link and verify it leads to the correct page
    for (const question of questions) {
      await page.getByRole("link", { name: question.title }).click();
      await expect(page).toHaveURL(question.url);
    }
  });

  test("first question is clickable on start", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "IT-System" }).click();
    await expect(page).toHaveURL(questions[0].url);
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
      page.getByRole("link", { name: questions[0].title }),
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
      page.getByRole("link", { name: questions[1].title }),
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

test.describe("test result page", () => {
  test("happy path leads to positive result", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    // click through all 5 question pages
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(PATH_RESULT);
    await expect(page.getByRole("main")).toContainText(
      "Ihr Regelungsvorhaben hat einen Digitalbezug.",
    );
  });

  test("only positive answers are shown as reasons", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
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
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.getByRole("link", { name: "Dokumentation" }).click();
    await expect(page).toHaveURL(PATH_DOCUMENTATION);
  });

  test("result page with no answers redirects to precheck", async ({
    page,
  }) => {
    await page.goto(PATH_RESULT);
    await expect(page).toHaveURL(PATH_PRECHECK);
  });

  test("result page without all answers redirects to precheck", async ({
    page,
  }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(PATH_RESULT);
    await expect(page).toHaveURL(PATH_PRECHECK);
  });
});

import {
  vorpruefung,
  vorpruefung_ergebnis,
  vorpruefung_hinweise,
} from "@/config/routes";
import { PRE_CHECK_START_BUTTON_ID } from "@/resources/constants";
import { preCheck } from "@/resources/content/vorpruefung";
import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

const { questions } = preCheck;

const SCREEN_LG = 1024; // tailwind lg breakpoint

test.describe("test questions form", () => {
  test("all answer options are submittable", async ({ page }) => {
    await page.goto(questions[0].path);
    const answerOptions = ["Ja", "Nein", "Ich bin unsicher"];
    for (let i = 0; i < questions.length; i++) {
      await page.waitForURL(questions[i].path);
      await waitForHydration(page);
      await page.getByLabel(answerOptions[i % answerOptions.length]).click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(vorpruefung_ergebnis.path);
  });

  test("clicking through pre-check works", async ({ page }) => {
    await page.goto(vorpruefung.path);
    await waitForHydration(page);
    await page.getByTestId(PRE_CHECK_START_BUTTON_ID).click();
    await page.waitForURL(vorpruefung_hinweise.path);
    await waitForHydration(page);
    await page.getByRole("link", { name: "Okay & weiter" }).click();
    for (const element of questions) {
      await page.waitForURL(element.path);
      await waitForHydration(page);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        element.question.replaceAll("&#8209;", "‑"), // workaround for non-breaking hyphen present in last question
      );
      const hint = element.hint;
      if (hint) {
        await expect(page.getByRole("main")).toContainText(hint.title);
      }
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(vorpruefung_ergebnis.path);
  });

  test("cant submit form without answers", async ({ page }) => {
    await page.goto(questions[0].path);
    await waitForHydration(page);
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page).toHaveURL(questions[0].path);
    await expect(page.getByRole("main")).toContainText(
      "Bitte wählen Sie eine Option aus.",
    );
  });

  test("back button works", async ({ page }) => {
    await page.goto(questions[0].path);
    await waitForHydration(page);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(vorpruefung_hinweise.path);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(vorpruefung.path);
    await page.goto(questions[0].path);
    await waitForHydration(page);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(page).toHaveURL(questions[1].path);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(questions[0].path);
  });

  test("answers are saved and loaded from cookie and persisted across navigations and submissions", async ({
    page,
    browserName,
    browser,
  }) => {
    // TODO remove skip condition, check on 2025-12-10
    test.skip(
      browserName === "webkit" && browser.version() === "26.0",
      "due to https://github.com/microsoft/playwright/issues/37766, to be addressed in Playwright 1.57",
    );
    // was a bit of a hassle to get the cookie and react-hook-form to work together with useEffect
    // that's why the test is a bit more extensive than it could be
    // we've sinced moved to using rvf but we'll keep it like this for now
    await page.goto(questions[0].path);
    await page.waitForURL(questions[0].path);
    await waitForHydration(page);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[1].path);
    await waitForHydration(page);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[2].path);
    await waitForHydration(page);
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[3].path);
    await waitForHydration(page);
    await expect(page).toHaveURL(questions[3].path);
    await page.getByLabel("Ja").click();
    await page.reload();
    await waitForHydration(page);
    await expect(page).toHaveURL(questions[3].path);
    await expect(page.getByLabel("Ja")).not.toBeChecked();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Ich bin unsicher")).toBeChecked();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.goto(questions[0].path);
    await waitForHydration(page);
    await expect(page.getByLabel("Ja")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[1].path);
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[2].path);
    await expect(page.getByLabel("Ich bin unsicher")).toBeChecked();
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.reload();
    await waitForHydration(page);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page.getByLabel("Ja")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[1].path);
    await expect(page.getByLabel("Nein")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[2].path);
    await expect(page.getByLabel("Ich bin unsicher")).toBeChecked();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[3].path);
    await expect(page.getByLabel("Ja")).not.toBeChecked();
    await expect(page.getByLabel("Nein")).not.toBeChecked();
    await expect(page.getByLabel("Ich bin unsicher")).not.toBeChecked();
  });

  test("redirect to first unanswered question", async ({ page }) => {
    await page.goto(questions[0].path);
    await page.waitForURL(questions[0].path);
    await waitForHydration(page);
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[1].path);
    await waitForHydration(page);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[2].path);
    await page.goto(questions[4].path);
    await expect(page).toHaveURL(questions[2].path);
    await waitForHydration(page);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[3].path);
    await page.goto(questions[4].path);
    await expect(page).toHaveURL(questions[3].path);
  });
});

test.describe("test question navigation", () => {
  test.beforeEach("skip tests on small screens", ({ viewport }) => {
    test.skip(
      Boolean(viewport && viewport.width < SCREEN_LG),
      "Skipping because sidebar navigation is not visible on small screen",
    );
  });

  test("navigation leads to correct pages", async ({ page }) => {
    // answer all questions with "Ja", except for the last one (which would quit the wizard)
    await page.goto(questions[0].path);
    for (let i = 0; i < questions.length - 1; i++) {
      await page.waitForURL(questions[i].path);
      await waitForHydration(page);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    // wait for last question to show
    await page.waitForURL(questions.at(-1)!.path);
    await waitForHydration(page);

    // Click on each question link and verify it leads to the correct page
    for (const question of questions) {
      await page.getByRole("link", { name: question.title }).click();
      await expect(page).toHaveURL(question.path);
    }
  });

  test("only answered and first unanswered question are clickable", async ({
    page,
  }) => {
    await page.goto(questions[0].path);
    await waitForHydration(page);
    const navigation = page.getByTestId("main-nav");
    for (let i = 1; i < questions.length; i++) {
      await expect(navigation.getByText(questions[i].title)).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    }

    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await expect(
      page.getByRole("link", { name: questions[0].title }),
    ).toBeEnabled();
    for (const question of questions.slice(2)) {
      await expect(navigation.getByText(question.title)).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    }

    await page.goto(questions[0].path);
    await expect(
      page.getByRole("link", { name: questions[1].title }),
    ).toBeEnabled();
    for (const question of questions.slice(2)) {
      await expect(navigation.getByText(question.title)).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    }
  });

  test("navigation resets when starting fresh", async ({ page }) => {
    await page.goto(questions[0].path);
    const navigation = page.getByRole("navigation", { name: "Alle Fragen" });
    await expect(navigation.getByText(questions[0].title)).toHaveAttribute(
      "aria-current",
      "page",
    );
    for (const question of questions.slice(1)) {
      await expect(navigation.getByText(question.title)).toHaveAttribute(
        "aria-disabled",
      );
    }
  });

  test("current page has aria-current and active styling", async ({ page }) => {
    await page.goto(questions[0].path);
    await waitForHydration(page);

    const navigation = page.getByRole("navigation", { name: "Alle Fragen" });
    // Check if the first question has aria-current attribute
    const firstQuestionElement = navigation.getByText(questions[0].title);
    await expect(firstQuestionElement).toHaveAttribute("aria-current", "page");
    await expect(firstQuestionElement).toHaveClass(/border-l-/);

    // Navigate to the second question
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();

    await page.waitForURL(questions[1].path);

    // Check if the second question element has aria-current attribute
    const secondQuestionElement = navigation.getByText(questions[1].title);
    await expect(secondQuestionElement).toHaveAttribute("aria-current", "page");
    await expect(secondQuestionElement).toHaveClass(/border-l-/);
  });

  test("answered question have check mark icon", async ({ page }) => {
    await page.goto(questions[0].path);
    await waitForHydration(page);
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
    ).toBeHidden();

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

test.describe("test question navigation on mobile screens", () => {
  test.beforeEach("Only run tests on mobile screens", ({ viewport }) => {
    test.skip(
      Boolean(!viewport || viewport.width >= SCREEN_LG),
      "Skipping LinkBar is not visible on small screen",
    );
  });

  test("Navigation with LinkBar works and restricts unanswered questions", async ({
    page,
  }) => {
    await page.goto(questions[0].path);

    // Answer the first question
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();

    await page.waitForURL(questions[1].path);

    const linkBar = page.getByTestId("stepper");

    // Check that the first and second question link has a dark color
    await expect(
      linkBar.getByRole("link", { name: questions[0].title }),
    ).toHaveClass(/bg-kern-darkblue-800/);
    await expect(
      linkBar.getByRole("link", { name: questions[1].title }),
    ).toHaveClass(/bg-kern-darkblue-800/);

    // Navigate back to answered question
    await linkBar.getByRole("link", { name: questions[0].title }).click();
    await expect(page).toHaveURL(questions[0].path);

    // Navigate forward again to second question
    await linkBar.getByRole("link", { name: questions[1].title }).click();
    await expect(page).toHaveURL(questions[1].path);

    // Navigation to the next (unanswered) question is not possible
    const unansweredQuestionLink = linkBar.getByRole("link", {
      name: questions[2].title,
    });
    await expect(unansweredQuestionLink).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    const originalURL = page.url();
    await page.goto(questions[2].path);
    await expect(page).toHaveURL(originalURL);

    // Answer the second question
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();

    await page.waitForURL(questions[2].path);

    // Check that the second question link still has a dark color
    await expect(
      linkBar.getByRole("link", { name: questions[1].title }),
    ).toHaveClass(/bg-kern-darkblue-800/);
    await expect(
      linkBar.getByRole("link", { name: questions[2].title }),
    ).toHaveClass(/bg-kern-darkblue-800/);

    // Clicking on the second question should now navigate
    await linkBar.getByRole("link", { name: questions[1].title }).click();
    await expect(page).toHaveURL(questions[1].path);
  });
});

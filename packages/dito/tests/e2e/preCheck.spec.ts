import { expect, test } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { PDFDocument } from "pdf-lib";
import { preCheck } from "resources/content";
import {
  PATH_ASSESSMENT,
  PATH_PRECHECK,
  PATH_RESULT,
} from "resources/staticRoutes";
import {
  FIELD_NAME_POLICY_TITLE,
  FIELD_NAME_PRE_CHECK_NEGATIVE,
  FIELD_NAME_PRE_CHECK_POSITIVE_1,
  FIELD_NAME_PRE_CHECK_POSITIVE_2,
  FIELD_NAME_PRE_CHECK_POSITIVE_3,
  FIELD_NAME_PRE_CHECK_POSITIVE_4,
  FIELD_NAME_PRE_CHECK_POSITIVE_5,
} from "routes/vorpruefung_.ergebnis.einschaetzung.$fileName[.pdf]";

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
    await page.getByRole("link", { name: "Vorprüfung" }).click();
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
    await expect(page.getByRole("main")).not.toContainText("IT-Systems");
  });

  test("assessment page is available", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page
      .getByRole("link", { name: "Einschätzung als PDF bekommen" })
      .click();
    await expect(page).toHaveURL(PATH_ASSESSMENT);
  });

  test("accepts user input on assessment page", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page
      .getByRole("link", { name: "Einschätzung als PDF bekommen" })
      .click();
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #123");
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toHaveValue(
      "Policy #123",
    );
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
  });

  test("generates and downloads PDF with user input", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page
      .getByRole("link", { name: "Einschätzung als PDF bekommen" })
      .click();
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #123");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
    const download = await downloadPromise;
    expect(download.url()).toContain(
      PATH_ASSESSMENT +
        "/digitalcheck-vorpruefung.pdf?title=Policy+%23123&it-system=yes&verpflichtungen-fuer-beteiligte=yes&datenaustausch=yes&kommunikation=yes&automatisierung=yes&download",
    );
    const filePath = path.resolve(await download.path());
    const fileData = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(fileData);
    const form = pdfDoc.getForm();

    const titleField = form.getTextField(FIELD_NAME_POLICY_TITLE).getText();
    expect(titleField).toBe("Policy #123");

    const positive_1 = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_1)
      .isChecked();
    expect(positive_1).toBe(true);

    const positive_2 = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_2)
      .isChecked();
    expect(positive_2).toBe(true);

    const positive_3 = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_3)
      .isChecked();
    expect(positive_3).toBe(true);

    const positive_4 = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_4)
      .isChecked();
    expect(positive_4).toBe(true);

    const positive_5 = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_5)
      .isChecked();
    expect(positive_5).toBe(true);

    const negative = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_NEGATIVE)
      .isChecked();
    expect(negative).toBe(false);
  });

  test("generates correct PDF in negative case", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Nein").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page
      .getByRole("link", { name: "Einschätzung als PDF bekommen" })
      .click();
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #987");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
    const download = await downloadPromise;
    expect(download.url()).toContain(
      PATH_ASSESSMENT +
        "/digitalcheck-vorpruefung.pdf?title=Policy+%23987&it-system=no&verpflichtungen-fuer-beteiligte=no&datenaustausch=no&kommunikation=no&automatisierung=no&download",
    );
    const filePath = path.resolve(await download.path());
    const fileData = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(fileData);
    const form = pdfDoc.getForm();

    const titleField = form.getTextField(FIELD_NAME_POLICY_TITLE).getText();
    expect(titleField).toBe("Policy #987");

    const positive_1 = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_1)
      .isChecked();
    expect(positive_1).toBe(false);

    const positive_2 = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_2)
      .isChecked();
    expect(positive_2).toBe(false);

    const positive_3 = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_3)
      .isChecked();
    expect(positive_3).toBe(false);

    const positive_4 = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_4)
      .isChecked();
    expect(positive_4).toBe(false);

    const positive_5 = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_POSITIVE_5)
      .isChecked();
    expect(positive_5).toBe(false);

    const negative = form
      .getCheckBox(FIELD_NAME_PRE_CHECK_NEGATIVE)
      .isChecked();
    expect(negative).toBe(true);
  });

  // TODO:
  // test("negative reasoning is be provided to PDF", async ({ page }) => {

  test("result page links to documentation", async ({ page }) => {
    await page.goto(PATH_PRECHECK);
    await page.getByRole("link", { name: "Digitalbezug einschätzen" }).click();
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Dokumentation" }).click();
    expect((await downloadPromise).suggestedFilename()).toBe(
      "digitalcheck-begleitende-dokumentation.pdf",
    );
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

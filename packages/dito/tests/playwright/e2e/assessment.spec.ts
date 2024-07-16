import { expect, test } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { PDFDocument } from "pdf-lib";
import { preCheck } from "resources/content";
import { PATH_ASSESSMENT, PATH_RESULT } from "resources/staticRoutes";
import {
  FIELD_NAME_POLICY_TITLE,
  FIELD_NAME_PRE_CHECK_NEGATIVE,
  FIELD_NAME_PRE_CHECK_NEGATIVE_REASONING,
  FIELD_NAME_PRE_CHECK_POSITIVE_1,
  FIELD_NAME_PRE_CHECK_POSITIVE_2,
  FIELD_NAME_PRE_CHECK_POSITIVE_3,
  FIELD_NAME_PRE_CHECK_POSITIVE_4,
  FIELD_NAME_PRE_CHECK_POSITIVE_5,
} from "routes/vorpruefung.ergebnis.einschaetzung.$fileName[.pdf]";

test.describe("test positive assessment page and PDF", () => {
  test.beforeEach("Go to assessment page", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    for (let i = 0; i < 5; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.waitForURL(PATH_RESULT);
    await page.getByRole("link", { name: "runterladen" }).click();
  });

  test("assessment page is available", async ({ page }) => {
    await expect(page).toHaveURL(PATH_ASSESSMENT);
  });

  test("accepts user input on assessment page", async ({ page }) => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #123");
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toHaveValue(
      "Policy #123",
    );
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
  });

  test("generates and downloads PDF with user input", async ({ page }) => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #123");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
    await expect(page.getByRole("main")).toContainText(
      "Ihr Ergebnis wird heruntergeladen",
    );
    const download = await downloadPromise;
    expect(download.url()).toContain(
      PATH_ASSESSMENT + "/digitalcheck-vorpruefung.pdf",
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

    // wait 2 seconds for the download button to be reenabled
    await page.waitForTimeout(2000);
    await expect(page.getByRole("main")).not.toContainText(
      "Ihr Ergebnis wird heruntergeladen",
    );
  });

  test("title is required for PDF", async ({ page }) => {
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
    await expect(page.getByRole("main")).toContainText(
      "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
    );
    await expect(page.getByRole("main")).not.toContainText(
      "Ihr Ergebnis wird heruntergeladen",
    );
  });

  test("title can't be too long", async ({ page }) => {
    await page
      .getByLabel("Arbeitstitel des Vorhabens")
      .fill("Policy #987".repeat(500));
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
    await expect(page.getByRole("main")).toContainText("kürzeren Titel");
    await expect(page.getByRole("main")).not.toContainText(
      "Ihr Ergebnis wird heruntergeladen",
    );
  });
});

test.describe("test PDF generation in negative case", () => {
  test.beforeEach(
    "Fill preCheck questions with negative answers",
    async ({ page }) => {
      await page.goto(preCheck.questions[0].url);
      for (let i = 0; i < 5; i++) {
        await page.waitForURL(preCheck.questions[i].url);
        await page.getByLabel("Nein").click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test("generates correct PDF in negative case", async ({ page }) => {
    await page
      .getByLabel("Begründung")
      .fill("Dieses Vorhaben hat keinen Digitalbezug.");
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #987");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
    await expect(page.getByRole("main")).toContainText(
      "Ihr Ergebnis wird heruntergeladen",
    );
    const download = await downloadPromise;
    expect(download.url()).toContain(
      PATH_ASSESSMENT + "/digitalcheck-vorpruefung.pdf",
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

    const negativeReasoning = form
      .getTextField(FIELD_NAME_PRE_CHECK_NEGATIVE_REASONING)
      .getText();
    expect(negativeReasoning).toBe("Dieses Vorhaben hat keinen Digitalbezug.");

    // wait 2 seconds for the download button to be reenabled
    await page.waitForTimeout(2000);
    await expect(page.getByRole("main")).not.toContainText(
      "Ihr Ergebnis wird heruntergeladen",
    );
  });

  test("negative reasoning is required for PDF", async ({ page }) => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #987");
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
    await expect(page.getByRole("main")).not.toContainText(
      "Ihr Ergebnis wird heruntergeladen",
    );
    await expect(page.getByRole("main")).toContainText(
      "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
    );
  });

  test("title is required for PDF", async ({ page }) => {
    await page
      .getByLabel("Begründung")
      .fill("Dieses Vorhaben hat keinen Digitalbezug.");
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
    await expect(page.getByRole("main")).not.toContainText(
      "Ihr Ergebnis wird heruntergeladen",
    );
    await expect(page.getByRole("main")).toContainText(
      "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
    );
  });

  test("title and reasoning can't be too long", async ({ page }) => {
    await page.getByLabel("Begründung").fill("Begründung".repeat(5000));
    await page
      .getByLabel("Arbeitstitel des Vorhabens")
      .fill("Policy #987".repeat(500));
    await page.getByRole("button", { name: "Als PDF herunterladen" }).click();
    await expect(page.getByRole("main")).toContainText("kürzeren Titel");
    await expect(page.getByRole("main")).toContainText("kürzere Begründung");
    await expect(page.getByRole("main")).not.toContainText(
      "Ihr Ergebnis wird heruntergeladen",
    );
  });
});

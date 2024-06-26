import { expect, test } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { PDFDocument } from "pdf-lib";
import { preCheck } from "resources/content";
import { PATH_ASSESSMENT } from "resources/staticRoutes";
import {
  FIELD_NAME_POLICY_TITLE,
  FIELD_NAME_PRE_CHECK_NEGATIVE,
  FIELD_NAME_PRE_CHECK_POSITIVE_1,
  FIELD_NAME_PRE_CHECK_POSITIVE_2,
  FIELD_NAME_PRE_CHECK_POSITIVE_3,
  FIELD_NAME_PRE_CHECK_POSITIVE_4,
  FIELD_NAME_PRE_CHECK_POSITIVE_5,
} from "routes/vorpruefung_.ergebnis.einschaetzung.$fileName[.pdf]";

test.describe("test assessment page and PDF", () => {
  test.beforeEach("Go to assessment page", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
    for (let i = 0; i < 5; i++) {
      await expect(page).toHaveURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page
      .getByRole("link", { name: "Einschätzung als PDF bekommen" })
      .click();
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
});

test.describe("test PDF generation in negative case", () => {
  test.beforeEach(
    "Fill preCheck questions with negative answers",
    async ({ page }) => {
      await page.goto(preCheck.questions[0].url);
      for (let i = 0; i < 5; i++) {
        await expect(page).toHaveURL(preCheck.questions[i].url);
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
    await page.getByRole("button", { name: "PDF bekommen" }).click();
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

  test("negative reasoning is needed for PDF", async ({ page }) => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #987");
    await page.getByRole("button", { name: "PDF bekommen" }).click();
    await expect(page.getByRole("main")).toContainText(
      "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
    );
  });
});

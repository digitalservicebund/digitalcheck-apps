import { expect, test } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { PDFDocument } from "pdf-lib";
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
      "Ihr Regelungsvorhaben hat Digitalbezug.",
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

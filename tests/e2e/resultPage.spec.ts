import { vorpruefung_ergebnis } from "@/config/routes";
import { preCheck } from "@/resources/content/vorpruefung";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

const { questions } = preCheck;

const positiveResultContent = [
  "einer Anpassung oder Neuentwicklung einer IT-Lösung.",
  "einer Festlegung von Mitwirkungspflichten für Akteurinnen und Akteure.",
  "einem Austausch von Daten.",
  "einer Interaktion zwischen Behörden und Bürgerinnen und Bürgern bzw. Unternehmen.",
  "einer Verbesserung der Umsetzung der Regelung durch die Automatisierung von Schritten.",
  "einem Daten- und Informationsaustausch zwischen EU-Mitgliedstaaten.",
];

test.describe("Vorprüfung Ergebnis happy path", () => {
  test.describe.configure({ mode: "default" });

  let page: Page;

  test.beforeAll("answer all questions with yes", async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(questions[0].path);
    for (const question of questions) {
      await page.waitForURL(question.path);
      await waitForHydration(page);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Weiter", exact: true }).click();
    }
  });

  test.beforeEach("go to result page", async () => {
    if (page.url() !== vorpruefung_ergebnis.path) {
      await page.goto(vorpruefung_ergebnis.path);
    }
    await page.waitForURL(vorpruefung_ergebnis.path);
    await waitForHydration(page);
  });

  test.afterAll("close shared page for test iteration", async () => {
    if (page) {
      await page.close();
    }
  });

  test("page headline shows expected result", async () => {
    await expect(
      page.getByRole("heading", { name: "Das Regelungsvorhaben hat" }),
    ).toContainText(
      "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
    );
  });

  test("details summary shows correct content", async () => {
    const summaryElement = page.getByText("Aufschlüsselung Ihres Ergebnisses", {
      exact: true,
    });
    await expect(summaryElement).toBeVisible();
    await summaryElement.click();

    await expect(
      page.getByText(
        "In Bezug auf digitale Aspekte führt Ihr Regelungsvorhaben zu...",
        { exact: true },
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        "In Bezug auf Interoperabilität führt Ihr Regelungsvorhaben zu...",
        { exact: true },
      ),
    ).toBeVisible();

    for (const resultText of positiveResultContent) {
      await expect(
        page.getByText(resultText, {
          exact: true,
        }),
      ).toBeVisible();
    }
  });

  test("title input is visible", async () => {
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toBeVisible();
  });

  test("negative reasoning input is not visible", async () => {
    await expect(page.getByLabel("Begründung")).toBeHidden();
  });

  test("email body contains title and reasoning", async () => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Vorhaben ABC");

    const mailLink = page.getByRole("link", { name: "E-Mail erstellen" });
    const mailUri = decodeURIComponent(
      (await mailLink.getAttribute("href")) ?? "",
    );

    expect(mailUri).toContain("Digitalcheck Vorprüfung: „Vorhaben ABC“");

    expect(mailUri).toContain("poststelle@nkr.bund.de");
    expect(mailUri).toContain("interoperabel@digitalservice.bund.de");

    expect(mailUri).toContain(
      "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
    );
    expect(mailUri).toContain(
      "In Bezug auf digitale Aspekte führt Ihr Regelungsvorhaben zu...",
    );
    expect(mailUri).toContain(
      "In Bezug auf Interoperabilität führt Ihr Regelungsvorhaben zu...",
    );

    for (const resultText of positiveResultContent) {
      expect(mailUri).toContain(resultText);
    }
  });

  // only run on chromium because clipboard permissions don't work with firefox / safari
  // https://github.com/microsoft/playwright/issues/13037
  test("can copy email content to clipboard", async ({ browserName }) => {
    if (
      browserName === "webkit" ||
      browserName === "firefox" ||
      test.info().project.name === "Desktop Edge"
    ) {
      test.skip(
        true,
        "Skipping clipboard test on WebKit, Firefox, and Desktop Edge.",
      );
    }

    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Test title");

    const copyContentButton = page.getByRole("button", {
      name: "E-Mail-Text kopieren",
    });
    await expect(copyContentButton).toBeVisible();
    await copyContentButton.click();

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );

    expect(clipboardText).toContain(
      "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
    );
    expect(clipboardText).toContain(
      "In Bezug auf digitale Aspekte führt Ihr Regelungsvorhaben zu...",
    );
    expect(clipboardText).toContain(
      "In Bezug auf Interoperabilität führt Ihr Regelungsvorhaben zu...",
    );

    for (const resultText of positiveResultContent) {
      expect(clipboardText).toContain(resultText);
    }
  });
});

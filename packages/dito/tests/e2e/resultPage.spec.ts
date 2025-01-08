import { expect, test } from "@playwright/test";
import { PRE_CHECK_START_BUTTON_ID } from "resources/constants";
import { preCheck } from "resources/content";
import {
  ROUTE_DOCUMENTATION,
  ROUTE_METHODS,
  ROUTE_PRECHECK,
  ROUTE_RESULT,
} from "resources/staticRoutes";

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
      "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
    );
    await expect(page.getByRole("main")).not.toContainText(
      `In Bezug auf digitale Aspekte ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...`,
    );
    await expect(page.getByRole("main")).not.toContainText(`Begründung`);
  });

  test("result page links to methods", async ({ page }) => {
    await page.getByRole("link", { name: "Zu „Erarbeiten“" }).click();
    await expect(page).toHaveURL(ROUTE_METHODS.url);
  });

  test("result page links to documentation", async ({ page }) => {
    await page.getByRole("link", { name: "Zu „Dokumentieren“" }).click();
    await expect(page).toHaveURL(ROUTE_DOCUMENTATION.url);
  });
});

test.describe("test result page reasoning", () => {
  test.beforeEach("Start preCheck", async ({ page }) => {
    await page.goto(preCheck.questions[0].url);
  });

  test("one positive answer for digital and all positive for interoperability leads to positive result without hint", async ({
    page,
  }) => {
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 1; i < preCheck.questions.length; i++) {
      const question = preCheck.questions[i];
      await page.waitForURL(question.url);
      if (question.interoperability) {
        await page.getByLabel("Ja").click();
      } else {
        await page.getByLabel("Nein").click();
      }
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
    );
    await expect(page.getByRole("main")).not.toContainText(
      "Bitte beachten Sie: Wenn Ihr Vorhaben keinen Digitalbezug aufweist, können die Anforderungen der Interoperabilität nicht erfüllt werden",
    );
  });

  test("one positive answer for digital and all unsure for interoperability leads to positive result with hint", async ({
    page,
  }) => {
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 1; i < preCheck.questions.length; i++) {
      const question = preCheck.questions[i];
      await page.waitForURL(question.url);
      if (question.interoperability) {
        await page.getByLabel("Ich bin unsicher").click();
      } else {
        await page.getByLabel("Nein").click();
      }
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat einen Digitalbezug und keine eindeutigen Anforderungen der Interoperabilität.",
    );
    await expect(page.getByRole("main")).toContainText(
      `In Bezug auf Interoperabilität ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...`,
    );
    await expect(page.getByRole("main")).toContainText(
      "Das können Sie tun: Kontaktieren Sie uns unter",
    );

    await expect(page.getByRole("main")).toContainText("");
  });

  test("one positive answer and only negativ interoperability question leads to positive result without interoperability", async ({
    page,
  }) => {
    await page.getByLabel("Ja").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 1; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Nein").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat einen Digitalbezug und keine Anforderungen der Interoperabilität.",
    );
  });

  test("all answers are shown as reasons", async ({ page }) => {
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(preCheck.questions[1].url);
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 2; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
    );
    await expect(page.getByRole("main")).toContainText(
      "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
    );
    await expect(page.getByRole("main")).toContainText(
      "In Bezug auf digitale Aspekte ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
    );
    await expect(page.getByRole("main")).toContainText(
      "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
    );

    await expect(page.getByRole("main")).toContainText(
      preCheck.questions[0].negativeResult,
    );
    for (let i = 1; i < preCheck.questions.length; i++) {
      await expect(page.getByRole("main")).toContainText(
        preCheck.questions[i].positiveResult,
      );
    }
  });

  test("checking all negative answers leads to negative result", async ({
    page,
  }) => {
    for (let i = 0; i < preCheck.questions.length; i++) {
      await page.waitForURL(preCheck.questions[i].url);
      await page.getByLabel("Nein").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(ROUTE_RESULT.url);
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
    );
    await expect(page.getByRole("main")).not.toContainText(
      `In Bezug auf digitale Aspekte ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...`,
    );
    await expect(page.getByRole("main")).not.toContainText(
      `In Bezug auf Interoperabilität ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...`,
    );
    await expect(page.getByRole("main")).toContainText(`Begründung`);
  });

  test("checking all negative answers for digital and positive for interoperability leads to negative result with warning", async ({
    page,
  }) => {
    for (let i = 0; i < preCheck.questions.length; i++) {
      const question = preCheck.questions[i];
      await page.waitForURL(question.url);
      if (question.interoperability) {
        await page.getByLabel("Ja").click();
      } else {
        await page.getByLabel("Nein").click();
      }
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(ROUTE_RESULT.url);
    await expect(page.getByRole("main")).toContainText(
      "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
    );
    await expect(page.getByRole("main")).toContainText(
      "Bitte beachten Sie: Wenn Ihr Vorhaben keinen Digitalbezug aufweist, können die Anforderungen der Interoperabilität nicht erfüllt werden",
    );
    await expect(page.getByRole("main")).toContainText(`Begründung`);
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
      `In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...`,
    );
    await expect(page.getByRole("main")).toContainText(
      `In Bezug auf digitale Aspekte ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...`,
    );
    await expect(page.getByRole("main")).toContainText(
      `In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...`,
    );
    await expect(page.getByRole("main")).toContainText(
      "Sie können auch ohne positive Vorprüfung die Digitaltauglichkeit Ihres Regelungsvorhabens sicherstellen.",
    );
  });

  test("checking mix of unsure and negative answers for digital aspects and positive for interoperability leads to unsure result with a hint", async ({
    page,
  }) => {
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (let i = 1; i < preCheck.questions.length; i++) {
      const question = preCheck.questions[i];
      await page.waitForURL(question.url);
      if (question.interoperability) {
        await page.getByLabel("Ja").click();
      } else {
        await page.getByLabel("Nein").click();
      }
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await expect(page).toHaveURL(ROUTE_RESULT.url);
    await expect(page.getByRole("main")).toContainText("Digitalcheck-Support");
    await expect(page.getByRole("main")).toContainText(
      "Sie haben mehrere Aussagen mit „Ich bin unsicher“ beantwortet.",
    );
    await expect(page.getByRole("main")).toContainText(
      `In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...`,
    );
    await expect(page.getByRole("main")).toContainText(
      "Bitte beachten Sie: Wenn Ihr Vorhaben keinen Digitalbezug aufweist, können die Anforderungen der Interoperabilität nicht erfüllt werden",
    );
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

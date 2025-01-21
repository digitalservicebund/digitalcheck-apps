import { expect, type Page, test } from "@playwright/test";
import { preCheck } from "resources/content";
import { ROUTE_RESULT } from "resources/staticRoutes";

const { questions } = preCheck;

const CREATE_EMAIL_BUTTON = "result-email-button";
const EMAIL_INPUT_ERROR = "email-error";
const TITLE_INPUT_ERROR = "title-error";
const NEGATIVE_REASONING_ERROR = "negativeReasoning-error";

async function interceptMailToRedirectAndExpect(
  page: Page,
  expected?: {
    subject?: string;
    recipients?: string[];
    cc?: string[];
    body?: string[];
  },
  notExpected?: {
    recipients?: string[];
    body?: string[];
  },
) {
  await page.route("**", async (route) => {
    const response = await route.fetch();
    const status = response.headers()["x-remix-status"];
    const redirectUrl = response.headers()["x-remix-redirect"];

    if (status !== "302" || !redirectUrl?.startsWith("mailto:")) {
      await route.continue();
      return;
    }

    const mailTo = new URL(redirectUrl);
    if (expected?.subject)
      expect(mailTo.searchParams.get("subject")).toBe(expected?.subject);
    expected?.recipients?.forEach((expectedRecipient) =>
      expect(mailTo.pathname).toContain(expectedRecipient),
    );
    expected?.cc?.forEach((expectedCC) =>
      expect(mailTo.searchParams.get("cc")).toContain(expectedCC),
    );
    expected?.body?.forEach((expectedString) => {
      expect(mailTo.searchParams.get("body")).toContain(expectedString);
    });

    notExpected?.recipients?.forEach((notExpectedRecipient) =>
      expect(mailTo.pathname).not.toContain(notExpectedRecipient),
    );
    notExpected?.body?.forEach((notExpectedString) => {
      expect(mailTo.searchParams.get("body")).not.toContain(notExpectedString);
    });

    await route.abort();
  });
}

test.describe("test positive result for digital and interoperability", () => {
  test.beforeEach(
    "answer all pre-check questions with yes and go to result page",
    async ({ page }) => {
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page.getByLabel("Ja").click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
      await page.waitForURL(ROUTE_RESULT.url);
    },
  );

  test("email input is visible", async ({ page }) => {
    await expect(page.getByLabel("Ihre E-Mail Adresse")).toBeVisible();
  });

  test("title input is visible", async ({ page }) => {
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toBeVisible();
  });

  test("negative reasoning input is not visible", async ({ page }) => {
    await expect(page.getByLabel("Begründung")).not.toBeVisible();
  });

  test("error is shown if title is empty", async ({ page }) => {
    // not filling title
    await interceptMailToRedirectAndExpect(page);
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
    await expect(page.getByTestId(TITLE_INPUT_ERROR)).toBeVisible();
    await expect(page.getByTestId(TITLE_INPUT_ERROR)).toContainText(
      "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
    );
  });

  test("error is shown if title is too long", async ({ page }) => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("A".repeat(101));
    await interceptMailToRedirectAndExpect(page);
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
    await expect(page.getByTestId(TITLE_INPUT_ERROR)).toBeVisible();
    await expect(page.getByRole("main")).toContainText("kürzeren Titel");
  });

  test("no error is shown if optional email is empty", async ({ page }) => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Vorhaben XY");
    // not filling email
    await interceptMailToRedirectAndExpect(page);
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
    await expect(page.getByTestId(EMAIL_INPUT_ERROR)).not.toBeVisible();
  });

  test("no error shown when email and title are filled", async ({ page }) => {
    await page.getByLabel("Ihre E-Mail Adresse").fill("foo@bar.de");
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy 123");
    await interceptMailToRedirectAndExpect(page);
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
    await expect(page.getByTestId(EMAIL_INPUT_ERROR)).not.toBeVisible();
    await expect(page.getByTestId(TITLE_INPUT_ERROR)).not.toBeVisible();
  });

  test("email subject includes title", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABC");

    await interceptMailToRedirectAndExpect(page, {
      subject: "Digitalcheck Vorprüfung: „Policy ABC“",
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email recipients include nkr", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, {
      recipients: ["nkr@bmj.bund.de"],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email recipients include digitalcheck team if interoperability is positive", async ({
    page,
  }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, {
      recipients: ["interoperabel@digitalservice.bund.de"],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email cc includes email from email input", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await page.getByLabel("Ihre E-Mail Adresse").fill("foo@bar.de");
    await interceptMailToRedirectAndExpect(page, {
      cc: ["foo@bar.de"],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email body contains result title", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, {
      body: [
        "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
      ],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email body contains all answers in positive form", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    const bodyContains = [
      "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
      "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
    ];
    questions.forEach((question) => {
      bodyContains.push(question.positiveResult);
    });

    await interceptMailToRedirectAndExpect(page, {
      body: bodyContains,
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email body does not contain negative reasoning", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, undefined, {
      body: ["Begründung:"],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });
});

test.describe("test positive result for digital and negative for interoperability", () => {
  test.beforeEach(
    "answer all digital questions with yes and all interoperability questions with no and go to result page",
    async ({ page }) => {
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page
          .getByLabel(question.interoperability ? "Nein" : "Ja")
          .click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test("negative reasoning input is not visible", async ({ page }) => {
    await expect(page.getByLabel("Begründung")).not.toBeVisible();
  });

  test("email recipients do not include digitalcheck team if interoperability is negative", async ({
    page,
  }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    // set expected to undefined to set notExpected
    await interceptMailToRedirectAndExpect(page, undefined, {
      recipients: ["interoperabel@digitalservice.bund.de"],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email body contains result title", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, {
      body: [
        "Das Regelungsvorhaben hat einen Digitalbezug und keine Anforderungen der Interoperabilität.",
      ],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });
});

test.describe("test positive result for digital and unsure for interoperability", () => {
  test.beforeEach(
    "answer all digital questions with yes and all interoperability questions with unsure and go to result page",
    async ({ page }) => {
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page
          .getByLabel(question.interoperability ? "Ich bin unsicher" : "Ja")
          .click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test("negative reasoning input is not visible", async ({ page }) => {
    await expect(page.getByLabel("Begründung")).not.toBeVisible();
  });

  test("email recipients include digitalcheck team if interoperability is unsure", async ({
    page,
  }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, {
      recipients: ["interoperabel@digitalservice.bund.de"],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email body contains result title", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, {
      body: [
        "Das Regelungsvorhaben hat einen Digitalbezug und keine eindeutigen Anforderungen der Interoperabilität.",
      ],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email body contains all answers for interoperability in unsure form", async ({
    page,
  }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    const bodyContains = [
      "In Bezug auf Interoperabilität ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
    ];
    questions
      .filter((question) => question.interoperability)
      .forEach((question) => {
        bodyContains.push(question.positiveResult);
      });

    await interceptMailToRedirectAndExpect(page, {
      body: bodyContains,
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });
});

test.describe("test negative result for digital and interoperability", () => {
  test.beforeEach(
    "answer all pre-check questions with no and go to result page",
    async ({ page }) => {
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page.getByLabel("Nein").click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test("email input is visible", async ({ page }) => {
    await expect(page.getByLabel("Ihre E-Mail Adresse")).toBeVisible();
  });

  test("title input is visible", async ({ page }) => {
    await expect(page.getByLabel("Arbeitstitel des Vorhabens")).toBeVisible();
  });

  test("negative reasoning input is visible", async ({ page }) => {
    await expect(page.getByLabel("Begründung")).toBeVisible();
  });

  test("error is shown if negative reasoning is empty", async ({ page }) => {
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy #987");
    await interceptMailToRedirectAndExpect(page);
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
    await expect(page.getByTestId(NEGATIVE_REASONING_ERROR)).toBeVisible();
    await expect(page.getByTestId(NEGATIVE_REASONING_ERROR)).toContainText(
      "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
    );
  });

  test("error is shown if negative reasoning is too long", async ({ page }) => {
    await page.getByLabel("Begründung").fill("A".repeat(501));
    await page.getByLabel("Arbeitstitel des Vorhabens").fill("Test 123");
    await interceptMailToRedirectAndExpect(page);
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
    await expect(page.getByTestId(NEGATIVE_REASONING_ERROR)).toBeVisible();
    await expect(page.getByTestId(NEGATIVE_REASONING_ERROR)).toContainText(
      "kürzere Begründung",
    );
  });

  test("email body contains all answers in negative form", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    const bodyContains = [
      "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
      "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
    ];
    for (const question of questions) {
      bodyContains.push(question.negativeResult);
    }

    await interceptMailToRedirectAndExpect(page, {
      body: bodyContains,
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email body contains result title", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, {
      body: [
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
      ],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email body contains negative reasoning", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await page
      .getByLabel("Begründung")
      .fill(
        "Dieses Vorhaben hat keinen Digitalbezug, weil es nicht relevant ist.",
      );
    await interceptMailToRedirectAndExpect(page, {
      body: [
        "Begründung:",
        "Dieses Vorhaben hat keinen Digitalbezug, weil es nicht relevant ist.",
      ],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });
});

test.describe("test negative result for digital and positive for interoperability", () => {
  test.beforeEach(
    "answer all digital questions with no and all interoperability questions with yes and go to result page",
    async ({ page }) => {
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page
          .getByLabel(question.interoperability ? "Ja" : "Nein")
          .click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test("negative reasoning input is not visible", async ({ page }) => {
    await expect(page.getByLabel("Begründung")).toBeVisible();
  });

  test("email body contains result title", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, {
      body: [
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
      ],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });

  test("email body contains hint that interoperability is not possible if digital is negative", async ({
    page,
  }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, {
      body: [
        "Bitte beachten Sie: Wenn Ihr Vorhaben keinen Digitalbezug aufweist, können die Anforderungen der Interoperabilität nicht erfüllt werden",
      ],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });
});

test.describe("test negative result for digital and unsure for interoperability", () => {
  test.beforeEach(
    "answer all digital questions with no and all interoperability questions with unsure and go to result page",
    async ({ page }) => {
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page
          .getByLabel(question.interoperability ? "Ich bin unsicher" : "Nein")
          .click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test("negative reasoning input is not visible", async ({ page }) => {
    await expect(page.getByLabel("Begründung")).toBeVisible();
  });

  test("email body contains result title", async ({ page }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    await interceptMailToRedirectAndExpect(page, {
      body: [
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine eindeutigen Anforderungen der Interoperabilität.",
      ],
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });
});

test.describe("test positive result with mixed answers", () => {
  test.beforeEach("Go to assessment page", async ({ page }) => {
    await page.goto(questions[0].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.waitForURL(questions[1].url);
    await page.getByLabel("Ich bin unsicher").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    for (const question of questions.slice(2)) {
      await page.waitForURL(question.url);
      await page.getByLabel("Ja").click();
      await page.getByRole("button", { name: "Übernehmen" }).click();
    }
    await page.waitForURL(ROUTE_RESULT.url);
  });

  test("answers in email body are prefixed by a special character indicating the type of answer", async ({
    page,
  }) => {
    await page
      .getByLabel("Vorläufiger Arbeitstitel des Vorhabens")
      .fill("Policy ABCDEFG");
    const bodyContains = [
      `- ${questions[0].negativeResult}`,
      `? ${questions[1].positiveResult}`,
      `+ ${questions[2].positiveResult}`,
    ];
    await interceptMailToRedirectAndExpect(page, {
      body: bodyContains,
    });
    await page.getByTestId(CREATE_EMAIL_BUTTON).click();
  });
});

test.describe("test unsure result for digital and positive for interoperability", () => {
  test.beforeEach(
    "answer all digital questions with unsure and all interoperability questions with yes and go to result page",
    async ({ page }) => {
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page
          .getByLabel(question.interoperability ? "Ja" : "Ich bin unsicher")
          .click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test("form is not shown", async ({ page }) => {
    await expect(page.getByTestId("result-form")).not.toBeVisible();
  });
});

test.describe("test unsure result for digital and negative for interoperability", () => {
  test.beforeEach(
    "answer all digital questions with unsure and all interoperability questions with no and go to result page",
    async ({ page }) => {
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page
          .getByLabel(question.interoperability ? "Nein" : "Ich bin unsicher")
          .click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test("form is not shown", async ({ page }) => {
    await expect(page.getByTestId("result-form")).not.toBeVisible();
  });
});

test.describe("test unsure result for digital and unsure for interoperability", () => {
  test.beforeEach(
    "answer all digital questions with unsure and go to result page",
    async ({ page }) => {
      await page.goto(questions[0].url);
      for (const question of questions) {
        await page.waitForURL(question.url);
        await page.getByLabel("Ich bin unsicher").click();
        await page.getByRole("button", { name: "Übernehmen" }).click();
      }
    },
  );

  test("form is not shown", async ({ page }) => {
    await expect(page.getByTestId("result-form")).not.toBeVisible();
  });
});

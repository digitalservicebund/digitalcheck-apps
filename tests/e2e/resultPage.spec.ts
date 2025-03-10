import { expect, type Page, test } from "@playwright/test";
import { preCheck } from "~/resources/content";
import {
  ROUTE_DOCUMENTATION,
  ROUTE_INTEROPERABILITY,
  ROUTE_METHODS,
  ROUTE_PRECHECK,
  ROUTE_RESULT,
} from "~/resources/staticRoutes";
import type { TQuestion } from "~/routes/vorpruefung.$questionId/route.tsx";

const { questions } = preCheck;

const EMAIL_INPUT_ERROR = "email-error";
const TITLE_INPUT_ERROR = "title-error";
const NEGATIVE_REASONING_ERROR = "negativeReasoning-error";

type ExpectedResult = {
  headline: string;
  showsInteropLink: boolean;
  showsNegativeReasoning: boolean;
  includesInterop: boolean;
  warningInteropWithoutDigital?: boolean;
  showsUnsureHint?: boolean;
  formIsVisible?: boolean;
  linksAreVisible?: boolean;
  resultPrefixes?: {
    positivePrefix: string;
    negativePrefix: string;
    unsurePrefix: string;
  };
  emailBodyContains?: string[];
  allPositive?: boolean;
  allNegative?: boolean;
  dcPositiveIOunsure?: boolean;
  negativeReasoningText?: string;
};

interface TestScenario {
  name: string;
  answers: (question: TQuestion) => "Ja" | "Nein" | "Ich bin unsicher";
  expected: ExpectedResult;
}

const scenarios: TestScenario[] = [
  {
    name: "positive result for digital and interoperability",
    answers: () => "Ja",
    expected: {
      headline:
        "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
      showsInteropLink: true,
      showsNegativeReasoning: false,
      includesInterop: true,
      formIsVisible: true,
      linksAreVisible: true,
      emailBodyContains: [
        "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
        "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
      ],
      allPositive: true,
    },
  },
  {
    name: "positive result for digital and negative for interoperability",
    answers: (question) => (question.interoperability ? "Nein" : "Ja"),
    expected: {
      headline:
        "Das Regelungsvorhaben hat einen Digitalbezug und keine Anforderungen der Interoperabilität.",
      showsInteropLink: false,
      showsNegativeReasoning: false,
      includesInterop: false,
      formIsVisible: true,
      linksAreVisible: true,
    },
  },
  {
    name: "positive result for digital and unsure for interoperability",
    answers: (question) =>
      question.interoperability ? "Ich bin unsicher" : "Ja",
    expected: {
      headline:
        "Das Regelungsvorhaben hat einen Digitalbezug und keine eindeutigen Anforderungen der Interoperabilität.",
      showsInteropLink: true,
      showsNegativeReasoning: false,
      includesInterop: true,
      showsUnsureHint: true,
      formIsVisible: true,
      linksAreVisible: true,
      emailBodyContains: [
        "In Bezug auf Interoperabilität ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
      ],
      dcPositiveIOunsure: true,
    },
  },
  {
    name: "negative result for digital and interoperability",
    answers: () => "Nein",
    expected: {
      headline:
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
      showsInteropLink: false,
      showsNegativeReasoning: true,
      includesInterop: false,
      formIsVisible: true,
      linksAreVisible: false,
      emailBodyContains: [
        "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
        "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
      ],
      allNegative: true,
      negativeReasoningText:
        "Dieses Vorhaben hat keinen Digitalbezug, weil es nicht relevant ist.",
    },
  },
  {
    name: "negative result for digital and positive for interoperability",
    answers: (question) => (question.interoperability ? "Ja" : "Nein"),
    expected: {
      headline:
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
      showsInteropLink: true,
      showsNegativeReasoning: true,
      includesInterop: false,
      warningInteropWithoutDigital: true,
      formIsVisible: true,
      linksAreVisible: false,
    },
  },
  {
    name: "negative result for digital and unsure for interoperability",
    answers: (question) =>
      question.interoperability ? "Ich bin unsicher" : "Nein",
    expected: {
      headline:
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
      showsInteropLink: true,
      showsNegativeReasoning: true,
      includesInterop: false,
      formIsVisible: true,
      linksAreVisible: false,
    },
  },
  {
    name: "unsure result for digital and positive for interoperability",
    answers: (question) =>
      question.interoperability ? "Ja" : "Ich bin unsicher",
    expected: {
      headline:
        "Sie haben mehrere Aussagen mit „Ich bin unsicher“ beantwortet.",
      showsInteropLink: true,
      showsNegativeReasoning: false,
      includesInterop: false,
      warningInteropWithoutDigital: true,
      formIsVisible: false,
      linksAreVisible: true,
    },
  },
  {
    name: "unsure result for digital and negative for interoperability",
    answers: (question) =>
      question.interoperability ? "Nein" : "Ich bin unsicher",
    expected: {
      headline:
        "Sie haben mehrere Aussagen mit „Ich bin unsicher“ beantwortet.",
      showsInteropLink: false,
      showsNegativeReasoning: false,
      includesInterop: false,
      formIsVisible: false,
      linksAreVisible: true,
    },
  },
  {
    name: "unsure result for digital and unsure for interoperability",
    answers: () => "Ich bin unsicher",
    expected: {
      headline:
        "Sie haben mehrere Aussagen mit „Ich bin unsicher“ beantwortet.",
      showsInteropLink: true,
      showsNegativeReasoning: false,
      includesInterop: false,
      formIsVisible: false,
      linksAreVisible: true,
    },
  },
  {
    name: "mixed answers result",
    answers: (question) => {
      if (questions.indexOf(question as TQuestion) === 0) return "Nein";
      if (questions.indexOf(question as TQuestion) === 1)
        return "Ich bin unsicher";
      return "Ja";
    },
    expected: {
      headline:
        "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
      showsInteropLink: true,
      showsNegativeReasoning: false,
      includesInterop: true,
      formIsVisible: true,
      resultPrefixes: {
        positivePrefix: "+",
        negativePrefix: "-",
        unsurePrefix: "?",
      },
    },
  },
];

async function registerMailInterceptionHandlerAndExpect(
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
    const location = response.headers()["location"];

    if (!location?.startsWith("mailto:")) {
      await route.continue();
      return;
    }

    const mailTo = new URL(location);
    if (expected?.subject)
      expect(mailTo.searchParams.get("subject")).toBe(expected?.subject);
    expected?.recipients?.forEach((expectedRecipient) =>
      expect(decodeURIComponent(mailTo.pathname)).toContain(expectedRecipient),
    );
    expected?.cc?.forEach((expectedCC) =>
      expect(mailTo.searchParams.get("cc")).toContain(expectedCC),
    );
    expected?.body?.forEach((expectedString) => {
      expect(mailTo.searchParams.get("body")).toContain(expectedString);
    });

    notExpected?.recipients?.forEach((notExpectedRecipient) =>
      expect(decodeURIComponent(mailTo.pathname)).not.toContain(
        notExpectedRecipient,
      ),
    );
    notExpected?.body?.forEach((notExpectedString) => {
      expect(mailTo.searchParams.get("body")).not.toContain(notExpectedString);
    });

    await route.abort();
  });
}

// Generate tests for each scenario
for (const scenario of scenarios) {
  test.describe(`test ${scenario.name}`, () => {
    test.describe.configure({ mode: "default" });

    let page: Page;
    test.beforeAll(
      `answer questions according to scenario and go to result page`,
      async ({ browser }) => {
        page = await browser.newPage();
        await page.goto(questions[0].url);
        for (const question of questions) {
          await page.waitForURL(question.url);
          await page.getByLabel(scenario.answers(question)).click();
          await page.getByRole("button", { name: "Übernehmen" }).click();
        }
      },
    );

    test.beforeEach("go to result page", async () => {
      if (page.url() !== ROUTE_RESULT.url) {
        await page.goto(ROUTE_RESULT.url);
      }
    });

    test.afterAll(async () => {
      if (page) {
        await page.close();
      }
    });

    test("page headline shows expected result", async () => {
      await expect(page.getByRole("main")).toContainText(
        scenario.expected.headline,
      );
    });

    if (scenario.expected.showsInteropLink) {
      test("page contains link to interoperability landing page", async () => {
        await expect(page.getByRole("main")).toContainText(
          "Erfahren Sie mehr über Interoperabilität",
        );
        await expect(
          page.getByRole("link", { name: "Mehr zu Interoperabilität" }),
        ).toBeVisible();
      });

      test("link to interoperability landing page leads to interoperability landing page", async () => {
        await page
          .getByRole("link", { name: "Mehr zu Interoperabilität" })
          .click();
        await expect(page).toHaveURL(ROUTE_INTEROPERABILITY.url);
      });
    } else {
      test("page does not contain link to interoperability landing page", async () => {
        await expect(page.getByRole("main")).not.toContainText(
          "Erfahren Sie mehr über Interoperabilität",
        );
        await expect(
          page.getByRole("link", { name: "Mehr zu Interoperabilität" }),
        ).not.toBeVisible();
      });
    }

    if (scenario.expected.formIsVisible) {
      test("email input is visible", async () => {
        await expect(page.getByLabel("Ihre E-Mail Adresse")).toBeVisible();
      });

      test("title input is visible", async () => {
        await expect(
          page.getByLabel("Arbeitstitel des Vorhabens"),
        ).toBeVisible();
      });

      if (scenario.expected.showsNegativeReasoning) {
        test("negative reasoning input is visible", async () => {
          await expect(page.getByLabel("Begründung")).toBeVisible();
        });

        test("error is shown if negative reasoning is empty", async () => {
          await page
            .getByLabel("Arbeitstitel des Vorhabens")
            .fill("Policy ABC");
          await registerMailInterceptionHandlerAndExpect(page);
          await page.getByRole("button", { name: "E-Mail erstellen" }).click();
          await expect(
            page.getByTestId(NEGATIVE_REASONING_ERROR),
          ).toBeVisible();
          await expect(page.locator("main")).toContainText(
            "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
          );
        });
      } else {
        test("negative reasoning input is not visible", async () => {
          await expect(page.getByLabel("Begründung")).not.toBeVisible();
        });
      }

      test("no error shown when email and title are filled", async () => {
        await page.getByLabel("Ihre E-Mail Adresse").fill("foo@bar.de");
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        await registerMailInterceptionHandlerAndExpect(page);
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
        await expect(page.getByTestId(EMAIL_INPUT_ERROR)).not.toBeVisible();
        await expect(page.getByTestId(TITLE_INPUT_ERROR)).not.toBeVisible();
      });

      test("error is shown if title is empty", async () => {
        await registerMailInterceptionHandlerAndExpect(page);
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
        await expect(page.getByTestId(TITLE_INPUT_ERROR)).toBeVisible();
        await expect(page.locator("main")).toContainText(
          "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
        );
      });

      test("error is shown if title is too long", async () => {
        await page
          .getByLabel("Arbeitstitel des Vorhabens")
          .fill("A".repeat(101));
        await registerMailInterceptionHandlerAndExpect(page);
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
        await expect(page.getByTestId(TITLE_INPUT_ERROR)).toBeVisible();
        await expect(page.locator("main")).toContainText("kürzeren Titel");
      });

      test("email subject includes title", async () => {
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        await registerMailInterceptionHandlerAndExpect(page, {
          subject: "Digitalcheck Vorprüfung: „Policy ABC“",
        });
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });

      test("email recipients include nkr", async () => {
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        await registerMailInterceptionHandlerAndExpect(page, {
          recipients: ["nkr@bmj.bund.de"],
        });
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });

      test("email cc includes email from email input", async () => {
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        await page.getByLabel("Ihre E-Mail Adresse").fill("foo@bar.de");
        await registerMailInterceptionHandlerAndExpect(page, {
          cc: ["foo@bar.de"],
        });
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });

      test("email body does not contain negative reasoning", async () => {
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        await registerMailInterceptionHandlerAndExpect(page, undefined, {
          body: ["Begründung:"],
        });
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });

      if (scenario.expected.includesInterop) {
        test("email recipients include digitalcheck team", async () => {
          await page
            .getByLabel("Arbeitstitel des Vorhabens")
            .fill("Policy ABC");
          await registerMailInterceptionHandlerAndExpect(page, {
            recipients: ["interoperabel@digitalservice.bund.de"],
          });
          await page.getByRole("button", { name: "E-Mail erstellen" }).click();
        });
      } else {
        test("email recipients do not include digitalcheck team", async () => {
          await page
            .getByLabel("Arbeitstitel des Vorhabens")
            .fill("Policy ABC");
          await registerMailInterceptionHandlerAndExpect(page, undefined, {
            recipients: ["interoperabel@digitalservice.bund.de"],
          });
          await page.getByRole("button", { name: "E-Mail erstellen" }).click();
        });
      }

      test("email body contains result title", async () => {
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        await registerMailInterceptionHandlerAndExpect(page, {
          body: [scenario.expected.headline],
        });
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });

      if (scenario.expected.warningInteropWithoutDigital) {
        test("email body contains warning about interoperability requiring digital", async () => {
          await page
            .getByLabel("Arbeitstitel des Vorhabens")
            .fill("Policy ABC");
          await registerMailInterceptionHandlerAndExpect(page, {
            body: [
              "Bitte beachten Sie: Wenn Ihr Vorhaben keinen Digitalbezug aufweist, können die Anforderungen der Interoperabilität nicht erfüllt werden",
            ],
          });
          await page.getByRole("button", { name: "E-Mail erstellen" }).click();
        });
      }
    } else {
      test("form is not shown", async () => {
        await expect(page.getByTestId("result-form")).not.toBeVisible();
      });
    }

    if (scenario.expected.showsUnsureHint) {
      test("page contains hint regarding unsure interoperability", async () => {
        await expect(page.getByRole("main")).toContainText(
          "Das können Sie tun: Kontaktieren Sie uns unter",
        );
      });
    }

    if (scenario.expected.resultPrefixes) {
      test("answers in email body are prefixed by a special character indicating the type of answer", async () => {
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        const bodyContains = [
          `- ${questions[0].negativeResult}`,
          `? ${questions[1].positiveResult}`,
          `+ ${questions[2].positiveResult}`,
        ];
        await registerMailInterceptionHandlerAndExpect(page, {
          body: bodyContains,
        });
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });
    }

    if (
      scenario.expected.formIsVisible !== false &&
      scenario.expected.linksAreVisible !== false &&
      !scenario.expected.headline.includes("Sie haben mehrere Aussagen mit")
    ) {
      test("result page links to methods", async () => {
        await page.getByRole("link", { name: "Zu „Erarbeiten“" }).click();
        await expect(page).toHaveURL(ROUTE_METHODS.url);
      });

      test("result page links to documentation", async () => {
        await page.getByRole("link", { name: "Zu „Dokumentieren“" }).click();
        await expect(page).toHaveURL(ROUTE_DOCUMENTATION.url);
      });
    }

    if (scenario.expected.allPositive) {
      test("email body contains all answers in positive form", async () => {
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        const bodyContains = [
          "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
          "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
        ];

        questions.forEach((question) => {
          bodyContains.push(question.positiveResult);
        });

        await registerMailInterceptionHandlerAndExpect(page, {
          body: bodyContains,
        });
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });
    }

    if (scenario.expected.allNegative) {
      test("email body contains all answers in negative form", async () => {
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        const bodyContains = [
          "In Bezug auf digitale Aspekte führt ihr Regelungsvorhaben zu...",
          "In Bezug auf Interoperabilität führt ihr Regelungsvorhaben zu...",
        ];

        for (const question of questions) {
          bodyContains.push(question.negativeResult);
        }

        await registerMailInterceptionHandlerAndExpect(page, {
          body: bodyContains,
        });
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });
    }

    if (scenario.expected.dcPositiveIOunsure) {
      test("email body contains all answers for interoperability in unsure form", async () => {
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        const bodyContains = [
          "In Bezug auf Interoperabilität ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
        ];

        questions
          .filter((question) => question.interoperability)
          .forEach((question) => {
            bodyContains.push(question.positiveResult);
          });

        await registerMailInterceptionHandlerAndExpect(page, {
          body: bodyContains,
        });
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });
    }

    if (scenario.expected.emailBodyContains) {
      test("email body contains expected content", async () => {
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        await registerMailInterceptionHandlerAndExpect(page, {
          body: scenario.expected.emailBodyContains,
        });
        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });
    }

    if (scenario.expected.negativeReasoningText) {
      test("email body contains negative reasoning", async () => {
        const reasoningText = scenario.expected.negativeReasoningText || "";
        await page.getByLabel("Arbeitstitel des Vorhabens").fill("Policy ABC");
        await page.getByLabel("Begründung").fill(reasoningText);

        await registerMailInterceptionHandlerAndExpect(page, {
          body: ["Begründung:", reasoningText],
        });

        await page.getByRole("button", { name: "E-Mail erstellen" }).click();
      });
    }
  });
}

test.describe("test redirect to pre-check in case of missing answers", () => {
  test.describe.configure({ mode: "default" });

  test("result page redirects to pre-check landing page if no question was answered", async ({
    page,
  }) => {
    await page.goto(ROUTE_RESULT.url);
    await expect(page).toHaveURL(ROUTE_PRECHECK.url);
  });

  test("result page redirects to first unanswered question if not all questions have been answered", async ({
    page,
  }) => {
    await page.goto(preCheck.questions[0].url);
    await page.getByLabel("Nein").click();
    await page.getByRole("button", { name: "Übernehmen" }).click();
    await page.goto(ROUTE_RESULT.url);
    await expect(page).toHaveURL(ROUTE_PRECHECK.url);
  });
});

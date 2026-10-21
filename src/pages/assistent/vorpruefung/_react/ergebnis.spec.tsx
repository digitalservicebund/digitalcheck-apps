import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { dokumentation, interoperabel, methoden } from "@/config/routes";
import Result from "@/pages/assistent/vorpruefung/_react/ergebnis";
import type { TQuestion } from "@/pages/assistent/vorpruefung/_react/question";
import { preCheck } from "@/resources/content/vorpruefung";
import { readVersionedDataFromLocalStorage } from "@/utils/localStorageVersioned";
import type { PreCheckData } from "./preCheckDataService";
import { DATA_SCHEMA_VERSION, getPreCheckData } from "./preCheckDataService";

vi.mock("@/utils/localStorageVersioned", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/utils/localStorageVersioned")>();
  return {
    ...actual,
    readVersionedDataFromLocalStorage: vi.fn(),
  };
});

const mockAssign = vi.fn();
vi.stubGlobal("location", {
  href: "/",
  assign: mockAssign,
});

const { questions } = preCheck;

// all true
const DEFAULT_EXPECTATIONS = {
  formIsVisible: true,
  hasInputArbeitstitel: true,
  showsNegativeReasoning: true,
  showsUnsureHeading: true,
  includesInterop: true,
  furtherStepsVisible: true,
  showsAnswerConflictWarning: true,
  showsUnsureHint: true,
  allPositive: true,
  dcPositiveIOunsure: true,
  includesNkrRecipient: true,
  includesDigitalcheckTeam: true,
  emailBodyContains: [] as string[],
  inlineNoticeText: undefined as string | undefined,
  infoTooltip: undefined as string | undefined,
};

type ExpectedResult = typeof DEFAULT_EXPECTATIONS & { headline: string };
type Answers = (question: TQuestion) => "Ja" | "Nein" | "Ich bin unsicher";

interface TestScenario {
  name: string;
  answers: Answers;
  expected: ExpectedResult;
}

function setup(answers: Answers) {
  const user = userEvent.setup();

  const preCheckAnswers = questions.map((q) => {
    const ans = answers(q);
    const answerMap = { Ja: "yes", Nein: "no", "Ich bin unsicher": "unsure" };
    const answer = answerMap[ans];
    return { questionId: q.id, answer };
  });

  vi.mocked(readVersionedDataFromLocalStorage).mockReturnValue({
    version: DATA_SCHEMA_VERSION,
    answers: preCheckAnswers,
    title: "",
    negativeReasoning: "",
    ssr: false,
  } as PreCheckData);

  // Clear cache
  getPreCheckData();

  const result = render(<Result />);

  return { user, ...result };
}

const scenarios: TestScenario[] = [
  {
    name: "positive result for digital and interoperability",
    answers: () => "Ja",
    expected: {
      ...DEFAULT_EXPECTATIONS,
      showsAnswerConflictWarning: false,
      showsNegativeReasoning: false,
      showsUnsureHeading: false,

      headline:
        "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
      emailBodyContains: [
        "In Bezug auf digitale Aspekte führt Ihr Regelungsvorhaben zu...",
        "In Bezug auf Interoperabilität führt Ihr Regelungsvorhaben zu...",
      ],
    },
  },
  {
    name: "positive result for digital and negative for interoperability",
    answers: (question) => (question.interoperability ? "Nein" : "Ja"),
    expected: {
      ...DEFAULT_EXPECTATIONS,
      showsAnswerConflictWarning: false,
      showsNegativeReasoning: false,
      showsUnsureHeading: false,
      includesInterop: false,
      includesDigitalcheckTeam: false,

      headline:
        "Das Regelungsvorhaben hat einen Digitalbezug und keine Anforderungen der Interoperabilität.",
    },
  },
  {
    name: "positive result for digital and unsure for interoperability",
    answers: (question) =>
      question.interoperability ? "Ich bin unsicher" : "Ja",
    expected: {
      ...DEFAULT_EXPECTATIONS,
      showsAnswerConflictWarning: false,
      showsNegativeReasoning: false,
      showsUnsureHeading: false,

      headline:
        "Das Regelungsvorhaben hat einen Digitalbezug und keine eindeutigen Anforderungen der Interoperabilität.",
      emailBodyContains: [
        "In Bezug auf Interoperabilität ist nicht sicher, ob Ihr Regelungsvorhaben zu Folgendem führt...",
      ],
    },
  },
  {
    name: "negative result for digital and interoperability",
    answers: () => "Nein",
    expected: {
      ...DEFAULT_EXPECTATIONS,
      showsAnswerConflictWarning: false,
      showsUnsureHeading: false,
      includesInterop: false,
      includesDigitalcheckTeam: false,

      headline:
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
      emailBodyContains: [
        "In Bezug auf digitale Aspekte führt Ihr Regelungsvorhaben zu...",
        "In Bezug auf Interoperabilität führt Ihr Regelungsvorhaben zu...",
      ],
    },
  },
  {
    name: "negative result for digital and positive for interoperability",
    answers: (question) => (question.interoperability ? "Ja" : "Nein"),
    expected: {
      ...DEFAULT_EXPECTATIONS,
      showsUnsureHeading: false,
      includesDigitalcheckTeam: false,

      headline:
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine eindeutigen Anforderungen der Interoperabilität.",
    },
  },
  {
    name: "negative result for digital and unsure for interoperability",
    answers: (question) =>
      question.interoperability ? "Ich bin unsicher" : "Nein",
    expected: {
      ...DEFAULT_EXPECTATIONS,
      showsAnswerConflictWarning: false,
      showsUnsureHeading: false,
      includesDigitalcheckTeam: false,

      headline:
        "Das Regelungsvorhaben hat keinen Digitalbezug und keine Anforderungen der Interoperabilität.",
    },
  },
  {
    name: "unsure result for digital and positive for interoperability",
    answers: (question) =>
      question.interoperability ? "Ja" : "Ich bin unsicher",
    expected: {
      ...DEFAULT_EXPECTATIONS,
      showsAnswerConflictWarning: false,
      formIsVisible: false,
      hasInputArbeitstitel: false,
      showsNegativeReasoning: false,
      furtherStepsVisible: false,

      headline:
        "Sie haben mehrere Aussagen mit „Ich bin unsicher“ beantwortet.",
    },
  },
  {
    name: "unsure result for digital and negative for interoperability",
    answers: (question) =>
      question.interoperability ? "Nein" : "Ich bin unsicher",
    expected: {
      ...DEFAULT_EXPECTATIONS,
      showsAnswerConflictWarning: false,
      formIsVisible: false,
      hasInputArbeitstitel: false,
      showsNegativeReasoning: false,
      includesInterop: false,
      furtherStepsVisible: false,

      headline:
        "Sie haben mehrere Aussagen mit „Ich bin unsicher“ beantwortet.",
    },
  },
  {
    name: "unsure result for digital and unsure for interoperability",
    answers: () => "Ich bin unsicher",
    expected: {
      ...DEFAULT_EXPECTATIONS,
      showsAnswerConflictWarning: false,
      formIsVisible: false,
      hasInputArbeitstitel: false,
      showsNegativeReasoning: false,
      furtherStepsVisible: false,

      headline:
        "Sie haben mehrere Aussagen mit „Ich bin unsicher“ beantwortet.",
    },
  },
  {
    name: "mixed answers result",
    answers: (question) => {
      if (questions.indexOf(question) === 0) return "Nein";
      if (questions.indexOf(question) === 1) return "Ich bin unsicher";
      return "Ja";
    },
    expected: {
      ...DEFAULT_EXPECTATIONS,
      showsAnswerConflictWarning: false,
      showsNegativeReasoning: false,
      showsUnsureHeading: false,

      headline:
        "Das Regelungsvorhaben hat einen Digitalbezug und enthält Anforderungen der Interoperabilität.",
    },
  },
];

describe("Vorprüfung Ergebnis Page", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Scenario-based Rendering", () => {
    describe.each(scenarios)("$name", ({ answers, expected }) => {
      it("displays the correct headline", () => {
        setup(answers);
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          expected.headline,
        );
      });

      it(`should ${expected.includesInterop ? "show" : "hide"} the interoperability link`, () => {
        setup(answers);
        const link = screen.queryByRole("link", { name: "Übersichtsseite" });
        const text = screen.queryByText(
          "Erfahren Sie mehr über Interoperabilität",
        );

        if (expected.includesInterop) {
          expect(link).toHaveAttribute("href", interoperabel.path);
          expect(text).toBeInTheDocument();
        } else {
          expect(link).not.toBeInTheDocument();
          expect(text).not.toBeInTheDocument();
        }
      });

      it(`should ${expected.showsAnswerConflictWarning ? "show" : "hide"} answer conflict warning`, () => {
        setup(answers);
        const warning = screen.queryByText(
          "Es liegt ein Widerspruch in Ihren Angaben vor.",
        );
        if (expected.showsAnswerConflictWarning) {
          expect(warning).toBeInTheDocument();
        } else {
          expect(warning).not.toBeInTheDocument();
        }
      });

      it("renders correct details summary based on answers", () => {
        setup(answers);
        const detailsSummary = screen.getByTestId("result-details");
        questions.forEach((question) => {
          const expectedText =
            answers(question) === "Nein"
              ? question.negativeResult
              : question.positiveResult;
          expect(
            within(detailsSummary).getByText(expectedText),
          ).toBeInTheDocument();
        });
      });

      it(`should ${expected.formIsVisible ? "show" : "hide"} the contact form`, () => {
        setup(answers);
        const formHeader = screen.queryByText(
          "Ergebnis absenden und Prüfstelle frühzeitig einbinden",
        );
        const titleInput = screen.queryByRole("textbox", {
          name: "Vorläufiger Arbeitstitel des Vorhabens",
        });

        if (expected.formIsVisible) {
          expect(formHeader).toBeInTheDocument();
          expect(titleInput).toBeInTheDocument();
        } else {
          expect(formHeader).not.toBeInTheDocument();
          expect(titleInput).not.toBeInTheDocument();
        }
      });

      it.runIf(expected.formIsVisible)(
        `should ${expected.showsNegativeReasoning ? "show" : "hide"} the reasoning input`,
        () => {
          setup(answers);
          const reasoningInput = screen.queryByRole("textbox", {
            name: "Begründung",
          });
          if (expected.showsNegativeReasoning) {
            expect(reasoningInput).toBeInTheDocument();
          } else {
            expect(reasoningInput).not.toBeInTheDocument();
          }
        },
      );

      it("handles further steps visibility", () => {
        setup(answers);
        const heading = screen.queryByRole("heading", {
          level: 2,
          name: "So machen Sie weiter",
        });

        if (expected.furtherStepsVisible) {
          expect(heading).toBeInTheDocument();

          if (!expected.showsNegativeReasoning) {
            expect(
              screen.getByRole("link", { name: "Zu „Erarbeiten“" }),
            ).toHaveAttribute("href", methoden.path);
            expect(
              screen.getByRole("link", { name: "Zu „Dokumentieren“" }),
            ).toHaveAttribute("href", dokumentation.path);
          }
        } else {
          expect(heading).not.toBeInTheDocument();
        }
      });

      describe.runIf(expected.formIsVisible)("Email Generation", () => {
        it("generates the correct mailto link", async () => {
          const { user } = setup(answers);

          await user.type(
            screen.getByLabelText("Vorläufiger Arbeitstitel des Vorhabens"),
            "Test Projekt",
          );

          if (expected.showsNegativeReasoning) {
            await user.type(screen.getByLabelText("Begründung"), "Test Grund");
          }

          const link = screen.getByRole("link", { name: "E-Mail erstellen" });
          const href = link.getAttribute("href") || "";
          expect(href).toMatch(/^mailto:/);

          const [recipients, queryString] = href
            .replace("mailto:", "")
            .split("?")
            .map((part) => decodeURIComponent(part));
          const params = new URLSearchParams(queryString);
          const body = params.get("body") || "";
          const subject = params.get("subject") || "";

          if (expected.includesNkrRecipient)
            expect(recipients).toContain("poststelle@nkr.bund.de");
          if (expected.includesDigitalcheckTeam)
            expect(recipients).toContain(
              "interoperabel@digitalservice.bund.de",
            );

          expect(subject).toContain("Test Projekt");

          if (expected.showsNegativeReasoning)
            expect(body).toContain("Test Grund");

          expected.emailBodyContains.forEach((snippet) => {
            expect(body).toContain(snippet);
          });

          questions.forEach((q) => {
            const text =
              answers(q) === "Nein" ? q.negativeResult : q.positiveResult;
            expect(body).toContain(text);
          });
        });
      });

      describe.runIf(expected.formIsVisible)("Form Validation", () => {
        it("validates required fields", async () => {
          const { user } = setup(answers);
          const submitBtn = screen.getByRole("button", {
            name: "E-Mail erstellen",
          });

          await user.click(submitBtn);

          expect(
            screen.getByLabelText("Vorläufiger Arbeitstitel des Vorhabens"),
          ).toHaveAccessibleErrorMessage(
            "Bitte geben Sie einen Titel für Ihr Vorhaben an.",
          );

          const reasonInput = screen.queryByLabelText("Begründung");
          if (expected.showsNegativeReasoning && reasonInput) {
            expect(reasonInput).toHaveAccessibleErrorMessage(
              "Bitte geben Sie eine Begründung für den fehlenden Digitalbezug an.",
            );
          }
        });

        it("clears error when field is filled", async () => {
          const { user } = setup(answers);
          await user.click(
            screen.getByRole("button", { name: "E-Mail erstellen" }),
          );

          const titleInput = screen.getByLabelText(
            "Vorläufiger Arbeitstitel des Vorhabens",
          );
          await user.type(titleInput, "Fixed Title");

          expect(titleInput).not.toHaveAccessibleErrorMessage();
        });
      });
    });
  });

  describe("Redirect Guard", () => {
    it("redirects to start if questions are unanswered", async () => {
      globalThis.location.href = "/assistent/vorpruefung/ergebnis";
      vi.mocked(readVersionedDataFromLocalStorage).mockReturnValue({
        version: DATA_SCHEMA_VERSION,
        answers: [{ questionId: questions[0].id, answer: "yes" }], // Only 1 answered
        ssr: false,
      } as PreCheckData);

      render(<Result />);

      await waitFor(() => {
        expect(globalThis.location.href).toBe("/assistent/vorpruefung");
      });
    });

    it("does not redirect when all questions are answered", () => {
      globalThis.location.href = "/assistent/vorpruefung/ergebnis";
      setup(() => "Ja");
      expect(globalThis.location.href).toBe("/assistent/vorpruefung/ergebnis");
    });
  });
});

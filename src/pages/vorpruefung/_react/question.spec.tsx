import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PreCheckQuestion } from "@/pages/vorpruefung/_react/question";
import { preCheck } from "@/resources/content/vorpruefung";
import userEvent from "@testing-library/user-event";
import { ResultType } from "./PreCheckResult";
import { usePreCheckData } from "./preCheckDataHook";

vi.stubGlobal("location", {
  href: "/vorpruefung",
});

const { questions } = preCheck;

// "Weiter" lives in the WizardButtonBar outside the island and submits via the form id
const renderQuestion = (questionIdx: number) =>
  render(
    <>
      <PreCheckQuestion
        questionIdx={questionIdx}
        question={questions[questionIdx]}
        formId="step-form"
        labelledBy="question-label"
      />
      <button type="submit" form="step-form">
        Weiter
      </button>
    </>,
  );

vi.mock(
  "@/pages/vorpruefung/_react/preCheckDataHook",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/pages/vorpruefung/_react/preCheckDataHook")
      >();

    return {
      ...actual,
      usePreCheckData: vi.fn(),
    };
  },
);

describe("PreCheck", () => {
  beforeEach(() => {
    const answers = [{ questionId: questions[0].id, answer: "yes" }];
    vi.mocked(usePreCheckData).mockReturnValue({
      answerForQuestionId: vi.fn().mockReturnValue({
        answers,
      }),
      firstUnansweredQuestionIndex: 0,
      answers,
      resultData: {
        result: ResultType.POSITIVE,
        title: "",
        negativeReasoning: "",
      },
      result: {
        digital: ResultType.POSITIVE,
        euBezug: ResultType.POSITIVE,
        interoperability: ResultType.POSITIVE,
      },
      hasData: true,
    });
  });

  describe("PreCheck validation", () => {
    beforeEach(() => {
      renderQuestion(0);
    });

    it("shows error when trying to click next without selecting an answer", async () => {
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Weiter" }));

      expect(screen.getByLabelText("Ja")).toHaveAccessibleErrorMessage(
        "Bitte wählen Sie eine Option aus.",
      );
      expect(screen.getByLabelText("Nein")).toHaveAccessibleErrorMessage(
        "Bitte wählen Sie eine Option aus.",
      );
      expect(
        screen.getByLabelText("Ich bin unsicher"),
      ).toHaveAccessibleErrorMessage("Bitte wählen Sie eine Option aus.");

      // error message on fieldset
      expect(
        screen.getByLabelText("Ja").parentElement?.parentElement,
      ).toHaveAccessibleErrorMessage("Bitte wählen Sie eine Option aus.");
    });

    it("allows next when selecting an answer", async () => {
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Weiter" }));

      expect(screen.getByLabelText("Ja")).toHaveAccessibleErrorMessage(
        "Bitte wählen Sie eine Option aus.",
      );

      await user.click(screen.getByLabelText("Ja"));

      await user.click(screen.getByRole("button", { name: "Weiter" }));

      expect(screen.getByLabelText("Ja")).not.toHaveAccessibleErrorMessage(
        "Bitte wählen Sie eine Option aus.",
      );
    });
  });

  describe("redirect guard", () => {
    beforeEach(() => {
      globalThis.location.href = "/vorpruefung";
    });

    it("redirects to last unanswered question", () => {
      renderQuestion(2);

      expect(globalThis.location.href).toBe("/vorpruefung/it-system");
    });

    it("does not redirect when all questions are answered", async () => {
      renderQuestion(0);

      await waitFor(() => {
        expect(globalThis.location.href).toBe("/vorpruefung");
      });
    });
  });
});

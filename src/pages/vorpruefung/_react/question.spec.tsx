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
      render(<PreCheckQuestion questionIdx={0} question={questions[0]} />);
    });

    it("shows error when trying to click next without selecting an answer", async () => {
      const user = userEvent.setup();

      await user.click(
        screen.getByRole("button", { name: "Übernehmen & weiter" }),
      );

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

      await user.click(
        screen.getByRole("button", { name: "Übernehmen & weiter" }),
      );

      expect(screen.getByLabelText("Ja")).toHaveAccessibleErrorMessage(
        "Bitte wählen Sie eine Option aus.",
      );

      await user.click(screen.getByLabelText("Ja"));

      await user.click(
        screen.getByRole("button", { name: "Übernehmen & weiter" }),
      );

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
      render(<PreCheckQuestion questionIdx={2} question={questions[2]} />);

      expect(globalThis.location.href).toBe("/vorpruefung/it-system");
    });

    it("does not redirect when all questions are answered", async () => {
      render(<PreCheckQuestion questionIdx={0} question={questions[0]} />);

      await waitFor(() => {
        expect(globalThis.location.href).toBe("/vorpruefung");
      });
    });
  });
});

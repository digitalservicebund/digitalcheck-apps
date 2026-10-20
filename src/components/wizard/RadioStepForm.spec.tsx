import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RadioStepForm from "./RadioStepForm";

const location = { href: "", pathname: "" };
vi.stubGlobal("location", location);

const options = [
  { value: "yes", label: "Ja" },
  { value: "no", label: "Nein" },
  { value: "unsure", label: "Ich bin unsicher" },
];

// "Weiter" lives in the WizardButtonBar outside of the island
const renderForm = (questionId: string) =>
  render(
    <>
      <h1 id="label">Frage</h1>
      <RadioStepForm
        formId="step-form"
        labelledBy="label"
        options={options}
        wizardId="vorpruefung"
        name={questionId}
      />
      <button type="submit" form="step-form">
        Weiter
      </button>
    </>,
  );

const openQuestion = (questionId: string) => {
  location.pathname = `/vorpruefung/${questionId}`;
  location.href = location.pathname;
};

describe("RadioStepForm", () => {
  beforeEach(() => {
    openQuestion("it-system");
  });

  it("renders the options as a labelled radio group", () => {
    renderForm("it-system");

    expect(screen.getByRole("radiogroup", { name: "Frage" })).toBeVisible();
    expect(screen.getByLabelText("Ja")).toBeVisible();
    expect(screen.getByLabelText("Nein")).toBeVisible();
  });

  it("shows an error and stays on the page without an answer", async () => {
    const user = userEvent.setup();
    renderForm("it-system");

    await user.click(screen.getByRole("button", { name: "Weiter" }));

    expect(screen.getByLabelText("Ja")).toHaveAccessibleErrorMessage(
      "Bitte wählen Sie eine Option aus.",
    );
    expect(location.href).toBe("/vorpruefung/it-system");
  });

  it("navigates to the next page of the flow with an answer", async () => {
    const user = userEvent.setup();
    renderForm("it-system");

    await user.click(screen.getByLabelText("Nein"));
    await user.click(screen.getByRole("button", { name: "Weiter" }));

    expect(location.href).toBe("/vorpruefung/verpflichtungen-fuer-beteiligte");
  });

  it("stays on the last question while earlier answers are missing", async () => {
    const user = userEvent.setup();
    openQuestion("eu-bezug");
    renderForm("eu-bezug");

    await user.click(screen.getByLabelText("Ja"));
    await user.click(screen.getByRole("button", { name: "Weiter" }));

    // the result page is guarded by all answers, which are not stored yet
    expect(location.href).toBe("/vorpruefung/eu-bezug");
  });
});

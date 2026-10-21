import { wizardStores } from "@/wizard/stores";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RadioStepForm from "./RadioStepForm";

const store = wizardStores.vorpruefung;

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
  // the store reads the URL on import, before the stub above
  store.$path.set(location.pathname);
};

describe("RadioStepForm", () => {
  beforeEach(() => {
    store.reset();
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

  it("saves the answer in the wizard store", async () => {
    const user = userEvent.setup();
    renderForm("it-system");

    await user.click(screen.getByLabelText("Nein"));
    await user.click(screen.getByRole("button", { name: "Weiter" }));

    expect(store.$data.get()).toEqual({ "it-system": "no" });
  });

  it("pre-fills the stored answer", () => {
    store.save({ "it-system": "unsure" });
    renderForm("it-system");

    expect(screen.getByLabelText("Ich bin unsicher")).toBeChecked();
  });

  it("stays on the last question while earlier answers are missing", async () => {
    const user = userEvent.setup();
    openQuestion("eu-bezug");
    renderForm("eu-bezug");

    await user.click(screen.getByLabelText("Ja"));
    await user.click(screen.getByRole("button", { name: "Weiter" }));

    // the result page is guarded by all answers
    expect(location.href).toBe("/vorpruefung/eu-bezug");
  });

  it("navigates to the result once all questions are answered", async () => {
    const user = userEvent.setup();
    store.save({
      "it-system": "yes",
      "verpflichtungen-fuer-beteiligte": "no",
      datenaustausch: "no",
      kommunikation: "unsure",
      automatisierung: "no",
    });
    openQuestion("eu-bezug");
    renderForm("eu-bezug");

    await user.click(screen.getByLabelText("Ja"));
    await user.click(screen.getByRole("button", { name: "Weiter" }));

    expect(location.href).toBe("/vorpruefung/ergebnis");
  });
});

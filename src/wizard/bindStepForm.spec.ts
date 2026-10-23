import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { compileFlowConfig } from "form-graph-engine";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { bindStepForm } from "./bindStepForm";
import { createWizardStore } from "./createWizardStore";

const location = { href: "", pathname: "" };
vi.stubGlobal("location", location);

const fields = {
  bewertung: z.enum(
    ["ja", "nicht-relevant"],
    "Bitte wählen Sie eine Option aus.",
  ),
  erklaerung: z.string().trim().min(1, "Bitte geben Sie eine Erklärung an."),
  aspekte: z.array(z.string()).min(1, "Bitte wählen Sie einen Aspekt aus."),
};

const flow = compileFlowConfig({
  pages: {
    bewertung: {
      path: "/test/bewertung",
      // The explanation is only required (and shown) unless "nicht-relevant"
      pageSchema: z
        .object({
          bewertung: fields.bewertung,
          erklaerung: fields.erklaerung.optional(),
        })
        .superRefine((data, ctx) => {
          if (data.bewertung !== "nicht-relevant" && !data.erklaerung) {
            ctx.addIssue({
              code: "custom",
              message: "Bitte geben Sie eine Erklärung an.",
              path: ["erklaerung"],
            });
          }
        }),
    },
    aspekte: { path: "/test/aspekte", pageSchema: { aspekte: fields.aspekte } },
    ende: { path: "/test/ende" },
  },
  transitions: { bewertung: "aspekte", aspekte: "ende", ende: null },
  initialStep: "bewertung",
});

const store = createWizardStore("testStepForm", flow, fields);

// Same markup as RadioField, ShowIf and TextareaField render
const bewertungPage = `
  <form novalidate>
    <h2 id="frage">Frage</h2>
    <div role="radiogroup" aria-labelledby="frage" data-wizard-field="bewertung">
      <input type="radio" id="r0" name="bewertung" value="ja" aria-errormessage="r-error" />
      <label for="r0">Ja</label>
      <input type="radio" id="r1" name="bewertung" value="nicht-relevant" aria-errormessage="r-error" />
      <label for="r1">Nicht relevant</label>
      <p id="r-error" data-wizard-error hidden><span data-wizard-error-text></span></p>
    </div>
    <fieldset data-wizard-show-if="bewertung" data-wizard-show-not='["nicht-relevant"]' hidden disabled>
      <div data-wizard-field="erklaerung">
        <label for="e">Erklärung</label>
        <textarea id="e" name="erklaerung" aria-errormessage="e-error"></textarea>
        <p id="e-error" data-wizard-error hidden><span data-wizard-error-text></span></p>
      </div>
    </fieldset>
  </form>
`;

const aspektePage = `
  <form novalidate>
    <div data-wizard-field="aspekte">
      <input type="checkbox" id="a0" name="aspekte" value="a" aria-errormessage="a-error" />
      <label for="a0">Aspekt A</label>
      <input type="checkbox" id="a1" name="aspekte" value="b" aria-errormessage="a-error" />
      <label for="a1">Aspekt B</label>
      <p id="a-error" data-wizard-error hidden><span data-wizard-error-text></span></p>
    </div>
  </form>
`;

let unbind = () => {};

const openPage = (path: string, markup: string) => {
  location.pathname = path;
  store.$path.set(path);
  document.body.innerHTML = markup;
  unbind = bindStepForm(
    document.querySelector<HTMLFormElement>("form")!,
    store,
    fields,
  );
  return userEvent.setup();
};

const openBewertung = () => openPage("/test/bewertung", bewertungPage);
const openAspekte = () => openPage("/test/aspekte", aspektePage);

beforeEach(() => {
  store.reset();
  location.href = "";
});

afterEach(() => unbind());

describe("bindStepForm", () => {
  it("shows the conditional field only for matching answers", async () => {
    const user = openBewertung();
    const textarea = screen.getByLabelText("Erklärung", {
      selector: "textarea",
    });
    expect(textarea).not.toBeVisible();

    await user.click(screen.getByLabelText("Ja"));
    expect(textarea).toBeVisible();

    await user.click(screen.getByLabelText("Nicht relevant"));
    expect(textarea).not.toBeVisible();
  });

  it("saves valid values right away and removes cleared ones", async () => {
    const user = openBewertung();
    await user.click(screen.getByLabelText("Ja"));
    await user.type(screen.getByRole("textbox"), "Text");

    expect(store.$data.get()).toEqual({ bewertung: "ja", erklaerung: "Text" });

    await user.clear(screen.getByRole("textbox"));
    expect(store.$data.get()).toEqual({ bewertung: "ja" });
  });

  it("prefills the fields from the store, also on later changes", () => {
    store.save({ bewertung: "ja", erklaerung: "Gespeichert" });
    openBewertung();

    expect(screen.getByLabelText("Ja")).toBeChecked();
    expect(screen.getByRole("textbox")).toHaveValue("Gespeichert");

    // e.g. from another tab
    store.save({ bewertung: "nicht-relevant" });
    expect(screen.getByLabelText("Nicht relevant")).toBeChecked();
    expect(screen.getByRole("textbox", { hidden: true })).not.toBeVisible();
  });

  it("continues to the next page on submit, even with missing answers", () => {
    openAspekte();
    document.querySelector("form")!.requestSubmit();

    expect(location.href).toBe("/test/ende");
  });

  describe("warnings", () => {
    it("are not shown on the first visit of a page", async () => {
      const user = openBewertung();
      await user.click(screen.getByLabelText("Ja"));

      // The first answer is stored now, but warnings only start on the next visit
      expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    });

    it("are shown when coming back to a page with stored answers", () => {
      store.save({ bewertung: "ja" });
      openBewertung();

      expect(screen.getByRole("textbox")).toHaveAccessibleErrorMessage(
        "Bitte geben Sie eine Erklärung an.",
      );
      expect(screen.getByLabelText("Ja")).not.toHaveAttribute("aria-invalid");
    });

    it("update while answering and skip hidden fields", async () => {
      store.save({ bewertung: "ja" });
      const user = openBewertung();
      const textarea = screen.getByRole("textbox");

      await user.type(textarea, "Text");
      expect(textarea).not.toHaveAttribute("aria-invalid");

      await user.clear(textarea);
      expect(textarea).toHaveAttribute("aria-invalid", "true");

      await user.click(screen.getByLabelText("Nicht relevant"));
      expect(
        screen.queryByText("Bitte geben Sie eine Erklärung an."),
      ).not.toBeInTheDocument();
    });
  });

  describe("multi-value fields", () => {
    it("saves all checked values as a list and removes an empty one", async () => {
      const user = openAspekte();
      await user.click(screen.getByLabelText("Aspekt A"));
      await user.click(screen.getByLabelText("Aspekt B"));
      expect(store.$data.get()).toEqual({ aspekte: ["a", "b"] });

      await user.click(screen.getByLabelText("Aspekt A"));
      expect(store.$data.get()).toEqual({ aspekte: ["b"] });

      await user.click(screen.getByLabelText("Aspekt B"));
      expect(store.$data.get()).toEqual({});
    });

    it("prefills the checked values and warns about an empty list", async () => {
      store.save({ aspekte: ["b"] });
      const user = openAspekte();

      expect(screen.getByLabelText("Aspekt A")).not.toBeChecked();
      expect(screen.getByLabelText("Aspekt B")).toBeChecked();

      await user.click(screen.getByLabelText("Aspekt B"));
      expect(screen.getByLabelText("Aspekt A")).toHaveAccessibleErrorMessage(
        "Bitte wählen Sie einen Aspekt aus.",
      );
    });
  });

  describe("consistency check", () => {
    it("logs fields of the page schema without controls and unknown controls", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      openPage(
        "/test/bewertung",
        '<form><input name="bewertung" value="ja" /><input name="tippfehler" /></form>',
      );

      expect(error).toHaveBeenCalledWith(
        expect.stringContaining("/test/bewertung"),
        { missing: ["erklaerung"], unknown: ["tippfehler"] },
      );
      error.mockRestore();
    });

    it("is quiet when the form matches", () => {
      const error = vi.spyOn(console, "error");
      openBewertung();

      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });
  });
});

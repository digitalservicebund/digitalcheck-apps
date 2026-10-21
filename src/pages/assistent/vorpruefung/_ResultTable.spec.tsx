import { wizardStores } from "@/wizard/stores";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import ResultTable from "./_ResultTable";

const store = wizardStores.vorpruefung;

const getRow = (title: string) =>
  screen.getByRole("rowheader", { name: title }).closest("tr")!;

describe("ResultTable", () => {
  beforeEach(() => {
    store.reset();
  });

  it("shows the stored answers with their explanation", () => {
    store.save({ "it-system": "yes", automatisierung: "no" });
    render(<ResultTable />);

    const itSystem = within(getRow("IT-System"));
    expect(itSystem.getByText("Ja")).toBeVisible();
    expect(
      itSystem.getByText(
        "Neues oder angepasstes IT-System – direkter Digitalbezug.",
      ),
    ).toBeVisible();

    const automatisierung = within(getRow("Automatisierung"));
    expect(automatisierung.getByText("Nein")).toBeVisible();
    expect(
      automatisierung.getByText("Kein Digitalbezug aus dieser Frage."),
    ).toBeVisible();
  });

  it("marks unanswered questions", () => {
    render(<ResultTable />);

    expect(
      within(getRow("EU-Bezug")).getByText("Noch nicht beantwortet."),
    ).toBeVisible();
  });

  it("links every answer to its question page", () => {
    render(<ResultTable />);

    expect(
      screen.getByRole("link", { name: "Bearbeiten: IT-System" }),
    ).toHaveAttribute("href", "/assistent/vorpruefung/it-system");
    expect(
      screen.getByRole("link", { name: "Bearbeiten: EU-Bezug" }),
    ).toHaveAttribute("href", "/assistent/vorpruefung/eu-bezug");
  });
});

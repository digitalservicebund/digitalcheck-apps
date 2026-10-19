import { dokumentation_verbindlicheAnforderungen } from "@/config/routes.ts";
import {
  DocumentationDataProvider,
  STORAGE_KEY,
} from "@/pages/dokumentation/_react/DocumentationDataProvider.tsx";
import { LayoutWithDocumentationNavigation } from "@/pages/dokumentation/_react/DocumentationNavigation.tsx";
import BindingRequirementsForm from "@/pages/dokumentation/_react/interoperability/BindingRequirementsForm";
import { stubResizingFunctionality } from "@/pages/dokumentation/_react/testUtils/stubResizingFunctionality.ts";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

function renderPage() {
  return render(
    <DocumentationDataProvider>
      <LayoutWithDocumentationNavigation
        prinzips={[]}
        currentUrl={dokumentation_verbindlicheAnforderungen.path}
      >
        <BindingRequirementsForm />
      </LayoutWithDocumentationNavigation>
    </DocumentationDataProvider>,
  );
}

describe("BindingRequirementsForm", () => {
  beforeEach(() => {
    stubResizingFunctionality();
    localStorage.removeItem(STORAGE_KEY);
  });
  it("adds an additional requirement", async () => {
    const user = userEvent.setup();
    renderPage();

    const addButton = screen.getByRole("button", {
      name: "Verbindliche Anforderung hinzufügen",
    });

    expect(screen.getByText("Anforderung 1")).toBeVisible();
    expect(screen.queryByText("Anforderung 2")).not.toBeInTheDocument();

    await user.click(addButton);
    expect(screen.getByText("Anforderung 2")).toBeVisible();
  });

  it("removes a single requirement when more than one exists", async () => {
    const user = userEvent.setup();
    renderPage();

    const addButton = screen.getByRole("button", {
      name: "Verbindliche Anforderung hinzufügen",
    });

    expect(
      screen.queryByRole("button", { name: "Anforderung 1 entfernen" }),
    ).not.toBeInTheDocument();

    await user.click(addButton);

    const removeFirstButton = screen.getByRole("button", {
      name: "Anforderung 1 entfernen",
    });
    expect(removeFirstButton).toBeVisible();

    await user.click(removeFirstButton);
    expect(screen.queryByText("Anforderung 2")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Anforderung 1 entfernen" }),
    ).not.toBeInTheDocument();

    await user.click(addButton);
    expect(screen.getByText("Anforderung 2")).toBeVisible();
  });
});

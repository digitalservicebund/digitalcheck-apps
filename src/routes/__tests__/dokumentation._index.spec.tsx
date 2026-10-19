// Import mocks first
import "./utils/mockLocalStorageVersioned";
import "./utils/mockRouter";
// End of mocks

import { dokumentation_hinweise } from "@/config/routes";
import { DokumentationIndexActions } from "@/routes/dokumentation._index";
import { DocumentationDataProvider } from "@/routes/dokumentation/DocumentationDataProvider";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const ROUTES_DOCUMENTATION_INTRO = [{ path: dokumentation_hinweise.path }];

const { mockDownloadDocumentation } = vi.hoisted(() => ({
  mockDownloadDocumentation: vi.fn(),
}));
vi.mock("@/service/wordDocumentationExport/wordDocumentation", () => ({
  useWordDocumentation: vi.fn(() => ({
    downloadDocumentation: mockDownloadDocumentation,
  })),
}));

describe("Dokumentation Index Route - Integration Tests", () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <DocumentationDataProvider>{component}</DocumentationDataProvider>,
    );
  };

  beforeEach(() => {
    renderWithRouter(<DokumentationIndexActions prinzips={[]} />);
  });

  it("renders the main CTA button to start documentation", () => {
    const startButton = screen.getByRole("link", {
      name: "Dokumentation starten",
    });
    expect(startButton).toHaveAttribute(
      "href",
      ROUTES_DOCUMENTATION_INTRO[0].path,
    );
  });

  it("renders the Word file download button", () => {
    const downloadButton = screen.getByRole("button", {
      name: "Word-Vorlage herunterladen (.docx)",
    });
    expect(downloadButton).toBeInTheDocument();
  });
});

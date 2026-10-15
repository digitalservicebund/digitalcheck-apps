import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RichText from "./RichText";

const EXAMPLE_MARKDOWN = `Jedes Regelungsvorhaben hat Auswirkungen auf die Digitalisierung.
<br />
<br />
**Digitaltaugliche Regelungsvorhaben** sind solche, die die Digitalisierung gezielt fördern und unterstützen.
Schauen Sie sich die [Hilfestellungen und Methoden](/methoden) an, um Ihr Regelungsvorhaben digitaltauglich zu gestalten.
Mit den folgenden externen Beispielen können Sie sich ein Bild davon machen, wie Digitaltauglichkeit in der Praxis aussieht:
- [Beispiel 1](https://example.com)
- [Beispiel 2](https://example.com)

Hier können sie die [Dokumentation herunterladen](/documents/digitalcheck-dokumentation.pdf).

Hier können sie die [Excel-Datei herunterladen](/documents/digitalcheck-dokumentation.xlsx).

Hier können sie das [Word Dokument herunterladen](/documents/digitalcheck-dokumentation.docx).

Hier können sie die [Powerpoint-Datei herunterladen](/documents/digitalcheck-dokumentation.pptx).
`;

describe("RichText", () => {
  it("renders links to download files with download attribute", async () => {
    render(<RichText markdown={EXAMPLE_MARKDOWN} data-testid="rich-text" />);
    const links = await screen.findAllByRole("link");
    expect(links[3]).toHaveAttribute("download");
    expect(links[4]).toHaveAttribute("download");
    expect(links[5]).toHaveAttribute("download");
    expect(links[6]).toHaveAttribute("download");
  });

  it("renders links to download files with helpful title", async () => {
    render(<RichText markdown={EXAMPLE_MARKDOWN} data-testid="rich-text" />);
    const links = await screen.findAllByRole("link");

    expect(links[3]).toHaveAttribute("title");
    expect(links[4]).toHaveAttribute("title");
    expect(links[5]).toHaveAttribute("title");
    expect(links[6]).toHaveAttribute("title");

    expect(links[3].title).contains("(PDF-Datei)");
    expect(links[4].title).contains("(XLSX-Datei)");
    expect(links[5].title).contains("(DOCX-Datei)");
    expect(links[6].title).contains("(PPTX-Datei)");
  });

  it("renders external links with CSS icons and document links with download icons", async () => {
    render(<RichText markdown={EXAMPLE_MARKDOWN} data-testid="rich-text" />);
    const links = await screen.findAllByRole("link");

    // Internal link – no icon markup (styled via global.css only for http links)
    expect(links[0].querySelector("svg")).toBeNull();
    expect(links[0]).not.toHaveAttribute("download");
    expect(links[0].getAttribute("href")).not.toMatch(/^https?:/);

    // External links – icon via CSS ::after (a:not([download])[href^="http"]::after)
    for (const link of links.slice(1, 3)) {
      expect(link.getAttribute("href")).toMatch(/^https?:/);
      expect(link).not.toHaveAttribute("download");
      expect(link.querySelector("svg")).toBeNull();
    }

    // Document download links – inline SVG icon
    for (const link of links.slice(3)) {
      expect(link).toHaveAttribute("download");
      expect(link.querySelector("svg")).not.toBeNull();
    }
  });

  it("prefixes root-relative links with the base path", async () => {
    vi.stubEnv("BASE_URL", "/preview/");
    render(<RichText markdown={EXAMPLE_MARKDOWN} data-testid="rich-text" />);
    const links = await screen.findAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "/preview/methoden");
    expect(links[1]).toHaveAttribute("href", "https://example.com");
    expect(links[3]).toHaveAttribute(
      "href",
      "/preview/documents/digitalcheck-dokumentation.pdf",
    );
    vi.unstubAllEnvs();
  });

  it("does not prefix links that already contain the base path", async () => {
    vi.stubEnv("BASE_URL", "/preview/");
    render(
      <RichText markdown="[Interoperabilitätsbewertung](/preview/interoperabel#verbindliche-anforderungen)" />,
    );
    const link = await screen.findByRole("link");

    expect(link).toHaveAttribute(
      "href",
      "/preview/interoperabel#verbindliche-anforderungen",
    );
    vi.unstubAllEnvs();
  });
});

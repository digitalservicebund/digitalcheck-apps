import { render, screen } from "@testing-library/react";
import RichText from "components/RichText";

const EXAMPLE_MARKDOWN = `Jedes Regelungsvorhaben hat Auswirkungen auf die Digitalisierung.
<br />
<br />
**Digitaltaugliche Regelungsvorhaben** sind solche, die die Digitalisierung gezielt fördern und unterstützen.
Schauen Sie sich die [Hilfestellungen und Methoden](/methoden) an, um Ihr Regelungsvorhaben digitaltauglich zu gestalten.
Mit den folgenden externen Beispielen können Sie sich ein Bild davon machen, wie Digitaltauglichkeit in der Praxis aussieht:
- [Beispiel 1](https://example.com)
- [Beispiel 2](https://example.com)

Hier können sie die [Dokumentation herunterladen](/assets/digitalcheck-dokumentation.pdf).`;

test("Richtext outermost element has richtext class", () => {
  render(<RichText markdown={EXAMPLE_MARKDOWN} data-testid="rich-text" />);
  expect(screen.getByTestId("rich-text")).toHaveClass("rich-text");
});

test("Richtext renders external links with target blank", async () => {
  render(<RichText markdown={EXAMPLE_MARKDOWN} data-testid="rich-text" />);
  const links = await screen.findAllByRole("link");
  expect(links[0]).not.toHaveAttribute("target", "_blank");
  expect(links[1]).toHaveAttribute("target", "_blank");
  expect(links[2]).toHaveAttribute("target", "_blank");
});

test("Richtext links to PDF files have download attribute", async () => {
  render(<RichText markdown={EXAMPLE_MARKDOWN} data-testid="rich-text" />);
  const links = await screen.findAllByRole("link");
  expect(links[3]).toHaveAttribute("download");
});

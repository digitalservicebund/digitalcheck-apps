import { render, screen } from "@testing-library/react";
import { act } from "react";
import { createRoutesStub } from "react-router";
import type { Absatz, Paragraph, Prinzip } from "~/utils/strapiData.server";
import ParagraphList from "./ParagraphList";

const PRINZIPS: Prinzip[] = [
  {
    documentId: "abc",
    Name: "Digitale Kommunikation sicherstellen",
    Beschreibung: [],
    Nummer: 1,
    GuteUmsetzungen: [],
    URLBezeichnung: "url",
  },
  {
    documentId: "abc",
    Name: "Daten und Standards Wiederverwenden",
    Beschreibung: [],
    Nummer: 2,
    GuteUmsetzungen: [],
    URLBezeichnung: "url",
  },
  {
    documentId: "abc",
    Name: "Datenschutz und Informationssicherheit",
    Beschreibung: [],
    Nummer: 3,
    GuteUmsetzungen: [],
    URLBezeichnung: "url",
  },
];

const ABSAETZE: Absatz[] = [
  {
    id: 1,
    Text: [
      {
        type: "paragraph",
        children: [
          { type: "text", text: "Text" },
          { type: "text", text: "Text mit 1Markierung[1]", underline: true },
          { type: "text", text: "Textohne" },
          { type: "text", text: "Text mit 2Markierung[2]", underline: true },
        ],
      },
    ],
    PrinzipErfuellungen: [
      {
        id: 1,
        Prinzip: PRINZIPS[0],
        WarumGut: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Darum gut 1" }],
          },
        ],
      },
      {
        id: 2,
        Prinzip: PRINZIPS[1],
        WarumGut: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Darum gut 2" }],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    Text: [
      {
        type: "paragraph",
        children: [{ type: "text", text: "Text ohne Markierung" }],
      },
    ],
    PrinzipErfuellungen: [],
  },
  {
    id: 3,
    Text: [
      {
        type: "paragraph",
        children: [
          { type: "text", text: "Text mit 3Markierung[3]", underline: true },
        ],
      },
    ],
    PrinzipErfuellungen: [
      {
        id: 2,
        Prinzip: PRINZIPS[2],
        WarumGut: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Darum gut 3" }],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    Text: [
      {
        type: "paragraph",
        children: [
          { type: "text", text: "Text" },
          { type: "text", text: "mitmit[2]", underline: true },
          { type: "text", text: "mehreren" },
          { type: "text", text: "2Markierungen[2]", underline: true },
        ],
      },
    ],
    PrinzipErfuellungen: [
      {
        id: 2,
        Prinzip: PRINZIPS[1],
        WarumGut: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Darum gut 2" }],
          },
        ],
      },
    ],
  },
];

const PARAGRAPHS: Paragraph[] = [
  {
    documentId: "abc",
    Nummer: "2",
    Gesetz: "GG",
    Titel: "Titel",
    Artikel: "Artikel",
    // Digitalcheck?: Digitalcheck,
    Absaetze: ABSAETZE,
  },
];

const RemixStubAllPrinciples = createRoutesStub([
  {
    path: "/",
    Component: () =>
      ParagraphList({
        paragraphs: PARAGRAPHS,
        principlesToShow: PRINZIPS,
      }),
  },
]);

const RemixStubFirstPrinciple = createRoutesStub([
  {
    path: "/",
    Component: () =>
      ParagraphList({
        paragraphs: PARAGRAPHS,
        principlesToShow: PRINZIPS.slice(0, 1),
      }),
  },
]);

// TEST HIGHLIGHTING

test("Has heading with paragraph number and law", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getByText("§ 2 GG")).toBeVisible();
});

test("Mark of Prinzip is shown", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.queryByText("Text mit 1Markierung[1]")).not.toBeInTheDocument();
  expect(screen.queryByText("Text mit 2Markierung[2]")).not.toBeInTheDocument();
  expect(screen.queryByText("Text mit 3Markierung[3]")).not.toBeInTheDocument();
  expect(
    screen.queryByText("(3) Text mit 3Markierung[3]"),
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/mitmit\[2\]/)).not.toBeInTheDocument();
  expect(screen.queryByText(/2Markierungen\[2\]/)).not.toBeInTheDocument();
  expect(screen.getByText("P1")).toBeVisible();
  expect(screen.getAllByText("P2")).toHaveLength(3);
  expect(screen.getByText("P3")).toBeVisible();
  expect(screen.getByText("Text mit 1Markierung")).toBeVisible();
  expect(screen.getByText("Text mit 2Markierung")).toBeVisible();
  expect(screen.getByText("(3) Text mit 3Markierung")).toBeVisible();
  expect(screen.getByText("mitmit")).toBeVisible();
  expect(screen.getByText("2Markierungen")).toBeVisible();
  expect(screen.getByText("Text mit 1Markierung")).toHaveRole("mark");
  expect(screen.getByText("Text mit 2Markierung")).toHaveRole("mark");
  expect(screen.getByText("(3) Text mit 3Markierung")).toHaveRole("mark");
  expect(screen.getByText("mitmit")).toHaveRole("mark");
  expect(screen.getByText("2Markierungen")).toHaveRole("mark");
});

test("Text without underline is not marked", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getByText(/Textohne/)).not.toHaveRole("mark");
});

test("Marks not shown when no relevant Prinzip", () => {
  render(<RemixStubFirstPrinciple />);
  // not footnotes
  expect(screen.queryByText("P2")).not.toBeInTheDocument();
  expect(screen.queryByText("P3")).not.toBeInTheDocument();
  // custom mark still removed
  expect(screen.queryByText(/\[2\]/)).not.toBeInTheDocument();
  expect(screen.queryByText(/\[3\]/)).not.toBeInTheDocument();
  // underlined elements aren't marks
  expect(screen.getByText(/mit 2Markierung/)).not.toHaveRole("mark");
  expect(screen.getByText("(3) Text mit 3Markierung")).not.toHaveRole("mark");
  expect(screen.getByText(/mitmit/)).not.toHaveRole("mark");
  expect(screen.getByText(/2Markierungen/)).not.toHaveRole("mark");
  // only relevant mark is shown
  expect(screen.getByText("P1")).toBeVisible();
  expect(screen.getByRole("mark")).toHaveTextContent("Text mit 1Markierung");
});

test("Multiple Marks in one Absatz", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getByText(/mitmit/)).toBeVisible();
  expect(screen.getByText(/2Markierungen/)).toBeVisible();
  expect(screen.getByText(/mitmit/)).toHaveRole("mark");
  expect(screen.getByText(/2Markierungen/)).toHaveRole("mark");
  expect(screen.getAllByText("P2")).toHaveLength(3);
});

// TEST COLLAPSED ABSAETZE

test("Absatz 2 without Mark is collapsed", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getByText("(2)")).toBeVisible();
  expect(screen.getByText("(2) Text ohne Markierung")).toBeInTheDocument();
  expect(screen.getByText("(2) Text ohne Markierung")).not.toBeVisible();
});

test("Absatz 2 through 4 without relevant Prinzip are collapsed", () => {
  render(<RemixStubFirstPrinciple />);
  expect(screen.getByText("(2) – (4)")).toBeVisible();
  expect(screen.getByText("(2) Text ohne Markierung")).toBeInTheDocument();
  expect(screen.getByText("(3) Text mit 3Markierung")).toBeInTheDocument();
  expect(screen.getByText(/mehreren/)).toBeInTheDocument();
  expect(screen.getByText("(2) Text ohne Markierung")).not.toBeVisible();
  expect(screen.getByText("(3) Text mit 3Markierung")).not.toBeVisible();
  expect(screen.getByText(/mehreren/)).not.toBeVisible();
});

// TEST REASONING

test("Reasoning is shown for Absaetze with PrinzipErfuellungen", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getAllByText("Warum ist das gut?")).toHaveLength(3);
  expect(screen.getByText(/Prinzip 1 –/)).toBeVisible();
  expect(screen.getByText(/Prinzip 1 –/)).toHaveRole("heading");
  expect(screen.getByText("Darum gut 1")).toBeVisible();
  expect(screen.getAllByText(/Prinzip 2 –/)).toHaveLength(2);
  expect(screen.getAllByText("Darum gut 2")).toHaveLength(2);
  expect(screen.getByText(/Prinzip 3 –/)).toBeVisible();
  expect(screen.getByText(/Prinzip 3 –/)).toHaveRole("heading");
  expect(screen.getByText("Darum gut 3")).toBeVisible();
});

test("Reasoning is only shown for relevant Prinzip", () => {
  render(<RemixStubFirstPrinciple />);
  expect(screen.getAllByText("Warum ist das gut?")).toHaveLength(1);
  expect(screen.getByText(/Prinzip 1 –/)).toBeVisible();
  expect(screen.queryByText(/Prinzip 2 –/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Prinzip 3 –/)).not.toBeInTheDocument();
});

// TEST LINKS BETWEEN HIGHLIGHTS AND REASONING

test("Clicking on Mark highlights Reasoning and adds backlink", () => {
  render(<RemixStubAllPrinciples />);
  const id = "warumGut-1-1";
  const firstMark = screen.getByText("Text mit 1Markierung").closest("a");
  expect(firstMark).toHaveAttribute("href", `/#${id}`);

  // clicking on mark removes highlighting and backlink
  act(() => {
    firstMark?.click();
  });
  expect(screen.getByTestId(id)).toHaveClass("border-4");
  const backlink = screen.getByLabelText("Zurück zum Text");
  expect(backlink).toHaveAttribute("href", `/#${firstMark?.id}`);
  expect(backlink).toBeVisible();

  // clicking on backlink removes highlighting and backlink
  act(() => {
    screen.getByLabelText("Zurück zum Text").click();
  });
  expect(screen.getByTestId("warumGut-1-1")).toHaveClass("border-l-4");
  expect(screen.getByTestId("warumGut-1-1")).not.toHaveClass("border-4");
  expect(screen.queryByLabelText("Zurück zum Text")).not.toBeInTheDocument();
});

test("Clicking on multiple Marks only highlights one Reasoning", () => {
  render(<RemixStubAllPrinciples />);
  act(() => {
    screen.getByText("Text mit 1Markierung").click();
    screen.getByText("Text mit 2Markierung").click();
  });
  expect(screen.getByTestId("warumGut-1-1")).not.toHaveClass("border-4");
  expect(screen.getByTestId("warumGut-1-2")).toHaveClass("border-4");
  expect(screen.getAllByLabelText("Zurück zum Text")).toHaveLength(1);
  act(() => {
    screen.getByLabelText("Zurück zum Text").click();
  });
  // clicking on backlink removes highlighting and backlink
  expect(screen.getByTestId("warumGut-1-2")).toHaveClass("border-l-4");
  expect(screen.getByTestId("warumGut-1-2")).not.toHaveClass("border-4");
  expect(screen.queryByLabelText("Zurück zum Text")).not.toBeInTheDocument();
});

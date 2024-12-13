import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import type { Absatz, Paragraph, Prinzip } from "utils/strapiData.server";
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
        ],
      },
    ],
    PrinzipErfuellungen: [
      {
        id: 1,
        Prinzip: PRINZIPS[0],
        WarumGut: [],
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
        WarumGut: [],
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
        WarumGut: [],
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

const RemixStubAllPrinciples = createRemixStub([
  {
    path: "/",
    Component: () =>
      ParagraphList({
        paragraphs: PARAGRAPHS,
        principlesToShow: PRINZIPS,
      }),
  },
]);

test("Has heading with paragraph number and law", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getByText("§ 2 GG")).toBeVisible();
});

test("Mark of Prinzip is shown", () => {
  render(<RemixStubAllPrinciples />);

  expect(screen.queryByText("Text mit 1Markierung[1]")).not.toBeInTheDocument();
  expect(screen.queryByText("Text mit 3Markierung[3]")).not.toBeInTheDocument();
  expect(
    screen.queryByText("(3) Text mit 3Markierung[3]"),
  ).not.toBeInTheDocument();
  expect(screen.getByText("P1")).toBeVisible();
  expect(screen.getByText("P3")).toBeVisible();
  expect(screen.getByText("Text mit 1Markierung")).toBeVisible();
  expect(screen.getByText("(3) Text mit 3Markierung")).toBeVisible();
  expect(screen.getByText("Text mit 1Markierung")).toHaveRole("mark");
  expect(screen.getByText("(3) Text mit 3Markierung")).toHaveRole("mark");
});

test("Text without underline is not marked", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getByText(/Textohne/)).not.toHaveRole("mark");
});

test("Absatz 2 without Mark is collapsed", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getByText("(2)")).toBeVisible();
  expect(screen.getByText("(2) Text ohne Markierung")).toBeInTheDocument();
  expect(screen.getByText("(2) Text ohne Markierung")).not.toBeVisible();
});

const RemixStubFirstPrinciple = createRemixStub([
  {
    path: "/",
    Component: () =>
      ParagraphList({
        paragraphs: PARAGRAPHS,
        principlesToShow: PRINZIPS.slice(0, 1),
      }),
  },
]);

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

test("Mark of Absatz 3 is not shown when no relevant Prinzip", () => {
  render(<RemixStubFirstPrinciple />);
  expect(screen.queryByText("P3")).not.toBeInTheDocument();
  // custom mark still removed
  expect(screen.queryByText("Text mit 3Markierung[3]")).not.toBeInTheDocument();
  expect(
    screen.queryByText("(3) Text mit 3Markierung[3]"),
  ).not.toBeInTheDocument();
  // only relevant mark is shown
  expect(screen.getByText("P1")).toBeVisible();
  expect(screen.getByRole("mark")).toHaveTextContent("Text mit 1Markierung");
});

test("Multiple Marks in one Absatz", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getByText(/mitmit/)).toBeVisible();
  expect(screen.getByText(/2Markierung/)).toBeVisible();
  expect(screen.getByText(/mitmit/)).toHaveRole("mark");
  expect(screen.getByText(/2Markierung/)).toHaveRole("mark");
  // test multiple Ps
});

// markierung in

// Begründungen
// test links
// test labels
// test explanations visible
// test only explanations visible if relevant principle
// test prinzip header visible

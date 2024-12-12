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
          { type: "text", text: "Text" },
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

test("Has heading with paragraph number and law", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getByText("§ 2 GG")).toBeInTheDocument();
});

test("Mark of Prinzip is shown", () => {
  render(<RemixStubAllPrinciples />);

  expect(screen.queryByText("Text mit 1Markierung[1]")).not.toBeInTheDocument();
  expect(screen.queryByText("Text mit 3Markierung[3]")).not.toBeInTheDocument();
  expect(
    screen.queryByText("(3) Text mit 3Markierung[3]"),
  ).not.toBeInTheDocument();
  expect(screen.getByText("P1")).toBeInTheDocument();
  expect(screen.getByText("P3")).toBeInTheDocument();
  expect(screen.getByText("Text mit 1Markierung")).toHaveRole("mark");
  expect(screen.getByText("(3) Text mit 3Markierung")).toHaveRole("mark");
});

test("Absatz 2 without Mark is collapsed", () => {
  render(<RemixStubAllPrinciples />);
  expect(screen.getByText("(2)")).toBeVisible();
  expect(screen.getByText("(2) Text ohne Markierung")).toBeInTheDocument();
  expect(screen.getByText("(2) Text ohne Markierung")).not.toBeVisible();
});

test("Absatz 2 and 3 without relevant Prinzip are collapsed", () => {
  render(<RemixStubFirstPrinciple />);
  expect(screen.getByText("(2) – (3)")).toBeVisible();
  expect(screen.getByText("(2) Text ohne Markierung")).toBeInTheDocument();
  expect(screen.getByText("(3) Text mit 3Markierung")).toBeInTheDocument();
  expect(screen.getByText("(2) Text ohne Markierung")).not.toBeVisible();
  expect(screen.getByText("(3) Text mit 3Markierung")).not.toBeVisible();
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
  expect(screen.getByText("P1")).toBeInTheDocument();
  expect(screen.getByRole("mark")).toHaveTextContent("Text mit 1Markierung");
});

// Begründungen
// test links
// test labels
// test explanations visible
// test only explanations visible if relevant principle
// test prinzip header visible

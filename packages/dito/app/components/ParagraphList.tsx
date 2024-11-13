import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { Paragraph, Prinzip } from "../utils/strapiData.server.ts";
import AbsatzRenderer from "./AbsatzRenderer.tsx";

function Paragraph({
  paragraph,
  principlesToFilter,
}: {
  paragraph: Paragraph;
  principlesToFilter: Prinzip[];
}) {
  const principleNumbers = principlesToFilter.map(
    (principle) => principle.Nummer,
  );

  // only show PrinzipErfuellungen for the currently filtered Prinzipien
  const filteredAbsaetze = paragraph.Absaetze.map((absatz) => ({
    ...absatz,
    PrinzipErfuellungen: absatz.PrinzipErfuellungen.filter((erfuellung) =>
      principleNumbers.includes(erfuellung.Prinzip.Nummer),
    ),
  }));
  const prinzipErfuellungen = paragraph.Absaetze.flatMap(
    (absatz) => absatz.PrinzipErfuellungen,
  );

  return (
    <div key={paragraph.Nummer}>
      <div className="ds-stack-8 rich-text">
        <p className="ds-label-01-bold">
          {paragraph.Nummer} {paragraph.Gesetz}
        </p>
        <p className="ds-label-01-bold">{paragraph.Titel}</p>
        {filteredAbsaetze.map((absatz, index) => (
          <div key={absatz.id} className="border-l-4 border-gray-300 pl-8">
            <DetailsSummary
              title={`Absatz ${index + 1}`}
              open={absatz.PrinzipErfuellungen.length > 0}
              content={
                <AbsatzRenderer
                  text={absatz.Text}
                  principlesToFilter={principleNumbers}
                />
              }
            />
          </div>
        ))}
        <DetailsSummary
          title="Warum ist das gut?"
          content={principlesToFilter.map((principle) => (
            <div key={principle.Nummer}>
              {principlesToFilter.length > 1 && (
                <Heading
                  tagName="h4"
                  text={principle.Name}
                  look="ds-label-01-bold"
                />
              )}
              {prinzipErfuellungen.map(
                (erfuellung) =>
                  erfuellung.Prinzip.Nummer === principle.Nummer && (
                    <div key={erfuellung.id}>
                      <BlocksRenderer
                        key={erfuellung.id}
                        content={erfuellung.WarumGut}
                      />
                    </div>
                  ),
              )}
            </div>
          ))}
        />
      </div>
    </div>
  );
}

export default function ParagraphList({
  paragraphs,
  principlesToFilter,
}: {
  paragraphs: Paragraph[];
  principlesToFilter: Prinzip[];
}) {
  return (
    <div className="ds-stack-32">
      {paragraphs
        .sort((a, b) => a.Nummer.localeCompare(b.Nummer))
        .map((paragraph) => (
          <Paragraph
            key={paragraph.documentId}
            paragraph={paragraph}
            principlesToFilter={principlesToFilter}
          />
        ))}
    </div>
  );
}

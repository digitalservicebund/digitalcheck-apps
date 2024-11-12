import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary.tsx";
import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { Paragraph, PrinzipName } from "../utils/strapiData.server.ts";

const AbsatzRenderer = ({ text }: { text: BlocksContent }) => {
  const blockOutput = BlocksRenderer({ content: text });
  console.log("AbsatzRenderer", blockOutput);
  return blockOutput;
};

function Paragraph({
  paragraph,
  prinzip,
}: {
  paragraph: Paragraph;
  prinzip?: PrinzipName;
}) {
  // if the component is used for a specific Prinzip, we only want to show PrinzipErfuellungen for that Prinzip
  paragraph.Absaetze.forEach((absatz) => {
    absatz.PrinzipErfuellungen = absatz.PrinzipErfuellungen.filter(
      (erfuellung) => erfuellung.Prinzip.Name === prinzip,
    );
  });

  return (
    <div className="space-y-40">
      <div key={paragraph.Nummer} className="ds-stack-8">
        <span className="ds-label-01-bold">{paragraph.Nummer}</span>
        {paragraph.Absaetze.map((absatz, index) =>
          // only show Absaetze with relevant PrinzipErfuellungen by default
          // show all on Regelungsvorhaben page (no prinzip)
          absatz.PrinzipErfuellungen.length > 0 || !prinzip ? (
            <div key={absatz.id} className="mt-8">
              <div className="border-l-4 border-gray-300 pl-8">
                <AbsatzRenderer text={absatz.Text} />
              </div>
              <DetailsSummary
                title="Warum ist das gut?"
                content={absatz.PrinzipErfuellungen.map((erfuellung) => (
                  <BlocksRenderer
                    key={erfuellung.id}
                    content={erfuellung.WarumGut}
                  />
                ))}
              />
            </div>
          ) : (
            <div key={absatz.id} className="border-l-4 border-gray-300 pl-8">
              <DetailsSummary
                title={`(${index + 1}) ...`}
                content={<BlocksRenderer content={absatz.Text} />}
              />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default function ParagraphList({
  paragraphs,
  prinzip,
}: {
  paragraphs: Paragraph[];
  prinzip?: PrinzipName;
}) {
  return (
    <div className="ds-stack-32">
      {paragraphs
        .sort((a, b) => a.Nummer.localeCompare(b.Nummer))
        .map((paragraph) => (
          <Paragraph
            key={paragraph.documentId}
            paragraph={paragraph}
            prinzip={prinzip}
          />
        ))}
    </div>
  );
}

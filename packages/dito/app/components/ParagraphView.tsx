import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary.tsx";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Paragraph, PrinzipName } from "../utils/strapiData.server.ts";

export default function ParagraphView({
  paragraph,
  prinzip,
}: {
  paragraph: Paragraph;
  prinzip: PrinzipName;
}) {
  const matchingItems = paragraph.Absaetze.map((absatz) => {
    const erfuellungForPrinzip = absatz.PrinzipErfuellungen.find(
      (erfuellung) => erfuellung.Prinzip.Name === prinzip,
    );
    return (
      erfuellungForPrinzip && {
        absatz,
        erfuellungForPrinzip,
      }
    );
  }).filter((absatz) => !!absatz);
  return (
    <div className="space-y-40 my-40">
      <div key={paragraph.Nummer} className="ds-stack-8">
        <span className="ds-label-01-bold">{paragraph.Nummer}</span>
        {paragraph.Absaetze.map((absatz) => {
          const match = matchingItems.find(
            (item) => item.absatz.id === absatz.id,
          );
          return match ? (
            <div key={absatz.id} className="mt-8">
              <div className="border-l-4 border-gray-300 pl-8">
                <BlocksRenderer content={absatz.Text} />
              </div>
              <DetailsSummary
                title="Warum ist das gut?"
                content={
                  <BlocksRenderer
                    content={match.erfuellungForPrinzip.WarumGut}
                  />
                }
              />
            </div>
          ) : (
            <p key={absatz.id}>Anderer Absatz</p>
          );
        })}
      </div>
    </div>
  );
}

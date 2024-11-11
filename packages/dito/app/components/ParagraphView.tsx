import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary.tsx";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Paragraph, PrinzipName } from "../utils/strapiData.server.ts";

export default function ParagraphView({
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
    <div className="space-y-40 my-40">
      <div key={paragraph.Nummer} className="ds-stack-8">
        <span className="ds-label-01-bold">{paragraph.Nummer}</span>
        {paragraph.Absaetze.map((absatz, index) =>
          // only show Absaetze with relevant PrinzipErfuellungen by default
          absatz.PrinzipErfuellungen.length > 0 ? (
            <div key={absatz.id} className="mt-8">
              <div className="border-l-4 border-gray-300 pl-8">
                <BlocksRenderer content={absatz.Text} />
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

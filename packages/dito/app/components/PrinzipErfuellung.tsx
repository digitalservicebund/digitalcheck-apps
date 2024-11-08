import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary.tsx";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import {
  Absatz,
  Paragraph,
  Prinziperfuellung,
} from "../utils/strapiData.server.ts";

export default function PrinzipErfuellung({
  prinzipErfuellung,
  absatz,
  paragraph,
}: {
  prinzipErfuellung: Prinziperfuellung;
  absatz: Absatz;
  paragraph: Paragraph;
}) {
  return (
    <div className="space-y-40 my-40">
      <div key={paragraph.Nummer} className="ds-stack-8">
        <span className="ds-label-01-bold">{paragraph.Nummer}</span>
        <div className="border-l-4 border-gray-300 pl-8">
          <BlocksRenderer content={absatz.Text} />
        </div>
        <DetailsSummary
          title="Warum ist das gut?"
          content={<BlocksRenderer content={prinzipErfuellung.WarumGut} />}
        ></DetailsSummary>
      </div>
    </div>
  );
}

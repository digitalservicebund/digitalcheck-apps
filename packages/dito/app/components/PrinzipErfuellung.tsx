import DetailsSummary from "@digitalcheck/shared/components/DetailsSummary.tsx";
import RichText from "@digitalcheck/shared/components/RichText.tsx";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Prinziperfuellung } from "../utils/strapiData.server.ts";

export default function PrinzipErfuellung({
  prinzipErfuellung,
}: {
  prinzipErfuellung: Prinziperfuellung;
}) {
  return (
    <div className="space-y-40 my-40">
      {prinzipErfuellung.Paragraphen.map((paragraph) => (
        <div key={paragraph.Norm} className="ds-stack-8">
          <span className="ds-label-01-bold">{paragraph.Norm}</span>
          <RichText
            markdown={paragraph.Regelungstext}
            className="border-l-4 border-gray-300 pl-8"
            rendererOptions={{
              del: ({ text }) => `<mark class="bg-yellow-300">${text}</mark>`,
            }}
          />
          <DetailsSummary
            title="Warum ist das gut?"
            content={<BlocksRenderer content={paragraph.WarumWichtig} />}
          ></DetailsSummary>
        </div>
      ))}
    </div>
  );
}

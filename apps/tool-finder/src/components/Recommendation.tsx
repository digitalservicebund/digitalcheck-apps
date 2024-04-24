import type { Recommendation } from "../models/Result";
import { getImageUrl } from "../services/getImageUrl";
import Heading from "./Heading";
import Image from "./Image";
import RichText from "./RichText";

export interface RecommendationProps {
  clusterName: string;
  recommendation: Recommendation;
}

export default function renderRecommendation({
  clusterName,
  recommendation,
}: RecommendationProps) {
  const fidelity = recommendation.fidelity;
  const tool = recommendation.primaryTool;

  return (
    <div
      key={`tool-${tool.id}`}
      className="p-12 md:p-24 border border-gray-400 border-b-0 last:border-b last:rounded-bl last:rounded-br first:rounded-tl first:rounded-tr"
    >
      <div className="ds-stack-8">
        <Heading
          className="ds-label-section text-gray-900"
          tagName="p"
          text={fidelity.name}
        />
        <Heading tagName="h3" text={tool.name} />
        <div className="flex flex-col sm:flex-row gap-16 sm:gap-24">
          <RichText
            className="flex-1 [word-break:break-word]"
            markdown={`${tool.description}
              ${tool.link ? `\n\n${tool.link}` : ""}
              ${tool.access ? "\n\n" + tool.access : ""}`}
          />
          {(tool.img.src || recommendation.alternativeTools.length > 0) && (
            <div className="flex-1 space-y-24">
              {tool.img.src && (
                <Image
                  url={getImageUrl(tool.img.src)}
                  alternativeText={tool.img.alt}
                />
              )}
              {recommendation.alternativeTools.length > 0 && (
                <div className="p-8 bg-gray-100 ds-stack-8 rounded">
                  <h4 className="ds-label-01-bold">Alternativen</h4>
                  <p>
                    Wenn Sie {tool.name} nicht nutzen können oder möchten,
                    können Sie ein {clusterName} auch in folgenden Anwendungen
                    erstellen:
                  </p>
                  <ul>
                    {recommendation.alternativeTools.map((alternative) => (
                      <li key={`alternative-${alternative.id}`}>
                        {alternative.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

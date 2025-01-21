import Heading from "@digitalcheck/shared/components/Heading";
import Image from "@digitalcheck/shared/components/Image";
import RichText from "@digitalcheck/shared/components/RichText";
import type { Recommendation } from "models/Result";
import type { Tool } from "models/Tool";
import { getImageUrl } from "services/getImageUrl";

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
      className="border border-b-0 border-gray-400 p-12 first:rounded-t last:rounded-b last:border-b md:p-24"
    >
      <div className="ds-stack-8">
        <Heading
          className="ds-label-section text-gray-900"
          tagName="p"
          text={fidelity.name}
        />
        <Heading tagName="h3" look="ds-heading-03-bold" text={tool.name} />
        <div className="flex flex-col gap-16 sm:flex-row sm:gap-24">
          <RichText
            markdown={`${tool.description}
              ${tool.link ? `\n\n${tool.link}` : ""}
              ${tool.access ? "\n\n" + tool.access : ""}`}
            className="flex-1 [word-break:break-word]"
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
                <div className="ds-stack-8 rounded bg-gray-100 p-8">
                  <h4 className="ds-label-01-bold">Alternativen</h4>
                  <p>
                    Wenn Sie {tool.name} nicht nutzen können oder möchten,
                    können Sie ein {clusterName} auch in folgenden Anwendungen
                    erstellen:
                  </p>
                  <ul>
                    {recommendation.alternativeTools.map(
                      (alternative: Tool) => (
                        <li key={`alternative-${alternative.id}`}>
                          {alternative.name}
                        </li>
                      ),
                    )}
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

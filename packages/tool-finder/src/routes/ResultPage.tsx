import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import FeedbackForm from "@digitalcheck/shared/components/FeedbackForm";
import Image from "@digitalcheck/shared/components/Image";
import Recommendation from "components/Recommendation";
import type { Reason } from "models/Reason";
import type { Ressort } from "models/Ressort";
import type { VisualisationObject } from "models/VisualisationObject";
import { findResultByObjectAndRessort } from "persistance/repository";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "services/getImageUrl";
import { trackFeedbackClick } from "services/tracking";
import useTitle from "services/useTitle";
import { PATH_QUIZ } from ".";

export type ResultPageProps = {
  ressort: Ressort | null;
  object: VisualisationObject | null;
  reason: Reason | null;
};

function ResultPage({ ressort, object, reason }: ResultPageProps) {
  useTitle("Empfohlenes Werkzeug");
  const navigate = useNavigate();

  useEffect(() => {
    if (!ressort || !object || !reason) {
      navigate(PATH_QUIZ); // needs to be called in useEffect
    }
  });

  if (!ressort || !object || !reason) {
    return null;
  }

  const result = findResultByObjectAndRessort(object, ressort);

  return result ? (
    <>
      <Container className="pb-24 pt-48 max-sm:px-0">
        <div className="border-4 border-[#EBF3FD] sm:rounded-lg sm:border-8">
          <Image
            url={getImageUrl(result.cluster.img.src)}
            alternativeText={result.cluster.img.alt}
            data-testid="cluster-img"
          />
          <div className="p-12 pt-16 md:p-24">
            <div className="p-12 pb-32 md:p-24">
              <p className="ds-label-section text-gray-900">
                Wir empfehlen Ihnen eine Visualisierung als:
              </p>
              <Box
                className="pt-16"
                heading={{
                  tagName: "h1",
                  text: result.cluster.name,
                }}
                content={{
                  markdown: result.cluster.description,
                }}
                buttons={[
                  {
                    id: "result-page-cluster-guide-button",
                    text: `${result.cluster.name} Anleitung`,
                    href: `/${result.cluster.id}`,
                    size: "small",
                    look: "tertiary",
                  },
                ]}
              ></Box>
            </div>
            <div>
              {result.recommendations.map((recommendation) => (
                <Recommendation
                  key={recommendation.fidelity.id}
                  clusterName={result.cluster.name}
                  recommendation={recommendation}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
      <Container className="pb-48 pt-24 max-sm:px-0">
        <Box
          className="border-blue-100 bg-blue-100 p-12 sm:rounded-md sm:border-2"
          heading={{
            tagName: "h3",
            look: "ds-label-01-bold",
            text: "Ihre Auswahl",
          }}
          content={{
            markdown: `
- Ressort: **${ressort.name}**  
- Objekt der Darstellung: **${object.name}**  
- Grund der Visualisierung: **${reason.name}**`,
          }}
          buttons={[
            {
              id: "result-change-selection",
              text: "Eingaben ändern",
              size: "small",
              look: "tertiary",
              href: PATH_QUIZ,
            },
          ]}
        ></Box>
      </Container>
      <FeedbackForm
        ressort={ressort.name}
        object={object.name}
        reason={reason.name}
        trackFeedbackClick={trackFeedbackClick}
      />
    </>
  ) : (
    <Container className="py-48">
      <Box
        identifier="info-section-why-visualisation"
        heading={{
          tagName: "h2",
          text: "Es ist ein Fehler aufgetreten.",
        }}
        content={{
          markdown: `Es tut uns Leid! Aus unbekannten Gründen ist ein Fehler aufgetreten. 
                    Bitte versuchen sie Es erneut.`,
        }}
        buttons={[
          {
            id: "result-error-page-back-button",
            text: "Zurück",
            href: PATH_QUIZ,
          },
        ]}
      ></Box>
    </Container>
  );
}
export default ResultPage;

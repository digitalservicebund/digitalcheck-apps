import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { visualisations } from "../resources/content.ts";
import { ROUTE_VISUALISATIONS } from "../resources/staticRoutes.ts";

import VisualisationItem from "../components/VisualisationItem.tsx";
import prependMetaTitle from "../utils/metaTitle.ts";
import {
  fetchStrapiData,
  visualisationFields,
  Visualisierung,
} from "../utils/strapiData.server.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_VISUALISATIONS.title, matches);
};

// prinzipCoreFields are being used in paragraphFields and so need to be included
const GET_VISUALISATIONS_QUERY = `
${visualisationFields}
query GetVisualisierungen {
  visualisierungen {
    ...VisualisationFields
    Digitalcheck {
      Regelungsvorhaben {
        VeroeffentlichungsDatum
        Rechtsgebiet
        Titel
      }
    }
  }
}`;

export const loader = async () => {
  const visualisationsData = await fetchStrapiData<{
    visualisierungen: Visualisierung[];
  }>(GET_VISUALISATIONS_QUERY);

  if ("error" in visualisationsData) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(visualisationsData.error, { status: 400 });
  }

  if (visualisationsData.visualisierungen.length === 0) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("No Visualisation found", { status: 404 });
  }

  return visualisationsData.visualisierungen;
};

const groupByRegelung = (visualisations: Visualisierung[]) => {
  return visualisations.reduce(
    (acc, visualisation) => {
      const regelung = visualisation.Digitalcheck?.Regelungsvorhaben;

      // Check if Regelungsvorhaben exists (visualisation is connected to a digitalcheck)
      if (!regelung) {
        return acc;
      }

      const regelungTitle = regelung.Titel;

      if (!acc[regelungTitle]) {
        acc[regelungTitle] = [];
      }
      acc[regelungTitle].push(visualisation);

      return acc;
    },
    {} as Record<string, Visualisierung[]>,
  );
};

export default function BeispieleVisualisierungen() {
  const visualisationsData = useLoaderData<typeof loader>();

  // Group visualisations by Regelung
  const groupedVisualisations = groupByRegelung(visualisationsData);
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              text: visualisations.title,
              tagName: "h1",
              className: "max-w-full",
            }}
          />
          <p className="mt-10">{visualisations.subtitle}</p>
        </Container>
      </Background>
      <Container>
        {Object.entries(groupedVisualisations).map(
          ([regelungTitle, visualisations]) => (
            <div key={regelungTitle}>
              <Heading
                tagName="h2"
                look="ds-heading-02-bold"
                className="mb-16 mt-32"
              >
                {regelungTitle}
              </Heading>

              {/* Render VisualisationItem for each visualisation */}
              {visualisations.map((visualisation) => (
                <VisualisationItem
                  key={visualisation.Bild.documentId}
                  visualisierung={visualisation}
                />
              ))}
            </div>
          ),
        )}
      </Container>
    </>
  );
}

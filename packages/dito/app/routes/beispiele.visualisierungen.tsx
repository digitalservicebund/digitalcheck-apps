import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import { Link, MetaFunction, useLoaderData } from "@remix-run/react";
import VisualisationItem from "../components/VisualisationItem.tsx";
import { visualisations } from "../resources/content.ts";
import { ROUTE_LAWS, ROUTE_VISUALISATIONS } from "../resources/staticRoutes.ts";
import prependMetaTitle from "../utils/metaTitle.ts";
import {
  fetchStrapiData,
  visualisationFields,
  Visualisierung,
} from "../utils/strapiData.server.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_VISUALISATIONS.title, matches);
};

const GET_VISUALISATIONS_QUERY = `
${visualisationFields}
query GetVisualisierungen {
  visualisierungen {
    ...VisualisationFields
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
  const grouped = new Map<string, Visualisierung[]>();

  visualisations.forEach((visualisation) => {
    const regelung = visualisation.Digitalcheck?.Regelungsvorhaben;

    if (regelung?.Titel) {
      if (!grouped.has(regelung.Titel)) {
        grouped.set(regelung.Titel, []);
      }
      grouped.get(regelung.Titel)?.push(visualisation);
    }
  });

  return grouped;
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
            content={{
              markdown: visualisations.subtitle,
            }}
          />
        </Container>
      </Background>
      <Container>
        {Array.from(groupedVisualisations.entries()).map(
          ([regelungTitle, visualisations]) => (
            <div key={regelungTitle} className="ds-stack-8">
              <Link
                to={`${ROUTE_LAWS.url}/${visualisations[0].Digitalcheck?.Regelungsvorhaben?.URLBezeichnung}`}
                prefetch="viewport"
              >
                <Heading
                  tagName="h2"
                  text={regelungTitle}
                  look="ds-heading-02-bold text-link"
                />
              </Link>

              {/* Render Visualisations for each Regelung */}
              <div className="pb-32">
                {visualisations.map((visualisation) => (
                  <VisualisationItem
                    key={visualisation.Bild.documentId}
                    visualisierung={visualisation}
                  />
                ))}
              </div>
            </div>
          ),
        )}
      </Container>
    </>
  );
}

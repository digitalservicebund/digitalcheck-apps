import { Link, useLoaderData, type MetaArgs } from "react-router";

import Background from "~/components/Background";
import Container from "~/components/Container";
import Header from "~/components/Header";
import Heading from "~/components/Heading";
import VisualisationItem from "~/components/VisualisationItem";
import { visualisations } from "~/resources/content";
import { ROUTE_LAWS, ROUTE_VISUALISATIONS } from "~/resources/staticRoutes";
import prependMetaTitle from "~/utils/metaTitle";
import {
  fetchStrapiData,
  visualisationFields,
  Visualisierung,
} from "~/utils/strapiData.server";

export const meta = ({ matches }: MetaArgs) => {
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

export default function BeispieleVisualisierungen() {
  const visualisationsData = useLoaderData<typeof loader>();

  // Group visualisations by Regelung
  const groupedVisualisations = visualisationsData.reduce(
    (acc, item) => {
      const title = item.Digitalcheck?.Regelungsvorhaben?.Titel;
      if (!title) return acc;
      acc[title] = acc[title] ?? [];
      acc[title].push(item);
      return acc;
    },
    {} as Record<string, Visualisierung[]>,
  );
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
      <Container className="ds-stack-48">
        {Object.entries(groupedVisualisations).map(
          ([regelungTitle, visualisations]) => (
            <div key={regelungTitle}>
              <div className="ds-stack-32">
                <Link
                  to={`${ROUTE_LAWS.url}/${visualisations[0].Digitalcheck?.Regelungsvorhaben?.URLBezeichnung}`}
                  prefetch="viewport"
                >
                  <Heading
                    tagName="h2"
                    text={regelungTitle}
                    look="ds-heading-02-bold text-link break-words"
                  />
                </Link>

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

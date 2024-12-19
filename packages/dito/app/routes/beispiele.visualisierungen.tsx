import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import Image from "@digitalcheck/shared/components/Image.tsx";
import ZoomInOutlined from "@digitalservicebund/icons/ZoomInOutlined";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { regulations, visualisations } from "../resources/content.ts";
import { ROUTE_VISUALISATIONS } from "../resources/staticRoutes.ts";

import prependMetaTitle from "../utils/metaTitle.ts";
import {
  fetchStrapiData,
  visualisationFields,
  Visualisierung,
} from "../utils/strapiData.server.ts";
import { formatDate } from "../utils/utilFunctions.ts";

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

      // Check if Regelungsvorhaben exists
      if (!regelung) {
        console.warn(
          `Warning: Visualization '${visualisation.Titel}' has no assigned Regelungsvorhaben.`,
        );
        return acc; // Skip this visualisation
      }

      const regelungTitle = regelung.Titel || "Unassigned Regelung";

      if (!acc[regelungTitle]) {
        acc[regelungTitle] = [];
      }
      acc[regelungTitle].push(visualisation);

      return acc;
    },
    {} as Record<string, Visualisierung[]>,
  );
};

// TODO
const LabelValuePair = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="space-x-8">
      <span>{label}</span>
      <span className="ds-label-01-bold">{value}</span>
    </div>
  ) : null;

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
        //TODO: check if thre is a better way
        {Object.entries(groupedVisualisations).map(
          ([regelungTitle, visualisations]) => (
            //TODO: link
            <div key={regelungTitle}>
              <Heading
                tagName="h2"
                look="ds-heading-02-bold"
                className="mb-16 mt-32"
              >
                {regelungTitle}
              </Heading>

              {/* Render Visualisations for this Regelung */}
              {visualisations.map((visualisation) => (
                <div
                  className="flex max-sm:flex-col mt-16 gap-32"
                  key={visualisation.Bild.documentId}
                >
                  <div className="w-1/2 max-sm:px-16 max-sm:pt-32">
                    <a
                      href={visualisation.Bild.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative border border-blue-500 aspect-square overflow-hidden"
                    >
                      <Image
                        url={visualisation.Bild.url}
                        alternativeText={visualisation.Bild.alternativeText}
                        className="w-full h-full object-cover"
                      />
                      <ZoomInOutlined
                        className="absolute bottom-16 left-16 bg-blue-800 p-1 shadow"
                        fill="white"
                      />
                    </a>

                    <div className="p-12 bg-gray-100">
                      <LabelValuePair
                        label={regulations.visualisations.imageInfo.legalArea}
                        value={
                          visualisation.Digitalcheck?.Regelungsvorhaben
                            ?.Rechtsgebiet
                        }
                      />
                      <LabelValuePair
                        label={regulations.visualisations.imageInfo.publishedOn}
                        value={formatDate(
                          visualisation.Digitalcheck?.Regelungsvorhaben
                            ?.VeroeffentlichungsDatum,
                        )}
                      />
                      {visualisation.Visualisierungsart && (
                        <LabelValuePair
                          label={regulations.visualisations.imageInfo.type}
                          value={visualisation.Visualisierungsart}
                        />
                      )}
                      {visualisation.Visualisierungstool && (
                        <LabelValuePair
                          label={regulations.visualisations.imageInfo.tool}
                          value={visualisation.Visualisierungstool}
                        />
                      )}
                    </div>
                  </div>
                  <Container
                    additionalClassNames="w-1/2 p-0 mb-12"
                    paddingTop="0"
                    paddingBottom="0"
                  >
                    <Heading
                      tagName="h4"
                      look="ds-heading-03-reg"
                      className="mb-16"
                    >
                      {visualisation.Titel}
                    </Heading>
                    <BlocksRenderer
                      content={visualisation.Beschreibung}
                    ></BlocksRenderer>
                  </Container>
                </div>
              ))}
            </div>
          ),
        )}
      </Container>
    </>
  );
}

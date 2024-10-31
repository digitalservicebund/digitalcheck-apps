import Background from "@digitalcheck/shared/components/Background.tsx";
import Button from "@digitalcheck/shared/components/Button.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import Image from "@digitalcheck/shared/components/Image.tsx";
import TextRow from "@digitalcheck/shared/components/TextRow.tsx";
import ZoomInOutlined from "@digitalservicebund/icons/ZoomInOutlined";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { regulations } from "../resources/content.ts";
import { ROUTE_LAWS } from "../resources/staticRoutes.ts";
import prependMetaTitle from "../utils/metaTitle.ts";
import {
  digitalcheck,
  fetchStrapiData,
  prinzipErfuellung,
  Regelungsvorhaben,
  RegelungsvorhabenResponse,
} from "../utils/strapiData.server.ts";
import { slugify } from "../utils/utilFunctions.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_LAWS.title, matches);
};

const GET_REGELUNGSVORHABENS_BY_SLUG_QUERY = `
${prinzipErfuellung}
${digitalcheck}
query GetRegelungsvorhabens($slug: String!) {
  regelungsvorhabens(filters: { URLBezeichnung: { eq: $slug } }) {
    DIPVorgang
    NKRNummer
    Digitalcheck {
      ...digitalcheck
    }
    NKRStellungnahmeRegelungText
    Rechtsgebiet
    Ressort
    Titel
    documentId
    URLBezeichnung
    VeroeffentlichungsDatum
  }
}`;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.regelung as string;
  const regelungData = await fetchStrapiData<RegelungsvorhabenResponse>(
    GET_REGELUNGSVORHABENS_BY_SLUG_QUERY,
    { slug },
  );

  return json({
    regelung: regelungData?.data.regelungsvorhabens[0],
  });
};

export default function Gesetz() {
  const { regelung } = useLoaderData<{ regelung: Regelungsvorhaben }>();
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: regelung.Titel,
            }}
          />
          <p className="mt-10">{regulations.subtitle[0]}</p>
          <p className="mt-24 ds-label-01-bold">
            <b>{regulations.subtitle[1]}</b>
          </p>
          {/*
            //TODO: how do we handle multiple digitalchecks? Adapt menu accordingly
*/}
          <ol className="mt-16">
            {regulations.menu.map((menuItem, index) => (
              <li key={index}>
                <Link
                  to={`#${slugify(menuItem)}`}
                  className="underline underline-offset-4 decoration-1"
                >
                  ↓ {menuItem}
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </Background>
      <Background backgroundColor="midLightBlue">
        <Container paddingTop="0" paddingBottom="0">
          <TextRow
            items={[
              {
                label: regulations.infoLabels[0],
                value: regelung.Rechtsgebiet,
              },
              {
                label: regulations.infoLabels[1],
                value: regelung.VeroeffentlichungsDatum?.toString(),
              },
            ]}
          />
        </Container>
      </Background>
      {regelung.Digitalcheck?.map((digitalcheck, index) => (
        <Container key={index} additionalClassNames="ds-stack-8">
          <Heading tagName="h2">Debug: Digitalcheck {index + 1}</Heading>
          {/*
            ----- VISUALISIERUNGEN -----
*/}
          {digitalcheck.Visualisierung && (
            <div>
              <Heading tagName="h2">Visualisierungen</Heading>
              <p>{regulations.visualisations.subTitle}</p>
              {digitalcheck.Visualisierung.map((visualisierung, index) => (
                <div
                  className="flex max-sm:flex-col mt-40 gap-32"
                  key={visualisierung.Bild.documentId}
                >
                  <div className="flex-1 max-sm:px-16 max-sm:pt-32">
                    <div className="relative border border-blue-500 aspect-square overflow-hidden">
                      <Image
                        url={visualisierung.Bild.url}
                        alternativeText={visualisierung.Bild.alternativeText}
                        className="w-full h-full object-cover"
                      />
                      <a
                        href={visualisierung.Bild.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="absolute bottom-16 left-16 bg-blue-800 p-2 shadow">
                          <ZoomInOutlined
                            className="text-white"
                            fill="currentColor"
                          />
                        </div>
                      </a>
                    </div>
                    <div className="p-12 bg-gray-100 space-x-8">
                      <span>{regulations.visualisations.type}</span>
                      <span className="ds-label-01-bold">
                        {visualisierung.VisualisierungsArt}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Container
                      additionalClassNames="rich-text p-0 mb-12"
                      paddingTop="0"
                      paddingBottom="0"
                      key={index}
                    >
                      <BlocksRenderer
                        content={visualisierung.Beschreibung}
                      ></BlocksRenderer>
                    </Container>
                    <Button
                      href={visualisierung.Bild.url}
                      target="_blank"
                      text={regulations.visualisations.button}
                    ></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/*
            ----- Prinziperfüllung -----
*/}
          {/*          {Object.entries(digitalcheck).map(([key, value]) => (
            <PrinzipErfuellung
              key={`${key}-${index}`}
              prinzipErfuellung={value}
              showParagraphs={false}
            ></PrinzipErfuellung>
          ))}*/}
        </Container>
      ))}
    </>
  );
}

import Background from "@digitalcheck/shared/components/Background.tsx";
import Box from "@digitalcheck/shared/components/Box.tsx";
import Button from "@digitalcheck/shared/components/Button.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import Image from "@digitalcheck/shared/components/Image.tsx";
import InlineInfoList from "@digitalcheck/shared/components/InlineInfoList.tsx";
import RichText from "@digitalcheck/shared/components/RichText.tsx";
import ZoomInOutlined from "@digitalservicebund/icons/ZoomInOutlined";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { regulations } from "../resources/content.ts";
import { ROUTE_LAWS } from "../resources/staticRoutes.ts";
import prependMetaTitle from "../utils/metaTitle.ts";
import {
  fetchStrapiData,
  Regelungsvorhaben,
  RegelungsvorhabenResponse,
} from "../utils/strapiData.server.ts";
import { slugify } from "../utils/utilFunctions.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_LAWS.title, matches);
};

const GET_REGELUNGSVORHABENS_BY_SLUG_QUERY = `
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

const LabelValuePair = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="space-x-8">
      <span>{label}</span>
      <span className="ds-label-01-bold">{value}</span>
    </div>
  ) : null;

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
          <p className="mt-10">{regulations.subTitle[0]}</p>
          <p className="mt-24 ds-label-01-bold">
            <b>{regulations.subTitle[1]}</b>
          </p>
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
          <InlineInfoList
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
        <Container
          key={digitalcheck.documentId}
          additionalClassNames="ds-stack-8"
        >
          <Heading tagName="h2">Debug: Digitalcheck {index + 1}</Heading>
          {/* ----- VISUALISIERUNGEN ----- */}
          {digitalcheck.Visualisierungen && (
            <div>
              <Heading tagName="h2">{regulations.visualisations.title}</Heading>
              <p>{regulations.visualisations.subTitle}</p>
              {digitalcheck.Visualisierungen.map((visualisierung, index) => (
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
                    <div className="p-12 bg-gray-100">
                      <LabelValuePair
                        label={regulations.visualisations.imageInfo.legalArea}
                        value={regelung.Rechtsgebiet}
                      />
                      <LabelValuePair
                        label={regulations.visualisations.imageInfo.publishedOn}
                        value={regelung.VeroeffentlichungsDatum}
                      />
                      <LabelValuePair
                        label={regulations.visualisations.imageInfo.type}
                        value={visualisierung.Visualisierungsart}
                      />
                      <LabelValuePair
                        label={regulations.visualisations.imageInfo.law}
                        value={regelung.Titel}
                      />
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

          {/* ----- Prinziperfüllung ----- */}
          <Heading tagName="h2" className="pt-40">
            {regulations.principles.title}
          </Heading>
          <p>{regulations.principles.subtitle}</p>
          {/*          {Object.values(prinzipToStrapi).map(
            (prinzipKey) =>
              digitalcheck[prinzipKey]?.Paragraphen?.length > 0 && (
                <PrinzipErfuellung
                  key={`${prinzipKey}`}
                  prinzipErfuellung={digitalcheck[prinzipKey]}
                />
              ),
          )}*/}
        </Container>
      ))}

      {/* ----- NKR Stellungnahme ----- */}
      <Container additionalClassNames="ds-stack-8">
        <Heading tagName="h2">{regulations.nkr.title}</Heading>
        <p>{regulations.nkr.subTitle}</p>
        {regelung.NKRStellungnahmeRegelungText && (
          <RichText
            className="border-l-4 border-gray-300 pl-8"
            markdown={regelung.NKRStellungnahmeRegelungText}
          />
        )}
      </Container>

      {/* ----- Feedback Banner ----- */}
      <Background backgroundColor="midBlue">
        <Container additionalClassNames="ds-stack-16">
          <Box
            heading={{
              tagName: "h2",
              look: "ds-label-01-bold",
              text: regulations.feedback.title,
            }}
            content={{
              markdown: regulations.feedback.text,
            }}
          ></Box>
        </Container>
      </Background>
    </>
  );
}

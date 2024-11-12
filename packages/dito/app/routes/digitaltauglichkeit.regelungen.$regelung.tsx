import Background from "@digitalcheck/shared/components/Background.tsx";
import Box from "@digitalcheck/shared/components/Box.tsx";
import Button from "@digitalcheck/shared/components/Button.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import Image from "@digitalcheck/shared/components/Image.tsx";
import InlineInfoList from "@digitalcheck/shared/components/InlineInfoList.tsx";
import ZoomInOutlined from "@digitalservicebund/icons/ZoomInOutlined";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ParagraphList from "components/ParagraphList.tsx";
import { regulations } from "../resources/content.ts";
import { ROUTE_LAWS } from "../resources/staticRoutes.ts";
import prependMetaTitle from "../utils/metaTitle.ts";
import {
  fetchStrapiData,
  RegelungsvorhabenResponse,
} from "../utils/strapiData.server.ts";
import { slugify } from "../utils/utilFunctions.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_LAWS.title, matches);
};

// TODO: there seems to be an error with Visualisierungen, has to be added again
const GET_REGELUNGSVORHABENS_BY_SLUG_QUERY = `
query GetRegelungsvorhabens($slug: String!) {
  regelungsvorhabens(filters: { URLBezeichnung: { eq: $slug } }) {
    documentId
    NKRNummer
    Rechtsgebiet
    Ressort
    Titel
    documentId
    URLBezeichnung
    VeroeffentlichungsDatum
    LinkRegelungstext
    NKRStellungnahmeLink
    Digitalchecks {
      documentId
      Titel
      EinschaetzungAutomatisierung
      EinschaetzungDatenschutz
      EinschaetzungKlareRegelungen
      EinschaetzungKommunikation
      EinschaetzungWiederverwendung
      NKRStellungnahmeDCText
      Paragraphen {
        Absaetze {
          PrinzipErfuellungen {
            KontextEnde
            KontextStart
            Prinzip {
              Name
            }
            WarumGut
            id
          }
          Text
          id
        }
        Artikel
        Gesetz
        Titel
        Nummer
        documentId
      }
    }
  }
}`;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.regelung as string;
  const regelungData = await fetchStrapiData<RegelungsvorhabenResponse>(
    GET_REGELUNGSVORHABENS_BY_SLUG_QUERY,
    { slug },
  );

  if (!regelungData) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Error fetching Regelung", { status: 404 });
  }

  return json({
    regelung: regelungData.data.regelungsvorhabens[0],
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
  const { regelung } = useLoaderData<typeof loader>();
  console.log("regelung", regelung);
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              text: regelung.Titel,
              tagName: "h1",
              className: "max-w-full",
            }}
          />
          <p className="mt-10">{regulations.subtitle[0]}</p>
          <p className="mt-24 ds-label-01-bold">
            <b>{regulations.subtitle[1]}</b>
          </p>
          <ol className="mt-16">
            {regelung.Digitalchecks.map((digitalcheck) => (
              <li key={digitalcheck.documentId}>
                <Link
                  to={`#${slugify(digitalcheck.documentId)}`}
                  className="underline underline-offset-4 decoration-1"
                >
                  ↓ {digitalcheck.Titel}
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
      {regelung.Digitalchecks.map((digitalcheck) => (
        <Container
          key={digitalcheck.documentId}
          additionalClassNames="ds-stack-32"
        >
          {/* target for same page jump navigation */}
          <span id={slugify(digitalcheck.documentId)} />
          <Header
            heading={{
              text: digitalcheck.Titel,
              tagName: "h2",
              look: "ds-heading-02-bold",
            }}
            content={{
              markdown: regulations.digitalcheck.subtitle,
            }}
          />

          {/* ----- Prinziperfüllung ----- */}
          <Heading tagName="h3" className="pt-40">
            {regulations.principles.title}
          </Heading>
          <ParagraphList paragraphs={digitalcheck.Paragraphen} />

          {/* ----- VISUALISIERUNGEN ----- */}
          {digitalcheck.Visualisierungen && (
            <div>
              <Heading tagName="h3">{regulations.visualisations.title}</Heading>
              <p>{regulations.visualisations.subtitle}</p>
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

          {/* ----- NKR Stellungnahme ----- */}
          {digitalcheck.NKRStellungnahmeDCText && (
            <>
              <Heading tagName="h3">{regulations.nkr.title}</Heading>
              <p>{regulations.nkr.subtitle}</p>

              <div className="border-l-4 border-gray-300 pl-8">
                <BlocksRenderer content={digitalcheck.NKRStellungnahmeDCText} />
              </div>
            </>
          )}
        </Container>
      ))}

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

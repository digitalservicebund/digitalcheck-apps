import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import CustomLink from "@digitalcheck/shared/components/CustomLink.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import Image from "@digitalcheck/shared/components/Image.tsx";
import InlineInfoList from "@digitalcheck/shared/components/InlineInfoList.tsx";
import ZoomInOutlined from "@digitalservicebund/icons/ZoomInOutlined";
import { type LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  MetaFunction,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ParagraphList from "components/ParagraphList.tsx";
import React from "react";
import { regulations } from "../resources/content.ts";
import { ROUTE_LAWS } from "../resources/staticRoutes.ts";
import prependMetaTitle from "../utils/metaTitle.ts";
import {
  fetchStrapiData,
  paragraphFields,
  Prinzip,
  prinzipCoreFields,
  Regelungsvorhaben,
} from "../utils/strapiData.server.ts";
import { formatDate, slugify } from "../utils/utilFunctions.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_LAWS.title, matches);
};

// prinzipCoreFields are being used in paragraphFields and so need to be included
const GET_REGELUNGSVORHABENS_BY_SLUG_QUERY = `
${prinzipCoreFields}
${paragraphFields}
query GetRegelungsvorhabens($slug: String!) {
  regelungsvorhabens(filters: { URLBezeichnung: { eq: $slug } }) {
    documentId
    Titel
    NKRNummer
    Rechtsgebiet
    Ressort
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
        ...ParagraphFields
      }
      Visualisierungen {
        documentId
        Titel
        Beschreibung
        Visualisierungsart
        Visualisierungstool
        Bild {
          documentId
          url
          previewUrl
          alternativeText
        }
      }
    }
  }
}`;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const regelungData = await fetchStrapiData<{
    regelungsvorhabens: Regelungsvorhaben[];
  }>(GET_REGELUNGSVORHABENS_BY_SLUG_QUERY, { slug: params.regelung as string });

  if ("error" in regelungData) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(regelungData.error, { status: 400 });
  }

  return regelungData.regelungsvorhabens[0];
};

const LabelValuePair = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="space-x-8">
      <span>{label}</span>
      <span className="ds-label-01-bold">{value}</span>
    </div>
  ) : null;

export default function Gesetz() {
  const regelung = useLoaderData<typeof loader>();
  const principles = useOutletContext<Prinzip[]>();
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
            {regelung.Digitalchecks.map((digitalcheck, index) => (
              <React.Fragment key={digitalcheck.documentId}>
                <li>
                  ↓{" "}
                  <Link
                    to={`#${slugify(regulations.principles.title)}-${index}`}
                    className="underline underline-offset-4 decoration-1"
                  >
                    {regulations.principles.title}
                  </Link>
                </li>
                {digitalcheck.Visualisierungen.length > 0 && (
                  <li>
                    ↓{" "}
                    <Link
                      to={`#${slugify(regulations.visualisations.title)}-${index}`}
                      className="underline underline-offset-4 decoration-1"
                    >
                      {regulations.visualisations.title}
                    </Link>
                  </li>
                )}
                {digitalcheck.NKRStellungnahmeDCText && (
                  <li>
                    ↓{" "}
                    <Link
                      to={`#${slugify(regulations.nkr.title)}-${index}`}
                      className="underline underline-offset-4 decoration-1"
                    >
                      {regulations.nkr.title}
                    </Link>
                  </li>
                )}
              </React.Fragment>
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
                value: regelung.VeroeffentlichungsDatum
                  ? formatDate(regelung.VeroeffentlichungsDatum)
                  : "",
              },
              {
                key: regulations.infoLabels[1],
                value: regelung.LinkRegelungstext ? (
                  <CustomLink
                    to={regelung.LinkRegelungstext}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-800 underline"
                  >
                    {regulations.infoLabels[1]}
                  </CustomLink>
                ) : null,
              },
              {
                label: regulations.infoLabels[2],
                value: regelung.Ressort,
              },
            ]}
          />
        </Container>
      </Background>
      {regelung.Digitalchecks.map((digitalcheck, index) => (
        <Container
          key={digitalcheck.documentId}
          paddingBottom="80"
          additionalClassNames="ds-stack-64 rich-text"
        >
          {/* ----- Formulierungen / Prinziperfüllungen ----- */}
          <Heading
            id={`${slugify(regulations.principles.title)}-${index}`}
            tagName="h2"
            look="ds-heading-02-bold"
          >
            {regulations.principles.title}
          </Heading>
          <ParagraphList
            paragraphs={digitalcheck.Paragraphen}
            principlesToShow={principles}
          />

          {/* ----- Visualisierungen ----- */}
          {digitalcheck.Visualisierungen.length > 0 && (
            <div>
              <Header
                heading={{
                  id: `${slugify(regulations.visualisations.title)}-${index}`,
                  text: regulations.visualisations.title,
                  tagName: "h2",
                  look: "ds-heading-02-bold",
                }}
                content={{
                  markdown: regulations.visualisations.subtitle,
                }}
              />
              {digitalcheck.Visualisierungen.map((visualisierung) => (
                <div
                  className="flex max-sm:flex-col mt-32 gap-32"
                  key={visualisierung.Bild.documentId}
                >
                  <div className="w-1/2 max-sm:px-16 max-sm:pt-32">
                    <a
                      href={visualisierung.Bild.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative border border-blue-500 aspect-square overflow-hidden"
                    >
                      <Image
                        url={visualisierung.Bild.url}
                        alternativeText={visualisierung.Bild.alternativeText}
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
                        value={regelung.Rechtsgebiet}
                      />
                      <LabelValuePair
                        label={regulations.visualisations.imageInfo.publishedOn}
                        value={formatDate(regelung.VeroeffentlichungsDatum)}
                      />
                      {visualisierung.Visualisierungsart && (
                        <LabelValuePair
                          label={regulations.visualisations.imageInfo.type}
                          value={visualisierung.Visualisierungsart}
                        />
                      )}
                      {visualisierung.Visualisierungstool && (
                        <LabelValuePair
                          label={regulations.visualisations.imageInfo.tool}
                          value={visualisierung.Visualisierungstool}
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
                      {visualisierung.Titel}
                    </Heading>
                    <BlocksRenderer
                      content={visualisierung.Beschreibung}
                    ></BlocksRenderer>
                  </Container>
                </div>
              ))}
            </div>
          )}

          {/* ----- NKR Stellungnahme ----- */}
          {digitalcheck.NKRStellungnahmeDCText && (
            <div>
              <Header
                heading={{
                  id: `${slugify(regulations.nkr.title)}-${index}`,
                  text: regulations.nkr.title,
                  tagName: "h2",
                  look: "ds-heading-02-bold",
                }}
                content={{
                  markdown: regulations.nkr.subtitle,
                }}
              />
              <div className="my-32 border-l-4 border-gray-300 pl-8">
                <BlocksRenderer content={digitalcheck.NKRStellungnahmeDCText} />
              </div>
              {regelung.NKRStellungnahmeLink && (
                <div>
                  {regulations.nkr.linkText}
                  <CustomLink
                    target="_blank"
                    to={regelung.NKRStellungnahmeLink}
                    rel="noreferrer"
                  >
                    NKR Stellungnahme
                  </CustomLink>
                </div>
              )}
            </div>
          )}
        </Container>
      ))}
    </>
  );
}

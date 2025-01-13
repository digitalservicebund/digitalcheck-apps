import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import CustomLink from "@digitalcheck/shared/components/CustomLink.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import InlineInfoList from "@digitalcheck/shared/components/InlineInfoList.tsx";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice.tsx";
import { type LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  MetaFunction,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ParagraphList from "components/ParagraphList.tsx";
import VisualisationItem from "components/VisualisationItem.tsx";
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
  visualisationFields,
} from "../utils/strapiData.server.ts";
import {
  formatDate,
  gesetzStatusMap,
  slugify,
} from "../utils/utilFunctions.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_LAWS.title, matches);
};

// prinzipCoreFields are being used in paragraphFields and so need to be included
const GET_REGELUNGSVORHABENS_BY_SLUG_QUERY = `
${prinzipCoreFields}
${paragraphFields}
${visualisationFields}
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
    GesetzStatus
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
        ...VisualisationFields
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

  if (regelungData.regelungsvorhabens.length === 0) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("No Regelung for slug found", { status: 404 });
  }

  return regelungData.regelungsvorhabens[0];
};

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
            content={{
              markdown: regulations.subtitle[0],
            }}
          />
          <p className="mt-24 ds-label-01-bold">
            <b>{regulations.subtitle[1]}</b>
          </p>
          <ol className="mt-16 list-none pl-0">
            {regelung.Digitalchecks.map((digitalcheck, index) => (
              <React.Fragment key={digitalcheck.documentId}>
                {digitalcheck.Paragraphen.length > 0 && (
                  <li>
                    ↓
                    <Link
                      to={`#${slugify(regulations.principles.title)}-${index}`}
                      className="ml-4 underline underline-offset-4 decoration-1"
                    >
                      {regulations.principles.title}
                    </Link>
                  </li>
                )}
                {digitalcheck.Visualisierungen.length > 0 && (
                  <li>
                    ↓
                    <Link
                      to={`#${slugify(regulations.visualisations.title)}-${index}`}
                      className="ml-4 underline underline-offset-4 decoration-1"
                    >
                      {regulations.visualisations.title}
                    </Link>
                  </li>
                )}
                {digitalcheck.NKRStellungnahmeDCText && (
                  <li>
                    ↓
                    <Link
                      to={`#${slugify(regulations.nkr.title)}-${index}`}
                      className="ml-4 underline underline-offset-4 decoration-1"
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
        <Container className="pt-0 pb-0">
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
                    {regelung?.GesetzStatus
                      ? gesetzStatusMap[regelung.GesetzStatus]
                      : regulations.infoLabels[1]}
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
      {regelung.Digitalchecks.some(
        (digitalcheck) => digitalcheck.Paragraphen.length > 0,
      ) &&
        regelung.GesetzStatus !== "Verkuendetes_Gesetz_aktuelle_Fassung" && (
          <Container className="pb-0">
            <InlineNotice
              title={regulations.infoTitle}
              look="tips"
              tagName="h2"
              content={regulations.infoText}
            />
          </Container>
        )}
      {regelung.Digitalchecks.map((digitalcheck, index) => (
        <Container key={digitalcheck.documentId} className="pb-80 ds-stack-64">
          {/* ----- Formulierungen / Prinziperfüllungen ----- */}
          {digitalcheck.Paragraphen.length > 0 && (
            <>
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
            </>
          )}

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
                <VisualisationItem
                  key={visualisierung.Bild.documentId}
                  visualisierung={visualisierung}
                />
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

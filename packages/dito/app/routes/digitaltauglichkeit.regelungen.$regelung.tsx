import Background from "@digitalcheck/shared/components/Background.tsx";
import Box from "@digitalcheck/shared/components/Box.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import Image from "@digitalcheck/shared/components/Image.tsx";
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
    Gesetz
    NKRNummer
    Digitalcheck {
      ...digitalcheck
    }
    NKRStellungnahmeText
    Rechtsgebiet
    Ressort
    Titel
    documentId
    URLBezeichnung
    VeroeffentlichungsDatum
    VorpruefungITSystem
    VorpruefungVerpflichtungen
    VorpruefungDatenaustausch
    VorpruefungKommunikation
    VorpruefungAutomatisierung
  }
}`;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.regelung as string;
  const regelungData = await fetchStrapiData<RegelungsvorhabenResponse>(
    GET_REGELUNGSVORHABENS_BY_SLUG_QUERY,
    { slug },
  );
  // TODO: can gesetze consist of more than one regelungsvorhaben?

  return json({
    regelung: regelungData?.data.regelungsvorhabens[0],
  });
};

// TODO: Decide on how we handle content which is not coming from cms. Still with content file?
export default function Gesetz() {
  const { regelung } = useLoaderData<{ regelung: Regelungsvorhaben }>();
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <h1>{regelung.Titel}</h1>
          <p className="mt-10">{regulations.subtitle[0]}</p>
          <p className="mt-24">
            <b>{regulations.subtitle[1]}</b>
          </p>
          <ol className="ds-stack-8 mt-16">
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
      <div>
        {regelung.Digitalcheck?.map((digitalcheck, index) => (
          <Container additionalClassNames="rich-text" key={index}>
            <h2>Digitalcheck {index + 1}</h2>
            {digitalcheck.Visualisierung && (
              <div>
                <h2 className="mb-10">Visualisierungen</h2>
                <p>
                  Diese Visualisierungen haben dem Referat geholfen,
                  Digitaltauglichkeit zu erstellen und den Sachverhalt zu
                  kommunizieren.
                </p>
                {digitalcheck.Visualisierung.map((visualisierung, index) => (
                  <div
                    className="flex max-sm:flex-col mt-40 gap-32"
                    key={visualisierung.Bild.documentId}
                  >
                    <div className="flex-1 max-sm:px-16 max-sm:pt-32">
                      <div className="border-2">
                        <Image
                          url={visualisierung.Bild.url}
                          alternativeText={`Visualisierung ${index} zum Regelungsvorhaben ${regelung.Titel}`}
                        />
                      </div>
                      <div className="bg-gray-100">
                        <Box></Box>
                        Art der Visualisierung:{" "}
                        <b>{visualisierung.VisualisierungsArt}</b>
                      </div>
                    </div>
                    <div className="flex-1">
                      <BlocksRenderer
                        content={visualisierung.Beschreibung}
                      ></BlocksRenderer>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/*            {Object.entries(digitalcheck).map(([key, value]) => (
              <PrinzipErfuellung
                key={`${key}-${index}`}
                prinzipErfuellung={value}
                showParagraphs={false}
              ></PrinzipErfuellung>
            ))}*/}
          </Container>
        ))}
      </div>
    </>
  );
}

import Background from "@digitalcheck/shared/components/Background.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { json, MetaFunction, useLoaderData } from "@remix-run/react";
import PrinzipErfuellung from "../components/PrinzipErfuellung.tsx";
import { ROUTE_LAWS } from "../resources/staticRoutes.ts";
import prependMetaTitle from "../utils/metaTitle.ts";
import {
  fetchStrapiData,
  prinzipErfuellung,
  prinzipienErfuellung,
  Regelungsvorhaben,
  RegelungsvorhabenResponse,
} from "../utils/strapiData.server.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_LAWS.title, matches);
};

const GET_REGELUNGSVORHABENS_BY_SLUG_QUERY = `
${prinzipErfuellung}
${prinzipienErfuellung}
query GetRegelungsvorhabens($slug: String!) {
  regelungsvorhabens(filters: { URLBezeichnung: { eq: $slug } }) {
    DIPVorgang
    Gesetz
    NKRNummer
    Prinzipienerfuellung {
      ...prinzipienErfuellung
    }
    NKRStellungnahme
    Rechtsgebiet
    Ressort
    Titel
    documentId
    URLBezeichnung
  }
}`;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.regelung as string;
  const regelungData = await fetchStrapiData<RegelungsvorhabenResponse>(
    GET_REGELUNGSVORHABENS_BY_SLUG_QUERY,
    { slug: slug },
  );
  // TODO: can gesetze consist of more than one regelungsvorhaben?
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
          <h1>{regelung.Titel}</h1>
        </Container>
      </Background>
      <div>
        {Object.entries(regelung.Prinzipienerfuellung).map(([key, value]) => (
          <PrinzipErfuellung
            key={key}
            prinzipErfuellung={value}
            showParagraphs={false}
          ></PrinzipErfuellung>
        ))}
      </div>
    </>
  );
}

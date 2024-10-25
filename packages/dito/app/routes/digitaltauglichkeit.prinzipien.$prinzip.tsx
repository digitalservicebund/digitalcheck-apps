import Container from "@digitalcheck/shared/components/Container.tsx";
import { json, Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import { type LoaderFunctionArgs } from "@remix-run/node";
import PrinzipErfuellung from "../components/PrinzipErfuellung.tsx";
import { ROUTE_LAWS } from "../resources/staticRoutes.ts";
import { type Prinzip } from "../utils/strapiData.server.ts";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const slug = params.prinzip as string;
  return json({ slug });
};

const prinzipToStrapi = {
  1: "DigitaleKommunikation",
  2: "Wiederverwendung",
  3: "Datenschutz",
  4: "KlareRegelungen",
  5: "Automatisierung",
} as const;

export default function Digitaltauglichkeit_Prinzipien_Detail() {
  const { slug } = useLoaderData<typeof loader>();
  const prinzips: Prinzip[] = useOutletContext();

  const prinzip = prinzips.find((prinzip) => prinzip.URLBezeichnung === slug);
  if (!prinzip) {
    throw new Response("Prinzip not found", { status: 404 });
  }

  const { Beschreibung, Name, Nummer, Tipps, GuteUmsetzung } = prinzip;

  return (
    <Container additionalClassNames="rich-text">
      Beschreibung: <BlocksRenderer content={Beschreibung}></BlocksRenderer>
      <p>Name: {Name}</p>
      <p>Nummer: {Nummer}</p>
      {Tipps && <BlocksRenderer content={Tipps}></BlocksRenderer>}
      <h2>Regelungen in der Umsetzung:</h2>
      {GuteUmsetzung.map((rv) => (
        <Container key={`${rv.Titel}-${rv.URLBezeichnung}`}>
          <b>{rv.Titel}</b> {rv.Gesetz ? "Gesetz" : "Kein Gesetz"}{" "}
          {rv.Rechtsgebiet} {rv.Ressort} {rv.URLBezeichnung}
          <Link
            to={`${ROUTE_LAWS.url}/${rv.URLBezeichnung}`}
            key={rv.URLBezeichnung}
          >
            {rv.URLBezeichnung}
          </Link>
          {rv.Digitalcheck?.map((digitalcheck, index) => (
            <PrinzipErfuellung
              key={`${rv.Titel}-${prinzip.Nummer}-${index}`}
              prinzipErfuellung={digitalcheck[prinzipToStrapi[prinzip.Nummer]]}
            ></PrinzipErfuellung>
          ))}
        </Container>
      ))}
    </Container>
  );
}

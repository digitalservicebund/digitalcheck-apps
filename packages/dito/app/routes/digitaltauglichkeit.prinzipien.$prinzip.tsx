import Container from "@digitalcheck/shared/components/Container.tsx";
import { json, Link, useLoaderData, useOutletContext } from "@remix-run/react";

import Background from "@digitalcheck/shared/components/Background.tsx";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
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

  const { GuteUmsetzung } = prinzip;

  return (
    <div>
      <Background backgroundColor="blue">
        <Container>
          <h1 className="mb-8">{prinzip.Name}</h1>
          {/*
          TODO: save and show the right Beschreibung
*/}
          <BlocksRenderer content={prinzip.Beschreibung}></BlocksRenderer>
        </Container>
      </Background>
      <Container additionalClassNames="rich-text">
        {/*      Beschreibung: <BlocksRenderer content={Beschreibung}></BlocksRenderer>
      <p>Name: {Name}</p>
      <p>Nummer: {Nummer}</p>
      {Tipps && <BlocksRenderer content={Tipp s}></BlocksRenderer>}
      <h2>Regelungen in der Umsetzung:</h2>*/}
        {GuteUmsetzung.map((rv) => (
          <div key={`${rv.Titel}-${rv.URLBezeichnung}`}>
            <Link
              to={`${ROUTE_LAWS.url}/${rv.URLBezeichnung}`}
              key={rv.URLBezeichnung}
            >
              {rv.Titel}
            </Link>
            <p className="my-24 bg-gray-100 pl-16">
              Rechtsbereich: <b>{rv.Rechtsgebiet}</b>
              <span className="mx-8"></span> Veröffentlicht am:{" "}
              <b>{rv.VeroeffentlichungsDatum?.toString()}</b>
            </p>
            {rv.Digitalcheck?.map(
              (digitalcheck, index) =>
                digitalcheck[prinzipToStrapi[prinzip.Nummer]].Paragraphen
                  .length > 0 && (
                  <PrinzipErfuellung
                    key={`${rv.Titel}-${prinzip.Nummer}-${index}`}
                    prinzipErfuellung={
                      digitalcheck[prinzipToStrapi[prinzip.Nummer]]
                    }
                  ></PrinzipErfuellung>
                ),
            )}
          </div>
        ))}
      </Container>
    </div>
  );
}

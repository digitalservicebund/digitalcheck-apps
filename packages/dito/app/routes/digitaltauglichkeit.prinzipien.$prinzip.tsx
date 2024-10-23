import Container from "@digitalcheck/shared/components/Container.tsx";
import { json, Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import { type LoaderFunctionArgs } from "@remix-run/node";
import PrinzipienErfuellung from "../components/PrinzipienErfuellung.tsx";
import { type Prinzip } from "../utils/strapiData.server.ts";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const slug = params.prinzip as string;
  return json({ slug });
};

export default function Digitaltauglichkeit_Prinzipien_Detail() {
  const { slug } = useLoaderData<typeof loader>();
  const prinzips: Prinzip[] = useOutletContext();
  const prinzip = prinzips.find((prinzip) => prinzip.URLBezeichnung === slug);
  if (!prinzip) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Prinzip not found", { status: 404 });
  }
  const { Beschreibung, Name, Nummer, Tipps, GuteUmsetzung } = prinzip;
  const prinzipToStrapi = {
    DigitaleKommunikation: "Digitale Kommunikation sicherstellen",
    Wiederverwendung: "Wiederverwendung von Daten und Standards ermöglichen",
    Datenschutz: "Datenschutz und Informationssicherheit gewährleisten",
    KlareRegelungen: "Klare Regelungen für eine digitale Ausführung finden",
    Automatisierung: "Automatisierung ermöglichen",
  };

  return (
    <>
      <Container additionalClassNames="rich-text">
        Beschreibung <BlocksRenderer content={Beschreibung}></BlocksRenderer>
        <br />
        Name: {Name}
        <br />
        Nummer: {Nummer}
        <br />
        {Tipps && <BlocksRenderer content={Tipps}></BlocksRenderer>}
        <br />
        <b>Regelungen in der Umsetzung:</b> <br />
        <br />
        {GuteUmsetzung.map((rv) => {
          const {
            Gesetz,
            Prinzipienerfuellung,
            Rechtsgebiet,
            Ressort,
            Titel,
            URLBezeichnung,
          } = rv;
          return (
            <Container key={Titel}>
              <b>{Titel}</b> {Gesetz ? "Gesetz" : "Kein Gesetz"} {Rechtsgebiet}{" "}
              {Ressort} {URLBezeichnung}{" "}
              <Link to={URLBezeichnung} key={URLBezeichnung}>
                {URLBezeichnung}
              </Link>
              <br />
              {(
                Object.keys(
                  Prinzipienerfuellung,
                ) as (keyof typeof Prinzipienerfuellung)[]
              )
                .filter((pe) => prinzip.Name === prinzipToStrapi[pe])
                .map((pe) => (
                  <PrinzipienErfuellung
                    key={pe}
                    prinzipienErfuellung={Prinzipienerfuellung[pe]}
                  ></PrinzipienErfuellung>
                ))}
            </Container>
          );
        })}
      </Container>
    </>
  );
}

import Container from "@digitalcheck/shared/components/Container.tsx";
import { json, Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import { type LoaderFunctionArgs } from "@remix-run/node";
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

  // TODO: filter prinzipienerfuellung for relevant prinzip
  return (
    <>
      <Container additionalClassNames="rich-text">
        <h2>All Properties:</h2>
        Beschreibung <BlocksRenderer content={Beschreibung}></BlocksRenderer>
        <br />
        Name: {Name}
        <br />
        Nummer: {Nummer}
        <br />
        {Tipps && <BlocksRenderer content={Tipps}></BlocksRenderer>}
        regelungsvorhaben:{" "}
        {GuteUmsetzung.map((rv) => {
          const {
            Gesetz,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Prinzipienerfuellung,
            Rechtsgebiet,
            Ressort,
            Titel,
            URLBezeichnung,
          } = rv;
          return (
            <Link to={URLBezeichnung} key={URLBezeichnung}>
              {Titel}
              {Gesetz ? "Gesetz" : "Kein Gesetz"}
              {Rechtsgebiet}
              {Ressort}
            </Link>
          );
        })}
      </Container>
    </>
  );
}

import Container from "@digitalcheck/shared/components/Container.tsx";
import { json, Link, useLoaderData, useOutletContext } from "@remix-run/react";

import Background from "@digitalcheck/shared/components/Background.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import TextRow from "@digitalcheck/shared/components/TextRow.tsx";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import PrinzipErfuellung from "../components/PrinzipErfuellung.tsx";
import { ROUTE_LAWS } from "../resources/staticRoutes.ts";
import { type Prinzip } from "../utils/strapiData.server.ts";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const slug = params.prinzip as string;
  return json({ slug });
};

export const prinzipToStrapi = {
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
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Prinzip not found", { status: 404 });
  }

  const { GuteUmsetzungen } = prinzip;

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Heading className="mb-8">{prinzip.Name}</Heading>
          <BlocksRenderer content={prinzip.Beschreibung}></BlocksRenderer>
        </Container>
      </Background>
      <Container additionalClassNames="rich-text">
        {GuteUmsetzungen.map((digitalcheck) => (
          <div
            key={`${digitalcheck.Regelungsvorhaben.Titel}-${digitalcheck.Regelungsvorhaben.URLBezeichnung}`}
            className="ds-stack-24"
          >
            <Link
              to={`${ROUTE_LAWS.url}/${digitalcheck.Regelungsvorhaben.URLBezeichnung}`}
              key={digitalcheck.Regelungsvorhaben.URLBezeichnung}
            >
              {digitalcheck.Regelungsvorhaben.Titel}
            </Link>
            <TextRow
              className="bg-blue-200"
              items={[
                {
                  label: "Rechtsbereich",
                  value: digitalcheck.Regelungsvorhaben.Rechtsgebiet,
                },
                {
                  label: "Veröffentlicht am",
                  value:
                    digitalcheck.Regelungsvorhaben.VeroeffentlichungsDatum?.toString(),
                },
              ]}
            />
            {digitalcheck.Paragraphen.map((paragraph) =>
              paragraph.Absaetze.map((absatz) => {
                const relevantErfuellung = absatz.PrinzipErfuellungen.find(
                  (erfuellung) =>
                    erfuellung.Prinzip === prinzipToStrapi[prinzip.Nummer],
                );
                return (
                  relevantErfuellung && (
                    <PrinzipErfuellung
                      key={relevantErfuellung.id}
                      paragraph={paragraph}
                      prinzipErfuellung={relevantErfuellung}
                      absatz={absatz}
                    />
                  )
                );
              }),
            )}
          </div>
        ))}
      </Container>
    </>
  );
}

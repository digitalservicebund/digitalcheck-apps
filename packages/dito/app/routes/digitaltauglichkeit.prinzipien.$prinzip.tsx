import Container from "@digitalcheck/shared/components/Container.tsx";
import { json, Link, useLoaderData, useOutletContext } from "@remix-run/react";

import Background from "@digitalcheck/shared/components/Background.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import InlineInfoList from "@digitalcheck/shared/components/InlineInfoList.tsx";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ParagraphView from "../components/ParagraphView.tsx";
import { ROUTE_LAWS } from "../resources/staticRoutes.ts";
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
          <div key={digitalcheck.documentId} className="ds-stack-24">
            <Link
              to={`${ROUTE_LAWS.url}/${digitalcheck.Regelungsvorhaben.URLBezeichnung}`}
            >
              {digitalcheck.Regelungsvorhaben.Titel}
            </Link>
            <InlineInfoList
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
            {digitalcheck.Paragraphen.map((paragraph) => (
              <ParagraphView
                key={paragraph.documentId}
                paragraph={paragraph}
                prinzip={prinzip.Kurzbezeichnung.Name}
              />
            ))}
          </div>
        ))}
      </Container>
    </>
  );
}

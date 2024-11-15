import Container from "@digitalcheck/shared/components/Container.tsx";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";

import Background from "@digitalcheck/shared/components/Background.tsx";
import Box from "@digitalcheck/shared/components/Box.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import InlineInfoList from "@digitalcheck/shared/components/InlineInfoList.tsx";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ParagraphList from "../components/ParagraphList.tsx";
import { ROUTE_LAWS } from "../resources/staticRoutes.ts";
import { type Prinzip } from "../utils/strapiData.server.ts";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const slug = params.prinzip as string;
  return { slug };
};

export default function Digitaltauglichkeit_Prinzipien_Detail() {
  const { slug } = useLoaderData<typeof loader>();
  const prinzips = useOutletContext<Prinzip[]>();

  const prinzip = prinzips.find((prinzip) => prinzip.URLBezeichnung === slug);
  if (!prinzip) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Prinzip not found", { status: 404 });
  }

  const { GuteUmsetzungen } = prinzip;

  return (
    <>
      <Background backgroundColor="blue">
        <Container paddingBottom="0">
          <Box
            label={{
              text: `Prinzip ${prinzip.Nummer} – ${prinzip.Name}`,
            }}
            heading={{
              text: `Prinzip ${prinzip.Nummer} in Regelungstexten`,
              tagName: "h1",
            }}
            additionalClassNames="mb-16"
          />
          <BlocksRenderer content={prinzip.Beschreibung}></BlocksRenderer>
        </Container>
        <Container additionalClassNames="flex space-x-20">
          {prinzips.map((p) =>
            prinzip.Nummer === p.Nummer ? (
              <div key={p.Nummer} className="ds-label-01-bold">
                Prinzip {p.Nummer}
              </div>
            ) : (
              <Link
                to={`../${p.URLBezeichnung}`}
                key={p.Nummer}
                className="ds-link-01-bold"
              >
                Prinzip {p.Nummer}
              </Link>
            ),
          )}
        </Container>
      </Background>
      <Container additionalClassNames="rich-text ds-stack-64">
        {GuteUmsetzungen.map((digitalcheck) => (
          <div key={digitalcheck.documentId}>
            <Link
              to={`${ROUTE_LAWS.url}/${digitalcheck.Regelungsvorhaben.URLBezeichnung}`}
            >
              <Heading
                tagName="h2"
                text={digitalcheck.Regelungsvorhaben.Titel}
                look="ds-heading-03-bold"
                className="max-w-full"
              />
            </Link>
            <InlineInfoList
              className="bg-blue-200 my-32"
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
            <ParagraphList
              paragraphs={digitalcheck.Paragraphen}
              principlesToShow={[prinzip]}
            />
          </div>
        ))}
      </Container>
    </>
  );
}

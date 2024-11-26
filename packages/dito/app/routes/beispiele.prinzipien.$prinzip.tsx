import Container from "@digitalcheck/shared/components/Container.tsx";
import {
  Link,
  MetaFunction,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";

import Background from "@digitalcheck/shared/components/Background.tsx";
import Box from "@digitalcheck/shared/components/Box.tsx";
import CustomLink from "@digitalcheck/shared/components/CustomLink.tsx";
import Heading from "@digitalcheck/shared/components/Heading.tsx";
import InlineInfoList from "@digitalcheck/shared/components/InlineInfoList.tsx";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { regulations } from "resources/content.ts";
import prependMetaTitle from "utils/metaTitle.ts";
import ParagraphList from "../components/ParagraphList.tsx";

import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";
import { ROUTE_LAWS, ROUTE_PRINCIPLES } from "../resources/staticRoutes.ts";
import { type Prinzip } from "../utils/strapiData.server.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_PRINCIPLES.title, matches);
};

export const loader = ({ params }: LoaderFunctionArgs) => {
  return { slug: params.prinzip as string };
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
        <Container additionalClassNames="flex space-x-20 items-center">
          {prinzips.map((p) =>
            prinzip.Nummer === p.Nummer ? (
              <div key={p.Nummer} className="ds-label-01-bold">
                Prinzip {p.Nummer}
              </div>
            ) : (
              <Link
                to={`${ROUTE_PRINCIPLES.url}/${p.URLBezeichnung}`}
                key={p.Nummer}
                className="ds-link-01-bold"
              >
                Prinzip {p.Nummer}
              </Link>
            ),
          )}
        </Container>
      </Background>
      {GuteUmsetzungen.length > 0 && (
        <Container additionalClassNames="rich-text ds-stack-64">
          {GuteUmsetzungen.map((digitalcheck) => (
            <div key={digitalcheck.documentId}>
              <Link
                target="_blank"
                to={`${ROUTE_LAWS.url}/${digitalcheck.Regelungsvorhaben.URLBezeichnung}`}
                rel="noreferrer"
              >
                <Heading
                  tagName="h2"
                  text={digitalcheck.Regelungsvorhaben.Titel}
                  look="ds-heading-03-bold"
                  className="inline max-w-full"
                />
                <OpenInNewIcon
                  height="1.2em"
                  width="1.2em"
                  className="!inline ml-[0.2em] mb-1"
                />
              </Link>
              <InlineInfoList
                className="bg-blue-200 my-32"
                items={[
                  {
                    label: regulations.infoLabels[0],
                    value: digitalcheck.Regelungsvorhaben
                      .VeroeffentlichungsDatum
                      ? new Intl.DateTimeFormat("de-DE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }).format(
                          new Date(
                            digitalcheck.Regelungsvorhaben.VeroeffentlichungsDatum,
                          ),
                        )
                      : "",
                  },
                  {
                    label: regulations.infoLabels[1],
                    value: digitalcheck.Regelungsvorhaben.LinkRegelungstext ? (
                      <CustomLink
                        to={digitalcheck.Regelungsvorhaben.LinkRegelungstext}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-800 underline"
                      >
                        Gesetzestext
                      </CustomLink>
                    ) : null,
                  },
                  {
                    label: regulations.infoLabels[2],
                    value: digitalcheck.Regelungsvorhaben.Ressort,
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
      )}
      <div className="my-40">
        <Container backgroundColor="blue" overhangingBackground>
          <Box
            heading={{
              text: regulations.yourRegulation.title,
              tagName: "h2",
            }}
            content={{ markdown: regulations.yourRegulation.text }}
          />
        </Container>
      </div>
    </>
  );
}
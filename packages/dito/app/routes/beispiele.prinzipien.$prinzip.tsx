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
import {
  fetchStrapiData,
  paragraphFields,
  type Prinzip,
  prinzipCoreFields,
} from "../utils/strapiData.server.ts";
import { formatDate } from "../utils/utilFunctions.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_PRINCIPLES.title, matches);
};

const GET_PRINZIPS_QUERY = `
${paragraphFields}
${prinzipCoreFields}
query GetPrinzips($slug: String!) {
  prinzips(filters: { URLBezeichnung: { eq: $slug } }) {
    ...PrinzipCoreFields
    GuteUmsetzungen {
      documentId
      Paragraphen {
        ...ParagraphFields
      }
      Regelungsvorhaben {
        documentId
        Ressort
        Rechtsgebiet
        Titel
        URLBezeichnung
        LinkRegelungstext
        VeroeffentlichungsDatum
      }
    }
  }
}`;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const prinzipData = await fetchStrapiData<{ prinzips: Prinzip[] }>(
    GET_PRINZIPS_QUERY,
    { slug: params.prinzip as string },
  );

  if ("error" in prinzipData) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(prinzipData.error, { status: 400 });
  }

  if (prinzipData.prinzips.length === 0) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("No Prinzip for slug found", { status: 404 });
  }

  return { prinzip: prinzipData.prinzips[0] };
};

export default function Digitaltauglichkeit_Prinzipien_Detail() {
  const { prinzip } = useLoaderData<typeof loader>();
  const prinzips = useOutletContext<Prinzip[]>();

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
                prefetch="viewport"
              >
                Prinzip {p.Nummer}
              </Link>
            ),
          )}
        </Container>
      </Background>
      {GuteUmsetzungen.length > 0 && (
        <Container additionalClassNames="rich-text ds-stack-64">
          {GuteUmsetzungen.map(
            (digitalcheck) =>
              digitalcheck.Regelungsvorhaben && (
                <div
                  key={digitalcheck.documentId}
                  data-testid="regelung-on-prinzip"
                >
                  <Link
                    target="_blank"
                    to={`${ROUTE_LAWS.url}/${digitalcheck.Regelungsvorhaben.URLBezeichnung}`}
                    rel="noreferrer"
                    prefetch="viewport"
                  >
                    <Heading
                      tagName="h2"
                      text={digitalcheck.Regelungsvorhaben.Titel}
                      look="ds-heading-03-bold"
                      className="inline max-w-full"
                    />
                    <OpenInNewIcon className="!inline scale-90 ml-4 mb-6 fill-blue-800" />
                  </Link>
                  <InlineInfoList
                    className="my-32 pl-16"
                    items={[
                      {
                        label: regulations.infoLabels[0],
                        value: digitalcheck.Regelungsvorhaben
                          .VeroeffentlichungsDatum
                          ? formatDate(
                              digitalcheck.Regelungsvorhaben
                                .VeroeffentlichungsDatum,
                            )
                          : "",
                      },
                      {
                        key: regulations.infoLabels[1],
                        value: digitalcheck.Regelungsvorhaben
                          .LinkRegelungstext ? (
                          <CustomLink
                            to={
                              digitalcheck.Regelungsvorhaben.LinkRegelungstext
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-800 underline"
                          >
                            {regulations.infoLabels[1]}
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
              ),
          )}
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

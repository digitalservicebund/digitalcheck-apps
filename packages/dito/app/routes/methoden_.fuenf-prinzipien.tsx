import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  MetaFunction,
  PrefetchPageLinks,
  useLoaderData,
} from "@remix-run/react";
import { fivePrinciples } from "resources/content";
import {
  ROUTE_EXAMPLES,
  ROUTE_METHODS,
  ROUTE_METHODS_FIVE_PRINCIPLES,
  ROUTE_PRINCIPLES,
} from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";
import SupportBanner from "../components/SupportBanner.tsx";
import {
  fetchStrapiData,
  GET_PRINZIPS_QUERY,
  Prinzip,
} from "../utils/strapiData.server.ts";
import { slugify } from "../utils/utilFunctions.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_METHODS_FIVE_PRINCIPLES.title, matches);
};

export async function loader({ request }: LoaderFunctionArgs) {
  const referer = request.headers.get("referer");
  let pathname = "/";

  if (referer) {
    pathname = new URL(referer).pathname;
  }

  const prinzipData = await fetchStrapiData<{ prinzips: Prinzip[] }>(
    GET_PRINZIPS_QUERY,
  );

  if ("error" in prinzipData) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(prinzipData.error, { status: 400 });
  }

  return {
    referrer: pathname,
    prinzips: prinzipData.prinzips,
  };
}

export default function Index() {
  const { referrer, prinzips } = useLoaderData<typeof loader>();
  console.log(prinzips);

  const nextStep = referrer.startsWith(ROUTE_METHODS.url)
    ? fivePrinciples.nextStepMethods
    : fivePrinciples.nextStep;

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: referrer.startsWith(ROUTE_METHODS.url)
                ? `2.4. ${fivePrinciples.title}`
                : fivePrinciples.title,
            }}
          />
          <div className="mt-64">
            <Heading tagName="div" text="Inhalt" className="font-bold" />
            <ol className="ds-stack-8 mt-16">
              {fivePrinciples.principles.map((principle) => (
                <li key={principle.label}>
                  <Link
                    to={`#${slugify(principle.label)}`}
                    className="underline underline-offset-4 decoration-1"
                  >
                    ↓ {principle.label}: {principle.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Background>
      {fivePrinciples.principles.map((principle, index) => {
        const prinzip = prinzips.find(
          (principle) => principle.Nummer === index,
        );
        const buttonLink = prinzip
          ? `${ROUTE_PRINCIPLES.url}/${prinzip?.URLBezeichnung}`
          : ROUTE_EXAMPLES.url;
        const label = slugify(principle.label);
        return (
          <Background
            key={label}
            backgroundColor={index % 2 === 0 ? "white" : "blue"}
          >
            <div id={label} />
            <Container>
              <InfoBox
                heading={{
                  tagName: "h2",
                  text: principle.title,
                }}
                label={{
                  tagName: "div",
                  text: principle.label,
                  className: "ds-label-section text-gray-900",
                }}
                items={[
                  {
                    content: principle.content,
                    buttons: [
                      {
                        text: "Beispiele betrachten",
                        href: buttonLink,
                        look: "tertiary" as const,
                      },
                    ],
                  },
                ]}
              />
              {/* The button prop does not support prefetching, so we are using the PrefetchPageLinks component instead */}
              <PrefetchPageLinks page={buttonLink} />
            </Container>
          </Background>
        );
      })}
      <Container>
        <Box
          heading={{ text: nextStep.title }}
          label={{ text: nextStep.label }}
          content={{ markdown: nextStep.text }}
          buttons={nextStep.buttons}
        />
      </Container>
      <SupportBanner />
    </>
  );
}

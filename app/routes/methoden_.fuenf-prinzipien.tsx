import { type MetaArgs, useLoaderData } from "react-router";
import Background from "~/components/Background";
import Box from "~/components/Box";
import Container from "~/components/Container";
import Header from "~/components/Header";
import InfoBox from "~/components/InfoBox";
import LinkListBox from "~/components/LinkListBox";
import SupportBanner from "~/components/SupportBanner";
import { fivePrinciples } from "~/resources/content";
import {
  ROUTE_EXAMPLES,
  ROUTE_METHODS,
  ROUTE_METHODS_FIVE_PRINCIPLES,
  ROUTE_PRINCIPLES,
} from "~/resources/staticRoutes";
import prependMetaTitle from "~/utils/metaTitle";
import {
  fetchStrapiData,
  GET_PRINZIPS_QUERY,
  Prinzip,
} from "~/utils/strapiData.server";
import { slugify } from "~/utils/utilFunctions";
import type { Route } from "./+types/methoden_.fuenf-prinzipien";

export const meta = ({ matches }: MetaArgs) => {
  return prependMetaTitle(ROUTE_METHODS_FIVE_PRINCIPLES.title, matches);
};

export async function loader({ request }: Route.LoaderArgs) {
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

export default function FivePrinciples() {
  const { referrer, prinzips } = useLoaderData<typeof loader>();

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
          <LinkListBox
            links={fivePrinciples.principles.map((principle) => {
              return {
                id: slugify(principle.label),
                title: `${principle.label}: ${principle.title}`,
              };
            })}
          />
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
                        text: fivePrinciples.buttonText,
                        href: buttonLink,
                        prefetch: "viewport",
                        look: "tertiary" as const,
                        "aria-label":
                          index > 0
                            ? `Beispiele für "${principle.label}: ${principle.title}" betrachten`
                            : "Alle Beispiele betrachten",
                      },
                    ],
                  },
                ]}
              />
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

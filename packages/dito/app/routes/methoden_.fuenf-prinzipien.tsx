import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { fivePrinciples } from "resources/content";
import {
  ROUTE_METHODS,
  ROUTE_METHODS_FIVE_PRINCIPLES,
} from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";
import SupportBanner from "../components/SupportBanner.tsx";
import { slugify } from "../utils/utilFunctions.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_METHODS_FIVE_PRINCIPLES.title, matches);
};

export function loader({ request }: LoaderFunctionArgs) {
  const referer = request.headers.get("referer");
  let pathname = "/";

  if (referer) {
    pathname = new URL(referer).pathname;
  }

  return json({
    referrer: pathname,
  });
}

export default function Index() {
  const { referrer } = useLoaderData<typeof loader>();

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
              {fivePrinciples.principles.map((principal) => (
                <li key={principal.label}>
                  <Link
                    to={`#${slugify(principal.label)}`}
                    className="underline underline-offset-4 decoration-1"
                  >
                    ↓ {principal.label}: {principal.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Background>
      {fivePrinciples.principles.map((principal, index) => (
        <Background
          key={principal.content}
          backgroundColor={index % 2 === 0 ? "white" : "blue"}
        >
          <div id={slugify(principal.label)} />
          <Container>
            <InfoBox
              heading={{
                tagName: "h2",
                text: principal.title,
              }}
              label={{
                tagName: "div",
                text: principal.label,
                className: "ds-label-section text-gray-900",
              }}
              items={[{ content: principal.content }]}
            />
          </Container>
        </Background>
      ))}
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

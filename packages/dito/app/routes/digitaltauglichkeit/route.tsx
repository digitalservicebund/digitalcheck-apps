import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box.tsx";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import RichText from "@digitalcheck/shared/components/RichText";
import { json, redirect } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import React from "react";
import { digitalSuitability, header } from "resources/content";
import {
  ROUTE_DIGITAL_SUITABILITY,
  ROUTE_LANDING,
} from "resources/staticRoutes";
import unleash from "utils/featureFlags.server";
import prependMetaTitle from "utils/metaTitle";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_DIGITAL_SUITABILITY.title, matches);
};

export function loader() {
  const digitalSuitabilityFlag = unleash.isEnabled(
    "digitalcheck.digital-suitability",
  );
  console.log(digitalSuitabilityFlag);

  if (!digitalSuitabilityFlag) {
    // Redirect to the homepage flag is off
    return redirect(ROUTE_LANDING.url);
  }

  return json({}); // proceed normally if the flag is on
}

export default function Digitaltauglichkeit() {
  useLoaderData();
  return (
    <>
      <Background backgroundColor="darkBlue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: digitalSuitability.title,
            }}
            content={{
              markdown: digitalSuitability.subtitle,
              className: "md:text-2xl",
            }}
          ></Header>
        </Container>
      </Background>
      <Background backgroundColor="yellow">
        <Container paddingTop="10" paddingBottom="10">
          <RichText markdown={header.underConstruction}></RichText>
        </Container>
      </Background>
      <Container>
        {digitalSuitability.boxItems.map((item, index) => (
          <React.Fragment key={index}>
            <Box
              key={index}
              heading={{
                tagName: "h2",
                text: item.title,
              }}
              content={{ markdown: item.content }}
              buttons={item.buttons}
            />
            <div className="mt-56" />
          </React.Fragment>
        ))}
      </Container>
    </>
  );
}

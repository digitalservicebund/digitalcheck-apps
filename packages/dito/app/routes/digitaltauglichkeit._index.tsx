import Background from "@digitalcheck/shared/components/Background.tsx";
import Box from "@digitalcheck/shared/components/Box.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import RichText from "@digitalcheck/shared/components/RichText.tsx";
import { json, redirect } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import React from "react";
import { digitalSuitability, header } from "../resources/content.ts";
import {
  ROUTE_DIGITAL_SUITABILITY,
  ROUTE_LANDING,
} from "../resources/staticRoutes.ts";
import unleash from "../utils/featureFlags.server.ts";
import prependMetaTitle from "../utils/metaTitle.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_DIGITAL_SUITABILITY.title, matches);
};

export function loader() {
  const digitalSuitabilityFlag = unleash.isEnabled(
    "digitalcheck.digital-suitability",
  );

  if (!digitalSuitabilityFlag) {
    return redirect(ROUTE_LANDING.url);
  }

  return json({});
}

export default function Digitaltauglichkeit_index() {
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

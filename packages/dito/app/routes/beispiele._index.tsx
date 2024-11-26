import Background from "@digitalcheck/shared/components/Background.tsx";
import Box from "@digitalcheck/shared/components/Box.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import RichText from "@digitalcheck/shared/components/RichText.tsx";
import { MetaFunction, useOutletContext } from "@remix-run/react";
import { Prinzip } from "utils/strapiData.server.ts";
import { digitalSuitability, header } from "../resources/content.ts";
import { ROUTE_EXAMPLES, ROUTE_PRINCIPLES } from "../resources/staticRoutes.ts";
import prependMetaTitle from "../utils/metaTitle.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_EXAMPLES.title, matches);
};

export default function Digitaltauglichkeit_index() {
  const principles = useOutletContext<Prinzip[]>();
  return (
    <>
      <Background backgroundColor="darkBlue" paddingTop="24" paddingBottom="24">
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
        {digitalSuitability.boxItems.map((item) => (
          <Box
            key={item.title}
            heading={{
              tagName: "h2",
              text: item.title,
            }}
            content={{ markdown: item.content }}
            buttons={principles
              .toSorted((a, b) => a.Nummer - b.Nummer)
              .map((principle) => ({
                text: `Prinzip ${principle.Nummer} – ${principle.Name}`,
                href: ROUTE_PRINCIPLES.url + "/" + principle.URLBezeichnung,
                look: "ghost" as const,
                className: "mr-16 ds-link-01-bold", // The margin is used as a hack to force all links on a new line without using w-full
              }))}
            additionalClassNames="mb-56"
          />
        ))}
      </Container>
    </>
  );
}

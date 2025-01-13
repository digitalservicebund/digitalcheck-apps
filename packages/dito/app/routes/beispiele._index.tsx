import Background from "@digitalcheck/shared/components/Background.tsx";
import Box from "@digitalcheck/shared/components/Box.tsx";
import Container from "@digitalcheck/shared/components/Container.tsx";
import Header from "@digitalcheck/shared/components/Header.tsx";
import {
  MetaFunction,
  PrefetchPageLinks,
  useOutletContext,
} from "@remix-run/react";
import { digitalSuitability } from "resources/content.ts";
import {
  ROUTE_EXAMPLES,
  ROUTE_PRINCIPLES,
  ROUTE_VISUALISATIONS,
} from "resources/staticRoutes.ts";
import prependMetaTitle from "utils/metaTitle.ts";
import { Prinzip } from "utils/strapiData.server.ts";

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_EXAMPLES.title, matches);
};

export default function Digitaltauglichkeit_index() {
  const principles = useOutletContext<Prinzip[]>().toSorted(
    (a, b) => a.Nummer - b.Nummer,
  );
  return (
    <>
      <Background backgroundColor="darkBlue" className="pt-24 pb-24">
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
      <Container>
        {digitalSuitability.boxItems.map((item) => (
          <Box
            className="pb-64"
            key={item.title}
            heading={{
              tagName: "h2",
              text: item.title,
            }}
            content={{ markdown: item.content }}
            buttons={
              item.buttons[0].href == ROUTE_PRINCIPLES.url
                ? [
                    {
                      ...item.buttons[0],
                      href: `${ROUTE_PRINCIPLES.url}/${principles[0].URLBezeichnung}`,
                    },
                  ]
                : item.buttons
            }
          />
        ))}
        {/* The button prop does not support prefetching, so we are using the PrefetchPageLinks component instead */}
        {principles.map((principle) => (
          <PrefetchPageLinks
            key={principle.Nummer}
            page={`${ROUTE_PRINCIPLES.url}/${principle.URLBezeichnung}`}
          />
        ))}
        <PrefetchPageLinks
          key={ROUTE_VISUALISATIONS.title}
          page={ROUTE_VISUALISATIONS.url}
        />
      </Container>
    </>
  );
}

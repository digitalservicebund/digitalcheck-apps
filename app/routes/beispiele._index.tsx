import { useOutletContext, type MetaArgs } from "react-router";

import Background from "~/components/Background";
import Box from "~/components/Box";
import Container from "~/components/Container";
import Header from "~/components/Header";
import { digitalSuitability } from "~/resources/content";
import { ROUTE_EXAMPLES, ROUTE_PRINCIPLES } from "~/resources/staticRoutes";
import prependMetaTitle from "~/utils/metaTitle";
import { Prinzip } from "~/utils/strapiData.server";

export const meta = ({ matches }: MetaArgs) => {
  return prependMetaTitle(ROUTE_EXAMPLES.title, matches);
};

export default function Digitaltauglichkeit_index() {
  const principles = useOutletContext<Prinzip[]>().toSorted(
    (a, b) => a.Nummer - b.Nummer,
  );
  return (
    <>
      <Background backgroundColor="darkBlue" className="py-24">
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
                      prefetch: "viewport",
                    },
                  ]
                : item.buttons
            }
          />
        ))}
      </Container>
    </>
  );
}

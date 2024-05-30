import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import type { MetaFunction } from "@remix-run/node";
import NumberedList from "components/NumberedList";
import { landing, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [
    { title: siteMeta.title },
    {
      name: "description",
      content: siteMeta.description,
    },
  ];
};

export default function Index() {
  return (
    <main>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: landing.title,
            }}
            content={{
              markdown: landing.subtitle,
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <NumberedList
          title={landing.list.title}
          listItems={landing.list.items}
        />
      </Container>
      <Background backgroundColor="blue">
        <Container>
          <Box
            heading={{
              tagName: "h3",
              text: landing.explanation.title,
            }}
            content={{
              markdown: landing.explanation.text,
            }}
          ></Box>
        </Container>
      </Background>
    </main>
  );
}

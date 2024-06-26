import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import List from "@digitalcheck/shared/components/List";
import { MetaFunction } from "@remix-run/react";
import { landing, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${landing.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
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
        <List
          heading={{
            tagName: "h2",
            text: landing.list.title,
          }}
          items={landing.list.items}
          isNumeric
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
    </>
  );
}

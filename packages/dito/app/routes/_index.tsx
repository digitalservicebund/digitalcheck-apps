import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import List from "@digitalcheck/shared/components/List";
import { landing } from "resources/content";

export default function Index() {
  const listItems = landing.list.items.map((item) => ({
    headline: {
      tagName: "h3",
      text: item.title,
    },
    content: item.text,
    buttons: item.link && [
      {
        text: item.link.text,
        href: item.link.url,
      },
    ],
  }));
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
          items={listItems}
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

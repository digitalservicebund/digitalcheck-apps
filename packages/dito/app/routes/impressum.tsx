import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import RichText from "@digitalcheck/shared/components/RichText";
import { MetaFunction } from "@remix-run/react";
import { imprint, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${imprint.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: imprint.title,
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <RichText markdown={imprint.content} />
      </Container>
    </>
  );
}

import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import RichText from "@digitalcheck/shared/components/RichText";
import { MetaFunction } from "@remix-run/react";
import { privacy, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${privacy.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: privacy.title,
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <RichText markdown={privacy.content} />
      </Container>
    </>
  );
}

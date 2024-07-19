import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import RichText from "@digitalcheck/shared/components/RichText";
import { MetaFunction } from "@remix-run/react";
import { imprint, siteMeta } from "resources/content";
import { ROUTE_IMPRINT } from "resources/staticRoutes";

export const meta: MetaFunction = () => {
  return [{ title: `${ROUTE_IMPRINT.title} — ${siteMeta.title}` }];
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

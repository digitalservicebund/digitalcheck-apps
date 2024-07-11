import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { responsibleActors, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${responsibleActors.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: responsibleActors.title,
            }}
            content={{
              markdown: responsibleActors.subtitle,
            }}
          ></Header>
        </Container>
      </Background>

      <FeedbackBanner />
    </>
  );
}

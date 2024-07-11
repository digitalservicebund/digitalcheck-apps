import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { siteMeta, technicalFeasibility } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${technicalFeasibility.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: technicalFeasibility.title,
            }}
            content={{
              markdown: technicalFeasibility.subtitle,
            }}
          ></Header>
        </Container>
      </Background>

      <FeedbackBanner />
    </>
  );
}

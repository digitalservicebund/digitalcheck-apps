import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { collectITSystems, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${collectITSystems.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: collectITSystems.title,
            }}
            content={{
              markdown: collectITSystems.content,
            }}
          ></Header>
        </Container>
      </Background>

      <FeedbackBanner />
    </>
  );
}

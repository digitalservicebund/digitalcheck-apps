import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import List from "@digitalcheck/shared/components/List";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { methods, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${methods.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: methods.title,
            }}
            content={{
              markdown: methods.subtitle,
            }}
          ></Header>
        </Container>
      </Background>
      <Container>
        <List items={methods.steps.items} />
      </Container>
      <Container>
        <List
          heading={{
            tagName: "h2",
            text: methods.nextSteps.title,
          }}
          items={methods.nextSteps.items}
          isNumeric
        />
      </Container>
      <FeedbackBanner />
    </>
  );
}

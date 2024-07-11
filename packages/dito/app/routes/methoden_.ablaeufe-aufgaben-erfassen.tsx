import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { siteMeta, tasksProcesses } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${tasksProcesses.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: tasksProcesses.title,
            }}
            content={{
              markdown: tasksProcesses.subtitle,
            }}
          ></Header>
        </Container>
      </Background>

      <FeedbackBanner />
    </>
  );
}

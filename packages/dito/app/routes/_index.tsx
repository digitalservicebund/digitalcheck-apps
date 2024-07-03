import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import List from "@digitalcheck/shared/components/List";
import RichText from "@digitalcheck/shared/components/RichText";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { header, landing, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${landing.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="darkBlue" paddingTop="24" paddingBottom="24">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: landing.title,
            }}
            content={{
              markdown: landing.subtitle,
              className: "rich-text-2xl",
            }}
          ></Header>
        </Container>
      </Background>
      <Background backgroundColor="yellow">
        <Container paddingTop="10" paddingBottom="10">
          <RichText markdown={header.underConstruction}></RichText>
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
      <Container>
        <InlineNotice
          look="warning"
          title={landing.dataNotice.headline}
          tagName="h2"
          content={landing.dataNotice.content}
        ></InlineNotice>
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
      <FeedbackBanner />
    </>
  );
}

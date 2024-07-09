import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
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
              className: "rich-text-2xl max-sm:rich-text",
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
        />
      </Container>
      {/* TODO: Add in case study here, if & when we have one... */}
      <Container>
        <InfoBox
          heading={{
            tagName: "h2",
            text: landing.summary.title,
          }}
          items={landing.summary.items}
        />
      </Container>
      <FeedbackBanner />
      <Background backgroundColor="darkBlue" paddingTop="24" paddingBottom="24">
        <Container>
          <div className="ds-stack-16 scroll-my-40">
            <Heading tagName="h3" text={landing.principals.title} />
            <RichText
              markdown={landing.principals.content}
              className="!mt-32 !ds-stack-16
              [&_ol]:mb-16
              [&_ol_li+li]:mt-8
              [&_ol_li+li:before]:content-['']
              [&_ol_li+li:before]:block
              [&_ol_li+li:before]:w-1/2
              [&_ol_li+li:before]:mb-8
              [&_ol_li+li:before]:border-t
              [&_ol_li+li:before]:border-blue-700
              "
              // These strange class names are because we are using the Tailwind "arbitrary values" feature to style the list inside this RichText block: https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants
            />
          </div>
        </Container>
      </Background>
    </>
  );
}

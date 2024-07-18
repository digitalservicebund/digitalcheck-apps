import Background from "@digitalcheck/shared/components/Background";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import List from "@digitalcheck/shared/components/List";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { documentation, siteMeta } from "resources/content";

export const meta: MetaFunction = () => {
  return [{ title: `${documentation.title} — ${siteMeta.title}` }];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: documentation.title,
            }}
            content={{
              markdown: documentation.subtitle,
              className: "md:text-2xl",
            }}
          />
          <ButtonContainer className="mt-48">
            {documentation.buttons.map((button) => (
              <Button key={button.text} {...button} />
            ))}
          </ButtonContainer>
        </Container>
      </Background>
      <Container additionalClassNames="max-sm:!p-0">
        <InlineNotice
          look="warning"
          title={documentation.multipleNotice.headline}
          tagName="h2"
          content={documentation.multipleNotice.content}
        />
      </Container>
      <Container>
        <InfoBox
          heading={{
            tagName: "h2",
            text: documentation.summary.title,
          }}
          items={documentation.summary.items}
        />
      </Container>
      <Container>
        <List
          heading={{
            tagName: "h2",
            text: documentation.nextSteps.title,
          }}
          items={documentation.nextSteps.items}
          isNumeric
        />
      </Container>
      <FeedbackBanner />
    </>
  );
}

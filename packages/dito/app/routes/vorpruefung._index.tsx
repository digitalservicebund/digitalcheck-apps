import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { preCheck } from "resources/content";
import { ROUTE_LANDING, ROUTE_PRECHECK } from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";

export const meta: MetaFunction = ({ matches }) => {
  return [prependMetaTitle(ROUTE_PRECHECK.title, matches)];
};

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container
          paddingTop="64"
          paddingBottom="56"
          additionalClassNames="max-sm:!py-32"
        >
          <Box
            heading={{
              tagName: "h1",
              text: preCheck.start.title,
            }}
            content={{
              markdown: preCheck.start.subtitle,
              className: "md:text-2xl",
            }}
          ></Box>
        </Container>
        <Container paddingTop="0">
          <ButtonContainer>
            <Button
              id="preCheck-start-button"
              text={preCheck.start.buttonText}
              href={preCheck.questions[0].url}
              type="submit"
            ></Button>
            <Button
              id="preCheck-back-button"
              text="Zurück"
              href={ROUTE_LANDING.url}
              look="tertiary"
            ></Button>
          </ButtonContainer>
        </Container>
      </Background>
      <Container additionalClassNames="max-sm:!p-0">
        <InlineNotice
          look="warning"
          title={preCheck.start.info.title}
          tagName="h2"
          content={preCheck.start.info.text}
        ></InlineNotice>
      </Container>
      <Container>
        <InfoBox
          heading={{
            text: preCheck.start.summary.title,
            tagName: "h2",
          }}
          items={preCheck.start.summary.items}
        ></InfoBox>
      </Container>
      <FeedbackBanner />
    </>
  );
}

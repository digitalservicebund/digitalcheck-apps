import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InfoBox from "@digitalcheck/shared/components/InfoBox";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { MetaFunction } from "@remix-run/react";
import FeedbackBanner from "components/FeedbackBanner";
import { getAnswersFromCookie, getHeaderFromCookie } from "cookies.server";
import { preCheck, siteMeta } from "resources/content";
import { PATH_LANDING } from "resources/staticRoutes";

export const meta: MetaFunction = () => {
  return [{ title: `${preCheck.start.title} — ${siteMeta.title}` }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = await getAnswersFromCookie(request);
  // reset cookie if the user accesses the start page
  cookie.answers = {};
  return json({}, await getHeaderFromCookie(cookie));
}

export default function Index() {
  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Box
            heading={{
              tagName: "h1",
              text: preCheck.start.title,
            }}
            content={{
              markdown: preCheck.start.subtitle,
            }}
          ></Box>
        </Container>
        <Container paddingTop="0">
          <ButtonContainer>
            <Button
              id="preCheck-start-button"
              text={preCheck.start.buttonText}
              href={preCheck.questions[0].url}
              size="large"
              type="submit"
            ></Button>
            <Button
              id="preCheck-back-button"
              text="Zurück"
              href={PATH_LANDING}
              size="large"
              look="tertiary"
            ></Button>
          </ButtonContainer>
        </Container>
      </Background>
      <Container>
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

import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getAnswersFromCookie, getHeaderFromCookie } from "cookies.server";
import { preCheck } from "resources/content";
import { PATH_LANDING } from "resources/staticRoutes";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = await getAnswersFromCookie(request);
  // reset cookie if the user accesses the start page
  cookie.answers = {};
  return json({}, await getHeaderFromCookie(cookie));
}

export default function Index() {
  return (
    <>
      <Container paddingBottom="0">
        <Box
          heading={{
            tagName: "h1",
            text: preCheck.start.title,
            look: "ds-heading-02-reg",
          }}
          content={{
            markdown: preCheck.start.subtitle,
          }}
        ></Box>
      </Container>
      <Container paddingBottom="0">
        <ButtonContainer>
          <Button
            id="preCheck-back-button"
            text="Zurück"
            href={PATH_LANDING}
            look="tertiary"
          ></Button>
          <Button
            id="preCheck-start-button"
            text={preCheck.start.buttonText}
            href={preCheck.questions[0].url}
            type="submit"
          ></Button>
        </ButtonContainer>
      </Container>
      <Container>
        <InlineNotice
          look="tips"
          title={preCheck.start.hint.title}
          tagName="h2"
          content={preCheck.start.hint.text}
        ></InlineNotice>
      </Container>
    </>
  );
}

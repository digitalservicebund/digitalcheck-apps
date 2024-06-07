import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getAnswersFromCookie, userAnswers } from "cookies.server";
import { precheck } from "resources/content";
import { PATH_LANDING } from "resources/staticRoutes";

export async function action({ request }: ActionFunctionArgs) {
  const cookie = await getAnswersFromCookie(request);
  cookie.answers = {};

  return redirect(precheck.questions[0].url, {
    headers: {
      "Set-Cookie": await userAnswers.serialize(cookie),
    },
  });
}

export default function Index() {
  return (
    <>
      <Container paddingBottom="0">
        <Box
          heading={{
            tagName: "h1",
            text: precheck.start.title,
            look: "ds-heading-02-reg",
          }}
          content={{
            markdown: precheck.start.subtitle,
          }}
        ></Box>
      </Container>
      <Container paddingBottom="0">
        <ButtonContainer>
          <Button
            id="precheck-back-button"
            text="Zurück"
            href={PATH_LANDING}
            look="tertiary"
          ></Button>
          <form method="post">
            <Button
              id="precheck-start-button"
              text={precheck.start.buttonText}
              type="submit"
            ></Button>
          </form>
        </ButtonContainer>
      </Container>
      <Container>
        <InlineNotice
          look="tips"
          title={precheck.start.hint.title}
          tagName="h2"
          content={precheck.start.hint.text}
        ></InlineNotice>
      </Container>
    </>
  );
}

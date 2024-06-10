import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import PreCheckNavigation from "components/PreCheckNavigation";
import { getAnswersFromCookie, userAnswers } from "cookies.server";
import { preCheck } from "resources/content";
import { PATH_LANDING } from "resources/staticRoutes";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = await getAnswersFromCookie(request);
  cookie.answers = {};

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await userAnswers.serialize(cookie),
      },
    },
  );
}

export default function Index() {
  return (
    <div className="flex bg-blue-100">
      <div className="hidden lg:block pt-48">
        <PreCheckNavigation answers={{}} />
      </div>
      <section>
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
      </section>
    </div>
  );
}

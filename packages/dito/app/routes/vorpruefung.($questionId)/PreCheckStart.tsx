import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import { preCheck } from "resources/content";
import { PATH_LANDING } from "resources/staticRoutes";
import PreCheckNavigation from "./PreCheckNavigation";

export default function PreCheckStart() {
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
      <Container paddingTop="0" additionalClassNames="lg:hidden">
        <PreCheckNavigation />
      </Container>
    </>
  );
}

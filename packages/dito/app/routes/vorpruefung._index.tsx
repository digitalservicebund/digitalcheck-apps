import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import { PATH_LANDING, precheck } from "resources/content";

export default function Index() {
  if (typeof window !== "undefined") localStorage.clear(); // reset precheck state on start

  return (
    <>
      <Container paddingBottom="0">
        <Box
          heading={{
            tagName: "h2",
            text: precheck.start.title,
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
          <Button
            id="precheck-start-button"
            text={precheck.start.buttonText}
            href={precheck.questions[0].url}
          ></Button>
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

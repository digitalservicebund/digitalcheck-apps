import Box from "@digitalcheck/shared/components/Box";
import Button from "@digitalcheck/shared/components/Button";
import ButtonContainer from "@digitalcheck/shared/components/ButtonContainer";
import Container from "@digitalcheck/shared/components/Container";
import InlineNotice from "@digitalcheck/shared/components/InlineNotice";
import { vorpruefung } from "resources/content";
import { PATH_LANDING } from "resources/routes";

export default function Index() {
  return (
    <>
      <Container paddingBottom="0">
        <Box
          heading={{
            tagName: "h2",
            text: vorpruefung.start.title,
          }}
          content={{
            markdown: vorpruefung.start.subtitle,
          }}
        ></Box>
      </Container>
      <Container paddingBottom="0">
        <ButtonContainer>
          <Button
            id="vorpruefung-back-button"
            text="Zurück"
            href={PATH_LANDING}
            look="tertiary"
          ></Button>
          <Button
            id="vorpruefung-start-button"
            text={vorpruefung.start.buttonText}
            href={PATH_LANDING}
          ></Button>
        </ButtonContainer>
      </Container>
      <Container>
        <InlineNotice
          look="tips"
          title={vorpruefung.start.tip.title}
          tagName="h2"
          content={vorpruefung.start.tip.text}
        ></InlineNotice>
      </Container>
    </>
  );
}

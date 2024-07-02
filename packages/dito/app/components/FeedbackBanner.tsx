import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import { feedbackBanner } from "resources/content";

export default function FeedbackBanner() {
  return (
    <Background backgroundColor="midBlue">
      <Container>
        <Box
          heading={{
            tagName: "h2",
            look: "ds-label-01-bold",
            text: feedbackBanner.title,
          }}
          content={{
            markdown: feedbackBanner.text,
          }}
        ></Box>
      </Container>
    </Background>
  );
}

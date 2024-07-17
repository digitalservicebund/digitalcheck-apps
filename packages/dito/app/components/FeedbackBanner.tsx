import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import { feedbackBanner } from "resources/content";

export default function FeedbackBanner() {
  return (
    <Background backgroundColor="midBlue">
      <Container additionalClassNames="ds-stack-16">
        <Box
          heading={{
            tagName: "h2",
            look: "ds-label-01-bold",
            text: feedbackBanner.feedback.title,
          }}
          content={{
            markdown: feedbackBanner.feedback.text,
          }}
        ></Box>
        <Box
          heading={{
            tagName: "h2",
            look: "ds-label-01-bold",
            text: feedbackBanner.needToTalk.title,
          }}
          content={{
            markdown: feedbackBanner.needToTalk.text,
          }}
        ></Box>
      </Container>
    </Background>
  );
}

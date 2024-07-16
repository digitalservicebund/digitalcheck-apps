import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import { interviewBanner } from "resources/content";

export default function InterviewBanner() {
  return (
    <Container additionalClassNames="!p-0">
      <Background backgroundColor="blue">
        <Container>
          <Box
            heading={{
              tagName: "h2",
              text: interviewBanner.title,
            }}
            content={{
              markdown: interviewBanner.text,
            }}
          ></Box>
        </Container>
      </Background>
    </Container>
  );
}

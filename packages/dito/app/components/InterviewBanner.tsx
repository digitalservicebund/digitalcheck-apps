import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import { interviewBanner } from "resources/content";

export default function InterviewBanner() {
  return (
    <Container
      backgroundColor="blue"
      overhangingBackground
      additionalClassNames="mt-40 mb-48"
    >
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
  );
}

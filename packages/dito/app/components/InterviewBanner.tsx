import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import { interviewBanner } from "resources/content";

export default function InterviewBanner() {
  return (
    <Container
      className="mb-48 mt-40"
      backgroundColor="blue"
      overhangingBackground
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

import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import Container from "@digitalcheck/shared/components/Container";
import { supportBanner } from "resources/content";

export default function SupportBanner({
  withFeedbackBanner = true,
}: Readonly<{ withFeedbackBanner?: boolean }>) {
  return (
    <Background backgroundColor="midBlue">
      <Container className="ds-stack-16">
        {withFeedbackBanner && (
          <Box
            heading={{
              tagName: "h2",
              look: "ds-label-01-bold",
              text: supportBanner.feedback.title,
            }}
            content={{
              markdown: supportBanner.feedback.text,
            }}
          ></Box>
        )}
        <Box
          heading={{
            tagName: "h2",
            look: "ds-label-01-bold",
            text: supportBanner.support.title,
          }}
          content={{
            markdown: supportBanner.support.text,
          }}
        ></Box>
      </Container>
    </Background>
  );
}

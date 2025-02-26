import Background from "~/components/Background";
import Box from "~/components/Box";
import Container from "~/components/Container";
import { supportBanner } from "~/resources/content";

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
              look: "ds-subhead font-bold",
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
            look: "ds-subhead font-bold",
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

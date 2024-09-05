import { type BackgroundColor } from "@digitalcheck/shared/components";
import Background from "@digitalcheck/shared/components/Background";
import Box from "@digitalcheck/shared/components/Box";
import { type ButtonProps } from "@digitalcheck/shared/components/Button";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import CancelOutlined from "@digitalservicebund/icons/CancelOutlined";
import CheckCircleOutlined from "@digitalservicebund/icons/CheckCircleOutlined";
import WarningAmberOutlined from "@digitalservicebund/icons/WarningAmberOutlined";
import { type ReactNode } from "react";

export default function ResultHeaderWithReasoning({
  resultType,
  resultHeading,
  resultHint,
  reasonsText,
  resultBackgroundColor,
  buttons,
  children,
}: Readonly<{
  resultType: "positive" | "negative" | "unsure";
  resultHeading: string;
  resultHint?: string;
  reasonsText: string;
  resultBackgroundColor: BackgroundColor;
  buttons?: ButtonProps[];
  children?: ReactNode;
}>) {
  const iconClassName = "w-full h-full";
  return (
    <Background backgroundColor="blue" paddingTop="40" paddingBottom="40">
      <Container
        overhangingBackground
        backgroundColor={resultBackgroundColor}
        paddingTop="32"
        paddingBottom="32"
      >
        <div className="flex sm:flex-row flex-col gap-16">
          <div className="flex-none w-36 h-36 flex items-center justify-center">
            {
              {
                positive: <CheckCircleOutlined className={iconClassName} />,
                unsure: <WarningAmberOutlined className={iconClassName} />,
                negative: <CancelOutlined className={iconClassName} />,
              }[resultType]
            }
          </div>
          <Header
            heading={{
              tagName: "h1",
              look: "ds-heading-02-reg",
              text: resultHeading,
              className: "mb-0",
            }}
            {...(resultHint && { content: { markdown: resultHint } })}
          />
        </div>
      </Container>
      <Container>
        <Box content={{ markdown: reasonsText }} buttons={buttons} />
      </Container>
      {children}
    </Background>
  );
}

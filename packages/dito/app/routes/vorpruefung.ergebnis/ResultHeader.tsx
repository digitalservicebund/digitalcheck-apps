import { type BackgroundColor } from "@digitalcheck/shared/components";
import Background from "@digitalcheck/shared/components/Background";
import { type ButtonProps } from "@digitalcheck/shared/components/Button";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import CancelOutlined from "@digitalservicebund/icons/CancelOutlined";
import CheckCircleOutlined from "@digitalservicebund/icons/CheckCircleOutlined";
import WarningAmberOutlined from "@digitalservicebund/icons/WarningAmberOutlined";
import { type ReactNode } from "react";
import { ResultType } from "./TResult.tsx";

export default function ResultHeaderWithReasoning({
  resultType,
  resultHeading,
  resultHint,
  resultBackgroundColor,
  children,
}: Readonly<{
  resultType: ResultType;
  resultHeading: string;
  resultHint?: string;
  resultBackgroundColor: BackgroundColor;
  buttons?: ButtonProps[];
  children?: ReactNode;
}>) {
  const iconClassName = "w-full h-full";

  function getIcon() {
    switch (resultType) {
      case ResultType.POSITIVE:
        return <CheckCircleOutlined className={iconClassName} />;
      case ResultType.NEGATIVE:
        return <CancelOutlined className={iconClassName} />;
      case ResultType.UNSURE:
        return <WarningAmberOutlined className={iconClassName} />;
    }
  }

  return (
    <Background backgroundColor="blue" paddingTop="40" paddingBottom="40">
      <Container
        backgroundColor={resultBackgroundColor}
        paddingTop="32"
        paddingBottom="32"
        additionalClassNames="rounded-t-lg"
      >
        <div className="flex sm:flex-row flex-col gap-16">
          <div className="flex-none w-36 h-36 flex items-center justify-center">
            {getIcon()}
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
      {children}
    </Background>
  );
}

import {
  CheckCircleOutlined as CheckCircleOutlinedIcon,
  ContactSupportOutlined as ContactSupportOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
  LightbulbOutlined as LightbulbOutlinedIcon,
  WarningAmber as WarningAmberIcon,
} from "@digitalservicebund/icons";
import type React from "react";
import type { ComponentProps } from "react";
import { twJoin } from "tailwind-merge";

// We can't set border-[${borderColor}] in the template because it causes inconsistent behavior in Storybook.
// Therefore, it's set in the config.
const lookConfig = {
  success: {
    backgroundColor: "bg-kern-feedback-success-background",
    borderColor: "border-kern-feedback-success",
    IconComponent: CheckCircleOutlinedIcon,
  },
  info: {
    backgroundColor: "bg-kern-feedback-info-background",
    borderColor: "border-kern-feedback-info",
    IconComponent: InfoOutlinedIcon,
  },
  warning: {
    backgroundColor: "bg-kern-feedback-warning-background",
    borderColor: "border-kern-feedback-warning",
    IconComponent: WarningAmberIcon,
  },
  missingOrIncomplete: {
    backgroundColor: "bg-kern-feedback-warning-background",
    borderColor: "border-kern-feedback-warning",
    IconComponent: LightbulbOutlinedIcon,
  },
  support: {
    backgroundColor: "bg-kern-feedback-warning-background",
    borderColor: "border-kern-feedback-warning",
    IconComponent: ContactSupportOutlinedIcon,
  },
  tips: {
    backgroundColor: "bg-kern-neutral-025",
    borderColor: "border-kern-neutral-300",
    IconComponent: LightbulbOutlinedIcon,
  },
};

type InlineNoticeProps = ComponentProps<"div"> & {
  identifier?: string;
  look: keyof typeof lookConfig;
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
  heading?: React.ReactNode;
};

const InlineNotice = ({
  identifier,
  look,
  className,
  showIcon = true,
  children,
  heading,
  ...rest
}: InlineNoticeProps) => {
  const { backgroundColor, borderColor, IconComponent } = lookConfig[look];

  return (
    <div
      {...rest}
      className={twJoin(
        "max-w-a11y scroll-my-40 space-y-8 p-16",
        backgroundColor,
        "border-2 border-l-8",
        borderColor,
        className,
      )}
      id={identifier}
    >
      <div className="flex flex-row items-center gap-4">
        {showIcon && <IconComponent className="mr-4 flex-none self-start" />}
        <div>{heading}</div>
      </div>
      {children && (
        <div className="leading-[26px] tracking-[0.16px]">{children}</div>
      )}
    </div>
  );
};

export default InlineNotice;

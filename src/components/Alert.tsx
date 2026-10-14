import Heading from "@/components/Heading";
import RichText from "@/components/RichText";
import { Check, Clear, ErrorOutline, Sync } from "@digitalservicebund/icons";
import type { Dispatch, SetStateAction } from "react";
import { twJoin } from "tailwind-merge";

type AlertProps = {
  identifier?: string;
  title: string;
  tagName: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  look: "success" | "error" | "info";
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  content?: string;
  showIcon?: boolean;
};

const lookConfig = {
  success: {
    backgroundColor: "bg-white",
    borderColor: "border-kern-feedback-success",
    iconColor: "fill-kern-feedback-success",
    IconComponent: Check,
  },
  error: {
    backgroundColor: "bg-kern-feedback-danger-background",
    borderColor: "border-kern-feedback-danger",
    iconColor: "fill-kern-feedback-danger",
    IconComponent: ErrorOutline,
  },
  info: {
    backgroundColor: "bg-white",
    borderColor: "border-kern-feedback-info",
    iconColor: "fill-kern-feedback-info",
    IconComponent: Sync,
  },
};

const Alert = ({
  identifier,
  title,
  tagName,
  look,
  content,
  setShowAlert,
  showIcon = true,
}: AlertProps) => {
  const { backgroundColor, borderColor, iconColor, IconComponent } =
    lookConfig[look];

  const handleCloseButtonClick = () => {
    setShowAlert(false);
  };

  return (
    <div
      className={twJoin(
        "kern-stack kern-stack-sm max-w-a11y scroll-my-40 border-l-2 p-16 shadow-md",
        backgroundColor,
        borderColor,
      )}
      id={identifier}
      aria-live="assertive"
    >
      <div className="flex flex-row items-start gap-[4px]">
        {showIcon && (
          <IconComponent className={twJoin("mr-4 flex-none", iconColor)} />
        )}
        <div className="pr-32">
          <Heading tagName={tagName}>{title}</Heading>
          {content && (
            <div className="leading-[26px] tracking-[0.16px]">
              <RichText markdown={content} />
            </div>
          )}
        </div>
        <div className="flex grow items-start justify-end self-stretch">
          <button
            type="button"
            className="flex size-24 cursor-pointer items-center justify-center rounded-[20px] outline-offset-2 hover:bg-white/50 focus-visible:bg-white/50 focus-visible:outline-4 focus-visible:outline-blue-800 active:bg-white/50"
            onClick={handleCloseButtonClick}
          >
            <Clear className="fill-kern-action-default size-16" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;

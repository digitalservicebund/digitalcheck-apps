import { Check, Clear, Sync } from "@digitalservicebund/icons";
import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import { type Dispatch, SetStateAction } from "react";
import { twJoin } from "tailwind-merge";
import Heading from "./Heading";
import RichText from "./RichText";

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
    borderColor: "border-[#01854A]",
    iconColor: "fill-[#01854A]",
    IconComponent: Check,
  },
  error: {
    backgroundColor: "bg-[#F9E5EC]",
    borderColor: "border-[#8E001B]",
    iconColor: "fill-[#8E001B]",
    IconComponent: ErrorOutline,
  },
  info: {
    backgroundColor: "bg-white",
    borderColor: "border-[#336F91]",
    iconColor: "fill-[#336F91]",
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
        "ds-stack-8 max-w-prose scroll-my-40 p-16 border-l-2 shadow-md",
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
          <Heading tagName={tagName} look="ds-label-01-bold">
            {title}
          </Heading>
          {content && (
            <div className="leading-[26px] tracking-[0.16px]">
              {content && <RichText markdown={content} />}
            </div>
          )}
        </div>
        <div className="flex grow items-start justify-end self-stretch">
          <button
            type="button"
            className="flex size-24 cursor-pointer items-center justify-center rounded-[20px] outline-offset-2 hover:bg-[rgba(255,255,255,0.50)] focus-visible:bg-[rgba(255,255,255,0.50)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#004B76] active:bg-[rgba(255,255,255,0.50)]"
            onClick={handleCloseButtonClick}
          >
            <Clear className="size-16 fill-[#004B76]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;

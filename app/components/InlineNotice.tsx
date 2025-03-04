import CheckCircleOutlinedIcon from "@digitalservicebund/icons/CheckCircleOutlined";
import ContactSupportOutlinedIcon from "@digitalservicebund/icons/ContactSupportOutlined";
import InfoOutlinedIcon from "@digitalservicebund/icons/InfoOutlined";
import LightbulbOutlinedIcon from "@digitalservicebund/icons/LightbulbOutlined";
import WarningAmberIcon from "@digitalservicebund/icons/WarningAmber";
import { twJoin } from "tailwind-merge";
import Heading from "./Heading";
import RichText from "./RichText";

type InlineNoticeProps = {
  identifier?: string;
  title: string;
  tagName: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  look: "success" | "info" | "warning" | "support" | "tips";
  content?: string;
  showIcon?: boolean;
};

// We can't set border-[${borderColor}] in the template because it causes inconsistent behavior in Storybook.
// Therefore, it's set in the config.
const lookConfig = {
  success: {
    backgroundColor: "bg-green-100",
    borderColor: "border-[#005E34]",
    IconComponent: CheckCircleOutlinedIcon,
  },
  info: {
    backgroundColor: "bg-blue-300",
    borderColor: "border-blue-700",
    IconComponent: InfoOutlinedIcon,
  },
  warning: {
    backgroundColor: "bg-yellow-200",
    borderColor: "border-[#E5CE5C]",
    IconComponent: WarningAmberIcon,
  },
  support: {
    backgroundColor: "bg-yellow-200",
    borderColor: "border-[#E5CE5C]",
    IconComponent: ContactSupportOutlinedIcon,
  },
  tips: {
    backgroundColor: "bg-gray-100",
    borderColor: "border-[#B8BDC3]",
    IconComponent: LightbulbOutlinedIcon,
  },
};

const InlineNotice = ({
  identifier,
  title,
  tagName,
  look,
  content,
  showIcon = true,
}: InlineNoticeProps) => {
  const { backgroundColor, borderColor, IconComponent } = lookConfig[look];

  return (
    <div
      className={twJoin(
        "ds-stack-8 max-w-prose scroll-my-40 p-16",
        backgroundColor,
        "border-2 border-l-8",
        borderColor,
      )}
      id={identifier}
    >
      <div className="flex flex-row items-center gap-[4px]">
        {showIcon && <IconComponent className="mr-4 flex-none" />}
        <Heading tagName={tagName} look="ds-label-01-bold">
          {title}
        </Heading>
      </div>
      {content && (
        <div className="leading-[26px] tracking-[0.16px]">
          {content && <RichText markdown={content} />}
        </div>
      )}
    </div>
  );
};

export default InlineNotice;

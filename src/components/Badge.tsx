import type { PrincipleNumber } from "@/resources/constants";
import { PRINCIPLE_COLORS } from "@/resources/constants";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type BadgeProps = {
  children?: ReactNode;
  text?: ReactNode;
  className?: string;
  principleNumber?: PrincipleNumber;
  look?: "hint" | "gray" | "default" | "white" | "success" | "danger";
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};

function Badge({
  className,
  children,
  text,
  Icon,
  principleNumber,
  look = "default",
}: Readonly<BadgeProps>) {
  const badgeStyle =
    "inline-flex flex-row items-center gap-4 self-start rounded-md bg-transparent p-4";
  const highContrastDarkStyle =
    "forced-colors:dark:[forced-color-adjust:none] forced-colors:dark:bg-transparent forced-colors:dark:text-white";
  const principleStyle = principleNumber
    ? PRINCIPLE_COLORS[principleNumber].background
    : "";

  return (
    <mark
      className={twMerge(
        badgeStyle,
        principleStyle,
        look === "hint" && "bg-kern-darkblue-100 text-kern-darkblue-800",
        look === "gray" && "bg-kern-neutral-050",
        look === "white" && "bg-white",
        look === "success" &&
          "bg-kern-feedback-success-background text-kern-feedback-success",
        look === "danger" &&
          "text-kern-feedback-danger bg-kern-feedback-danger-background",
        highContrastDarkStyle,
        className,
      )}
    >
      {Icon && <Icon className="fill-kern-layout-text-muted size-16" />}
      {children || text}
    </mark>
  );
}

export default Badge;

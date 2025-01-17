import twMerge from "@digitalcheck/shared/utils/tailwindMerge";
import { PropsWithChildren } from "react";
import { BACKGROUND_COLORS, type BackgroundColor } from ".";

type BackgroundProps = {
  backgroundColor?: BackgroundColor;
  className?: string;
};

export default function Background({
  backgroundColor = "default",
  className,
  children,
}: PropsWithChildren<BackgroundProps>) {
  const cssClasses = twMerge(
    backgroundColor !== "default" && BACKGROUND_COLORS[backgroundColor],
    backgroundColor === "darkBlue" && "text-white",
    className,
  );

  return <div className={cssClasses}>{children}</div>;
}

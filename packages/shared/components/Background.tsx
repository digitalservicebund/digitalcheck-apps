import classNames from "classnames";
import type { PropsWithChildren } from "react";
import { BACKGROUND_COLORS } from ".";
import type { CommonWrapperProps } from "./CommonWrapperProps";

const DEFAULT_PADDING_TOP = "0";
const DEFAULT_PADDING_BOTTOM = "0";

type BackgroundProps = PropsWithChildren<CommonWrapperProps> & {
  backgroundImage?: string;
};

export default function Background({
  backgroundColor = "default",
  backgroundImage,
  paddingTop = "default",
  paddingBottom = "default",
  children,
}: BackgroundProps) {
  const cssClasses = classNames(
    backgroundColor !== "default" && BACKGROUND_COLORS[backgroundColor],
    backgroundImage && `bg-[url('/assets/images/${backgroundImage}')] bg-cover`,
    `!pt-${paddingTop === "default" ? DEFAULT_PADDING_TOP : paddingTop}`,
    `!pb-${
      paddingBottom === "default" ? DEFAULT_PADDING_BOTTOM : paddingBottom
    }`,
    backgroundColor === "darkBlue" && "text-white",
  );

  return <div className={cssClasses}>{children}</div>;
}

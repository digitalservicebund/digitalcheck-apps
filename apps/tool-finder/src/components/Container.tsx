import classNames from "classnames";
import type { PropsWithChildren } from "react";
import { BACKGROUND_COLORS } from ".";
import type { CommonWrapperProps } from "./CommonWrapperProps";

const DEFAULT_PADDING_TOP = "40";
const DEFAULT_PADDING_BOTTOM = "48";

type ContainerProps = {
  overhangingBackground?: boolean;
  additionalClassNames?: string;
} & PropsWithChildren<CommonWrapperProps>;

export default function Container({
  paddingTop = "default",
  paddingBottom = "default",
  backgroundColor = "default",
  overhangingBackground,
  children,
  additionalClassNames,
}: ContainerProps) {
  let cssClasses = additionalClassNames ?? "";
  cssClasses = classNames(
    cssClasses,
    "container",
    `!pt-${paddingTop === "default" ? DEFAULT_PADDING_TOP : paddingTop}`,
    `!pb-${
      paddingBottom === "default" ? DEFAULT_PADDING_BOTTOM : paddingBottom
    }`,
    backgroundColor !== "default" && "text-black",
  );

  if (backgroundColor === "default") {
    return <div className={cssClasses}>{children}</div>;
  }

  if (backgroundColor && overhangingBackground) {
    cssClasses = classNames(
      cssClasses,
      "relative before:content-[''] before:absolute before:inset-y-0 before:-left-32 before:-right-32 before:rounded-lg",
      `before:${BACKGROUND_COLORS[backgroundColor]}`,
    );

    return (
      <div
        className="overflow-x-hidden rounded-lg"
        // Matches padding of .container (see style.css)
        style={{
          marginLeft: "clamp(1rem, 5vw, 3rem)",
          marginRight: "clamp(1rem, 5vw, 3rem)",
        }}
      >
        <div className={cssClasses}>
          <div className="relative">{children}</div>
        </div>
      </div>
    );
  }

  if (backgroundColor) {
    cssClasses = classNames(cssClasses, BACKGROUND_COLORS[backgroundColor]);
  }

  return <div className={cssClasses}>{children}</div>;
}

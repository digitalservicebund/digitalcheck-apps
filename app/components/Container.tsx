import type { PropsWithChildren } from "react";
import twMerge from "~/utils/tailwindMerge";
import { BACKGROUND_COLORS, type BackgroundColor } from ".";

type ContainerProps = {
  backgroundColor?: BackgroundColor;
  overhangingBackground?: boolean;
  className?: string;
};

export default function Container({
  backgroundColor = "default",
  overhangingBackground,
  children,
  className,
}: PropsWithChildren<ContainerProps>) {
  let cssClasses = twMerge(
    "container pt-40 pb-48",
    backgroundColor !== "default" && "text-black",
    className,
  );

  if (backgroundColor === "default") {
    return <div className={cssClasses}>{children}</div>;
  }

  if (backgroundColor && overhangingBackground) {
    cssClasses = twMerge(
      "relative before:content-[''] before:absolute before:inset-y-0 before:-left-32 before:-right-32 before:rounded-lg",
      `before:${BACKGROUND_COLORS[backgroundColor]}`,
      cssClasses,
    );

    return (
      <div className="container-overhanging-background overflow-x-hidden rounded-lg">
        <div className={cssClasses}>
          <div className="relative">{children}</div>
        </div>
      </div>
    );
  }

  if (backgroundColor) {
    cssClasses = twMerge(BACKGROUND_COLORS[backgroundColor], cssClasses);
  }

  return <div className={cssClasses}>{children}</div>;
}

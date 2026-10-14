import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type ContainerProps = {
  overhangingBackground?: boolean;
  className?: string;
};

/**
 * A generic container component intended for sections.
 *
 * To wrap the whole page, consider using `ContentWrapper`
 * for consistent margins.
 * */
export default function Container({
  overhangingBackground,
  children,
  className,
}: PropsWithChildren<ContainerProps>) {
  const cssClasses = twMerge(
    "container py-40",
    overhangingBackground && "rounded-lg container-overhanging-background",
    className,
  );

  return <div className={cssClasses}>{children}</div>;
}

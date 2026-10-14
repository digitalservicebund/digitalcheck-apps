import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

/**
 * A div that encloses main content elements with appropriate margins.
 * Not meant to be used for full width elements.
 *
 * It wraps children in a div with `container` class and vertical margin:
 * - 40 px on narrow viewports
 * - 80 px on lg and above
 * - optional compact top spacing on lg and above
 */
function ContentWrapper({
  children,
  className,
  compactTopSpacing = false,
}: Readonly<{
  children: ReactNode;
  className?: string;
  compactTopSpacing?: boolean;
}>) {
  return (
    <div
      className={twMerge(
        "container my-40 space-y-40 lg:my-80",
        compactTopSpacing && "lg:mt-40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default ContentWrapper;

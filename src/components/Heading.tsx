import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type HeadingProps = {
  tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  text?: string | ReactNode;
  className?: string;
  look?: string;
  id?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

function Heading({
  tagName = "h1",
  text,
  className,
  look,
  id,
  children,
  ariaLabel,
  ...additionalProps
}: Readonly<HeadingProps>) {
  const Tag = tagName as keyof React.JSX.IntrinsicElements;
  // ensure headings don't use hyphens, except on narrow screens, where long words might break the layout
  const cssClasses = twMerge("sm:hyphens-none", look, className);

  if (children) {
    return (
      <Tag
        id={id}
        className={cssClasses}
        aria-label={ariaLabel}
        {...additionalProps}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      id={id}
      className={cssClasses}
      aria-label={ariaLabel}
      {...additionalProps}
      dangerouslySetInnerHTML={{
        __html: text ?? "",
      }}
    />
  );
}

export default Heading;

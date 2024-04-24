import classNames from "classnames";
import type { ReactNode } from "react";

export type HeadingProps = {
  tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  text?: string;
  className?: string;
  look?: string;
  children?: ReactNode;
};

function Heading({
  tagName = "h1",
  text,
  className,
  look,
  children,
}: HeadingProps) {
  const Tag = tagName as keyof React.JSX.IntrinsicElements;
  const cssClasses = classNames(look === "default" ? null : look, className);

  if (children) {
    return <Tag className={cssClasses}>{children}</Tag>;
  }

  return (
    <Tag
      className={cssClasses}
      dangerouslySetInnerHTML={{
        __html: text ?? "",
      }}
    />
  );
}

export default Heading;

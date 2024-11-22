import classNames from "classnames";
import type { ReactNode } from "react";

export type HeadingProps = {
  tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  text?: string | ReactNode;
  className?: string;
  look?: string;
  id?: string; // Add the id prop
  children?: ReactNode;
};

function Heading({
  tagName = "h1",
  text,
  className,
  look,
  id,
  children,
}: HeadingProps) {
  const Tag = tagName as keyof React.JSX.IntrinsicElements;
  const cssClasses = classNames(
    look === "default" ? null : look,
    className,
    "hyphens-none",
  );

  if (children) {
    return (
      <Tag id={id} className={cssClasses}>
        {children || text}
      </Tag>
    );
  }
  return (
    <Tag
      id={id}
      className={cssClasses}
      dangerouslySetInnerHTML={{
        __html: text ?? "",
      }}
    />
  );
}

export default Heading;

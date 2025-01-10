import type { ReactNode } from "react";
import twMerge from "utils/tailwind-merge";

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
  ...additionalProps
}: Readonly<HeadingProps>) {
  const Tag = tagName as keyof React.JSX.IntrinsicElements;
  const cssClasses = twMerge("hyphens-none", look, className);

  if (children) {
    return (
      <Tag id={id} className={cssClasses} {...additionalProps}>
        {children ?? text}
      </Tag>
    );
  }
  return (
    <Tag
      id={id}
      className={cssClasses}
      {...additionalProps}
      dangerouslySetInnerHTML={{
        __html: text ?? "",
      }}
    />
  );
}

export default Heading;

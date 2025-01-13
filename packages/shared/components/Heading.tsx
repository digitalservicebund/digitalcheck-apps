import twMerge from "@digitalcheck/shared/utils/tailwindMerge";
import RichText from "components/RichText";
import type { ReactNode } from "react";

export type HeadingProps = {
  tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  text?: string | ReactNode;
  markdown?: string;
  className?: string;
  look?: string;
  id?: string; // Add the id prop
  children?: ReactNode;
};

function Heading({
  tagName = "h1",
  text,
  markdown,
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
  if (markdown) {
    return (
      <Tag id={id} className={cssClasses} {...additionalProps}>
        <RichText markdown={markdown} />
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

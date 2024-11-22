import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";
import { Link as RemixLink } from "@remix-run/react";
import { ReactNode } from "react";

export type CustomLinkProps = {
  children: ReactNode;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  to: string;
  className?: string;
};

export default function CustomLink({
  children,
  target,
  rel,
  to,
  className,
}: CustomLinkProps) {
  const isExternal = to.startsWith("http://") || to.startsWith("https://");

  return (
    <RemixLink
      to={to}
      target={target || (isExternal ? "_blank" : undefined)}
      rel={target === "_blank" || isExternal ? "noreferrer" : rel}
      className={`inline-flex ${className || ""}`}
    >
      {children}
      {(target === "_blank" || isExternal) && (
        <OpenInNewIcon className="ml-4 scale-90" />
      )}
    </RemixLink>
  );
}

import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";
import { Link } from "@remix-run/react";
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
    <Link
      to={to}
      target={target || (isExternal ? "_blank" : undefined)}
      rel={target === "_blank" || isExternal ? "noreferrer" : rel}
      className={`flex items-center ${className || ""}`}
    >
      {children}
      {(target === "_blank" || isExternal) && (
        <OpenInNewIcon className="scale-75 fill-blue-800" />
      )}
    </Link>
  );
}

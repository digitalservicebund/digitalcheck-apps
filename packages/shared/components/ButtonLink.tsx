import classNames from "classnames";
import { cloneElement, type ReactElement } from "react";
import { Link } from "react-router-dom";

type Props = {
  text: string;
  look?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "large" | "medium" | "small";
  iconLeft?: ReactElement;
  iconRight?: ReactElement;
  fullWidth?: boolean;
};

export interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    Props {}

function formatIcon(icon: ReactElement | undefined) {
  if (!icon) return undefined;
  const className = `ds-button-icon ${icon.props.className ?? ""}`;
  return cloneElement(icon, { className });
}

function ButtonLink({
  id,
  children,
  text,
  iconLeft,
  iconRight,
  fullWidth,
  look,
  size,
  href,
  ...props
}: ButtonLinkProps) {
  const buttonClasses = classNames(
    "ds-button",
    {
      "ds-button-secondary": look == "secondary",
      "ds-button-tertiary": look == "tertiary",
      "ds-button-ghost": look == "ghost",
      "ds-button-large": size == "large",
      "ds-button-small": size == "small",
      "ds-button-with-icon": iconLeft ?? iconRight,
      "ds-button-with-icon-only": (iconLeft ?? iconRight) && !children,
      "ds-button-full-width": fullWidth,
    },
    props.className,
  );

  const textSpan = text ? <span className="ds-button-label">{text}</span> : "";
  const childrenSpan = <span className="ds-button-label">{children}</span>;
  iconLeft = formatIcon(iconLeft);
  iconRight = formatIcon(iconRight);

  return (
    <Link
      {...(props as ButtonLinkProps)}
      to={href || "#"}
      className={buttonClasses}
      id={id}
    >
      {iconLeft} {children ? childrenSpan : textSpan} {iconRight}
    </Link>
  );
}

export default ButtonLink;

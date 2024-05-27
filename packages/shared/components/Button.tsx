import classNames from "classnames";
import { cloneElement, useContext, type ReactElement } from "react";
import { Link } from "react-router-dom";
import TrackingContext from "../contexts/trackingContext.ts";

type Props = {
  text?: string;
  look?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "large" | "medium" | "small";
  href?: string;
  iconLeft?: ReactElement;
  iconRight?: ReactElement;
  fullWidth?: boolean;
  onClickCallback?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    Props {}
export interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    Props {}

function formatIcon(icon: ReactElement | undefined) {
  if (!icon) return undefined;
  const className = `ds-button-icon ${icon.props.className ?? ""}`;
  return cloneElement(icon, { className });
}

function Button({
  id,
  children,
  text,
  iconLeft,
  iconRight,
  fullWidth,
  look,
  size,
  href,
  onClickCallback,
  ...props
}: ButtonProps | ButtonLinkProps) {
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

  // for links that have role="button" we need to add an event handler so that it can
  // be activated with the space bar
  // see: https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
  const onKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (event.code === "Space") {
      event.currentTarget.click();
      event.preventDefault();
    }
  };

  const tracking = useContext(TrackingContext);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    tracking.trackButtonClick(id, href);
    if (onClickCallback) {
      onClickCallback(event);
    }
  };

  if (href) {
    return (
      <Link
        {...(props as ButtonLinkProps)}
        to={href}
        className={buttonClasses}
        onKeyDown={onKeyDown}
        onClick={onClick}
        id={id}
      >
        {iconLeft} {children ? childrenSpan : textSpan} {iconRight}
      </Link>
    );
  }

  return (
    <button {...(props as ButtonProps)} className={buttonClasses}>
      {iconLeft} {children ? childrenSpan : textSpan} {iconRight}
    </button>
  );
}

export default Button;

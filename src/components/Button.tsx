import type React from "react";
import { twJoin, twMerge } from "tailwind-merge";

export type ButtonBaseProps = {
  fullWidth?: boolean;
  iconLeft?: string;
  iconRight?: string;
  look?: "primary" | "secondary" | "tertiary" | "ghost" | "link";
  size?: "large" | "medium" | "small";
};

// require an explicit type for buttons for clarity
type ExplicitButtonType = {
  type: "button" | "submit" | "reset";
};

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  ExplicitButtonType &
  ButtonBaseProps;

export type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonBaseProps;

export type DownloadLinkButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

function createButtonClasses({
  look,
  size,
  fullWidth,
  className,
}: Pick<
  LinkButtonProps,
  "look" | "size" | "iconLeft" | "iconRight" | "fullWidth" | "className"
>) {
  if (look === "link") {
    return twMerge(
      "inline-flex items-center text-left space-x-8 kern-btn kern-btn--tertiary",
      className,
    );
  }

  return twMerge(
    "kern-btn",
    look == "primary" && "kern-btn--primary",
    (look === "secondary" || look === "tertiary") && "kern-btn--secondary",
    look === "ghost" && "kern-btn--tertiary",
    size == "small" && "kern-btn--x-small",
    fullWidth && "kern-btn--block",
    className,
  );
}

/**
 * Wrapper for <button> that provides extra styling.
 */
function Button({
  id,
  children,
  iconLeft,
  iconRight,
  fullWidth,
  look = "primary",
  size,
  className,
  type,
  ...props
}: ButtonProps) {
  const buttonClasses = createButtonClasses({
    look,
    size,
    iconRight,
    iconLeft,
    fullWidth,
    className,
  });

  return (
    <button
      {...props}
      id={id}
      data-testid={id}
      className={buttonClasses}
      type={type}
    >
      {iconLeft && (
        <span className={`kern-icon ${iconLeft}`} aria-hidden="true"></span>
      )}
      <span className="kern-label">{children}</span>
      {iconRight && (
        <span className={`kern-icon ${iconRight}`} aria-hidden="true"></span>
      )}
    </button>
  );
}

export default Button;

/**
 * An anchor that looks like a button.
 */
export function LinkButton({
  children,
  id,
  fullWidth,
  look,
  size,
  className,
  iconLeft,
  iconRight,
  ...props
}: Readonly<LinkButtonProps>) {
  const buttonClasses = createButtonClasses({
    look: look ?? "primary",
    size,
    fullWidth,
    className,
  });

  // for links that have role="button" we need to add an event handler so that it can
  // be activated with the space bar
  // see: https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
  const onKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (event.code === "Space") {
      event.currentTarget.click();
      event.preventDefault();
    }
  };

  return (
    <a
      href={props.href}
      id={id}
      data-testid={id}
      className={twJoin("link-unstyled", buttonClasses)}
      onKeyDown={onKeyDown}
      {...props}
    >
      {iconLeft && (
        <span className={`kern-icon ${iconLeft}`} aria-hidden="true"></span>
      )}
      <span className={look === "link" ? undefined : "kern-label"}>
        {children}
      </span>
      {iconRight && (
        <span className={`kern-icon ${iconRight}`} aria-hidden="true"></span>
      )}
    </a>
  );
}

/**
 * A button that indicates a download will be triggered.
 * For linking to a document directly, use `DownloadLinkButton` instead.
 */
export function DownloadButton(
  props: Readonly<Omit<ButtonProps, "iconLeft" | "type">>,
) {
  return <Button type="button" iconLeft="kern-icon--download" {...props} />;
}

/**
 * A link to a file that looks like a button.
 */
export function DownloadLinkButton({
  href,
  children,
  className,
}: Readonly<DownloadLinkButtonProps>) {
  return (
    <a
      href={href}
      className={twMerge("inline-flex items-center gap-8", className)}
    >
      <span
        className="kern-icon kern-icon--download kern-icon--default bg-kern-action-default"
        aria-hidden="true"
      ></span>
      {children}
    </a>
  );
}

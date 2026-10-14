import type React from "react";
import type { ReactElement } from "react";
import { twJoin, twMerge } from "tailwind-merge";

/*
 * NumberedList renders long-form content as a series of steps, placing a counter
 * to the left (or top) of the main content.
 * Optionally, trailing fullwidthContent may be added.
 *
 * ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 * ▏(1) Content       ▕
 * ▏    Content       ▕
 * ▏    Content       ▕
 * ▏                  ▕
 * ▏ after 1 content  ▕
 * ▏                  ▕
 * ▏------------------▕
 * ▏                  ▕
 * ▏(2) Content       ▕
 * ▏    Content       ▕
 * ▏    Content       ▕
 * ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
 */

export type ListItemProps = {
  readonly children?: React.ReactNode;
  readonly after?: React.ReactNode;
  className?: string;
  id?: string;
  disabled?: boolean;
};

function ListItem({
  children,
  after,
  className,
  id,
  disabled,
}: Readonly<ListItemProps>) {
  return (
    <li
      id={id}
      className={twJoin(
        "scroll-my-40 space-y-40",
        disabled && "text-kern-layout-text-muted",
      )}
    >
      <div className="before:border-kern-decorative-border flex flex-col items-start gap-16 before:flex before:size-40 before:shrink-0 before:items-center before:justify-center before:rounded-full before:border-2 before:border-solid before:content-[counter(list-item)] sm:flex-row">
        <div className={twMerge("mt-4", className)}>{children}</div>
      </div>
      {after}
    </li>
  );
}

type NumberedListProps = React.OlHTMLAttributes<HTMLOListElement> & {
  children: ReactElement<ListItemProps, typeof ListItem>[];
  className?: string;
  separator?: boolean;
};

function NumberedList({
  children,
  className,
  separator,
  ...props
}: NumberedListProps) {
  const separatorClass = separator
    ? "[&>li]:border-b-2 [&>li]:border-kern-darkblue-100 [&>li]:pb-80 [&>li]:last:border-none [&>li]:last:pb-0 space-y-80"
    : "space-y-32";

  return (
    <ol
      {...props}
      className={twMerge(
        "list-unstyled scroll-my-40",
        separatorClass,
        className,
      )}
    >
      {children}
    </ol>
  );
}

NumberedList.Item = ListItem;
export default NumberedList;

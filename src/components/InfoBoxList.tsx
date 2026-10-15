import type { HeadingProps } from "@/utils/contentTypes";
import type { ReactNode } from "react";
import React from "react";
import { twJoin, twMerge } from "tailwind-merge";

type InfoBoxListProps = {
  heading?: HeadingProps;
  separator?: boolean;
  className?: string;
  children?: ReactNode;
};

export default function InfoBoxList({
  separator,
  heading,
  className,
  children,
}: Readonly<InfoBoxListProps>) {
  const Heading = heading?.tagName ?? "h2";
  return (
    <section className="kern-stack kern-stack-sm">
      {heading && (
        <Heading id={heading.id} className={heading.className}>
          {heading.text}
        </Heading>
      )}
      <ul
        className={twMerge(
          "list-unstyled info-box kern-stack mt-32",
          separator ? "kern-stack-xl" : "gap-kern-3xl",
          className,
        )}
      >
        {React.Children.map(children, (child) => {
          if (!child) return null;
          return (
            <li
              className={twJoin(
                separator &&
                  "border-kern-decorative-border border-0 border-b-2 border-solid pb-40 last:border-none last:pb-0",
              )}
            >
              {child}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

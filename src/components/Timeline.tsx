import type { BadgeProps } from "@/components/Badge.tsx";
import { LinkButton } from "@/components/Button.tsx";
import type { HeadingProps } from "@/components/Heading.tsx";
import Heading from "@/components/Heading.tsx";
import type { ImageProps } from "@/components/Image.tsx";
import ImageZoomable from "@/components/ImageZoomable.tsx";
import RichText from "@/components/RichText.tsx";
import { twJoin, twMerge } from "tailwind-merge";

import ButtonContainer from "@/components/ButtonContainer.tsx";
import type { ContentLink } from "@/utils/contentTypes";
import type React from "react";
import type { ReactNode } from "react";

type BulletListProps = React.PropsWithChildren<{
  className?: string;
}> &
  React.HTMLProps<HTMLUListElement>;

function Bullet() {
  return (
    <div
      className="bg-kern-darkblue-850 size-16 shrink-0 rounded-full"
      role="none"
    ></div>
  );
}

function YearBadge({ children }: Readonly<{ children?: React.ReactNode }>) {
  return (
    <span className="kern-badge border-kern-darkblue-850 w-max shrink-0 border">
      <span className="kern-label">{children}</span>
    </span>
  );
}

export type TimelineItemContentProps = {
  backgroundClasses?: string;
  badge?: BadgeProps;
  headline?: HeadingProps;
  parentHasHeading?: boolean;
  content?: string;
  children?: ReactNode;
  image?: ImageProps;
  links?: ContentLink[];
};

export function TimelineItemContent({
  backgroundClasses,
  badge,
  links,
  content,
  headline,
  image,
  parentHasHeading,
  children,
}: Readonly<TimelineItemContentProps>) {
  return (
    <div className={twJoin("flex flex-col gap-16", backgroundClasses)}>
      {badge && (
        <div className="flex">
          <span className="kern-badge kern-badge--small border-0 bg-[#F3F4F7]">
            <span className="kern-label font-normal">{badge.text}</span>
          </span>
        </div>
      )}
      {headline && (
        <Heading tagName={parentHasHeading ? "h3" : "h2"} {...headline} />
      )}
      {content && <RichText markdown={content} />}
      {children}
      {image && <ImageZoomable image={image} className="max-w-a11y" />}
      {links && links.length > 0 && (
        <ButtonContainer>
          {links.map((link) => {
            const { to, text, externalLink = false, ...rest } = link;
            return (
              <LinkButton
                key={to}
                href={to}
                iconRight={externalLink ? "kern-icon--open-in-new" : undefined}
                {...rest}
              >
                {text}
              </LinkButton>
            );
          })}
        </ButtonContainer>
      )}
    </div>
  );
}

type TimelineItemProps = React.PropsWithChildren<{
  bullet?: boolean;
  year?: string;
  className?: string;
}> &
  React.HTMLProps<HTMLLIElement>;

function TimelineItem({
  children,
  bullet,
  year,
  className,
  ...restProps
}: TimelineItemProps) {
  const marker = year ? <YearBadge>{year}</YearBadge> : bullet && <Bullet />;
  return (
    <li className="flex scroll-my-40 gap-24" {...restProps}>
      {/* Each item draws its own line segment below the marker, so no
          background-colored ring is needed to separate line and marker. */}
      <div
        role="none"
        className={twJoin(
          "flex w-16 shrink-0 flex-col items-center gap-4",
          bullet && !year && "pt-4",
        )}
      >
        {marker}
        {/* Year labels keep some distance to the next entry. */}
        <div
          className={twJoin(
            "bg-kern-darkblue-850 w-px flex-1",
            year && "min-h-28",
          )}
        />
      </div>
      <div className={twMerge("min-w-0 flex-1 pb-24", className)}>
        {children}
      </div>
    </li>
  );
}

function Timeline({ className, children, ...restProps }: BulletListProps) {
  return (
    <ul
      className={twMerge("list-unstyled scroll-my-40", className)}
      {...restProps}
    >
      {children}
    </ul>
  );
}

Timeline.Item = TimelineItem;
Timeline.ItemContent = TimelineItemContent;

export default Timeline;

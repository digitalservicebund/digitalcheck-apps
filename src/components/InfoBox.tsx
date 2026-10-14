import ButtonContainer from "@/components/ButtonContainer.tsx";
import type { ContentLink } from "@/utils/contentTypes";
import type React from "react";
import { twMerge } from "tailwind-merge";
import type { BadgeProps } from "./Badge";
import Badge from "./Badge";
import { LinkButton } from "./Button";
import type { DetailsSummaryProps } from "./DetailsSummary";
import DetailsSummary from "./DetailsSummary";
import type { HeadingProps } from "./Heading";
import Heading from "./Heading";
import type { ImageProps } from "./Image";
import Image from "./Image";

export type InfoImageProps = ImageProps & {
  size: "icon" | "small" | "medium" | "large";
};

type BaseInfoBoxProps = {
  identifier?: string;
  testId?: string;
  badge?: BadgeProps;
  heading?: HeadingProps;
  className?: string;
  look?: "default" | "highlight" | "method" | "white";
};

type VisualProps =
  | {
      type: "icon";
      Icon: React.FC<React.SVGProps<SVGSVGElement>>;
      className?: string;
    }
  | { type: "image"; image: InfoImageProps }
  | { type: "component"; Component: React.ReactElement }
  | { type: "none" };

export type InfoBoxProps = BaseInfoBoxProps & {
  visual?: VisualProps;
  children?: React.ReactNode;
};

const imageSizes = {
  icon: "size-80",
  small: "size-[120px]",
  medium: "size-[280px]",
  large: "size-[280px] sm:size-[400px] md:size-[280px] lg:size-[400px]",
};

const InfoBox = ({
  identifier,
  testId,
  className,
  badge,
  heading,
  visual,
  look,
  children,
}: InfoBoxProps) => {
  return (
    <div
      id={identifier}
      data-testid={testId || "info-box-container"}
      className={twMerge(
        "flex scroll-my-40 flex-col gap-32 md:flex-row",
        // visual?.type === "image" ? "flex-col-reverse" : "flex-col",
        look === "highlight" &&
          "bg-kern-darkblue-025 rounded-lg px-16 py-40 sm:px-80",
        look === "white" && "rounded-lg bg-white px-16 py-40 sm:px-80",
        look === "method" &&
          "bg-kern-darkblue-025 px-16 py-32 sm:px-32 sm:pt-40 sm:pb-48",
        className,
      )}
    >
      {visual?.type === "icon" && (
        <visual.Icon
          className={twMerge(
            "fill-kern-darkblue-300 hidden sm:block",
            imageSizes["icon"],
            visual.className,
          )}
        />
      )}
      {visual?.type === "image" && (
        <Image
          {...visual.image}
          className={twMerge(
            "shrink-0 self-center object-cover md:self-start",
            imageSizes[visual.image.size],
            visual.image.className,
          )}
        />
      )}
      {visual?.type === "component" && visual.Component}
      <div
        data-testid="info-box-content"
        className={"kern-stack kern-stack-md grow wrap-break-word"}
      >
        {badge && <Badge className="self-start" {...badge} />}
        {heading && <Heading tagName="h3" {...heading} />}
        {children}
      </div>
    </div>
  );
};
export type DetailsSummaryListProps = {
  title?: HeadingProps;
  items?: DetailsSummaryProps[];
};

const DetailsSummaryList = ({ title, items }: DetailsSummaryListProps) => (
  <div className="kern-stack kern-stack-sm mt-16">
    {title && <Heading {...title} />}
    {items?.map(({ title, ...details }) => (
      <DetailsSummary key={title} title={title} {...details} />
    ))}
  </div>
);
InfoBox.DetailsSummaryList = DetailsSummaryList;

const LinkList = ({ links }: { links: ContentLink[] }) => (
  <ButtonContainer className="mt-auto pt-24">
    {links.map((link) => {
      const { to, text, externalLink = false, ...rest } = link;
      return (
        <LinkButton
          key={to}
          href={to}
          iconRight={externalLink ? "kern-icon--open-in-new" : undefined}
          {...rest}
          target={externalLink ? "_blank" : "_self"}
        >
          {text}
        </LinkButton>
      );
    })}
  </ButtonContainer>
);
InfoBox.LinkList = LinkList;
export default InfoBox;

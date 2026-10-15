import ButtonContainer from "@/components/ButtonContainer.tsx";
import type { ContentLink, HeadingProps } from "@/utils/contentTypes";
import type React from "react";
import { twMerge } from "tailwind-merge";
import type { BadgeProps } from "./Badge";
import Badge from "./Badge";
import { LinkButton } from "./Button";

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
  | { type: "component"; Component: React.ReactElement }
  | { type: "none" };

export type InfoBoxProps = BaseInfoBoxProps & {
  visual?: VisualProps;
  children?: React.ReactNode;
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
  const Heading = heading?.tagName ?? "h3";
  return (
    <div
      id={identifier}
      data-testid={testId || "info-box-container"}
      className={twMerge(
        "flex scroll-my-40 flex-col gap-32 md:flex-row",
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
            "fill-kern-darkblue-300 hidden size-80 sm:block",
            visual.className,
          )}
        />
      )}
      {visual?.type === "component" && visual.Component}
      <div
        data-testid="info-box-content"
        className={"kern-stack kern-stack-md grow wrap-break-word"}
      >
        {badge && <Badge className="self-start" {...badge} />}
        {heading && (
          <Heading id={heading.id} className={heading.className}>
            {heading.text}
          </Heading>
        )}
        {children}
      </div>
    </div>
  );
};

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

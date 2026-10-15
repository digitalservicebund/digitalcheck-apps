import type { LinkButtonProps } from "@/components/Button.tsx";

export type ContentLink = {
  text: string;
  id?: string;
  to: string;
  target?: string;
  download?: boolean;
  externalLink?: boolean;
} & Pick<LinkButtonProps, "look" | "className" | "iconLeft">;

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingProps = {
  text: string;
  tagName?: HeadingTag;
  className?: string;
  id?: string;
};

export type Step = {
  headline: { text: string };
  content?: string;
  link?: ContentLink;
  isDisabled?: boolean;
  finished?: { headline: { text: string }; isDisabled: boolean };
};

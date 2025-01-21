import { ReactNode } from "react";
import { twJoin } from "tailwind-merge";
import RichText from "./RichText";

export type DetailsSummaryProps = {
  identifier?: string;
  title?: string;
  content?: string | ReactNode;
  bold?: boolean;
  open?: boolean;
};

export default function DetailsSummary({
  title,
  content,
  bold = true,
  open = false,
}: Readonly<DetailsSummaryProps>) {
  const summaryClasses = twJoin(
    "summary-content inline-flex focus:outline-none cursor-pointer bg-no-repeat pl-[24px] [&::-webkit-details-marker]:hidden",
    bold ? "ds-label-01-bold" : "ds-label-01-reg",
  );
  return (
    <details
      open={open}
      className="details text-blue-800 has-[:focus-visible]:outline has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-blue-800"
    >
      <summary className={summaryClasses}>{title}</summary>
      <span className="block pl-[24px] pt-4 text-black">
        {typeof content === "string" ? (
          <RichText markdown={content} />
        ) : (
          content
        )}
      </span>
    </details>
  );
}

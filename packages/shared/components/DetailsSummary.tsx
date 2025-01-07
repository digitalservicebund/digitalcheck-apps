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
    "focus:outline-none cursor-pointer",
    bold ? "ds-label-01-bold" : "ds-label-01-reg",
  );
  return (
    <details
      open={open}
      className="focus-within:outline focus-within:outline-4 focus-within:outline-offset-4 focus-within:outline-blue-800 text-blue-800"
    >
      <summary className={summaryClasses}>{title}</summary>
      <span className="block ds-label-01-reg pt-4 pl-16 text-black">
        {typeof content === "string" ? (
          <RichText markdown={content} />
        ) : (
          content
        )}
      </span>
    </details>
  );
}

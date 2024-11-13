import { ReactNode } from "react";
import RichText from "./RichText";

export type DetailsSummaryProps = {
  identifier?: string;
  title?: string;
  content?: string | ReactNode;
  open?: boolean;
};

export default function DetailsSummary({
  title,
  content,
  open = false,
}: DetailsSummaryProps) {
  return (
    <details
      open={open}
      className="focus-within:outline focus-within:outline-4 focus-within:outline-offset-4 focus-within:outline-blue-800 text-blue-800 ds-label-01-bold"
    >
      <summary className=" focus:outline-none cursor-pointer">{title}</summary>
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

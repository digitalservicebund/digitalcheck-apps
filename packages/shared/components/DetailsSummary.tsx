import { ReactNode } from "react";
import RichText from "./RichText";

export type DetailsSummaryProps = {
  identifier?: string;
  title?: string;
  content?: string | ReactNode;
};

export default function DetailsSummary({
  title,
  content,
}: DetailsSummaryProps) {
  return (
    <details className="focus-within:outline focus-within:outline-4 focus-within:outline-offset-4 focus-within:outline-blue-800 text-blue-800 ds-label-01-bold">
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

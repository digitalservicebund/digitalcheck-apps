import RichText from "@digitalcheck/shared/components/RichText.tsx";
import { Add, Remove } from "@digitalservicebund/icons";
import { ReactNode, useState } from "react";

export type AccordionItemProps = {
  headline: string;
  content?: string | ReactNode;
  id?: string;
};

export default function AccordionItem({
  headline,
  content,
  id,
}: Readonly<AccordionItemProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <details
      onToggle={() => setIsExpanded(!isExpanded)}
      className="border-t-2 border-t-blue-800 group"
      id={id}
    >
      <summary
        aria-expanded={isExpanded}
        className="w-full p-24 flex items-center justify-between cursor-pointer hover:bg-blue-200 group-open:bg-blue-200 focus:bg-blue-200 focus-visible:outline-4 [&::-webkit-details-marker]:hidden"
      >
        <div className="pr-10 font-bold text-left text-16 leading-22 md:text-18 md:leading-24 text-blue-800">
          {headline}
        </div>
        <Add className="w-24 h-24 flex-shrink-0 fill-blue-800 group-open:hidden" />
        <Remove className="w-24 h-24 flex-shrink-0 fill-blue-800 hidden group-open:block" />
      </summary>
      <div className="p-24 pr-24">
        {typeof content === "string" ? (
          <RichText markdown={content} />
        ) : (
          content
        )}
      </div>
    </details>
  );
}

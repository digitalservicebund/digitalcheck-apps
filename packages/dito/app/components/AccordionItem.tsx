import RichText from "@digitalcheck/shared/components/RichText.tsx";
import { Add, Remove } from "@digitalservicebund/icons";
import classNames from "classnames";
import { ReactNode, useState } from "react";

export type AccordionItemProps = {
  headline: string;
  content?: string | ReactNode;
  id?: string;
  boldAppearance?: boolean;
};

export default function AccordionItem(props: AccordionItemProps) {
  const { headline, content, id, boldAppearance } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <details
      onToggle={() => setIsExpanded(!isExpanded)}
      className="border-t-2 border-t-blue-800 group"
      id={id}
    >
      <summary
        role="button"
        aria-expanded={isExpanded}
        className="accordion-summary w-full p-24 flex items-center justify-between hover:bg-blue-200 focus:bg-blue-200 focus:outline focus:outline-4 focus:outline-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-800 cursor-pointer group-open:bg-blue-200"
      >
        <div
          className={classNames(
            "pr-10 font-bold text-left text-16 leading-22 md:text-18 md:leading-24",
            { "text-blue-800": boldAppearance },
          )}
        >
          {headline}
        </div>
        <Add className="w-24 h-24 flex-shrink-0 fill-blue-800 group-open:hidden" />
        <Remove className="w-24 h-24 flex-shrink-0 fill-blue-800 hidden group-open:block" />
      </summary>
      <div
        className={classNames("p-24 pr-24", {
          "pr-48 md:pb-64 md:pr-64 text-18": boldAppearance,
        })}
      >
        {typeof content === "string" ? (
          <RichText markdown={content} />
        ) : (
          content
        )}
      </div>
    </details>
  );
}
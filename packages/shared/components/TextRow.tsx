import classNames from "classnames";
import type { ReactNode } from "react";

export type TextRowProps = {
  items: { label: string; value: ReactNode }[];
  className?: string;
};

function TextRow({ items, className }: TextRowProps) {
  return (
    <p className={classNames("bg-blue-200 pl-16 space-x-8", className)}>
      {items.map(
        (item, index) =>
          item.value && (
            <span key={index} className="space-x-8">
              <span>{item.label}:</span>
              <span className="ds-label-01-bold">{item.value}</span>
            </span>
          ),
      )}
    </p>
  );
}

export default TextRow;

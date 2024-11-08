import classNames from "classnames";
import type { ReactNode } from "react";

export type InlineInfoListProps = {
  items: { label: string; value: ReactNode }[];
  className?: string;
};

export default function InlineInfoList({
  items,
  className,
}: InlineInfoListProps) {
  return (
    <div className={classNames("bg-blue-200 pl-16 space-x-8", className)}>
      {items.map(
        (item) =>
          item.value && (
            <p key={item.label} className="inline-flex items-center space-x-8">
              <span>{item.label}:</span>
              <span className="ds-label-01-bold">{item.value}</span>
            </p>
          ),
      )}
    </div>
  );
}

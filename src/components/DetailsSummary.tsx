import type { ComponentProps, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

export type DetailsSummaryProps = ComponentProps<"details"> & {
  identifier?: string;
  title?: string;
  showVerticalLine?: boolean;
  className?: string;
  children?: ReactNode;
  expandInPrint?: boolean;
};

export default function DetailsSummary({
  identifier,
  title,
  showVerticalLine = true,
  className,
  children,
  expandInPrint = false,
  ...rest
}: Readonly<DetailsSummaryProps>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const summaryRef = useRef<HTMLElement | null>(null);

  const summaryClasses =
    "summary-content inline-flex focus:outline-hidden cursor-pointer bg-no-repeat pl-[24px] [&::-webkit-details-marker]:hidden";

  const contentWrapperClasses = twJoin(
    "block pt-4 pl-[24px] text-black",
    showVerticalLine &&
      "relative before:absolute before:top-0 before:bottom-0 before:w-px before:bg-kern-darkblue-200 before:left-[11px]",
  );

  useEffect(() => {
    if (!identifier) return;

    const matchesHash = (hash: string) => {
      if (!hash) return false;
      try {
        return decodeURIComponent(hash.slice(1)) === identifier;
      } catch {
        return hash.slice(1) === identifier;
      }
    };

    const openIfMatches = (hash: string | null) => {
      if (!hash) return;
      if (matchesHash(hash)) {
        setIsOpen(true);

        globalThis.requestAnimationFrame(() => {
          detailsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          summaryRef.current?.focus?.();
        });
      }
    };

    // initial check
    openIfMatches(globalThis.location.hash);
  }, [identifier]);

  return (
    <>
      <details
        {...rest}
        id={identifier}
        ref={detailsRef}
        onToggle={({ currentTarget }) => {
          setIsOpen(currentTarget.open);
        }}
        open={isOpen}
        className={twJoin(
          "details text-kern-action-default scroll-mt-64 has-focus-visible:outline-4 has-focus-visible:outline-offset-4 has-focus-visible:outline-blue-800",
          expandInPrint && "print:hidden",
          className,
        )}
      >
        <summary ref={summaryRef} className={summaryClasses} tabIndex={0}>
          {title}
        </summary>

        <div className={contentWrapperClasses}>{children}</div>
      </details>
      {expandInPrint && (
        <div className="hidden print:block" aria-hidden="true">
          <span className={summaryClasses}>{title}</span>
          <div className={contentWrapperClasses}>{children}</div>
        </div>
      )}
    </>
  );
}

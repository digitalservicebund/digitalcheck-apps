import { useHelpPanel } from "@/contexts/HelpPanelContext";
import { HelpOutlineOutlined } from "@digitalservicebund/icons";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

type HelpButtonProps = {
  sectionId: string;
  className?: string;
  title?: string;
  children?: ReactNode;
};

/**
 * Renders an inline help icon for a section.
 * Pass a stable `sectionId` and provide `title` + `children` to register the section's help
 * content; clicking the icon opens the help panel for that section.
 */
export default function HelpButton({
  sectionId,
  className,
  title,
  children,
}: Readonly<HelpButtonProps>) {
  const { openPanel, registerSection } = useHelpPanel();

  useEffect(() => {
    if (title && children) {
      registerSection({ id: sectionId, title, content: children });
    }
  }, [sectionId, title, children, registerSection]);

  return (
    <>
      &nbsp;
      <button
        type="button"
        aria-label="Hilfe anzeigen"
        className={twMerge(
          "inline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800",
          "fill-kern-action-default size-[1em] min-h-20 min-w-20",
          "translate-y-4",
          className,
        )}
        onClick={() => openPanel(sectionId)}
      >
        <HelpOutlineOutlined className="h-full w-full" />
      </button>
    </>
  );
}

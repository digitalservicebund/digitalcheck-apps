import { HelpOutlineOutlined } from "@digitalservicebund/icons";
import { twMerge } from "tailwind-merge";

type HelpButtonProps = {
  sectionId: string;
  className?: string;
};

/**
 * Renders an inline help icon that toggles the help panel (see `HelpSidepanel.astro`),
 * scrolling to the `HelpSection` with the matching id when opening.
 */
export default function HelpButton({
  sectionId,
  className,
}: Readonly<HelpButtonProps>) {
  const toggleHelp = () => {
    const isOpen = document
      .getElementById("help-panel")
      ?.toggleAttribute("data-open");
    if (!isOpen) return;
    document
      .getElementById(`help-section-${sectionId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

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
        onClick={toggleHelp}
      >
        <HelpOutlineOutlined className="h-full w-full" />
      </button>
    </>
  );
}

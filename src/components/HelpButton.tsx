import { HelpOutlineOutlined } from "@digitalservicebund/icons";
import { twMerge } from "tailwind-merge";

type HelpButtonProps = {
  sectionId: string;
  className?: string;
};

/**
 * Renders an inline help icon that opens the help panel (see `HelpSidepanel.astro`)
 * at the `HelpSection` with the matching id.
 */
export default function HelpButton({
  sectionId,
  className,
}: Readonly<HelpButtonProps>) {
  const openHelp = () => {
    document.getElementById("help-panel")?.setAttribute("data-open", "");
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
        onClick={openHelp}
      >
        <HelpOutlineOutlined className="h-full w-full" />
      </button>
    </>
  );
}

import { useResize } from "@/hooks/deviceHook";
import { idFromText } from "@/utils/utilFunctions";
import { InfoOutlined } from "@digitalservicebund/icons";
import { useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

type InfoTooltipProps = {
  children: string;
};

type Position = "left" | "right";

const TOOLTIP_TEXT_WIDTH = 160;

export default function InfoTooltip({ children }: Readonly<InfoTooltipProps>) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position>("right");
  const tooltipRef = useRef<HTMLButtonElement>(null);

  useResize(() => {
    const tooltipBtn = tooltipRef.current;
    if (!tooltipBtn) return;

    const { right } = tooltipBtn.getBoundingClientRect();
    const offsetRight = window.innerWidth - (right + 10);

    if (offsetRight > TOOLTIP_TEXT_WIDTH) setPosition("right");
    else setPosition("left");
  });

  const toggleOpen = () => setOpen((prevOpenState) => !prevOpenState);
  const id = idFromText(children, "tooltip");

  const classNamesArrowLeft =
    "top-1/2 -left-6 -translate-y-1/2 border-t-0 border-r-0";

  const classNamesArrowRight =
    "top-1/2 -right-6 -translate-y-1/2 border-b-0 border-l-0";

  return (
    <div className="relative mb-4 ml-4 inline-flex flex-row items-center align-middle">
      <button
        type="button"
        ref={tooltipRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={toggleOpen}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-describedby={id}
      >
        <InfoOutlined className="size-20" />
        <span className="sr-only">Info</span>
      </button>
      <div
        id={id}
        role="tooltip"
        className={twJoin(
          "border-kern-darkblue-100 bg-kern-darkblue-025 text-kern-layout-text-default absolute w-160 rounded-sm border px-12 py-8 transition-opacity duration-300",
          position === "left" ? "right-full mr-10" : "left-full ml-10",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Tooltip Arrow */}
        <span
          className={twJoin(
            "border-kern-darkblue-100 bg-kern-darkblue-025 absolute h-12 w-12 rotate-45 border",
            position === "left" ? classNamesArrowRight : classNamesArrowLeft,
          )}
          aria-hidden
        ></span>

        {children}
      </div>
    </div>
  );
}

import { useHelpPanel } from "@/contexts/HelpPanelContext";
import { useElResize, useScroll } from "@/hooks/deviceHook";
import { ChevronLeftOutlined, CloseOutlined } from "@digitalservicebund/icons";
import { useEffect, useRef } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import Button from "./Button";
import RichText from "./RichText";

const BREAKPOINT = "1280px" as const;

function ToggleTabButton({
  onClick,
  ariaLabel,
  className,
  children,
}: Readonly<{
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <Button
      type="button"
      aria-label={ariaLabel}
      look="tertiary"
      className={twJoin("fill-kern-action-default w-auto p-6", className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default function HelpSidepanel() {
  const { isOpen, sections, activeSection, openPanel, closePanel } =
    useHelpPanel();
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeSection && scrollableRef.current) {
      const target = scrollableRef.current.querySelector<HTMLElement>(
        `#help-section-${activeSection}`,
      );
      if (target) {
        const containerTop = scrollableRef.current.getBoundingClientRect().top;
        const targetTop = target.getBoundingClientRect().top;
        scrollableRef.current.scrollTo({
          top:
            scrollableRef.current.scrollTop + (targetTop - containerTop) - 80,
          behavior: "smooth",
        });
      }
    }
  }, [isOpen, activeSection]);

  const adjustSize = () => {
    const parent = document.getElementsByTagName("main")[0];
    if (!parent) return;

    const el = scrollableRef.current;
    if (!el) return;

    if (!globalThis.matchMedia(`(min-width: ${BREAKPOINT})`).matches) {
      return;
    }

    const rect = parent.getBoundingClientRect();
    const visibleHeight = Math.max(
      0,
      Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top),
    );

    el.style.maxHeight = `${visibleHeight}px`;
  };

  useScroll(adjustSize);
  useElResize("main", adjustSize, true);

  useEffect(() => {
    if (
      isOpen &&
      !globalThis.matchMedia(`(min-width: ${BREAKPOINT})`).matches
    ) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile: backdrop when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm xl:hidden"
          onClick={closePanel}
          aria-hidden="true"
        />
      )}

      {/* Main panel — desktop: grid item; mobile: fixed overlay */}
      <div
        className={twMerge(
          // Base (desktop grid)
          "help border-kern-darkblue-100 relative border-l bg-white",
          !isOpen && "hidden",
          // Mobile overlay (overrides grid behavior)
          "max-xl:fixed max-xl:inset-y-0 max-xl:right-0 max-xl:z-50 max-xl:w-[80vw] max-xl:max-w-[400px] max-xl:shadow-2xl",
        )}
      >
        <div className="sticky top-0">
          <div className="absolute right-16 left-0 z-10 flex flex-row justify-end bg-white px-16 pt-24 pb-16">
            <ToggleTabButton
              ariaLabel={
                isOpen ? "Hilfe-Panel schließen" : "Hilfe-Panel öffnen"
              }
              className="self-end"
              onClick={() => (isOpen ? closePanel() : openPanel())}
            >
              {isOpen ? (
                <CloseOutlined className="h-20 w-20" />
              ) : (
                <ChevronLeftOutlined className="h-20 w-20" />
              )}
            </ToggleTabButton>
          </div>
          <div
            className={twJoin(
              "before:pointer-events-none before:absolute before:top-48 before:right-16 before:left-0 before:h-40 before:bg-[linear-gradient(to_bottom,white,transparent)] before:blur-xs before:content-['']",
              "after:pointer-events-none after:absolute after:right-16 after:bottom-0 after:left-0 after:h-40 after:bg-[linear-gradient(to_top,white,transparent)] after:blur-xs after:content-['']",
            )}
          >
            <div
              ref={scrollableRef}
              className="max-h-screen [scrollbar-gutter:stable] overflow-x-hidden overflow-y-hidden pt-80 pb-40 wrap-break-word hover:overflow-y-auto max-lg:[scrollbar-gutter:auto] max-lg:overflow-y-auto"
            >
              <div className="w-full space-y-32 pr-16 pl-32">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    id={`help-section-${section.id}`}
                    className="scroll-my-80"
                  >
                    <h3 className="kern-title text-kern-action-default mb-8 font-bold">
                      {section.title}
                    </h3>
                    {typeof section.content === "string" ? (
                      <RichText markdown={section.content} />
                    ) : (
                      <div className="space-y-8">{section.content}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

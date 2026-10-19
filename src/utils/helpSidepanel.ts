// Matches the `xl` breakpoint, below which the panel is shown as an overlay.
const DESKTOP_MEDIA_QUERY = "(min-width: 80rem)";

/**
 * Alpine.js component for HelpSidepanel.astro: limits the panel to the visible part of <main>,
 * so it doesn't overlap the header or footer.
 * Register with: Alpine.data("helpSidepanel", helpSidepanelData)
 */
export function helpSidepanelData() {
  let scrollable: HTMLElement;
  let observer: ResizeObserver | undefined;

  return {
    setup(el: HTMLElement) {
      scrollable = el;
      const main = document.querySelector("main");
      if (!main) return;
      observer = new ResizeObserver(() => this.adjustHeight());
      observer.observe(main);
    },

    destroy() {
      observer?.disconnect();
    },

    adjustHeight() {
      const main = document.querySelector("main");
      if (!main || !globalThis.matchMedia(DESKTOP_MEDIA_QUERY).matches) return;

      const rect = main.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top),
      );
      scrollable.style.maxHeight = `${visibleHeight}px`;
    },
  };
}

// Matches the `lg` breakpoint, from which on the desktop navigation is shown.
const DESKTOP_NAV_MIN_WIDTH = 1024;
const SCROLL_THRESHOLD = 4;

/**
 * Alpine.js component for PageHeader.astro.
 * Register with: Alpine.data("pageHeader", pageHeaderData)
 */
export function pageHeaderData() {
  return {
    mobileMenuOpen: false,
    headerFloating: false,
    headerVisible: false,
    lastScrollY: 0,

    init() {
      this.lastScrollY = window.scrollY;
    },

    closeMenus() {
      this.mobileMenuOpen = false;
      this.headerFloating = false;
      this.headerVisible = false;
    },

    /**
     * Below the desktop nav breakpoint, the header scrolls away with the
     * page normally and only becomes a floating bar once the user scrolls
     * back up (see the `.header-floating` styles in PageHeader.astro).
     */
    handleScroll(el: HTMLElement) {
      const currentScrollY = window.scrollY;

      if (this.mobileMenuOpen || window.innerWidth >= DESKTOP_NAV_MIN_WIDTH) {
        this.lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY <= el.offsetHeight) {
        this.headerFloating = false;
        this.headerVisible = false;
        this.lastScrollY = currentScrollY;
      } else if (currentScrollY > this.lastScrollY + SCROLL_THRESHOLD) {
        this.headerFloating = false;
        this.headerVisible = false;
        this.lastScrollY = currentScrollY;
      } else if (currentScrollY < this.lastScrollY - SCROLL_THRESHOLD) {
        this.headerFloating = true;
        // Apply the hidden floating state first so the slide-in transitions.
        requestAnimationFrame(() => {
          this.headerVisible = true;
        });
        this.lastScrollY = currentScrollY;
      }
    },
  };
}

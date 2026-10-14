import { prettySlugify } from "@/utils/utilFunctions";

const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6";

export type TocNode = {
  id: string;
  label: string;
  children: TocNode[];
};

function buildTocTree(headings: HTMLHeadingElement[]): TocNode[] {
  const root: TocNode[] = [];
  const stack: { level: number; node: TocNode }[] = [];

  for (const heading of headings) {
    const label =
      heading.dataset.tocLabel?.trim() || (heading.textContent ?? "").trim();
    if (!label) continue;

    // Headings preceded by a StepNumber should jump-mark to the step
    // number circle instead of the heading text, so the step indicator
    // is visible after the jump.
    const previousSibling = heading.previousElementSibling;
    const anchor: HTMLElement =
      previousSibling instanceof HTMLElement &&
      "tocAnchor" in previousSibling.dataset
        ? previousSibling
        : heading;

    if (!anchor.id) {
      anchor.id = prettySlugify(label);
    }

    const level = Number(heading.tagName[1]);
    const node: TocNode = { id: anchor.id, label, children: [] };

    // -1 as fallback keeps the condition false when the stack is empty.
    while ((stack.at(-1)?.level ?? -1) >= level) {
      stack.pop();
    }

    const parent = stack.at(-1);
    (parent ? parent.node.children : root).push(node);
    stack.push({ level, node });
  }

  return root;
}

function flattenIds(nodes: TocNode[]): string[] {
  return nodes.flatMap((node) => [node.id, ...flattenIds(node.children)]);
}

/**
 * Scans `contentRoot` for heading elements and returns them as a nested
 * tree, nested by heading level. Headings without an `id` get one
 * generated via `prettySlugify`, and a heading's label can be overridden with
 * a `data-toc-label` attribute. Headings with `data-toc-ignore` are skipped.
 */
export function getTocTree(
  contentRoot: ParentNode,
  { excludeSelector = ".kern-card, .kern-accordion, [data-toc-ignore]" } = {},
): TocNode[] {
  const headings = Array.from(
    contentRoot.querySelectorAll<HTMLHeadingElement>(HEADING_SELECTOR),
  ).filter((heading) => !heading.closest(excludeSelector));

  return buildTocTree(headings);
}

/**
 * Alpine.js component for TocContainer.astro. Populates `items` from
 * the headings found in the element passed to `setup` (see x-init="setup($el)").
 * Register with: Alpine.data("sidebarToc", sidebarTocData)
 */
export function sidebarTocData() {
  return {
    items: [] as TocNode[],
    activeId: null as string | null,
    setup(el: HTMLElement) {
      const content = el.querySelector<HTMLElement>("[data-sidebar-content]");
      if (!content) return;

      this.items = getTocTree(content);

      const headings = flattenIds(this.items)
        .map((id) => document.getElementById(id))
        .filter((heading): heading is HTMLElement => heading !== null);
      if (headings.length === 0) return;

      // Recomputed from scratch on every crossing so it works the same
      // whether the user scrolls down or back up: the active heading is
      // simply the last one (in document order) that has scrolled past
      // the trigger line near the top of the viewport.
      const updateActiveId = () => {
        const triggerY = window.innerHeight * 0.3;
        let current: string | null = null;
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top > triggerY) break;
          current = heading.id;
        }
        this.activeId = current;
      };

      const observer = new IntersectionObserver(updateActiveId, {
        rootMargin: "0px 0px -70% 0px",
      });

      for (const heading of headings) observer.observe(heading);
      updateActiveId();
    },
  };
}

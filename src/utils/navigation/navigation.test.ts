import type { Route } from "@/config/routes";
import { afterEach, describe, expect, it, vi } from "vitest";

function createRoute(overrides: Partial<Route>): Route {
  return {
    key: "route",
    path: "/route",
    title: "Route",
    navLabel: null,
    navOrder: null,
    parent: null,
    sitemap: true,
    isStagingOnly: false,
    ...overrides,
  };
}

function createUeberBranch() {
  const ueber = createRoute({
    key: "ueber",
    path: "/ueber",
    title: "Über das ZfL",
  });
  const ueberChecklist = createRoute({
    key: "ueber_checklist",
    path: "/ueber/checklist",
    title: "Checklist",
    navLabel: "Checkliste",
    navOrder: 10,
    parent: ueber,
  });
  const ueberChecklistSummary = createRoute({
    key: "ueber_checklist_summary",
    path: "/ueber/checklist/summary",
    title: "Summary",
    navLabel: "Zusammenfassung",
    navOrder: 20,
    parent: ueberChecklist,
  });
  const ueberSummary = createRoute({
    key: "ueber_summary",
    path: "/ueber/summary",
    title: "Summary",
    navLabel: "Zusammenfassung",
    parent: ueber,
  });

  return {
    ueber,
    ueberChecklist,
    ueberChecklistSummary,
    ueberSummary,
    allRoutes: [ueber, ueberChecklist, ueberChecklistSummary, ueberSummary],
  };
}

async function loadNavigationHelpers(
  routes: Route[],
  { isProduction = true }: { isProduction?: boolean } = {},
) {
  vi.resetModules();
  vi.doMock("@/config/routes", () => ({ allRoutes: routes }));
  vi.doMock("@/config/prinzipienRoutes", () => ({ prinzipienRoutes: [] }));
  vi.doMock("@/config/stage", () => ({
    isProduction,
    isStaging: false,
    isPreview: false,
  }));

  const drilldown = await import("./drilldown");

  return drilldown;
}

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("@/config/routes");
  vi.doUnmock("@/config/prinzipienRoutes");
  vi.doUnmock("@/config/stage");
});

describe("navigation helpers", () => {
  it("opens the current nested sidebar level in the mobile menu", async () => {
    const werkzeuge = createRoute({
      key: "werkzeuge",
      path: "/werkzeuge",
      title: "Werkzeuge",
    });
    const { ueber, allRoutes } = createUeberBranch();
    const { getMobileMenuNavigation } = await loadNavigationHelpers([
      werkzeuge,
      ...allRoutes,
    ]);
    const mobileMenu = getMobileMenuNavigation("/ueber/checklist/summary", [
      werkzeuge,
      ueber,
    ]);

    expect(mobileMenu.activePanel.id).toBe("ueber_checklist");
    expect(mobileMenu.panels.map(({ id, depth }) => ({ id, depth }))).toEqual([
      { id: "root", depth: 0 },
      { id: "ueber", depth: 1 },
      { id: "ueber_checklist", depth: 2 },
    ]);
  });

  it("filters invisible child routes from the mobile menu", async () => {
    const werkzeuge = createRoute({
      key: "werkzeuge",
      path: "/werkzeuge",
      title: "Werkzeuge",
    });
    const ueber = createRoute({
      key: "ueber",
      path: "/ueber",
      title: "Über das ZfL",
    });
    const ueberChecklist = createRoute({
      key: "ueber_checklist",
      path: "/ueber/checklist",
      title: "Checklist",
      navLabel: "Checkliste",
      navOrder: 10,
      parent: ueber,
    });
    const ueberSummary = createRoute({
      key: "ueber_summary",
      path: "/ueber/summary",
      title: "Summary",
      navLabel: "Zusammenfassung",
      parent: ueber,
      isStagingOnly: true,
    });
    const { getMobileMenuNavigation } = await loadNavigationHelpers([
      werkzeuge,
      ueber,
      ueberChecklist,
      ueberSummary,
    ]);
    const mobileMenu = getMobileMenuNavigation("/werkzeuge", [
      werkzeuge,
      ueber,
    ]);

    expect(
      mobileMenu.panels[0]?.items
        .filter((item) => item.isVisible)
        .map((item) => item.path),
    ).toEqual(["/werkzeuge", "/ueber"]);
    expect(
      mobileMenu.panels
        .find((panel) => panel.id === "ueber")
        ?.items.filter((item) => item.isVisible)
        .map((item) => item.path),
    ).toEqual(["/ueber/checklist"]);
    expect(mobileMenu.panels.map((panel) => panel.id)).toEqual([
      "root",
      "ueber",
    ]);
  });
});

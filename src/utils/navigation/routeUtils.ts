import { prinzipienRoutes } from "@/config/prinzipienRoutes";
import { allRoutes, type Route } from "@/config/routes";
import { isProduction } from "@/config/stage";
import { removeTrailingSlash } from "../path";

const navigationRoutes: Route[] = [...allRoutes, ...prinzipienRoutes];

export const getRouteByPath = (path: string): Route | null =>
  navigationRoutes.find((route) => route.path === removeTrailingSlash(path)) ??
  null;

export const getRouteChain = (route: Route): Route[] => {
  const chain: Route[] = [];
  let currentRoute: Route | null = route;

  while (currentRoute) {
    chain.unshift(currentRoute);
    currentRoute = currentRoute.parent;
  }

  return chain;
};

export const getRouteDepth = (route: Route) => getRouteChain(route).length - 1;

export const getRouteLabel = (route: Route) => route.navLabel ?? route.title;

export const isRouteVisible = (route: Route) =>
  !isProduction || !route.isStagingOnly;

export const getVisibleChildren = (route: Route) =>
  navigationRoutes
    .filter((r) => r.parent === route)
    .filter(isRouteVisible)
    .toSorted(orderRoutesForNavigation);

export const hasVisibleChildren = (route: Route) =>
  getVisibleChildren(route).length > 0;

export const orderRoutesForNavigation = (routeA: Route, routeB: Route) => {
  const orderA = routeA.navOrder ?? Number.POSITIVE_INFINITY;
  const orderB = routeB.navOrder ?? Number.POSITIVE_INFINITY;

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return routeA.path.localeCompare(routeB.path);
};

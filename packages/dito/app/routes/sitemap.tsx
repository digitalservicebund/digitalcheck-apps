import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import { LoaderFunction } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { ReactNode } from "react";
import allRoutes from "resources/allRoutes";
import { ROUTE_SITEMAP } from "resources/staticRoutes";
import prependMetaTitle from "utils/metaTitle";

interface Route {
  url: string;
  title: string;
  parent?: string;
  children?: Route[];
}

const groupRoutesByParent = (routes: Route[]): Route[] => {
  const routeMap = new Map<string, Route>();

  routes.forEach((route) => {
    routeMap.set(route.url, { ...route, children: [] });
  });

  routes.forEach((route) => {
    if (route.parent) {
      const parentRoute = routeMap.get(route.parent);
      if (parentRoute) {
        parentRoute.children?.push(routeMap.get(route.url)!);
      }
    }
  });

  return Array.from(routeMap.values()).filter((route) => !route.parent);
};

export const meta: MetaFunction = ({ matches }) => {
  return prependMetaTitle(ROUTE_SITEMAP.title, matches);
};

export const loader: LoaderFunction = () => {
  return groupRoutesByParent(allRoutes as Route[]);
};

export default function Sitemap(): ReactNode {
  const urls = useLoaderData<Route[]>();

  const renderRoutes = (routes: Route[], level = 0): ReactNode => (
    <ul
      className={`space-y-8 ${level > 0 ? "ml-8 pl-8 border-l border-gray-200" : ""}`}
    >
      {routes.map((route) => (
        <li key={route.url} className="space-y-8 mb-4">
          <a href={route.url} className={"text-link hover:underline"}>
            {route.title}
          </a>
          {route.children &&
            route.children.length > 0 &&
            renderRoutes(route.children, level + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <Header
            heading={{
              tagName: "h1",
              text: "Sitemap",
            }}
          />
        </Container>
      </Background>
      <Container>{renderRoutes(urls)}</Container>
    </>
  );
}

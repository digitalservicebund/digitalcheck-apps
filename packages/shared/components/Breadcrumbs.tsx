import HomeOutlined from "@digitalservicebund/icons/HomeOutlined";
import { Link, useLocation } from "react-router-dom";

export type Breadcrumb = {
  url: string;
  title: string;
  parent?: string;
};

function filterBreadcrumbs(
  list: Breadcrumb[],
  currentPath: string,
): Breadcrumb[] {
  const filteredList: Breadcrumb[] = [];

  let currentElement = list.find((item) => item.url === currentPath);

  while (currentElement) {
    filteredList.unshift(currentElement);

    // Loop through parents and find next existing parent
    let parentUrl = currentElement?.parent;
    while (parentUrl && !list.find((item) => item.url === parentUrl)) {
      const segments = parentUrl.split("/").filter(Boolean);
      segments.pop();
      parentUrl = segments.length > 0 ? `/${segments.join("/")}` : undefined;
    }

    currentElement = parentUrl
      ? list.find((item) => item.url === parentUrl)
      : undefined;
  }

  return filteredList;
}

export default function Breadcrumbs({
  breadcrumbs,
  useIconForHome = false,
}: {
  breadcrumbs: Breadcrumb[];
  useIconForHome?: boolean;
}) {
  const location = useLocation();

  const filteredBreadcrumbs = filterBreadcrumbs(breadcrumbs, location.pathname);

  return filteredBreadcrumbs.length > 1 ? (
    <nav
      className="py-8 max-sm:py-16 px-16 bg-blue-100 flex flex-wrap items-center text-base print:hidden"
      data-testid="breadcrumbs-menu"
      aria-label="breadcrumb navigation"
    >
      {filteredBreadcrumbs.map((breadcrumb, idx, arr) => {
        let displayElement = <span>{breadcrumb.title}</span>;
        if (idx === 0 && useIconForHome) {
          displayElement = (
            <>
              <HomeOutlined />
              <span className="sr-only">{breadcrumb.title}</span>
            </>
          );
        }
        return (
          <div key={breadcrumb.url}>
            {idx !== 0 ? <span className="mx-8">/</span> : ""}
            <span>
              {idx === arr.length - 1 ? (
                <span>{displayElement}</span>
              ) : (
                <Link
                  to={breadcrumb.url}
                  className={
                    idx === 0
                      ? "ds-link-01-bold outline-blue-800 fill-blue-800"
                      : "text-link increase-tap-area"
                  }
                >
                  {displayElement}
                </Link>
              )}
            </span>
          </div>
        );
      })}
    </nav>
  ) : null;
}

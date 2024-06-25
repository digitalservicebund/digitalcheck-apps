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
    currentElement = list.find((item) => item.url === currentElement?.parent);
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

  return (
    filteredBreadcrumbs.length > 0 && (
      <nav
        className="py-8 px-16 bg-blue-100 flex flex-wrap items-center text-base"
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
                        ? "focus:outline ds-link-01-bold fill-blue-800"
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
    )
  );
}

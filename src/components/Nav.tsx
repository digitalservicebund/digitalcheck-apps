import { general } from "@/resources/content/shared/general";
import { Check, WarningAmberOutlined } from "@digitalservicebund/icons";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import type { ReactElement, ReactNode } from "react";
import { createContext, isValidElement, useContext, useMemo } from "react";
import { twJoin, twMerge } from "tailwind-merge";

const NavContext = createContext<{
  activeElementUrl?: string;
}>({});

export type NavItemProps = {
  children: string;
  url?: string;
  activeUrls?: string[];
  subItems?: ReactNode;
  disabled?: boolean;
  completed?: boolean;
  error?: boolean;
};

type NavItemsProps = {
  children: ReactNode;
};

type NavProps = {
  children: ReactNode;
  ariaLabel: string;
  activeElementUrl?: string;
  completedElementUrls?: string[];
  errorElementUrls?: string[];
  testId?: string;
  className?: string;
};

const urlMatchesActive = (
  url: string | undefined,
  activeUrls: string[] | undefined,
  activeElementUrl: string,
): boolean => {
  if (url === activeElementUrl) return true;
  if (activeUrls?.includes(activeElementUrl)) return true;
  return false;
};

const containsActiveUrl = (
  node: ReactNode | ReactNode[],
  activeElementUrl: string,
): boolean => {
  if (!node) return false;
  if (Array.isArray(node))
    return node.some((n) => containsActiveUrl(n, activeElementUrl));
  if (isValidElement(node)) {
    const props = ((node as ReactElement<unknown>).props ?? {}) as NavItemProps;
    if (urlMatchesActive(props.url, props.activeUrls, activeElementUrl))
      return true;
    if (containsActiveUrl(props.children, activeElementUrl)) return true;
    if (containsActiveUrl(props.subItems, activeElementUrl)) return true;
  }
  return false;
};

/**
 * Recursively scan a React node tree to find elements whose `attr`
 * matches the provided `value`.
 */
const containsMatchingAttr = (
  node: ReactNode | ReactNode[],
  attr: keyof NavItemProps,
  value: string | boolean = true,
  activeElementUrl?: string,
): boolean => {
  if (!node) return false;

  if (Array.isArray(node)) {
    return node.some((n) =>
      containsMatchingAttr(n, attr, value, activeElementUrl),
    );
  }

  if (isValidElement(node)) {
    const props = ((node as ReactElement<unknown>).props ?? {}) as NavItemProps;

    const isActiveNode =
      activeElementUrl != null &&
      urlMatchesActive(props.url, props.activeUrls, activeElementUrl);

    if (props[attr] === value) return !isActiveNode;
    if (containsMatchingAttr(props.children, attr, value, activeElementUrl))
      return true;
    if (containsMatchingAttr(props.subItems, attr, value, activeElementUrl))
      return true;
  }

  return false;
};

const classes = {
  hover:
    "hover:border-l-kern-darkblue-100 hover:bg-kern-darkblue-100 hover:underline",
  hoverError: "hover:border-l-yellow-300 hover:bg-yellow-300 hover:underline",
  focus:
    "focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-blue-800",
  active: "pointer-events-none border-l-kern-darkblue-800 bg-kern-darkblue-150",
  activeError: "pointer-events-none border-l-yellow-800 bg-yellow-300",
  activeOpen:
    "pointer-events-none border-l-kern-darkblue-150 bg-kern-darkblue-150",
  activeOpenError: "pointer-events-none border-l-yellow-200 bg-yellow-200",
  wrapper: "border-b border-b-white",
  base: "m-0 flex flex-row items-center gap-8 border-l-4 p-16 text-black",
};

function DisabledItem({
  children,
  statusElements,
}: Readonly<{
  statusElements?: ReactNode;
  children?: ReactNode;
}>) {
  return (
    <li className={twJoin(classes.wrapper, "cursor-not-allowed")}>
      <div
        className={twMerge(
          classes.base,
          "text-kern-layout-text-muted justify-between border-l-transparent",
        )}
        aria-disabled
      >
        {statusElements}
        {children}
      </div>
    </li>
  );
}

function NavItemLink({
  children,
  completed,
  currentPage: isCurrentPage,
  active: isActive,
  url,
  error,
}: Readonly<{
  url: string;
  error: NavItemProps["error"];
  children: string;
  completed: boolean;
  currentPage: boolean;
  active: boolean;
}>) {
  function getTitle() {
    if (error) {
      return `${children} - ${general.a11yMessageError}`;
    }
    if (completed) {
      return `${children} - ${general.a11yMessageCompleted}`;
    }
    return children;
  }

  const statusElements = (
    <>
      {completed && !error && <Check className="shrink-0" />}
      {error && <WarningAmberOutlined className="shrink-0" />}
    </>
  );

  if (isCurrentPage) {
    return (
      <li className={classes.wrapper}>
        <div
          aria-current="page"
          className={twMerge(
            classes.base,
            "border-l-kern-darkblue-025",
            classes.hover,
            classes.active,
            classes.focus,
          )}
        >
          {/* don't show status elements for the current page */}
          {children}
        </div>
      </li>
    );
  }

  return (
    <li className={classes.wrapper}>
      <a
        href={url}
        title={getTitle()}
        className={twMerge(
          classes.base,
          "link-unstyled",
          error
            ? "border-l-yellow-200 bg-yellow-200"
            : "border-l-kern-darkblue-025",
          error ? classes.hoverError : classes.hover,
          classes.focus,
          isActive && (error ? classes.activeError : classes.active),
        )}
      >
        {statusElements}
        {children}
      </a>
    </li>
  );
}

function NavItem({
  children,
  url,
  activeUrls,
  subItems,
  disabled = false,
  completed = false,
  error = false,
}: Readonly<NavItemProps>) {
  const { activeElementUrl } = useContext(NavContext);

  // If any descendant has the active URL, this item should be considered active.
  const hasActiveDescendant = Boolean(
    activeElementUrl && containsActiveUrl(subItems, activeElementUrl),
  );

  const isActive = Boolean(
    activeElementUrl &&
    (urlMatchesActive(url, activeUrls, activeElementUrl) ||
      hasActiveDescendant),
  );

  const hasCompletedDescendant = Boolean(
    containsMatchingAttr(subItems, "completed"),
  );
  const isCompleted = Boolean(
    (!isActive && completed) || hasCompletedDescendant,
  );

  const hasErrorDescendant = Boolean(
    containsMatchingAttr(subItems, "error", true, activeElementUrl),
  );
  const hasError = Boolean((!isActive && error) || hasErrorDescendant);

  if (disabled) {
    return (
      <DisabledItem>
        {children}
        {subItems && (
          <span
            className="kern-icon kern-icon--chevron-right kern-icon--default group-data-open:rotate-90"
            aria-hidden="true"
          ></span>
        )}
      </DisabledItem>
    );
  }

  if (url) {
    const isCurrentPage = activeElementUrl === url;

    return (
      <NavItemLink
        url={url}
        error={error}
        completed={isCompleted}
        currentPage={isCurrentPage}
        active={isActive && !isCurrentPage}
      >
        {children}
      </NavItemLink>
    );
  }
  // if no url is given, we assume it to be a subtree, so we render a disclosure button with the subitems inside
  return (
    <li>
      {/* key forces remount when isActive toggles, so defaultOpen can reflect the active state*/}
      <Disclosure key={String(isActive)} defaultOpen={isActive}>
        {({ open }) => (
          <>
            <DisclosureButton
              className={twJoin(
                "group w-full border-b border-b-white text-left text-black",
                classes.focus,
              )}
              aria-invalid={hasError}
            >
              <span
                className={twJoin(
                  "flex flex-row justify-between border-l-4 p-16",
                  hasError
                    ? "border-l-yellow-200 bg-yellow-200"
                    : "border-l-kern-darkblue-025",
                  hasError ? classes.hoverError : classes.hover,
                  isActive &&
                    !open &&
                    (hasError ? classes.activeError : classes.active),
                  isActive &&
                    open &&
                    (hasError ? classes.activeOpenError : classes.activeOpen),
                  classes.hover,
                )}
              >
                <span className="flex h-24 flex-row items-center gap-8">
                  {hasError && <WarningAmberOutlined className="shrink-0" />}
                  {children}
                </span>
                <span
                  className="kern-icon kern-icon--chevron-right kern-icon--default group-data-open:rotate-90"
                  aria-hidden="true"
                ></span>
              </span>
            </DisclosureButton>

            <DisclosurePanel className="**:aria-disabled:ml-16 **:aria-[current=page]:ml-16 [&_a]:ml-16 [&_a]:pl-16">
              {subItems}
            </DisclosurePanel>

            {
              // only for correct highlighting of Disclosure Button
              // Also to already set the correct width
              !open && (
                <div className="pointer-events-none invisible h-0 overflow-hidden [&_a]:pl-32">
                  {subItems}
                </div>
              )
            }
          </>
        )}
      </Disclosure>
    </li>
  );
}

function NavItems({ children }: Readonly<NavItemsProps>) {
  return (
    <ul className="bg-kern-darkblue-025 list-none space-y-0 p-0">{children}</ul>
  );
}

/**
 * @description Navigation Menu
 * 
 * @example <Nav
              activeElementUrl="/url2"
              ariaLabel="Label Text"
            >
              <Nav.Items>
                <Nav.Item url="/url1">
                  Navigation Item 1
                </Nav.Item>
                <Nav.Item url="/url2" error>
                  Navigation Item 2
                </Nav.Item>
                <Nav.Item
                  subItems={
                    <Nav.Items>
                      <Nav.Item url="/url3-1" completed>
                        Navigation SubItem 1
                      </Nav.Item>
                      <Nav.Item url="/url3-2" disabled>
                        Navigation SubItem 2
                      </Nav.Item>
                    </Nav.Items>
                  }
                >
                  Navigation Item 3 with SubItems
                </Nav.Item>
              </Nav.Items>
            </Nav>
 *
 */
function Nav({
  children,
  activeElementUrl,
  ariaLabel,
  testId,
  className,
}: Readonly<NavProps>) {
  const navContextValue = useMemo(
    () => ({ activeElementUrl }),
    [activeElementUrl],
  );
  return (
    <NavContext.Provider value={navContextValue}>
      <nav
        aria-label={ariaLabel}
        data-testid={testId}
        className={twMerge("nav", className)}
      >
        {children}
      </nav>
    </NavContext.Provider>
  );
}

Nav.Items = NavItems;
Nav.Item = NavItem;

export default Nav;

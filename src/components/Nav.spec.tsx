import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Nav from "./Nav";

const renderNav = (
  activeElementUrl?: string,
  withCompletedElements = false,
  withErrorElements = false,
  withDisabledElements = false,
) => {
  return render(
    <Nav activeElementUrl={activeElementUrl} ariaLabel="Label Text">
      <Nav.Items>
        <Nav.Item url="/example1">Navigation Item 1</Nav.Item>
        <Nav.Item url="/example2" disabled={withDisabledElements}>
          Navigation Item 2
        </Nav.Item>
        <Nav.Item
          subItems={
            <Nav.Items>
              <Nav.Item url="/example3-1" completed={withCompletedElements}>
                Navigation SubItem 1
              </Nav.Item>
              <Nav.Item url="/example3-2" error={withErrorElements}>
                Navigation SubItem 2
              </Nav.Item>
            </Nav.Items>
          }
        >
          Navigation Item 3 with SubItems
        </Nav.Item>
      </Nav.Items>
    </Nav>,
  );
};

describe("Nav", () => {
  it("creates a navigation with 4 elements one of which is disabled", () => {
    renderNav();

    expect(screen.getAllByRole("list")).toHaveLength(2);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);

    expect(
      screen.getByRole("link", {
        name: "Navigation Item 1",
      }),
    ).toHaveAttribute("href", "/example1");

    expect(
      screen.getByRole("link", {
        name: "Navigation Item 2",
      }),
    ).toHaveAttribute("href", "/example2");

    const subItems = screen.getByRole("button", {
      name: "Navigation Item 3 with SubItems",
    }).parentElement!;

    expect(
      within(subItems).getByRole("link", {
        name: "Navigation SubItem 1",
      }),
    ).toHaveAttribute("href", "/example3-1");

    expect(
      within(subItems).getByRole("link", {
        name: "Navigation SubItem 2",
      }),
    ).toHaveAttribute("href", "/example3-2");
  });

  it("shows disabled elements as disabled", () => {
    renderNav("", false, false, true);

    const disabledElement = screen.getByText("Navigation Item 2");

    expect(disabledElement).toHaveClass("text-kern-layout-text-muted");
  });

  it("highlights the current element", () => {
    renderNav("/example3-1");

    const activeElement = screen.getByText("Navigation SubItem 1");
    expect(activeElement).toHaveAttribute("aria-current", "page");
    expect(activeElement).toHaveClass(
      "pointer-events-none",
      "border-l-kern-darkblue-800",
      "bg-kern-darkblue-150",
    );
  });

  it("shows a completed icon for completed elements", () => {
    renderNav("/example2", true, false, false);

    const completedElement = screen.getByRole("link", {
      name: "Navigation SubItem 1",
    });
    expect(completedElement).toHaveAccessibleDescription(
      "Navigation SubItem 1 - Fertig",
    );

    expect(
      within(completedElement).getByTestId("CheckIcon"),
    ).toBeInTheDocument();
  });

  it("shows a error icon for elements with errors", () => {
    renderNav("/example2", false, true);

    const elementWithError = screen.getByRole("link", {
      name: "Navigation SubItem 2",
    });
    expect(elementWithError).toHaveAccessibleDescription(
      "Navigation SubItem 2 - Fehler",
    );

    expect(
      within(elementWithError).getByTestId("WarningAmberOutlinedIcon"),
    ).toBeInTheDocument();
  });

  it("automatically opens the subItems when a descendant element is active", () => {
    const { container: render1 } = renderNav("/example1");
    expect(
      within(render1).getByRole("button", {
        name: "Navigation Item 3 with SubItems",
      }),
    ).toHaveAttribute("aria-expanded", "false");

    const { container: render2 } = renderNav("/example3-2");
    expect(
      within(render2).getByRole("button", {
        name: "Navigation Item 3 with SubItems",
      }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("shows a warning if one sub item has a warning", () => {
    renderNav("/example3-1", false, true);
    expect(
      screen.getByRole("button", {
        name: "Navigation Item 3 with SubItems",
      }),
    ).toBeInvalid();
  });

  it("does not show a warning if one sub item has a warning but also is active element", () => {
    renderNav("/example3-2", false, true);
    expect(
      screen.getByRole("button", {
        name: "Navigation Item 3 with SubItems",
      }),
    ).toBeValid();
  });

  it("activeUrls highlights item for alias URL", () => {
    render(
      <Nav activeElementUrl="/p1/erlaeuterung" ariaLabel="Label Text">
        <Nav.Items>
          <Nav.Item url="/p1" activeUrls={["/p1", "/p1/erlaeuterung"]}>
            Principle 1
          </Nav.Item>
        </Nav.Items>
      </Nav>,
    );

    const item = screen.getByText("Principle 1");
    expect(item).toHaveClass("pointer-events-none");
  });

  it("activeUrls opens parent disclosure for alias URL", () => {
    render(
      <Nav activeElementUrl="/p1/erlaeuterung" ariaLabel="Label Text">
        <Nav.Items>
          <Nav.Item
            subItems={
              <Nav.Items>
                <Nav.Item url="/p1" activeUrls={["/p1", "/p1/erlaeuterung"]}>
                  Principle 1
                </Nav.Item>
              </Nav.Items>
            }
          >
            Principles
          </Nav.Item>
        </Nav.Items>
      </Nav>,
    );

    expect(screen.getByRole("button", { name: "Principles" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InfoBox from "./InfoBox";
import RichText from "./RichText";

describe("InfoBox", () => {
  describe("Top level elements", () => {
    it("shows the label", () => {
      render(<InfoBox badge={{ children: "TestLabel" }} />);
      expect(screen.getByText("TestLabel")).toBeInTheDocument();
    });

    it("shows the heading", () => {
      render(<InfoBox heading={{ text: "TestHeading" }} />);

      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "TestHeading",
      );
    });

    it("shows the content", () => {
      render(
        <InfoBox>
          <RichText markdown="Test **Content**" />
        </InfoBox>,
      );

      expect(screen.getByRole("paragraph")).toHaveTextContent("Test Content");
    });
  });

  describe("LinkList", () => {
    it("shows links", () => {
      render(
        <InfoBox>
          <InfoBox.LinkList
            links={[
              {
                text: "Link 1",
                to: "example.com",
              },
              {
                text: "Link 2",
                to: "example2.com",
                download: true,
              },
            ]}
          />
        </InfoBox>,
      );

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
      expect(links.map((link) => link.textContent.trim())).toStrictEqual([
        "Link 1",
        "Link 2",
      ]);
      expect(links.at(1)).toHaveAttribute("download");
    });
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InfoBox from "./InfoBox";
import InfoBoxList from "./InfoBoxList";

describe("InfoBoxList", () => {
  describe("Separator", () => {
    it("has expected padding when the separator is enabled", () => {
      render(
        <InfoBoxList separator>
          <InfoBox>Lorem1</InfoBox>
          <InfoBox>Lorem2</InfoBox>
        </InfoBoxList>,
      );
      expect(screen.getByRole("list")).toHaveClass("kern-stack-xl");
    });

    it("has expected padding when the separator is disabled", () => {
      render(
        <InfoBoxList separator={false}>
          <InfoBox>Lorem1</InfoBox>
          <InfoBox>Lorem2</InfoBox>
        </InfoBoxList>,
      );
      expect(screen.getByRole("list")).toHaveClass("gap-kern-3xl");
    });

    it("has expected padding when the separator is unset", () => {
      render(
        <InfoBoxList>
          <InfoBox>Lorem1</InfoBox>
          <InfoBox>Lorem2</InfoBox>
        </InfoBoxList>,
      );
      expect(screen.getByRole("list")).toHaveClass("gap-kern-3xl");
    });
  });

  describe("Top level elements", () => {
    it("shows the heading", () => {
      render(
        <InfoBoxList heading={{ text: "TestHeading" }}>
          <InfoBox>Lorem1</InfoBox>
          <InfoBox>Lorem2</InfoBox>
        </InfoBoxList>,
      );

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "TestHeading",
      );
    });
  });

  describe("Items", () => {
    it("renders the InfoBoxItems", () => {
      render(
        <InfoBoxList>
          <InfoBox>Lorem1</InfoBox>
          <InfoBox>Lorem2</InfoBox>
        </InfoBoxList>,
      );

      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });
});

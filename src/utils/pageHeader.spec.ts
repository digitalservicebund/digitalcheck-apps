import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pageHeaderData } from "./pageHeader";

const elMock = {
  offsetHeight: 100,
} as HTMLElement;

const mockWindowObj = { scrollY: 0, innerWidth: 0 };

const setScrollY = (value: number) => {
  mockWindowObj.scrollY = value;
};

const setInnerWidth = (value: number) => {
  mockWindowObj.innerWidth = value;
};

describe("test scroll handler", () => {
  beforeEach(() => {
    setScrollY(0);
    setInnerWidth(0);
    vi.stubGlobal("window", mockWindowObj);
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("scrolling down", () => {
    const header = pageHeaderData();
    header.init();
    header.headerFloating = true;
    header.headerVisible = true;

    setScrollY(500);
    header.handleScroll(elMock);

    expect(header.headerFloating).toBe(false);
    expect(header.headerVisible).toBe(false);
    expect(header.lastScrollY).toBe(500);
  });

  it("scrolling up", () => {
    const header = pageHeaderData();
    setScrollY(500);
    header.init();

    setScrollY(300);
    header.handleScroll(elMock);

    expect(header.headerFloating).toBe(true);
    expect(header.headerVisible).toBe(true);
    expect(header.lastScrollY).toBe(300);
  });
});

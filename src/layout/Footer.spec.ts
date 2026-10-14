// @vitest-environment node
import Footer from "@/layout/Footer.astro";
import { renderToDOM } from "@/utils/testUtils";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { describe, expect, it } from "vitest";

describe("Footer Component", () => {
  it("Renders correctly", async () => {
    const { html } = await renderToDOM(Footer as AstroComponentFactory);

    expect(html).toMatchSnapshot();
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { withBase } from "./path";

describe("withBase", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("without base path", () => {
    it("returns root-relative paths unchanged", () => {
      vi.stubEnv("BASE_URL", "/");
      expect(withBase("/methoden")).toBe("/methoden");
      expect(withBase("/")).toBe("/");
    });
  });

  describe("with base path", () => {
    const base = "/digitalcheck-dito/previews/feature-branch";

    it.each([`${base}/`, base])("handles BASE_URL %s", (baseUrl) => {
      vi.stubEnv("BASE_URL", baseUrl);
      expect(withBase("/methoden")).toBe(`${base}/methoden`);
    });

    it("prefixes root-relative paths", () => {
      vi.stubEnv("BASE_URL", `${base}/`);
      expect(withBase("/methoden")).toBe(`${base}/methoden`);
      expect(withBase("/interoperabel#verbindliche-anforderungen")).toBe(
        `${base}/interoperabel#verbindliche-anforderungen`,
      );
      expect(withBase("/documents/file.pdf")).toBe(
        `${base}/documents/file.pdf`,
      );
    });

    it("does not prefix paths that already contain the base path", () => {
      vi.stubEnv("BASE_URL", `${base}/`);
      expect(withBase(base)).toBe(base);
      expect(withBase(`${base}/methoden`)).toBe(`${base}/methoden`);
      expect(withBase(`${base}#anchor`)).toBe(`${base}#anchor`);
      expect(withBase(`${base}/interoperabel#verbindliche-anforderungen`)).toBe(
        `${base}/interoperabel#verbindliche-anforderungen`,
      );
    });

    it("prefixes paths that only share a prefix with the base path", () => {
      vi.stubEnv("BASE_URL", "/preview/");
      expect(withBase("/preview-page")).toBe("/preview/preview-page");
    });

    it("leaves non-root-relative URLs unchanged", () => {
      vi.stubEnv("BASE_URL", `${base}/`);
      expect(withBase("https://example.com/methoden")).toBe(
        "https://example.com/methoden",
      );
      expect(withBase("//cdn.example.com/file.js")).toBe(
        "//cdn.example.com/file.js",
      );
      expect(withBase("#anchor")).toBe("#anchor");
      expect(withBase("mailto:test@example.com")).toBe(
        "mailto:test@example.com",
      );
      expect(withBase("relative/path")).toBe("relative/path");
    });
  });
});

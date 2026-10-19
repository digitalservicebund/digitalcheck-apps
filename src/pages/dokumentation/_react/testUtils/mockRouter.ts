import type { DocumentationNavigationContextType } from "@/pages/dokumentation/_react/DocumentationNavigationContext";
import { vi } from "vitest";

const { mockNavigate, mockNavigationContext } = vi.hoisted(() => {
  const ctx: DocumentationNavigationContextType = {
    currentUrl: "/current-url",
    navigationBaseUrl: "/current-url",
    nextUrl: "/next-url",
    previousUrl: "/previous-url",
    routes: [],
    prinzips: [],
  };
  return {
    mockNavigate: vi.fn(),
    mockNavigationContext: ctx,
  };
});

export { mockNavigate, mockNavigationContext };

vi.mock(
  "@/pages/dokumentation/_react/DocumentationNavigationContext",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/pages/dokumentation/_react/DocumentationNavigationContext")
      >();
    return {
      ...actual,
      useDocumentationNavigation: vi
        .fn()
        .mockReturnValue(mockNavigationContext),
    };
  },
);

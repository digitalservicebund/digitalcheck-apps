"use client";

import type { Prinzip } from "@/content.config";
import { DocumentationDataProvider } from "@/pages/dokumentation/_react/DocumentationDataProvider";
import { LayoutWithDocumentationNavigation } from "@/pages/dokumentation/_react/DocumentationNavigation";
import type { ReactNode } from "react";

export function DocumentationPageShell({
  prinzips,
  currentUrl,
  children,
}: Readonly<{
  prinzips: Prinzip[];
  currentUrl: string;
  children: ReactNode;
}>) {
  return (
    <DocumentationDataProvider>
      <LayoutWithDocumentationNavigation
        prinzips={prinzips}
        currentUrl={currentUrl}
      >
        {children}
      </LayoutWithDocumentationNavigation>
    </DocumentationDataProvider>
  );
}

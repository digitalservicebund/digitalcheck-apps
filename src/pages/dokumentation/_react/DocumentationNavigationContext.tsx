"use client";
import type { Prinzip } from "@/content.config";
import { createContext, useContext } from "react";

export type Route = { path: string; title: string; principleId?: string };

export type RouteGroup = {
  title: string;
  routes: Route[];
};

export type DocumentationNavigationContextType = {
  currentUrl: string;
  navigationBaseUrl: string;
  nextUrl: string;
  previousUrl: string;
  routes: (Route | RouteGroup)[];
  prinzips: Prinzip[];
};

export const DocumentationNavigationContext =
  createContext<DocumentationNavigationContextType | null>(null);

export function useDocumentationNavigation(): DocumentationNavigationContextType {
  const ctx = useContext(DocumentationNavigationContext);
  if (!ctx) {
    throw new Error(
      "useDocumentationNavigation must be used within a DocumentationNavigationContext provider",
    );
  }
  return ctx;
}

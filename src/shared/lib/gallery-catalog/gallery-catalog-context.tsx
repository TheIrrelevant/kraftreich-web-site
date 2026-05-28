/**
 * ---metadata---
 * @file src/shared/lib/gallery-catalog/gallery-catalog-context.tsx
 * @description Client context for the build-time gallery catalog loaded on the home page server
 *              component and consumed by grid selection UI.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { GalleryCatalog } from "@/features/work-grid/model/gallery-catalog";

const GalleryCatalogContext = createContext<GalleryCatalog | null>(null);

export function GalleryCatalogProvider({
  catalog,
  children,
}: {
  catalog: GalleryCatalog;
  children: ReactNode;
}) {
  return (
    <GalleryCatalogContext.Provider value={catalog}>{children}</GalleryCatalogContext.Provider>
  );
}

export function useGalleryCatalog(): GalleryCatalog {
  const catalog = useContext(GalleryCatalogContext);
  if (!catalog) {
    throw new Error("useGalleryCatalog must be used within GalleryCatalogProvider");
  }
  return catalog;
}

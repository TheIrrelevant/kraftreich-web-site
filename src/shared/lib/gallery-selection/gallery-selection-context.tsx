/**
 * ---metadata---
 * @file src/shared/lib/gallery-selection/gallery-selection-context.tsx
 * @description Shared open/closed state for the home gallery detail panel. Used by work-grid
 *              (writer) and vinyl-particles (reader) without cross-feature imports.
 * @last-updated 2026-05-26
 * ---end-metadata---
 */

"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type GallerySelectionContextValue = {
  isGalleryOpen: boolean;
  setGalleryOpen: (open: boolean) => void;
};

const GallerySelectionContext = createContext<GallerySelectionContextValue | null>(null);

export function GallerySelectionProvider({ children }: { children: ReactNode }) {
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const value = useMemo(
    () => ({
      isGalleryOpen,
      setGalleryOpen,
    }),
    [isGalleryOpen],
  );

  return (
    <GallerySelectionContext.Provider value={value}>{children}</GallerySelectionContext.Provider>
  );
}

export function useGallerySelection() {
  const context = useContext(GallerySelectionContext);
  if (!context) {
    throw new Error("useGallerySelection must be used within GallerySelectionProvider");
  }
  return context;
}

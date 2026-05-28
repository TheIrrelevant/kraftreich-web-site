/**
 * ---metadata---
 * @file src/features/vinyl-particles/ui/VinylLoadingOverlay.tsx
 * @description Full-page black backdrop during vinyl particle assembly.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

"use client";

import { useVinylLoading } from "@/features/vinyl-particles/context/vinyl-loading-context";
import { Z_HOME_LOADING_OVERLAY } from "@/shared/constants/home-layers";

export default function VinylLoadingOverlay() {
  const { phase } = useVinylLoading();

  if (phase === "complete") return null;

  const opacity =
    phase === "assembling" ? 1 : phase === "revealing" ? 0 : phase === "migrating" ? 0 : 1;

  return (
    <div
      className="pointer-events-none fixed inset-0 bg-[var(--primary)] transition-opacity duration-700 ease-out"
      style={{ zIndex: Z_HOME_LOADING_OVERLAY, opacity }}
      aria-hidden
    />
  );
}

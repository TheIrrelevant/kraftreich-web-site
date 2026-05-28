/**
 * ---metadata---
 * @file src/features/home-hero/ui/HomePageContent.tsx
 * @description Home page shell — fades in after vinyl intro assembly.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

"use client";

import type { ReactNode } from "react";
import { useVinylLoading } from "@/features/vinyl-particles/context/vinyl-loading-context";

export default function HomePageContent({ children }: { children: ReactNode }) {
  const { phase } = useVinylLoading();
  const visible = phase !== "assembling";

  return (
    <div
      id="site-ready-root"
      className="relative isolate bg-[var(--primary)] transition-opacity duration-700 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {children}
    </div>
  );
}

/**
 * ---metadata---
 * @file src/features/home-hero/ui/HomeHero.tsx
 * @description Home scroll section — mounts WorkGrid and resets scroll position on load.
 * @last-updated 2026-05-26
 * @last-change mount WorkGridSection with gallery detail selection
 * ---end-metadata---
 */

"use client";

import { useEffect } from "react";
import WorkGridSection from "@/features/work-grid/ui/WorkGridSection";

export default function HomeHero() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return <WorkGridSection />;
}

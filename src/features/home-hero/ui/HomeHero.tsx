/**
 * ---metadata---
 * @file src/features/home-hero/ui/HomeHero.tsx
 * @description Home scroll section — mounts WorkGrid and resets scroll position on load.
 * @last-updated 2026-05-26
 * @last-change remove particle runway spacer; grid sits directly under IdentityStrip
 * ---end-metadata---
 */

"use client";

import { useEffect } from "react";
import WorkGrid from "@/features/work-grid/ui/WorkGrid";

export default function HomeHero() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return <WorkGrid />;
}

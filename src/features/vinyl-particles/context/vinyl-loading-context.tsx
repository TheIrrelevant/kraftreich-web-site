/**
 * ---metadata---
 * @file src/features/vinyl-particles/context/vinyl-loading-context.tsx
 * @description Home page vinyl intro timeline — assemble tracks asset-load progress like a bar,
 *              then reveal and migrate to mount.
 * @last-updated 2026-07-17
 * @last-change drive assembleProgress from waitForSiteReady onProgress (not fixed timer)
 * ---end-metadata---
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  VINYL_LOADING_MIGRATE_MS,
  VINYL_LOADING_REVEAL_MS,
} from "@/features/vinyl-particles/constants/vinyl-particles";
import { easeOutCubic } from "@/features/vinyl-particles/lib/build-vinyl-particles";
import { waitForSiteReady } from "@/shared/lib/site-ready/wait-for-site-ready";

export type VinylLoadingPhase = "assembling" | "revealing" | "migrating" | "complete";

type VinylLoadingContextValue = {
  phase: VinylLoadingPhase;
  assembleProgressRef: RefObject<number>;
  migrateProgressRef: RefObject<number>;
  isComplete: boolean;
};

const VinylLoadingContext = createContext<VinylLoadingContextValue | null>(null);

export function VinylLoadingProvider({
  children,
  assetUrls = [],
}: {
  children: ReactNode;
  assetUrls?: readonly string[];
}) {
  const [phase, setPhase] = useState<VinylLoadingPhase>("assembling");
  const assembleProgressRef = useRef(0);
  const migrateProgressRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const root = document.getElementById("site-ready-root");
    let revealTimer = 0;

    void waitForSiteReady({
      assetUrls,
      root,
      signal: controller.signal,
      onProgress: (progress) => {
        // Linear load progress = vinyl gather amount (progress-bar mapping).
        assembleProgressRef.current = progress;
      },
    }).then(() => {
      if (controller.signal.aborted) return;
      assembleProgressRef.current = 1;
      // Brief beat at full disc before overlay fades.
      revealTimer = window.setTimeout(() => {
        if (!controller.signal.aborted) setPhase("revealing");
      }, 120);
    });

    return () => {
      controller.abort();
      window.clearTimeout(revealTimer);
    };
  }, [assetUrls]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const timer = window.setTimeout(() => setPhase("migrating"), VINYL_LOADING_REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "migrating") return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / VINYL_LOADING_MIGRATE_MS);
      migrateProgressRef.current = easeOutCubic(t);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        migrateProgressRef.current = 1;
        setPhase("complete");
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const value = useMemo(
    () => ({
      phase,
      assembleProgressRef,
      migrateProgressRef,
      isComplete: phase === "complete",
    }),
    [phase],
  );

  return <VinylLoadingContext.Provider value={value}>{children}</VinylLoadingContext.Provider>;
}

export function useVinylLoading(): VinylLoadingContextValue {
  const context = useContext(VinylLoadingContext);
  if (!context) {
    throw new Error("useVinylLoading must be used within VinylLoadingProvider");
  }
  return context;
}

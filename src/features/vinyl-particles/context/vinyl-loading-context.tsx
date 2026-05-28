/**
 * ---metadata---
 * @file src/features/vinyl-particles/context/vinyl-loading-context.tsx
 * @description Home page vinyl intro timeline — scatter assemble, reveal, migrate to mount.
 * @last-updated 2026-05-28
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
import { easeOutCubic } from "@/features/vinyl-particles/lib/build-vinyl-particles";
import {
  VINYL_LOADING_ASSEMBLE_MS,
  VINYL_LOADING_MIGRATE_MS,
  VINYL_LOADING_REVEAL_MS,
} from "@/features/vinyl-particles/constants/vinyl-particles";
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
  const siteReadyRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const root = document.getElementById("site-ready-root");

    void waitForSiteReady({
      assetUrls,
      root,
      signal: controller.signal,
    }).then(() => {
      siteReadyRef.current = true;
    });

    return () => controller.abort();
  }, [assetUrls]);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const start = performance.now();

    const tryBeginReveal = () => {
      if (cancelled || !siteReadyRef.current) return false;
      window.setTimeout(() => {
        if (!cancelled) setPhase("revealing");
      }, 120);
      return true;
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / VINYL_LOADING_ASSEMBLE_MS);
      assembleProgressRef.current = easeOutCubic(t);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      assembleProgressRef.current = 1;
      if (tryBeginReveal()) return;

      const waitForReady = () => {
        if (cancelled) return;
        if (tryBeginReveal()) return;
        raf = requestAnimationFrame(waitForReady);
      };

      raf = requestAnimationFrame(waitForReady);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

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

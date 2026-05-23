/**
 * ---metadata---
 * @file src/shared/three/PerformanceBoundary.tsx
 * @description Performance gates inside the Canvas tree.
 *              AdaptiveDpr drops pixel ratio under load; AdaptiveEvents downgrades raycasting.
 *              Add Preload to warm up GPU caches for already-mounted geometry.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

"use client";

import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function PerformanceBoundary({ children }: Props) {
  return (
    <>
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
      <Preload all />
      {children}
    </>
  );
}

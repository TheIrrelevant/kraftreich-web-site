/**
 * ---metadata---
 * @file src/shared/three/CanvasShell.tsx
 * @description Client-only R3F Canvas wrapper with token-aware defaults.
 *              One shell per page maximum (DESIGN_SYSTEM.md). Scenes mount inside via SceneStage.
 *              Consumers in features should dynamic-import this with ssr: false.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, type ReactNode } from "react";
import PerformanceBoundary from "./PerformanceBoundary";

type Props = {
  children: ReactNode;
  /** Cap device pixel ratio. Phones go higher than the GPU can sustain. */
  dprCap?: [number, number];
  /** Render only when state changes. Switch to "always" for continuous scenes. */
  frameloop?: "always" | "demand" | "never";
  className?: string;
};

export default function CanvasShell({
  children,
  dprCap = [1, 1.5],
  frameloop = "demand",
  className,
}: Props) {
  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, zIndex: "var(--z-canvas)" as unknown as number }}
    >
      <Canvas
        dpr={dprCap}
        frameloop={frameloop}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 100 }}
        flat
      >
        <Suspense fallback={null}>
          <PerformanceBoundary>{children}</PerformanceBoundary>
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * ---metadata---
 * @file src/shared/three/SceneStage.tsx
 * @description Scene swap point inside the Canvas tree.
 *              Consumers pass an active scene element; key-driven Suspense gives a clean
 *              mount/unmount cycle without losing the Canvas / GL context.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

"use client";

import { Suspense, type ReactNode } from "react";

type Props = {
  /** Unique id for the current scene. Changing it triggers Suspense remount. */
  sceneId: string;
  /** The active scene tree (R3F primitives). */
  children: ReactNode;
  /** Optional R3F-side fallback rendered during scene swap. */
  fallback?: ReactNode;
};

export default function SceneStage({ sceneId, children, fallback = null }: Props) {
  return (
    <Suspense key={sceneId} fallback={fallback}>
      {children}
    </Suspense>
  );
}

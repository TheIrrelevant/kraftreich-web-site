/**
 * ---metadata---
 * @file src/features/vinyl-particles/lib/vinyl-disc-layout.ts
 * @description Screen-space disc anchor helpers for vinyl loading migration.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

import { VINYL_DISC_INSET } from "@/features/vinyl-particles/constants/vinyl-particles";

export type DiscScreenLayout = {
  centerX: number;
  centerY: number;
  radius: number;
};

/** Disc center anchored to the lower-left of an anchor rect (matches idle vinyl mount). */
export function discLayoutFromAnchorRect(rect: DOMRect): DiscScreenLayout {
  const radius = Math.min(rect.width, rect.height) * 0.5 * VINYL_DISC_INSET;
  return {
    centerX: rect.left + radius,
    centerY: rect.bottom - radius - rect.height * 0.035,
    radius,
  };
}

export function screenCenterToWorld(
  centerX: number,
  centerY: number,
  viewportWidth: number,
  viewportHeight: number,
): { x: number; y: number } {
  if (typeof window === "undefined") {
    return { x: 0, y: 0 };
  }
  return {
    x: (centerX / window.innerWidth - 0.5) * viewportWidth,
    y: -(centerY / window.innerHeight - 0.5) * viewportHeight,
  };
}

export function lerpDiscLayout(
  a: DiscScreenLayout,
  b: DiscScreenLayout,
  t: number,
): DiscScreenLayout {
  return {
    centerX: a.centerX + (b.centerX - a.centerX) * t,
    centerY: a.centerY + (b.centerY - a.centerY) * t,
    radius: a.radius + (b.radius - a.radius) * t,
  };
}

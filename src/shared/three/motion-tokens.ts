/**
 * ---metadata---
 * @file src/shared/three/motion-tokens.ts
 * @description R3F-side mirror of the motion tokens defined in src/shared/styles/tokens.css.
 *              Numeric tuples consumed by useSpring / easing functions in scenes.
 *              The CSS tokens and these constants must move together (one source of truth).
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

export const motionDurations = {
  instant: 0.08,
  fast: 0.16,
  base: 0.24,
  slow: 0.48,
  cinematic: 0.9,
} as const;

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;
export const easeEmphasized = [0.2, 0, 0, 1] as const;

export type MotionDuration = keyof typeof motionDurations;

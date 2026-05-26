/**
 * ---metadata---
 * @file src/shared/constants/home-layers.ts
 * @description Single source of truth for home page z-index stacking.
 *              Reference: zegzulka.com — grid scrolls up over identity strip, strip stays underneath.
 * @last-updated 2026-05-26
 * @last-change remove unused HOME_MORPH_SCROLL_PX after opacity fade removal
 * ---end-metadata---
 */

/** Work grid — scrolls up and covers IdentityStrip. */
export const Z_HOME_GRID = 30;

/** Identity strip — document-flow header, underneath the grid overlay. */
export const Z_HOME_STRIP = 20;

/** Grid hover — overlay opacity on non-hovered cells (zegzulka reference). */
export const HOME_GRID_OVERLAY_OPACITY = 0.55;

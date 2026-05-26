/**
 * ---metadata---
 * @file src/shared/constants/home-layers.ts
 * @description Single source of truth for home page z-index stacking.
 *              Front to back: vinyl particles > work grid > identity strip text.
 * @last-updated 2026-05-26
 * @last-change add Z_HOME_VINYL above grid overlay
 * ---end-metadata---
 */

/** Vinyl particle disc — bleeds above the scrolling work grid. */
export const Z_HOME_VINYL = 40;

/** Work grid — scrolls up and covers IdentityStrip text columns. */
export const Z_HOME_GRID = 30;

/** Identity strip text — document-flow header, underneath the grid overlay. */
export const Z_HOME_STRIP = 20;

/** Grid hover — overlay opacity on non-hovered cells (zegzulka reference). */
export const HOME_GRID_OVERLAY_OPACITY = 0.55;

/**
 * ---metadata---
 * @file src/shared/constants/home-layers.ts
 * @description Single source of truth for home page z-index stacking.
 *              Front to back: vinyl particles > work grid > identity strip text.
 * @last-updated 2026-05-26
 * @last-change grid overlay opacity tokens for zegzulka-style hover dim
 * ---end-metadata---
 */

/** Gallery detail panel — above vinyl and grid when a cell is selected. */
export const Z_HOME_GALLERY_DETAIL = 80;

/** Layer inside gallery detail — vinyl particles sit above the dimmed backdrop. */
export const GALLERY_DETAIL_VINYL_LAYER_ID = "gallery-detail-vinyl-layer";

export const Z_HOME_GALLERY_DETAIL_BACKDROP = 0;
export const Z_HOME_GALLERY_DETAIL_VINYL = 1;
export const Z_HOME_GALLERY_DETAIL_PANEL = 2;
export const Z_HOME_GALLERY_DETAIL_CLOSE = 3;

/** Vinyl particle disc — bleeds above the scrolling work grid. */
export const Z_HOME_VINYL = 40;

/** Work grid — scrolls up and covers IdentityStrip text columns. */
export const Z_HOME_GRID = 30;

/** Sticky column headers (About Me / Work / Art) once the grid reaches the viewport top. */
export const Z_HOME_GRID_HEADER = 35;

/** Identity strip text — document-flow header, underneath the grid overlay. */
export const Z_HOME_STRIP = 20;

/** Full-page black overlay during vinyl intro assembly. */
export const Z_HOME_LOADING_OVERLAY = 25;

/** Default dark overlay on grid cells (titles, covers, copy). */
export const HOME_GRID_OVERLAY_OPACITY = 0.65;

/** Extra overlay on non-hovered cells while any cell is hovered. */
export const HOME_GRID_OVERLAY_HOVER_BOOST = 0.2;

/** Shared 3-column home layout — identity strip + work grid horizontal alignment. */
export const HOME_THREE_COLUMN_GRID_CLASS =
  "grid grid-cols-1 gap-x-[var(--space-48)] md:grid-cols-3 md:items-start";

/** Shared horizontal inset for home page sections. */
export const HOME_SECTION_X_PADDING_CLASS = "px-[var(--space-48)]";

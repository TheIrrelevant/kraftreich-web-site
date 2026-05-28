/**
 * ---metadata---
 * @file src/features/work-grid/model/gallery-catalog.ts
 * @description Shared gallery catalog type for the home grid loader and client context.
 *              Kept separate from the fs-based loader to avoid circular module imports.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

import type { AboutMeContent } from "@/entities/about-me/types/about-me";
import type { GalleryItemDetail } from "@/entities/gallery-item/types/gallery-item";
import type { GalleryIndexItem } from "@/features/identity-strip/model/gallery-index";
import type { GridColumn } from "@/features/work-grid/model/grid-items";

export type GalleryCatalog = {
  columns: ReadonlyArray<GridColumn>;
  detailsBySlug: Readonly<Record<string, GalleryItemDetail>>;
  index: ReadonlyArray<GalleryIndexItem>;
  skills: string;
  aboutMe: AboutMeContent;
};

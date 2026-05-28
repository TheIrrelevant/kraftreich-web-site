/**
 * ---metadata---
 * @file src/features/work-grid/model/grid-items.ts
 * @description Grid item types and lookup helpers for the three-column home work grid. Data is
 *              supplied at runtime via GalleryCatalogProvider from the build-time gallery loader.
 * @last-updated 2026-05-28
 * @last-change wire grid types to gallery catalog instead of placeholder builders
 * ---end-metadata---
 */

import type { AboutMeExperience } from "@/entities/about-me/types/about-me";
import type { CoverAspect } from "@/entities/gallery-item/types/gallery-item";
import type { GalleryCatalog } from "@/features/work-grid/model/gallery-catalog";

export type { CoverAspect };

export const COVER_ASPECT_CLASS: Record<CoverAspect, string> = {
  portrait: "aspect-[3/4]",
  tall: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  wide: "aspect-[2/1]",
  square: "aspect-square",
};

export type GridItem = {
  slug: string;
  title: string;
  description: string;
  coverAspect: CoverAspect;
  /** CSS aspect-ratio value derived from cover image dimensions, e.g. "3/2". */
  coverAspectRatio: string;
  coverImage?: string;
  coverGif?: string;
  coverVideo?: string;
  coverVideoPoster?: string;
  /** CSS aspect-ratio for cover video when it differs from the poster image. */
  coverVideoAspectRatio?: string;
  /** About Me click-through slide images. */
  coverSlides?: ReadonlyArray<string>;
  /** About Me work history lines below the bio. */
  experience?: ReadonlyArray<AboutMeExperience>;
};

export type GridColumn = {
  id: string;
  title: string;
  items: ReadonlyArray<GridItem>;
};

export type GridItemWithCategory = GridItem & {
  categoryId: string;
  categoryTitle: string;
};

export const ABOUT_ME_SLUG = "about-me";

export function flattenGridItems(catalog: GalleryCatalog): ReadonlyArray<GridItemWithCategory> {
  return catalog.columns.flatMap((column) =>
    column.items.map((item) => ({
      ...item,
      categoryId: column.id,
      categoryTitle: column.title,
    })),
  );
}

export function opensGalleryDetail(slug: string, catalog: GalleryCatalog): boolean {
  return slug !== ABOUT_ME_SLUG && slug in catalog.detailsBySlug;
}

export function getGridItemBySlug(
  slug: string,
  catalog: GalleryCatalog,
): GridItemWithCategory | undefined {
  return flattenGridItems(catalog).find((item) => item.slug === slug);
}

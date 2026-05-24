/**
 * ---metadata---
 * @file src/features/identity-strip/model/gallery-index.ts
 * @description Placeholder gallery index — 14 entries (gallery-01 … gallery-14) rendered as
 *              the right column of the IdentityStrip. Year and tag values are stubs until
 *              real gallery content lands.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

export type GalleryIndexItem = {
  slug: string;
  year: string;
  tags: string;
};

export const GALLERY_INDEX: readonly GalleryIndexItem[] = Array.from({ length: 14 }, (_, i) => ({
  slug: `gallery-${String(i + 1).padStart(2, "0")}`,
  year: "—",
  tags: "—",
}));

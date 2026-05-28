/**
 * ---metadata---
 * @file src/features/identity-strip/model/gallery-index.ts
 * @description Gallery index row type for the IdentityStrip right column. Values are assembled by
 *              the build-time gallery loader in src/shared/lib/content/gallery.ts.
 * @last-updated 2026-05-28
 * @last-change add label field for project title in index rows
 * ---end-metadata---
 */

export type GalleryIndexItem = {
  slug: string;
  year: string;
  label: string;
  tags: string;
};

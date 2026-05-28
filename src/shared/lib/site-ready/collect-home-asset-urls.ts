/**
 * ---metadata---
 * @file src/shared/lib/site-ready/collect-home-asset-urls.ts
 * @description Collects home-page media URLs for the vinyl intro readiness gate.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

import { VINYL_AUDIO_SRC } from "@/features/vinyl-particles/constants/vinyl-particles";
import type { GalleryCatalog } from "@/features/work-grid/model/gallery-catalog";
import { flattenGridItems } from "@/features/work-grid/model/grid-items";

function addUrl(set: Set<string>, url?: string) {
  if (url) set.add(url);
}

function addUrls(set: Set<string>, urls?: ReadonlyArray<string>) {
  urls?.forEach((url) => addUrl(set, url));
}

export function collectHomeAssetUrls(catalog: GalleryCatalog): string[] {
  const urls = new Set<string>();

  addUrl(urls, VINYL_AUDIO_SRC);

  for (const item of flattenGridItems(catalog)) {
    addUrl(urls, item.coverImage);
    addUrl(urls, item.coverGif);
    addUrl(urls, item.coverVideo);
    addUrl(urls, item.coverVideoPoster);
    addUrls(urls, item.coverSlides);
  }

  addUrl(urls, catalog.aboutMe.coverImage);
  addUrls(urls, catalog.aboutMe.slides);

  return [...urls];
}

/**
 * ---metadata---
 * @file src/features/work-grid/ui/WorkGridSection.tsx
 * @description Client shell for the home work grid + gallery detail panel selection state.
 * @last-updated 2026-05-28
 * @last-change resolve selected item detail from gallery catalog context
 * ---end-metadata---
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import GalleryDetailPanel from "@/features/work-grid/ui/GalleryDetailPanel";
import WorkGrid from "@/features/work-grid/ui/WorkGrid";
import { getGridItemBySlug, opensGalleryDetail } from "@/features/work-grid/model/grid-items";
import { useGalleryCatalog } from "@/shared/lib/gallery-catalog/gallery-catalog-context";
import { useGallerySelection } from "@/shared/lib/gallery-selection/gallery-selection-context";

export default function WorkGridSection() {
  const catalog = useGalleryCatalog();
  const { setGalleryOpen } = useGallerySelection();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const closeDetail = useCallback(() => {
    setSelectedSlug(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  const openDetail = useCallback(
    (slug: string) => {
      if (!opensGalleryDetail(slug, catalog)) return;
      setSelectedSlug(slug);
      window.history.replaceState(null, "", `#${slug}`);
    },
    [catalog],
  );

  useEffect(() => {
    const syncFromHash = () => {
      const slug = window.location.hash.replace(/^#/, "");
      if (!slug) {
        setSelectedSlug(null);
        return;
      }
      setSelectedSlug(
        getGridItemBySlug(slug, catalog) && opensGalleryDetail(slug, catalog) ? slug : null,
      );
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [catalog]);

  useEffect(() => {
    setGalleryOpen(selectedSlug !== null);
  }, [selectedSlug, setGalleryOpen]);

  useEffect(() => {
    return () => setGalleryOpen(false);
  }, [setGalleryOpen]);

  useEffect(() => {
    if (!selectedSlug) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedSlug]);

  const selectedItem = selectedSlug ? getGridItemBySlug(selectedSlug, catalog) : undefined;
  const selectedDetail = selectedSlug ? catalog.detailsBySlug[selectedSlug] : undefined;

  return (
    <>
      <WorkGrid columns={catalog.columns} selectedSlug={selectedSlug} onSelect={openDetail} />
      {selectedItem && selectedDetail ? (
        <GalleryDetailPanel item={selectedItem} detail={selectedDetail} onClose={closeDetail} />
      ) : null}
    </>
  );
}

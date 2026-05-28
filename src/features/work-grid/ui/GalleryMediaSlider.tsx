/**
 * ---metadata---
 * @file src/features/work-grid/ui/GalleryMediaSlider.tsx
 * @description Horizontal slider for gallery detail landscape media rows.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

"use client";

import { useCallback, useState, type CSSProperties } from "react";
import type { GalleryMediaItem } from "@/entities/gallery-item/types/gallery-item";
import { COVER_ASPECT_CLASS } from "@/features/work-grid/model/grid-items";

type Props = {
  items: ReadonlyArray<GalleryMediaItem>;
  label: string;
  resolveAspectClass: (item: GalleryMediaItem) => string;
  frameAspect?: string;
  frameFit?: "cover" | "contain";
  compact?: boolean;
};

const bodyClass = "font-mono text-[var(--text-caption)] leading-[1.6] text-[var(--accent)]/70";

const mediaSurfaceClass =
  "relative w-full overflow-hidden rounded-sm bg-[var(--foreground)]/40 ring-1 ring-inset ring-[var(--border)]/40";

const framedSurfaceClass =
  "relative w-full overflow-hidden rounded-sm bg-white ring-1 ring-inset ring-[var(--border)]/40";

const controlBaseClass =
  "inline-flex items-center justify-center rounded-sm border border-[var(--border)]/50 bg-[var(--primary)]/80 font-mono text-[var(--accent)] transition hover:border-[var(--accent)]/40";

function resolveItemAspectClass(item: GalleryMediaItem): string {
  if (item.aspectClass === "aspect-video") return "aspect-video";
  if (item.aspectClass === "aspect-[16/10]") return "aspect-[16/10]";
  return COVER_ASPECT_CLASS[item.aspectClass as keyof typeof COVER_ASPECT_CLASS] ?? "aspect-video";
}

export default function GalleryMediaSlider({
  items,
  label,
  resolveAspectClass,
  frameAspect,
  frameFit = "cover",
  compact = false,
}: Props) {
  const [index, setIndex] = useState(0);
  const item = items[index];

  const goPrev = useCallback(() => {
    setIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    setIndex((current) => (current === items.length - 1 ? 0 : current + 1));
  }, [items.length]);

  if (!item) return null;

  const frameStyle = frameAspect ? ({ aspectRatio: frameAspect } as CSSProperties) : undefined;
  const itemAspectStyle =
    !frameAspect && item.aspectRatio
      ? ({ aspectRatio: item.aspectRatio } as CSSProperties)
      : undefined;
  const aspectClass =
    frameAspect || item.aspectRatio
      ? undefined
      : resolveAspectClass(item) || resolveItemAspectClass(item);
  const surfaceClass =
    frameAspect && frameFit === "contain" ? framedSurfaceClass : mediaSurfaceClass;
  const fitClass = frameAspect
    ? frameFit === "contain"
      ? "absolute inset-0 h-full w-full object-contain object-center"
      : "absolute inset-0 h-full w-full object-cover object-center"
    : item.aspectRatio
      ? "h-full w-full object-contain object-center"
      : item.type === "video" || item.aspectClass === "square"
        ? "h-full w-full object-contain"
        : "h-full w-full object-cover";
  const controlsClass = compact
    ? `${controlBaseClass} h-8 w-8 text-[0.75rem]`
    : `${controlBaseClass} h-10 w-10`;

  return (
    <div className={`flex flex-col ${compact ? "gap-[var(--space-12)]" : "gap-[var(--space-16)]"}`}>
      <div
        className={`${surfaceClass}${aspectClass ? ` ${aspectClass}` : ""}`}
        style={{ ...frameStyle, ...itemAspectStyle }}
      >
        {item.type === "video" ? (
          <video
            className={fitClass}
            src={item.src}
            poster={item.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={label}
          >
            <track kind="captions" />
          </video>
        ) : (
          <img className={fitClass} src={item.src} alt="" aria-label={label} />
        )}
      </div>

      <div className="flex items-center justify-between gap-[var(--space-12)]">
        <button
          type="button"
          className={controlsClass}
          onClick={goPrev}
          aria-label="Previous slide"
        >
          ←
        </button>
        <span className="font-mono text-[var(--text-caption)] text-[var(--accent)]/60">
          {index + 1} / {items.length}
        </span>
        <button type="button" className={controlsClass} onClick={goNext} aria-label="Next slide">
          →
        </button>
      </div>

      {!compact && item.caption ? (
        <figcaption className={bodyClass}>{item.caption}</figcaption>
      ) : null}
    </div>
  );
}

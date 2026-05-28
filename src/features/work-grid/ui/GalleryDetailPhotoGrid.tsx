/**
 * ---metadata---
 * @file src/features/work-grid/ui/GalleryDetailPhotoGrid.tsx
 * @description Photo grid for gallery detail media. Supports explicit row maps per gallery item
 *              (portrait-row, pair-row, slider, triple-with-slider, video-row) or default sequential.
 * @last-updated 2026-05-28
 * @last-change compact triple-with-slider row — two images plus in-column carousel
 * ---end-metadata---
 */

"use client";

import type { CSSProperties } from "react";
import type { GalleryMediaItem, GalleryMediaRow } from "@/entities/gallery-item/types/gallery-item";
import GalleryMediaSlider from "@/features/work-grid/ui/GalleryMediaSlider";
import { COVER_ASPECT_CLASS } from "@/features/work-grid/model/grid-items";

type Props = {
  media: ReadonlyArray<GalleryMediaItem>;
  mediaRows?: ReadonlyArray<GalleryMediaRow>;
  label: string;
};

type RenderRow =
  | {
      kind: Exclude<
        GalleryMediaRow["kind"],
        "triple-with-slider" | "portrait-row" | "pair-row" | "slider"
      >;
      items: GalleryMediaItem[];
    }
  | {
      kind: "portrait-row" | "pair-row" | "slider";
      items: GalleryMediaItem[];
      frameAspect?: string;
      frameFit?: "cover" | "contain";
    }
  | {
      kind: "triple-with-slider";
      items: GalleryMediaItem[];
      sliderItems: GalleryMediaItem[];
    };

const bodyClass = "font-mono text-[var(--text-caption)] leading-[1.6] text-[var(--accent)]/70";

const mediaSurfaceClass =
  "relative w-full overflow-hidden rounded-sm bg-[var(--foreground)]/40 ring-1 ring-inset ring-[var(--border)]/40";

const rowGridClass: Record<
  Exclude<GalleryMediaRow["kind"], "slider" | "landscape" | "triple-with-slider">,
  string
> = {
  "portrait-row":
    "grid grid-cols-3 gap-x-[var(--space-16)] gap-y-[var(--space-32)] sm:gap-x-[var(--space-24)]",
  "pair-row":
    "grid grid-cols-2 gap-x-[var(--space-16)] gap-y-[var(--space-32)] sm:gap-x-[var(--space-24)]",
  "video-row":
    "grid grid-cols-2 gap-x-[var(--space-16)] gap-y-[var(--space-32)] sm:grid-cols-5 sm:gap-x-[var(--space-16)]",
};

const tripleRowClass =
  "grid grid-cols-3 gap-x-[var(--space-16)] gap-y-[var(--space-32)] sm:gap-x-[var(--space-24)]";

const FRAME_ASPECT_CLASS: Record<string, string> = {
  "4/5": "aspect-[4/5]",
  "9/16": "aspect-[9/16]",
  "16/9": "aspect-video",
};

function resolveFrameAspectClass(frameAspect: string): string {
  return FRAME_ASPECT_CLASS[frameAspect] ?? "aspect-video";
}

function isVerticalVideoSrc(src: string): boolean {
  const lower = src.toLowerCase();
  return /9x16|9-16|dikey|vertical|story|-reels\.|_reels\.|reels\.mp4/.test(lower);
}

function resolveItemAspect(
  item: GalleryMediaItem,
  frameAspect?: string,
): { className?: string; style?: CSSProperties } {
  if (frameAspect) {
    return { className: resolveFrameAspectClass(frameAspect) };
  }
  if (item.aspectRatio) {
    return { style: { aspectRatio: item.aspectRatio } as CSSProperties };
  }
  return { className: resolveAspectClass(item) };
}

function resolveItemFitClass(item: GalleryMediaItem, frameAspect?: string): string {
  if (frameAspect) return "object-cover object-center";
  if (item.aspectRatio || item.type === "video") return "object-contain object-center";
  return "object-cover";
}

function resolveAspectClass(item: GalleryMediaItem): string {
  if (item.type === "video" && (item.aspectClass === "portrait" || isVerticalVideoSrc(item.src))) {
    return "aspect-[9/16]";
  }
  if (item.aspectClass === "aspect-video") return "aspect-video";
  if (item.aspectClass === "aspect-[16/10]") return "aspect-[16/10]";
  return COVER_ASPECT_CLASS[item.aspectClass as keyof typeof COVER_ASPECT_CLASS] ?? "aspect-video";
}

function resolveMediaById(
  media: ReadonlyArray<GalleryMediaItem>,
): ReadonlyMap<string, GalleryMediaItem> {
  return new Map(media.map((item) => [item.id, item]));
}

function resolveRowItems(
  mediaById: ReadonlyMap<string, GalleryMediaItem>,
  mediaIds: ReadonlyArray<string>,
): GalleryMediaItem[] {
  return mediaIds.flatMap((id) => {
    const item = mediaById.get(id);
    return item ? [item] : [];
  });
}

function buildRowsFromContent(
  media: ReadonlyArray<GalleryMediaItem>,
  mediaRows: ReadonlyArray<GalleryMediaRow>,
): RenderRow[] {
  const mediaById = resolveMediaById(media);
  const rows: RenderRow[] = [];

  for (const row of mediaRows) {
    if (row.kind === "triple-with-slider") {
      const items = resolveRowItems(mediaById, row.mediaIds);
      const sliderItems = resolveRowItems(mediaById, row.sliderMediaIds);
      if (items.length === 0 || sliderItems.length === 0) continue;
      rows.push({ kind: "triple-with-slider", items, sliderItems });
      continue;
    }

    const items = resolveRowItems(mediaById, row.mediaIds);
    if (items.length === 0) continue;

    if (row.kind === "portrait-row" || row.kind === "pair-row" || row.kind === "slider") {
      rows.push({
        kind: row.kind,
        items,
        frameAspect: row.frameAspect,
        frameFit: row.kind === "slider" ? row.frameFit : undefined,
      });
      continue;
    }

    rows.push({ kind: row.kind, items });
  }

  return rows;
}

function isPortraitItem(item: GalleryMediaItem): boolean {
  if (
    item.aspectClass === "portrait" ||
    item.aspectClass === "tall" ||
    item.aspectClass === "square"
  ) {
    return true;
  }
  return item.type === "video" && isVerticalVideoSrc(item.src);
}

function buildSequentialRows(media: ReadonlyArray<GalleryMediaItem>): RenderRow[] {
  const rows: RenderRow[] = [];
  let portraitBuffer: GalleryMediaItem[] = [];

  const flushPortraitBuffer = () => {
    if (portraitBuffer.length === 0) return;
    rows.push({ kind: "portrait-row", items: portraitBuffer });
    portraitBuffer = [];
  };

  for (const item of media) {
    if (isPortraitItem(item)) {
      portraitBuffer.push(item);
      if (portraitBuffer.length === 3) {
        flushPortraitBuffer();
      }
      continue;
    }

    flushPortraitBuffer();
    rows.push({ kind: "landscape", items: [item] });
  }

  flushPortraitBuffer();

  return rows;
}

function MediaFigure({
  item,
  label,
  frameAspect,
}: {
  item: GalleryMediaItem;
  label: string;
  frameAspect?: string;
}) {
  const { className: aspectClass, style: aspectStyle } = resolveItemAspect(item, frameAspect);
  const fitClass = resolveItemFitClass(item, frameAspect);

  return (
    <figure className="flex flex-col gap-[var(--space-16)]">
      <div
        className={`${mediaSurfaceClass}${aspectClass ? ` ${aspectClass}` : ""}`}
        style={aspectStyle}
      >
        {item.type === "video" ? (
          <video
            className={`h-full w-full ${fitClass}`}
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
          <img className={`h-full w-full ${fitClass}`} src={item.src} alt="" aria-label={label} />
        )}
      </div>
      {item.caption ? <figcaption className={bodyClass}>{item.caption}</figcaption> : null}
    </figure>
  );
}

export default function GalleryDetailPhotoGrid({ media, mediaRows, label }: Props) {
  if (media.length === 0) return null;

  const rows =
    mediaRows && mediaRows.length > 0
      ? buildRowsFromContent(media, mediaRows)
      : buildSequentialRows(media);

  return (
    <section aria-label="Project gallery">
      <div className="flex flex-col gap-[var(--space-48)]">
        {rows.map((row, rowIndex) => {
          if (row.kind === "slider") {
            return (
              <GalleryMediaSlider
                key={`slider-${row.items.map((item) => item.id).join("-")}-${rowIndex}`}
                items={row.items}
                label={label}
                resolveAspectClass={resolveAspectClass}
                frameAspect={row.frameAspect}
                frameFit={row.frameFit}
              />
            );
          }

          if (row.kind === "triple-with-slider") {
            return (
              <div key={`triple-with-slider-${rowIndex}`} className={tripleRowClass}>
                {row.items.map((item) => (
                  <MediaFigure key={item.id} item={item} label={label} />
                ))}
                <GalleryMediaSlider
                  items={row.sliderItems}
                  label={label}
                  resolveAspectClass={resolveAspectClass}
                  compact
                />
              </div>
            );
          }

          if (row.kind === "landscape") {
            const item = row.items[0];
            if (!item) return null;
            return (
              <div key={`landscape-${item.id}`} className="w-full">
                <MediaFigure item={item} label={label} />
              </div>
            );
          }

          const frameAspect =
            row.kind === "portrait-row" || row.kind === "pair-row" ? row.frameAspect : undefined;

          return (
            <div
              key={`${row.kind}-${row.items.map((item) => item.id).join("-")}-${rowIndex}`}
              className={rowGridClass[row.kind]}
            >
              {row.items.map((item) => (
                <MediaFigure key={item.id} item={item} label={label} frameAspect={frameAspect} />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

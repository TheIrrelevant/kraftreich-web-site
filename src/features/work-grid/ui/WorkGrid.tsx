/**
 * ---metadata---
 * @file src/features/work-grid/ui/WorkGrid.tsx
 * @description Work grid — scrolls up over IdentityStrip (Z_HOME_GRID > Z_HOME_STRIP). Three columns
 *              (About Me, Work, Art) with category headers and stacked project cells. Dark overlay
 *              by default; hover on a column reveals full colour and autoplays muted cover videos.
 * @last-updated 2026-05-28
 * @last-change video grid covers with muted autoplay on column hover
 * ---end-metadata---
 */

"use client";

import { useState } from "react";
import AboutMeCoverMedia from "@/features/work-grid/ui/AboutMeCoverMedia";
import GridCoverMedia from "@/features/work-grid/ui/GridCoverMedia";
import {
  ABOUT_ME_SLUG,
  opensGalleryDetail,
  type GridColumn,
} from "@/features/work-grid/model/grid-items";
import type { AboutMeExperience } from "@/entities/about-me/types/about-me";
import {
  HOME_GRID_OVERLAY_HOVER_BOOST,
  HOME_GRID_OVERLAY_OPACITY,
  HOME_SECTION_X_PADDING_CLASS,
  HOME_THREE_COLUMN_GRID_CLASS,
  Z_HOME_GRID,
} from "@/shared/constants/home-layers";
import { useGalleryCatalog } from "@/shared/lib/gallery-catalog/gallery-catalog-context";
import type { CSSProperties } from "react";

function GridCell({
  slug,
  description,
  experience,
  coverAspectRatio,
  coverVideoAspectRatio,
  coverImage,
  coverGif,
  coverVideo,
  coverSlides,
  isColumnActive,
  isSelected,
  isInteractive,
  onSelect,
}: {
  slug: string;
  description: string;
  experience?: ReadonlyArray<AboutMeExperience>;
  coverAspectRatio: string;
  coverVideoAspectRatio?: string;
  coverImage?: string;
  coverGif?: string;
  coverVideo?: string;
  coverSlides?: ReadonlyArray<string>;
  isColumnActive: boolean;
  isSelected: boolean;
  isInteractive: boolean;
  onSelect: (slug: string) => void;
}) {
  const cover =
    slug === ABOUT_ME_SLUG ? (
      <AboutMeCoverMedia
        slides={coverSlides ?? []}
        coverAspectRatio={coverAspectRatio}
        coverImage={coverImage}
      />
    ) : (
      <GridCoverMedia
        coverAspectRatio={coverAspectRatio}
        coverVideoAspectRatio={coverVideoAspectRatio}
        coverImage={coverImage}
        coverGif={coverGif}
        coverVideo={coverVideo}
        isColumnActive={isColumnActive}
        isSelected={isSelected}
      />
    );
  const copy = (
    <p
      className={
        slug === ABOUT_ME_SLUG
          ? "relative z-20 font-mono text-[var(--text-caption)] leading-[1.5] text-[var(--accent)]/70"
          : "relative z-20 line-clamp-2 font-mono text-[var(--text-caption)] leading-[1.5] text-[var(--accent)]/70"
      }
    >
      {description}
    </p>
  );

  const experienceList =
    slug === ABOUT_ME_SLUG && experience && experience.length > 0 ? (
      <ul className="relative z-20 mt-[var(--space-16)] flex flex-col gap-[var(--space-8)] font-mono text-[11px] leading-[1.5] text-[var(--accent)]/70">
        {experience.map((entry) => (
          <li key={`${entry.yearLabel}-${entry.company}`}>
            {entry.yearLabel}-{entry.company} | {entry.title}
          </li>
        ))}
      </ul>
    ) : null;

  if (!isInteractive) {
    return (
      <article id={slug} className="relative flex flex-col gap-[var(--space-16)]">
        {cover}
        {copy}
        {experienceList}
      </article>
    );
  }

  return (
    <button
      type="button"
      id={slug}
      onClick={() => onSelect(slug)}
      aria-pressed={isSelected}
      className="group/cell flex w-full flex-col gap-[var(--space-16)] text-left outline-none focus-visible:ring-1 focus-visible:ring-[var(--secondary)]"
    >
      {cover}
      {copy}
    </button>
  );
}

type Props = {
  columns: ReadonlyArray<GridColumn>;
  selectedSlug?: string | null;
  onSelect?: (slug: string) => void;
};

export default function WorkGrid({ columns, selectedSlug = null, onSelect }: Props) {
  const catalog = useGalleryCatalog();
  const [hoveredColumnId, setHoveredColumnId] = useState<string | null>(null);
  const sectionStyle = {
    zIndex: Z_HOME_GRID,
    "--grid-overlay-opacity": HOME_GRID_OVERLAY_OPACITY,
    "--grid-overlay-hover-boost": HOME_GRID_OVERLAY_HOVER_BOOST,
  } as CSSProperties;

  return (
    <section
      style={sectionStyle}
      className={`work-grid relative bg-[var(--primary)] ${HOME_SECTION_X_PADDING_CLASS} pb-[var(--space-96)]`}
      aria-label="Work grid"
    >
      <div className={`${HOME_THREE_COLUMN_GRID_CLASS} gap-y-[var(--space-64)]`}>
        {columns.map((column) => {
          const isColumnActive = hoveredColumnId === column.id;

          return (
            <div
              key={column.id}
              className="work-grid-column relative flex flex-col gap-[var(--space-64)]"
              onMouseEnter={() => setHoveredColumnId(column.id)}
              onMouseLeave={() => setHoveredColumnId(null)}
            >
              <div className="work-grid-column-overlay" aria-hidden />

              <h2 className="relative z-20 font-mono text-[15px] leading-[1.6] text-[var(--secondary)]">
                {column.title}
              </h2>

              <div className="relative flex flex-col gap-[var(--space-48)] md:gap-[var(--space-64)]">
                {column.items.map((item) => (
                  <GridCell
                    key={item.slug}
                    slug={item.slug}
                    description={item.description}
                    experience={item.experience}
                    coverAspectRatio={item.coverAspectRatio}
                    coverVideoAspectRatio={item.coverVideoAspectRatio}
                    coverImage={item.coverImage}
                    coverGif={item.coverGif}
                    coverVideo={item.coverVideo}
                    coverSlides={item.coverSlides}
                    isColumnActive={isColumnActive}
                    isSelected={selectedSlug === item.slug}
                    isInteractive={opensGalleryDetail(item.slug, catalog)}
                    onSelect={onSelect ?? (() => undefined)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

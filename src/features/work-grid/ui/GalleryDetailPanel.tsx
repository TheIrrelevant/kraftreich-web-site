/**
 * ---metadata---
 * @file src/features/work-grid/ui/GalleryDetailPanel.tsx
 * @description Gallery detail panel — hero media on top, copy in the middle, gallery stack at bottom.
 * @last-updated 2026-05-28
 * @last-change render gallery item detail content from loaded markdown catalog
 * ---end-metadata---
 */

"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { GalleryItemDetail } from "@/entities/gallery-item/types/gallery-item";
import { type GridItemWithCategory } from "@/features/work-grid/model/grid-items";
import {
  GALLERY_DETAIL_VINYL_LAYER_ID,
  Z_HOME_GALLERY_DETAIL,
  Z_HOME_GALLERY_DETAIL_BACKDROP,
  Z_HOME_GALLERY_DETAIL_CLOSE,
  Z_HOME_GALLERY_DETAIL_PANEL,
  Z_HOME_GALLERY_DETAIL_VINYL,
} from "@/shared/constants/home-layers";
import GalleryDetailPhotoGrid from "@/features/work-grid/ui/GalleryDetailPhotoGrid";
import Heading from "@/shared/ui/Heading";

type Props = {
  item: GridItemWithCategory;
  detail: GalleryItemDetail;
  onClose: () => void;
};

const bodyClass = "font-mono text-[var(--text-caption)] leading-[1.6] text-[var(--accent)]/70";

const sectionTitleClass =
  "font-mono text-[var(--text-body-sm)] leading-[1.6] text-[var(--secondary)]";

const mediaSurfaceClass =
  "relative w-full overflow-hidden rounded-sm bg-[var(--foreground)]/40 ring-1 ring-inset ring-[var(--border)]/40";

function DetailDivider() {
  return <hr className="border-0 border-t border-[var(--accent)]/20" />;
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className={sectionTitleClass}>{title}</h3>
      <div className="mt-[var(--space-32)]">{children}</div>
    </section>
  );
}

function TwoColumnBody({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid gap-[var(--space-48)] md:grid-cols-2 md:gap-x-[var(--space-64)]">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

function inferVideoAspectRatio(src: string): string {
  const lower = src.toLowerCase();
  if (/9x16|9-16|dikey|vertical|story|-reels\.|reels\.mp4|season-reel/.test(lower)) return "9/16";
  if (/16x9|16-9|yatay|widescreen|hero\.mp4/.test(lower)) return "16/9";
  return "16/9";
}

function resolveHeroAspectRatio(detail: GalleryItemDetail, coverAspectRatio: string): string {
  const { hero } = detail;

  if (hero.type === "image" && hero.src === detail.coverImage) {
    return coverAspectRatio;
  }

  if (hero.type === "video") {
    return inferVideoAspectRatio(hero.src);
  }

  return coverAspectRatio;
}

function HeroMedia({ detail, aspectRatio }: { detail: GalleryItemDetail; aspectRatio: string }) {
  const { hero } = detail;
  const fitClass =
    hero.type === "video" && aspectRatio === "9/16" ? "object-contain" : "object-cover";

  if (hero.type === "video") {
    return (
      <video
        className={`h-full w-full ${fitClass}`}
        src={hero.src}
        poster={hero.poster}
        controls
        playsInline
        preload="metadata"
      >
        <track kind="captions" />
      </video>
    );
  }

  return <img className={`h-full w-full ${fitClass}`} src={hero.src} alt="" />;
}

export default function GalleryDetailPanel({ item, detail, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const heroAspectRatio = resolveHeroAspectRatio(detail, item.coverAspectRatio);
  const heroFrameStyle = { aspectRatio: heroAspectRatio } as CSSProperties;

  useEffect(() => {
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="gallery-detail-root fixed inset-0"
      style={{ zIndex: Z_HOME_GALLERY_DETAIL }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--primary)]/60 backdrop-blur-[1px]"
        style={{ zIndex: Z_HOME_GALLERY_DETAIL_BACKDROP }}
        onClick={onClose}
        aria-label="Close gallery detail"
      />

      <div
        id={GALLERY_DETAIL_VINYL_LAYER_ID}
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: Z_HOME_GALLERY_DETAIL_VINYL }}
        aria-hidden
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="fixed left-[var(--space-48)] top-[var(--space-48)] font-mono text-[var(--text-body-sm)] leading-[1.6] text-[var(--secondary)] transition-opacity hover:opacity-70"
        style={{ zIndex: Z_HOME_GALLERY_DETAIL_CLOSE }}
      >
        Close
      </button>

      <aside
        className="gallery-detail-panel relative ml-auto flex h-full w-full flex-col overflow-y-auto bg-[var(--primary)] md:w-[72%] lg:max-w-[68rem]"
        style={{ zIndex: Z_HOME_GALLERY_DETAIL_PANEL }}
      >
        <div className="shrink-0 p-[var(--space-16)] md:p-[var(--space-24)]">
          <div
            className={mediaSurfaceClass}
            style={heroFrameStyle}
            aria-label={`${item.title} hero media`}
          >
            <HeroMedia detail={detail} aspectRatio={heroAspectRatio} />
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-64)] px-[var(--space-48)] pb-[var(--space-48)] pt-[var(--space-24)]">
          <header>
            <div className="flex items-start justify-between gap-[var(--space-48)]">
              <Heading as="h2" size="h2" id="gallery-detail-title">
                {item.title}
              </Heading>
              <span className={`${bodyClass} shrink-0 pt-[var(--space-8)]`}>
                {detail.yearLabel}
              </span>
            </div>

            <TwoColumnBody
              left={
                <p className={`${bodyClass} mt-[var(--space-24)]`}>Timeline: {detail.timeline}</p>
              }
              right={
                <p className={`${bodyClass} mt-[var(--space-24)] md:text-right`}>
                  Platform: {detail.platform}
                </p>
              }
            />
          </header>

          <DetailDivider />

          <DetailSection title="My deliverables">
            <TwoColumnBody
              left={
                <ol className="list-decimal space-y-[var(--space-24)] pl-[var(--space-24)] marker:text-[var(--accent)]/60">
                  {detail.deliverables.map((entry) => (
                    <li key={entry} className={bodyClass}>
                      {entry}
                    </li>
                  ))}
                </ol>
              }
              right={
                <div className="space-y-[var(--space-24)]">
                  <p className={bodyClass}>{detail.tools}</p>
                  <p className={bodyClass}>{detail.deliverablesIntro}</p>
                  {detail.deliverablesExtra ? (
                    <p className={bodyClass}>{detail.deliverablesExtra}</p>
                  ) : null}
                </div>
              }
            />
          </DetailSection>

          <DetailDivider />

          <DetailSection title="Team">
            <TwoColumnBody
              left={
                detail.team.length > 0 ? (
                  <ul className="space-y-[var(--space-24)]">
                    {detail.team.map((member) => (
                      <li key={member.id} className={bodyClass}>
                        {member.name}, {member.role}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={bodyClass}>Solo project</p>
                )
              }
              right={
                <div className="space-y-[var(--space-24)]">
                  <p className={bodyClass}>{detail.teamNarrative}</p>
                  <p className={`${bodyClass} text-[var(--accent)]/60`}>{detail.teamAttribution}</p>
                </div>
              }
            />
          </DetailSection>

          <DetailDivider />

          <section>
            <p className="max-w-[48rem] font-mono text-[var(--text-body-sm)] leading-[1.6] text-[var(--secondary)] md:text-[length:var(--text-h3)] md:leading-[1.4]">
              {detail.summaryStatement}
            </p>

            <div className="mt-[var(--space-48)]">
              <TwoColumnBody
                left={
                  <p className={bodyClass}>
                    <span className="text-[var(--secondary)]">Problem:</span> {detail.problem}
                  </p>
                }
                right={
                  <p className={bodyClass}>
                    <span className="text-[var(--secondary)]">Solution:</span> {detail.solution}
                  </p>
                }
              />
            </div>
          </section>
        </div>

        <div className="px-[var(--space-48)] pb-[var(--space-96)] pt-[var(--space-16)]">
          <GalleryDetailPhotoGrid
            media={detail.galleryMedia}
            mediaRows={detail.galleryMediaRows}
            label={`${item.title} gallery media`}
          />
        </div>
      </aside>
    </div>
  );
}

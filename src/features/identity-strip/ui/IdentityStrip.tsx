/**
 * ---metadata---
 * @file src/features/identity-strip/ui/IdentityStrip.tsx
 * @description Identity strip — sticky top-0. Text at Z_HOME_STRIP (grid covers on scroll).
 *              vinylSlot is a layout mount only; VinylParticles portals above the grid.
 * @last-updated 2026-05-28
 * @last-change align identity strip to shared 3-column home grid (matches WorkGrid)
 * ---end-metadata---
 */

import { type ReactNode } from "react";
import {
  IDENTITY_EMAIL,
  IDENTITY_LOCATION,
  IDENTITY_NAME,
  IDENTITY_TITLE,
} from "@/features/identity-strip/model/identity";
import type { GalleryIndexItem } from "@/features/identity-strip/model/gallery-index";
import {
  HOME_SECTION_X_PADDING_CLASS,
  HOME_THREE_COLUMN_GRID_CLASS,
  Z_HOME_STRIP,
} from "@/shared/constants/home-layers";

const INDEX_GRID_CLASS =
  "grid w-full grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)] items-baseline gap-x-[var(--space-16)]";

const INDEX_ROW_CLASS = `${INDEX_GRID_CLASS} whitespace-nowrap`;

const INDEX_MUTED_CLASS = "text-[var(--accent)]/60";

const INDEX_LIST_CLASS =
  "relative min-w-0 font-mono text-[0.6875rem] leading-[1.35] md:text-[0.6875rem]";

function formatIndexYear(year: string): string {
  if (year === "\u2014") return year;
  return year.replace(/\b(\d{4})\b/g, (_, fullYear: string) => fullYear.slice(-2));
}

function formatSkillsLine(raw: string): string {
  return raw
    .replace(/\s*·\s*/g, ", ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\n+/g, "\n")
    .trim();
}

export default function IdentityStrip({
  galleryIndex,
  skills,
  muteSlot,
  vinylSlot,
  assemblySlot,
}: {
  galleryIndex: ReadonlyArray<GalleryIndexItem>;
  skills: string;
  muteSlot?: ReactNode;
  vinylSlot?: ReactNode;
  assemblySlot?: ReactNode;
}) {
  return (
    <section
      className={`sticky top-0 bg-[var(--primary)] ${HOME_SECTION_X_PADDING_CLASS} pb-[var(--space-64)] pt-[var(--space-32)] text-[var(--secondary)]`}
    >
      <div className={`${HOME_THREE_COLUMN_GRID_CLASS} gap-y-[var(--space-32)] md:gap-y-0`}>
        <div className="flex min-h-0 min-w-0 flex-col">
          <div className="relative min-w-0" style={{ zIndex: Z_HOME_STRIP }}>
            <div className="text-[var(--secondary)]">{IDENTITY_NAME}</div>
            <a
              href={`mailto:${IDENTITY_EMAIL}`}
              className="text-[var(--accent)]/60 transition-colors hover:text-[var(--secondary)]"
            >
              {IDENTITY_EMAIL}
            </a>
            {muteSlot ? <div className="mt-[var(--space-8)]">{muteSlot}</div> : null}
          </div>
          {vinylSlot ? (
            <div className="relative mt-[var(--space-16)] min-h-[14rem] w-full flex-1">
              {vinylSlot}
            </div>
          ) : null}
        </div>

        <div className="relative min-w-0" style={{ zIndex: Z_HOME_STRIP }}>
          <div className="text-[var(--secondary)]">{IDENTITY_TITLE}</div>
          <div className="text-[var(--accent)]/60">{IDENTITY_LOCATION}</div>
          {assemblySlot}
        </div>

        <ul className={INDEX_LIST_CLASS} style={{ zIndex: Z_HOME_STRIP }}>
          {galleryIndex.map((item) => (
            <li key={item.slug} className={INDEX_ROW_CLASS}>
              <span className={`shrink-0 tabular-nums ${INDEX_MUTED_CLASS}`}>
                {formatIndexYear(item.year)}
              </span>
              <span className="min-w-0 truncate text-[var(--secondary)]">{item.label}</span>
              <span className={`min-w-0 truncate ${INDEX_MUTED_CLASS}`}>{item.tags}</span>
            </li>
          ))}
          <li className={`${INDEX_GRID_CLASS} mt-[var(--space-32)] items-start`}>
            <span className={`shrink-0 ${INDEX_MUTED_CLASS}`}>Skills</span>
            <p className="col-start-2 col-span-2 min-w-0 whitespace-pre-line text-[var(--secondary)]">
              {formatSkillsLine(skills)}
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}

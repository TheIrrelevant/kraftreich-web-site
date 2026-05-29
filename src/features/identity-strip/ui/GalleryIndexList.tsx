/**
 * ---metadata---
 * @file src/features/identity-strip/ui/GalleryIndexList.tsx
 * @description Clickable gallery index rows for IdentityStrip. Scrolls to the matching grid cell
 *              by slug without opening the gallery detail panel.
 * @last-updated 2026-05-29
 * ---end-metadata---
 */

"use client";

import type { GalleryIndexItem } from "@/features/identity-strip/model/gallery-index";
import { Z_HOME_STRIP } from "@/shared/constants/home-layers";

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

function scrollToGalleryItem(slug: string): void {
  const target = document.getElementById(slug);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

type Props = {
  items: ReadonlyArray<GalleryIndexItem>;
  skills: string;
};

function formatSkillsLine(raw: string): string {
  return raw
    .replace(/\s*·\s*/g, ", ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\n+/g, "\n")
    .trim();
}

export default function GalleryIndexList({ items, skills }: Props) {
  return (
    <ul className={INDEX_LIST_CLASS} style={{ zIndex: Z_HOME_STRIP }}>
      {items.map((item) => (
        <li key={item.slug}>
          <a
            href={`#${item.slug}`}
            onClick={(event) => {
              event.preventDefault();
              scrollToGalleryItem(item.slug);
            }}
            className={`${INDEX_ROW_CLASS} block rounded-sm text-inherit no-underline outline-none transition-opacity hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[var(--secondary)]`}
          >
            <span className={`shrink-0 tabular-nums ${INDEX_MUTED_CLASS}`}>
              {formatIndexYear(item.year)}
            </span>
            <span className="min-w-0 truncate text-[var(--secondary)]">{item.label}</span>
            <span className={`min-w-0 truncate ${INDEX_MUTED_CLASS}`}>{item.tags}</span>
          </a>
        </li>
      ))}
      <li className={`${INDEX_GRID_CLASS} mt-[var(--space-32)] items-start`}>
        <span className={`shrink-0 ${INDEX_MUTED_CLASS}`}>Skills</span>
        <p className="col-start-2 col-span-2 min-w-0 whitespace-pre-line text-[var(--secondary)]">
          {formatSkillsLine(skills)}
        </p>
      </li>
    </ul>
  );
}

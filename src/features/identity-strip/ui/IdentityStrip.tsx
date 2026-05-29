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
import GalleryIndexList from "@/features/identity-strip/ui/GalleryIndexList";
import IdentityIconRow from "@/features/identity-strip/ui/IdentityIconRow";
import {
  HOME_SECTION_X_PADDING_CLASS,
  HOME_THREE_COLUMN_GRID_CLASS,
  Z_HOME_STRIP,
} from "@/shared/constants/home-layers";

export default function IdentityStrip({
  galleryIndex,
  skills,
  vinylSlot,
  assemblySlot,
}: {
  galleryIndex: ReadonlyArray<GalleryIndexItem>;
  skills: string;
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
            <IdentityIconRow />
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

        <GalleryIndexList items={galleryIndex} skills={skills} />
      </div>
    </section>
  );
}

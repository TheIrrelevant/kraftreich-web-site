/**
 * ---metadata---
 * @file src/features/identity-strip/ui/IdentityStrip.tsx
 * @description Identity strip — sticky top-0. Text at Z_HOME_STRIP (grid covers on scroll).
 *              vinylSlot is a layout mount only; VinylParticles portals above the grid.
 * @last-updated 2026-05-26
 * @last-change vinyl mount spacer only; particles render via body portal
 * ---end-metadata---
 */

import { type ReactNode } from "react";
import { IDENTITY_EMAIL, IDENTITY_NAME } from "@/features/identity-strip/model/identity";
import { GALLERY_INDEX } from "@/features/identity-strip/model/gallery-index";
import { Z_HOME_STRIP } from "@/shared/constants/home-layers";

export default function IdentityStrip({
  muteSlot,
  vinylSlot,
}: {
  muteSlot?: ReactNode;
  vinylSlot?: ReactNode;
}) {
  return (
    <section className="sticky top-0 bg-[var(--primary)] px-[var(--space-48)] pt-[var(--space-32)] text-[var(--secondary)]">
      <div className="grid grid-cols-12 items-stretch gap-x-[var(--space-48)] gap-y-[var(--space-32)] font-mono text-[var(--text-body-sm)] leading-[1.6]">
        <div className="col-span-12 flex min-h-0 flex-col md:col-span-3">
          <div className="relative" style={{ zIndex: Z_HOME_STRIP }}>
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

        <div className="relative col-span-12 md:col-span-4" style={{ zIndex: Z_HOME_STRIP }}>
          <div className="text-[var(--secondary)]">Designer, Artist &amp; LLM Engineer</div>
          <div className="text-[var(--accent)]/60">Istanbul, Turkey</div>
        </div>

        <ul className="relative col-span-12 md:col-span-5" style={{ zIndex: Z_HOME_STRIP }}>
          {GALLERY_INDEX.map((item) => (
            <li
              key={item.slug}
              className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-[var(--space-24)]"
            >
              <span className="text-[var(--accent)]/60 tabular-nums">{item.year}</span>
              <span className="text-[var(--secondary)]">{item.slug}</span>
              <span className="text-[var(--accent)]/60">{item.tags}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

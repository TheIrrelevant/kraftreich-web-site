/**
 * ---metadata---
 * @file src/features/identity-strip/ui/IdentityStrip.tsx
 * @description Identity strip — sticky top-0, lowest home layer (Z_HOME_STRIP). Stays pinned while
 *              WorkGrid (Z_HOME_GRID) scrolls up over it with opaque bg (zegzulka overlay scroll).
 * @last-updated 2026-05-26
 * @last-change remove bottom padding; grid sits flush under strip content
 * ---end-metadata---
 */

import { Z_HOME_STRIP } from "@/shared/constants/home-layers";
import { GALLERY_INDEX } from "@/features/identity-strip/model/gallery-index";

export default function IdentityStrip() {
  return (
    <section
      className="sticky top-0 bg-[var(--primary)] px-[var(--space-48)] pt-[var(--space-32)] text-[var(--secondary)]"
      style={{ zIndex: Z_HOME_STRIP }}
    >
      <div className="grid grid-cols-12 gap-x-[var(--space-48)] gap-y-[var(--space-32)] font-mono text-[var(--text-body-sm)] leading-[1.6]">
        <div className="col-span-12 flex flex-col gap-[var(--space-16)] md:col-span-3">
          <div className="text-[var(--secondary)]">Ugur Ozkan</div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className="text-[var(--secondary)]">Designer, Artist &amp; LLM Engineer</div>
          <div className="text-[var(--accent)]/60">Istanbul, Turkey</div>
        </div>

        <ul className="col-span-12 md:col-span-5">
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

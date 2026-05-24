/**
 * ---metadata---
 * @file src/features/identity-strip/ui/IdentityStrip.tsx
 * @description Identity strip rendered directly below the hero. Three columns: name + email,
 *              role + location, and the gallery index table. Monospace, terminal-density,
 *              archive-feel. Server Component — accepts an optional `audioSlot` so the audio
 *              mute toggle can live structurally inside the strip without breaching the
 *              cross-feature import rule (page.tsx composes the slot).
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

import { type ReactNode } from "react";
import { GALLERY_INDEX } from "@/features/identity-strip/model/gallery-index";

export default function IdentityStrip({ audioSlot }: { audioSlot?: ReactNode }) {
  return (
    <section className="sticky top-0 z-20 bg-[var(--primary)] text-[var(--secondary)] px-[var(--space-48)] pt-[var(--space-32)] pb-[var(--space-32)]">
      <div className="grid grid-cols-12 gap-x-[var(--space-48)] gap-y-[var(--space-32)] font-mono text-[var(--text-body-sm)] leading-[1.6]">
        {/* Left — identity */}
        <div className="col-span-12 flex flex-col gap-[var(--space-16)] md:col-span-3">
          <div className="text-[var(--secondary)]">Ugur Ozkan</div>
          {audioSlot}
        </div>

        {/* Center — role + location */}
        <div className="col-span-12 md:col-span-4">
          <div className="text-[var(--secondary)]">Designer, Artist &amp; LLM Engineer</div>
          <div className="text-[var(--accent)]/60">Istanbul, Turkey</div>
        </div>

        {/* Right — gallery index */}
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

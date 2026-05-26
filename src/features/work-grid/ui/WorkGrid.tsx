/**
 * ---metadata---
 * @file src/features/work-grid/ui/WorkGrid.tsx
 * @description Work grid — scrolls up over IdentityStrip (Z_HOME_GRID > Z_HOME_STRIP). Opaque
 *              bg-primary always covers the strip; no section-level opacity fade (particles removed).
 * @last-updated 2026-05-26
 * @last-change remove scroll opacity fade; strip was bleeding through transparent grid bg
 * ---end-metadata---
 */

import { Z_HOME_GRID } from "@/shared/constants/home-layers";
import { GRID_ITEMS } from "@/features/work-grid/model/grid-items";

export default function WorkGrid() {
  return (
    <section
      style={{ zIndex: Z_HOME_GRID }}
      className="relative bg-[var(--primary)] px-[var(--space-48)] pb-[var(--space-96)]"
      aria-label="Work grid"
    >
      <div className="grid grid-cols-1 gap-x-[var(--space-48)] gap-y-[var(--space-64)] md:grid-cols-3">
        {GRID_ITEMS.map((item) => (
          <article key={item.slug} id={item.slug} className="flex flex-col gap-[var(--space-16)]">
            <h3 className="font-mono text-[var(--text-body-sm)] leading-[1.6] text-[var(--secondary)]">
              {item.title}
            </h3>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-[var(--foreground)]/40 ring-1 ring-inset ring-[var(--border)]/40" />
            <p className="line-clamp-2 font-mono text-[var(--text-caption)] leading-[1.5] text-[var(--accent)]/70">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

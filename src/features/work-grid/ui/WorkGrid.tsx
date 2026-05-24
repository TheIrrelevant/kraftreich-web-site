/**
 * ---metadata---
 * @file src/features/work-grid/ui/WorkGrid.tsx
 * @description 5-row x 3-column work grid that reveals in sync with the hero particle morph.
 *              Opacity is driven by the same scrollY distance used in HomeHero (0..600px) so the
 *              grid fades in 0->1 while the particles compact into the left-edge sphere. Each cell
 *              shows a title above a 16:10 placeholder cover and a max-two-line description below.
 *              The cells are anchored DOM ids matching the IdentityStrip gallery list so a future
 *              link-to-scroll behaviour can attach without restructuring.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { GRID_ITEMS } from "@/features/work-grid/model/grid-items";

const REVEAL_SCROLL_PX = 600;

export default function WorkGrid() {
  const { scrollY } = useScroll();
  // Monotonic ratchet so the grid does not fade back out when the user scrolls back to the top —
  // matches the hero particle morph's one-way reveal. Drives a motion value directly instead of
  // useTransform because the mapping is conditional (only increases) rather than purely reactive.
  const opacity = useMotionValue(0);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const t = latest / REVEAL_SCROLL_PX;
    const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
    if (clamped > opacity.get()) {
      opacity.set(clamped);
    }
  });

  return (
    <motion.section
      style={{ opacity }}
      className="relative z-10 px-[var(--space-48)] pb-[var(--space-96)]"
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
    </motion.section>
  );
}

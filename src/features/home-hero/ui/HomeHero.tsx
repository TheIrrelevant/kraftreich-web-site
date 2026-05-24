/**
 * ---metadata---
 * @file src/features/home-hero/ui/HomeHero.tsx
 * @description Hero — a permanently full-viewport, fixed canvas of free-scattered video-driven
 *              particles. The canvas itself is never CSS-transformed. Scroll progress (0→1 over
 *              COMPACT_SCROLL_PX) is written into a ref that the R3F scene reads each frame to
 *              lerp particle world-positions from a loose viewport-wide scatter into a tight
 *              sphere anchored at the left edge of the viewport (half-clipped). IdentityStrip
 *              sits sticky on top via a higher z-index — particles render behind it. The work
 *              grid lives in normal document flow below a 100vh idle gap so it scrolls in over
 *              the particle field as the morph progresses; grid opacity fades in over the same
 *              0..COMPACT_SCROLL_PX distance.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import AudioParticleCloud from "@/features/audio-particle-cloud/ui/AudioParticleCloud";
import WorkGrid from "@/features/work-grid/ui/WorkGrid";

// Scroll distance (px) over which particles fully converge into the sphere.
const COMPACT_SCROLL_PX = 600;

export default function HomeHero() {
  const { scrollY } = useScroll();

  // On every page load, force scroll back to the top so a browser-restored scroll position
  // does not immediately drive the morph ratchet into the sphere state — the user should
  // always see the scatter on first paint.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // morphRef is read inside the R3F useFrame loop every frame — no React re-renders per scroll.
  // Monotonic ratchet: once a higher progress value is reached, scrolling back up never reverts
  // the sphere into the scatter. The morph is a one-way reveal for the lifetime of the page.
  const morphRef = useRef(0);
  // Mirror of morphRef as a motion value so the idle gap can collapse from 50vh to 0 as the
  // morph progresses. Mirroring (rather than reading the ref) lets the gap react to scroll
  // through framer-motion's direct DOM updates with no React re-renders per frame.
  const morphValue = useMotionValue(0);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const t = latest / COMPACT_SCROLL_PX;
    const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
    if (clamped > morphRef.current) {
      morphRef.current = clamped;
      morphValue.set(clamped);
    }
  });
  const idleGapHeight = useTransform(morphValue, [0, 1], ["50vh", "0vh"]);

  return (
    <>
      {/* Particle field is the topmost visual layer — the canvas is transparent everywhere except
          the white dots and the compacted sphere, so IdentityStrip + grid text remain legible
          and the sphere reads as a vinyl-style bleed over them. */}
      <section className="fixed inset-0 z-30 pointer-events-none">
        <AudioParticleCloud morphRef={morphRef} />
      </section>
      {/* Idle gap collapses as the morph progresses — at morph=1 the gap is 0vh, so on a
          scroll-back-to-top the grid stays seated directly under the IdentityStrip with the
          locked sphere as the left-edge bleed. */}
      <motion.div aria-hidden style={{ height: idleGapHeight }} />
      <WorkGrid />
    </>
  );
}

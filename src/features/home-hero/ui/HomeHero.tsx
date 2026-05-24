/**
 * ---metadata---
 * @file src/features/home-hero/ui/HomeHero.tsx
 * @description Hero — a permanently full-viewport, fixed canvas of free-scattered video-driven
 *              particles. The canvas itself is never CSS-transformed. Scroll progress (0→1 over
 *              COMPACT_SCROLL_PX) is written into a ref that the R3F scene reads each frame to
 *              lerp particle world-positions from a loose viewport-wide scatter into a tight
 *              sphere anchored at the left edge of the viewport (half-clipped). IdentityStrip
 *              sits sticky on top via a higher z-index — particles render behind it.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef } from "react";
import AudioParticleCloud from "@/features/audio-particle-cloud/ui/AudioParticleCloud";

// Scroll distance (px) over which particles fully converge into the sphere.
const COMPACT_SCROLL_PX = 600;

export default function HomeHero() {
  const { scrollY } = useScroll();

  // morphRef is read inside the R3F useFrame loop every frame — no React re-renders per scroll.
  const morphRef = useRef(0);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const t = latest / COMPACT_SCROLL_PX;
    morphRef.current = t < 0 ? 0 : t > 1 ? 1 : t;
  });

  return (
    <>
      <section className="fixed inset-0 z-0">
        <AudioParticleCloud morphRef={morphRef} />
      </section>
      {/* Scroll room so the user has enough vertical distance to trigger the full morph. */}
      <div aria-hidden className="h-[200vh]" />
    </>
  );
}

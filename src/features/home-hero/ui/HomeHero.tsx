/**
 * ---metadata---
 * @file src/features/home-hero/ui/HomeHero.tsx
 * @description Full-viewport hero — audio-reactive video-particle screen over the primary canvas.
 *              The video source feeds a particle grid (see AudioParticleCloud); it is never shown
 *              directly. The cloud silhouettes whatever the video frames carry.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

import AudioParticleCloud from "@/features/audio-particle-cloud/ui/AudioParticleCloud";

export default function HomeHero() {
  return (
    <section className="relative isolate h-screen w-full overflow-hidden bg-[var(--primary)]">
      <AudioParticleCloud />
    </section>
  );
}

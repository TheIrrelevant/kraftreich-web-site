/**
 * ---metadata---
 * @file src/features/vinyl-particles/ui/VinylMount.tsx
 * @description Document-flow spacer for the vinyl disc. VinylParticles portals a fixed overlay
 *              synced to this element so particles sit above the work grid (Z_HOME_VINYL).
 * @last-updated 2026-05-26
 * ---end-metadata---
 */

export const VINYL_MOUNT_ID = "vinyl-mount";

export default function VinylMount() {
  return <div id={VINYL_MOUNT_ID} className="min-h-[14rem] w-full flex-1" aria-hidden />;
}

/**
 * ---metadata---
 * @file src/features/vinyl-particles/ui/VinylAssemblyAnchor.tsx
 * @description Loading-phase vinyl target in IdentityStrip column 2 (title column).
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

export const VINYL_ASSEMBLY_ID = "vinyl-assembly-anchor";

export default function VinylAssemblyAnchor() {
  return (
    <div
      id={VINYL_ASSEMBLY_ID}
      className="pointer-events-none mt-[var(--space-16)] min-h-[14rem] w-full"
      aria-hidden
    />
  );
}

/**
 * ---metadata---
 * @file src/app/(site)/page.tsx
 * @description Home route. Composition only.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

import HomeHero from "@/features/home-hero/ui/HomeHero";
import IdentityStrip from "@/features/identity-strip/ui/IdentityStrip";

export default function HomePage() {
  return (
    <>
      <IdentityStrip />
      <HomeHero />
    </>
  );
}

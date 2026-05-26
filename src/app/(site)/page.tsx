/**
 * ---metadata---
 * @file src/app/(site)/page.tsx
 * @description Home route. IdentityStrip then WorkGrid via HomeHero.
 * @last-updated 2026-05-26
 * ---end-metadata---
 */

import HomeHero from "@/features/home-hero/ui/HomeHero";
import IdentityStrip from "@/features/identity-strip/ui/IdentityStrip";

export default function HomePage() {
  return (
    <div className="relative isolate bg-[var(--primary)]">
      <IdentityStrip />
      <HomeHero />
    </div>
  );
}

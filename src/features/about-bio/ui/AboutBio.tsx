/**
 * ---metadata---
 * @file src/features/about-bio/ui/AboutBio.tsx
 * @description About / bio composition. Placeholder copy until MDX lands.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import Heading from "@/shared/ui/Heading";
import Text from "@/shared/ui/Text";

export default function AboutBio() {
  return (
    <article>
      <Heading as="h1" size="xl">
        About
      </Heading>
      <div className="mt-[var(--space-8)] space-y-[var(--space-4)]">
        <Text tone="default">
          Kraftreich is a studio working at the edge between document and atmosphere.
        </Text>
        <Text tone="muted">
          This page will read from src/content/pages/about.mdx in a later phase. The route and
          layout contract are in place; only the body source changes.
        </Text>
      </div>
    </article>
  );
}

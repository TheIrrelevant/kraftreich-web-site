/**
 * ---metadata---
 * @file src/app/(site)/page.tsx
 * @description Home route. Composition only.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import Container from "@/shared/ui/Container";
import Section from "@/shared/ui/Section";
import Heading from "@/shared/ui/Heading";
import Text from "@/shared/ui/Text";
import Link from "@/shared/ui/Link";

export default function HomePage() {
  return (
    <Section rhythm="cinematic">
      <Container width="narrow">
        <Heading as="h1" size="display">
          Kraftreich
        </Heading>
        <Text size="lg" tone="muted" className="mt-[var(--space-6)]">
          A studio working at the edge between document and atmosphere.
        </Text>
        <div className="mt-[var(--space-8)] flex items-center gap-[var(--space-4)]">
          <Link href="/work" tone="default">
            Work →
          </Link>
          <Link href="/about" tone="muted">
            About
          </Link>
        </div>
      </Container>
    </Section>
  );
}

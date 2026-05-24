/**
 * ---metadata---
 * @file src/app/(site)/work/page.tsx
 * @description Work index route. Composition only.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { Metadata } from "next";
import Container from "@/shared/ui/Container";
import Section from "@/shared/ui/Section";
import Heading from "@/shared/ui/Heading";
import WorkGrid from "@/features/work-showcase/ui/WorkGrid";

export const metadata: Metadata = { title: "Work · Kraftreich" };

export default function WorkPage() {
  return (
    <Section>
      <Container width="base">
        <Heading as="h1" size="h2">
          Work
        </Heading>
        <div className="mt-[var(--space-48)]">
          <WorkGrid />
        </div>
      </Container>
    </Section>
  );
}

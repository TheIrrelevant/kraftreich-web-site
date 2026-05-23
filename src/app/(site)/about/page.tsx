/**
 * ---metadata---
 * @file src/app/(site)/about/page.tsx
 * @description About route. Composition only.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { Metadata } from "next";
import Container from "@/shared/ui/Container";
import Section from "@/shared/ui/Section";
import AboutBio from "@/features/about-bio/ui/AboutBio";

export const metadata: Metadata = { title: "About · Kraftreich" };

export default function AboutPage() {
  return (
    <Section>
      <Container width="narrow">
        <AboutBio />
      </Container>
    </Section>
  );
}

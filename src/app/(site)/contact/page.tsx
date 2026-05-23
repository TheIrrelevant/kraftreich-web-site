/**
 * ---metadata---
 * @file src/app/(site)/contact/page.tsx
 * @description Contact route. Composition only.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { Metadata } from "next";
import Container from "@/shared/ui/Container";
import Section from "@/shared/ui/Section";
import ContactLinks from "@/features/contact-form/ui/ContactLinks";

export const metadata: Metadata = { title: "Contact · Kraftreich" };

export default function ContactPage() {
  return (
    <Section>
      <Container width="narrow">
        <ContactLinks />
      </Container>
    </Section>
  );
}

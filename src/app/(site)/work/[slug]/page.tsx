/**
 * ---metadata---
 * @file src/app/(site)/work/[slug]/page.tsx
 * @description Work detail route. Slug is validated against the placeholder works at build time;
 *              unknown slugs 404. Replaced by the MDX-driven list when content loader ships.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/shared/ui/Container";
import Section from "@/shared/ui/Section";
import WorkDetail from "@/features/work-detail/ui/WorkDetail";
import { placeholderWorks } from "@/entities/work-project/constants/placeholder-works";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return placeholderWorks.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = placeholderWorks.find((p) => p.slug === slug);
  return { title: project ? `${project.title} · Kraftreich` : "Kraftreich" };
}

export default async function WorkSlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = placeholderWorks.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <Section>
      <Container width="narrow">
        <WorkDetail project={project} />
      </Container>
    </Section>
  );
}

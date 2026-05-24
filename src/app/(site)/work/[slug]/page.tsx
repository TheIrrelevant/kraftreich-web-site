/**
 * ---metadata---
 * @file src/app/(site)/work/[slug]/page.tsx
 * @description Work detail route. Slugs are sourced from src/content/work/*.mdx at build time
 *              via the content loader; unknown slugs 404.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/shared/ui/Container";
import Section from "@/shared/ui/Section";
import WorkDetail from "@/features/work-detail/ui/WorkDetail";
import { loadWorkProjects } from "@/shared/lib/content/work";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return loadWorkProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = loadWorkProjects().find((p) => p.slug === slug);
  return { title: project ? `${project.title} · Kraftreich` : "Kraftreich" };
}

export default async function WorkSlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = loadWorkProjects().find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <Section>
      <Container width="narrow">
        <WorkDetail project={project} />
      </Container>
    </Section>
  );
}

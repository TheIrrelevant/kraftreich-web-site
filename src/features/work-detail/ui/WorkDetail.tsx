/**
 * ---metadata---
 * @file src/features/work-detail/ui/WorkDetail.tsx
 * @description Case-study view for a single work project. Placeholder content until MDX lands.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { WorkProject } from "@/entities/work-project/types/work-project";
import Heading from "@/shared/ui/Heading";
import Text from "@/shared/ui/Text";
import Link from "@/shared/ui/Link";

type Props = {
  project: WorkProject;
};

export default function WorkDetail({ project }: Props) {
  return (
    <article>
      <header className="border-b border-[var(--accent)] pb-[var(--space-32)]">
        <Text size="caption" tone="muted">
          {project.year}
          {project.role ? ` · ${project.role}` : ""}
        </Text>
        <Heading as="h1" size="h1" className="mt-[var(--space-16)]">
          {project.title}
        </Heading>
        <Text size="body" tone="muted" className="mt-[var(--space-24)]">
          {project.summary}
        </Text>
      </header>
      <div className="prose-placeholder py-[var(--space-48)]">
        <Text tone="muted">
          Case-study body lands in a later phase as MDX. The route, layout, and routing contract are
          in place now.
        </Text>
      </div>
      <Link href="/work" tone="muted">
        ← Back to work
      </Link>
    </article>
  );
}

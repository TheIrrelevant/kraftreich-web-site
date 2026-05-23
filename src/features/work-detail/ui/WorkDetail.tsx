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
      <header className="border-b border-[var(--color-border)] pb-[var(--space-8)]">
        <Text size="xs" tone="faint">
          {project.year}
          {project.role ? ` · ${project.role}` : ""}
        </Text>
        <Heading as="h1" size="display" className="mt-[var(--space-3)]">
          {project.title}
        </Heading>
        <Text size="lg" tone="muted" className="mt-[var(--space-6)]">
          {project.summary}
        </Text>
      </header>
      <div className="prose-placeholder py-[var(--space-12)]">
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

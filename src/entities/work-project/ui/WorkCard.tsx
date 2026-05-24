/**
 * ---metadata---
 * @file src/entities/work-project/ui/WorkCard.tsx
 * @description Card rendering a work-project preview. Consumed by work-showcase and work-detail.
 *              Lives in entities/ because two features share both the data and this representation.
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

export default function WorkCard({ project }: Props) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block border-t border-[var(--accent)] py-[var(--space-24)]"
    >
      <div className="flex items-baseline justify-between gap-[var(--space-16)]">
        <Heading as="h3" size="h3">
          {project.title}
        </Heading>
        <Text as="span" size="body-sm" tone="muted">
          {project.year}
        </Text>
      </div>
      <Text size="body-sm" tone="muted" className="mt-[var(--space-8)]">
        {project.summary}
      </Text>
      {project.role ? (
        <Text size="caption" tone="muted" className="mt-[var(--space-16)]">
          {project.role}
        </Text>
      ) : null}
    </Link>
  );
}

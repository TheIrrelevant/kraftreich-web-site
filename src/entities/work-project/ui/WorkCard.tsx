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
      className="group block border-t border-[var(--color-border)] py-[var(--space-6)]"
    >
      <div className="flex items-baseline justify-between gap-[var(--space-4)]">
        <Heading as="h3" size="lg">
          {project.title}
        </Heading>
        <Text as="span" size="sm" tone="faint">
          {project.year}
        </Text>
      </div>
      <Text size="sm" tone="muted" className="mt-[var(--space-2)]">
        {project.summary}
      </Text>
      {project.role ? (
        <Text size="xs" tone="faint" className="mt-[var(--space-3)]">
          {project.role}
        </Text>
      ) : null}
    </Link>
  );
}

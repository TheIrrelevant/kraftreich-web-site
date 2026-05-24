/**
 * ---metadata---
 * @file src/features/work-showcase/ui/WorkGrid.tsx
 * @description Editorial list of work projects. Reads from the work-project entity.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import { loadWorkProjects } from "@/shared/lib/content/work";
import WorkCard from "@/entities/work-project/ui/WorkCard";

export default function WorkGrid() {
  const works = loadWorkProjects();
  return (
    <ul className="flex flex-col">
      {works.map((project) => (
        <li key={project.slug}>
          <WorkCard project={project} />
        </li>
      ))}
    </ul>
  );
}

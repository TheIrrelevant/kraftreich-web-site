/**
 * ---metadata---
 * @file src/entities/work-project/constants/placeholder-works.ts
 * @description PLACEHOLDER: hardcoded works list. Replaced by an MDX loader in a later phase.
 *              The shape matches the WorkProject type — replacing the data source is one
 *              import swap.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { WorkProject } from "@/entities/work-project/types/work-project";

export const placeholderWorks: WorkProject[] = [
  {
    slug: "antagonist",
    title: "Antagonist",
    year: 2025,
    role: "Direction · Photography",
    summary: "An editorial study on shadow as character.",
    order: 1,
  },
  {
    slug: "threshold",
    title: "Threshold",
    year: 2024,
    role: "Direction",
    summary: "A short film exploring the edge between two states.",
    order: 2,
  },
  {
    slug: "loop-format",
    title: "Loop Format",
    year: 2024,
    role: "Editorial",
    summary: "A series with no clear beginning or end.",
    order: 3,
  },
];

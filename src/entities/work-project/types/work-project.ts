/**
 * ---metadata---
 * @file src/entities/work-project/types/work-project.ts
 * @description Domain type for a work project. Shape matches the MDX frontmatter contract
 *              documented in src/content/README.md.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

export type WorkProject = {
  slug: string;
  title: string;
  year: number;
  client?: string;
  role?: string;
  summary: string;
  cover?: string;
  order: number;
};

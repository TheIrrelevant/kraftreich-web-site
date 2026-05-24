/**
 * ---metadata---
 * @file src/shared/lib/content/work.ts
 * @description Build-time loader for work-project MDX files in src/content/work/. Reads each
 *              .mdx file synchronously, parses YAML frontmatter via gray-matter, validates with
 *              Zod, and returns a typed list. Drafts are excluded in production builds.
 *              Imported only by Server Components — sync fs is safe here.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import { readdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { cwd } from "node:process";
import matter from "gray-matter";
import { z } from "zod";
import type { WorkProject } from "@/entities/work-project/types/work-project";

const CONTENT_DIR = join(cwd(), "src", "content", "work");

const workFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  year: z.number().int().gte(1900).lte(2100),
  client: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  summary: z.string().min(1),
  cover: z.string().startsWith("/"),
  order: z.number().int(),
  draft: z.boolean().optional(),
});

export function loadWorkProjects(): WorkProject[] {
  const isProd = process.env.NODE_ENV === "production";
  const files = readdirSync(CONTENT_DIR).filter((f) => extname(f) === ".mdx");

  const projects = files.map((file) => {
    const filename = basename(file, ".mdx");
    const raw = readFileSync(join(CONTENT_DIR, file), "utf8");
    const { data } = matter(raw);
    const parsed = workFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Invalid frontmatter in src/content/work/${file}: ${parsed.error.message}`);
    }
    if (parsed.data.slug !== filename) {
      throw new Error(
        `Slug mismatch in src/content/work/${file}: frontmatter slug "${parsed.data.slug}" must equal filename "${filename}"`,
      );
    }
    return parsed.data;
  });

  return projects.filter((p) => !(isProd && p.draft)).sort((a, b) => a.order - b.order);
}

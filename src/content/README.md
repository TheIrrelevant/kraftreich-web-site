---
type: doc
category: data
scope: src/content
description: Editorial MDX content. Data, not code. Loaded at build time and validated with Zod.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: initial skeleton
---

# src/content/

Editorial content as MDX files. **Data, not code.** Edited by humans. Loaded at build time.

## Subfolders

| Folder | Holds |
|--------|-------|
| `work/` | Case studies for the work section. One MDX per project. Filename = URL slug. |
| `pages/` | Static page content (about, etc.). |

## Rules

- **Never imported directly.** Read through `@/shared/lib/content/` loaders.
- **Frontmatter is validated.** Every MDX file must satisfy the Zod schema defined in `@/shared/lib/content/`.
- **Adding content does not require a code change.** If it does, the schema or loader is wrong.
- **Filenames in `work/` are URL slugs.** `kebab-case.mdx`. No date prefixes, no numbering.

## Frontmatter contract (work projects)

The schema is defined in code; this is the human reference. Treat the schema file as authoritative.

```yaml
---
title: string                  # display title
slug: string                   # URL slug, matches filename
year: number                   # YYYY
client: string                 # optional
role: string                   # optional
summary: string                # 1–2 sentence elevator pitch
cover: string                  # path under /public
order: number                  # sort order in showcase
draft: boolean                 # if true, excluded from production build
---
```

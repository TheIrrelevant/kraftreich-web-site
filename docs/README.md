---
type: doc
category: meta
scope: docs
description: Engineering documents beyond the five foundation files at the repository root.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: initial skeleton
---

# docs/

Engineering documents beyond the five foundation files at the repository root.

## What lives here

- Decision records (ADRs) — one file per non-trivial decision, dated, immutable once accepted.
- Operational runbooks — deploy, rollback, content publishing flow.
- Migration notes — schema changes, dependency upgrades that needed a path.

## What does NOT live here

- The five foundation documents — those stay at repo root for visibility:
  - `CLAUDE.md`
  - `ENGINEERING_PRINCIPLES.md`
  - `ARCHITECTURE.md`
  - `DESIGN_SYSTEM.md`
  - `STACK.md`

## Conventions

- One topic per file. No "miscellaneous" documents.
- Filenames: `kebab-case.md` with a date prefix for time-bound notes (`2026-05-adr-001-mdx-loader.md`).
- Every file carries metadata frontmatter (see existing docs for the format).
- Drafts go in a branch, not in `docs/draft/`. The folder is for accepted content only.

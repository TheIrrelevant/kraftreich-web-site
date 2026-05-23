---
type: doc
category: layer
scope: src/app
description: Next.js routing and app shell. Composition only — no business logic.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: initial skeleton
---

# src/app/

Next.js App Router. **Composition only.**

## What lives here

- `layout.tsx` — app shell composition
- `providers.tsx` — app-wide providers (theme, R3F root, `MotionConfig`)
- `globals.css` — base styles, token imports
- `(site)/` — main route group
- `api/` — route handlers (only when a feature needs a server endpoint)
- `error.tsx`, `not-found.tsx` — app-level fallbacks

## Rules

- Each route file is **≤ 30 lines**. Composition + `generateMetadata` only.
- Imports only from `@/features/`, `@/entities/`, `@/shared/`.
- No state, no fetching logic, no transformations. Routes call a feature; the feature does the work.

See `ARCHITECTURE.md` → *Layer Boundaries*.

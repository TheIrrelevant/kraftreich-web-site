---
type: doc
category: layer
scope: src/features
description: Vertical feature slices. Each feature is self-contained and follows the six-segment standard.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: initial skeleton with segment template
---

# src/features/

Vertical slices of user-facing capability. Each slice is **self-contained, isolated, and composable**.

## Feature Module Standard

Every feature follows the same internal structure. Use only the segments that apply.

```
src/features/<feature-name>/
├── ui/              React components (DOM) owned by this slice
├── logic/           Pure functions, rules, formatters, validators
├── hooks/           React hooks owned by this slice
├── types/           TypeScript types owned by this slice
├── constants/       Slice-local constants (field names, slugs, copy keys)
├── animations/      Framer Motion variants/presets used here (optional)
│
│ — Extended segments (used only when needed) —
├── scenes/          R3F components (WebGL) — distinct from ui/
└── api/             Server actions, route handlers, fetchers
```

## Hard Rules

- **A feature may import from `@/shared/` and `@/entities/`.**
- **A feature may NOT import from another feature.** No exceptions. No "temporary" couplings.
- **If cross-feature logic emerges, promote it into `@/shared/`** (pure) or `@/entities/` (domain-aware) in the same change.
- **No file lives at the root of a slice.** Everything is inside a segment.
- **No `index.ts` barrels.** Direct imports only.
- **A segment is omitted when empty.** A slice without animations does not get an `animations/` folder.

## Planned features (created as the work begins)

- `hero/` — landing scene
- `work-showcase/` — project grid
- `work-detail/` — case study viewer
- `about-bio/` — about page
- `contact-form/` — contact form (uses `api/`)
- `site-footer/` — composed in `app/layout.tsx`

Features are not pre-scaffolded. Create a feature folder when you start building it.

See `ARCHITECTURE.md` → *Slice Segments* for the canonical rules.

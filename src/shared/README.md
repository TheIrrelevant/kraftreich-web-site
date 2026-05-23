---
type: doc
category: layer
scope: src/shared
description: Pure, business-agnostic building blocks consumed by features. Knows nothing about features or app.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: initial skeleton
---

# src/shared/

Pure, business-agnostic. **May be imported by features and entities.** Imports only from npm packages and other `@/shared/` modules.

## Subfolders

| Folder | Purpose |
|--------|---------|
| `ui/` | The **six** design-system primitives. Frozen by `DESIGN_SYSTEM.md`. Adding a seventh requires retiring one. |
| `three/` | Generic R3F building blocks: `<Canvas>` wrapper, materials, loaders, post-processing. No scene logic. |
| `motion/` | Shared Framer Motion variants, transition presets, page-transition orchestration. Features consume presets, never raw `duration` literals. |
| `lib/` | Utilities, content loader, environment validation, schemas. Pure functions only. |
| `hooks/` | Cross-feature React hooks (`use-media-query`, `use-scroll-progress`, `use-reduced-motion`). |
| `config/` | Constants, site metadata, env shape. No runtime logic. |
| `styles/` | `tokens.css` (the single source of truth for design tokens), `motion.css`, base layers. |
| `types/` | Cross-cutting TypeScript types (utility types, brands). Feature-local types live with the feature. |

## Rules

- **No business awareness.** `shared/` knows nothing about *what* a "work project" is. If a name reveals a domain concept, it belongs in `entities/`.
- **No barrels.** Import the specific file: `@/shared/ui/Button`.
- **No new primitive in `ui/` without retiring one.** Six is the ceiling. See `DESIGN_SYSTEM.md`.
- **One motion source.** Tokens here are the source of truth for both Framer Motion and R3F. See `ARCHITECTURE.md` → *Motion Architecture*.

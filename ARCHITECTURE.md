---
type: doc
category: foundation
scope: repo
description: Feature-Sliced architecture for the Kraftreich Web Site. Strict layers, defined segments, src/ application root.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: codified six-segment feature standard; absolute no-cross-feature-imports rule; shared/ may be imported by features/
---

# ARCHITECTURE.md

## Premise

A portfolio is a small system. Treat it like one. The architecture should scale by adding **slices**, not by growing a global components folder. Every directory exists for a reason that can be named in one sentence.

## Architectural Style

**Feature-Sliced.** Code is grouped by what it does for the user, not by what kind of file it is. A *slice* is a self-contained vertical: its UI, its state, its data shapes, its helpers. A slice can be deleted in one commit without leaving orphans.

This style is chosen specifically to **prevent component-centric scaling** — the failure mode where every new screen dumps three more files into `components/` and nothing can be removed without grep.

## Application Root: `src/`

All application code lives under `src/`. The repository root contains only:

- Foundation documents (`CLAUDE.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `STACK.md`)
- Configuration (`package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `eslint.config.js`, `.gitignore`, etc.)
- `public/` (Next.js requires it at root)
- `docs/` (additional engineering documents)

No application logic, no feature code, no business types at the repo root. Ever.

## Layers (top to bottom, dependency direction)

```
┌─────────────────────────────────────────────────────────────┐
│  src/app/        Routes, shell composition, providers.      │
│                  Composition only. No business logic.       │
├─────────────────────────────────────────────────────────────┤
│  src/features/   User-facing capabilities (hero,            │
│                  contact-form, work-showcase). Vertical     │
│                  slices.                                    │
├─────────────────────────────────────────────────────────────┤
│  src/entities/   Business entities (work-project, profile). │
│                  Introduced only when ≥ 2 features share    │
│                  one. Empty at start. May stay empty.       │
├─────────────────────────────────────────────────────────────┤
│  src/shared/     Pure, business-agnostic primitives,        │
│                  helpers, tokens, hooks. Knows nothing      │
│                  about features.                            │
└─────────────────────────────────────────────────────────────┘
```

**Dependencies flow downward only.** `app → features → entities → shared`. Never up. Never sideways at the same layer.

## Slice Segments

A slice (in `src/features/<name>/` or `src/entities/<name>/`) is composed of well-named **segments**. Each segment has one responsibility. Unused segments simply don't exist for a given slice.

### Standard Segments (canonical six)

| Segment | Holds | Example |
|---------|-------|---------|
| `ui/` | React components (DOM) owned by this slice | `ContactForm.tsx` |
| `logic/` | Pure functions, business rules, formatters, validators | `validate-email.ts`, `compose-meta.ts` |
| `hooks/` | React hooks owned by this slice | `use-contact-form.ts` |
| `types/` | TypeScript types owned by this slice | `contact.ts` |
| `constants/` | Slice-local constants (field names, slugs, copy keys) | `field-names.ts` |
| `animations/` *(optional)* | Framer Motion variants and presets used by this slice's `ui/` | `form-reveal.ts` |

### Extended Segments (used only when the slice needs them)

| Segment | Holds | Example |
|---------|-------|---------|
| `scenes/` | R3F components (WebGL) — distinct from DOM `ui/` because of render context | `hero-scene.tsx` |
| `api/` | Server actions, route handlers, fetchers | `submit-contact.ts` |

### Slice Rules

- **No file lives at the root of a slice.** Everything is inside a segment.
- **No barrel `index.ts`.** Consumers import from `src/features/contact-form/ui/ContactForm` directly.
- **A slice owns its types.** Cross-slice types live in `src/shared/types/` or get promoted to an entity.
- **A segment may be omitted** when empty. A slice with no animation does not get a `animations/` folder.
- **No sub-segments.** `ui/` is flat per slice. If `ui/` outgrows a screen, the slice is too large — split into a sibling feature.

### Feature Isolation & Cross-Feature Imports

**Absolute rules:**

- `@/shared/` **may** be imported by features.
- A feature **may not** import from another feature. No exceptions. No annotations. No "temporary" couplings.
- When cross-feature logic emerges, it is **promoted into `@/shared/`** (pure) or `@/entities/` (domain-aware) in the same change. See *Promotion Path* below.

A cross-feature import is a review failure, not a debate.

## Folder Map

```
.
├── src/
│   ├── app/                       Next.js App Router. Composition only.
│   │   ├── (site)/
│   │   │   ├── page.tsx
│   │   │   ├── work/page.tsx
│   │   │   ├── work/[slug]/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── api/                   Route handlers (only when needed)
│   │   ├── layout.tsx             App shell composition
│   │   ├── providers.tsx          App-wide providers (theme, R3F root, motion config)
│   │   └── globals.css
│   │
│   ├── features/                  User-facing capabilities.
│   │   ├── hero/
│   │   │   ├── ui/
│   │   │   ├── scenes/
│   │   │   ├── model/
│   │   │   └── lib/
│   │   ├── work-showcase/
│   │   ├── work-detail/
│   │   ├── about-bio/
│   │   ├── contact-form/
│   │   ├── site-nav/
│   │   └── site-footer/
│   │
│   ├── entities/                  Business entities. Empty at start.
│   │
│   ├── shared/                    Pure, business-agnostic.
│   │   ├── ui/                    Six primitives only. See DESIGN_SYSTEM.md.
│   │   ├── three/                 Generic R3F building blocks: Canvas, materials, loaders
│   │   ├── motion/                Framer Motion variants, transition presets, MotionConfig
│   │   ├── lib/                   utils, env, content loader, schemas
│   │   ├── hooks/                 Cross-feature React hooks
│   │   ├── config/                Constants, site metadata, env validation
│   │   ├── styles/                tokens.css, motion.css
│   │   └── types/                 Cross-cutting TS types (utility types, brands)
│   │
│   └── content/                   Editorial MDX. Data, loaded at build time.
│       ├── work/
│       └── pages/
│
├── public/                        Static assets (Next.js convention, root required)
├── docs/                          Engineering docs beyond the four foundation files
│
├── CLAUDE.md
├── ARCHITECTURE.md
├── DESIGN_SYSTEM.md
└── STACK.md
```

## Top-Level Folders (one-line briefs)

| Folder | Purpose |
|--------|---------|
| `src/` | Application root. Everything the app reads at build or runtime lives here. |
| `src/app/` | Next.js routing + shell. Each route is composition only. No business logic. |
| `src/features/` | Vertical slices of user-facing capability. Each owns its UI, scenes, model, lib, and api. |
| `src/entities/` | Business entities shared by ≥ 2 features. Optional layer; may remain empty. |
| `src/shared/` | Pure cross-feature building blocks: primitives, R3F helpers, motion presets, utilities, hooks, tokens, config, types. |
| `src/content/` | Editorial MDX, loaded at build time. Edited by humans. |
| `public/` | Static binary assets served verbatim. Required at root by Next.js. |
| `docs/` | Engineering docs beyond the four foundation files at root. |

## Path Alias

`@/*` → `src/*`

Configured in `tsconfig.json`. Use it in every import that crosses a layer:

```ts
import { Button } from "@/shared/ui/Button";
import { ContactForm } from "@/features/contact-form/ui/ContactForm";
```

No relative imports across layers. Within a single segment, short relatives (`./helpers`) are fine.

## Layer Boundaries (the rules that matter)

**`src/app/`**
- Each route file is ≤ 30 lines.
- Imports only from `@/features/`, `@/entities/`, `@/shared/`.
- Holds composition and route metadata. Nothing else.

**`src/features/<name>/`**
- May import from `@/entities/` and `@/shared/`.
- **May not** import from another feature. No exceptions.
- **May not** import from `@/app/`.
- If two features need the same code: it is promoted into `@/shared/` (pure) or `@/entities/` (domain-aware) in the same change.

**`src/entities/<name>/`**
- May import from `@/shared/` only.
- **May not** import from features.
- Same segment rules as features.

**`src/shared/`**
- Pure. No business awareness. No app awareness.
- Imports only from npm packages and other `@/shared/` modules.
- `src/shared/ui/` holds **only the six design-system primitives**. New primitives require deleting an existing one (see DESIGN_SYSTEM.md).

**`src/content/`**
- Not imported directly. Read through `@/shared/lib/content/` loaders that validate frontmatter with Zod.

## Why No Global `components/` Folder

The single most common failure of frontend architectures is a top-level `components/` directory that grows monotonically. Three symptoms appear:

1. **Naming pressure mounts.** `Card` becomes `WorkCard`, then `WorkCardCompact`, then `WorkCardCompactInverted`. The folder is a flat namespace fighting itself.
2. **Nothing can be removed safely.** Any file might be imported from anywhere, so deletion requires a project-wide grep.
3. **Boundaries collapse.** Business logic seeps into "components" because there is nowhere else to put it. The architecture loses its layers.

Feature-Sliced solves this by binding components to the slice that owns them. `WorkCard` lives in `src/features/work-showcase/ui/WorkCard.tsx`. If `work-showcase` is removed, `WorkCard` goes with it. If `WorkCard` is also needed by `work-detail`, that's the signal to create `src/entities/work-project/ui/WorkCard.tsx`.

The only `ui/` outside a slice is `src/shared/ui/` — frozen at six primitives by `DESIGN_SYSTEM.md`.

## Motion Architecture

Two motion systems coexist with **non-overlapping domains**:

| System | Domain |
|--------|--------|
| **Framer Motion** | Page transitions, micro interactions, opacity / transform, orchestrated UI timing |
| **Three.js (R3F)** | Immersive scenes, physics, continuous rendering, camera choreography |

Boundary rule: if it lives in the DOM and animates, it's Framer Motion. If it lives inside `<Canvas>`, it's R3F. They never animate the same element.

Both systems consume the same motion tokens from `src/shared/styles/tokens.css`. Framer variants and R3F easings reference the same durations and curves. See `DESIGN_SYSTEM.md`.

Shared motion presets live in `src/shared/motion/` and are consumed by features. Raw `duration` numbers in components are an anti-pattern.

## When To Introduce `src/entities/`

`src/entities/` is created the first time **the same business concept** has both:

- A data shape used by ≥ 2 features, **and**
- A visual or interactive representation used by ≥ 2 features.

Until then, the concept lives inside its owning feature. Premature entity extraction is a worse failure than late extraction — start integrated, split on real duplication.

Likely candidates (deferred until justified):

- `src/entities/work-project/` — when `work-showcase` and `work-detail` both render the same project preview.
- `src/entities/profile/` — never, unless multi-author content appears.

## Data Flow

1. **Build time.** `@/shared/lib/content/` reads MDX from `src/content/`, validates with Zod, returns typed objects.
2. **Server render.** Route in `src/app/` calls a feature's exported component, passing content as props.
3. **Client hydration.** Only `"use client"` islands run in the browser — primarily R3F canvases and Framer Motion-driven UI inside feature `ui/` segments.
4. **Static export.** No runtime DB. Optional contact route handler is the only server surface.

## Rendering Policy

- **Default:** Server Component.
- **`"use client"`** only for: R3F (`<Canvas>` and below), Framer Motion components, event handlers, browser APIs, state hooks.
- **Three.js never runs at server render.** R3F components live in client-marked files and are dynamically imported with `{ ssr: false }` from server trees.
- **Framer Motion components are client-only.** Use `motion(Component)` inside `"use client"` files; gate animation entry on `useReducedMotion()`.

## Routing Convention

- Route group `(site)` for organization without affecting URL.
- `[slug]` validated against MDX content keys at build time.
- 404 handled by Next.js `not-found.tsx` per route segment.
- Routes import feature `ui/` directly — no intermediate "page component" indirection.

## Error Boundaries

- One root `error.tsx` for app-wide fallback.
- Per-route `error.tsx` only where a route has expensive client work that can fail in isolation (e.g., a heavy R3F scene).

## Testing Layout

```
src/features/<name>/__tests__/      Unit + integration tests, colocated
src/entities/<name>/__tests__/      Same
src/shared/<group>/__tests__/       Same
e2e/                                Playwright tests for critical user flows
```

- Unit tests colocated with the module they test.
- E2E tests organized by user flow, not by page.

## Adding a New Feature

1. Create `src/features/<name>/` with only the segments you need.
2. Add the route in `src/app/(site)/<name>/page.tsx`, composing the feature's `ui/`.
3. If content is needed, add the MDX schema in `src/shared/lib/content/`.
4. If logic ends up duplicated with another feature, extract — to `src/shared/` (utility) or `src/entities/` (domain).
5. Write tests inside `src/features/<name>/__tests__/`.
6. Update `CLAUDE.md` only if a convention changed.

## Promotion Path (slice → entity → shared)

Code moves down the stack, never up.

```
src/features/<name>/   →   src/entities/<name>/   →   src/shared/
   domain-aware                domain-aware                 pure
   one feature                 many features                cross-cutting
```

- Only after real duplication, never in anticipation.
- A move is a single commit and updates every importer.

## Anti-Patterns (rejected on review)

- Application code at the repository root.
- A top-level `components/` folder.
- A `src/shared/ui/` that holds more than the six primitives.
- An `index.ts` barrel anywhere.
- Default exports for utilities.
- `any` or unjustified `as` casts.
- Components > 200 lines.
- Two features importing each other.
- Business logic inside `src/app/`.
- A `lib/` folder at the repo root.
- Three.js code outside `"use client"` boundaries.
- Framer Motion competing with R3F over the same element.
- Hardcoded design or motion values when a token exists.
- A new abstraction at first use.
- Files placed at the root of a slice instead of inside a segment.

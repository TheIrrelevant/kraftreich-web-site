---
type: doc
category: foundation
scope: repo
description: Repository-level guide for any AI agent working on the Kraftreich Web Site. Read before writing code.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: added Stop-and-Ask Triggers section for architectural uncertainty
---

# CLAUDE.md — Kraftreich Web Site

> Read this file first. It defines how this repository is built, named, and reviewed.

## Mission

Production-ready portfolio website. Calm, intentional, minimal. Three.js where it earns its place — never decoration for decoration's sake.

## Non-Negotiables

1. **Simplicity over cleverness.** If a junior engineer can't read it in 30 seconds, simplify.
2. **No premature abstraction.** Three similar lines beat a wrong abstraction. Wait for the third use.
3. **Immutability.** New objects, never in-place mutation.
4. **No barrels (`index.ts` re-exports).** Direct imports keep tree-shaking honest and jump-to-source instant.
5. **Server Components by default.** `"use client"` only for interactivity, R3F, or browser APIs.
6. **English only in code, comments, commits, docs.** Conversation can be Turkish.
7. **No `any`. No `as` casts without a comment justifying.**
8. **Files ≤ 400 lines. Functions ≤ 50 lines. Nesting ≤ 4 levels.**
9. **Prefer inferred types where clarity is preserved.** Annotate function returns and exported APIs; let TypeScript infer locals, callbacks, and obvious assignments. Avoid verbose type engineering (no `Pick<Omit<…>>` chains where a plain interface would do).
10. **Prefer deletion over addition.** If a system can be simplified without reducing clarity or scalability, simplify it. Every PR is allowed — encouraged — to remove more lines than it adds.

## File & Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | `PascalCase.tsx`, one default export | `WorkCard.tsx` |
| Hook | `use-kebab-case.ts`, named export | `use-scroll-progress.ts` |
| Utility | `kebab-case.ts`, named exports | `format-date.ts` |
| R3F scene | `kebab-case.tsx` | `hero-scene.tsx` |
| MDX content | `kebab-case.mdx` | `cinelab.mdx` |
| Types | `kebab-case.ts` in `types/` | `work.ts` |

Path alias: `@/*` → `src/*`.

## Application Root

All application code lives under `src/`. The repository root holds only foundation docs, configs, `public/`, and `docs/`. No feature code, no business types, no `lib/` at the root.

## Layer Rules (enforced by review)

- **`src/app/`** never contains business logic. Routes compose feature exports only.
- **`src/features/<name>/`** is a vertical slice with segments: `ui/`, `scenes/` (when visual), `model/`, `lib/`, `api/`. No file lives at the slice root — only inside segments. See `ARCHITECTURE.md`.
- **`src/entities/<name>/`** (introduced only when ≥ 2 features share a business concept) follows the same segment rules.
- **`src/shared/`** is pure. `src/shared/ui/` holds the six design-system primitives only — nothing else. Never imports from features or entities.
- **`src/content/`** is data — never imported directly; read via `@/shared/lib/content/` loaders.
- Cross-feature imports are forbidden. If feature A needs feature B, extract — to `@/shared/` (utility) or `@/entities/` (domain).
- **Motion split:** Framer Motion for DOM (page transitions, micro interactions, opacity/transform, orchestrated timing). Three.js / R3F for `<Canvas>` (immersive, physics, continuous rendering). They never animate the same element.

## Stop-and-Ask Triggers

When architectural uncertainty exists, **do not guess**. Stop and ask before introducing any of:

- A new dependency
- A new pattern (state shape, data flow, file layout convention)
- A global abstraction (provider, context, service singleton)
- A state manager (Redux, Zustand, Jotai, Valtio, etc.)
- A new animation system beyond Framer Motion + R3F
- A caching layer (SWR, React Query, custom cache, service-worker cache)

The cost of pausing to confirm is low. The cost of an unwanted abstraction is high and compounds. Ask, then implement.

## Workflow

1. **One step at a time.** No batch surprises. Get approval before the next step.
2. **TDD for non-trivial logic.** Tests before implementation. Skip for pure UI/visual.
3. **Confidence tag on every recommendation:** `HIGH`, `MEDIUM`, `LOW`.
4. **Citable claims only.** Reference file paths, AC IDs, commit SHAs. No vague assertions.
5. **Commit per step.** Small, reversible. Conventional Commits format.
6. **Run before declaring done.** Tests pass + dev server boots + feature observed in browser.

## Definition of Done

A task is done when:
- [ ] Implementation matches AC exactly (no scope creep)
- [ ] Tests added/updated and 100% passing
- [ ] Type check passes (`tsc --noEmit`)
- [ ] Lint passes
- [ ] `next build` succeeds
- [ ] Feature verified in browser (golden path + one edge case)
- [ ] Docs updated if architecture/conventions changed

## Hand-offs

When ending a session that modified files, leave a one-paragraph status note describing:
- What changed (file paths)
- Why (link to AC or decision)
- What's next (the immediate next step, not a roadmap)

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — folder structure, layers, data flow
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — tokens and primitives
- [STACK.md](./STACK.md) — tech choices and rationale

---
type: doc
category: foundation
scope: repo
description: Technology stack and tooling for the Kraftreich Web Site. Each choice is recorded with its rationale and its alternative.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: adopted Framer Motion under scoped-use policy; recorded scope and boundaries
---

# STACK.md

## Principle

Pick the smallest stack that can ship the product and survive five years of maintenance. Every dependency is a future migration. We default to "no" and let needs override.

## Core

| Layer | Choice | Version target | Why |
|-------|--------|----------------|-----|
| Framework | **Next.js** (App Router) | 15.x | RSC by default, file-based routing, static export friendly, mature image pipeline. |
| Language | **TypeScript** | 5.x, `strict: true` | Non-negotiable for a portfolio meant to last. |
| UI runtime | **React** | 19.x | Comes with Next 15. RSC + Suspense are load-bearing. |
| Styling | **Tailwind CSS** | 4.x | Token-driven, zero runtime, removes the question "where do I put this class?". |
| 3D | **Three.js** + **@react-three/fiber** + **@react-three/drei** | latest stable | R3F gives React composability; Drei gives loaders and helpers without rewriting them. |
| DOM motion | **Framer Motion** | latest stable | Page transitions, micro interactions, orchestrated UI timing. Scoped — see *Motion Policy* below. |
| Content | **MDX** + **Contentlayer-style loader (handwritten if needed)** | latest | Editorial content as files in git. No CMS until needed. |
| Schema | **Zod** | latest | Validates MDX frontmatter and env vars at boundaries. |

## Tooling

| Concern | Choice | Why |
|---------|--------|-----|
| Package manager | **pnpm** | Strict, fast, disk-efficient. Workspaces ready if the repo grows. |
| Linter | **ESLint** with `next/core-web-vitals` + `@typescript-eslint` | Single linter. No Prettier conflict because formatting goes through… |
| Formatter | **Prettier** | One source of truth for formatting. ESLint defers formatting rules. |
| Type check | `tsc --noEmit` in CI | Separate from lint. Failures block merges. |
| Tests (unit) | **Vitest** | Fast, ESM-native, Jest-compatible API. |
| Tests (component) | **Vitest + Testing Library** | Same runner, no extra config. |
| Tests (E2E) | **Playwright** | Headless Chromium for critical flows. Off by default in local; runs in CI. |
| Git hooks | **Husky** + **lint-staged** | Format + lint on staged files only. |
| Commit format | **Conventional Commits** | Mechanical changelog generation later if needed. |

## Motion Policy

Two motion engines coexist. They have non-overlapping responsibilities and share token sources.

| Engine | In Scope | Out Of Scope |
|--------|----------|--------------|
| **Framer Motion** | Page transitions; micro interactions (hover, press, focus reveals); opacity / transform tweens; orchestrated UI timing (stagger, sequence, list animations) | Anything inside `<Canvas>`; physics; continuous frame-by-frame rendering; long-running loops |
| **Three.js / R3F** | Immersive scenes; physics; continuous rendering; camera choreography; shader animation | DOM transitions; route changes; UI affordance feedback |

Enforcement:

- Framer variants live in `src/shared/motion/`. Features import presets; raw `duration` numbers in components are rejected on review.
- A root `MotionConfig` sets defaults and reduced-motion strategy.
- Tokens (`--motion-base`, `--ease-out`, etc.) are the single source of truth. Framer variants and R3F easings reference the same values. See `DESIGN_SYSTEM.md`.
- The two engines never animate the same DOM element.

## Optional (only when justified)

| Concern | Choice | Trigger to add |
|---------|--------|----------------|
| Contact form | **Resend** + Next.js Route Handler | When a contact form ships. |
| Analytics | **Vercel Analytics** or **Plausible** | When traffic measurement is a stated need. |
| Image hosting | **Cloudinary** | When `/public` images exceed practical git size. |
| CMS | **Sanity** or **Tina** | Only if non-developers need to edit content regularly. |

## Rejected (and why)

| Candidate | Rejected because |
|-----------|------------------|
| Redux / Zustand / Jotai | No global state needs justify it yet. Local `useState` and URL params suffice. |
| Storybook | Six primitives don't justify the setup cost. Revisit if primitives exceed twelve. |
| Sass / styled-components / emotion | Tailwind + CSS variables already cover the need. One styling system. |
| Drizzle / Prisma | No database. |
| TRPC | No client-server boundary beyond static pages and one optional route handler. |
| Lottie | We have Three.js. If a vector animation is needed, it goes in WebGL. |
| Multiple icon libraries | Lucide only. |

## Environment

- **Node**: 20 LTS minimum.
- **Package manager**: pnpm, pinned via `packageManager` field in `package.json`.
- **Editor**: VS Code with project-recommended extensions list shipped via `.vscode/extensions.json`.

## Build & Deploy

- **Build**: `next build`. Static export where possible; SSR only for routes that demand it (currently none planned).
- **Deploy target**: Vercel by default. Architecture stays portable — nothing in the code assumes Vercel.
- **CI**: GitHub Actions running `pnpm install`, `tsc`, `eslint`, `vitest`, `playwright` (smoke only), `next build`.

## Dependency Discipline

- **Add a dependency only after the third hand-rolled use of the same code**, unless the dependency is a security boundary (auth, crypto, validation).
- **Lock everything.** No `^` or `~` for non-dev dependencies once we hit 1.0 of our own.
- **Audit quarterly.** Remove anything unused. `pnpm dlx depcheck` is the friend.
- **Prefer one good library over two okay libraries.** Drei replaces ten micro-utilities.

## Versioning Policy For This Document

When a stack choice is added, swapped, or removed, this file changes in the same commit. The rationale row is mandatory; the alternative row is mandatory.

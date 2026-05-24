---
type: doc
category: log
scope: repo
description: Human-readable log of meaningful changes. Updated with every commit.
last-updated: 2026-05-24
last-model: amelia(claude-opus-4-7)
last-change: post-Phase-7 debt cleanup (eslint flat-native, MDX loader, contact decision, pnpm config)
---

# Changelog

All meaningful changes to the Kraftreich Web Site, newest first. Format follows Keep-a-Changelog conventions; versioning is calendar-style until the first production tag.

## [Unreleased] — 2026-05-24

### Fixed
- **ESLint flat-native composition.** Dropped `eslint-config-next` + `@eslint/eslintrc`'s `FlatCompat` bridge. Wired `@next/eslint-plugin-next` (core-web-vitals), `eslint-plugin-react-hooks@7`, `eslint-plugin-jsx-a11y@6`, and `@typescript-eslint` directly in `eslint.config.mjs`. Eliminates the circular-ref crash inside `eslint-config-next`'s legacy react extension under ESLint 10. Lint, typecheck, and `next build` all green; pre-commit (`lint-staged`) re-enables `eslint --fix` on TS/JS files.
- **pnpm postinstall approval config.** Moved `sharp` + `unrs-resolver` build approval to `pnpm-workspace.yaml`'s `allowBuilds` map (pnpm 11+ canonical surface) and removed the silently-ignored `pnpm.onlyBuiltDependencies` field from `package.json`. Eliminates the per-command warning and the `ERR_PNPM_IGNORED_BUILDS` for `sharp`.

### Added
- **MDX content loader.** `src/shared/lib/content/work.ts` reads `src/content/work/*.mdx` synchronously at build, parses frontmatter via `gray-matter`, validates with a Zod schema, enforces `filename === slug`, and excludes `draft: true` in production. Three MDX files (`antagonist`, `threshold`, `loop-format`) replace the hardcoded placeholder array. `WorkProject` type aligned to README contract (`cover` required, `draft?` added).

### Changed
- **Contact remains mailto-only by design.** `ContactLinks.tsx` copy and metadata updated to reflect that no third-party email backend will ship; the placeholder address `hello@kraftreich.example` is the only swap point when a real address exists.

### Removed
- `src/entities/work-project/constants/placeholder-works.ts` (replaced by the MDX loader).
- `eslint-config-next` + `@eslint/eslintrc` devDeps (53 packages, no longer needed).
- `pnpm.onlyBuiltDependencies` field from `package.json` (pnpm 11 ignores it).

## [Unreleased] — 2026-05-23

### Added
- **Phase 1 — Foundation.** Five foundation documents at repo root: `CLAUDE.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `STACK.md`, `ENGINEERING_PRINCIPLES.md`. Codified non-negotiables, layer rules, six-segment feature standard, Stop-and-Ask Triggers, AI Decision Escalation contract.
- **Phase 2 — Scaffold.** `src/` application root. Feature-Sliced layers: `app/`, `features/`, `entities/`, `shared/`, `content/`. Per-folder READMEs documenting purpose and rules.
- **Phase 3 — Stack.** Next.js 15.5, React 19.2, TypeScript 5.9 strict, Tailwind v4.3, Three.js 0.184 + @react-three/fiber 9.6 + @react-three/drei 10.7, Framer Motion 12.40, Zod 4.4. ESLint flat config + Prettier + Husky + lint-staged.
- **Phase 4 — Design Tokens.** `src/shared/styles/tokens.css` as single source of truth via Tailwind v4 `@theme` (color, typography, spacing, motion, container, radius, z-index). `motion.css` with reduced-motion gate and focus-ring defaults.
- **Phase 5 — Primitives.** Six components in `src/shared/ui/`: `Container`, `Text`, `Heading`, `Button`, `Link`, `Section`. Tiny `cn` helper in `src/shared/lib/`.
- **Phase 6 — Scene Architecture.** Five files in `src/shared/three/`: `CanvasShell`, `SceneStage`, `PerformanceBoundary`, `useAsset`, `motion-tokens`. R3F-side mirrors of the CSS motion tokens.
- **Phase 7 — Pages.** Five routes under `src/app/(site)/`: Home, Work index, Work detail (`[slug]` via `generateStaticParams`), About, Contact. Six feature slices. First entity: `work-project` (triggered because `work-showcase` and `work-detail` share data + UI).
- Root layout composes site nav + footer; all routes static-prerendered, every route ≤ 110 kB First Load JS.

### Notes
- pnpm pinned via `packageManager` field at `pnpm@11.2.2`.
- Content currently uses a hardcoded placeholder array in `src/entities/work-project/constants/` until the MDX loader ships.
- ESLint flat config + Next 16 + FlatCompat hits a circular-ref crash in `eslint-config-next`'s react plugin under ESLint 10. As a result, `lint-staged` runs Prettier only at commit time. ESLint will be reinstated when upstream ships a flat-config-native release.

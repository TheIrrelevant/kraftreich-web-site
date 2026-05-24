---
type: doc
category: log
scope: repo
description: Human-readable log of meaningful changes. Updated with every commit.
last-updated: 2026-05-24
last-model: amelia(claude-opus-4-7)
last-change: brand alignment — tokens, fonts, primitives, video-driven particle hero
---

# Changelog

All meaningful changes to the Kraftreich Web Site, newest first. Format follows Keep-a-Changelog conventions; versioning is calendar-style until the first production tag.

## [Unreleased] — 2026-05-24 (evening)

### Added
- **Brand assets.** Avenir (5 weights) and WarblerDeck (Regular/Italic/Bold/BoldItalic) under `public/assets/fonts/`; light/dark monogram logos under `public/assets/logo/`; Rosalia Berghain MP4 under `public/assets/video/` (silent source for the particle hero).
- **Local font registration.** `src/shared/lib/fonts.ts` wires both families via `next/font/local` exposing `--font-avenir` and `--font-warbler`; layout applies the variable classNames to `<html>`. Tokens lead their stacks with these vars.
- **Audio-particle hero.** `src/features/audio-particle-cloud/` — a video-driven particle screen replacing the prior visible video hero. Hidden `<video>` feeds both `THREE.VideoTexture` (for shader sampling) and Web Audio's `MediaElementSource` (for analyser-driven pulse + gain-based mute). 60k bone-white particles random-scatter across a 16:9 plane; per-particle random thresholds against the video's blurred luma drive density modulation (film-grain look). Mouse repulsion + spring return. Mute button bottom-right uses a `GainNode` so the analyser keeps reading data when silenced.
- **HomeHero.** `src/features/home-hero/` — full-viewport composition that mounts the particle cloud over the primary canvas.

### Changed
- **Design tokens aligned to BRAND-GUIDELINE.md §IV/V/X.**
  - Color: brand-identity (`--primary` Obsidian Black `#040205`, `--secondary` Bone White `#f9feff`, `--accent` Ash Silver `#e2e7e9`) + the Matte semantic palette (`--background` Forge Smoke, `--foreground` Iron Slate, `--border` Gunmetal, `--success` Verdant Iron, `--info` Cobalt Dusk, `--warning` Molten Amber, `--error` Burnt Crimson). All legacy `--color-bg / -fg / -accent / -border / -muted / -faint` tokens removed across 11 callsites.
  - Typography: scale renamed to brand roles (`--text-h1` 48–64 clamp, `--text-h2` 32–40, `--text-h3` 24–28, `--text-body` 16, `--text-body-sm` 14, `--text-caption` 12) with brand-spec line-heights.
  - Spacing: 8-point grid renamed by px value (`--space-8` … `--space-96`). Existing `--space-N` index references migrated; 12 → 16, 128 → 96 (cap).
  - Radius: `--radius-sm` 4, `--radius-md` 8, `--radius-lg` 12.
- **Primitives aligned to brand.** `Heading` size keys `h1/h2/h3` (Warbler Bold); `Text` size keys `caption/body-sm/body` with brand-spec weights, `faint` tone dropped; `Button` adds Avenir Medium + brand padding `24/16`; `Link` `accent` tone uses Cobalt Dusk; `Section` rhythm steps differentiated (32/48/64/96). All consumer callsites updated.
- **SiteNav.** Warbler-display "Kraftreich" wordmark linking home; labels updated (Work → Gallery, About → Who I am?, Contact → Get Touch). Switched from `sticky` + primary-tinted bg to `fixed inset-x-0 top-0 bg-transparent`; bottom border removed.
- **BRAND-GUIDELINE.md.** Obsidian Black hex updated `#222121` → `#040205` across §IV Primary Colors, Color Rules, and §X UI Defaults (master-approved hue darkening).

### Fixed
- **Tailwind v4 font utility ambiguity.** `font-[var(--font-display)]` was being interpreted as `font-weight`, never `font-family`. Switched all primitives + nav to the theme-generated `font-display` / `font-body` utility classes that Tailwind v4 auto-generates from the `@theme` block, restoring Warbler/Avenir rendering.
- **AudioContext autoplay handshake.** First `tryStart()` could create the graph successfully but fail `audio.play()` (no user gesture). The early `if (ctx) return` then blocked retries. Split into `ensureGraph()` (once) + `tryStart()` (idempotent retry on every user gesture). Video element starts `muted=true` to satisfy autoplay; the listener flips it to `false` on first gesture so `MediaElementSource` actually carries a signal (Chrome silences a muted element through its source node). Default `GainNode` value is `0.3` (30%).
- **Next.js dev-tools indicator.** `devIndicators: false` in `next.config.mjs` hides the floating route/turbopack badge in dev.

### Removed
- Hero `hardtechno-16-9.mp4` background video and the separate Rosalia Berghain MP3 (audio is now sourced from the video element itself).
- Stray `eslint.config 2.mjs` Finder-copy duplicate at repo root.

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

---
type: doc
category: log
scope: repo
description: Human-readable log of meaningful changes. Updated with every commit.
last-updated: 2026-07-17
last-model: amelia(cursor-grok-4.5)
last-change: remove Figure Series + Schwarzgewalt; update skills tools
---

# Changelog

All meaningful changes to the Kraftreich Web Site, newest first. Format follows Keep a Changelog conventions; versioning is calendar-style until the first production tag.

## [Unreleased] — 2026-07-17

### Changed
- **Identity strip index / grid.** Removed Figure Series (`gallery-07`) and Schwarzgewalt (`gallery-12`) from the home index and Work/Art columns.
- **Skills line.** Dropped Planting Design, Figma, Blender; added Autocad, Sketchup, Lumion (`about-me.md`).
- **Vinyl intro assemble = asset-load progress.** `waitForSiteReady` reports `onProgress` (0–1); `VinylLoadingProvider` drives `assembleProgress` from that progress so particles gather across the full load window instead of finishing in 2s and waiting.
- **Audible unlock after intro only.** `VinylAudioEngine` muted warm-starts during loading; gesture / mute-toggle unmute waits until vinyl intro `isComplete`.

## [Unreleased] — 2026-05-29

### Added
- **`GalleryIndexList`.** Clickable identity-strip project index sorted newest-first; scrolls to the matching grid cell without opening the detail panel.
- **`IdentityIconRow`.** Fourth row in column one — headset mute + Instagram / Behance / LinkedIn icon links in one uniform row.
- **Gallery detail vinyl layer.** `GALLERY_DETAIL_VINYL_LAYER_ID` keeps the vinyl particle disc visible above the dimmed backdrop when a gallery item is open.

### Changed
- **`gallery.ts`.** Moved `gallery-12` (Schwarzgewalt) to the top of the Work column; index rows sort by year descending.
- **`WorkGrid`.** Sticky column headers (About Me / Work / Art) at 16px via `--text-grid-column-title`; grid cells use `scroll-mt` for index deep-links.
- **`IdentityStrip`.** Social links consolidated into `IdentityIconRow`; Behance → `ugurozkan35`, LinkedIn → `kraftreich-studio`.
- **`VinylParticles`.** No longer unmounts when gallery detail is open — portals into the gallery vinyl layer instead.
- **`GalleryDetailPanel`.** Explicit z-index stack for backdrop, vinyl, panel, and close control.

### Removed
- **`docs/GALLERY-ITEM-DETAIL.md`**, **`docs/HOME-PAGE-CONTENT.md`.** Superseded by markdown content under `public/assets/gallery/`.

## [Unreleased] — 2026-05-26

### Added
- **`vinyl-particles` feature.** `src/features/vinyl-particles/` — interactive vinyl-disc particle field below the IdentityStrip name column. Concentric grooves, center label, outer rim, and spindle hole; pointer repulsion with spring return; BPM-driven spin (125 BPM) pauses while muted. Canvas portals to `document.body` via `VinylMount` anchor so particles stay above the scrolling work grid (`Z_HOME_VINYL`).
- **`audio-mute` context (restored).** `src/shared/lib/audio-mute/` — shared mute/activation state for `VinylAudioEngine` and headset toggle; gain applied on `GainNode` so the analyser keeps reading while muted.
- **Identity model.** `src/features/identity-strip/model/identity.ts` — name and email constants for the left column.
- **Hero audio asset.** `public/assets/audio/bergain.mp3` — autoplay after user activation at 30% gain.

### Changed
- **`IdentityStrip`.** `muteSlot` / `vinylSlot` props; left column typography aligned with center column; email link added.
- **`home-layers.ts`.** `Z_HOME_VINYL` (40) above `Z_HOME_GRID` (30) for vinyl-over-grid stacking.

### Removed
- **`audio-particle-cloud` feature.** Deleted `src/features/audio-particle-cloud/` — `AudioParticleCloud`, `AudioMuteToggle`, and `hero-video` constants.
- **`audio-mute` shared context.** Deleted `src/shared/lib/audio-mute/`.
- **`shared/three` R3F scaffolding.** Deleted `src/shared/three/` — no remaining 3D scenes.
- **Three.js dependencies.** Removed `@react-three/fiber`, `@react-three/drei`, `three`, and `@types/three`.
- **Hero runway spacer and scroll opacity fade.** Removed 50vh idle gap, particle morph scroll hooks, and section-level grid opacity animation tied to the retired particle hero.
- **`audioSlot` prop on IdentityStrip.**

### Changed
- **`HomeHero`.** Thin client wrapper: scroll reset on mount + `<WorkGrid />`.
- **`WorkGrid`.** Always-opaque `bg-primary` at `Z_HOME_GRID` so the grid covers the sticky IdentityStrip on scroll (fixes strip text bleeding through a transparent section).
- **`IdentityStrip`.** Removed bottom padding; grid sits flush under strip content.
- **`home-layers.ts`.** Added to `src/shared/constants/` with z-index tokens only.

# Changelog

All meaningful changes to the Kraftreich Web Site, newest first. Format follows Keep-a-Changelog conventions; versioning is calendar-style until the first production tag.

## [Unreleased] — 2026-05-24 (night)

### Added
- **`work-grid` feature.** `src/features/work-grid/` — 5-row × 3-column grid (15 cells: About Me + gallery-01..14). Each cell renders a title, a 16:10 placeholder cover, and a 2-sentence description slot. Opacity is driven by a monotonic motion-value tied to `scrollY` (0..600px) so the grid fades in alongside the particle morph and never fades back out once revealed.
- **Audio-mute context provider.** `src/shared/lib/audio-mute/` — small client-side React context holding `muted`, `hasActivated`, `toggleMute`, `registerActivation`, and `registerOutputGain`. Lives in `shared/` so two features in different vertical slices (`audio-particle-cloud` owning the graph, `identity-strip` hosting the headset toggle) can share state without breaching the cross-feature import rule. Mute is applied to the `GainNode` synchronously inside the React state updater — a previous reactive `useEffect[muted]` mirror lost mute changes in a race and was replaced.
- **Idle-gap collapse.** `HomeHero` shrinks the pre-grid spacer from 50vh to 0vh via a motion value tied to the morph progress. After the first scroll past the morph threshold, the gap stays collapsed for the page lifetime so a scroll-back-to-top reveals the locked sphere with the grid seated directly under the IdentityStrip.

### Changed
- **Monotonic morph + grid ratchet.** Both `morphRef` (read inside R3F's `useFrame`) and the grid opacity motion value are now write-only-increasing: once a higher progress value is reached, scrolling back never reverts the sphere into the scatter or fades the grid back to invisible. Page refresh resets the ratchet via `history.scrollRestoration = "manual"` + `scrollTo(0, 0)` on `HomeHero` mount so users always start with the idle scatter.
- **Z-axis re-stack.** Particle canvas section moved from `z-0` to `z-30` so the sphere reads as a top-most vinyl-style bleed over the IdentityStrip (now `z-20` with `bg-[var(--primary)]`) and the WorkGrid (`z-10`). The particle canvas carries `pointer-events: none` and an explicit `style={{ pointerEvents: "none" }}` on the R3F Canvas itself — R3F's default events layer otherwise installs pointer listeners on the canvas DOM that override the parent's pointer-events:none and intercept clicks meant for the headset toggle.
- **Headset toggle restructure.** `AudioMuteToggle` is now a plain inline button (no portal, no `position: fixed`, no AnimatePresence) consumed via the `useAudioMute` hook. It slots into the IdentityStrip's left column under "Ugur Ozkan" through a new `audioSlot?: ReactNode` prop on `IdentityStrip`. Always visible — slashed pre-activation, clean once audio is playing. An activation-window guard (250 ms) prevents the activation click from immediately re-muting the audio it just started.
- **Layout.** `src/app/layout.tsx` no longer renders any chrome — both nav and footer are gone. The IdentityStrip carries identity + wayfinding inline.

### Removed
- **`site-footer` feature.** `src/features/site-footer/` and its layout mount removed; copyright + email line lived there with no remaining purpose for the current single-page composition.

## [Unreleased] — 2026-05-24 (late evening)

### Added
- **IdentityStrip feature.** `src/features/identity-strip/` — sticky-top Server Component with name + role/location + gallery index, monospace terminal-density layout. Replaces the global site nav as the page-level wayfinding surface.
- **Scroll-driven hero morph.** `HomeHero` now fixes the particle canvas full-viewport and exposes a `morphRef` (0→1) updated via framer-motion `useScroll` over `COMPACT_SCROLL_PX` (600px). A 200vh scroll spacer gives the user the vertical distance needed to trigger the full morph. The R3F scene reads `morphRef` per frame to lerp particles from the loose video scatter into a tight Fibonacci sphere anchored at the left viewport edge.
- **Headset mute toggle.** `src/features/audio-particle-cloud/ui/AudioMuteToggle.tsx` — fixed-position headset icon aligned under the IdentityStrip name column. Renders via React portal to `document.body` to escape the hero section's `fixed` stacking context. Visible only after the user has activated audio AND scrolled past the morph threshold. Mutes via the output `GainNode` (gain.value 0 ↔ 0.3) so the analyser keeps reading frequency data and the sphere keeps pulsing visually.
- **`next.config.mjs` outputFileTracingRoot pin.** Anchors build tracing to the repository directory so multiple lockfiles on the machine cannot mislead Next into walking up to a parent user directory.

### Changed
- **AudioParticleCloud.** Rebuilt as a single-file scene with internal video element + audio graph management (previous `use-audio-analyser.ts` hook removed, logic inlined). Particles now random-scatter on an open 16:9 plane in the idle state and morph into a left-anchored sphere; a 5-tap luma blur drives per-particle density via `uThreshold + aRand` cutoffs. The previous bottom-right mute control is removed in favour of the headset toggle.

### Removed
- **SiteNav.** `src/features/site-nav/` and its layout mount — wayfinding moved into the IdentityStrip.
- **`use-audio-analyser` hook.** Logic merged into `AudioParticleCloud` to keep the video element + audio graph + mute state colocated.

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

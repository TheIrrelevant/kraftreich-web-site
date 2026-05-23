---
type: doc
category: foundation
scope: repo
description: Design tokens and primitive components for the Kraftreich Web Site. Lightweight, opinionated, and intentionally small.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: swapped Image → Section in the six primitives to match Phase 5 plan
---

# DESIGN_SYSTEM.md

## Premise

A portfolio doesn't need a design system — it needs a discipline. Four token groups, six primitives, and the rule that nothing else gets invented without removing something first.

## Token Groups

Tokens live in `src/shared/styles/tokens.css` as CSS custom properties. Tailwind reads them via `tailwind.config.ts`. Components reference Tailwind classes — never raw hex, raw px, or raw ms.

### 1. Color

Semantic, not raw. Names describe intent, not pigment.

```
--color-bg          page background
--color-bg-muted    secondary surface
--color-fg          primary text
--color-fg-muted    secondary text
--color-fg-faint    tertiary text, captions
--color-accent      single interactive accent
--color-border      hairline dividers
```

Rules:
- One accent color. If a second is needed, the first is wrong.
- No gradients in tokens. Gradients are compositions defined in components.
- Dark by default. Light theme deferred until it's actually requested.

### 2. Typography

One serif for display, one sans for body. No third family without explicit removal of one.

```
--font-display      serif, headings only
--font-body         sans, everything else
--font-mono         monospaced, code only (rare)
```

Scale (four sizes, no exceptions):

```
--text-xs           12px / 16px
--text-sm           14px / 20px
--text-base         16px / 24px
--text-lg           20px / 28px
--text-xl           32px / 36px
--text-display      clamp(48px, 8vw, 120px)
```

Tracking and weight:
- Display: tight tracking, regular weight.
- Body: normal tracking, regular weight.
- Strong: same family, semibold. Never italic for emphasis.

### 3. Spacing

8-point grid. Tailwind defaults are accepted. Custom spacing only when the grid breaks for a typographic reason (optical alignment), and only as a token.

```
--space-1   4px
--space-2   8px
--space-3   12px
--space-4   16px
--space-6   24px
--space-8   32px
--space-12  48px
--space-16  64px
--space-24  96px
--space-32  128px
```

### 4. Motion

Motion is structural here — Three.js scenes inherit these tokens so screen transitions and WebGL animations feel like one system.

Durations:

```
--motion-instant    80ms
--motion-fast       160ms
--motion-base       240ms
--motion-slow       480ms
--motion-cinematic  900ms
```

Easings:

```
--ease-out          cubic-bezier(0.22, 1, 0.36, 1)      default
--ease-in-out       cubic-bezier(0.65, 0, 0.35, 1)      transitions
--ease-emphasized   cubic-bezier(0.2, 0, 0, 1)          hero moments
```

Rules:
- No `ease-linear` outside scrubbed scroll animations.
- Default to `--motion-base` + `--ease-out`. Justify deviations in code comments.
- Honour `prefers-reduced-motion`. R3F scenes degrade to static framing; Framer Motion animations short-circuit via `useReducedMotion()`.

### Motion Engines

Two engines coexist with strict, non-overlapping scope:

| Engine | Use For | Do Not Use For |
|--------|---------|----------------|
| **Framer Motion** | Page transitions, micro interactions, opacity / transform, orchestrated UI timing (staggered reveals, list animations) | Physics simulations, continuous rendering, anything inside `<Canvas>` |
| **Three.js / R3F** | Immersive scenes, physics-driven motion, continuous rendering, camera choreography, shader-driven animation | Everything that lives in the DOM |

Implementation rules:

- Framer Motion components are client-only. Wrap in `"use client"` and import from `@/shared/motion/` presets — never write raw `duration={0.24}` literals in features.
- A single `MotionConfig` at `src/app/providers.tsx` sets default transitions and reduced-motion strategy.
- Variants and transitions read from the same tokens above. Example: `transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] }` mirrors `--motion-base` + `--ease-out`.
- Page transitions live in `src/shared/motion/page-transition.ts`. Routes consume the preset; they do not redefine it.
- R3F easing functions consume the same numeric tuples. The two engines share one source of truth.
- Framer Motion and R3F never animate the same DOM element. If both want a target, the target is wrong.

## Primitives (six)

Located in `src/shared/ui/`. Each is small, composable, and owns one job.

| Component | Responsibility |
|-----------|----------------|
| `Container` | Constrains width and applies side gutters. No vertical padding. |
| `Text` | Renders body copy at a token size. Polymorphic via `as`. |
| `Heading` | Display type at a token size. Polymorphic via `as` (`h1`–`h6`). |
| `Button` | Interactive affordance. Two variants: `primary`, `ghost`. |
| `Link` | Navigation. Wraps `next/link` with token-aware styling. |
| `Section` | Semantic `<section>` with vertical rhythm (padding-block from token). |

That's the list. New primitives require:
1. Two existing places that need it, **and**
2. Removal or merge of an existing primitive.

## Composition Rules

- Primitives compose. Features compose primitives.
- Variants live on primitives, not on consumers. If a feature needs a button color the system doesn't offer, the answer is "no" until two features need it.
- No prop drilling beyond two levels. Use composition (children, slots) instead.
- No `className` overrides on primitives that change semantic meaning. Layout-only utility classes (`mt-*`, `flex-1`) are fine.

## Three.js & The Design System

The WebGL layer is part of the same system, not a parallel one.

- Scene materials read motion tokens for animation timing.
- Scene colors read color tokens via CSS-variable bridges (`getComputedStyle(document.documentElement)`).
- One canvas per page maximum. Multiple scenes share the canvas via R3F routing.
- Cameras and lighting are defined once in `src/shared/three/` and parameterized per scene.

## Accessibility Baseline

- WCAG AA contrast against `--color-bg` for `--color-fg` and `--color-accent`.
- Every interactive element has a visible focus ring using `--color-accent`.
- All R3F scenes have a static fallback for `prefers-reduced-motion` and for users without WebGL.
- Headings form a single logical outline. No skipped levels for visual sizing — use the polymorphic `as` prop.

## Iconography

- Single icon set. Lucide. No mixing.
- 24px default, 16px in dense UI. No other sizes.
- Stroke width matches body font weight visually (1.5px).

## What This System Refuses

- A second accent color.
- Component variants invented "in case we need them."
- Shadow tokens (the site doesn't use elevation as a metaphor).
- Border radius tokens (one radius, defined in Tailwind config; if it varies, it's a different component).
- Theme toggling before a second theme exists.
- Storybook before the primitives stabilize.

## When To Edit This Document

Edit when a token is added, removed, or renamed. Edit when a primitive is added or retired. Do not edit to record minor color tweaks — `tokens.css` is the source of truth for values; this document is the source of truth for the system.

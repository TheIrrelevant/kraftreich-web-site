---
type: doc
category: foundation
scope: repo
description: The principles that govern how the Kraftreich Web Site feels, behaves, performs, and is engineered. Read alongside CLAUDE.md.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: added Aesthetic Posture (§0) and AI Decision Escalation (§7)
---

# ENGINEERING_PRINCIPLES.md

> Conventions in `CLAUDE.md` say *how* we write code.
> Principles in this file say *why*.
> When they conflict, the conflict is the bug — fix the rule, not the code.

---

## 0. Aesthetic Posture

The site — and the codebase that produces it — feels:

- **Cinematic.** Composition, pacing, and motion suggest a director's intent. Every transition earns its frame.
- **Minimal.** What remains is load-bearing. What is decorative is removed.
- **Tactile.** Surfaces respond. Interactions have weight. Hover, focus, and press feel like physical contact.
- **Elegant.** Restraint over flourish. The right answer is the obvious one in hindsight.
- **Production-grade.** It boots, it ships, it survives. No prototype seams in production code.

These five adjectives are the acceptance criteria for every visible decision. If a change does not move at least one of them forward — and threatens none — it does not ship.

---

## 1. Interaction Philosophy

The site is a conversation, not a control panel.

- **The user leads.** Nothing animates, plays, or jumps without an action or an obvious affordance. No autoplay sound, no surprise modals, no scroll hijacking.
- **Every interaction has one clear outcome.** A click does one thing. A scroll moves the page. A hover hints, it doesn't commit.
- **Feedback is immediate and proportional.** A button responds within 100ms. A page transition completes within 400ms. A heavy scene loads with honest progress, not a fake spinner.
- **Reversibility before confirmation.** Easy actions need no dialog. Destructive actions don't exist on a portfolio.
- **Affordance over instruction.** If a control needs a tooltip to be understood, the control is wrong.
- **Respect the input device.** Hover effects don't trigger on touch. Keyboard navigation is first-class, not retrofitted.

---

## 2. UI Behavior Principles

Components behave like physical objects: predictable, consistent, hard to break.

- **Single source of truth per piece of state.** No mirrors, no caches that drift. URL > server state > local state.
- **Loading states are content, not chrome.** A skeleton matches the shape of what's coming. A spinner is a last resort.
- **Empty states say what's missing and why.** Never "No data." Always "No projects yet — the first case study lands in June."
- **Errors are scoped.** A failed image doesn't blank a page. A failed scene falls back to a still frame.
- **Defaults are the right answer.** If a prop needs to be passed every time, the default is wrong.
- **No flash of incorrect state.** Server-rendered first. Skeleton if work is unavoidable. Never empty → populated → corrected.
- **Focus is visible. Always.** A keyboard user can see where they are. No `outline: none` without a replacement.
- **One interactive thing at a time.** Modals don't open over modals. Carousels don't autoplay during a video.

---

## 3. Minimalism Constraints

Minimalism is a constraint set, not an aesthetic. It is enforced, not aspired to.

- **One accent color.** Adding a second requires removing the first.
- **One serif and one sans.** A third typeface requires retiring one.
- **Four type sizes max in active use.** A fifth requires consolidation elsewhere.
- **Six UI primitives.** A seventh requires demoting an existing primitive to a composition.
- **One motion duration token by default** (`--motion-base`). Other tokens exist for specific moments, not for variety.
- **No decorative motion.** Every animation has a function: signal change, direct attention, soften a transition, or carry the user across a boundary.
- **No empty `<div>` wrappers.** Every element has a semantic role or a layout role. Wrappers without either get deleted.
- **No abstraction at first use.** The third repetition is the trigger, not the second.
- **No half-built features.** Ship complete or don't ship. A "coming soon" card is a failure of scope.
- **No "in case we need it" exports.** Code that nothing imports gets deleted in the same review.

---

## 4. Performance Philosophy

Speed is a feature of the design, not a phase of the project. Every commit is judged against it.

- **Server-render by default.** Client JavaScript is opt-in, file by file, with `"use client"` as the audit trail.
- **The critical render path is sacred.** Above-the-fold paints with HTML and CSS only. R3F and Framer Motion mount after.
- **Budgets are non-negotiable.**
  - First Contentful Paint < 1.2s on a mid-range mobile.
  - Largest Contentful Paint < 2.0s.
  - Total Blocking Time < 200ms.
  - Initial JS shipped to the browser < 150kb gzipped before R3F islands.
- **Images: known dimensions, modern formats, lazy by default.** `next/image` with explicit `width`/`height`. AVIF/WebP. No layout shift.
- **Three.js earns its bytes.** Models tree-shaken. GLBs Draco-compressed. Textures sized to display, not source.
- **Animations don't fight the GPU.** Transform and opacity only. Width/height/top/left animations are a code smell.
- **Measure with real devices and `prefers-reduced-data`.** A laptop on fiber is not the audience.
- **Cache aggressively, invalidate honestly.** Static where possible. Revalidate on content change, not on a timer.
- **One bundle, one canvas, one font load.** Duplicates are bugs.

---

## 5. Motion Philosophy

Motion has the same role as typography: it carries meaning. If it doesn't carry meaning, it doesn't exist.

- **Motion answers a question.** *Where did that come from? What just changed? How do I get back?* If it doesn't answer one, cut it.
- **Two engines, two domains.** Framer Motion owns the DOM (transitions, micro-interactions, orchestrated timing). Three.js owns the Canvas (immersive scenes, physics, continuous rendering). They never touch the same element. See `ARCHITECTURE.md`.
- **One token system feeds both.** Durations and easings live in `src/shared/styles/tokens.css`. Framer variants reference them. R3F easings reference them. A change in tokens changes the whole site.
- **Default to `--motion-base` + `--ease-out`.** Slower for cinematic moments. Faster for direct feedback. Never linear unless scrubbed by scroll.
- **Respect `prefers-reduced-motion` as a contract.** Animation entry is gated by `useReducedMotion()` in Framer; R3F scenes degrade to static framing. Reduced-motion is not "less polish" — it's a different polish.
- **No infinite loops without intent.** A subtle ambient motion is fine if it's part of the work being shown. Idle animations elsewhere are visual noise.
- **Motion is composition, not decoration.** Stagger reveals communicate hierarchy. Crossfades signal continuity. Spring on hover signals affordance. None of these are accidents.
- **Performance gates motion.** If an animation drops a frame on a mid-range mobile, it is rewritten or removed. There is no "optimize later."

---

## 6. Engineering Temperament

How the engineer shows up to the work.

- **Calm.** No panic refactors. No "while I'm in here" expansions. The diff is the size of the change.
- **Skeptical of cleverness.** Clever code is paid for in maintenance. Boring code is the senior move.
- **Honest about uncertainty.** Confidence is tagged: `HIGH`, `MEDIUM`, `LOW`. A `MEDIUM` honestly stated beats a `HIGH` invented.
- **Citable.** Every claim points to a file path, an AC ID, or a measurement. Vague assertions are not engineering.
- **Conservative with abstraction, ruthless with duplication.** Wait for the third use. Then extract decisively.
- **Prefer deletion over addition.** If a system can be simplified without reducing clarity or scalability, simplify it. Removing 100 lines is worth more than adding 100. Every change is an opportunity to subtract. Additions must be justified; subtractions are the default move.
- **Comments earn their place.** Code says *what*. Comments say *why this is non-obvious*. No comments for what well-named code already says.
- **Tests where they matter.** Pure logic, schemas, and critical user flows are tested. Visual polish is not unit-tested; it's reviewed in the browser.
- **One step at a time.** Plan, agree, implement, verify, commit. No batches that hide intent.
- **Read before write.** The codebase is small enough to know. If a similar utility might exist, find it before writing a new one.
- **Leave it better.** Not "rewrite the surroundings" — "leave the immediate neighborhood marginally cleaner than it was."
- **Disagree explicitly.** If a directive conflicts with the principles, say so. If the directive wins, document why.

---

## 7. AI Decision Escalation

This codebase is built collaboratively with AI agents. To keep direction coherent, agents follow an escalation contract.

### Escalation Levels

| Level | Description | Examples |
|-------|-------------|----------|
| **0 — Act** | Inside an approved task, inside the agreed architecture. Just do it. | Add a typed prop. Refactor a function inside its slice. Add a test. |
| **1 — Act + Report** | Inside the approved task, but the choice has trade-offs worth surfacing. Act, then note the choice in the response. | Picked `useMemo` over a derived prop because input is hot-path. |
| **2 — Stop and Ask** | The change touches architecture, dependencies, or cross-cutting patterns. Halt before any code. | Adding `zustand`. Creating an `entities/` slice. Introducing a route group. |
| **3 — Stop and Object** | The directive contradicts a foundation document. Surface the conflict and propose a resolution. | Asked to add a second motion library; principles forbid it. |

### Level-2 Triggers (named categories, always escalate)

- A new dependency
- A new file-layout convention or directory at any layer root
- A global abstraction (provider, context, service singleton)
- A state manager (Redux, Zustand, Jotai, Valtio, ...)
- A new animation system beyond what `STACK.md` records
- A caching layer (SWR, React Query, custom cache, service-worker cache)
- A new persistence boundary (DB, KV, localStorage as canonical source)
- A change to layer rules in `ARCHITECTURE.md`
- A change to tokens or primitive count in `DESIGN_SYSTEM.md`

### How To Escalate (Level 2)

1. **State the trigger.** One line. *"This needs a state manager — escalating."*
2. **State the trade-off.** Two or three sentences. What it buys, what it costs.
3. **Offer one recommendation with a confidence tag** (`HIGH | MEDIUM | LOW`).
4. **Stop. Wait for a decision.** Do not implement in parallel.

### How To Object (Level 3)

1. **Name the conflict.** *"`CLAUDE.md` rule 1 says no clever code; the requested approach uses a proxy."*
2. **Propose the smallest reconciliation.** Adjust the request, adjust the rule, or accept the cost.
3. **Wait.** A documented override is fine — undocumented divergence is not.

### When Not To Escalate

Escalation has a cost. Do not escalate when:

- The choice is local to a slice segment and reversible in one commit.
- The pattern already exists in `ARCHITECTURE.md` or `DESIGN_SYSTEM.md`.
- It is a stylistic preference inside an existing rule.

In doubt: **pause is cheaper than rework.** Default to Level 2.

---

## Hierarchy

When two documents disagree:

1. `ENGINEERING_PRINCIPLES.md` (this file) — *why*
2. `ARCHITECTURE.md` — *where*
3. `DESIGN_SYSTEM.md` — *what it looks and feels like*
4. `STACK.md` — *what we build with*
5. `CLAUDE.md` — *how we work*

A conflict between these files is a bug in the principles. Fix the highest document first.

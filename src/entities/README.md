---
type: doc
category: layer
scope: src/entities
description: Business entities shared by two or more features. Empty by design until real duplication justifies extraction.
last-updated: 2026-05-23
last-model: claude-opus-4-7
last-change: initial skeleton
---

# src/entities/

Business entities shared by ≥ 2 features. **Empty at start. May stay empty.**

## When to introduce an entity

Create an entity the first time **the same business concept** has both:

1. A data shape used by ≥ 2 features, **and**
2. A visual or interactive representation used by ≥ 2 features.

Until both conditions are true, the concept lives inside its owning feature.

## Internal structure

Entities follow the same six-segment standard as features. See `src/features/README.md` and `ARCHITECTURE.md`.

## Rules

- An entity may import from `@/shared/` only.
- An entity **may not** import from any feature.
- Promotion direction is one-way: feature → entity → shared.

## Likely future entities (deferred)

- `work-project/` — once `work-showcase` and `work-detail` both render a project preview component.

Do not pre-create entities. Pre-creation is a worse failure than late extraction.

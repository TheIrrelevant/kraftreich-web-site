/**
 * ---metadata---
 * @file src/shared/ui/Text.tsx
 * @description Body copy at a brand size. Polymorphic via `as`. Defaults to <p>.
 *              Sizes follow BRAND-GUIDELINE.md §V Type Scale. Weights match brand:
 *              body / body-sm = Regular (400), caption = Light (300).
 *              For headline-scale type, use Heading.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

import { createElement, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Size = "caption" | "body-sm" | "body";
type Tone = "default" | "muted";
type As = "p" | "span" | "li" | "dd" | "dt" | "blockquote";

const sizeClass: Record<Size, string> = {
  caption: "text-[var(--text-caption)] leading-[var(--text-caption--line-height)] font-light",
  "body-sm": "text-[var(--text-body-sm)] leading-[var(--text-body-sm--line-height)] font-normal",
  body: "text-[var(--text-body)] leading-[var(--text-body--line-height)] font-normal",
};

const toneClass: Record<Tone, string> = {
  default: "text-[var(--secondary)]",
  muted: "text-[var(--accent)]",
};

type Props = HTMLAttributes<HTMLElement> & {
  as?: As;
  size?: Size;
  tone?: Tone;
  children: ReactNode;
};

export default function Text({
  as = "p",
  size = "body",
  tone = "default",
  className,
  children,
  ...rest
}: Props) {
  return createElement(
    as,
    {
      className: cn("font-body", sizeClass[size], toneClass[tone], className),
      ...rest,
    },
    children,
  );
}

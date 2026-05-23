/**
 * ---metadata---
 * @file src/shared/ui/Text.tsx
 * @description Body copy at a token size. Polymorphic via `as`. Defaults to <p>.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import { createElement, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Size = "xs" | "sm" | "base" | "lg";
type Tone = "default" | "muted" | "faint";
type As = "p" | "span" | "li" | "dd" | "dt" | "blockquote";

const sizeClass: Record<Size, string> = {
  xs: "text-[var(--text-xs)] leading-[var(--text-xs--line-height)]",
  sm: "text-[var(--text-sm)] leading-[var(--text-sm--line-height)]",
  base: "text-[var(--text-base)] leading-[var(--text-base--line-height)]",
  lg: "text-[var(--text-lg)] leading-[var(--text-lg--line-height)]",
};

const toneClass: Record<Tone, string> = {
  default: "text-[var(--color-fg)]",
  muted: "text-[var(--color-fg-muted)]",
  faint: "text-[var(--color-fg-faint)]",
};

type Props = HTMLAttributes<HTMLElement> & {
  as?: As;
  size?: Size;
  tone?: Tone;
  children: ReactNode;
};

export default function Text({
  as = "p",
  size = "base",
  tone = "default",
  className,
  children,
  ...rest
}: Props) {
  return createElement(
    as,
    {
      className: cn("font-[var(--font-body)]", sizeClass[size], toneClass[tone], className),
      ...rest,
    },
    children,
  );
}

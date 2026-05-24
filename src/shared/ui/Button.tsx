/**
 * ---metadata---
 * @file src/shared/ui/Button.tsx
 * @description Interactive affordance. Two variants: primary, ghost.
 *              Polymorphic via `as` to render as <button> (default) or any element.
 *              When rendered as an anchor or Link, the consumer ensures correct semantics.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "ghost";
type Size = "sm" | "base";

const variantClass: Record<Variant, string> = {
  primary: "bg-[var(--secondary)] text-[var(--primary)] hover:bg-[var(--accent)]",
  ghost:
    "bg-transparent text-[var(--secondary)] border border-[var(--accent)] hover:border-[var(--secondary)]",
};

const sizeClass: Record<Size, string> = {
  sm: "px-[var(--space-24)] py-[var(--space-8)] text-[var(--text-body-sm)]",
  base: "px-[var(--space-24)] py-[var(--space-16)] text-[var(--text-body)]",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  size = "base",
  type = "button",
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-[var(--space-8)] rounded-[var(--radius-md)] font-body font-medium disabled:opacity-50 disabled:pointer-events-none",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

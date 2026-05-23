/**
 * ---metadata---
 * @file src/shared/ui/Heading.tsx
 * @description Display type at a token size. Polymorphic via `as` (h1–h6).
 *              Semantic level (`as`) is decoupled from visual size (`size`) — pick both.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Level = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type Size = "lg" | "xl" | "display";

const sizeClass: Record<Size, string> = {
  lg: "text-[var(--text-lg)] leading-[var(--text-lg--line-height)]",
  xl: "text-[var(--text-xl)] leading-[var(--text-xl--line-height)]",
  display:
    "text-[var(--text-display)] leading-[var(--text-display--line-height)] tracking-[var(--text-display--letter-spacing)]",
};

type Props = HTMLAttributes<HTMLHeadingElement> & {
  as?: Level;
  size?: Size;
  children: ReactNode;
};

export default function Heading({
  as: Tag = "h2",
  size = "xl",
  className,
  children,
  ...rest
}: Props) {
  return (
    <Tag
      className={cn(
        "font-[var(--font-display)] text-[var(--color-fg)]",
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

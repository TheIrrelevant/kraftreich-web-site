/**
 * ---metadata---
 * @file src/shared/ui/Heading.tsx
 * @description Display type at a brand size. Polymorphic via `as` (h1–h6).
 *              Visual size (`size`) is decoupled from semantic level (`as`).
 *              Sizes follow BRAND-GUIDELINE.md §V Type Scale. Warbler Bold throughout
 *              (h3 brand allows Bold or Regular — Bold here for visual authority).
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Level = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type Size = "h1" | "h2" | "h3";

const sizeClass: Record<Size, string> = {
  h1: "text-[var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]",
  h2: "text-[var(--text-h2)] leading-[var(--text-h2--line-height)]",
  h3: "text-[var(--text-h3)] leading-[var(--text-h3--line-height)]",
};

type Props = HTMLAttributes<HTMLHeadingElement> & {
  as?: Level;
  size?: Size;
  children: ReactNode;
};

export default function Heading({
  as: Tag = "h2",
  size = "h2",
  className,
  children,
  ...rest
}: Props) {
  return (
    <Tag
      className={cn("font-display font-bold text-[var(--secondary)]", sizeClass[size], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

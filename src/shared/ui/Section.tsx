/**
 * ---metadata---
 * @file src/shared/ui/Section.tsx
 * @description Semantic <section> with vertical rhythm. Owns padding-block from a token scale;
 *              never owns horizontal gutters (Container does). Compose: <Section><Container/></Section>.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Rhythm = "tight" | "base" | "loose" | "cinematic";

const rhythmClass: Record<Rhythm, string> = {
  tight: "py-[var(--space-32)]",
  base: "py-[var(--space-48)]",
  loose: "py-[var(--space-64)]",
  cinematic: "py-[var(--space-96)]",
};

type Props = HTMLAttributes<HTMLElement> & {
  rhythm?: Rhythm;
  children: ReactNode;
};

export default function Section({ rhythm = "base", className, children, ...rest }: Props) {
  return (
    <section className={cn(rhythmClass[rhythm], className)} {...rest}>
      {children}
    </section>
  );
}

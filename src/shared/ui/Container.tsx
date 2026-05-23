/**
 * ---metadata---
 * @file src/shared/ui/Container.tsx
 * @description Constrains width and applies side gutters. No vertical padding (Section owns rhythm).
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Width = "narrow" | "base" | "wide" | "max";

const widthClass: Record<Width, string> = {
  narrow: "max-w-[var(--container-narrow)]",
  base: "max-w-[var(--container-base)]",
  wide: "max-w-[var(--container-wide)]",
  max: "max-w-[var(--container-max)]",
};

type Props = HTMLAttributes<HTMLDivElement> & {
  width?: Width;
  children: ReactNode;
};

export default function Container({ width = "base", className, children, ...rest }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--gutter-sm)] md:px-[var(--gutter-md)] lg:px-[var(--gutter-lg)]",
        widthClass[width],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

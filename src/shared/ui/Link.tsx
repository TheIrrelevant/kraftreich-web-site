/**
 * ---metadata---
 * @file src/shared/ui/Link.tsx
 * @description Navigation. Wraps next/link with token-aware styling.
 *              External URLs auto-detected (http/mailto/tel) — render <a> with rel="noreferrer".
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { AnchorHTMLAttributes, ReactNode } from "react";
import NextLink from "next/link";
import { cn } from "@/shared/lib/cn";

type Tone = "default" | "muted" | "accent";

const toneClass: Record<Tone, string> = {
  default: "text-[var(--color-fg)] hover:text-[var(--color-accent)]",
  muted: "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
  accent: "text-[var(--color-accent)] hover:opacity-80",
};

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  tone?: Tone;
  children: ReactNode;
};

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export default function Link({ href, tone = "default", className, children, ...rest }: Props) {
  const classes = cn(
    "underline-offset-4 decoration-[var(--color-fg-faint)] hover:underline",
    toneClass[tone],
    className,
  );

  if (isExternal(href)) {
    return (
      <a
        href={href}
        rel="noreferrer"
        target={rest.target ?? "_blank"}
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes} {...rest}>
      {children}
    </NextLink>
  );
}

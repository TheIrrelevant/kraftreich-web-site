/**
 * ---metadata---
 * @file src/features/site-nav/ui/SiteNav.tsx
 * @description Top-level site navigation. Composed in src/app/layout.tsx.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import Container from "@/shared/ui/Container";
import Link from "@/shared/ui/Link";

const items = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-[var(--z-nav)] border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
      <Container width="wide">
        <nav className="flex items-center justify-between py-[var(--space-4)]">
          <Link href="/" tone="default" className="text-[var(--text-base)] tracking-tight">
            Kraftreich
          </Link>
          <ul className="flex items-center gap-[var(--space-6)]">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} tone="muted" className="text-[var(--text-sm)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

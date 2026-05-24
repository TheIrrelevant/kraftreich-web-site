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
  { href: "/work", label: "Gallery" },
  { href: "/about", label: "Who I am?" },
  { href: "/contact", label: "Get Touch" },
];

export default function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-nav)] bg-transparent">
      <Container width="wide">
        <nav className="flex items-center justify-between py-[var(--space-16)]">
          <Link
            href="/"
            tone="default"
            className="font-display text-[var(--text-h3)] tracking-tight"
          >
            Kraftreich
          </Link>
          <ul className="flex items-center gap-[var(--space-24)]">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} tone="muted" className="text-[var(--text-body-sm)]">
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

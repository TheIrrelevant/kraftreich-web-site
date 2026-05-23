/**
 * ---metadata---
 * @file src/features/site-footer/ui/SiteFooter.tsx
 * @description Site footer. Composed in src/app/layout.tsx.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import Container from "@/shared/ui/Container";
import Text from "@/shared/ui/Text";
import Link from "@/shared/ui/Link";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-[var(--space-32)] border-t border-[var(--color-border)]">
      <Container width="wide">
        <div className="flex flex-col gap-[var(--space-3)] py-[var(--space-12)] md:flex-row md:items-center md:justify-between">
          <Text size="sm" tone="faint">
            © {year} Kraftreich
          </Text>
          <Link
            href="mailto:hello@kraftreich.example"
            tone="muted"
            className="text-[var(--text-sm)]"
          >
            hello@kraftreich.example
          </Link>
        </div>
      </Container>
    </footer>
  );
}

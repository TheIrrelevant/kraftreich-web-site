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
    <footer className="mt-[var(--space-96)] border-t border-[var(--accent)]">
      <Container width="wide">
        <div className="flex flex-col gap-[var(--space-16)] py-[var(--space-48)] md:flex-row md:items-center md:justify-between">
          <Text size="body-sm" tone="muted">
            © {year} Kraftreich
          </Text>
          <Link
            href="mailto:hello@kraftreich.example"
            tone="muted"
            className="text-[var(--text-body-sm)]"
          >
            hello@kraftreich.example
          </Link>
        </div>
      </Container>
    </footer>
  );
}

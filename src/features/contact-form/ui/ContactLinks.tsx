/**
 * ---metadata---
 * @file src/features/contact-form/ui/ContactLinks.tsx
 * @description Contact links. Mailto-only by design — no third-party email backend.
 *              Replace placeholder address (hello@kraftreich.example) when the real one exists.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

import Heading from "@/shared/ui/Heading";
import Text from "@/shared/ui/Text";
import Link from "@/shared/ui/Link";

const channels = [
  { label: "Email", href: "mailto:hello@kraftreich.example", value: "hello@kraftreich.example" },
  { label: "Instagram", href: "https://instagram.com/", value: "@kraftreich" },
];

export default function ContactLinks() {
  return (
    <article>
      <Heading as="h1" size="h2">
        Contact
      </Heading>
      <Text tone="muted" className="mt-[var(--space-24)]">
        Direct channels.
      </Text>
      <ul className="mt-[var(--space-48)] flex flex-col gap-[var(--space-16)]">
        {channels.map((c) => (
          <li
            key={c.label}
            className="flex items-baseline justify-between border-t border-[var(--accent)] pt-[var(--space-16)]"
          >
            <Text as="span" size="body-sm" tone="muted">
              {c.label}
            </Text>
            <Link href={c.href} tone="default">
              {c.value}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

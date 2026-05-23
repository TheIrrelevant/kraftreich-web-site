/**
 * ---metadata---
 * @file src/features/contact-form/ui/ContactLinks.tsx
 * @description Contact links. The form + server action lands when real backend scope is approved
 *              (Level-2 trigger: new dep + persistence boundary). Mailto-only for now.
 * @last-updated 2026-05-23
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
      <Heading as="h1" size="xl">
        Contact
      </Heading>
      <Text tone="muted" className="mt-[var(--space-6)]">
        Direct channels. A contact form ships once a backend boundary is approved.
      </Text>
      <ul className="mt-[var(--space-12)] flex flex-col gap-[var(--space-4)]">
        {channels.map((c) => (
          <li
            key={c.label}
            className="flex items-baseline justify-between border-t border-[var(--color-border)] pt-[var(--space-4)]"
          >
            <Text as="span" size="sm" tone="faint">
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

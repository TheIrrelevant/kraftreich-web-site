/**
 * ---metadata---
 * @file src/features/identity-strip/model/identity.ts
 * @description Identity strip contact fields. Name uses Unicode escapes for Turkish glyphs
 *              (workspace file policy — no literal Turkish characters in source).
 * @last-updated 2026-07-13
 * ---end-metadata---
 */

/** Display name: Uğur Özkan */
export const IDENTITY_NAME = "U\u011fur \u00d6zkan";

export const IDENTITY_EMAIL = "ugurozkan35@gmail.com";

/** Identity strip middle column — title line. */
export const IDENTITY_TITLE = "Landscape Architect | AI Architect";

/** Identity strip middle column — location line. */
export const IDENTITY_LOCATION = "Izmir, Turkey";

export type IdentitySocialLink = {
  id: "instagram" | "behance" | "linkedin";
  label: string;
  href: string;
};

/** Identity strip column-one social links beside the vinyl mute control. */
export const IDENTITY_SOCIAL_LINKS: ReadonlyArray<IdentitySocialLink> = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/kraftreich/",
  },
  {
    id: "behance",
    label: "Behance",
    href: "https://www.behance.net/ugurozkan35",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/kraftreich-studio",
  },
];

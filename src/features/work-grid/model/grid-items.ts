/**
 * ---metadata---
 * @file src/features/work-grid/model/grid-items.ts
 * @description Ordered list of grid items rendered by WorkGrid. Index 0 is the About Me anchor;
 *              indexes 1..14 mirror the IdentityStrip gallery list (gallery-01..gallery-14).
 *              Click-to-scroll targets use `slug` as the DOM id; placeholder description copy
 *              ships as a single short sentence until real content lands.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

export type GridItem = {
  slug: string;
  title: string;
  description: string;
};

export const GRID_ITEMS: ReadonlyArray<GridItem> = [
  {
    slug: "about-me",
    title: "About Me",
    description: "Designer, artist and LLM engineer working between systems, surfaces and sound.",
  },
  {
    slug: "gallery-01",
    title: "Gallery 01",
    description: "Placeholder description for gallery-01. Two sentence limit.",
  },
  {
    slug: "gallery-02",
    title: "Gallery 02",
    description: "Placeholder description for gallery-02. Two sentence limit.",
  },
  {
    slug: "gallery-03",
    title: "Gallery 03",
    description: "Placeholder description for gallery-03. Two sentence limit.",
  },
  {
    slug: "gallery-04",
    title: "Gallery 04",
    description: "Placeholder description for gallery-04. Two sentence limit.",
  },
  {
    slug: "gallery-05",
    title: "Gallery 05",
    description: "Placeholder description for gallery-05. Two sentence limit.",
  },
  {
    slug: "gallery-06",
    title: "Gallery 06",
    description: "Placeholder description for gallery-06. Two sentence limit.",
  },
  {
    slug: "gallery-07",
    title: "Gallery 07",
    description: "Placeholder description for gallery-07. Two sentence limit.",
  },
  {
    slug: "gallery-08",
    title: "Gallery 08",
    description: "Placeholder description for gallery-08. Two sentence limit.",
  },
  {
    slug: "gallery-09",
    title: "Gallery 09",
    description: "Placeholder description for gallery-09. Two sentence limit.",
  },
  {
    slug: "gallery-10",
    title: "Gallery 10",
    description: "Placeholder description for gallery-10. Two sentence limit.",
  },
  {
    slug: "gallery-11",
    title: "Gallery 11",
    description: "Placeholder description for gallery-11. Two sentence limit.",
  },
  {
    slug: "gallery-12",
    title: "Gallery 12",
    description: "Placeholder description for gallery-12. Two sentence limit.",
  },
  {
    slug: "gallery-13",
    title: "Gallery 13",
    description: "Placeholder description for gallery-13. Two sentence limit.",
  },
  {
    slug: "gallery-14",
    title: "Gallery 14",
    description: "Placeholder description for gallery-14. Two sentence limit.",
  },
];

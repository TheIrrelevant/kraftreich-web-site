/**
 * ---metadata---
 * @file src/shared/lib/fonts.ts
 * @description Local font registration via next/font/local. Avenir (body) and Warbler Deck (display).
 *              Exposes CSS variables --font-avenir and --font-warbler. tokens.css references both.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

import localFont from "next/font/local";

export const avenir = localFont({
  variable: "--font-avenir",
  display: "swap",
  src: [
    {
      path: "../../../public/assets/fonts/avenir/Avenir Light.ttf",
      weight: "300",
      style: "normal",
    },
    { path: "../../../public/assets/fonts/avenir/Avenir Book.ttf", weight: "400", style: "normal" },
    {
      path: "../../../public/assets/fonts/avenir/Avenir Regular.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/avenir/Avenir Heavy.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/avenir/Avenir Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

export const warbler = localFont({
  variable: "--font-warbler",
  display: "swap",
  src: [
    {
      path: "../../../public/assets/fonts/warbler/WarblerDeck-Regular-Testing-BF674fd386b2031.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/warbler/WarblerDeck-Italic-Testing-BF674fd386a68f7.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../../public/assets/fonts/warbler/WarblerDeck-Bold-Testing-BF674fd386a7d12.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/warbler/WarblerDeck-BoldItalic-Testing-BF674fd3867d306.otf",
      weight: "700",
      style: "italic",
    },
  ],
});

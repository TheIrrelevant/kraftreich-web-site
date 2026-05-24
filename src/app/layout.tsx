/**
 * ---metadata---
 * @file src/app/layout.tsx
 * @description Root layout. Loads global stylesheet and font variables. No chrome — nav and
 *              footer were both removed; the IdentityStrip carries identity + wayfinding inline.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { avenir, warbler } from "@/shared/lib/fonts";

export const metadata: Metadata = {
  title: "Kraftreich",
  description: "Kraftreich portfolio web site",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${avenir.variable} ${warbler.variable}`}>
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

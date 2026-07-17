/**
 * ---metadata---
 * @file src/app/layout.tsx
 * @description Root layout. Loads global stylesheet and font variables. No chrome — nav and
 *              footer were both removed; the IdentityStrip carries identity + wayfinding inline.
 * @last-updated 2026-07-17
 * @last-change prefix favicon URLs with withBasePath for Pages
 * ---end-metadata---
 */

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { avenir, warbler } from "@/shared/lib/fonts";
import { withBasePath } from "@/shared/lib/base-path";

export const metadata: Metadata = {
  title: "Kraftreich",
  description: "Kraftreich portfolio web site",
  icons: {
    icon: [{ url: withBasePath("/favicon.png"), type: "image/png" }],
    apple: [{ url: withBasePath("/apple-icon.png"), type: "image/png" }],
  },
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

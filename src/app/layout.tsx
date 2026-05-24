/**
 * ---metadata---
 * @file src/app/layout.tsx
 * @description Root layout. Wraps every route with site nav + footer. Loads global stylesheet.
 *              R3F + MotionConfig providers join here when a page first needs them.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteNav from "@/features/site-nav/ui/SiteNav";
import SiteFooter from "@/features/site-footer/ui/SiteFooter";
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
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

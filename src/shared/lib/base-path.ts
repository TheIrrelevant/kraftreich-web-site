/**
 * ---metadata---
 * @file src/shared/lib/base-path.ts
 * @description Prefix absolute public URLs with NEXT_PUBLIC_BASE_PATH for GitHub Pages project sites.
 *              Next.js Link/router honor basePath; raw <audio>/<img>/<video> src strings do not.
 * @last-updated 2026-07-13
 * ---end-metadata---
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-absolute public path (`/assets/...`) with the deploy basePath when set. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (!basePath) return path;
  if (path === basePath || path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}

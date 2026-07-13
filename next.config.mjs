/**
 * ---metadata---
 * @file next.config.mjs
 * @description Next.js config for static export (GitHub Pages on `live`). Pins output file tracing
 *              to this repository. When GITHUB_PAGES=true, applies project-site basePath.
 * @last-updated 2026-07-13
 * ---end-metadata---
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/kraftreich-web-site";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  outputFileTracingRoot: currentDir,
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(isGithubPages
    ? {
        basePath: repoBasePath,
        assetPrefix: `${repoBasePath}/`,
      }
    : {}),
};

export default nextConfig;

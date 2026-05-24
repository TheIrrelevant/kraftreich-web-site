/**
 * ---metadata---
 * @file next.config.mjs
 * @description Next.js config. Pins output file tracing to this repository so builds do not infer
 *              the parent user directory when multiple lockfiles exist on the machine.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  outputFileTracingRoot: currentDir,
};

export default nextConfig;

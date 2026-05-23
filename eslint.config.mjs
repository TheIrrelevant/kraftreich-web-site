/**
 * ---metadata---
 * @file eslint.config.mjs
 * @description ESLint 10 flat config. Extends next/core-web-vitals + prettier.
 *              next/typescript is omitted intentionally — it triggers a circular-ref crash via
 *              FlatCompat with eslint-config-next 16 + ESLint 10. Reinstate when upstream lands
 *              a flat-config-native release.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  ...compat.extends("next/core-web-vitals", "prettier"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "public/**"],
  },
];

export default config;

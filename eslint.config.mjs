/**
 * ---metadata---
 * @file eslint.config.mjs
 * @description ESLint 10 flat-native config. Composes Next CWV, React Hooks, JSX a11y,
 *              and @typescript-eslint rules directly — no FlatCompat, no eslint-config-next.
 *              This bypasses the eslint-config-next 16 + ESLint 10 circular-ref crash by
 *              avoiding the legacy bridge entirely.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier";

const nextCoreWebVitals = nextPlugin.configs["core-web-vitals"];
const reactHooksRecommended = reactHooksPlugin.configs["recommended-latest"];
const jsxA11yRecommended = jsxA11yPlugin.flatConfigs.recommended;

const config = [
  {
    ignores: [".next/**", "node_modules/**", "public/**", "next-env.d.ts"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@next/next": nextCoreWebVitals.plugins["@next/next"],
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...nextCoreWebVitals.rules,
      ...reactHooksRecommended.rules,
      ...jsxA11yRecommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      ...prettierConfig.rules,
    },
  },
];

export default config;

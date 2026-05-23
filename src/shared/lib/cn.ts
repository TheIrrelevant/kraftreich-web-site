/**
 * ---metadata---
 * @file src/shared/lib/cn.ts
 * @description Minimal class-name composer. Filters falsy values and joins with spaces.
 *              Smaller than clsx; no dependency.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

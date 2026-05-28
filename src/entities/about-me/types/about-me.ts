/**
 * ---metadata---
 * @file src/entities/about-me/types/about-me.ts
 * @description Schema for About Me home grid card content loaded from about-me.md.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

import { z } from "zod";
import { coverAspectSchema } from "@/entities/gallery-item/types/gallery-item";

export const aboutMeExperienceSchema = z.object({
  yearLabel: z.string().min(1),
  company: z.string().min(1),
  title: z.string().min(1),
});

export const aboutMeContentSchema = z.object({
  slug: z.literal("about-me"),
  title: z.string().min(1),
  headline: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  experience: z.array(aboutMeExperienceSchema).min(1),
  coverAspect: coverAspectSchema,
  coverImage: z.string().startsWith("/").optional(),
  slides: z.array(z.string().startsWith("/")).optional(),
  skills: z.string().min(1),
});

export type AboutMeExperience = z.infer<typeof aboutMeExperienceSchema>;
export type AboutMeContent = z.infer<typeof aboutMeContentSchema>;

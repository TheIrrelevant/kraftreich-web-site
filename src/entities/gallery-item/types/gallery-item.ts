/**
 * ---metadata---
 * @file src/entities/gallery-item/types/gallery-item.ts
 * @description Typed gallery item schema for grid cards and detail panel content loaded from
 *              public/assets/gallery/gallery-NN/gallery-NN.md YAML blocks.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

import { z } from "zod";

export const coverAspectSchema = z.enum(["portrait", "tall", "landscape", "wide", "square"]);

export type CoverAspect = z.infer<typeof coverAspectSchema>;

export const mediaAspectClassSchema = z.union([
  coverAspectSchema,
  z.literal("aspect-video"),
  z.literal("aspect-[16/10]"),
]);

export type MediaAspectClass = z.infer<typeof mediaAspectClassSchema>;

const frameAspectSchema = z.string().regex(/^\d+\/\d+$/);

const galleryMediaRowSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("portrait-row"),
    mediaIds: z.array(z.string().min(1)).min(1).max(3),
    frameAspect: frameAspectSchema.optional(),
  }),
  z.object({
    kind: z.literal("pair-row"),
    mediaIds: z.array(z.string().min(1)).min(1).max(2),
    frameAspect: frameAspectSchema.optional(),
  }),
  z.object({
    kind: z.literal("slider"),
    mediaIds: z.array(z.string().min(1)).min(2).max(20),
    frameAspect: frameAspectSchema.optional(),
    frameFit: z.enum(["cover", "contain"]).optional(),
  }),
  z.object({
    kind: z.literal("triple-with-slider"),
    mediaIds: z.tuple([z.string().min(1), z.string().min(1)]),
    sliderMediaIds: z.array(z.string().min(1)).min(2).max(8),
  }),
  z.object({
    kind: z.literal("video-row"),
    mediaIds: z.array(z.string().min(1)).min(1).max(5),
  }),
  z.object({
    kind: z.literal("landscape"),
    mediaIds: z.tuple([z.string().min(1)]),
  }),
]);

export type GalleryMediaRow = z.infer<typeof galleryMediaRowSchema>;

const galleryMediaItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["image", "video"]),
  src: z.string().startsWith("/"),
  poster: z.string().startsWith("/").optional(),
  aspectClass: mediaAspectClassSchema,
  /** Resolved at load time from file dimensions when omitted in YAML. */
  aspectRatio: z
    .string()
    .regex(/^\d+\/\d+$/)
    .optional(),
  caption: z.string().optional(),
});

const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
});

export const galleryItemDetailSchema = z.object({
  slug: z.string().regex(/^gallery-\d{2}$/),
  categoryId: z.enum(["work", "art"]),
  categoryTitle: z.enum(["Work", "Art"]),
  title: z.string().min(1),
  description: z.string().min(1),
  coverAspect: coverAspectSchema,
  coverImage: z.string().startsWith("/"),
  coverGif: z.string().startsWith("/").optional(),
  coverVideo: z.string().startsWith("/").optional(),
  coverVideoPoster: z.string().startsWith("/").optional(),
  coverVideoAspect: z
    .string()
    .regex(/^\d+\/\d+$/)
    .optional(),
  yearLabel: z.string().min(1),
  timeline: z.string().min(1),
  platform: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  tools: z.string().min(1),
  deliverablesIntro: z.string().min(1),
  deliverablesExtra: z.string().optional(),
  team: z.array(teamMemberSchema),
  teamNarrative: z.string().min(1),
  teamAttribution: z.string().min(1),
  summaryStatement: z.string().min(1),
  problem: z.string().min(1),
  solution: z.string().min(1),
  hero: z.object({
    type: z.enum(["image", "video"]),
    src: z.string().startsWith("/"),
    poster: z.string().startsWith("/").optional(),
  }),
  galleryMedia: z.array(galleryMediaItemSchema),
  galleryMediaRows: z.array(galleryMediaRowSchema).optional(),
});

export type GalleryMediaItem = z.infer<typeof galleryMediaItemSchema>;
export type GalleryTeamMember = z.infer<typeof teamMemberSchema>;
export type GalleryItemDetail = z.infer<typeof galleryItemDetailSchema>;

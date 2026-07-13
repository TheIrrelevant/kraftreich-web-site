/**
 * ---metadata---
 * @file src/shared/lib/content/gallery.ts
 * @description Build-time loader for gallery content in public/assets/gallery/. Parses YAML blocks
 *              embedded in gallery-*.md files, validates with Zod, and assembles grid columns,
 *              identity-strip index rows, and detail lookup maps.
 * @last-updated 2026-07-13
 * ---end-metadata---
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { parse as parseYaml } from "yaml";
import { aboutMeContentSchema, type AboutMeContent } from "@/entities/about-me/types/about-me";
import {
  galleryItemDetailSchema,
  type CoverAspect,
  type GalleryItemDetail,
  type GalleryMediaItem,
} from "@/entities/gallery-item/types/gallery-item";
import type { GalleryIndexItem } from "@/features/identity-strip/model/gallery-index";
import type { GalleryCatalog } from "@/features/work-grid/model/gallery-catalog";
import { type GridColumn, type GridItem } from "@/features/work-grid/model/grid-items";

const GALLERY_ROOT = join(cwd(), "public", "assets", "gallery");

const GALLERY_INDEX_TAGS: Record<string, string> = {
  "gallery-01": "Art Direction",
  "gallery-02": "Art Direction",
  "gallery-03": "Art Direction, Ads",
  "gallery-04": "Art Direction, Ads",
  "gallery-05": "Brand Design",
  "gallery-06": "Vinyl Design, Artwork",
  "gallery-07": "Photography",
  "gallery-08": "Architecture",
  "gallery-09": "Architecture",
  "gallery-10": "Architecture",
  "gallery-11": "Painting",
  "gallery-12": "Design System, LLM",
};

const GALLERY_INDEX_LABELS: Record<string, string> = {
  "gallery-01": "BKM",
  "gallery-02": "Yargi",
  "gallery-03": "Bursa Bulbulu",
  "gallery-04": "Vamos",
  "gallery-05": "Benjamin Clean Kitchen",
  "gallery-06": "Klangkuenstler",
  "gallery-07": "Figure Series",
  "gallery-08": "Monolith",
  "gallery-09": "Atrium Serenitatis",
  "gallery-10": "Claritas",
  "gallery-11": "Travel Route",
  "gallery-12": "Schwarzgewalt",
};

const GALLERY_INDEX_COUNT = 12;

const COVER_ASPECT_RATIO_FALLBACK: Record<CoverAspect, string> = {
  portrait: "3/4",
  tall: "4/5",
  landscape: "3/2",
  wide: "2/1",
  square: "1/1",
};

const ABOUT_ME_ROOT = join(GALLERY_ROOT, "about-me");

function discoverAboutMeSlides(coverImage?: string): string[] {
  if (!existsSync(ABOUT_ME_ROOT)) return [];

  const coverFilename = coverImage?.split("/").pop()?.toLowerCase();

  return readdirSync(ABOUT_ME_ROOT)
    .filter((entry) => /\.(png|jpe?g|webp|gif)$/i.test(entry))
    .filter((entry) => {
      if (entry.toLowerCase() === coverFilename) return false;
      return /^media-\d+/i.test(entry) || /^me-\d+/i.test(entry);
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
    .map((entry) => `/assets/gallery/about-me/${entry}`);
}

function fallbackAboutMeContent(): AboutMeContent {
  return {
    slug: "about-me",
    title: "About Me",
    headline: "Landscape Architect | AI Architect",
    location: "Izmir, Turkey",
    description: `I am a Landscape Architect and Creative Art Director working at the intersection of landscape design, architectural visualization, creative direction, and AI-assisted design tools.

My work focuses on transforming spatial ideas, project requirements, visual references, and design decisions into structured design workflows. With a background in landscape architecture, I approach every project through spatial thinking, planning logic, environmental design, planting strategies, and visual communication.

At Kraftreich, I develop AI-assisted tools and workflows for creative analysis, design planning, concept development, visual storytelling, and design automation. These tools support the early stages of landscape, architectural, and creative projects by helping organize project briefs, structure design decisions, generate visual direction, and turn complex ideas into usable systems.

My recent projects include Schwarzgewalt, a design automation platform for generating token-based Figma systems, and CineLab, an AI cinematography and image-direction tool for translating references, moods, and creative settings into structured visual recipes.

Before founding Kraftreich, I worked across landscape design, planting design, architectural visualization, 3D modeling, project videos, creative direction, brand strategy, motion, and multimedia production. This background still shapes how I think: technology should not only function, but also carry spatial clarity, visual intention, and design taste.

I am currently focused on connecting landscape architecture, creative direction, and LLM-assisted tools to create more structured, intelligent, and visually coherent workflows for contemporary design practice.`,
    experience: [{ yearLabel: "2026", company: "Kraftreich", title: "Founder" }],
    coverAspect: "portrait",
    skills: "Landscape Architecture · Creative Direction · AI Tools",
  };
}

function loadAboutMeContent(): AboutMeContent {
  const filePath = join(ABOUT_ME_ROOT, "about-me.md");
  if (!existsSync(filePath)) {
    return fallbackAboutMeContent();
  }

  const raw = readFileSync(filePath, "utf8");
  const parsed = parseYaml(extractYamlBlock(raw));
  const validated = aboutMeContentSchema.safeParse(parsed);

  if (!validated.success) {
    throw new Error(
      `Invalid About Me YAML in public/assets/gallery/about-me/about-me.md: ${validated.error.message}`,
    );
  }

  return validated.data;
}

function toAboutMeGridItem(content: AboutMeContent): GridItem {
  const fallbackRatio = COVER_ASPECT_RATIO_FALLBACK[content.coverAspect];
  const slides =
    content.slides && content.slides.length > 0
      ? content.slides
      : discoverAboutMeSlides(content.coverImage);
  const ratioSource = slides[0] ?? content.coverImage;
  const coverAspectRatio = ratioSource
    ? readImageAspectRatio(ratioSource, fallbackRatio)
    : fallbackRatio;

  return {
    slug: content.slug,
    title: content.title,
    description: content.description,
    coverAspect: content.coverAspect,
    coverAspectRatio,
    coverImage: content.coverImage,
    coverSlides: slides,
    experience: content.experience,
  };
}

function extractYamlBlock(markdown: string): string {
  const match = markdown.match(/```yaml\r?\n([\s\S]*?)```/);
  if (!match?.[1]) {
    throw new Error("Missing ```yaml block in gallery markdown");
  }
  return match[1];
}

function mediaAspectFallback(item: GalleryMediaItem): string {
  if (item.aspectClass === "aspect-video") return "16/9";
  if (item.aspectClass === "aspect-[16/10]") return "16/10";
  if (item.aspectClass in COVER_ASPECT_RATIO_FALLBACK) {
    return COVER_ASPECT_RATIO_FALLBACK[item.aspectClass as CoverAspect];
  }
  return "3/2";
}

function enrichMediaItem(item: GalleryMediaItem): GalleryMediaItem {
  if (item.aspectRatio) return item;

  const fallback = mediaAspectFallback(item);
  const aspectRatio =
    item.type === "image"
      ? readImageAspectRatio(item.src, fallback)
      : (inferVideoAspectRatio(item.src) ?? fallback);

  return { ...item, aspectRatio };
}

function enrichGalleryDetail(detail: GalleryItemDetail): GalleryItemDetail {
  return {
    ...detail,
    galleryMedia: detail.galleryMedia.map(enrichMediaItem),
  };
}

function loadGalleryDetail(slug: string): GalleryItemDetail {
  const filePath = join(GALLERY_ROOT, slug, `${slug}.md`);
  if (!existsSync(filePath)) {
    throw new Error(`Missing gallery content file: public/assets/gallery/${slug}/${slug}.md`);
  }

  const raw = readFileSync(filePath, "utf8");
  const parsed = parseYaml(extractYamlBlock(raw));
  const validated = galleryItemDetailSchema.safeParse(parsed);

  if (!validated.success) {
    throw new Error(
      `Invalid gallery YAML in public/assets/gallery/${slug}/${slug}.md: ${validated.error.message}`,
    );
  }

  if (validated.data.slug !== slug) {
    throw new Error(
      `Slug mismatch in public/assets/gallery/${slug}/${slug}.md: expected "${slug}", got "${validated.data.slug}"`,
    );
  }

  return enrichGalleryDetail(validated.data);
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function ratioString(width: number, height: number): string {
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

function publicSrcToPath(src: string): string {
  return join(GALLERY_ROOT, src.replace(/^\/assets\/gallery\//, ""));
}

function readImageDimensions(buffer: Buffer): { width: number; height: number } | undefined {
  if (buffer.length >= 10 && buffer.toString("ascii", 0, 3) === "GIF") {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }

  if (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1] ?? 0;
      const length = buffer.readUInt16BE(offset + 2);
      if (length < 2 || offset + 2 + length > buffer.length) break;
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + length;
    }
  }

  return undefined;
}

function readImageAspectRatio(src: string, fallback: string): string {
  try {
    const filePath = publicSrcToPath(src);
    if (!existsSync(filePath)) return fallback;
    const buffer = readFileSync(filePath);
    const dimensions = readImageDimensions(buffer);
    if (!dimensions) return fallback;
    return ratioString(dimensions.width, dimensions.height);
  } catch {
    return fallback;
  }
}

function inferVideoAspectRatio(src: string): string | undefined {
  const lower = src.toLowerCase();
  if (/9x16|9-16|dikey|vertical|story|-reels\.|-reels\./.test(lower)) return "9/16";
  if (/3x5|3-5/.test(lower)) return "3/5";
  if (/16x9|16-9|yatay|widescreen|hero\.mp4/.test(lower)) return "16/9";
  return undefined;
}

function resolveCoverVideo(slug: string): string | undefined {
  const dir = join(GALLERY_ROOT, slug);
  if (!existsSync(dir)) return undefined;

  for (const filename of ["cover.mp4", "hero.mp4"]) {
    if (existsSync(join(dir, filename))) {
      return `/assets/gallery/${slug}/${filename}`;
    }
  }

  const mp4Files = readdirSync(dir)
    .filter((entry) => entry.endsWith(".mp4"))
    .sort();

  return mp4Files[0] ? `/assets/gallery/${slug}/${mp4Files[0]}` : undefined;
}

function toGridItem(detail: GalleryItemDetail): GridItem {
  const fallbackRatio = COVER_ASPECT_RATIO_FALLBACK[detail.coverAspect];
  const coverImageRatio = readImageAspectRatio(detail.coverImage, fallbackRatio);
  const coverAspectRatio = detail.coverGif
    ? readImageAspectRatio(detail.coverGif, coverImageRatio)
    : coverImageRatio;
  const coverVideo =
    detail.coverVideo ?? (detail.coverImage ? undefined : resolveCoverVideo(detail.slug));
  const coverVideoAspectRatio = coverVideo
    ? (detail.coverVideoAspect ?? inferVideoAspectRatio(coverVideo) ?? coverAspectRatio)
    : undefined;

  return {
    slug: detail.slug,
    title: detail.title,
    description: detail.description,
    coverAspect: detail.coverAspect,
    coverAspectRatio,
    coverImage: detail.coverImage,
    coverGif: detail.coverGif,
    coverVideo,
    coverVideoPoster: detail.coverVideoPoster,
    coverVideoAspectRatio,
  };
}

function parseIndexYear(year: string): number {
  const match = year.match(/\d{4}/);
  return match ? Number.parseInt(match[0], 10) : 0;
}

function buildIndex(
  detailsBySlug: Readonly<Record<string, GalleryItemDetail>>,
): GalleryIndexItem[] {
  const items = Array.from({ length: GALLERY_INDEX_COUNT }, (_, index) => {
    const slug = `gallery-${String(index + 1).padStart(2, "0")}`;
    const detail = detailsBySlug[slug];

    return {
      slug,
      year: detail?.yearLabel ?? "\u2014",
      label: GALLERY_INDEX_LABELS[slug] ?? detail?.title ?? slug,
      tags: GALLERY_INDEX_TAGS[slug] ?? "\u2014",
    };
  });

  return items.sort((a, b) => parseIndexYear(b.year) - parseIndexYear(a.year));
}

function discoverGallerySlugs(): string[] {
  if (!existsSync(GALLERY_ROOT)) return [];

  return readdirSync(GALLERY_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^gallery-\d{2}$/.test(entry.name))
    .map((entry) => entry.name)
    .filter((slug) => existsSync(join(GALLERY_ROOT, slug, `${slug}.md`)))
    .sort();
}

export function loadGalleryCatalog(): GalleryCatalog {
  const detailsBySlug = new Map<string, GalleryItemDetail>();

  for (const slug of discoverGallerySlugs()) {
    detailsBySlug.set(slug, loadGalleryDetail(slug));
  }

  const WORK_SLUGS = [
    "gallery-12",
    "gallery-01",
    "gallery-02",
    "gallery-03",
    "gallery-04",
    "gallery-05",
  ] as const;

  const ART_SLUGS = [
    "gallery-08",
    "gallery-06",
    "gallery-07",
    "gallery-11",
    "gallery-09",
    "gallery-10",
  ] as const;

  function gridItemForSlug(slug: string): GridItem | null {
    const detail = detailsBySlug.get(slug);
    return detail ? toGridItem(detail) : null;
  }

  // Soft-empty: gallery media is gitignored; CI/Pages builds with zero folders must succeed.
  const workItems = WORK_SLUGS.map((slug) => gridItemForSlug(slug)).filter(
    (item): item is GridItem => item !== null,
  );

  const artItems = ART_SLUGS.map((slug) => gridItemForSlug(slug)).filter(
    (item): item is GridItem => item !== null,
  );

  const aboutMeContent = loadAboutMeContent();
  const aboutMeItem = toAboutMeGridItem(aboutMeContent);

  const columns: GridColumn[] = [
    { id: "about-me", title: "About Me", items: [aboutMeItem] },
    { id: "work", title: "Work", items: workItems },
    { id: "art", title: "Art", items: artItems },
  ];

  const detailsRecord = Object.fromEntries(detailsBySlug) as Record<string, GalleryItemDetail>;

  return {
    columns,
    detailsBySlug: detailsRecord,
    index: buildIndex(detailsRecord),
    skills: aboutMeContent.skills,
    aboutMe: aboutMeContent,
  };
}

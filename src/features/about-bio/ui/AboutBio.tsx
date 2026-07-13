/**
 * ---metadata---
 * @file src/features/about-bio/ui/AboutBio.tsx
 * @description About / bio composition. Body sourced from the home About Me copy.
 * @last-updated 2026-07-13
 * ---end-metadata---
 */

import Heading from "@/shared/ui/Heading";
import Text from "@/shared/ui/Text";

const PARAGRAPHS = [
  "I am a Landscape Architect and Creative Art Director working at the intersection of landscape design, architectural visualization, creative direction, and AI-assisted design tools.",
  "My work focuses on transforming spatial ideas, project requirements, visual references, and design decisions into structured design workflows. With a background in landscape architecture, I approach every project through spatial thinking, planning logic, environmental design, planting strategies, and visual communication.",
  "At Kraftreich, I develop AI-assisted tools and workflows for creative analysis, design planning, concept development, visual storytelling, and design automation. These tools support the early stages of landscape, architectural, and creative projects by helping organize project briefs, structure design decisions, generate visual direction, and turn complex ideas into usable systems.",
  "My recent projects include Schwarzgewalt, a design automation platform for generating token-based Figma systems, and CineLab, an AI cinematography and image-direction tool for translating references, moods, and creative settings into structured visual recipes.",
  "Before founding Kraftreich, I worked across landscape design, planting design, architectural visualization, 3D modeling, project videos, creative direction, brand strategy, motion, and multimedia production. This background still shapes how I think: technology should not only function, but also carry spatial clarity, visual intention, and design taste.",
  "I am currently focused on connecting landscape architecture, creative direction, and LLM-assisted tools to create more structured, intelligent, and visually coherent workflows for contemporary design practice.",
] as const;

export default function AboutBio() {
  return (
    <article>
      <Heading as="h1" size="h2">
        About
      </Heading>
      <div className="mt-[var(--space-32)] space-y-[var(--space-16)]">
        {PARAGRAPHS.map((paragraph) => (
          <Text key={paragraph.slice(0, 32)} tone="default">
            {paragraph}
          </Text>
        ))}
      </div>
    </article>
  );
}

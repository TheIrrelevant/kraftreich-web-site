/**
 * ---metadata---
 * @file src/features/work-grid/ui/AboutMeCoverMedia.tsx
 * @description About Me grid cover — click to cycle slide images without arrow controls.
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

"use client";

import { useCallback, useState, type CSSProperties } from "react";

type Props = {
  slides: ReadonlyArray<string>;
  coverAspectRatio: string;
  coverImage?: string;
};

const frameClass =
  "relative z-0 w-full overflow-hidden rounded-sm bg-[var(--foreground)]/40 ring-1 ring-inset ring-[var(--border)]/40";

export default function AboutMeCoverMedia({ slides, coverAspectRatio, coverImage }: Props) {
  const images = slides.length > 0 ? slides : coverImage ? [coverImage] : [];
  const [index, setIndex] = useState(0);
  const frameStyle = { aspectRatio: coverAspectRatio } as CSSProperties;
  const src = images[index];

  const advance = useCallback(() => {
    if (images.length <= 1) return;
    setIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }, [images.length]);

  if (!src) {
    return <div className={frameClass} style={frameStyle} aria-hidden />;
  }

  if (images.length <= 1) {
    return (
      <div className={frameClass} style={frameStyle}>
        <img
          className="h-full w-full object-cover"
          src={src}
          alt=""
          loading="eager"
          fetchPriority="high"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`${frameClass} block w-full cursor-pointer`}
      style={frameStyle}
      onClick={advance}
      aria-label={`About Me image ${index + 1} of ${images.length}. Click for next.`}
    >
      <img
        className="h-full w-full object-cover"
        src={src}
        alt=""
        loading="eager"
        fetchPriority="high"
      />
    </button>
  );
}

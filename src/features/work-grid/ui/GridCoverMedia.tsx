/**
 * ---metadata---
 * @file src/features/work-grid/ui/GridCoverMedia.tsx
 * @description Grid card cover media — muted video when available, poster image otherwise.
 *              Frame aspect ratio follows cover video dimensions when a video is set.
 * @last-updated 2026-05-28
 * @last-change video-only grid covers; no poster flash before playback
 * ---end-metadata---
 */

"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  coverAspectRatio: string;
  coverVideoAspectRatio?: string;
  coverImage?: string;
  coverGif?: string;
  coverVideo?: string;
  isColumnActive: boolean;
  isSelected: boolean;
};

const frameClass = (isSelected: boolean) =>
  `relative z-0 w-full overflow-hidden rounded-sm bg-[var(--foreground)]/40 ring-1 ring-inset ring-[var(--border)]/40 transition-[opacity,transform] duration-[var(--motion-slow)] group-hover/cell:opacity-100 ${isSelected ? "opacity-100" : ""}`;

export default function GridCoverMedia({
  coverAspectRatio,
  coverVideoAspectRatio,
  coverImage,
  coverGif,
  coverVideo,
  isColumnActive,
  isSelected,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeRatio = coverVideo ? (coverVideoAspectRatio ?? coverAspectRatio) : coverAspectRatio;
  const frameStyle = { aspectRatio: activeRatio } as CSSProperties;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !coverVideo) return;

    const syncPlayback = () => {
      if (isColumnActive) {
        void video.play().catch(() => undefined);
        return;
      }
      video.pause();
      video.currentTime = 0;
    };

    syncPlayback();
    video.addEventListener("loadeddata", syncPlayback);
    return () => video.removeEventListener("loadeddata", syncPlayback);
  }, [isColumnActive, coverVideo]);

  if (coverGif) {
    return (
      <div className={frameClass(isSelected)} style={frameStyle}>
        <img
          className="h-full w-full object-cover"
          src={coverGif}
          alt=""
          loading="eager"
          fetchPriority="high"
        />
      </div>
    );
  }

  if (coverVideo) {
    return (
      <div className={frameClass(isSelected)} style={frameStyle}>
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          src={coverVideo}
          muted
          playsInline
          loop
          preload="auto"
          autoPlay={isColumnActive}
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  return (
    <div className={frameClass(isSelected)} style={frameStyle}>
      {coverImage ? (
        <img
          className="h-full w-full object-cover"
          src={coverImage}
          alt=""
          loading="eager"
          fetchPriority="high"
        />
      ) : null}
    </div>
  );
}

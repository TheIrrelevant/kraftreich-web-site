/**
 * ---metadata---
 * @file src/features/vinyl-particles/ui/VinylMuteToggle.tsx
 * @description Headset-icon mute toggle for the vinyl hero audio. Composed into IdentityStrip
 *              below the name via muteSlot — reads shared useAudioMute context.
 * @last-updated 2026-05-26
 * ---end-metadata---
 */

"use client";

import { useAudioMute } from "@/shared/lib/audio-mute/audio-mute-context";

export default function VinylMuteToggle() {
  const { muted, toggleMute } = useAudioMute();

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute hero audio" : "Mute hero audio"}
      aria-pressed={!muted}
      data-vinyl-mute-toggle
      className="inline-flex h-[var(--space-32)] w-[var(--space-32)] items-center justify-start rounded-sm p-0 text-[var(--secondary)] outline-none transition-opacity hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[var(--secondary)]"
    >
      <HeadsetIcon muted={muted} />
    </button>
  );
}

function HeadsetIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1" />
      <rect x="17" y="14" width="4" height="6" rx="1" />
      {muted ? <line x1="4" y1="4" x2="20" y2="20" /> : null}
    </svg>
  );
}

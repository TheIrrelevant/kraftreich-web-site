/**
 * ---metadata---
 * @file src/features/vinyl-particles/constants/vinyl-particles.ts
 * @description Particle budget, vinyl geometry, spin rate (RPM / BPM), and hero audio source.
 * @last-updated 2026-07-13
 * ---end-metadata---
 */

import { withBasePath } from "@/shared/lib/base-path";

export const VINYL_PARTICLE_COUNT = 18_000;

/** Normalized radius of the center label (0–1 of disc). */
export const VINYL_LABEL_RADIUS = 0.22;

/** Normalized radius of the spindle hole — no particles inside. */
export const VINYL_HOLE_RADIUS = 0.035;

/** Number of concentric groove rings between label and outer rim. */
export const VINYL_GROOVE_COUNT = 42;

/** Inscribed disc diameter as a fraction of the smaller canvas dimension. */
export const VINYL_DISC_INSET = 0.47;

/** Standard LP turntable speed (33⅓ RPM). */
export const VINYL_BASE_RPM = 33 + 1 / 3;

/** Hero track — ROSALÍA Berghain (125 BPM). */
export const VINYL_TRACK_BPM = 125;

/** Reference BPM where scaled spin equals `VINYL_BASE_RPM`. */
export const VINYL_BPM_REFERENCE = 120;

/** Public path to the IdentityStrip hero audio file. */
export const VINYL_AUDIO_SRC = withBasePath("/assets/audio/bergain.mp3");

/** Output gain when unmuted (0–1). */
export const VINYL_AUDIO_GAIN = 0.3;

/** Angular velocity (rad/s) for the disc rotation at the configured BPM. */
export function resolveVinylRadiansPerSecond(bpm: number = VINYL_TRACK_BPM): number {
  const rpm = (bpm / VINYL_BPM_REFERENCE) * VINYL_BASE_RPM;
  return (rpm * 2 * Math.PI) / 60;
}

/** Intro — particles assemble into disc (ms). */
export const VINYL_LOADING_ASSEMBLE_MS = 2_000;

/** Intro — black overlay fade before migration (ms). */
export const VINYL_LOADING_REVEAL_MS = 650;

/** Intro — disc travels from assembly anchor to mount (ms). */
export const VINYL_LOADING_MIGRATE_MS = 1_200;

/**
 * ---metadata---
 * @file src/features/vinyl-particles/lib/build-vinyl-particles.ts
 * @description Normalized polar layout for vinyl disc particles (label, grooves, rim).
 * @last-updated 2026-05-28
 * ---end-metadata---
 */

import {
  VINYL_GROOVE_COUNT,
  VINYL_HOLE_RADIUS,
  VINYL_LABEL_RADIUS,
} from "@/features/vinyl-particles/constants/vinyl-particles";

export type VinylParticleData = {
  homes: Float32Array;
  randoms: Float32Array;
  ringKinds: Float32Array;
};

const hash = (n: number) => {
  const s = Math.sin(n) * 43758.5453;
  return s - Math.floor(s);
};

export function buildVinylParticles(count: number): VinylParticleData {
  const homes = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  const ringKinds = new Float32Array(count);

  let placed = 0;
  let guard = 0;

  while (placed < count && guard < count * 12) {
    guard += 1;
    const i = placed;
    const h1 = hash(i * 12.9898 + guard * 0.17);
    const h2 = hash(i * 78.233 + guard * 0.31);
    const h3 = hash(i * 39.346 + guard * 0.53);
    const h4 = hash(i * 11.17 + guard * 0.71);

    let radiusNorm: number;
    let kind: number;

    if (h1 < 0.18) {
      kind = 0;
      radiusNorm = VINYL_HOLE_RADIUS + h2 * (VINYL_LABEL_RADIUS - VINYL_HOLE_RADIUS);
    } else if (h1 < 0.88) {
      kind = 1;
      const grooveIndex = Math.floor(h2 * VINYL_GROOVE_COUNT);
      const grooveStart = VINYL_LABEL_RADIUS;
      const grooveEnd = 0.93;
      const step = (grooveEnd - grooveStart) / VINYL_GROOVE_COUNT;
      radiusNorm = grooveStart + grooveIndex * step + (h3 - 0.5) * step * 0.55;
    } else {
      kind = 2;
      radiusNorm = 0.93 + h2 * 0.07;
    }

    if (radiusNorm < VINYL_HOLE_RADIUS) continue;

    const theta = h4 * Math.PI * 2;
    homes[i * 3 + 0] = Math.cos(theta) * radiusNorm;
    homes[i * 3 + 1] = Math.sin(theta) * radiusNorm;
    homes[i * 3 + 2] = 0;
    randoms[i] = h3;
    ringKinds[i] = kind;
    placed += 1;
  }

  return { homes, randoms, ringKinds };
}

export type ScatterCloudData = {
  positions: Float32Array;
  driftPhases: Float32Array;
  swirlStrength: Float32Array;
};

export function buildScatterCloud(count: number, width: number, height: number): ScatterCloudData {
  const positions = new Float32Array(count * 3);
  const driftPhases = new Float32Array(count);
  const swirlStrength = new Float32Array(count);

  const maxReach = Math.hypot(width, height) * 0.74;
  const coreRadius = Math.min(width, height) * 0.44;

  for (let i = 0; i < count; i++) {
    const h1 = hash(i * 17.31 + 1);
    const h2 = hash(i * 43.17 + 2);
    const h3 = hash(i * 91.03 + 3);
    const h4 = hash(i * 29.84 + 4);
    const h5 = hash(i * 63.55 + 5);
    const h6 = hash(i * 12.77 + 6);

    let x: number;
    let y: number;
    let z: number;

    if (h1 < 0.68) {
      // Dense volumetric core — nebula center.
      const radius = Math.cbrt(h2) * coreRadius;
      const theta = h3 * Math.PI * 2;
      const phi = Math.acos(2 * h4 - 1);
      x = radius * Math.sin(phi) * Math.cos(theta);
      y = radius * Math.sin(phi) * Math.sin(theta);
      z = radius * Math.cos(phi) * 0.9;
    } else if (h1 < 0.9) {
      // Soft mid halo.
      const theta = h2 * Math.PI * 2 + (h5 - 0.5) * 0.8;
      const radius = coreRadius * (0.75 + Math.pow(h3, 0.55) * 0.85);
      x = Math.cos(theta) * radius;
      y = Math.sin(theta) * radius;
      z = (h4 - 0.5) * coreRadius * 0.75;
    } else {
      // Outer starfield specks — sparse, full-screen reach.
      const theta = h2 * Math.PI * 2;
      const radius = coreRadius * 0.55 + Math.sqrt(h3) * maxReach;
      x = Math.cos(theta) * radius + (h4 - 0.5) * width * 0.14;
      y = Math.sin(theta) * radius + (h5 - 0.5) * height * 0.14;
      z = (h6 - 0.5) * maxReach * 0.42;
    }

    const swirl = (h5 - 0.5) * 0.42;
    const cs = Math.cos(swirl);
    const sn = Math.sin(swirl);

    positions[i * 3 + 0] = x * cs - y * sn;
    positions[i * 3 + 1] = x * sn + y * cs;
    positions[i * 3 + 2] = z;
    driftPhases[i] = h6 * Math.PI * 2;
    swirlStrength[i] = 0.2 + h1 * 0.8;
  }

  return { positions, driftPhases, swirlStrength };
}

/** @deprecated Use buildScatterCloud */
export function buildScatterPositions(count: number, width: number, height: number): Float32Array {
  return buildScatterCloud(count, width, height).positions;
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * ---metadata---
 * @file src/shared/three/useAsset.ts
 * @description Typed wrappers around Drei loaders. Centralises asset URL conventions
 *              (everything under /public/models/ and /public/textures/) and exposes a
 *              `preload` API for above-the-fold scenes.
 *              Scenes call these — never useGLTF / useTexture directly — so swapping
 *              loaders later (Draco, KTX2) happens in one place.
 * @last-updated 2026-05-23
 * ---end-metadata---
 */

"use client";

import { useGLTF, useTexture } from "@react-three/drei";

const modelUrl = (name: string) => `/models/${name}`;
const textureUrl = (name: string) => `/textures/${name}`;

export function useModel(name: string) {
  return useGLTF(modelUrl(name));
}

export function useImage(name: string) {
  return useTexture(textureUrl(name));
}

useModel.preload = (name: string) => useGLTF.preload(modelUrl(name));
useImage.preload = (name: string) => useTexture.preload(textureUrl(name));

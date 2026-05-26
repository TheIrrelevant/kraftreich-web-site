/**
 * ---metadata---
 * @file src/features/vinyl-particles/context/vinyl-audio-level-context.tsx
 * @description Exposes the live analyser level ref from VinylAudioEngine to VinylParticles.
 * @last-updated 2026-05-26
 * ---end-metadata---
 */

"use client";

import { createContext, useContext, type ReactNode, type RefObject } from "react";

const VinylAudioLevelContext = createContext<RefObject<number> | null>(null);

export function VinylAudioLevelProvider({
  audioLevelRef,
  children,
}: {
  audioLevelRef: RefObject<number>;
  children: ReactNode;
}) {
  return (
    <VinylAudioLevelContext.Provider value={audioLevelRef}>
      {children}
    </VinylAudioLevelContext.Provider>
  );
}

export function useVinylAudioLevelRef(): RefObject<number> {
  const value = useContext(VinylAudioLevelContext);
  if (!value) {
    throw new Error("useVinylAudioLevelRef must be used inside <VinylAudioLevelProvider>.");
  }
  return value;
}

/**
 * ---metadata---
 * @file src/shared/lib/audio-mute/audio-mute-context.tsx
 * @description Shared mute state for hero audio. VinylAudioEngine owns the graph and registers
 *              the output GainNode; VinylMuteToggle reads muted/toggle from the IdentityStrip slot.
 * @last-updated 2026-07-13
 * @last-change default unmuted for autoplay intent; expose markAutoplayBlocked when policy blocks
 * ---end-metadata---
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const ACTIVATION_TOGGLE_GUARD_MS = 250;
const ACTIVE_GAIN = 0.3;
const SILENT_GAIN = 0;

type AudioMuteContextValue = {
  muted: boolean;
  hasActivated: boolean;
  toggleMute: () => void;
  registerActivation: () => void;
  markAutoplayBlocked: () => void;
  registerOutputGain: (gain: GainNode | null) => void;
};

const AudioMuteContext = createContext<AudioMuteContextValue | null>(null);

export function AudioMuteProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const activatedAtRef = useRef<number | null>(null);
  const outputGainRef = useRef<GainNode | null>(null);
  const mutedRef = useRef(muted);
  const hasActivatedRef = useRef(hasActivated);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    hasActivatedRef.current = hasActivated;
  }, [hasActivated]);

  const applyGain = useCallback((nextMuted: boolean) => {
    const gain = outputGainRef.current;
    if (!gain) return;
    gain.gain.value = nextMuted ? SILENT_GAIN : ACTIVE_GAIN;
  }, []);

  const registerOutputGain = useCallback((gain: GainNode | null) => {
    outputGainRef.current = gain;
    if (gain) {
      gain.gain.value = mutedRef.current ? SILENT_GAIN : ACTIVE_GAIN;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (
      activatedAtRef.current !== null &&
      performance.now() - activatedAtRef.current < ACTIVATION_TOGGLE_GUARD_MS
    ) {
      activatedAtRef.current = null;
      return;
    }
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      applyGain(next);
      return next;
    });
  }, [applyGain]);

  const registerActivation = useCallback(() => {
    if (hasActivatedRef.current) return;
    activatedAtRef.current = performance.now();
    hasActivatedRef.current = true;
    setHasActivated(true);
    mutedRef.current = false;
    setMuted(false);
    applyGain(false);
  }, [applyGain]);

  const markAutoplayBlocked = useCallback(() => {
    if (hasActivatedRef.current) return;
    mutedRef.current = true;
    setMuted(true);
    applyGain(true);
  }, [applyGain]);

  const value = useMemo<AudioMuteContextValue>(
    () => ({
      muted,
      hasActivated,
      toggleMute,
      registerActivation,
      markAutoplayBlocked,
      registerOutputGain,
    }),
    [muted, hasActivated, toggleMute, registerActivation, markAutoplayBlocked, registerOutputGain],
  );

  return <AudioMuteContext.Provider value={value}>{children}</AudioMuteContext.Provider>;
}

export function useAudioMute(): AudioMuteContextValue {
  const value = useContext(AudioMuteContext);
  if (!value) {
    throw new Error("useAudioMute must be used inside <AudioMuteProvider>.");
  }
  return value;
}

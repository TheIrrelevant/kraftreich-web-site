/**
 * ---metadata---
 * @file src/shared/lib/audio-mute/audio-mute-context.tsx
 * @description Tiny shared context for the hero audio mute state. AudioParticleCloud owns the
 *              audio graph and writes activation; AudioMuteToggle reads muted/toggle and renders
 *              wherever consumers compose it (the IdentityStrip slot in this app). Lives in
 *              shared/ because two features in different vertical slices need the same state and
 *              cross-feature imports are forbidden. The gain node itself is held by ref inside
 *              the provider so toggleMute can mutate it synchronously alongside the React state
 *              update — a reactive `useEffect[muted]` mirror introduced a perceptible race on
 *              re-mute and was dropped.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
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
  registerOutputGain: (gain: GainNode | null) => void;
};

const AudioMuteContext = createContext<AudioMuteContextValue | null>(null);

export function AudioMuteProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);
  const [hasActivated, setHasActivated] = useState(false);
  // Timestamp of the most recent activation. When the user clicks the headset itself, the same
  // gesture fires window pointerdown (activates) AND the button onClick (toggles). The guard
  // below swallows a toggle landing within ACTIVATION_TOGGLE_GUARD_MS so the very first headset
  // click reliably starts audio instead of starting then immediately silencing it.
  const activatedAtRef = useRef<number | null>(null);
  // GainNode lives in the particle cloud; the cloud calls registerOutputGain once the audio
  // graph is built, then toggleMute mutates the same node directly. Keeps audio commands
  // synchronous with React state updates.
  const outputGainRef = useRef<GainNode | null>(null);

  const applyGain = useCallback((nextMuted: boolean) => {
    const gain = outputGainRef.current;
    if (!gain) return;
    gain.gain.value = nextMuted ? SILENT_GAIN : ACTIVE_GAIN;
  }, []);

  const registerOutputGain = useCallback(
    (gain: GainNode | null) => {
      outputGainRef.current = gain;
      // Bring the freshly-registered node in line with the current React state so muting
      // before the graph exists is still honoured once it does.
      if (gain) applyGain(muted);
    },
    [applyGain, muted],
  );

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
      applyGain(next);
      return next;
    });
  }, [applyGain]);

  const registerActivation = useCallback(() => {
    activatedAtRef.current = performance.now();
    setHasActivated(true);
    setMuted(false);
    applyGain(false);
  }, [applyGain]);

  const value = useMemo<AudioMuteContextValue>(
    () => ({ muted, hasActivated, toggleMute, registerActivation, registerOutputGain }),
    [muted, hasActivated, toggleMute, registerActivation, registerOutputGain],
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

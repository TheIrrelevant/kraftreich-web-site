/**
 * ---metadata---
 * @file src/features/audio-particle-cloud/model/use-audio-analyser.ts
 * @description Builds an AudioContext + AnalyserNode + GainNode on top of an existing media
 *              element (audio or video). The element must be created by the caller — we only
 *              route it. Browser autoplay policy blocks ctx.resume() until first gesture, so we
 *              bind pointer/key listeners to retry. Exposes the live frequency frame, mute state,
 *              and a toggle.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

"use client";

import { useEffect, useRef, useState } from "react";

const FFT_SIZE = 1024;

export function useAudioAnalyserFromElement(element: HTMLMediaElement | null) {
  const dataRef = useRef<Uint8Array>(new Uint8Array(FFT_SIZE / 2));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  // react-hooks/immutability flags mutation of `element` below. The hook contract is exactly
  // that — we wire the supplied media element into a Web Audio graph, which entails calling
  // play() and flipping .muted on first user gesture. Mutation is intentional, not accidental.
  /* eslint-disable react-hooks/immutability */
  useEffect(() => {
    if (!element) return;
    let ctx: AudioContext | null = null;
    let cleanedUp = false;

    const ensureGraph = () => {
      if (ctx) return;
      ctx = new AudioContext();
      const source = ctx.createMediaElementSource(element);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.82;
      const gain = ctx.createGain();
      gain.gain.value = 0.3;
      source.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);
      analyserRef.current = analyser;
      gainRef.current = gain;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
    };

    const tryStart = async () => {
      if (cleanedUp) return;
      ensureGraph();
      try {
        if (ctx && ctx.state === "suspended") await ctx.resume();
        // element starts muted to satisfy autoplay; flip it once the context is resumable so
        // MediaElementSource actually carries an audio signal (Chrome silences a muted element).
        if (element.muted) element.muted = false;
        await element.play();
        if (!cleanedUp) setStarted(true);
      } catch {
        // browser blocked autoplay — retried on user gesture
      }
    };

    const onInteract = () => {
      void tryStart();
    };
    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("keydown", onInteract);
    void tryStart();

    return () => {
      cleanedUp = true;
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      void ctx?.close();
      analyserRef.current = null;
      gainRef.current = null;
    };
  }, [element]);
  /* eslint-enable react-hooks/immutability */

  const getFrequencyData = (): Uint8Array | null => {
    const a = analyserRef.current;
    if (!a) return null;
    a.getByteFrequencyData(dataRef.current as unknown as Uint8Array<ArrayBuffer>);
    return dataRef.current;
  };

  const toggleMute = () => {
    const g = gainRef.current;
    if (!g) return;
    const next = !muted;
    g.gain.value = next ? 0 : 0.3;
    setMuted(next);
  };

  return { getFrequencyData, started, muted, toggleMute };
}

/**
 * ---metadata---
 * @file src/features/vinyl-particles/ui/VinylAudioEngine.tsx
 * @description Invisible audio graph for Bergain.mp3 — muted warm-start during vinyl intro;
 *              audible unlock only after intro complete (gesture or mute-toggle unmute).
 *              Analyser level feeds vinyl spin modulation.
 * @last-updated 2026-07-17
 * @last-change defer audible unlock until vinyl intro isComplete
 * ---end-metadata---
 */

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { VINYL_AUDIO_SRC } from "@/features/vinyl-particles/constants/vinyl-particles";
import { VinylAudioLevelProvider } from "@/features/vinyl-particles/context/vinyl-audio-level-context";
import { useVinylLoading } from "@/features/vinyl-particles/context/vinyl-loading-context";
import { useAudioMute } from "@/shared/lib/audio-mute/audio-mute-context";

type AudioGraph = {
  analyser: AnalyserNode;
  context: AudioContext;
  outputGain: GainNode;
  frequencyData: Uint8Array<ArrayBuffer>;
};

export default function VinylAudioEngine({ children }: { children: ReactNode }) {
  const audioLevelRef = useRef(0);
  const graphRef = useRef<AudioGraph | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { muted, registerActivation, markAutoplayBlocked, registerOutputGain } = useAudioMute();
  const { isComplete } = useVinylLoading();
  const isCompleteRef = useRef(isComplete);
  const registerActivationRef = useRef(registerActivation);
  const markAutoplayBlockedRef = useRef(markAutoplayBlocked);
  const registerOutputGainRef = useRef(registerOutputGain);

  useEffect(() => {
    isCompleteRef.current = isComplete;
  }, [isComplete]);

  useEffect(() => {
    registerActivationRef.current = registerActivation;
    markAutoplayBlockedRef.current = markAutoplayBlocked;
    registerOutputGainRef.current = registerOutputGain;
  }, [registerActivation, markAutoplayBlocked, registerOutputGain]);

  useEffect(() => {
    const audio = document.createElement("audio");
    audio.src = VINYL_AUDIO_SRC;
    audio.loop = true;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.autoplay = true;
    audioRef.current = audio;

    const ensureGraph = () => {
      if (graphRef.current) return graphRef.current;

      const audioWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
      const AudioContextCtor = window.AudioContext ?? audioWindow.webkitAudioContext;
      if (!AudioContextCtor) return null;

      const context = new AudioContextCtor();
      const source = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      const outputGain = context.createGain();

      source.connect(analyser);
      analyser.connect(outputGain);
      outputGain.connect(context.destination);

      const graph: AudioGraph = {
        analyser,
        context,
        outputGain,
        frequencyData: new Uint8Array(analyser.frequencyBinCount),
      };
      graphRef.current = graph;
      registerOutputGainRef.current(graph.outputGain);
      return graph;
    };

    const waitUntilCanPlay = () =>
      new Promise<void>((resolve) => {
        if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          resolve();
          return;
        }
        const finish = () => resolve();
        audio.addEventListener("canplay", finish, { once: true });
        audio.addEventListener("canplaythrough", finish, { once: true });
        audio.addEventListener("error", finish, { once: true });
      });

    const unlockAudible = async () => {
      const graph = ensureGraph();
      if (!graph) return false;

      await graph.context.resume().catch(() => undefined);
      audio.muted = false;

      try {
        await audio.play();
        registerActivationRef.current();
        return true;
      } catch {
        return false;
      }
    };

    const tryWarmStartMuted = async () => {
      await waitUntilCanPlay();
      markAutoplayBlockedRef.current();

      // Keep a muted stream warm so the first post-intro gesture can unmute instantly.
      audio.muted = true;
      const graph = ensureGraph();
      if (graph) {
        await graph.context.resume().catch(() => undefined);
      }
      try {
        await audio.play();
      } catch {
        // Gesture handler / unmute path will retry after intro.
      }
    };

    void tryWarmStartMuted();

    const onGesture = (event: Event) => {
      // Intro owns the loading screen — no audible unlock until vinyl assemble + migrate finish.
      if (!isCompleteRef.current) return;

      const target = event.target;
      // Mute toggle owns unmute via the `muted` effect below; avoid double-toggle race.
      if (target instanceof Element && target.closest("[data-vinyl-mute-toggle]")) {
        return;
      }
      void unlockAudible();
    };

    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);

    let raf = 0;
    const tick = () => {
      const graph = graphRef.current;
      if (graph && graph.context.state === "running") {
        graph.analyser.getByteFrequencyData(graph.frequencyData);
        let bass = 0;
        for (let i = 2; i < 24; i++) bass += graph.frequencyData[i] ?? 0;
        bass /= 22 * 255;
        const target = graph.outputGain.gain.value > 0 ? bass : 0;
        audioLevelRef.current += (target - audioLevelRef.current) * 0.18;
      } else {
        audioLevelRef.current *= 0.92;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      cancelAnimationFrame(raf);
      audio.pause();
      audio.src = "";
      graphRef.current?.context.close().catch(() => undefined);
      graphRef.current = null;
      registerOutputGainRef.current(null);
      audioRef.current = null;
    };
  }, []);

  // Mute toggle only flipped GainNode before — element.muted stayed true after blocked autoplay.
  useEffect(() => {
    const audio = audioRef.current;
    const graph = graphRef.current;
    if (!audio) return;

    if (muted) {
      if (graph) graph.outputGain.gain.value = 0;
      return;
    }

    // Do not unmute via toggle during the loading intro.
    if (!isComplete) return;

    audio.muted = false;
    if (graph) {
      void graph.context.resume().catch(() => undefined);
    }
    void audio
      .play()
      .then(() => {
        registerActivationRef.current();
      })
      .catch(() => undefined);
  }, [muted, isComplete]);

  return (
    <VinylAudioLevelProvider audioLevelRef={audioLevelRef}>{children}</VinylAudioLevelProvider>
  );
}

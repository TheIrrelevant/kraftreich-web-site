/**
 * ---metadata---
 * @file src/features/vinyl-particles/ui/VinylAudioEngine.tsx
 * @description Invisible audio graph for Bergain.mp3 — autoplay on mount with 30% output gain,
 *              fallback activation on user gesture, analyser level fed to vinyl spin modulation.
 * @last-updated 2026-05-26
 * @last-change stable effect deps via callback refs; gain owned by mute context
 * ---end-metadata---
 */

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { VINYL_AUDIO_SRC } from "@/features/vinyl-particles/constants/vinyl-particles";
import { VinylAudioLevelProvider } from "@/features/vinyl-particles/context/vinyl-audio-level-context";
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
  const { registerActivation, registerOutputGain } = useAudioMute();
  const registerActivationRef = useRef(registerActivation);
  const registerOutputGainRef = useRef(registerOutputGain);

  useEffect(() => {
    registerActivationRef.current = registerActivation;
    registerOutputGainRef.current = registerOutputGain;
  }, [registerActivation, registerOutputGain]);

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

    const tryStart = async () => {
      const graph = ensureGraph();
      if (!graph) return false;

      await graph.context.resume().catch(() => undefined);
      audio.muted = false;

      try {
        await audio.play();
        registerActivationRef.current();
        return true;
      } catch {
        audio.muted = true;
        try {
          await audio.play();
        } catch {
          return false;
        }
        return false;
      }
    };

    void tryStart();

    const onGesture = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-vinyl-mute-toggle]")) {
        return;
      }

      const graph = ensureGraph();
      if (!graph) return;
      audio.muted = false;
      void graph.context.resume().catch(() => undefined);
      void audio
        .play()
        .then(() => {
          registerActivationRef.current();
        })
        .catch(() => undefined);
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

  return (
    <VinylAudioLevelProvider audioLevelRef={audioLevelRef}>{children}</VinylAudioLevelProvider>
  );
}

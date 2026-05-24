/**
 * ---metadata---
 * @file src/features/audio-particle-cloud/ui/AudioParticleCloud.tsx
 * @description Video-luma particle field for the home hero. Open state is a flat front-facing
 *              particle video plane with stable UVs, so the source video reads cleanly. `morphRef`
 *              (0→1) lerps each particle's world position from that plane into a tight Fibonacci
 *              sphere anchored to the left viewport edge. A Web Audio analyser reads the video
 *              track after user interaction and keeps the formed sphere pulsing to the music.
 *              Mute state lives in `useAudioMute` so the headset toggle can render inside the
 *              IdentityStrip; this component subscribes to the same context to drive the output
 *              GainNode and to register the first user activation.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useAudioMute } from "@/shared/lib/audio-mute/audio-mute-context";

const PARTICLE_COUNT = 60000;

const BONE_WHITE = new THREE.Color("#f9feff");

// Sphere visual: compact radius (~6% of the smaller world dimension), centred on the left edge so
// the visible half reads as a clean circle segment.
const SPHERE_RADIUS_RATIO = 0.06;
const SPHERE_CENTER_Y_RATIO = 0.2;
const AUDIO_OUTPUT_GAIN = 0.3;

type AudioGraph = {
  analyser: AnalyserNode;
  context: AudioContext;
  outputGain: GainNode;
  frequencyData: Uint8Array<ArrayBuffer>;
  timeData: Uint8Array<ArrayBuffer>;
};

function VideoParticles({
  videoEl,
  morphRef,
  audioGraphRef,
}: {
  videoEl: HTMLVideoElement;
  morphRef: { current: number };
  audioGraphRef: { current: AudioGraph | null };
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const audioLevelRef = useRef(0);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const { viewport, size } = useThree();

  const videoTexture = useMemo(() => {
    const t = new THREE.VideoTexture(videoEl);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [videoEl]);

  useEffect(
    () => () => {
      videoTexture.dispose();
    },
    [videoTexture],
  );

  // World dimensions == the visible canvas at the current camera distance. No aspect masking;
  // particles are free to occupy the full viewport.
  const { worldW, worldH } = useMemo(
    () => ({ worldW: viewport.width, worldH: viewport.height }),
    [viewport.width, viewport.height],
  );

  const sphereMetrics = useMemo(
    () => ({
      centerX: -worldW / 2,
      centerY: worldH * SPHERE_CENTER_Y_RATIO,
      radius: Math.min(worldW, worldH) * SPHERE_RADIUS_RATIO,
    }),
    [worldW, worldH],
  );

  // Sphere targets (Fibonacci spherical distribution), anchored at the LEFT edge of the visible
  // world. The centre sits on the viewport edge, so the left half clips out of view.
  const sphereHomes = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const yy = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - yy * yy);
      const theta = golden * i;
      arr[i * 3 + 0] = sphereMetrics.centerX + Math.cos(theta) * r * sphereMetrics.radius;
      arr[i * 3 + 1] = sphereMetrics.centerY + yy * sphereMetrics.radius;
      arr[i * 3 + 2] = Math.sin(theta) * r * sphereMetrics.radius;
    }
    return arr;
  }, [sphereMetrics]);

  const { positions, homes, uvs, randoms } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const homes = new Float32Array(PARTICLE_COUNT * 3);
    const uvs = new Float32Array(PARTICLE_COUNT * 2);
    const randoms = new Float32Array(PARTICLE_COUNT);
    // deterministic per-particle hash — pure (lint-friendly) and gives a Math.random-like
    // distribution. multiple taps with different multipliers decorrelate each use.
    const hash = (n: number) => {
      const s = Math.sin(n) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const fx = hash(i * 12.9898 + 1);
      const fy = hash(i * 78.233 + 2);
      const r = hash(i * 39.346 + 3);
      // Loose field: flat, front-facing, free-scattered particles. UVs stay tied to the same
      // normalized coordinate, so the video reads front-on without exposing a rectangular grid.
      const wx = (fx - 0.5) * worldW;
      const wy = -(fy - 0.5) * worldH;
      const wz = 0;
      positions[i * 3 + 0] = wx;
      positions[i * 3 + 1] = wy;
      positions[i * 3 + 2] = wz;
      homes[i * 3 + 0] = wx;
      homes[i * 3 + 1] = wy;
      homes[i * 3 + 2] = wz;
      uvs[i * 2 + 0] = fx;
      uvs[i * 2 + 1] = 1 - fy;
      randoms[i] = r;
    }
    return { positions, homes, uvs, randoms };
  }, [worldW, worldH]);

  const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 0));

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
    };
    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    const dt = Math.min(delta, 0.05);
    const positionAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = positionAttr.array as Float32Array;
    const elapsed = state.clock.elapsedTime;

    const pointer = pointerRef.current;
    if (pointer.active) {
      mouseWorld.current.set(
        (pointer.x / size.width - 0.5) * viewport.width,
        -(pointer.y / size.height - 0.5) * viewport.height,
        0,
      );
    } else {
      mouseWorld.current.set(9999, 9999, 0);
    }

    const spring = 5;
    const repulseRadius = Math.max(0.85, sphereMetrics.radius * 2.6);
    const repulseRadiusSq = repulseRadius * repulseRadius;
    const repulseStrength = 3.8;

    // morph: 0 = loose scatter, 1 = sphere. Driven by scroll via morphRef.
    const morph = Math.min(1, Math.max(0, morphRef.current));
    const easedMorph = morph * morph * (3 - 2 * morph);
    const looseMix = 1 - morph;
    const repulseGain = 1 - easedMorph * 0.32;
    const graph = audioGraphRef.current;
    let audioTarget = 0;
    if (graph?.context.state === "running") {
      graph.analyser.getByteFrequencyData(graph.frequencyData);
      graph.analyser.getByteTimeDomainData(graph.timeData);
      let bass = 0;
      let mids = 0;
      for (let i = 2; i < 28; i++) bass += graph.frequencyData[i] ?? 0;
      for (let i = 28; i < 96; i++) mids += graph.frequencyData[i] ?? 0;
      bass /= 26 * 255;
      mids /= 68 * 255;
      let rms = 0;
      for (let i = 0; i < graph.timeData.length; i++) {
        const centered = ((graph.timeData[i] ?? 128) - 128) / 128;
        rms += centered * centered;
      }
      rms = Math.sqrt(rms / graph.timeData.length);
      audioTarget = Math.min(1, (bass * 1.25 + mids * 0.35 + rms * 1.1) * 1.35);
    } else {
      audioTarget =
        0.12 +
        Math.sin(videoEl.currentTime * 3.1) * 0.045 +
        Math.sin(videoEl.currentTime * 7.4) * 0.025;
    }
    const audioEase = 1 - Math.exp(-dt * 8);
    audioLevelRef.current += (audioTarget - audioLevelRef.current) * audioEase;
    const audioLevel = audioLevelRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      const sphereX = sphereHomes[ix]!;
      const sphereY = sphereHomes[iy]!;
      const sphereZ = sphereHomes[iz]!;
      let hx = homes[ix]! * looseMix + sphereX * morph;
      let hy = homes[iy]! * looseMix + sphereY * morph;
      let hz = homes[iz]! * looseMix + sphereZ * morph;

      if (easedMorph > 0) {
        const sx = sphereX - sphereMetrics.centerX;
        const sy = sphereY - sphereMetrics.centerY;
        const sz = sphereZ;
        const len = Math.max(0.0001, Math.sqrt(sx * sx + sy * sy + sz * sz));
        const wave = Math.sin(elapsed * (1.4 + randoms[i]! * 2.6) + randoms[i]! * 9.0);
        const pulse =
          sphereMetrics.radius * easedMorph * (0.02 + audioLevel * 0.18 + wave * audioLevel * 0.03);
        hx += (sx / len) * pulse;
        hy += (sy / len) * pulse;
        hz += (sz / len) * pulse;
      }

      const px = arr[ix]!;
      const py = arr[iy]!;
      const pz = arr[iz]!;

      const dx = px - mouseWorld.current.x;
      const dy = py - mouseWorld.current.y;
      const distSq = dx * dx + dy * dy;
      let rx = 0;
      let ry = 0;
      let rz = 0;
      if (repulseGain > 0 && distSq < repulseRadiusSq && distSq > 1e-4) {
        const dist = Math.sqrt(distSq);
        const falloff = 1 - dist / repulseRadius;
        const f = (falloff * falloff * repulseStrength * repulseGain) / dist;
        rx = dx * f;
        ry = dy * f;
        rz = (randoms[i]! - 0.5) * falloff * sphereMetrics.radius * 0.8 * repulseGain;
      }

      arr[ix] = px + (hx + rx - px) * spring * dt;
      arr[iy] = py + (hy + ry - py) * spring * dt;
      arr[iz] = pz + (hz + rz - pz) * spring * dt;
    }

    positionAttr.needsUpdate = true;
    material.uniforms.uPixelRatio!.value = state.gl.getPixelRatio();
    material.uniforms.uTime!.value = elapsed;
    material.uniforms.uMorph!.value = morph;
    material.uniforms.uAudioLevel!.value = audioLevel;
  });

  const uniforms = useMemo(
    () => ({
      uVideo: { value: videoTexture },
      uColor: { value: BONE_WHITE },
      uPointSize: { value: 2.5 },
      uPixelRatio: { value: 1 },
      uThreshold: { value: 0.08 },
      uBlur: { value: 0.0035 },
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uAudioLevel: { value: 0 },
    }),
    [videoTexture],
  );

  useEffect(() => {
    if (materialRef.current) materialRef.current.uniforms.uVideo!.value = videoTexture;
  }, [videoTexture]);

  // resize-aware point size
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uPointSize!.value = Math.max(1.0, size.height / 900);
  }, [size.height]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aUv"
          args={[uvs, 2]}
          count={PARTICLE_COUNT}
          itemSize={2}
        />
        <bufferAttribute
          attach="attributes-aRand"
          args={[randoms, 1]}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={
          /* glsl */ `
          attribute vec2 aUv;
          attribute float aRand;
          uniform sampler2D uVideo;
          uniform float uPointSize;
          uniform float uPixelRatio;
          uniform float uThreshold;
          uniform float uBlur;
          uniform float uTime;
          uniform float uMorph;
          uniform float uAudioLevel;
          varying float vBrightness;
          varying float vRand;

          float sampleLuma(vec2 uv) {
            vec3 px = texture2D(uVideo, uv).rgb;
            return dot(px, vec3(0.299, 0.587, 0.114));
          }

          void main() {
            // 5-tap luma blur: the video image controls particle density, scale, and shimmer.
            float s = uBlur;
            float luma = sampleLuma(aUv) * 0.4
              + (sampleLuma(aUv + vec2( s, 0.0)) + sampleLuma(aUv + vec2(-s, 0.0))) * 0.15
              + (sampleLuma(aUv + vec2(0.0,  s)) + sampleLuma(aUv + vec2(0.0, -s))) * 0.15;

            float videoShape = smoothstep(uThreshold, 0.74, luma);
            float edgeMask =
              smoothstep(0.0, 0.09, aUv.x) *
              smoothstep(1.0, 0.91, aUv.x) *
              smoothstep(0.0, 0.09, aUv.y) *
              smoothstep(1.0, 0.91, aUv.y);
            float looseBrightness = videoShape * edgeMask;
            float sphereBrightness = clamp(0.09 + videoShape * 0.216 + uAudioLevel * 0.192 + aRand * 0.108, 0.0, 0.5);
            vBrightness = mix(looseBrightness, sphereBrightness, uMorph);
            vRand = aRand;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            float looseSize = mix(0.42, 2.35, videoShape) * (0.74 + aRand * 0.7);
            float sphereSize = (0.32 + uAudioLevel * 0.42) * (0.72 + aRand * 0.48);
            gl_PointSize = uPointSize * uPixelRatio * mix(looseSize, sphereSize, uMorph);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          uniform vec3 uColor;
          varying float vBrightness;
          varying float vRand;
          void main() {
            if (vBrightness <= 0.0) discard;
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float soft = smoothstep(0.5, 0.05, d);
            float a = vBrightness * soft * (0.42 + vRand * 0.68);
            if (a < 0.006) discard;
            gl_FragColor = vec4(uColor, a);
          }
        `
        }
      />
    </points>
  );
}

export default function AudioParticleCloud({ morphRef }: { morphRef: { current: number } }) {
  // Created in effect (not lazy useState) because `document` is undefined during SSR —
  // "use client" still renders on the server. Once set, element identity is stable.
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const audioGraphRef = useRef<AudioGraph | null>(null);
  const { registerActivation, registerOutputGain } = useAudioMute();
  // Keep the latest callbacks behind refs so the audio-setup effect can stay []-deps (we never
  // want to tear down and recreate the graph just because a callback identity changes).
  const registerActivationRef = useRef(registerActivation);
  const registerOutputGainRef = useRef(registerOutputGain);
  useEffect(() => {
    registerActivationRef.current = registerActivation;
    registerOutputGainRef.current = registerOutputGain;
  }, [registerActivation, registerOutputGain]);

  useEffect(() => {
    const v = document.createElement("video");
    v.src = "/assets/video/rosalia-berghain.mp4";
    v.loop = true;
    v.playsInline = true;
    v.crossOrigin = "anonymous";
    v.preload = "auto";
    v.muted = true;
    v.volume = 1;
    v.autoplay = true;

    const audioMedia = document.createElement("video");
    audioMedia.src = "/assets/video/rosalia-berghain.mp4";
    audioMedia.loop = true;
    audioMedia.playsInline = true;
    audioMedia.crossOrigin = "anonymous";
    audioMedia.preload = "auto";
    audioMedia.muted = true;
    audioMedia.volume = 1;

    let cleanupAudio = () => {};
    const safePlay = () => {
      void v.play().catch(() => {
        // Visual autoplay can still be deferred in strict browser modes.
      });
    };
    const safePlayAudio = () => {
      void audioMedia.play().catch(() => {
        // Audible playback waits for trusted user activation.
      });
    };
    const safeResume = (context: AudioContext) => {
      void context.resume().catch(() => {
        // AudioContext resume follows the same user-activation policy as media playback.
      });
    };
    const ensureAudioGraph = () => {
      if (audioGraphRef.current) {
        safeResume(audioGraphRef.current.context);
        audioMedia.muted = false;
        audioMedia.currentTime = v.currentTime;
        safePlayAudio();
        return;
      }
      const audioWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
      const AudioContextCtor = window.AudioContext ?? audioWindow.webkitAudioContext;
      if (!AudioContextCtor) return;

      const context = new AudioContextCtor();
      const source = context.createMediaElementSource(audioMedia);
      const analyser = context.createAnalyser();
      const outputGain = context.createGain();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.82;
      outputGain.gain.value = AUDIO_OUTPUT_GAIN;
      source.connect(analyser);
      analyser.connect(outputGain);
      outputGain.connect(context.destination);
      audioGraphRef.current = {
        analyser,
        context,
        outputGain,
        frequencyData: new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount)),
        timeData: new Uint8Array(new ArrayBuffer(analyser.fftSize)),
      };
      cleanupAudio = () => {
        registerOutputGainRef.current(null);
        source.disconnect();
        analyser.disconnect();
        outputGain.disconnect();
        void context.close();
        audioMedia.pause();
        audioMedia.src = "";
        audioGraphRef.current = null;
      };
      // Hand the output GainNode to the context so toggleMute / registerActivation can drive
      // it synchronously. The context will also align the gain with the current muted state.
      registerOutputGainRef.current(outputGain);
      safeResume(context);
      audioMedia.muted = false;
      audioMedia.currentTime = v.currentTime;
      safePlayAudio();
      registerActivationRef.current();
    };
    const interactionEvents = ["pointerdown", "keydown", "touchstart"];
    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, ensureAudioGraph, { passive: true });
    });
    safePlay();
    // The "external system" here is the DOM video element — it must be created post-mount
    // (document is SSR-undefined) and its identity must propagate to children.
    setVideoEl(v);
    return () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, ensureAudioGraph);
      });
      cleanupAudio();
      v.pause();
      v.src = "";
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        // R3F's default events layer installs pointer listeners on the canvas DOM and the canvas
        // element overrides the parent's pointer-events:none — that ate the headset button click
        // (window pointerdown still bubbled, so activation worked, but onClick never fired).
        // Hard-set pointer-events:none on the canvas itself so clicks fall through to the strip.
        style={{ pointerEvents: "none" }}
      >
        {videoEl ? (
          <VideoParticles videoEl={videoEl} morphRef={morphRef} audioGraphRef={audioGraphRef} />
        ) : null}
      </Canvas>
    </div>
  );
}

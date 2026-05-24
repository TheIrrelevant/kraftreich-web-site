/**
 * ---metadata---
 * @file src/features/audio-particle-cloud/ui/AudioParticleCloud.tsx
 * @description Video-driven particle screen. A hidden <video> feeds a VideoTexture; particles in
 *              a 16:9 grid sample their own UV from the texture and gate their point size and
 *              alpha by pixel luminance — the video silhouette is rendered as a particle cloud.
 *              Mouse repulsion displaces particles from their grid home with a spring return.
 *              Audio analyser drives a subtle global pulse and serves the mute toggle.
 * @last-updated 2026-05-24
 * ---end-metadata---
 */

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useAudioAnalyserFromElement } from "@/features/audio-particle-cloud/model/use-audio-analyser";

const PARTICLE_COUNT = 60000;
const ASPECT = 16 / 9;

const BONE_WHITE = new THREE.Color("#f9feff");

function VideoParticles({
  videoEl,
  getFrequencyData,
}: {
  videoEl: HTMLVideoElement;
  getFrequencyData: () => Uint8Array | null;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
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

  // size the grid to fit the viewport while keeping 16:9 (cover the camera frame)
  const { worldW, worldH } = useMemo(() => {
    const vAspect = viewport.width / viewport.height;
    let worldW = viewport.width;
    let worldH = viewport.height;
    if (vAspect > ASPECT) {
      // viewport wider than 16:9 → fit width, crop height
      worldH = worldW / ASPECT;
    } else {
      worldW = worldH * ASPECT;
    }
    return { worldW, worldH };
  }, [viewport.width, viewport.height]);

  const { positions, homes, uvs, randoms } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const homes = new Float32Array(PARTICLE_COUNT * 3);
    const uvs = new Float32Array(PARTICLE_COUNT * 2);
    const randoms = new Float32Array(PARTICLE_COUNT);
    // deterministic per-particle hash — pure (lint-friendly) and gives a Math.random-like
    // distribution. three taps with different multipliers decorrelate the three uses below.
    const hash = (n: number) => {
      const s = Math.sin(n) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const fx = hash(i * 12.9898 + 1);
      const fy = hash(i * 78.233 + 2);
      const r = hash(i * 39.346 + 3);
      const wx = (fx - 0.5) * worldW;
      const wy = -(fy - 0.5) * worldH;
      positions[i * 3 + 0] = wx;
      positions[i * 3 + 1] = wy;
      positions[i * 3 + 2] = 0;
      homes[i * 3 + 0] = wx;
      homes[i * 3 + 1] = wy;
      homes[i * 3 + 2] = 0;
      uvs[i * 2 + 0] = fx;
      uvs[i * 2 + 1] = 1 - fy;
      randoms[i] = r;
    }
    return { positions, homes, uvs, randoms };
  }, [worldW, worldH]);

  const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 0));

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    const dt = Math.min(delta, 0.05);
    const positionAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = positionAttr.array as Float32Array;

    mouseWorld.current.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      0,
    );

    const spring = 5;
    const repulseRadius = 1.6;
    const repulseRadiusSq = repulseRadius * repulseRadius;
    const repulseStrength = 4.5;

    // audio energy → subtle outward push
    const freq = getFrequencyData();
    let energy = 0;
    if (freq) {
      let sum = 0;
      for (let b = 0; b < freq.length; b++) sum += freq[b]!;
      energy = sum / (freq.length * 255);
    }
    const audioPush = 1 + energy * 0.06;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      const hx = homes[ix]! * audioPush;
      const hy = homes[iy]! * audioPush;
      const hz = 0;

      const px = arr[ix]!;
      const py = arr[iy]!;
      const pz = arr[iz]!;

      // mouse repulsion (xy plane)
      const dx = px - mouseWorld.current.x;
      const dy = py - mouseWorld.current.y;
      const distSq = dx * dx + dy * dy;
      let rx = 0;
      let ry = 0;
      let rz = 0;
      if (distSq < repulseRadiusSq && distSq > 1e-4) {
        const dist = Math.sqrt(distSq);
        const falloff = 1 - dist / repulseRadius;
        const f = (falloff * falloff * repulseStrength) / dist;
        rx = dx * f;
        ry = dy * f;
        rz = (Math.random() - 0.5) * falloff * 0.6;
      }

      arr[ix] = px + (hx + rx - px) * spring * dt;
      arr[iy] = py + (hy + ry - py) * spring * dt;
      arr[iz] = pz + (hz + rz - pz) * spring * dt;
    }

    positionAttr.needsUpdate = true;
    material.uniforms.uPixelRatio!.value = state.gl.getPixelRatio();
  });

  const uniforms = useMemo(
    () => ({
      uVideo: { value: videoTexture },
      uColor: { value: BONE_WHITE },
      uPointSize: { value: 2.5 },
      uPixelRatio: { value: 1 },
      uThreshold: { value: 0.03 },
      uBlur: { value: 0.004 },
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
          varying float vBrightness;
          varying float vRand;

          float sampleLuma(vec2 uv) {
            vec3 px = texture2D(uVideo, uv).rgb;
            return dot(px, vec3(0.299, 0.587, 0.114));
          }

          void main() {
            // 5-tap blur (luma) — softens facial features, keeps the silhouette
            float s = uBlur;
            float luma = sampleLuma(aUv) * 0.4
              + (sampleLuma(aUv + vec2( s, 0.0)) + sampleLuma(aUv + vec2(-s, 0.0))) * 0.15
              + (sampleLuma(aUv + vec2(0.0,  s)) + sampleLuma(aUv + vec2(0.0, -s))) * 0.15;
            // each particle has its own brightness threshold — dark areas get sparse
            // particles, bright areas get all of them → film-grain density modulation
            float thresh = uThreshold + aRand * 0.9;
            if (luma < thresh) {
              // emit a zero-size point that will be culled by frag discard
              gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
              gl_PointSize = 0.0;
              vBrightness = 0.0;
              vRand = aRand;
              return;
            }
            vBrightness = smoothstep(thresh, min(thresh + 0.4, 1.0), luma);
            vRand = aRand;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            // tiny dust grains, slight per-particle size variation
            gl_PointSize = uPointSize * uPixelRatio * (0.8 + aRand * 0.6);
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
            float a = vBrightness * soft * (0.6 + vRand * 0.5);
            if (a < 0.01) discard;
            gl_FragColor = vec4(uColor, a);
          }
        `
        }
      />
    </points>
  );
}

export default function AudioParticleCloud() {
  // lazy init runs once at mount; the element identity is stable for the lifetime of the
  // component, so passing it down + into the analyser hook is referentially safe.
  const [videoEl] = useState<HTMLVideoElement>(() => {
    const v = document.createElement("video");
    v.src = "/assets/video/rosalia-berghain.mp4";
    v.loop = true;
    v.playsInline = true;
    v.crossOrigin = "anonymous";
    v.preload = "auto";
    // element.muted=true keeps autoplay policy happy; the analyser hook flips it on first
    // user gesture so MediaElementSource carries a real signal (Chrome silences a muted node).
    v.muted = true;
    v.autoplay = true;
    return v;
  });

  useEffect(
    () => () => {
      videoEl.pause();
      videoEl.src = "";
    },
    [videoEl],
  );

  const { getFrequencyData, muted, toggleMute, started } = useAudioAnalyserFromElement(videoEl);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <VideoParticles videoEl={videoEl} getFrequencyData={getFrequencyData} />
      </Canvas>
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute right-[var(--space-24)] bottom-[var(--space-24)] grid h-10 w-10 place-items-center rounded-full border border-[var(--accent)]/40 bg-[var(--primary)]/40 text-[var(--secondary)] backdrop-blur-sm transition hover:border-[var(--accent)]"
      >
        {muted || !started ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
      </button>
    </div>
  );
}

function SpeakerOnIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4Z" />
      <path d="m16 9 5 6" />
      <path d="m21 9-5 6" />
    </svg>
  );
}

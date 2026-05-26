/**
 * ---metadata---
 * @file src/features/vinyl-particles/ui/VinylParticles.tsx
 * @description Interactive vinyl-disc particle field for the IdentityStrip left column. Spins at
 *              BPM-driven RPM, plays Bergain.mp3 after user activation, pointer repulsion with
 *              spring return. Audio level modulates groove shimmer and spin pulse.
 * @last-updated 2026-05-26
 * @last-change portal fixed overlay above work grid via vinyl-mount anchor
 * ---end-metadata---
 */

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import {
  VINYL_DISC_INSET,
  VINYL_GROOVE_COUNT,
  VINYL_HOLE_RADIUS,
  VINYL_LABEL_RADIUS,
  VINYL_PARTICLE_COUNT,
  resolveVinylRadiansPerSecond,
} from "@/features/vinyl-particles/constants/vinyl-particles";
import { useVinylAudioLevelRef } from "@/features/vinyl-particles/context/vinyl-audio-level-context";
import { VINYL_MOUNT_ID } from "@/features/vinyl-particles/ui/VinylMount";
import { Z_HOME_VINYL } from "@/shared/constants/home-layers";
import { useAudioMute } from "@/shared/lib/audio-mute/audio-mute-context";

const BONE_WHITE = new THREE.Color("#f9feff");
const ASH_SILVER = new THREE.Color("#e2e7e9");

type VinylParticleData = {
  homes: Float32Array;
  randoms: Float32Array;
  ringKinds: Float32Array;
};

const hash = (n: number) => {
  const s = Math.sin(n) * 43758.5453;
  return s - Math.floor(s);
};

function buildVinylParticles(count: number): VinylParticleData {
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

function VinylDiscPoints({ muted }: { muted: boolean }) {
  const audioLevelRef = useVinylAudioLevelRef();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const spinAngleRef = useRef(0);
  const { gl, viewport, size } = useThree();

  const discRadius = useMemo(
    () => Math.min(viewport.width, viewport.height) * 0.5 * VINYL_DISC_INSET,
    [viewport.width, viewport.height],
  );

  const centerOffset = useMemo(
    () => ({
      x: -viewport.width * 0.5 + discRadius,
      y: -viewport.height * 0.5 + discRadius + viewport.height * 0.035,
    }),
    [discRadius, viewport.height, viewport.width],
  );

  const particleData = useMemo(() => buildVinylParticles(VINYL_PARTICLE_COUNT), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(VINYL_PARTICLE_COUNT * 3);
    for (let i = 0; i < VINYL_PARTICLE_COUNT; i++) {
      arr[i * 3 + 0] = particleData.homes[i * 3 + 0]! * discRadius + centerOffset.x;
      arr[i * 3 + 1] = particleData.homes[i * 3 + 1]! * discRadius + centerOffset.y;
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, [centerOffset.x, centerOffset.y, discRadius, particleData.homes]);

  const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 0));

  useEffect(() => {
    const el = gl.domElement;
    const handlePointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointerRef.current = {
        x: ((event.clientX - rect.left) / rect.width) * size.width,
        y: ((event.clientY - rect.top) / rect.height) * size.height,
        active: true,
      };
    };
    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };
    el.addEventListener("pointermove", handlePointerMove, { passive: true });
    el.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [gl.domElement, size.height, size.width]);

  const uniforms = useMemo(
    () => ({
      uColor: { value: BONE_WHITE },
      uAccent: { value: ASH_SILVER },
      uPointSize: { value: 2.2 },
      uPixelRatio: { value: 1 },
      uTime: { value: 0 },
      uAudioLevel: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uPointSize!.value = Math.max(1.2, size.height / 520);
  }, [size.height]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    const dt = Math.min(delta, 0.05);
    const positionAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = positionAttr.array as Float32Array;
    const elapsed = state.clock.elapsedTime;
    const audioLevel = audioLevelRef.current ?? 0;

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

    const radPerSec = resolveVinylRadiansPerSecond() * (1 + audioLevel * 0.1);
    if (!muted) {
      spinAngleRef.current += radPerSec * dt;
    }
    const spin = spinAngleRef.current;

    const spring = 5.2;
    const repulseRadius = Math.max(0.55, discRadius * 0.22);
    const repulseRadiusSq = repulseRadius * repulseRadius;
    const repulseStrength = 3.4;

    for (let i = 0; i < VINYL_PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      const normX = particleData.homes[ix]!;
      const normY = particleData.homes[iy]!;
      const len = Math.max(0.0001, Math.hypot(normX, normY));
      const spinX = normX * Math.cos(spin) - normY * Math.sin(spin);
      const spinY = normX * Math.sin(spin) + normY * Math.cos(spin);
      const wobble = Math.sin(elapsed * 1.6 + particleData.randoms[i]! * 12) * 0.0015;

      let hx = (spinX / len) * (len + wobble) * discRadius + centerOffset.x;
      let hy = (spinY / len) * (len + wobble) * discRadius + centerOffset.y;
      let hz = 0;

      const px = arr[ix]!;
      const py = arr[iy]!;
      const pz = arr[iz]!;

      const dx = px - mouseWorld.current.x;
      const dy = py - mouseWorld.current.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < repulseRadiusSq && distSq > 1e-4) {
        const dist = Math.sqrt(distSq);
        const falloff = 1 - dist / repulseRadius;
        const force = (falloff * falloff * repulseStrength) / dist;
        hx += dx * force;
        hy += dy * force;
        hz += (particleData.randoms[i]! - 0.5) * falloff * 0.08;
      }

      arr[ix] = px + (hx - px) * spring * dt;
      arr[iy] = py + (hy - py) * spring * dt;
      arr[iz] = pz + (hz - pz) * spring * dt;
    }

    positionAttr.needsUpdate = true;
    material.uniforms.uPixelRatio!.value = state.gl.getPixelRatio();
    material.uniforms.uTime!.value = elapsed;
    material.uniforms.uAudioLevel!.value = audioLevel;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={VINYL_PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRand"
          args={[particleData.randoms, 1]}
          count={VINYL_PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aKind"
          args={[particleData.ringKinds, 1]}
          count={VINYL_PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aHome"
          args={[particleData.homes, 3]}
          count={VINYL_PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={
          /* glsl */ `
          attribute float aRand;
          attribute float aKind;
          attribute vec3 aHome;
          uniform float uPointSize;
          uniform float uPixelRatio;
          uniform float uTime;
          uniform float uAudioLevel;
          varying float vBrightness;
          varying float vRand;

          void main() {
            float radiusNorm = length(aHome);
            float grooveWave = sin(radiusNorm * 180.0 + uTime * 1.4) * 0.5 + 0.5;
            float labelGlow = smoothstep(0.2, 0.04, abs(radiusNorm - 0.12));
            float rimGlow = smoothstep(0.86, 0.98, radiusNorm);
            float holeCut = smoothstep(0.035, 0.05, radiusNorm);

            float grooveBright = mix(0.18, 0.62, grooveWave) * holeCut;
            float labelBright = mix(0.35, 0.78, labelGlow) * holeCut;
            float rimBright = mix(0.45, 0.95, rimGlow) * holeCut;

            float kindMix = aKind;
            vBrightness = mix(labelBright, grooveBright, step(0.5, kindMix));
            vBrightness = mix(vBrightness, rimBright, step(1.5, kindMix));
            vBrightness *= 0.82 + aRand * 0.28 + uAudioLevel * 0.22;
            vRand = aRand;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            float sizeBase = mix(0.55, 1.35, vBrightness);
            gl_PointSize = uPointSize * uPixelRatio * sizeBase * (0.75 + aRand * 0.55);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          uniform vec3 uColor;
          uniform vec3 uAccent;
          varying float vBrightness;
          varying float vRand;
          void main() {
            if (vBrightness <= 0.0) discard;
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float soft = smoothstep(0.5, 0.08, d);
            vec3 col = mix(uAccent, uColor, 0.55 + vRand * 0.35);
            float a = vBrightness * soft;
            if (a < 0.01) discard;
            gl_FragColor = vec4(col, a);
          }
        `
        }
      />
    </points>
  );
}

function VinylCanvas({ muted }: { muted: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <VinylDiscPoints muted={muted} />
    </Canvas>
  );
}

export default function VinylParticles() {
  const { muted } = useAudioMute();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!mounted) return;

    const sync = () => {
      const anchor = document.getElementById(VINYL_MOUNT_ID);
      if (!anchor) return;
      setRect(anchor.getBoundingClientRect());
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    const anchor = document.getElementById(VINYL_MOUNT_ID);
    let observer: ResizeObserver | undefined;
    if (anchor) {
      observer = new ResizeObserver(sync);
      observer.observe(anchor);
    }

    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      observer?.disconnect();
    };
  }, [mounted]);

  if (!mounted || !rect) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed overflow-hidden"
      style={{
        zIndex: Z_HOME_VINYL,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      }}
      aria-hidden
    >
      <div className="pointer-events-auto h-full w-full">
        <VinylCanvas muted={muted} />
      </div>
    </div>,
    document.body,
  );
}

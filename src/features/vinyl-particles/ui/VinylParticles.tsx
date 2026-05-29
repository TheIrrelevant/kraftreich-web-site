/**
 * ---metadata---
 * @file src/features/vinyl-particles/ui/VinylParticles.tsx
 * @description Interactive vinyl-disc particle field for the IdentityStrip left column. Spins at
 *              BPM-driven RPM, plays Bergain.mp3 after user activation, pointer repulsion with
 *              spring return. Audio level modulates groove shimmer and spin pulse.
 * @last-updated 2026-05-28
 * @last-change full-page loading scatter/assemble/migrate sequence
 * ---end-metadata---
 */

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import {
  VINYL_DISC_INSET,
  VINYL_PARTICLE_COUNT,
  resolveVinylRadiansPerSecond,
} from "@/features/vinyl-particles/constants/vinyl-particles";
import { useVinylLoading } from "@/features/vinyl-particles/context/vinyl-loading-context";
import { useVinylAudioLevelRef } from "@/features/vinyl-particles/context/vinyl-audio-level-context";
import {
  buildScatterCloud,
  buildVinylParticles,
  easeOutCubic,
} from "@/features/vinyl-particles/lib/build-vinyl-particles";
import {
  discLayoutFromAnchorRect,
  lerpDiscLayout,
  screenCenterToWorld,
} from "@/features/vinyl-particles/lib/vinyl-disc-layout";
import { VINYL_ASSEMBLY_ID } from "@/features/vinyl-particles/ui/VinylAssemblyAnchor";
import { VINYL_MOUNT_ID } from "@/features/vinyl-particles/ui/VinylMount";
import {
  GALLERY_DETAIL_VINYL_LAYER_ID,
  Z_HOME_GALLERY_DETAIL_VINYL,
  Z_HOME_VINYL,
} from "@/shared/constants/home-layers";
import { useGallerySelection } from "@/shared/lib/gallery-selection/gallery-selection-context";
import { useAudioMute } from "@/shared/lib/audio-mute/audio-mute-context";

const BONE_WHITE = new THREE.Color("#f9feff");
const ASH_SILVER = new THREE.Color("#e2e7e9");

type VinylDiscPointsProps = {
  muted: boolean;
  mode: "loading" | "idle";
};

function VinylDiscPoints({ muted, mode }: VinylDiscPointsProps) {
  const { phase, assembleProgressRef, migrateProgressRef } = useVinylLoading();
  const audioLevelRef = useVinylAudioLevelRef();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const spinAngleRef = useRef(0);
  const { gl, viewport, size } = useThree();

  const scatterCloud = useMemo(() => {
    if (mode !== "loading") return null;
    return buildScatterCloud(VINYL_PARTICLE_COUNT, viewport.width, viewport.height);
  }, [mode, viewport.height, viewport.width]);

  const idleDiscRadius = useMemo(
    () => Math.min(viewport.width, viewport.height) * 0.5 * VINYL_DISC_INSET,
    [viewport.width, viewport.height],
  );

  const idleCenterOffset = useMemo(
    () => ({
      x: -viewport.width * 0.5 + idleDiscRadius,
      y: -viewport.height * 0.5 + idleDiscRadius + viewport.height * 0.035,
    }),
    [idleDiscRadius, viewport.height, viewport.width],
  );

  const particleData = useMemo(() => buildVinylParticles(VINYL_PARTICLE_COUNT), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(VINYL_PARTICLE_COUNT * 3);
    if (scatterCloud) {
      arr.set(scatterCloud.positions);
      return arr;
    }
    for (let i = 0; i < VINYL_PARTICLE_COUNT; i++) {
      arr[i * 3 + 0] = particleData.homes[i * 3 + 0]! * idleDiscRadius + idleCenterOffset.x;
      arr[i * 3 + 1] = particleData.homes[i * 3 + 1]! * idleDiscRadius + idleCenterOffset.y;
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, [idleCenterOffset.x, idleCenterOffset.y, idleDiscRadius, scatterCloud, particleData.homes]);

  useEffect(() => {
    if (!scatterCloud) return;
    const points = pointsRef.current;
    if (!points) return;
    const positionAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    positionAttr.array.set(scatterCloud.positions);
    positionAttr.needsUpdate = true;
  }, [scatterCloud]);

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
      uAssembleProgress: { value: 0 },
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

    let discRadius = idleDiscRadius;
    let centerOffset = idleCenterOffset;

    if (mode === "loading") {
      const assemblyEl = document.getElementById(VINYL_ASSEMBLY_ID);
      const mountEl = document.getElementById(VINYL_MOUNT_ID);
      const assemblyLayout = assemblyEl
        ? discLayoutFromAnchorRect(assemblyEl.getBoundingClientRect())
        : discLayoutFromAnchorRect(new DOMRect(window.innerWidth * 0.35, 120, 200, 224));
      const mountLayout = mountEl
        ? discLayoutFromAnchorRect(mountEl.getBoundingClientRect())
        : assemblyLayout;

      const migrateT =
        phase === "migrating" || phase === "complete" ? migrateProgressRef.current : 0;
      const layout =
        phase === "migrating" || phase === "complete"
          ? lerpDiscLayout(assemblyLayout, mountLayout, migrateT)
          : assemblyLayout;

      const world = screenCenterToWorld(
        layout.centerX,
        layout.centerY,
        viewport.width,
        viewport.height,
      );
      discRadius = (layout.radius / window.innerWidth) * viewport.width;
      centerOffset = { x: world.x, y: world.y };
    }

    const pointer = pointerRef.current;
    if (pointer.active && mode === "idle") {
      mouseWorld.current.set(
        (pointer.x / size.width - 0.5) * viewport.width,
        -(pointer.y / size.height - 0.5) * viewport.height,
        0,
      );
    } else {
      mouseWorld.current.set(9999, 9999, 0);
    }

    const radPerSec = resolveVinylRadiansPerSecond() * (1 + audioLevel * 0.1);
    if (!muted && mode === "idle") {
      spinAngleRef.current += radPerSec * dt;
    }
    const spin = spinAngleRef.current;

    const assembleT = mode === "loading" ? assembleProgressRef.current : 1;
    const spring = mode === "loading" ? (assembleT < 0.12 ? 3.2 : 8.5) : 5.2;
    const repulseRadius = Math.max(0.55, discRadius * 0.22);
    const repulseRadiusSq = repulseRadius * repulseRadius;
    const repulseStrength = 3.4;
    const loadingSettled = mode === "loading" && assembleT >= 0.999 && phase !== "assembling";

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

      if (mode === "loading" && scatterCloud && !loadingSettled) {
        const sx = scatterCloud.positions[ix]!;
        const sy = scatterCloud.positions[iy]!;
        const sz = scatterCloud.positions[iz]!;
        const driftPhase = scatterCloud.driftPhases[i]!;
        const swirl = scatterCloud.swirlStrength[i]!;
        const cloudDrift = (1 - assembleT) * Math.min(viewport.width, viewport.height) * 0.014;
        const driftX =
          Math.sin(elapsed * 0.62 + driftPhase) * cloudDrift * swirl +
          Math.sin(elapsed * 0.23 + driftPhase * 1.7) * cloudDrift * 0.35;
        const driftY =
          Math.cos(elapsed * 0.54 + driftPhase * 1.2) * cloudDrift * swirl +
          Math.cos(elapsed * 0.19 + driftPhase) * cloudDrift * 0.35;
        const driftZ = Math.sin(elapsed * 0.41 + driftPhase * 0.6) * cloudDrift * 0.55;
        const stagger = particleData.randoms[i]! * 0.68;
        const localT =
          assembleT <= stagger
            ? 0
            : Math.min(1, (assembleT - stagger) / Math.max(0.08, 1 - stagger));
        const eased = easeOutCubic(localT);
        const fromX = sx + driftX;
        const fromY = sy + driftY;
        const fromZ = sz + driftZ;
        hx = fromX + (hx - fromX) * eased;
        hy = fromY + (hy - fromY) * eased;
        hz = fromZ + (hz - fromZ) * eased;
      } else if (mode === "idle") {
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
      }

      arr[ix] = px + (hx - px) * spring * dt;
      arr[iy] = py + (hy - py) * spring * dt;
      arr[iz] = pz + (hz - pz) * spring * dt;
    }

    positionAttr.needsUpdate = true;
    material.uniforms.uPixelRatio!.value = state.gl.getPixelRatio();
    material.uniforms.uTime!.value = elapsed;
    material.uniforms.uAudioLevel!.value = audioLevel;
    material.uniforms.uAssembleProgress!.value = mode === "loading" ? assembleT : 1;
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
          uniform float uAssembleProgress;
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
            float vinylBright = mix(labelBright, grooveBright, step(0.5, kindMix));
            vinylBright = mix(vinylBright, rimBright, step(1.5, kindMix));
            vinylBright *= 0.82 + aRand * 0.28 + uAudioLevel * 0.22;

            float cloudRadius = length(position.xy);
            float cloudDepth = abs(position.z);
            float cloudCore = 1.0 - smoothstep(0.0, 2.8, cloudRadius);
            float cloudDepthGlow = 1.0 - smoothstep(0.0, 1.6, cloudDepth);
            float cloudTwinkle = sin(uTime * 2.2 + aRand * 24.0) * 0.5 + 0.5;
            float cloudBright = (0.18 + aRand * 0.62) * (0.55 + cloudCore * 0.45);
            cloudBright *= 0.72 + cloudDepthGlow * 0.35 + cloudTwinkle * 0.12;

            float vinylMix = smoothstep(0.04, 0.62, uAssembleProgress);
            vBrightness = mix(cloudBright, vinylBright, vinylMix);
            vRand = aRand;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            float cloudSize = mix(0.28, 1.15, aRand) * (0.75 + cloudDepthGlow * 0.55);
            float vinylSize = mix(0.55, 1.35, vinylBright);
            float sizeBase = mix(cloudSize, vinylSize, vinylMix);
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

function VinylCanvas({ muted, mode }: VinylDiscPointsProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <VinylDiscPoints muted={muted} mode={mode} />
    </Canvas>
  );
}

export default function VinylParticles() {
  const { isGalleryOpen } = useGallerySelection();
  const { muted } = useAudioMute();
  const { isComplete } = useVinylLoading();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [mountRect, setMountRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!mounted) return;

    const sync = () => {
      const anchor = document.getElementById(VINYL_MOUNT_ID);
      if (!anchor) return;
      setMountRect(anchor.getBoundingClientRect());
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
  }, [mounted, isComplete, isGalleryOpen]);

  if (!mounted) return null;

  const galleryLayer =
    isGalleryOpen && typeof document !== "undefined"
      ? document.getElementById(GALLERY_DETAIL_VINYL_LAYER_ID)
      : null;
  const portalTarget = galleryLayer ?? document.body;
  const particleZIndex = isGalleryOpen ? Z_HOME_GALLERY_DETAIL_VINYL : Z_HOME_VINYL;

  if (!isComplete && !isGalleryOpen) {
    return createPortal(
      <div
        className="pointer-events-auto fixed inset-0"
        style={{ zIndex: Z_HOME_VINYL }}
        aria-hidden
      >
        <VinylCanvas muted={muted} mode="loading" />
      </div>,
      document.body,
    );
  }

  if (isGalleryOpen && !galleryLayer) return null;

  if (!mountRect) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed overflow-hidden"
      style={{
        zIndex: particleZIndex,
        left: mountRect.left,
        top: mountRect.top,
        width: mountRect.width,
        height: mountRect.height,
      }}
      aria-hidden
    >
      <div className="pointer-events-auto h-full w-full">
        <VinylCanvas muted={muted} mode="idle" />
      </div>
    </div>,
    portalTarget,
  );
}

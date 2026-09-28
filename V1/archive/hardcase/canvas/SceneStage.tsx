// Lane D — SceneStage (PLAN-MASTER step 7).
// Near-black world: studio HDRI + drei Environment + Lightformer dark-field
// strips (behind/side so lens/case edges glow), one strip animated with
// progress to sweep across the lens, grazing light for the velvet beat.
// Pure function of master progress `p`.
//
// Sole 3D input is `progress`, in any of three shapes (all read in useFrame,
// never setState):
//   - a number (static poses / isolated harness),
//   - Lane B's shared `filmProgress` ({ p, beat }) — the default when the
//     prop is omitted, so `<SceneStage/>` plugs straight into FilmCanvas,
//   - a mutable { current } ref (equivalent alias).
// Everything dynamic is applied imperatively in useFrame.
//
// Conductor contract (Lane B §4 — single writer): fog density and
// toneMappingExposure are owned by CameraRig/sampleCamera. SceneStage renders
// the declarative <fogExp2> initial state only and NEVER writes scene.fog or
// gl exposure per frame. Light intensities + the sweep strip stay Lane D.

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { filmProgress } from '../motion/progress'
import { clamp01, lerp, smoothstep } from './stage/math'

export type StageProgress = number | { current: number } | { p: number }

export function readStageProgress(progress: StageProgress): number {
  if (typeof progress === 'number') return progress
  if ('current' in progress) return progress.current
  return progress.p
}

/** Exposure 1.0 → 1.15 across the dark act (B8 portal waypoint 1.35 and the
 *  2.2 handoff belong to Lane B's LensPortal — this stage caps at 1.15). */
export function exposureFor(p: number): number {
  return 1 + 0.15 * smoothstep(0, 0.92, p)
}

/** FogExp2 density, Void-matched: 0.035 base → 0.015 waves dip → 0.030 approach. */
export function fogDensityFor(p: number): number {
  if (p >= 0.92) return 0.03
  if (p <= 0.7) return 0.035
  // Smooth dip across the wave windows (0.70–0.92).
  const dip = smoothstep(0.7, 0.78, p) * (1 - smoothstep(0.86, 0.92, p))
  return lerp(0.035, 0.015, dip)
}

/** Key SpotLight intensity (#FFF2E2 top-left): 0→2.5 ramp, hold, −15% in W2.
 *  Round 2: ramp completes by p=0.07 so the graphite shell reads at the B1
 *  capture stop (feedback D-round1 P1-4). */
export function keyIntensityFor(p: number): number {
  const base = 2.5 * smoothstep(0, 0.07, p)
  const w2Dip = 1 - 0.15 * smoothstep(0.85, 0.885, p) * (1 - smoothstep(0.92, 0.96, p))
  return base * w2Dip
}

/** Velvet SpotLight (#FF8A7A): 0→6 over B2, holds through emerge, out by B4. */
export function velvetIntensityFor(p: number): number {
  return 6 * smoothstep(0.1, 0.25, p) * (1 - smoothstep(0.4, 0.55, p))
}

/** Grazing light for the velvet beat: low-angle warm catch, B2–B3 only.
 *  Round 2: 3→3.5 so the velvet/open beat keeps a grazing highlight
 *  (feedback D-round1 P1-4). */
export function grazingIntensityFor(p: number): number {
  return 3.5 * smoothstep(0.1, 0.2, p) * (1 - smoothstep(0.4, 0.6, p))
}

/** Sweep-strip x position: rests left, sweeps across during B3–B5, rests right. */
export function sweepXFor(p: number): number {
  if (p <= 0.25) return -3.5
  if (p >= 0.7) return 3.5
  return lerp(-3.5, 3.5, smoothstep(0.25, 0.7, p))
}

const VOID = '#050607'

// Animated sweep-strip power (verified live: intensity 30 floods the subject
// side-to-side with scroll; production 6 keeps it a gentle softbox pass).
const SWEEP_INTENSITY = 6

interface SceneStageProps {
  /** Defaults to Lane B's shared filmProgress (production wiring). */
  progress?: StageProgress
}

export function SceneStage({ progress = filmProgress }: SceneStageProps) {
  const keyRef = useRef<THREE.SpotLight>(null)
  const velvetRef = useRef<THREE.SpotLight>(null)
  const grazingRef = useRef<THREE.SpotLight>(null)
  const sweepRef = useRef<THREE.Group>(null)

  const p0 = clamp01(readStageProgress(progress))

  const keyTarget = useMemo(() => new THREE.Object3D(), [])
  const velvetTarget = useMemo(() => new THREE.Object3D(), [])

  useFrame(() => {
    const p = clamp01(readStageProgress(progress))
    if (keyRef.current) keyRef.current.intensity = keyIntensityFor(p)
    if (velvetRef.current) velvetRef.current.intensity = velvetIntensityFor(p)
    if (grazingRef.current) grazingRef.current.intensity = grazingIntensityFor(p)
    if (sweepRef.current) sweepRef.current.position.x = sweepXFor(p)
  })

  return (
    <group>
      <color attach="background" args={[VOID]} />
      {/* Initial fog state only — CameraRig/sampleCamera owns density at runtime. */}
      <fogExp2 attach="fog" args={[VOID, fogDensityFor(p0)]} />

      {/* Base IBL: Lane D studio HDRI (Poly Haven Studio Small 08, CC0) mixed
          with dark-field Lightformer strips per §7.3. Strips sit behind/side
          so lens edges and case edges catch rim glow (brief §6b). frames is
          live (Infinity, 256px) so the sweep strip below animates with
          scroll; step-15 perf pass may gate it outside B3–B5. */}
      <Environment files="/env/studio_small_08_1k.hdr" resolution={256} frames={Infinity}>
        {/* Static dark-field strips (round 2: key-side strip 4→4.5 for a
            readable graphite silhouette at the B1 stop, feedback P1-4) */}
        <Lightformer form="rect" intensity={4.5} color="#E8F0FF" scale={[4, 1.2]} position={[3, 2, -2]} />
        <Lightformer form="rect" intensity={3} color="#E8F0FF" scale={[3, 1]} position={[-3, 1.5, -1]} />
        <Lightformer form="rect" intensity={1.2} color="#7a1420" scale={[1.2, 0.5]} position={[0, 0.5, 2]} />
        {/* Animated sweep strip: travels with scroll across B3–B5 so a
            softbox reflection sweeps across the lens (brief §6b). */}
        <group ref={sweepRef} position={[-3.5, 1.2, -1.5]}>
          <Lightformer form="rect" intensity={SWEEP_INTENSITY} color="#E8F0FF" scale={[2.2, 0.7]} />
        </group>
      </Environment>

      {/* Key: warm-white spot, top-left (−30°/+40°), ramps with B1. */}
      <primitive object={keyTarget} position={[0, 0.01, 0]} />
      <spotLight
        ref={keyRef}
        color="#FFF2E2"
        intensity={0}
        position={[-1.2, 1.6, 1.0]}
        angle={0.5}
        penumbra={0.8}
        decay={1.2}
        distance={8}
        target={keyTarget}
      />
      {/* Fill: cool hemisphere so shadows stay graphite, never void-flat. */}
      <hemisphereLight args={['#1A1D24', VOID, 0.25]} />
      {/* Velvet ramp: warms the oxblood lining as the flap opens (B2). */}
      <primitive object={velvetTarget} position={[0, -0.02, -0.1]} />
      <spotLight
        ref={velvetRef}
        color="#FF8A7A"
        intensity={0}
        position={[0.4, 0.35, 0.9]}
        angle={0.6}
        penumbra={1}
        decay={1.4}
        distance={6}
        target={velvetTarget}
      />
      {/* Grazing light: low-angle catch across velvet pile (B2–B3). */}
      <spotLight
        ref={grazingRef}
        color="#FFE9D6"
        intensity={0}
        position={[1.5, 0.15, 0.8]}
        angle={0.4}
        penumbra={0.9}
        decay={1.2}
        distance={6}
      />
      {/* Grounding: soft contact shadow pool under the hero (Lane C models). */}
      <ContactShadows position={[0, -0.09, 0]} opacity={0.65} blur={2.2} scale={1.4} far={0.6} resolution={256} color="#000000" />
    </group>
  )
}

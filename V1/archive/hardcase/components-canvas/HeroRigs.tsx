// EyeQ Vision Care — hero-rig adapters (Lane B integration, round 2).
// Unifies the parallel conductor: `src/canvas/*` rigs (Lane C) take a
// lane-local `progress` prop, so these thin wrappers — owned by Lane B, living
// in Lane B files — remap the ONE master progress (`motion/*` filmProgress,
// the sole 3D input per PLAN-MASTER §6) onto them. Lane C/D files are never
// edited here; adaptation happens exclusively in this file.
//
// Remap (docs/phase4/requests/C-conductor-remap.md, binding):
//   master B2 (p 0.10–0.25)      → CaseRig    q 0–1 (reveal + 40° baked keys)
//   master B3–B4 (p 0.25–0.55)   → GlassesRig q 0–0.7 (fade, rise folded,
//                                  unfold in open air, settle by end of B4)
//   master B5 (p 0.55–0.70)      → GlassesRig q 0.7–1.0 (hover/idle tail)
//   master B6+ (p ≥ 0.70)        → settled (q 1) + B6 right-third drift
// The rigs' internal sequencing (rise-before-unfold clearance, stagger,
// overshoot) is preserved exactly — only the master placement is mapped.
// Pure functions of p: scrub-reversible, reload-at-depth safe.
//
// LensAnchorReporter publishes the REAL right-lens world position to
// `motion/chapters` per frame (CameraRig B8–B9 rails onto the live anchor).

/* eslint-disable react-refresh/only-export-components -- integration module:
 * components + pure remap helpers share this file by design (cf. Lane C). */
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { CaseRig } from '../../canvas/CaseRig'
import { GlassesRig } from '../../canvas/GlassesRig'
import { STAND_IN_LENS_ANCHOR, setLensAnchor } from '../../motion/chapters'
import { filmProgress, subscribeFilmProgress } from '../../motion/progress'

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function smoothstep(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Master p → CaseRig lane-local q (B2 window; closed before, settled after). */
export function caseQFor(pRaw: number): number {
  return clamp01((clamp01(pRaw) - 0.1) / 0.15)
}

/**
 * Master p → GlassesRig lane-local q.
 *
 * DEVIATION from the suggested `B3–B4 → q 0–0.7` (see INTEGRATION.md §B):
 * that map lands the fade at master ≈0.38–0.41, leaving all of B3 an empty
 * case and pushing unfold onto the B3/B4 boundary — the 04-emerge stop shows
 * nothing emerging. This map instead places the rig's local windows onto the
 * beat labels: fade (local 0.30–0.38) → early B3, rise (0.25–0.40) → B3,
 * unfold (0.40–0.55) → B3-late/B4, hover tail (0.70–0.90) → B4-late, settled
 * hero for B5+. Internal sequencing (rise-completes-when-unfold-starts
 * clearance) is untouched — the map is monotonic in local-q space, so the
 * geometric proof holds. q starts at 0.28 (past the invisible dead zone;
 * opacity is still 0 there, so the step is never seen).
 */
export function glassesQFor(pRaw: number): number {
  const p = clamp01(pRaw)
  if (p <= 0.25) return 0
  if (p <= 0.55) return Math.min(1, 0.28 + 2.4 * (p - 0.25))
  return 1
}

/**
 * B6 lateral drift (metres, +x = screen-right-third): eases in over the Wave 1
 * window so the constellation owns the centre, eases out before the B8 rail
 * blend so the portal approach starts from the composed hero spot.
 */
export function glassesDriftFor(pRaw: number): number {
  const p = clamp01(pRaw)
  return 0.18 * smoothstep(0.7, 0.78, p) * (1 - smoothstep(0.85, 0.92, p))
}

/** Re-render on master-progress change (scrub-driven; idle = silent). */
function useFilmP(): number {
  const [p, setP] = useState(filmProgress.p)
  useEffect(
    () =>
      subscribeFilmProgress(() => {
        setP(filmProgress.p)
      }),
    [],
  )
  return p
}

/** CaseRig driven by the master conductor (same parent at origin §5). */
export function CaseRigFilm() {
  const p = useFilmP()
  return <CaseRig progress={caseQFor(p)} />
}

/** GlassesRig driven by the master conductor + B6 drift wrapper. */
export function GlassesRigFilm() {
  const p = useFilmP()
  const drift = glassesDriftFor(p)
  // heroYawDeg 0: lenses face +Z — Lane B aims its own camera (C remap note).
  return (
    <group position={[drift, 0, 0]}>
      <GlassesRig progress={glassesQFor(p)} heroYawDeg={0} />
    </group>
  )
}

const _box = new THREE.Box3()
const _center = new THREE.Vector3()
const _size = new THREE.Vector3()

/**
 * Tracks the real right lens of `G_Lenses` (both lenses = one mesh) and
 * publishes its world position as the portal anchor. Convention: portal lens
 * = lens at +X world (matches the stand-in anchor x +0.048; the stand-up
 * rotation preserves X, so lens-local ±X ≈ world ±X in hero pose). The anchor
 * normal stays the stand-in (≈ +Z, the hero facing) — the B8 approach always
 * arrives from the front. Before the model loads the anchor stays stand-in.
 */
export function LensAnchorReporter() {
  const scene = useThree((s) => s.scene)
  const lensRef = useRef<THREE.Object3D | null>(null)

  useFrame(() => {
    if (!lensRef.current) {
      const found = scene.getObjectByName('G_Lenses')
      if (!found) return
      lensRef.current = found
    }
    const lens = lensRef.current
    _box.setFromObject(lens)
    if (_box.isEmpty()) return
    _box.getCenter(_center)
    _box.getSize(_size)
    // Right-lens centre ≈ bbox centre + quarter-width toward +X.
    _center.x += _size.x * 0.25
    setLensAnchor([_center.x, _center.y, _center.z], [...STAND_IN_LENS_ANCHOR.normal])
  })

  return null
}

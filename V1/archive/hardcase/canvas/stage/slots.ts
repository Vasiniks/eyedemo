// Lane D — sponsor-wave choreography math (PLAN-MASTER §1-C1, §6 B6/B7).
// Pure functions of master progress `p` (0→1 over the dark pin). No three.js
// imports so the curves stay unit-testable and identical for every consumer.
//
// Contract values (verbatim from PLAN-MASTER):
//   W1 eyewear: window 0.70–0.85, spawn z −18…−22m, flight 0.060p,
//     stagger 0.011p, arrival e = 1 − 2^(−10t) baked, 1.1m arc / 100° sweep /
//     −8° tilt / 3 depth layers, tiers front 100% / mid 82% / back 64%,
//     opacities Bone 82–88%, FOV kick +8°, full streaks.
//   W2 insurers: window 0.85–0.92, spawn z −10…−12m, flight 0.045p,
//     stagger 0.008p, 0.7m formation / baseline + scattered row / pitch ×0.8,
//     opacities Bone 68–76%, FOV kick +3°, streaks 30% length / 50% opacity.
// Travel is camera-relative z motion of the plane groups, never scaling.

import { clamp01, lerp, mulberry32, smoothstep } from './math'

export type WaveId = 'w1' | 'w2'

export interface WaveConfig {
  /** Progress where the first logo of the wave starts. */
  start: number
  /** Per-logo flight duration in progress units. */
  flight: number
  /** Stagger between consecutive logos in progress units. */
  stagger: number
  /** Spawn depth range (metres, camera-relative −z). */
  spawnZ: [number, number]
  /** Lateral / vertical spawn scatter half-extents (metres). */
  spawnX: number
  spawnY: number
  /** Seed for deterministic scatter. */
  seed: number
  /** Settled opacity tier per logo index (Bone % of full). */
  opacity: number[]
  /** Streak length factor vs W1 (1 = full, 0.3 = W2). */
  streakLength: number
  /** Streak opacity factor vs W1 (1 = full, 0.5 = W2). */
  streakOpacity: number
  /** FOV kick in degrees at wave peak (harness/camera reference). */
  fovKick: number
}

export const WAVE1: WaveConfig = {
  start: 0.7,
  flight: 0.06,
  stagger: 0.011,
  spawnZ: [-22, -18],
  spawnX: 6,
  spawnY: 3,
  seed: 7,
  opacity: [0.88, 0.86, 0.82, 0.82, 0.82, 0.64, 0.64, 0.64],
  streakLength: 1,
  streakOpacity: 1,
  fovKick: 8,
}

export const WAVE2: WaveConfig = {
  start: 0.85,
  flight: 0.045,
  stagger: 0.008,
  spawnZ: [-12, -10],
  spawnX: 4,
  spawnY: 2,
  seed: 21,
  // Round-2 orchestrator floor (feedback D-round1 P0-3): settled opacity ≥ 0.85.
  // Overrides PLAN-MASTER §1-C1's 68–76% dimmer-tier (kept as the RELATIVE
  // ordering: front-row marks still brightest, back-row dimmest).
  opacity: [0.9, 0.87, 0.88, 0.9, 0.86, 0.88, 0.85, 0.89],
  streakLength: 0.3,
  streakOpacity: 0.5,
  fovKick: 3,
}

export const WAVES: Record<WaveId, WaveConfig> = { w1: WAVE1, w2: WAVE2 }

/** Progress where the last logo of a wave finishes its flight. */
export function settleProgress(wave: WaveId): number {
  const c = WAVES[wave]
  return c.start + 7 * c.stagger + c.flight
}

/** Baked expo arrival curve: e = 1 − 2^(−10t), t ∈ [0,1]. */
export function expoArrival(t: number): number {
  return 1 - Math.pow(2, -10 * clamp01(t))
}

/** Normalised speed 1→0 over a flight (2^(−10t)); drives streaks. */
export function flightSpeed(t: number): number {
  return Math.pow(2, -10 * clamp01(t))
}

export interface Slot {
  /** Settled position (metres). */
  pos: [number, number, number]
  /** Plane size (metres), aspect-preserved fit into the tier box. */
  size: [number, number]
  /** Hover phase for post-settle idle (radians). */
  phase: number
}

interface LayoutCell {
  x: number
  y: number
  z: number
  /** Fit-box the logo aspect-fits into (w × h, metres). */
  box: [number, number]
}

// W1 settled formation (round 2): SPATIAL constellation composed AROUND the
// hero glasses — not a flat grid. Three depth layers with sizes varying by
// depth (front largest, back smallest), arranged so the hero exclusion zone
// x∈[−0.12,+0.20] / y∈[−0.10,+0.12] (glasses hover centre / drift
// right-third, defocused) stays clear: the front pair flanks it left/right at
// hero height, the mid trio arcs ABOVE it, the back trio sits LOW. Right-front
// sits slightly behind the hero plane (z −0.04) so depth separates it from the
// glasses silhouette on screen. Dimensioned for the real film hold — 0.78 m /
// FOV 35 desktop (see requests/D-camera-notes.md) — verified in the harness
// at those exact numbers.
// Order: Maui Jim, Ray-Ban | Prada, Miu Miu, Persol | Oakley, Tiffany, Versace.
const W1_CELLS: LayoutCell[] = [
  { x: -0.29, y: -0.04, z: -0.04, box: [0.18, 0.1] },
  { x: 0.28, y: 0.05, z: -0.04, box: [0.19, 0.105] },
  { x: -0.22, y: 0.2, z: -0.12, box: [0.16, 0.1] },
  { x: 0.01, y: 0.2, z: -0.12, box: [0.21, 0.11] },
  { x: 0.3, y: 0.185, z: -0.12, box: [0.21, 0.11] },
  { x: -0.3, y: -0.145, z: -0.26, box: [0.14, 0.075] },
  { x: 0.01, y: -0.13, z: -0.26, box: [0.15, 0.08] },
  { x: 0.29, y: -0.1, z: -0.26, box: [0.15, 0.08] },
]

// W1 compact (mobile <768px, framed at ≥1.5 m / FOV 44): 2 cols × 4 rows
// cascading front-to-back BELOW the hero band (on mobile the glasses sit
// top-of-frame per PLAN-MASTER §6, copy bottom-sheet). Column pitch 0.21 m
// vs ≤0.17 m boxes leaves real gutters (round-2 finding: 4-col pitch
// overlapped); boxes ≥0.145 m fitted so thin wordmarks stay ≥90px @390.
const W1_CELLS_COMPACT: LayoutCell[] = [
  { x: -0.105, y: 0.1, z: 0, box: [0.17, 0.075] },
  { x: 0.105, y: 0.1, z: 0, box: [0.17, 0.075] },
  { x: -0.105, y: 0.0, z: -0.04, box: [0.17, 0.075] },
  { x: 0.105, y: 0.0, z: -0.04, box: [0.17, 0.075] },
  { x: -0.105, y: -0.1, z: -0.08, box: [0.17, 0.075] },
  { x: 0.105, y: -0.1, z: -0.08, box: [0.17, 0.075] },
  { x: -0.105, y: -0.2, z: -0.12, box: [0.17, 0.075] },
  { x: 0.105, y: -0.2, z: -0.12, box: [0.17, 0.075] },
]

// W2 settled formation (round 2): its own composition — a WIDE, calm 4+4 band
// BEHIND-and-BELOW the glasses at a NEARER depth than W1's mid/back layers
// (z −0.02/−0.05, own rhythm: shorter travel, tighter cadence). Boxes
// 0.155 m wide (≈190px @1440) with opacity ≥0.85 meet the round-1 legibility
// floor (settled cap-height ≥22px @1440). Outer edges stay inside the 0.78 m /
// FOV-35 frame with margin.
// Order: Sun Life, Medavie Blue Cross, Manulife, GreenShield |
//        Canada Life, Desjardins, IA Financial Group, Empire Life.
const W2_CELLS: LayoutCell[] = [
  { x: -0.295, y: -0.19, z: -0.02, box: [0.155, 0.055] },
  { x: -0.098, y: -0.19, z: -0.02, box: [0.155, 0.055] },
  { x: 0.098, y: -0.19, z: -0.02, box: [0.155, 0.055] },
  { x: 0.295, y: -0.19, z: -0.02, box: [0.155, 0.055] },
  { x: -0.295, y: -0.242, z: -0.05, box: [0.155, 0.055] },
  { x: -0.098, y: -0.242, z: -0.05, box: [0.155, 0.055] },
  { x: 0.098, y: -0.242, z: -0.05, box: [0.155, 0.055] },
  { x: 0.295, y: -0.242, z: -0.05, box: [0.155, 0.055] },
]

const W2_CELLS_COMPACT: LayoutCell[] = [
  { x: -0.105, y: -0.3, z: -0.02, box: [0.16, 0.06] },
  { x: 0.105, y: -0.3, z: -0.02, box: [0.16, 0.06] },
  { x: -0.105, y: -0.375, z: -0.02, box: [0.16, 0.06] },
  { x: 0.105, y: -0.375, z: -0.02, box: [0.16, 0.06] },
  { x: -0.105, y: -0.45, z: -0.02, box: [0.16, 0.06] },
  { x: 0.105, y: -0.45, z: -0.02, box: [0.16, 0.06] },
  { x: -0.105, y: -0.525, z: -0.02, box: [0.16, 0.06] },
  { x: 0.105, y: -0.525, z: -0.02, box: [0.16, 0.06] },
]

/** Fit a w/h aspect into a box, preserving aspect. Returns [w, h]. */
export function fitIntoBox(aspect: number, box: [number, number]): [number, number] {
  const h = Math.min(box[1], box[0] / aspect)
  return [h * aspect, h]
}

function arcAndTilt(x: number, y: number, z: number): [number, number, number] {
  // 100°-sweep arc feel: edges fall back with distance from centre.
  const zArc = z - Math.pow(Math.abs(x) / 0.55, 2) * 0.1
  // −8° tilt about the formation centre (yc −0.06, zc −0.15).
  const rad = (-8 * Math.PI) / 180
  const dy = y + 0.06
  const dz = zArc + 0.15
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return [x, -0.06 + dy * cos - dz * sin, -0.15 + dy * sin + dz * cos]
}

/**
 * Settled slots for a wave in logo order. `aspects[i]` is the logo w/h
 * aspect (from the atlas manifest). Compact = mobile flattened layout.
 */
export function computeSlots(wave: WaveId, aspects: number[], compact: boolean): Slot[] {
  const cells =
    wave === 'w1' ? (compact ? W1_CELLS_COMPACT : W1_CELLS) : compact ? W2_CELLS_COMPACT : W2_CELLS
  const rng = mulberry32(wave === 'w1' ? 101 : 202)
  // Tight compact gaps get gentler jitter (±3mm vs ±8mm) so tuned clearances hold.
  const jitter = compact ? 0.006 : 0.016
  return cells.map((cell, i) => {
    const aspect = aspects[i] && aspects[i] > 0 ? aspects[i] : 2
    const size = fitIntoBox(aspect, cell.box)
    const jx = (rng() - 0.5) * jitter
    const jy = (rng() - 0.5) * jitter
    const [ax, ay, az] =
      wave === 'w1' && !compact
        ? arcAndTilt(cell.x + jx, cell.y + jy, cell.z)
        : [cell.x + jx, cell.y + jy, cell.z]
    return { pos: [ax, ay, az], size, phase: rng() * Math.PI * 2 }
  })
}

/** Spawn points (deep −z, seeded scatter) for a wave in logo order. */
export function computeSpawns(wave: WaveId): [number, number, number][] {
  const c = WAVES[wave]
  const rng = mulberry32(c.seed)
  return Array.from({ length: 8 }, () => [
    (rng() - 0.5) * 2 * c.spawnX,
    (rng() - 0.5) * 2 * c.spawnY,
    lerp(c.spawnZ[0], c.spawnZ[1], rng()),
  ])
}

export interface LogoFlightState {
  /** World position (metres), pre-hover. */
  pos: [number, number, number]
  /** Local flight t ∈ [0,1] (0 = not started, 1 = settled). */
  t: number
  /** Normalised speed 1→0; drives streak opacity/length. */
  speed: number
  /** True once the flight finished (hover may apply). */
  settled: boolean
  /** Fade-in 0→1 over the first 10% of flight (no popping at spawn). */
  fade: number
}

/** Approach dip (metres, mid-flight only): in-flight marks swing slightly
 *  UNDER the settled formation so arrivals stream beneath parked logos —
 *  and beneath the hero — instead of plastering over them (round-2 finding
 *  in the p≈0.905 both-waves frame). Zero at both ends (sin window), so
 *  spawn and settle poses are untouched. */
const APPROACH_DIP: Record<WaveId, number> = { w1: 0.08, w2: 0.18 }

/** Position of logo `index` of `wave` at master progress `p`. */
export function logoFlight(
  wave: WaveId,
  index: number,
  p: number,
  spawn: [number, number, number],
  slot: Slot,
): LogoFlightState {
  const c = WAVES[wave]
  const t = clamp01((p - (c.start + index * c.stagger)) / c.flight)
  const e = expoArrival(t)
  const dip = APPROACH_DIP[wave] * Math.sin(Math.PI * t)
  return {
    pos: [
      lerp(spawn[0], slot.pos[0], e),
      lerp(spawn[1], slot.pos[1], e) - dip,
      lerp(spawn[2], slot.pos[2], e),
    ],
    t,
    speed: t >= 1 ? 0 : flightSpeed(t),
    settled: t >= 1,
    fade: smoothstep(0, 0.1, t),
  }
}

/** Post-settle hover: y ±0.006m @ 5s, phased per logo (PLAN-MASTER §6 B6). */
export function hoverOffset(phase: number, timeSec: number): number {
  return 0.006 * Math.sin((2 * Math.PI * timeSec) / 5 + phase)
}

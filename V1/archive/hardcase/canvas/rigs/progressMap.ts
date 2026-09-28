/**
 * Lane C — hero-object progress maps (steps 5, 6).
 *
 * Pure functions of a lane-local progress `q` in [0, 1]. No three.js imports,
 * so the film conductor (Lane B) can reuse them when remapping master progress
 * `p` (PLAN-MASTER §6) onto the rigs:
 *
 *   CaseRig:    master B2 (p 0.10–0.25) -> q 0–1
 *   GlassesRig: master B3–B4 (p 0.25–0.55) -> q 0–1
 *
 * All angles in degrees unless noted. Every map is scrub-reversible
 * (pure function of q — reload-at-depth / reverse / flick reproduce state).
 */

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

/** Smoothstep remap of x in [a, b] to [0, 1]. */
export function smoothstep(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/* ------------------------------------------------------------------ */
/* Case flap (PLAN-MASTER §1-C2: 0°@0 → 32°@0.55 → 43.5°@0.75 (+3.5°)  */
/* → 38.2°@0.87 → 40.0°@1.00, baked elastic keys + tip-lag 10%).       */
/* Lane-local q compresses the B2 window so q=0.5 already shows the    */
/* settled 40° open pose for QA.                                       */
/* ------------------------------------------------------------------ */

/** Flap angle in degrees for lane-local progress q. */
export function caseFlapAngle(q: number): number {
  const c = clamp01(q)
  if (c <= 0.1) return 0
  // 0.10 → 0.35 : 0° → 32° (opening sweep)
  if (c < 0.35) return lerp(0, 32, smoothstep(0.1, 0.35, c))
  // 0.35 → 0.42 : 32° → 42.5° (elastic overshoot past 40°)
  if (c < 0.42) return lerp(32, 42.5, smoothstep(0.35, 0.42, c))
  // 0.42 → 0.50 : 42.5° → 40° (settle)
  if (c < 0.5) return lerp(42.5, 40, smoothstep(0.42, 0.5, c))
  return 40
}

/**
 * Hat-weight interpolation over the 4 absolute-pose morph targets
 * Open10/Open20/Open30/Open40 (PLAN-MASTER §5 ORCHESTRATOR OVERRIDE):
 * w_k = max(0, 1 − |a/10 − k|), k = 1..4. Overshoot past 40 clamps ≥ 0.
 */
export function caseFlapWeights(angleDeg: number): [number, number, number, number] {
  const a = Math.max(0, angleDeg) / 10
  const w = (k: number): number => Math.max(0, 1 - Math.abs(a - k))
  return [w(1), w(2), w(3), w(4)]
}

/** 0 = fully closed/latent … 1 = settled open. Drives the velvet Spot ramp. */
export function caseOpenAmount(q: number): number {
  return smoothstep(0.1, 0.5, q)
}

/* ------------------------------------------------------------------ */
/* Glasses (PLAN-MASTER §6 B3–B4, as-built geometry, round-2 binding).  */
/*                                                                     */
/* The raw export assembles correctly (origins at hinge pivots, arms    */
/* extend local −Z; fold about local Y tucks them across the lens       */
/* backs into a compact 140×42×35mm slab — verified in the Lane-C       */
/* harness against docs/phase4/qa/C/). Strictly sequenced:              */
/*   0.25–0.40  rise folded LYING FLAT: lift 0→+0.16m, tilt 12°→0°      */
/*              (full height by q0.40 — lowest vertex already ≥20mm      */
/*              above the case top before anything unfolds)              */
/*   0.40–0.55  stand up + unfold IN OPEN AIR: wrapper 0→90° about X     */
/*              (cancels G_Root's −90° X seat rotation → lens plane      */
/*              vertical facing +Z, arms pointing −Z away), hero yaw     */
/*              0→ staged value, arm L unfolds then R                    */
/*   0.55+      hero: upright, pitch 0° (never −30°), hover/idle ramps   */
/*              in from 0.70                                            */
/* ------------------------------------------------------------------ */

export const GLASSES_HOVER_LIFT_M = 0.16
export const GLASSES_TILT_DEG = 12
/** Stand-up pitch (degrees about wrapper X): lying flat → upright. */
export const GLASSES_STAND_DEG = 90

export interface GlassesLift {
  /** metres above the seat */
  y: number
  /** degrees: emerge tilt (12→0) + stand-up pitch (0→90) */
  rotX: number
  /** 0→1 hero-yaw staging (rig multiplies by its heroYawDeg) */
  yawAmt: number
  /** 0–1 fade as the slab clears the bowl */
  opacity: number
}

export function glassesLift(q: number): GlassesLift {
  const c = clamp01(q)
  // Rise completes BEFORE the unfold window: full height by q0.40 so the
  // folded slab (bottom ≈ −19mm at seat) already clears the case top
  // (≈ +21mm) by ≫20mm before any arm moves.
  const rise = smoothstep(0.25, 0.4, c)
  const stand = smoothstep(0.4, 0.55, c)
  return {
    y: lerp(0, GLASSES_HOVER_LIFT_M, rise),
    rotX: lerp(GLASSES_TILT_DEG, 0, rise) + GLASSES_STAND_DEG * stand,
    yawAmt: stand,
    // Fade while the slab is still deep in the bowl (seen through the open
    // flap), complete as it clears the rim — the physical thread never pops.
    opacity: smoothstep(0.3, 0.38, c),
  }
}

/**
 * Remaining fold (degrees) for one arm given its local unfold clock t and
 * its folded magnitude (R 90°, L 85° + 4° tilt).
 * Baked keys per plan: mag@0 → 0@0.82, overshoot −7@0.82 → +2.5@0.92
 * → 0@1.00 (overshoot scales with magnitude; sign tuned at call site).
 */
export function armFoldRemainder(t: number, magnitude: number): number {
  const c = clamp01(t)
  if (c <= 0) return magnitude
  if (c < 0.82) {
    // mag → 0 with expo.out-shaped decay (fast start, soft arrival)
    const k = 1 - Math.pow(2, -10 * (c / 0.82))
    const end = 1 - Math.pow(2, -10)
    return magnitude * (1 - k / end)
  }
  const over = magnitude / 85
  if (c < 0.92) {
    // overshoot: 0 → −7·over (first half) → +2.5·over (second half)
    const u = (c - 0.82) / 0.1
    if (u < 0.5) return lerp(0, -7 * over, smoothstep(0, 0.5, u))
    return lerp(-7 * over, 2.5 * over, smoothstep(0.5, 1, u))
  }
  // 0.92 → 1.00 : +2.5·over → 0 settle
  return lerp(2.5 * over, 0, smoothstep(0.92, 1, c))
}

/** Stagger: R runs the same clock slightly delayed (L leads), both settle
 *  open by q0.55 so the hero pose (q≥0.55) always shows straight arms. */
export function glassesFold(q: number): { foldL: number; foldR: number } {
  const c = clamp01(q)
  const tL = clamp01((c - 0.4) / 0.12)
  const tR = clamp01((c - 0.43) / 0.12)
  return { foldL: armFoldRemainder(tL, 85), foldR: armFoldRemainder(tR, 90) }
}

/** 0 until unfold settles, → 1 for the hover/rotate tail. */
export function glassesHoverAmount(q: number): number {
  return smoothstep(0.7, 0.9, q)
}

/** Idle pose offsets (metres / degrees). Bob ±1.5mm @0.4Hz, slow yaw drift. */
export function glassesHover(timeS: number): { bobY: number; yaw: number } {
  return {
    bobY: 0.0015 * Math.sin(timeS * 2 * Math.PI * 0.4),
    yaw: 4 * Math.sin(timeS * 2 * Math.PI * 0.05),
  }
}

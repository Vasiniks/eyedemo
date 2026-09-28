// EyeQ Vision Care — film beat table + camera/look sampling (Lane B, step 3).
// PLAN-MASTER §6 is authoritative. All choreography is a pure function of
// master progress `p` (0→1 over the dark pin) so reload-at-depth, drag, flick,
// reverse and resize-mid-beat reproduce identical state.
//
// Camera spine: MOTION §2 keyframes, dolly distances scaled ×DOLLY_SCALE for the
// as-built 198 mm shell (orchestrator override: ×1.20 vs 165 mm authoring, not
// ×1.26). Fog densities are MOTION's (0.035 base, 0.015 waves dip, 0.030
// approach). Exposure union: 1.0→1.15, portal waypoint 1.35, handoff 2.2.
// Wave-2 FOV kick is +3° (binding §0.1/C1), Wave-1 +8°.

export type BeatId = 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7' | 'B8' | 'B9' | 'W'

export type Vec3 = [number, number, number]

export interface BeatDef {
  id: BeatId
  start: number
  end: number
  /** Desktop dark-pin vh for this beat (1 unit = 8vh). */
  vhDesk: number
  /** Mobile dark-pin vh for this beat (1 unit = 5.6vh). */
  vhMob: number
}

/** Weight basis 10/15/15/15/15/15/7/5/3 = 100 dark units (§6). */
export const BEATS: BeatDef[] = [
  { id: 'B1', start: 0.0, end: 0.1, vhDesk: 80, vhMob: 56 },
  { id: 'B2', start: 0.1, end: 0.25, vhDesk: 120, vhMob: 84 },
  { id: 'B3', start: 0.25, end: 0.4, vhDesk: 120, vhMob: 84 },
  { id: 'B4', start: 0.4, end: 0.55, vhDesk: 120, vhMob: 84 },
  { id: 'B5', start: 0.55, end: 0.7, vhDesk: 120, vhMob: 84 },
  { id: 'B6', start: 0.7, end: 0.85, vhDesk: 120, vhMob: 84 },
  { id: 'B7', start: 0.85, end: 0.92, vhDesk: 56, vhMob: 39 },
  { id: 'B8', start: 0.92, end: 0.97, vhDesk: 40, vhMob: 28 },
  { id: 'B9', start: 0.97, end: 1.0, vhDesk: 24, vhMob: 17 },
]

/** Dark-pin scroll budget in vh (white act is unpinned DOM: 200 desk / 140 mob). */
export const DARK_VH_DESK = 800
export const DARK_VH_MOB = 560
/** Tablet (769–1024px): 800vh total intro ⇒ 640 dark + 160 white (§0.5). */
export const DARK_VH_TABLET = 640

export function beatAt(p: number): BeatId {
  const c = Math.min(1, Math.max(0, p))
  for (const b of BEATS) {
    if (c < b.end || b.id === 'B9') return b.id
  }
  return 'B9'
}

export function darkVhForWidth(width: number): number {
  if (width <= 768) return DARK_VH_MOB
  if (width <= 1024) return DARK_VH_TABLET
  return DARK_VH_DESK
}

export function isMobileWidth(width: number): boolean {
  return width <= 768
}

// ---------------------------------------------------------------------------
// Lens anchor (stand-in until Lane C integrates the real glasses rig).
//
// LENS_ANCHOR is the single source of truth for the portal rail: the world
// position of the right-lens centre + the lens-plane normal. CameraRig B8–B9
// and LensPortal both consume it. Once `glasses.glb` is wired, Lane C's
// GlassesRig overwrites it per frame via `setLensAnchor()` (see
// src/components/canvas/API.md) with the real G_Lenses world transform;
// the stand-in values below are then ignored.
// ---------------------------------------------------------------------------

export interface LensAnchor {
  center: Vec3
  /** Unit vector, glasses-local ≈ (−0.08, 0.02, 0.97) per MOTION §5. */
  normal: Vec3
}

/**
 * Stand-in: glasses hover above the case, right lens at +x. Metres.
 * Integration-measured (LANEC-PROBE @q=1.0 hero pose: G_Lenses bbox centre
 * ≈ (0.003, 0.161, 0.013)): the hero lenses hover at y ≈ 0.16, not 0.08.
 * The live reporter overwrites the centre per frame once models load.
 */
export const STAND_IN_LENS_ANCHOR: LensAnchor = {
  center: [0.03, 0.16, 0.01],
  normal: [-0.0822, 0.0205, 0.9964],
}

const liveAnchor: LensAnchor = {
  center: [...STAND_IN_LENS_ANCHOR.center],
  normal: [...STAND_IN_LENS_ANCHOR.normal],
}

export function getLensAnchor(): LensAnchor {
  return liveAnchor
}

/** Called by GlassesRig (Lane C) once the real G_Lenses transform exists. */
export function setLensAnchor(center: Vec3, normal: Vec3): void {
  liveAnchor.center = [...center]
  liveAnchor.normal = [...normal]
}

// ---------------------------------------------------------------------------
// Camera / look sampling
// ---------------------------------------------------------------------------

export interface CameraSample {
  position: Vec3
  target: Vec3
  fov: number
  /** FogExp2 density (Void-matched). */
  fog: number
  /** Renderer tone-mapping exposure. */
  exposure: number
  near: number
  /** #white-veil opacity (0 until p=0.985, expo.inOut to 1). */
  veil: number
  /** Canvas wrapper opacity (1→0 across B9, 450 ms equiv). */
  canvasOpacity: number
}

interface Key {
  p: number
  pos: Vec3
  tgt: Vec3
  fov: number
  fog: number
  exp: number
  near: number
}

/** Dolly reframe for the as-built 198 mm shell (§0.6 override: ×1.20). */
const K = 1.2

/**
 * Portal rail keys, rebuilt per call from the LIVE lens anchor (integration:
 * `LensAnchorReporter` tracks the real right lens of `G_Lenses`; default =
 * stand-in, so isolated harnesses sample the authored rail unchanged).
 * Straight rail along the lens normal: 0.36 m out → 0.054 m → 0.01 m →
 * 0.04 m behind the lens plane (B8–B9, near 0.01→0.002).
 */
function railKeys(anchor: LensAnchor): { start: Vec3; mid: Vec3; near: Vec3; end: Vec3 } {
  const L = anchor.center
  const nLen = Math.hypot(anchor.normal[0], anchor.normal[1], anchor.normal[2]) || 1
  const N: Vec3 = [anchor.normal[0] / nLen, anchor.normal[1] / nLen, anchor.normal[2] / nLen]
  return {
    start: [L[0] + N[0] * 0.36, L[1] + N[1] * 0.36, L[2] + N[2] * 0.36],
    mid: [L[0] + N[0] * 0.054, L[1] + N[1] * 0.054, L[2] + N[2] * 0.054],
    near: [L[0] + N[0] * 0.01, L[1] + N[1] * 0.01, L[2] + N[2] * 0.01],
    end: [L[0] - N[0] * 0.04, L[1] - N[1] * 0.04, L[2] - N[2] * 0.04],
  }
}

// Wave-beat hold, per Lane D `D-camera-notes.md` (integration reframe):
// all 16 settled planes need ≈1.05 m × 0.62 m at slot depth, so the B6–B7
// hold sits at ≈0.84 m desktop with the look-target near the 16-plane +
// drifted-hero centroid (y −0.02, z −0.10) so the W2 row reads whole.
// B4/B5 are reframed onto the MEASURED hero (LANEC-PROBE: lenses hover at
// y ≈ 0.16 — the authored 0.06–0.07 targets framed empty air above the case).
const WAVE_HOLD_Z = 0.98
const WAVE_HOLD_Y = 0.1
const WAVE_TGT: Vec3 = [0, -0.07, -0.1]

const KEYS_STATIC: Key[] = [
  { p: 0.0, pos: [0.18 * K, 0.1 * K, 0.32 * K], tgt: [0, 0.01, 0], fov: 32, fog: 0.035, exp: 1.0, near: 0.01 },
  { p: 0.1, pos: [0.14 * K, 0.12 * K, 0.29 * K], tgt: [0, 0.012, 0], fov: 33, fog: 0.035, exp: 1.0, near: 0.01 },
  { p: 0.25, pos: [0.12 * K, 0.14 * K, 0.26 * K], tgt: [0, 0.015, 0], fov: 34, fog: 0.035, exp: 1.02, near: 0.01 },
  // B4 unfold: tilt up to the risen hero (unfold completes at full lift).
  { p: 0.4, pos: [-0.17, 0.15, 0.3], tgt: [0, 0.1, 0], fov: 35, fog: 0.035, exp: 1.05, near: 0.01 },
  // B5 slowest orbit: authored swing shape, raised onto the hero lenses.
  { p: 0.475, pos: [0, 0.21, 0.3], tgt: [0, 0.11, 0], fov: 35, fog: 0.035, exp: 1.05, near: 0.01 },
  { p: 0.55, pos: [0.17, 0.15, 0.3], tgt: [0, 0.11, 0], fov: 35, fog: 0.035, exp: 1.05, near: 0.01 },
  { p: 0.7, pos: [0, WAVE_HOLD_Y, WAVE_HOLD_Z], tgt: [...WAVE_TGT], fov: 35, fog: 0.035, exp: 1.05, near: 0.01 },
  // B6 Wave 1: FOV kick +8°, fog dip 0.015.
  { p: 0.775, pos: [0, WAVE_HOLD_Y, WAVE_HOLD_Z - 0.02], tgt: [...WAVE_TGT], fov: 43, fog: 0.015, exp: 1.1, near: 0.01 },
  { p: 0.85, pos: [0, WAVE_HOLD_Y, WAVE_HOLD_Z - 0.02], tgt: [...WAVE_TGT], fov: 35, fog: 0.022, exp: 1.15, near: 0.01 },
  // B7 Wave 2: FOV kick +3° (binding, not +7°), shorter window.
  { p: 0.878, pos: [0, WAVE_HOLD_Y, WAVE_HOLD_Z - 0.02], tgt: [...WAVE_TGT], fov: 38, fog: 0.018, exp: 1.15, near: 0.01 },
  // B8 approach: hold, blend onto the lens-normal rail, dolly to 0.054 m.
  { p: 0.92, pos: [0, WAVE_HOLD_Y, WAVE_HOLD_Z - 0.02], tgt: [...WAVE_TGT], fov: 35, fog: 0.03, exp: 1.15, near: 0.01 },
]

function smoothstepLocal(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}

/** expo.inOut (portal veil shaping — evaluated, never tweened). */
export function expoInOut(t: number): number {
  const c = Math.min(1, Math.max(0, t))
  if (c === 0) return 0
  if (c === 1) return 1
  if (c < 0.5) return Math.pow(2, 20 * c - 10) / 2
  return (2 - Math.pow(2, -20 * c + 10)) / 2
}

export function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v))
}

/**
 * Pure function of (p, mobile): identical scroll position recreates identical
 * state forward, backward, after jumps and reloads (§6).
 */
export function sampleCamera(pRaw: number, mobile: boolean): CameraSample {
  const p = clamp01(pRaw)
  // Full key table per call: static spine + live-anchor portal rail (B8–B9).
  // The rail recentres onto the real right lens once `LensAnchorReporter`
  // publishes it; isolated harnesses (stand-in anchor) sample the authored
  // rail bit-identically.
  const anchor = getLensAnchor()
  const rail = railKeys(anchor)
  const L = anchor.center
  const KEYS: Key[] = [
    ...KEYS_STATIC,
    { p: 0.928, pos: rail.start, tgt: [...L], fov: 36, fog: 0.03, exp: 1.2, near: 0.008 },
    { p: 0.97, pos: rail.mid, tgt: [...L], fov: 48, fog: 0.03, exp: 1.35, near: 0.002 },
    // B9 entry: near-plane crosses under the veil; FOV stretch then settle.
    { p: 0.985, pos: rail.near, tgt: [...L], fov: 68, fog: 0.03, exp: 1.8, near: 0.002 },
    { p: 1.0, pos: rail.end, tgt: [...L], fov: 55, fog: 0.0, exp: 2.2, near: 0.002 },
  ]
  let i = 0
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const span = Math.max(1e-6, b.p - a.p)
  const t = clamp01((p - a.p) / span)

  let position = lerp3(a.pos, b.pos, t)
  let target = lerp3(a.tgt, b.tgt, t)
  const fovBase = lerp(a.fov, b.fov, t)

  if (mobile) {
    // Pullback ×1.45 on radius + FOV +9° (§6 mobile overrides). During the
    // wave beats the pullback eases to ×2.0 (≈1.94 m hold): the desktop
    // 1.0 m W1 arc still applies at the 768px tablet width (Lane D compacts
    // only below 768), so the frame needs the extra margin (D-camera-notes
    // §2–§3). Blended over 0.03p each side so scrubbing never pops. The
    // look-target dips 0.07 m with the same window so the compact W2 rows
    // ride above the bottom-sheet captions.
    const waveBoost = smoothstepLocal(0.65, 0.7, p) * (1 - smoothstepLocal(0.92, 0.95, p))
    const pull = 1.45 + 0.35 * waveBoost
    const dx = (position[0] - target[0]) * pull
    const dz = (position[2] - target[2]) * pull
    position = [target[0] + dx, position[1], target[2] + dz]
    target = [target[0], target[1] - 0.07 * waveBoost, target[2]]
  }

  const veilT = clamp01((p - 0.985) / 0.015)
  return {
    position,
    target,
    fov: fovBase + (mobile ? 9 : 0),
    fog: lerp(a.fog, b.fog, t),
    exposure: lerp(a.exp, b.exp, t),
    near: lerp(a.near, b.near, t),
    veil: expoInOut(veilT),
    canvasOpacity: 1 - clamp01((p - 0.97) / 0.03),
  }
}

// ---------------------------------------------------------------------------
// Lens material ramp (B8–B9): native MeshPhysicalMaterial params, pure fn of p.
// ---------------------------------------------------------------------------

export interface PortalSample {
  transmission: number
  roughness: number
  ior: number
  thickness: number
  /** Stand-in edge-fire 0..1 (real rig: fresnel uApproach → rim 0.5→3.0). */
  edgeFire: number
  /** Bloom driver 0.15→0.6→1.4. */
  bloom: number
  bloomThreshold: number
  bloomRadius: number
}

export function samplePortal(pRaw: number): PortalSample {
  const p = clamp01(pRaw)
  const approach = clamp01((p - 0.92) / 0.05) // 0→1 across B8
  const entry = clamp01((p - 0.97) / 0.03) // 0→1 across B9
  return {
    transmission: 0.9 * approach,
    roughness: lerp(0.12, 0.05, approach),
    ior: lerp(1.1, 1.45, approach),
    thickness: lerp(0.002, 1.0, approach),
    edgeFire: clamp01(0.15 + 0.85 * approach),
    bloom: lerp(lerp(0.15, 0.6, approach), 1.4, entry),
    bloomThreshold: lerp(lerp(0.85, 0.6, approach), 0.6, entry),
    bloomRadius: lerp(0.4, 0.7, entry),
  }
}

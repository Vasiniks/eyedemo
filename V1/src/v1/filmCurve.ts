// V1 CURVE — scroll→film "punch" curve for the FINAL Blender film.
//
// The FINAL film renders into `public/v1film/` (JPEG 1512×860, 308 files
// 0001–0308) with manifest
// {"count":308,"width":1512,"height":860,"pad":4,"ext":"jpg",
//  "sourceFrames":615,"step":2}: file i ↔ source frame 1+(i-1)*2.
// Old frames stay until replaced; everything here derives from the manifest,
// so both cuts work (if sourceFrames is missing we assume 480).
//
// Motion language (PLAN-MASTER §8): expo.out entrances, power2.inOut scrubs,
// linear loops; transforms/opacity only. The curve itself is evaluated inside
// the scrubbed rAF draw (scroll IS timing), so per-segment easings shape the
// *pacing* of the film: short holds freeze the highlight end-frames while the
// snap nudge handles emphasis, the take-out runs linear/smooth, and the
// motion beats (expand/spin/burst/ring/sweep/zoom) punch gently
// (slow in, fast middle, soft landing).
//
// V3-SCROLL — uniform sensitivity: every motion beat's scroll share is
// proportional to its source-frame count, so the visual change per 100 px of
// scroll is ~constant across beats (average frames/100px within ±35%; holds
// excluded — they are frozen frames by design). Scroll shares are normalised
// so the table below can be re-tuned freely — only relative weights matter.
//
// Guarantees: monotonic non-decreasing, continuous (eased(0)=0, eased(1)=1 per
// segment, segments share endpoints), no jumps. Scroll shares are normalised
// so the table below can be re-tuned freely — only relative weights matter.

export type FilmEaseName = 'linear' | 'power2.inOut' | 'power3.inOut' | 'expo.inOut';

export interface BeatRow {
  /** Beat id (holds reference the frozen source frame, s0 === s1). */
  name: string;
  /** Source-frame range (inclusive start, continuous chain with neighbours). */
  s0: number;
  s1: number;
  /** Share of scroll length. Relative weights — normalised to sum 1. */
  scroll: number;
  /** Pacing inside this beat. */
  ease: FilmEaseName;
}

// ── TUNABLE TABLE ─────────────────────────────────────────────────────────
// Source-frame beat map (FINAL film, 615 src frames @24fps, JPEG 1512×860):
//  1–30   bird's-eye on the EyeQ logo on the red velvet sleeve (grey studio)
//  30–70  tilt down to 3/4
//  70–145 glasses slide out of the sleeve (SMOOTH)
//  145–215 glasses pull far away from the sleeve (sleeve leaves ~178),
//         rise, turn upright, unfold
//  215–235 hero hold
//  235–325 spin with tilt + barrel roll
//  325–350 eight tinted duplicates burst out
//  350–386 tinted ring spins around the hero (camera looks down)
//  386–411 ring collapses back
//  411–470 camera sweep
//  470–545 zoom into the right lens
//  533–560 through the lens to paper white (overlaps the zoom tail: the
//    frames carry both, so ZOOM owns 470–533 and DISSOLVE owns 533–560)
//  560–615 end card (logo + store info in the film)
// Gaps 215–235 is the hero soft-landing/hold (HERO_HOLD). Zero-length holds
// (SPIN_HOLD @325, SWEEP_HOLD @470) freeze highlight end-frames briefly.
// Ring (325–411) gets a smooth linear ride so it breathes — overlays stay
// clear there (see BrandWaves / FilmCaptions).
export const SOURCE_TOTAL = 615;

export const BEAT_TABLE: BeatRow[] = [
  { name: 'birdseye',      s0: 1,   s1: 30,  scroll: 0.047, ease: 'linear' },
  { name: 'tilt',          s0: 30,  s1: 70,  scroll: 0.064, ease: 'power2.inOut' },
  { name: 'takeout',       s0: 70,  s1: 145, scroll: 0.120, ease: 'linear' },
  { name: 'expand',        s0: 145, s1: 215, scroll: 0.112, ease: 'power2.inOut' },
  { name: 'heroHold',      s0: 215, s1: 235, scroll: 0.030, ease: 'linear' },
  { name: 'spin',          s0: 235, s1: 325, scroll: 0.144, ease: 'power3.inOut' },
  { name: 'spinHold',      s0: 325, s1: 325, scroll: 0.010, ease: 'linear' },
  { name: 'burst',         s0: 325, s1: 350, scroll: 0.040, ease: 'expo.inOut' },
  { name: 'ring',          s0: 350, s1: 386, scroll: 0.058, ease: 'linear' },
  { name: 'collapse',      s0: 386, s1: 411, scroll: 0.040, ease: 'power3.inOut' },
  { name: 'sweep',         s0: 411, s1: 470, scroll: 0.095, ease: 'power3.inOut' },
  { name: 'sweepHold',     s0: 470, s1: 470, scroll: 0.008, ease: 'linear' },
  { name: 'zoom',          s0: 470, s1: 533, scroll: 0.101, ease: 'expo.inOut' },
  { name: 'dissolve',      s0: 533, s1: 560, scroll: 0.043, ease: 'power2.inOut' },
  { name: 'endcard',       s0: 560, s1: 615, scroll: 0.088, ease: 'linear' },
];

// ── Easing (all f(0)=0, f(1)=1, monotonic increasing) ─────────────────────
const EASES: Record<FilmEaseName, (t: number) => number> = {
  linear: (t) => t,
  'power2.inOut': (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  'power3.inOut': (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  'expo.inOut': (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
};

export function applyFilmEase(name: FilmEaseName, t: number): number {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return EASES[name](c);
}

// ── Manifest-derived film space ───────────────────────────────────────────
export interface FilmManifest {
  count: number;
  sourceFrames?: number;
  step?: number;
}

/** Assumed source length when the manifest predates the re-render. */
export const LEGACY_SOURCE_FRAMES = 480;

export interface FilmSpace {
  count: number;
  sourceFrames: number;
  step: number;
}

export function resolveFilmSpace(m: FilmManifest): FilmSpace {
  const count = Math.max(1, Math.floor(m.count));
  const sourceFrames = Math.max(2, Math.floor(m.sourceFrames ?? LEGACY_SOURCE_FRAMES));
  const step =
    m.step && m.step > 0
      ? m.step
      : count > 1
        ? (sourceFrames - 1) / (count - 1)
        : 1;
  return { count, sourceFrames, step };
}

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Source frame (1-based) → rendered-film progress 0..1. */
export function sourceToFilm(source: number, space: FilmSpace): number {
  return clamp01((source - 1) / (space.sourceFrames - 1));
}

/** Rendered-film progress 0..1 → source frame (1-based, fractional). */
export function filmToSource(film: number, space: FilmSpace): number {
  return 1 + clamp01(film) * (space.sourceFrames - 1);
}

// ── Segments (scroll share → film range, per manifest) ────────────────────
export interface CurveSegment {
  name: string;
  ease: FilmEaseName;
  film0: number;
  film1: number;
  scroll0: number;
  scroll1: number;
}

export function buildSegments(space: FilmSpace): CurveSegment[] {
  const total = BEAT_TABLE.reduce((a, b) => a + Math.max(0, b.scroll), 0) || 1;
  const segs: CurveSegment[] = [];
  let scroll = 0;
  for (const row of BEAT_TABLE) {
    const share = Math.max(0, row.scroll) / total;
    const seg: CurveSegment = {
      name: row.name,
      ease: row.ease,
      film0: sourceToFilm(row.s0, space),
      film1: sourceToFilm(row.s1, space),
      scroll0: scroll,
      scroll1: scroll + share,
    };
    segs.push(seg);
    scroll += share;
  }
  // Pin the tail exactly to 1 so shares that don't sum cleanly can't drift.
  if (segs.length > 0) segs[segs.length - 1].scroll1 = 1;
  return segs;
}

/** Scroll progress 0..1 (pin) → film progress 0..1 (rendered frames). */
export function scrollToFilm(scrollP: number, manifest: FilmManifest): number {
  const space = resolveFilmSpace(manifest);
  const segs = buildSegments(space);
  const s = clamp01(scrollP);
  for (const seg of segs) {
    if (s <= seg.scroll1 || seg === segs[segs.length - 1]) {
      const span = seg.scroll1 - seg.scroll0;
      const t = span <= 0 ? 1 : (s - seg.scroll0) / span;
      const e = applyFilmEase(seg.ease, clamp01(t));
      return seg.film0 + (seg.film1 - seg.film0) * e;
    }
  }
  return 1;
}

/**
 * Inverse: film progress → scroll progress (bisection per segment; easings
 * are monotonic so 24 iterations land < 1e-7). Holds (film0===film1) resolve
 * to the hold start. Used for QA + chapter ticks, never per-frame.
 */
export function filmToScroll(filmP: number, manifest: FilmManifest): number {
  const space = resolveFilmSpace(manifest);
  const segs = buildSegments(space);
  const f = clamp01(filmP);
  for (const seg of segs) {
    const lo = Math.min(seg.film0, seg.film1);
    const hi = Math.max(seg.film0, seg.film1);
    if (f >= lo - 1e-9 && f <= hi + 1e-9) {
      if (hi - lo < 1e-12) return seg.scroll0;
      const target = (f - seg.film0) / (seg.film1 - seg.film0);
      let a = 0;
      let b = 1;
      for (let i = 0; i < 24; i++) {
        const m = (a + b) / 2;
        if (applyFilmEase(seg.ease, m) < target) a = m;
        else b = m;
      }
      const span = seg.scroll1 - seg.scroll0;
      return seg.scroll0 + ((a + b) / 2) * span;
    }
  }
  return f <= 0 ? 0 : 1;
}

/** Beat id owning a source frame (canonical table; holds report their name). */
export function beatAtSource(source: number): string {
  for (let i = BEAT_TABLE.length - 1; i >= 0; i--) {
    if (source >= BEAT_TABLE[i].s0) return BEAT_TABLE[i].name;
  }
  return BEAT_TABLE[0].name;
}

// ── Canonical overlay marks (film fractions for the 615-frame cut) ────────
// Overlays are pure functions of film progress p, so they bind to these
// canonical marks derived from the tunable table — no per-manifest async.
// On the legacy cut the same fractions land at sensible mid-film positions.
const CANONICAL: FilmSpace = {
  count: 308,
  sourceFrames: SOURCE_TOTAL,
  step: 2,
};

function beatFilmRange(name: string): [number, number] {
  const row = BEAT_TABLE.find((b) => b.name === name);
  if (!row) return [0, 0];
  return [sourceToFilm(row.s0, CANONICAL), sourceToFilm(row.s1, CANONICAL)];
}

const R = (name: string): [number, number] => beatFilmRange(name);

export const OVERLAY_MARKS = {
  birdseyeEnd: R('birdseye')[1],
  takeoutStart: R('takeout')[0],
  expandStart: R('expand')[0],
  expandEnd: R('expand')[1],
  heroHoldEnd: R('heroHold')[1],
  spinStart: R('spin')[0],
  spinEnd: R('spin')[1],
  // Legacy aliases (pre-final cut named the spin "rotate").
  rotateStart: R('spin')[0],
  rotateEnd: R('spin')[1],
  burstStart: R('burst')[0],
  ringStart: R('ring')[0],
  ringEnd: R('ring')[1],
  collapseEnd: R('collapse')[1],
  sweepStart: R('sweep')[0],
  sweepEnd: R('sweep')[1],
  zoomStart: R('zoom')[0],
  dissolveStart: R('dissolve')[0],
  endcardStart: R('endcard')[0],
} as const;

/** Ordinal rail ticks (film fractions, no labels) for the progress rail. */
export const CHAPTER_TICKS: readonly number[] = [
  0,
  OVERLAY_MARKS.takeoutStart,
  OVERLAY_MARKS.expandStart,
  OVERLAY_MARKS.spinStart,
  OVERLAY_MARKS.burstStart,
  OVERLAY_MARKS.ringStart,
  OVERLAY_MARKS.sweepStart,
  OVERLAY_MARKS.zoomStart,
  OVERLAY_MARKS.endcardStart,
  1,
];

/** Dev/QA helper: sample the curve (monotonicity spot-check, never per-frame). */
export function sampleCurve(manifest: FilmManifest, n = 65): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const s = i / (n - 1);
    out.push([s, scrollToFilm(s, manifest)]);
  }
  return out;
}

// ── MAGNET — key poses → scroll map for the magnetic snap ───────────────
// V2 film: 3588 output frames = 615 source frames × (140/24).
// Output frame i ↔ source frame s = 1 + (i−1)·24/140.
// Magnet targets (source frames) — 18 clean, well-composed moments across
// the whole film: 1 (logo bird's-eye), 30 (tilt end), 70 (3/4), 110 (mid
// take-out), 145 (out of sleeve), 180 (rise/unfold), 215 (hero), 250 (spin
// early), 280 (spin peak), 310 (spin late), 340 (burst), 368 (ring), 395
// (collapse), 430 (sweep mid), 460 (sweep end), 500 (lens), 545 (dissolve),
// 600 (end card). Scroll positions derive from the curve above so snap and
// pacing share one source of truth.
export const V2_FILM_MANIFEST: FilmManifest = { count: 3588, sourceFrames: 615 };

export const SNAP_SOURCE_KEYS: readonly number[] = [
  1, 30, 70, 110, 145, 180, 215, 250, 280, 310, 340, 368, 395, 430, 460, 500, 545, 600,
];

/** Key SOURCE frame → pin-scroll progress 0..1 (through the punch curve). */
export function snapSourceToScroll(source: number): number {
  return filmToScroll(sourceToFilm(source, resolveFilmSpace(V2_FILM_MANIFEST)), V2_FILM_MANIFEST);
}

/** Pin-scroll progress of every snap key, ascending. */
export function snapKeyScrolls(): number[] {
  return SNAP_SOURCE_KEYS.map(snapSourceToScroll);
}

/**
 * Capture window for key `i` (scroll-fraction units): ≈¼ of the gap to the
 * nearest neighbouring key.
 * MAGNET: no longer used by the idle snap (which always glides to a key —
 * no capture window). Kept for compat / QA tooling.
 */
export function snapCaptureWindow(i: number): number {
  const keys = snapKeyScrolls();
  const k = keys[i];
  const gaps: number[] = [];
  if (i > 0) gaps.push(k - keys[i - 1]);
  if (i < keys.length - 1) gaps.push(keys[i + 1] - k);
  const nearest = Math.min(...gaps);
  return nearest / 4;
}

/** MAGNET pull half-width as a fraction of the nearest-neighbour gap. */
export const MAGNET_WINDOW_FRACTION = 0.06;

/**
 * Magnetic-pull window for key `i` (scroll-fraction units): ±6% of the gap
 * to the nearest neighbouring key (MAGNET §3). Inside this window Lenis
 * softens input slightly so poses feel "sticky". Distinct from the legacy
 * wider capture window above, which the idle snap no longer consults.
 */
export function snapMagnetWindow(i: number): number {
  const keys = snapKeyScrolls();
  const k = keys[i];
  const gaps: number[] = [];
  if (i > 0) gaps.push(k - keys[i - 1]);
  if (i < keys.length - 1) gaps.push(keys[i + 1] - k);
  const nearest = Math.min(...gaps);
  return nearest * MAGNET_WINDOW_FRACTION;
}

/** Scroll direction for the direction-aware magnet target. */
export type MagnetDirection = 1 | 0 | -1;

/**
 * MAGNET target: which key index to glide to from scroll progress `p`.
 * No capture window — a target is ALWAYS returned.
 * Direction-aware (§2): between key[i] and key[i+1] with frac = share of the
 * gap covered, forward motion (dir=1) commits to the next pose past 35% of
 * the gap, backward motion (dir=-1) holds the previous pose until 65%
 * (mirror), and unknown direction (dir=0) picks the nearest key.
 */
export function snapMagnetTarget(p: number, dir: MagnetDirection = 0): number {
  const keys = snapKeyScrolls();
  if (keys.length === 0) return 0;
  if (p <= keys[0]) return 0;
  if (p >= keys[keys.length - 1]) return keys.length - 1;
  let seg = 0;
  while (seg < keys.length - 2 && p > keys[seg + 1]) seg++;
  const a = keys[seg];
  const b = keys[seg + 1];
  const span = b - a;
  const frac = span <= 0 ? 1 : (p - a) / span;
  if (dir > 0) return frac > 0.35 ? seg + 1 : seg;
  if (dir < 0) return frac < 0.65 ? seg : seg + 1;
  let best = seg;
  let bestDist = Math.abs(p - keys[seg]);
  const dNext = Math.abs(p - keys[seg + 1]);
  if (dNext < bestDist) {
    bestDist = dNext;
    best = seg + 1;
  }
  return best;
}

/**
 * Gate window for key `i` (scroll-fraction units): ±⅛ of the gap to the
 * nearest neighbouring key (V3-SCROLL gates).
 * MAGNET: superseded by snapMagnetWindow (±6% gap). Kept for compat.
 */
export function snapGateWindow(i: number): number {
  const keys = snapKeyScrolls();
  const k = keys[i];
  const gaps: number[] = [];
  if (i > 0) gaps.push(k - keys[i - 1]);
  if (i < keys.length - 1) gaps.push(keys[i + 1] - k);
  const nearest = Math.min(...gaps);
  return nearest / 8;
}

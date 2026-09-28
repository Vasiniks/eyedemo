// V2-WORDS — side-panel copy for the FINAL film (615 source frames).
//
// STATS are real data, verbatim from docs/research/B-content-inventory.md:
// reviews B §7 (`4.9` `(208 reviews)`), lens names B §4 (7, ®/™ intact),
// brand count = 8 live-site logos B §9 (count only, logos carry the marks),
// insurance heading B §5 verbatim (`We Accept Most Major Insurance Plans`).
// CATCHPHRASES are client-requested DRAFTs (draft:true) — also appended to
// docs/phase4/COPY-DRAFTS.md under "Client-requested catchphrases
// (awaiting approval)". Brief §6d: DRAFT lines stay in data but are NOT
// rendered unless SHOW_DRAFT_COPY is set (VITE_SHOW_DRAFT_COPY=true).
//
// Beat / framing map (subject side ⇒ EMPTY side for words):
//   1–30    centre (logo on sleeve)            → none (keep clear)
//   30–145  subject RIGHT (tilt, slide out)    → LEFT  (reviews stat)
//   145–215 subject → LEFT (pull away, unfold) → RIGHT (7 Essilor lenses)
//   215–325 subject LEFT (hero hold, spin)     → RIGHT (short header only;
//                                                lower half free for WAVES)
//   325–411 centre (tinted ring)               → none (keep the ring clean)
//   411–470 subject RIGHT (camera sweep)       → LEFT  (insurance header)
//   ≥470    centre (lens dive, white, endcard) → none
// Panels live INSIDE the empty side's outer ~36% (6% safe margin from the
// edge), vertically centred on the empty area (headers dock above their
// logo constellation), and exit before the side flips.
// Motion language: expo.out entrances, transforms/opacity only, masked-line
// reveals (yPercent 110→0), tabular numerals for count-ups.

export type Side = 'left' | 'right';

/** Source frame (1-based) → film fraction on the canonical 615-frame cut. */
const F = (s: number): number => (s - 1) / 614;

export type PanelId = 'reviews' | 'lenses' | 'brands' | 'insurers';

export interface SidePanelDef {
  id: PanelId;
  side: Side;
  /** Film-progress window [p0, p1]; panel exits before the side flips. */
  p0: number;
  p1: number;
  /** Dock above the logo constellation (upper area) instead of centring. */
  dockTop: boolean;
  /** Index into CATCHPHRASES (DRAFT — rendered only when SHOW_DRAFT_COPY). */
  catchphrase: number;
}

export const SIDE_PANELS: readonly SidePanelDef[] = [
  // LEFT: reviews stat while the glasses slide out on the right.
  { id: 'reviews', side: 'left', p0: F(34), p1: F(143), dockTop: false, catchphrase: 0 },
  // RIGHT: the 7 Essilor lens names once the subject swings left.
  { id: 'lenses', side: 'right', p0: F(148), p1: F(213), dockTop: false, catchphrase: 1 },
  // RIGHT: short header above the brand constellation (lower half free).
  { id: 'brands', side: 'right', p0: F(218), p1: F(323), dockTop: true, catchphrase: 2 },
  // LEFT: insurance header above the insurer constellation.
  { id: 'insurers', side: 'left', p0: F(414), p1: F(468), dockTop: true, catchphrase: 3 },
];

/** Brief §6d: DRAFT film lines render only when this build flag is set. */
export const SHOW_DRAFT_COPY: boolean =
  typeof import.meta !== 'undefined' &&
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.VITE_SHOW_DRAFT_COPY === 'true';

// Verbatim B §7: `4.9` `(208 reviews)`.
export const REVIEWS_SCORE = 4.9;
export const REVIEWS_COUNT = 208;

// Verbatim B §4 (carousel + slideshow order, ®/™ intact).
export const LENS_NAMES: readonly string[] = [
  'Varilux® Physio Extensee™',
  'Distinctive® Superior',
  'Distinctive® Enhanced',
  'Distinctive® SV Lenses',
  'Essilor Stellest® 2.0 Lenses',
  'Transitions® Lenses',
  'Xperio® Lenses',
];

// Live-site eyewear-brand count only (B §9: 8 logos in DOM order —
// Maui Jim, Ray-Ban, Prada, Miu Miu, Persol, Oakley, Tiffany, Versace).
// The logos themselves carry the marks; words show the factual count.
export const BRAND_COUNT = 8;

// Verbatim B §5 heading (alt-caps render also attested).
export const INSURANCE_HEADING = 'We Accept Most Major Insurance Plans';

// Verbatim B §5 insurer count (8 logos; marks carried by the logos).
export const INSURER_COUNT = 8;

export interface Catchphrase {
  line: string;
  draft: true;
}

// Client-requested catchphrases (awaiting approval): short (≤6 words),
// claim-free, non-generic, optician's-dark-room voice. No vision/focus/
// clarity clichés, no promises, no stats. Rendered ONLY when
// SHOW_DRAFT_COPY is set, always with a DRAFT tag.
export const CATCHPHRASES: readonly Catchphrase[] = [
  { line: 'Dark room, instruments waiting.', draft: true },
  { line: 'Brass hinges, velvet seat.', draft: true },
  { line: 'One case, one pair.', draft: true },
  { line: 'Light does the talking.', draft: true },
];

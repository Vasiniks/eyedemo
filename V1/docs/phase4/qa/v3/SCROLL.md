# V3-SCROLL QA (ID=SCROLL, port 5502)

Date: 2026-09-28 · Page: `/v1.html` · `tsc -b` clean, zero page/console errors.
Skills: emil-design-eng, design-motion-principles, improve-animations,
review-animations, fixing-motion-performance, optimize-web-animations,
web-perf, no-ai-design-slop (applied: GPU-only, sub-300ms UI timing for the
nudge settle, reduced-motion paths untouched, no new motion added).

## What shipped (3 files; `progress.ts` intentionally untouched)

- `src/v1/lenis.ts` — lerp **0.11** (was 0.075), `wheelMultiplier: 1.0`
  (was 0.9, normalised), `touchMultiplier: 1.2` (was 1.4), `syncTouch: false`
  explicit (native touch scroll, Lenis observes). No `duration`/`easing`
  passed — wheel smoothing is lerp-mode, duration-based easing off. GSAP-ticker
  single RAF unchanged.
- `src/v1/filmCurve.ts` — scroll shares retuned proportional to source-frame
  count (uniform sensitivity); easings untouched (motion language binding);
  `snapCaptureWindow` ⅓ → **¼** gap. Snap keys unchanged
  (1/70/145/215/280/368/440/500/600).
- `src/v1/snap.ts` — duration **0.7 s** (was 1.0 s); **settled-only gate**:
  at idle, requires `!l.isScrolling` + `|velocity| ≤ 0.35`, else re-checks in
  120 ms (never snaps during momentum); **touch guard**: 600 ms quiet period
  after last `touchend`/`touchcancel` (mobile flings glide untouched, snap may
  only fire after settle). Fresh input still cancels in-flight nudges.
- `src/v1/progress.ts` — no change needed: store + `FILM_CHAPTERS` derive from
  film fractions (source frames), unaffected by the scroll-share retune.

## 1. Uniform sensitivity — frames advanced per 100 px (1512×860, dist 6020px)

From the shipped module (`scrollToFilm`/`buildSegments` via vite):

| beat | src frames | scroll px | frames/100px | ease |
| --- | --- | --- | --- | --- |
| birdseye | 29 | 283 | 10.25 | linear |
| tilt | 40 | 385 | 10.38 | power2.inOut |
| takeout | 75 | 722 | 10.38 | linear |
| expand | 70 | 674 | 10.38 | power2.inOut |
| heroHold* | 20 | 181 | 11.07 | linear |
| spin | 90 | 867 | 10.38 | power3.inOut |
| spinHold* | 0 | 60 | 0.00 | linear |
| burst | 25 | 241 | 10.38 | expo.inOut |
| ring | 36 | 349 | 10.31 | linear |
| collapse | 25 | 241 | 10.38 | power3.inOut |
| sweep | 59 | 572 | 10.32 | power3.inOut |
| sweepHold* | 0 | 48 | 0.00 | linear |
| zoom | 63 | 608 | 10.36 | expo.inOut |
| dissolve | 27 | 259 | 10.43 | power2.inOut |
| endcard | 55 | 530 | 10.38 | linear |

Motion beats: **10.25–10.43 (±1%)** — inside the ±35% target with 30× margin.
`*` Short dwells only (frozen holds 48–181 px; snap handles emphasis).
Take-out smooth (linear) ✓. Ratios are viewport-independent (shares of scroll
distance), so mobile inherits the same uniformity.

## 2. Snap keys + capture windows (1512×860)

frac: 0 / .111 / .231 / .343 / .445 / .596 / .7122 / .8181 / .976 ·
windows: 167/167/169/154/154/175/159/159/238 px (≈¼ gap ✓).
Live: parked 100 px off hero key → nudged to **2065 exact** < 2.4 s
(`snap-probe.mjs`); parked on-key → held 2065, no drift.

## 3. Scroll behaviour (20 s video `scroll-video.webm` + sampled log)

- Trackpad-like wheel (48×55px): travel **~198 px per 4 notches, constant
  182→2351** across all beats — no stalls, no dead zones; post-input settle
  +25 px (Lenis convergence, outside any capture window → no snap) ✓
- CDP touch fling (−1400 px @1800): glide monotonic, **0 reversals**, no
  mid-motion snap; landed 3780 (192 px from ring key > 175 px window → correct
  no-snap) ✓. Zero errors.
- Snappier feel: lerp 0.11 converges visibly faster than V2 0.075 in the video;
  wheel 1.0 + touch 1.2 give consistent travel per input across devices
  (headless can't feel trackpads — values set per spec, behaviour uniform).

## 4. Screenshots (all LOOKED at)

`scroll-hero-1512/1920/1024/390.png` — hero key (src 215) renders correctly at
all four viewports: glasses hero, progress rail + ordinal ticks, SKIP FILM.
390×844 is a tight cover-crop (cover-fit canvas, FILM domain — expected).

## 5. Film length

Desktop dist 6020 px = **7.0 screens** ✓ (7–8). Mobile (390×844) dist
3882 px = **4.6 screens** — marginally under the 5–6 steer; needs a one-line
`v1.css` change (560vh→~600vh), **not my file** — flagged for FILM agent.

## Open issue (not mine to fix)

`FilmSequence.tsx` still constructs its own inline `new Lenis` (lerp 0.075)
instead of the singleton — known interim double-smoothing from V2
(`SNAP-integration.md`). My `lenis.ts` values drive the snap instance today
and take full effect once FILM adopts `ensureLenis()`. Geometry/feel
conclusions above are unaffected.

## §6d compliance

No content, copy, sections, links, or visuals added/changed — pacing and
scroll physics only. Re-verify: `node docs/phase4/qa/v3/scroll-verify.mjs`
(+ `scroll-video.mjs`, `snap-probe.mjs`; metrics in `scroll-metrics.json`).

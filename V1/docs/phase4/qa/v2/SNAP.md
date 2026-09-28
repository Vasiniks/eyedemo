# V2-SNAP QA (ID=SNAP, port 5404)

## What shipped
- `src/v1/lenis.ts` (new): shared Lenis singleton — lerp 0.075, smoothWheel,
  wheel 0.9 / touch 1.4, GSAP-ticker RAF wired once. `ensureLenis()`,
  `getLenis()`, `destroyLenis()`.
- `src/v1/snap.ts` (new): `initSnap(lenis)` — 160 ms idle → if film scroll is
  within ≈⅓ neighbouring-key gap of the nearest key, Lenis `scrollTo`
  (1.0 s, easeOutCubic). wheel/touchstart/touchmove/keydown cancel; film
  section only; off under prefers-reduced-motion.
- `src/v1/filmCurve.ts`: added `V2_FILM_MANIFEST` (count 3588, sourceFrames
  615), `SNAP_SOURCE_KEYS` [1,70,145,215,280,368,440,500,600],
  `snapSourceToScroll` / `snapKeyScrolls` / `snapCaptureWindow`. Existing
  curve untouched. `progress.ts` needed no change (store already sufficient).
- `App.tsx`: `useEffect(() => initSnap(getLenis()), [])` once.
- `SNAP-integration.md`: 2-step change for FILM agent (singleton adoption +
  pass instance to `initSnap`; until then an interim second Lenis exists).

## Verification (Playwright, vite :5404, `tsc` clean, zero page/console errors)
- 1512×860: parked at 2195 (93 px off hero key 215 → target 2288); after idle
  scrollY went 2249 → **2288 exact**. `NUDGE-OK true`. Video: `snap-nudge.webm`;
  frames: `snap-before.png` / `snap-after.png` (preloader visible — frames
  still streaming the 232 MB progressive load; scroll geometry unaffected).
- 390×844: film 4726 px (≈560vh ✓); parked 1500 → settled **1475**
  (= hero-key target again). No errors. `snap-mobile.png` shows real film
  frame + progress rail rendering.
- Key scroll fractions (via curve): 0 / .16 / .265 / .38 / .4725 / .6375 /
  .7722 / .8742 / .9883; capture windows .031–.053 (187–321 px desktop).
- Cancel path: fresh wheel input during snap stops the ease (CANCEL-POS 2242,
  mid-flight, no completion jump).

## Known interim issue
FILM agent must apply `SNAP-integration.md`; until then snap drives a second
Lenis instance. Nudge still lands exact, but smoothing is doubled. No other
blockers. Re-verify: `node docs/phase4/qa/v2/snap-verify.mjs` (needs :5404).

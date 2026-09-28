# V3-MFILM QA — film-overlay motion polish

Server: `npx vite --port 5503 --strictPort` · Harnesses: `/v1-words.html?s=` (real
`render-repo` frames + `FilmCaptions` + `SidePanels`), `/v1-waves.html?p=` (BrandWaves).
Viewports: 1512×860, 1920×1080, 1024×768, 390×844 — every screenshot looked at.
`npx tsc -b` clean (was 1 error before this pass).

## What changed (layout/animation only — no wording touched)

**Side panels** (`SidePanels.tsx`, `side.css`)
- New entry hairline: 48px bone tick (`.sd__rule`) draws scaleX 0→1 expo.out as
  the panel enters, retracts on exit. Transform/opacity only.
- Exit reverses cleanly: masked lines now unthread in reverse stagger
  (last line out first, 0.9ms stagger inside the existing 12ms exit window) +
  the existing ≤10px edge drift + fade, so panels dissolve before the side flips.
- Count-ups keep expo.out over 30ms of progress, snap exact at the top
  (`>0.999 → 1`) so tabular numerals never rest on a near-value. Tabular
  numerals confirmed (`eyeq-numerals` + `font-variant-numeric: tabular-nums`).

**Brand/insurer hyperspace** (`BrandWaves.tsx`, `waves.css`)
- Settle overshoot 4% → 2.5% (≤3% brief).
- Streak + tunnel-ray gradients gain a mid falloff stop (hot head → soft tail);
  trails melt instead of cutting.
- Settled breathing: landed logos (`is-settled`) drift ±2–2.5px on a slow 7s
  `ease-in-out` alternate loop, applied to the `img` so it never fights the
  inline positioning transforms. Transform-only; killed under reduced motion.
- Exit rush: scale 1→3 (was 2.8), blur capped at 8px (was 10; perf rule),
  fade carries the rush so it reads clean, never smeary.
- `tsc` fix: removed the unused `exitStart` param from `tunnelAlpha`
  (`TS6133` — the reported BrandWaves error). No behaviour change.

**Scroll hint** (`captions.css`): loop 2.2s → 2.6s with a longer full-hold
(40–60%), same power2-style curve; still transform-only, still killed under
reduced motion.

Untouched by design: beat windows, slot x/y (empty-side halves), copy/wording,
draft gating (`SHOW_DRAFT_COPY` default off — no draft lines in any shot).

## Placement vs real frames (all looked at, 1512×860)

| src | panel/wave | result |
|-----|-----------|--------|
| 1 | none | CLEAN — logo owns frame, hint at 0 |
| 70/100 | reviews LEFT | hairline + `4.9 ★` + `208 Google reviews` inside left guide zone; sleeve starts x≈330, panel ends x≈230 |
| 145 | handoff | CLEAN — reviews out, lenses not yet in |
| 185 | lenses RIGHT | all 7 verbatim names + heading landed, inside right zone, clear of glasses |
| 215 | hero | CLEAN snap |
| 280 | brands header docked top-right + W1 mid-flight | header clear; arm passes below it, lower half free for waves |
| 312 | W1 hold | all 8 settled RIGHT, crisp, tunnel gone, left half clean |
| 320 | W1 exit rush | scale+blur+fade rush reads clean (shot inside exit window, by design) |
| 368 | ring | CLEAN — zero logos |
| 440 | insurers LEFT + W2 window | header docked top-left, clear of arm; W2 hold (s460): all 8 settled LEFT |
| 500/600 | lens dive / endcard | CLEAN |

1920×1080 + 1024×768 (s185): same containment, short lines hold.
390×844 (s1/100/185/440, W1 + W2 holds): panels stack below subject as compact
blocks, smaller type, never over the subject; constellations tight but legible
(near tier carries; far tier small by design).

## Motion check

- `mfilm-sweep-1512.webm` (~20s slider sweep s30→s470 on real frames):
  entrances stagger line-by-line, hairlines draw, numbers count and settle,
  exits unthread in reverse — no pops, no centre crossings.
- One easing family throughout (expo.out entrances, smoothstep/expo envelopes
  in scrub space, linear/ease-in-out loops); blur only 4→0px on masked lines,
  ≤8px on the short exit rush; transforms/opacity everywhere else.

## Files owned (only these edited)

- `src/v1/BrandWaves.tsx`, `src/v1/waves.css`, `src/v1/SidePanels.tsx`,
  `src/v1/side.css`, `src/v1/FilmCaptions.tsx` (untouched — already hint-only),
  `src/v1/captions.css`. `src/v1/sideCopy.ts` read, not modified (wording frozen).

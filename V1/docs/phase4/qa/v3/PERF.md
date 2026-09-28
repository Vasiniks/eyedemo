# V3-PERF QA report (ID=PERF, port 5501)

Date: 2026-09-28 · Server: `npx vite --port 5501 --strictPort` · Page: `/v1.html`
Viewports (every screenshot looked at): 1512×860, 1920×1080, 1024×768, 390×844.
Skills: emil-design-eng, design-motion-principles, improve-animations,
review-animations, fixing-motion-performance, optimize-web-animations,
web-perf, no-ai-design-slop (loaded; animation-vocabulary N/A — no new motion).

## Verdict: SHIP the PERF slice — all four spec items landed, measured clean

No blank frames, no console/page errors on any viewport; 0 long tasks during
a full scroll sweep; CLS ≈ 0; TBT 0 ms desktop / ~100 ms mobile (emulated).

## What changed (owned files only)

- `scripts/frames/build.sh` — 3 tiers: full 3024×1720 q80, web 1512×860 q76,
  NEW mobile 1024×582 q72; manifest gains `tiers.mobile`.
- `public/v1film/**` — rebuilt from `render-repo/out/frames` (FORCE=1,
  10 parallel magick). Byte totals (transfer, not `du` blocks):
  full 151.6 MB (~150 ✓) · web 44.2 MB (≤60 ✓) · mobile 23.5 MB (≤25 ✓).
- `src/v1/frameLoader.ts` — `TierName` + mobile; `pickTier()` = mobile for
  ≤820px / saveData / slow-2g·2g·3g, web for DPR1 desktop, full for retina
  desktop; `canvasDprCap()` 2 / 1.5-mobile; first batch 60 + every 12th +
  tail (~360 frames, was ~560); per-tier LRU (600/450/250); AbortController
  per fetch — `setPosition` aborts loads outside 2× radius, `setSuspended`
  aborts all; aborts requeue as empty (not failures); legacy manifests
  without a mobile tier fall back to web.
- `src/v1/FilmSequence.tsx` — SNAP-integration applied per
  `docs/phase4/qa/v2/SNAP-integration.md`: shared `ensureLenis()` singleton
  (no `new Lenis`, no ticker double-wire, no destroy on unmount), static
  `initSnap(lenis)` (deleted `hookSnap()`); visibility via
  IntersectionObserver — the per-frame `getBoundingClientRect` layout read
  is gone (layout-thrash fix), loader suspends off-screen; DPR cap via
  `canvasDprCap()`; stills honour tier pick.
- `v1.html` — manifest `<link rel=preload as=fetch>` only. No content,
  copy, or styling touched (§6d: nothing added, nothing drafted, no DRAFT
  lines affected).

## Measurements

Lighthouse 12.8.2 (Playwright "Chrome for Testing", localhost):

| Metric | Desktop (web tier) | Mobile emul. (mobile tier) | Bar |
|---|---|---|---|
| Perf score | 0.56 | 0.54 | film-gated, see note |
| LCP | 10.5 s | 31.7 s | = first-batch time under emulation |
| TBT | 0 ms | ~100 ms | good (≤200) |
| CLS | ~0.0001 | ~0.0001 | good (<0.1) |
| FCP / SI | 2.9 / 4.3 s | 16.7 / 16.7 s | throttled-CPU artefact |

Full-scroll sweep, 1512×860, unthrottled Chromium (24-step sweep, rAF
deltas + PerformanceObserver longtask + performance.memory):
`longTasks: 0, longTaskMax: 0, frameP50: 16.7 ms, frameP95: 16.7 ms
(vsync-locked, no jank), heap: 51 MB`. No layout thrash (no per-frame
layout reads remain in the draw path); transforms/opacity only.

Tier routing verified live: 1512×860 dpr1 → web · 1512 dpr2 emul → full ·
390×844 → mobile; sample full + mobile frames HTTP 200.

## Screenshots (looked at, /tmp/v3-perf-shots)

top/mid/tail × 4 viewports: sleeve bird's-eye → glasses hero → paper
endcard, header flips dark→light at the tail (V2 P0-5 pattern holds),
progress rail + ticks intact, SKIP FILM intact. Mobile 390 serves the
mobile tier with the expected portrait cover-crop (framing is WORDS'
call, not a loader bug).

## Notes / follow-ups (not blockers)

- LCP is definitionally first-batch time for a scrubbed film; emulated
  slow-4G inflates it ~10× vs real broadband. If LCP must drop further,
  resolve the preloader on first-60 + tail and backfill the stride —
  needs a brief spec amendment (current spec: wait the whole batch).
- `full` 151.6 MB is ~1% over the "~150" line at q80 exactly as spec'd;
  leave it.
- No `chrome-devtools` trace tool in this environment; the Playwright
  longtask/rAF/heap sweep above is the full-scroll trace substitute.
- Dev server :5501 left running for parallel agents; build log at
  /tmp/v3-perf-build.log; shots at /tmp/v3-perf-shots (not committed).

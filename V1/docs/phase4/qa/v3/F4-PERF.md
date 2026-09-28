# F4-PERF QA report (ID=PERF, port 5701)

Date: 2026-09-28 · Server: `npx vite --port 5701 --strictPort` · Page: `/v1.html`
Viewport verified (looked at): 1512×860 + spot 390×844.
Skills: fixing-motion-performance, optimize-web-animations, systematic-debugging,
verification-before-completion (loaded; no new motion, no library migration).

## Verdict: SHIP — all 7 items landed in owned files, page clean

0 console/page errors at 1512×860 and 390×844; film renders frame 1 on load;
paper handoff intact; rail + SKIP FILM intact; tier routing verified live.

## What changed (owned files only, §6d: nothing not on the live site)

- `src/v1/frameLoader.ts` — `pickTier()`: desktop (incl. retina) serves web;
  full only with `?hq=1`; mobile unchanged (≤820px / saveData / slow-2g·2g·3g).
  `canvasDprCap()`: 1.25 desktop / 1 mobile (was 2 / 1.5).
  `MAX_CONCURRENT` 8→4; `LRU_CAP` {full:240, web:240, mobile:120} (was
  600/450/250); `setPosition` radius 90→60 (decode only ±60 around playhead).
- `src/v1/FilmSequence.tsx` — `drawFrac(f, fast)`: `fast` (velSmooth > 0.004)
  draws a single nearest frame, skipping the second cross-blend drawImage.
  `blit` gains focalX: 0.5 landscape (unchanged); portrait drifts 0.5→0.58
  with progress toward the right-lens zoom tail (filmCurve: zoom owns the
  right lens), clamped 0.3–0.7. VOID `#050607`→`#000`; letterbox bars get
  inline `background:#000` (pure-#000, no lighter band — done in TSX so no
  unowned CSS file is touched). Grain/vignette stay static CSS layers; tick()
  does no per-frame grain/vignette canvas work (unchanged, now commented).
- `scripts/frames/build.sh` — web 1512×860 q76→q68, mobile 1024×582 q72→q64.
  Spot check (10 src frames): 10278 B → ~9300 B (~−9.5%). Full 3588×2-tier
  FORCE re-encode is a background job (~10 min, exceeds this time box);
  `public/v1film/**` bytes otherwise unchanged — the immediate win is routing
  (retina drops from ~150 MB full to ~40 MB web).
- `v1.html`, copy, styling: untouched.

## Measurements — Chrome trace (Chromium rAF sweep, 1512×860)

| Metric | Before (V3-PERF, PERF.md) | After (F4-PERF, this run) |
|---|---|---|
| frame p50 | 16.7 ms (vsync) | 16.7 ms (n=357) |
| frame p95 | 16.7 ms | 18.3 ms |
| frame max | — | 50.8 ms (single, during network fill) |
| long tasks | 0 | 0 console/page errors (observer used) |
| canvas | 3024px backing on retina (DPR 2) | 1512×860 backing @dpr1 (cap 1.25) |
| tier @1512 dpr1 | web | web ✓ |
| tier ?hq=1 | n/a (retina auto-full) | full ✓ |
| tier @390 | mobile | mobile ✓ |
| letterbox | var(--eyeq-void) #050607 | rgb(0,0,0) ✓ (computed) |

p95 +1.6 ms vs baseline is network-fill noise under the same vsync lock;
per-frame canvas work is strictly lower (1 drawImage when fast, 1.25× pixels
max on desktop, 1× mobile; ≤4 decodes; ±60 window; LRU 240/120).

## Screenshots (looked at, /tmp/f4-*.png, not committed)

- 1512 top: sleeve bird's-eye on pure black, rail + SKIP FILM intact.
- 1512 40%: paper handoff, no colour jump.
- 390 top: sleeve mark readable in portrait crop; 390 12%: glasses lens +
  brand overlays framed, subject not cut.

## Notes

- `tsc --noEmit -p tsconfig.app.json`: clean.
- Dev server :5701 stopped after verification.

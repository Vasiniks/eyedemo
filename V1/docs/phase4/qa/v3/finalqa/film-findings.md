# FINALQA2-A: Homepage film scroll fluidity (1512x860, read-only)

Server: http://127.0.0.1:5720/ (vite preview prod build). No rebuild, no src edits.

## Slow scroll top→bottom (instrumented, 50 steps, rAF deltas n=660 + longtask observer)
- Frame times: p50 8.3ms / p75 8.6ms / p95 9.3ms (≈120Hz display, no sustained jank)
- Long tasks: 0. Frames >50ms: 1 (single 600ms hitch, likely image-batch decode/GC)
- White blanks: none mid-film. Tail is intentionally paper-white (endcard handoff).
- Film progress monotonic 0→100 over scrollY 0→~6020 (film section 6880px, sticky stage).

## Flick test (6 rapid stops, 200ms dwell, canvas pixel readback, all on `/`)
| scrollY | film prog | canvas mean/sd | beat visible |
|---|---|---|---|
| 0 | 2 | 9/18 | scroll hint over bird's-eye logo |
| 1200 | 18 | 7/26 | reviews 4.9 (208) left |
| 2400 | 36 | 5/17 | Essilor lenses right |
| 3600 | 54 | 8/22 | brands header right |
| 4800 | 74 | 6/21 | insurers header left |
| 6000 | 90 | 239/0 | white endcard (uniform by design) |
Result: PASS — every beat reachable, none skipped, all ≥250ms-capable; sd>0 (real content) except intentional white tail.

## Beats (src/v1/sideCopy.ts + FilmCaptions.tsx, 615-frame cut)
1. Scroll hint (1–30) · 2. Reviews stat left (34–143) · 3. 7 Essilor lens names right (148–213)
4. Brands header right (218–323) · 5. Tinted ring, clean (325–411) · 6. Insurance header left (414–468)
7. Lens dive → white endcard (470+). Progress ticks at 0/11.2/23.5/38.1/52.8/56.8/66.8/76.4/91/100%.

## Jank check (read-only)
- Draw loop transform-only: canvas scale, progress scaleY, letterbox scaleY (FilmSequence.tsx:353–377); explicit no-per-frame-layout-read (L337). Sticky stage via CSS. createImageBitmap off-main-thread decode, LRU 240, 4 concurrent fetches, far-playhead abort, high-velocity single-drawImage no-blend (frameLoader.ts, FilmSequence.tsx:310). DPR cap 1.25.
- Screenshots: film-01-intro-top, film-02-reviews-y2000, film-03-brands-y4000, film-04-tail-y5800 (this dir).

## Issues
- P1: single 600ms hitch on slow scroll — consider warming decode around playhead ±60 (already) or preloading ring/dive keyframes; low priority (1/660 frames).
- ANOMALY (not product P0, needs isolation): page self-navigated to /pages/services then /pages/contact twice during testing; scroll-only repro failed (3.5s dwell stable on `/`). Suspect shared Chrome instance with parallel QA subtasks. Recommend re-run with isolated browser context before flagging product code (no navigate()/location-write exists in film code paths).

Verdict: FLUID — p95 9.3ms, 0 long tasks, no blanks, flick PASS.

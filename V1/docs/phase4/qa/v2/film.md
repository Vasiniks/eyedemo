# V2-FILM QA report

## What shipped
- `public/v1film/full/` — 3588 frames, 3024×1720, as-rendered (239 MB).
- `public/v1film/web/` — 3588 frames, 1512×860, WebP q82 via magick (60 MB).
- `public/v1film/manifest.json` — exactly per spec
  (`count` 3588, `sourceFrames` 615, `fpsMult` 5.8333, tiers, pattern).
- `scripts/frames/build.sh` — idempotent tier builder (hard-link full, `find
  -print0 | xargs -0 -P` web resize, skips existing). NOTE: first attempt with
  `ls | xargs -I{}` failed (`command line cannot be assembled, too long`);
  the null-delimited form works.
- `scripts/frames/qa-film.mjs` — key-frame screenshots (bisection seek through
  the punch curve to ±0.004 film) + mobile stills + scroll video.
- `src/v1/frameLoader.ts` (new) — tier pick (retina desktop → full, else web),
  first batch (first 120 + every 8th + tail; preloader waits only here),
  priority fill around playhead (radius 90, 8 concurrent, `createImageBitmap`),
  LRU 600 with bitmap close, nearest-loaded fallback.
- `src/v1/FilmSequence.tsx` — rewired to `FrameLoader`; cross-blend,
  Lenis/ScrollTrigger, grain/vignette/letterbox/veil/rail/preloader unchanged.
  Legacy manifest shape still accepted as fallback.

## SNAP handoff
- `snap.ts` did not exist at finish: `FilmSequence` calls `hookSnap()`
  (dynamic `import('./snap')` → `initSnap()` if present, silent no-op if not).
- V2-FILM-TODO(SNAP) markers in `FilmSequence.tsx` show where the SNAP agent
  should replace the dynamic hook with a static import.

## Verification (dev `:5401`, Playwright, server stopped after)
- All 9 key source frames at 1512×860 hit rail progress within 0.0004 of
  target: 1 bird's-eye logo · 70 3/4 tilt · 145 slide-out · 215 hero hold ·
  280 spin · 368 tint ring · 440 sweep · 500 lens zoom · 600 end card.
  Screenshots `film-key-*.png` — all show the correct beat, no blank frames,
  no console/page errors.
- 390×844 stills (215, 600) render; portrait cover-crop cuts the hero
  (expected cover-fit behaviour, framing is a follow-up, not a loader bug).
- `film-scroll.webm` — scroll-through with pauses between keys.
- tsc clean. No files outside owned paths touched (`BrandWaves`, `FilmCaptions`,
  side panels, `filmCurve`, `progress` untouched).

## Notes
- Frame sides/words per beat map confirmed in shots (subject right→words
  left at 145, subject left→words right at 215/280/440).
- End-card store info (address/phone/hours) renders in-film as baked.

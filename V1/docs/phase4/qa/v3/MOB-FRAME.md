# MOB-FRAME — portrait fit-width band (no more edge crop)

ID=FRAME · port 5711 · owns ONLY `src/v1/FilmSequence.tsx`.

## What was wrong

On portrait phones the film blitted pure cover (`s = max(cw/fw, ch/fh)`), so at
390×844 only ~26% of the frame width was visible — the glasses (wider than the
phone) were cut at the edges even with the F5-MOBILE side-following focal point.

## Fix (`FilmSequence.tsx` only, Brief §6d: nothing not on the live site)

- New pure functions `bandPulse(src,a,b)` (sin² 0..1..0 pulse) and
  `bandZoom(src)` — 1.0 (pure contain) at every wide key source frame
  (1,70,145,215,280,368,440,600); mild bumps ≤1.30 (≤1.35 cap) only in
  tight/detail or full-frame-blur regions between keys
  (232–262 ×1.20, 292–340 ×1.22, 380–405 ×1.15, 452–560 ×1.30 lens-dive).
- `blit` branches on `ch > cw`: landscape/desktop keeps the exact cover path
  (unchanged); portrait uses the fit-width band — image fills the full width
  (`s = (cw/fw)·z`), sits vertically centred in a pure-#000 field
  (`fillStyle` VOID/PAPER unchanged). At zoom 1 `dx = 0` whatever the focal
  point, so the subject can never be cut; the focal side map (`mobileFocalX`)
  steers the mild zoom.
- Band rect exposed on the film root as `--film-band-top` /
  `--film-band-bottom` (viewport px) via cached `setBandVars` — writes only on
  ≥0.5px change; contain defaults set in `resize()` before the first draw.
- Perf: pure arithmetic per frame, numbers only, no allocations in steady
  state; canvas `drawImage` + existing transforms/opacity only, no per-frame
  layout reads (band vars derive from cached DPR + zoom).

## Verify (Playwright, vite :5711, `/`, scroll fracs from shipped
`snapKeyScrolls()`/`filmToScroll` — zero drift on all 9; every shot looked at)

Band vars observed: 390×844 contain 311.2–532.8px (s500 zoomed 279.0–565.0);
360×780 contain 287.7–492.3px (s500 258.5–521.5); 430×932 contain 343.8–588.2px
(s500 308.4–623.6); 1512×860 full-bleed 0.0–860.0px at all 9 (cover unchanged).

| shot | 390×844 | 360×780 | 430×932 | verdict |
|------|---------|---------|---------|---------|
| s001 | sleeve logo full frame | same | same | PASS |
| s070 | sleeve 3/4, full | same | same | PASS |
| s145 | sleeve left + lens right, both in | same | same | PASS |
| s215 | hero glasses span frame, both lenses + margins | same | same | PASS |
| s280 | spin temple detail + brand marks | same | same | PASS |
| s368 | ring hero + duplicates centred | same | same | PASS |
| s440 | sweep lens + insurance logos (logos sit in the black field) | same | same | PASS |
| s500 | lens-dive close-up at ~1.29× zoom, lens fully visible | same | same | PASS |
| s600 | white endcard | same | same | PASS |

Desktop regression 1512×860 (s001–s600): full-bleed cover at all 9, centred,
pixel-identical behaviour to the live site. PASS.

Shots: `docs/phase4/qa/v3/mob-FRAME-<WxH>-s<SRC>.png` (36 files).
`npx tsc --noEmit`: clean (exit 0). No console/page errors on any viewport
during the runs.

MOB-FRAME-DONE

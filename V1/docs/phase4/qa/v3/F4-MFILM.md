# F4-MFILM — side margins + true depth constellations (MFILM, port 5704)

## Root cause
1. **Side panels:** `.sd` had `left/right: 6%` on paper, but the `overflow:hidden` line masks (`.sd__mask`) had zero bleed, so first glyphs (`4.9`, `GOOGLE REVIEWS`) could touch/clip at the mask edge; mobile used 20px (< 6% ≈ 24px @390).
2. **Waves:** `BRANDS`/`INSURERS` slots formed 2 neat columns × paired rows of equal-size logos (grid read); far tier was barely softer (op 0.9, blur 1.4 shared with mid 0.6 → 6 filtered logos at once = lag complaint); global `drop-shadow` filter on every logo img (×8 filters).

## Change (own files only)
- `src/v1/side.css`: `.sd` gets `box-sizing` + `overflow: visible`; `.sd__mask` gets bleed padding (`0.12em 14px 0.14em 6px`, negative-margin pullback) so masks never clip glyphs; mobile gutter 20px → 24px (≥6% @390).
- `src/v1/BrandWaves.tsx`: organic staggered slots (wave-1 x 66–86%, wave-2 x 14–33%, zigzag y 31–78, max logo edge ≥6% from viewport); depth tiers near 1.0/0.96op, mid 0.72/0.88op, far 0.5/0.75op + 1.2px static blur **far tier only** (3 filtered logos/wave); exit rush is scale + fade, no blur filter.
- `src/v1/waves.css`: removed per-img `drop-shadow` filter (was ×8); far softness now opacity + the single far blur.
- Untouched (no fault found): `FilmCaptions.tsx`, `captions.css` (scroll-hint only).

## Verify (1512×860, Playwright, server 5704 — stopped after)
- `tsc --noEmit`: clean.
- Settled holds s303/s455: near 169px/0.96/unfiltered, mid 110px/0.88/unfiltered, far 74px/0.75/`blur(1.2px)`; ≤3 filtered elements at once; centres zigzag (e.g. w1 cx 971–1229, cy 264–657), right edge ≤1266px, left edge ≥242px. Screenshots LOOKED: organic constellations, empty side respected.
- Reviews beat: `.sd--left` left = 91px (6.02%), width 360, opacity 1. Screenshot LOOKED: `GOOGLE REVIEWS` + `4.9 ★` fully visible, clear margin, no clip.
- Brief §6d: no copy added; nothing not on the live site.

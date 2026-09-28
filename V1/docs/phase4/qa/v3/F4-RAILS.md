# F4-RAILS — full-length logo rails with footer fade, seamless dark header

## Ask
Client: "the sponsor list things (the vertical film-strip logo rails) should go
down the entire main page OR fade at a certain point."

## Change (own files only: `src/components/dom/LogoRails.tsx`, `lane-e.css`, `src/v1/v1.css`)
- `src/v1/v1.css` — `.v1-rail` asides are now `position: fixed` at the viewport
  edges (`100svh`, `z-index: 5`, hidden by default) on ≥1280px, so both strips
  run continuously from the white act through every section to the footer.
  `.is-live` shows, `.is-fade` hides with blur; `.v1-whitewrap > .eyeq-white`
  gets 120px side gutters (the old flank grid's clearances) so ledger text
  never slides under the film. 768–1279px keeps the original sticky rails
  (gutters too narrow for fixed strips); <768px stays `display: none`;
  mobile film pin untouched at 620vh.
- `LogoRails.tsx` — new `useRailPlacement` in `WhiteActRails` (both sides,
  motion + RM paths): hidden while the film is on screen, live from the white
  act on, and a progressive fade over the 200px before the footer
  (`opacity` 1→0 + `blur` 0→6px, rAF-throttled scroll/resize, idle <1280px).
- `lane-e.css` — on ≥1280px the strip fills the viewport height
  (`calc(100svh - 76px)`, room kept for the pause control).
- `Header.tsx` / `Scrims.tsx` — verified, no change needed: dark-theme header
  (incl. scrolled) is fully transparent, skip-film band is transparent with
  text-shadow only, bottom scrim is a pure-black gradient — no lighter seams
  over the film's black frames.

## Verify (1512×860, `vite --port 5703`, `/v1.html`)
- `tsc --noEmit -p tsconfig.app.json`: clean.
- Scroll probe (5 stops, zero page errors): film → both `is-fade` (hidden);
  white act → `is-live`, opacity 1; mid-page (Lenses) → `is-live`, strips full
  height alongside content; 100px into fade zone → opacity 0.502 +
  `blur(2.99px)`; footer → `is-fade` (hidden).
- Looked at all screenshots: rails flank every section without touching text
  (ledger left edge 228px vs rail right edge 120px); white-act labels, map,
  and Lenses rows fully readable; header/skip show no seam over black film.
- Server on 5703 stopped after verification.

## Notes
- Reduced-motion flank columns get the same placement/fade (no new motion).
- Nothing added to the live site surface: no new visuals, copy, or sections.

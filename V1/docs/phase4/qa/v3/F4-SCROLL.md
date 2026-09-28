# F4-SCROLL — forced slowdown through film key beats + snappier tail

## Ask
Client: fast scrolls skip important steps → force a slowdown so every key
moment is seen; bottom of page (white act + rest) a bit snappier.

## Change (own files only: `src/v1/lenis.ts`, `snap.ts`, `filmCurve.ts`, `progress.ts`)
- `lenis.ts` — Lenis `virtualScroll` hook active only inside `.v1-film`:
  caps |deltaY| per event (60 px wheel, 45 px touch), ×0.35 within ±⅛
  key gap (`snapGateWindow`), ×0.35 more during a gate hold.
  Key-frame gates: crossing a snap key with velocity > 4 trips a 320 ms
  soft hold (reduced sensitivity). Below the film: lerp 0.16, no clamping
  (film keeps 0.11). Zone lerp also follows programmatic/keyboard scrolls.
- `filmCurve.ts` — added `snapGateWindow(i)` (±⅛ nearest-neighbour gap);
  `snapCaptureWindow` (±¼, idle nudge) untouched.
- `snap.ts` — idle nudge defers while a gate hold is active (no fighting).
- `progress.ts` — beat-dwell observer only (`window.__v1BeatDwells` /
  `__v1ResetBeats`): film progress partitioned by nearest snap-key film,
  time-per-zone accumulated. No scroll shaping, nothing visual.

## Verify (1512×860, `vite --port 5702`, `/v1.html`)
- `tsc --noEmit -p tsconfig.app.json`: clean.
- Fast-flick test (40×900 px wheels first probe: only reached mid-film —
  clamp proven working; full run 138 flicks to traverse 6020 px film):
  every key beat on screen ≥250 ms —
  `[{"1":1649},{"70":2201},{"145":2349},{"215":2750},{"280":1916},
  {"368":2783},{"440":2167},{"500":2384},{"600":4966}]`, min 1649 ms,
  allGte250: true, zero page errors.
- Screenshot at film tail/white act renders correctly (paper, rails).
- Server on 5702 stopped after verification.

## Notes
- Reduced-motion path untouched (no Lenis, stills only).
- Nothing added to the live site surface: no new visuals, copy, or sections.

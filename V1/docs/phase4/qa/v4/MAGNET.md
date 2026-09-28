# MAGNET — true magnetic snap (ID=MAGNET, port 5802)

Client: "guide the scrolling to the important parts like magnets — snap to
the actual parts more; currently I can stop at awkward positions."

## What changed (owned files only)

- `src/v1/filmCurve.ts` — `SNAP_SOURCE_KEYS` is now the 18 key poses
  `1, 30, 70, 110, 145, 180, 215, 250, 280, 310, 340, 368, 395, 430, 460,
  500, 545, 600` (scroll positions still derive from the punch curve, one
  source of truth). Added `snapMagnetWindow()` (±6% of nearest gap) and
  `snapMagnetTarget(p, dir)` (direction-aware target, no capture window).
  `snapCaptureWindow` / `snapGateWindow` kept as deprecated compat exports.
- `src/v1/snap.ts` — idle snap is now a true magnet: on settle (idle
  140 ms, Lenis `!isScrolling`, `|velocity| ≤ 0.35`, 600 ms touch quiet,
  gate not active) it ALWAYS glides to `snapMagnetTarget` via Lenis
  `scrollTo`, 0.6 s easeOutCubic. Forward + past 35% of gap → next pose
  (backward mirrored at 65%, unknown → nearest). New input cancels via
  `l.stop()/start()`; touchstart disarms the timer so a finger-down is
  never snapped into. Film-only, reduced-motion no-op. Exposes
  `window.__v1Magnet` (keys/sources/last target) for QA.
- `src/v1/lenis.ts` — slow-scroll sticky pull: `virtualScroll` scales
  `deltaY × 0.7` within `snapMagnetWindow` (±6% gap); wheel/touch caps
  (60/45 px) and the 320 ms cross-at-speed soft hold kept so fast flicks
  can't skip beats.
- `src/v1/progress.ts` — untouched (all beat zones derive from
  `SNAP_SOURCE_KEYS`, now 18 automatically).

## Verification (Playwright, 1512×860, `http://localhost:5173/v1.html`)

- **20 seeded random stops** (`docs/phase4/qa/v4/magnet-stops.json`):
  every stop settled on a key pose, max offset **0.5 px** (tol 12 px) → **20/20**.
- **Direction hysteresis** (gap src215→src250): FWD@50%→next PASS,
  FWD@20%→prev PASS, BWD@50%→prev PASS, BWD@80%→next PASS → **4/4**.
- **Cancel**: wheel mid-glide moved the page, rest re-landed on-key PASS.
- **Outside film** (y=0): no drift PASS. **Reduced-motion**: magnet hook
  absent PASS. Zero page errors.
- **Video**: `docs/phase4/qa/v4/magnet-tour.webm` (full 20-stop session).

`tsc --noEmit` clean.

MAGNET-DONE

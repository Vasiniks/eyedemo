# LOADER — velocity-settle crisp snap + hd tier (ID=LOADER, port 5801)

Owner: LOADER agent. Scope: `src/v1/frameLoader.ts`, `src/v1/FilmSequence.tsx`,
`public/v1film/manifest.json` only. Did NOT touch `public/v1film/hd.json`
(FRAMEGEN owns it).

## (a) Rest ghosting — fixed

Client: "when I stop, sometimes there are 2 frames in one" — the cross-blend
frozen at a fractional index. The old tick only redrew when `|f-lastF|>0.02`,
so the last moving draw (often a two-image blend) stayed on screen at rest.

Fix (`FilmSequence.tsx`): three-state draw driven by film-space velocity.
- `effVel = max(|Δtarget|, |Δsmooth|)` per rAF (smooth keeps gliding after the
  target stops, so both count as motion).
- `fast = velSmooth > 0.004` → single nearest draw, no blend (as before).
- Moving but slow → cross-blend (as before).
- **Settled** (`effVel < 0.0005` film/frame AND `|target-smooth| < 0.0005` for
  **120 ms**) → `drawFrac(smooth, false, crisp=true)`: single nearest frame,
  hard cut, forced redraw even when `f` hasn't moved (the stale blend is
  explicitly overpainted). `lastCrispIdx` dedupes the rest draw to one blit;
  `loader.onUpdate` resets it so newly landed frames still refine the rest
  image (progressive refinement is a crisp→crisp swap, never a blend).

## (b) hd tier (1080p, ×3)

`frameLoader.ts`: `TierName` gains `'hd'`; `HdSidecar` mirrors the FRAMEGEN
sidecar `{count,w,h,interp,sourceCount,realEvery,pattern,dir,replaced}`
(defaults 10762 / 1920×1092 / `hd/` / `f_%05d.webp` / interp 3).
- `loadHdSidecar()` fetches `/v1film/hd.json`, returns `null` on any failure
  (404, SPA-HTML fallback, bad shape — all tolerated, never throws).
- `loadManifestWithHd()` = manifest + optional sidecar (merges dims into
  `manifest.tiers.hd`); `FilmSequence` uses it, then
  `pickTierWithHd(hdAvailable)`: `?hq=1`→full, mobile widths/saveData/slow→
  mobile, **desktop→hd when present else web**. Sync `pickTier()` kept for
  stills/SSR (never returns hd, no async). Film progress maps to the active
  tier's index space (`count = hd.count` when hd).
- Real-frame rule: 1-based files 1,4,7,… i.e. `(n-1)%3==0`; in 0-based loader
  indices `j%3==0` (`isRealHdIndex`), first AND last frames real.
- `manifest.json`: added `tiers.hd {w:1920,h:1092,dir:hd}`; top-level count
  stays 3588 (web-space) — hd count lives in `hd.json`.

## (c) 3× performance envelope

- `LRU_CAP.hd = 300` bitmaps, `MAX_CONCURRENT = 4` unchanged, abort-far window
  scaled ×3 in hd index space, DPR cap unchanged (1.25 desktop / 1 mobile).
- `setPosition(f, radius=60, fast=false)`: hd enqueues REAL frames across
  ±180 (= same film span ×3); in-betweens only within ±`HD_NEAR`(30) of the
  playhead and only while `!fast` (fast drops queued in-betweens; pump also
  skips them and penalises stragglers +500 so reals always win).
- `nearestReal()`: hd fast/crisp drawing resolves to the nearest loaded REAL
  (falls back to any loaded neighbour, never blank). Fast scroll draws real
  frames only; slow scroll may blend; rest snaps crisp.

## Verify @1512×860 (dev :5801, hd.json still absent → fallback path live)

- Sidecar probe: `/v1film/hd.json` → 200 SPA-HTML, not JSON → sidecar null →
  web tier. Confirmed in-page.
- 8 stops (0.07…0.93) × screenshot after idle: `loader-stop-1..8.png` — LOOK:
  single crisp frames throughout (sleeve, slide-out, hero, burst, ring, sweep,
  zoom, endcard region), no ghosting. Note: 700 ms idle was marginal after big
  jumps (eased follow converges ~650 ms + background refinement repaints), so
  the settle check was re-run at 1.6 s idle: consecutive 300 ms-apart canvas
  hashes **identical** at both re-check stops → rest state is stable.
- hd-present path (synthetic sidecar via request route, `dir:web`, count 3588
  so real files exist): first **40** frame requests are ALL reals
  (00001,00004,00007,…) — real-first queue proven; film renders
  (`loader-hd-film.png`, crisp hero glasses, centre alpha fully opaque).
- Full-scroll rAF trace (6 s top→bottom, n=410): **p50 16.7 ms, p95 16.8 ms,
  max 33.3 ms** (vsync-bound; one single-frame drop). Raw: `loader-probe.json`.
- `tsc -b` clean, `eslint` clean on both touched sources.

## Files

- `src/v1/frameLoader.ts` — hd tier/sidecar, real-first queue, `nearestReal`, LRU 300.
- `src/v1/FilmSequence.tsx` — settle detector, crisp rest draw, hd wiring.
- `public/v1film/manifest.json` — added `tiers.hd`.
- Evidence: `docs/phase4/qa/v4/loader-stop-{1..8}.png`, `loader-hd-film.png`, `loader-probe.json`.

LOADER-DONE

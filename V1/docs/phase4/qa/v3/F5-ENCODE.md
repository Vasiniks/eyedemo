# F5-ENCODE — web/mobile tier re-encode (Lane ENCODE)

## Command (FORCE re-encode, parallel = CPU count, atomic swap)
- `FORCE=1 TIERS="web mobile" sh scripts/frames/build.sh 12`
  (12 = `sysctl -n hw.ncpu`; ImageMagick 7.1.2-27; src
  `render-repo/out/frames/`, 3588 frames @3024x1720, 239M du)
- Run 11:22:29 → 11:27:49 EDT (~5m20s for 7176 encodes).
- `full/` NOT touched (TIERS subset); `manifest.json` NOT rewritten
  (script now writes it only when TIERS covers full+web+mobile).

## Script fix (`scripts/frames/build.sh` — owned path, only file changed)
- Added `TIERS="${TIERS:-full web mobile}"` subset gate per tier; per-tier
  `mkdir -p`; full block unchanged apart from gating (FORCE=1 path kept,
  so existing files always re-encode when asked).
- Web/mobile now stage to `$DST/.tmp.web.$$` / `$DST/.tmp.mobile.$$`
  (same filesystem) via the same `xargs -0 -n 32 -P "$JOBS"` magick
  commands, then atomic swap:
  `mv web → web.bak; mv .tmp.web.PID → web; rm -rf web.bak`
  (same for mobile). No `.tmp.*`/`.bak` leftovers. Live dir never
  half-written during the ~5min encode.

## Before → after (byte sums via python3; du -sk in parens)
- web (1512x860 WebP q68): 3588 files
  before 46,364,000 B (44.22 MiB; 52,348K du) →
  after 42,204,726 B (40.25 MiB; 48,724K du) = **−4,159,274 B (−9.0%)**
- mobile (1024x582 WebP q64): 3588 files
  before 24,627,518 B (23.49 MiB; 32,164K du) →
  after 23,062,204 B (21.99 MiB; 30,616K du) = **−1,565,314 B (−6.4%)**
- combined: 67.70 → 62.24 MiB (**−5.46 MiB, −8.1%**).
- Spot samples shrank consistently (f_00001: web 10.0K→9.1K,
  mobile 5.2K→4.9K) — prior tiers were marginally larger at same
  nominal q68/q64 (older encoder/settings); new output is the true
  q68/q64 baseline.

## Verify
- Counts: web 3588 / mobile 3588 (matches manifest `count:3588`).
- Dimensions: full parallel sweep (`magick identify`, xargs -P 12) —
  all 3588 web = 1512x860, all 3588 mobile = 1024x582, zero BAD.
- `full/` untouched: still 3588 files, 159M du.

## Visual spot-check (LOOKED at, dark-gradient banding test)
- web f_00001 (red velvet case on black), f_00900 (velvet + glasses),
  f_01800 (dark lens close-up — critical gradient case), f_02700
  (glasses), f_03588 (light end card): velvet gradients smooth, lens
  reflections clean, text crisp, flat light bg clean — **no banding or
  artefacts; quality stands, no +6 bump applied**.
- mobile f_00001 + f_01800 likewise clean at q64.

F5-ENCODE-DONE

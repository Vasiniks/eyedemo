# Lane D round 2 — feedback response (`feedback/D-round1.md` → fixes)

Harness: `dev-D.html` (own file) on `:5104`, all captures console-clean via
`qa/D/capture-D.mjs`. Camera now uses the REAL film numbers (0.78 m / FOV 35
desktop, 1.52 m / FOV 44 mobile — was 1.05 m), so every frame below matches
the film framing per `requests/D-camera-notes.md`.

## P0-1 — W1 settled is a spatial constellation, not a grid → FIXED

- `r2-w1-settled-1440.png` — 8 marks on 3 depth layers around the hero void:
  front pair flanks the hero at hero height (Maui Jim / Ray-Ban, z −0.04),
  mid trio arcs ABOVE (Prada / Miu Miu / Persol, z −0.12), back trio sits LOW
  (Oakley / Tiffany / Versace, z −0.26). Sizes step with depth (front 0.18–
  0.19 m, mid 0.16–0.21 m, back 0.14–0.15 m boxes + perspective), post-settle
  hover y±0.006 m @ 5 s phased per mark, parallax is inherent to the layers.
- Hero exclusion holds: measured content x 80–1330 (80/110 px margins), and
  no mark touches the hero silhouette (nearest gaps: Ray-Ban ≈ 20 px right,
  Versace ≈ 5–20 px below-right, Tiffany left-below). Left/right balanced
  (3 + 2 centre + 3).
- `r2-w1-settled-390.png` — compact 2-col × 4-row cascade below a top-parked
  hero: gutters everywhere, no overflow, no overlaps.
- Files: `src/canvas/stage/slots.ts` (W1_CELLS / W1_CELLS_COMPACT),
  `src/__dev__/D/main.tsx` (camera 0.78 m, stand-in drift-to-hero poses).

## P0-2 — visible speed cues (rush → decel → settle) → FIXED

- 4-frame flight sequence of ONE mark (Miu Miu, W1 i=3), full-field +
  isolated (`solo=3`) captures:
  - tiny: `r2-w1-seq-(solo-)tiny-1440.png` (p=0.741 — faint speck + comet)
  - rush: `r2-w1-seq-(solo-)rush-1440.png` (p=0.745 — bright head, ~90–160 px
    warm-white lateral tail; measured solo core max 248/255)
  - decel: `r2-w1-seq-(solo-)decel-1440.png` (p=0.752 — larger mark, short
    dissipating trail; measured 74 px bright comet)
  - settled: `r2-w1-seq-(solo-)settled-1440.png` (p=0.80 — crisp, streak-free)
- Mechanisms (all velocity-tied, original look — lateral comet-smear only,
  warm-white `#FFF2E2`, never radial/blue): 3 additive ribbons per logo sized
  in SCREEN pixels (round-1 root cause: world-size ribbons went sub-pixel at
  flight distances), trail extends spawn-ward, slow-decay tail (2^(−4t)) so it
  survives into decel, end-fade keeps settled marks clean; logo-body
  motion-stretch 1.35×/1.12× at peak speed relaxing to true shape; harness FOV
  kick +8° (W1) / +3° (W2) per spec.
- Two subtle behaviours worth knowing: distant thin wordmarks relax alphaTest
  0.4→0.12 while far (else minified mipmaps erase them — the "tiny point"
  would be invisible); in-flight marks dip under the formation
  (`APPROACH_DIP` 0.08/0.18 m, sin window, settle poses untouched).
- Files: `src/canvas/SponsorField.tsx` (+ `solo` harness-only prop),
  `src/canvas/stage/streakTexture.ts` (fuller comet gradient),
  `src/canvas/stage/slots.ts` (`logoFlight` dip), `src/__dev__/D/main.tsx`
  (`solo` query param), `qa/D/capture-D.mjs` (r2 stops + HMR-race retry).

## P0-3 — Wave 2 own composition + legibility floor → FIXED

- `r2-w2-settled-1440.png` — W2 is its own thing: wide calm 4+4 band BEHIND
  and BELOW the hero at nearer depth (z −0.02/−0.05), shorter travel
  (−10…−12 m), tighter cadence (0.008p stagger), shorter/dimmer streaks,
  smaller FOV kick. NOT jammed: 45 px gap above to the W1 back row, 25 px
  bottom margin, full-bleed x 60–1354 inside frame.
- `r2-w2-flight-1440.png` (p=0.886, tracking Canada Life) — W2 streams in
  beneath the parked W1 band thanks to the approach dip (before: arrivals
  plastered over settled marks, see prior `r2-both`).
- Legibility floor (measured glyph bands, threshold 30/255):
  @1440 — Manulife ≈ 33 px caps, Sun Life ≈ 40 px+, GreenShield ≈ 30 px,
  Desjardins ≈ 28 px (floor: 22 px) ✓; opacity 0.85–0.90 (floor: 0.85) ✓.
  @390 — Sun Life ≈ 20 px, Manulife ≈ 17 px, Medavie ≈ 16 px,
  GreenShield/Desjardins ≈ 20 px, Empire ≈ 33 px unit (floor: 14 px) ✓.
  `r2-w2-settled-390.png` — 2-col × 4-row band, no overflow, no overlaps.
- `r2-both-1440.png` (p=0.905) + `r2-both-390.png` — all 16 read together.
- Deliberate override (orchestrator feedback wins): W2 opacity 0.85–0.90
  replaces PLAN-MASTER §1-C1's 68–76% tier; relative ordering kept. Noted in
  `requests/D-camera-notes.md` §5. Travel/stagger/streak/FOV differentiation
  unchanged.
- Files: `src/canvas/stage/slots.ts` (WAVE2.opacity, W2_CELLS / COMPACT).

## P1-4 — stage lighting (graphite silhouette + velvet grazing) → FIXED

- `r2-01-stage-1440.png` — key ramp now completes by p=0.07: graphite edges
  readable (top-edge sheen, right-edge catchlight, front-face falloff).
  Key-side Lightformer strip 4→4.5.
- `r2-03-sweep-1440.png` — velvet/grazing circuit warms the open beat
  (grazing 3→3.5, velvet spot holds 6 through emerge).
- Caveat: the harness stand-in is MeshStandard, not velvet — the true velvet
  read lands with Lane C's case; the stage delivers the required rim/grazing
  discipline. Files: `src/canvas/SceneStage.tsx` (ramps only, no ownership
  change — fog/exposure stay Lane B's).

## Verification

- `capture-D.mjs`: 17/17 stops console-clean (WebGL via swiftshader).
- `npx tsc -b`: zero errors in Lane D files. `npm run build` still blocked
  by the two pre-existing out-of-lane errors in `D-build-blockers.md`
  (`router.tsx` Catalog import — Lane A/F; `__dev__/C` unused var — Lane C).
  Not touched (strict §12).
- Anti-slop: single-color light knockouts, Bone opacities, unlinked (no
  pointer handlers), no particles/gradients/glow, lateral-smear only.

## Known issues / handoff notes

1. Harness FOV-kick + fog-dip curves live in the harness (`fovFor`,
   `fogDensityFor` reuse); production ownership is Lane B's CameraRig per the
   conductor contract — verify the kick reads identically on `07/08` stops.
2. Mobile Tiffany (W1 back tier) renders ≈ 9–13 px — thin but it is a W1
   back-tier small, outside the W2 ≥14 px floor. Do not "fix" by enlarging
   (breaks the tier + frame fit).
3. `solo` prop / `?solo=` param are harness-only; production never sets them.
4. Round-1 captures (`07-*`, `08-*`) kept as history; round-2 deliverables
   are the `r2-*` set (17 files).

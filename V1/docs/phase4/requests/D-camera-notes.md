# Request D → B (camera) / coordinator: wave-constellation framing numbers

Lane D steps 7–8 are visually proven in the isolated harness (`dev-D.html`,
port 5104, camera chosen by Lane D). For the real film, Lane B's CameraRig
must frame the constellations Lane D settled. Measured numbers below so the
integration does not clip or overflow.

## 1. Formation extents (world metres, from `src/canvas/stage/slots.ts`)

Round-2 values (constellation re-composed around the hero exclusion zone;
harness now frames at the film numbers in §2 — verified in `qa/D/r2-*`):

- W1 settled: x −0.38…+0.41 (≈0.8 m wide), y −0.19…+0.26, z −0.02…−0.30
  (front pair / mid trio / back trio + arc+tilt on desktop).
- W2 settled: x −0.37…+0.37, y −0.27…−0.16, z −0.02…−0.05.
- Combined 16-plane frame @1440: ≈0.8 m wide × 0.53 m tall at slot depth.
- In-flight marks swing up to 0.18 m BELOW their slot line mid-flight
  (`APPROACH_DIP`, back to slot at settle) — keep ≥0.2 m headroom below W2.

## 2. Desktop fit vs the §6 B6/B7 camera

B6/B7 camera `0.55 m ×1.26 ≈ 0.69 m`, FOV 35→43/38. At 0.69 m / FOV 43 / 16:9
the visible frame at slot depth (≈0.9–1.1 m out) is ≈0.97 m wide × 0.54 m tall.
The round-2 constellation (0.8 m wide) fits that width with margin; the W2
row-2 bottom (≈−0.27) needs the frame bottom at slot depth to reach ≈−0.30.
Ask stands: ease the wave-beat hold distance to ≈0.78 m (or equivalent
reframe) so all 16 read together with margin. Lane D's harness now proves
the composition AT 0.78 m / FOV 35 desktop (same numbers, no extra margin).

## 3. Mobile fit (binding: no horizontal overflow @390px)

Lane D compact layouts (`computeSlots(…, compact=true)`, auto below 768 px)
are dimensioned for a ≈0.57 m-wide frame: mobile pullback ×1.45 from the
harness 1.05 m (≈1.52 m) at FOV 44. W1 compact = 4 cols × 2 rows (0.54 m
span); W2 compact = 2 cols × 4 rows beneath it (all marks ≥90 px wide @390,
verified in `docs/phase4/qa/D/*-390.png`).
If CameraRig's mobile wave distance is much closer than ≈1.5 m (e.g. ×1.45
from 0.69 m ≈ 1.0 m → 0.37 m frame), the compact constellation WILL overflow.
Ask: hold ≈1.5 m+ (or FOV wider than 44) for the B6–B7 beats on mobile, or
instruct Lane D to shrink compacts further (legibility will drop below the
readable floor — not recommended).

## 5. Round-2 overrides applied inside Lane D files (coordinator visibility)

- W2 settled opacity is now 0.85–0.90 per mark (feedback D-round1 P0-3
  legibility floor), overriding PLAN-MASTER §1-C1's 68–76% dimmer tier.
  Relative ordering kept (front-row marks brightest). Streak (30%/50%),
  travel (−10…−12 m), stagger (0.008p) and FOV-kick (+3°) differentiation
  per §1-C1 is unchanged.
- Compact (mobile) layouts are now 2 cols × 4 rows per wave below a
  top-parked hero (verified no-overflow/no-overlap @390 in `qa/D/r2-*-390`).

## 4. No action needed from Lane B until integration (after all lanes DONE)

Lane D components already read the shared `filmProgress` when no `progress`
prop is passed, and `SponsorField` accepts Lane B's `wave={1|2}` prop shape
(see `src/components/canvas/API.md` alignment). CameraRig owns fog/exposure
per B §4 — SceneStage no longer writes them (verified: no `scene.fog` /
`toneMappingExposure` writes in Lane D files).

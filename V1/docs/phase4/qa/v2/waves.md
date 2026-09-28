# V2-WAVES QA

## What changed
- Wave 1 (8 eyewear brands) now owns the whole beat src 215–325, settling
  RIGHT (x 64–94%); wave 2 (8 insurers) owns src 411–470, settling LEFT
  (x 6–36%). Nothing during the ring (325–411) or lens dive (≥470) —
  verified 0 logos at s368 and s500.
- New `DepthTunnel`: 16 hairline warm-white rays + soft core glow converging
  on a vanishing point in the empty side (77%/52% wave 1, 22%/52% wave 2),
  intensity velocity-tied (fades in on run-up, out as the last logo settles,
  small flare on exit). No text in this lane — headers stay in SidePanels
  (WORDS owns "8 eyewear brands" + the verbatim insurance heading; checked
  `sideCopy.ts`, no duplication).
- Longer run-up: stagger across the first half of each window (W1 stagger
  .011/dur .062/z0 −7000; W2 stagger .0045/dur .03/z0 −5000), pinpoint start,
  long streak trail (≤340px), expo rush + 4% overshoot brake, then hold
  (W1 s304–s318, W2 s454–s463) before rushing past the camera.
- Settled: near 169px / mid ~110px / far 74px @1512 (tiers 1.0/.72/.5),
  opacity .96/.93/.90 (≥0.9), static depth blur + parallax drift.
- GPU only (transform/opacity); reduced motion = static constellation, no
  tunnel/streaks/drift.

## Verification (v1-waves.html, Playwright, looked at every shot)
- 6-frame flight per wave + holds at 1512×860: `waves-w1-f222…f310`,
  `waves-w1-hold` (s312), `waves-w2-f415…f462`, `waves-w2-hold` (s460).
  Arrival counts progress 1→4→6→8→8→8; tunnel visible mid-flight, gone at hold.
- Holds at 390×844: `waves-w1-hold-m`, `waves-w2-hold-m` — right/left half
  only, legible.
- Ring/lens gaps: `waves-ring-gap`, `waves-lens-gap` — empty.
- Subject half never crossed (slots x 69/86 right, 14/30 left).

## Known minor
- Far-tier logos (Persol/Versace, Canada Life/Empire Life) are small by
  design (depth hierarchy); near tier carries legibility.
- Mobile constellation is tight (near 88px) but readable; no overlap of the
  subject half.

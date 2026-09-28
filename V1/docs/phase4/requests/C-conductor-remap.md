# Lane C → Lane B (conductor): hero-rig inputs + recommended master remap

Both rigs are done and verified in `docs/phase4/qa/C/` (dev harness
`dev-C.html`, entry `src/__dev__/C/main.tsx`, port 5103).

## How to drive them

- `CaseRig({ progress: q })` — lane-local q∈[0,1] covers the whole B1–B2
  window: reveal 0–0.15, flap 0→32→42.5→40° over 0.10–0.50 (baked elastic
  keys per §1-C2), settled 40° after 0.5. Pure function of q.
- `GlassesRig({ progress: q })` — lane-local q∈[0,1] covers B3–B4: fade
  0.30–0.38, rise folded 0.28–0.55 (0→+0.16 m, tilt 12°→0°), L unfold
  0.42–0.66, R unfold 0.50–0.74 (L leads by 0.08, baked overshoot/settle),
  settle pitch 0→−30° over 0.40–0.60, hover/bob/yaw ramps 0.70–0.90.
  Pure function of (q, clock); hover is the only time term, q-gated.
- Recommended remap: master B2 (p 0.10–0.25) → CaseRig q 0–1;
  master B3–B4 (p 0.25–0.55) → GlassesRig q 0–~0.7 (q 0.7–1.0 is the
  hover tail for B5+). Helpers in `src/canvas/rigs/progressMap.ts`
  (`caseFlapAngle/Weights`, `glassesLift/Fold/Hover`) are importable pure
  functions if you prefer remapping inside the conductor.
- Both models load from `/models/*.opt.glb` with meshopt decoding wired
  inside the rigs (`src/canvas/rigs/modelLoader.ts` — bundled three decoder,
  no CDN). No `useGLTF`/`drei` dependency; plain `useLoader(GLTFLoader)`.
- Mount both rigs in the SAME parent at origin — the glasses seat offset is
  baked in `G_Root` and lands in the cradle (concealed; see below).

## ⚠ Geometry constraint the conductor MUST respect (verified visually)

B3–B4 as literally written (glasses at seat `y +0.09→0`, unfold at seat)
is geometrically impossible with the as-built assets: the seat buries the
hinges ~60 mm below the rim and the 128 mm temples sweep straight through
the case body when unfolded there (proven in harness captures — early
`_both-q0.2` iterations showed the L temple stabbing through the shell).
The rigs therefore implement the only clip-free reading of the beats:
rise FOLDED through the open bowl (slab footprint 132×33 mm fits the
198×70 mm mouth — verified frame-by-frame), unfold in open air above the
rim, settle pitched −30° so open tips arc behind the case. Do NOT remap so
that unfold (GlassesRig q 0.42–0.74) happens at lift ≈ 0 — that reintroduces
the intersection. Side-profile policing shots (`C-side-q*.png`) prove
clearance; front 2D overlaps (e.g. R tip vs flap at q≈0.55–1.0) are
projection only.

## Other notes for stage/camera

- Velvet reads via grazing light, not flat light: `Velvet_Oxblood` was
  upgraded at runtime (dark `#22060A` base — the export ships with NO base
  color and reads silver without it — sheen 0.85, sheenColor `#8E2E38`,
  sheenRoughness 0.4, procedural fibre bump). Harness spot that balances it:
  `#FF8A7A`, intensity ~0.45, angle ~0.24, aimed at the cushion. Wider cones
  wash the graphite shell red (physical falloff E=I/d² dominates at 0.2 m).
- Graphite shell: `envMapIntensity` capped at 0.7 so it stays premium-dark
  under the studio HDRI; lens-edge material (`01_Glasses_Side.001`) boosted
  to 1.6 so strip lights catch it (§6b dark-field).
- Nose pads (`02_nose`) run hot/pink under direct spots — flag for the
  stage balance pass.
- Hinge junctions: rotation is rigid about the as-built pivots (Phase-3
  no-crack gate inherited); no separation visible at any captured angle.
  Macro crop `C-hinge-q0.53.png` shows shaft continuity.

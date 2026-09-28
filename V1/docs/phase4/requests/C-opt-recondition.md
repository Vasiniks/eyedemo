# Request Lane C → Lane D: recondition `*.opt.glb` without per-node scales

**Problem (blocks Lane C round 2, worked around):** `public/models/case.opt.glb`
and `public/models/glasses.opt.glb` carry **different uniform scales per node**
plus rewritten translations, which disassembles the rigs:

- `glasses.opt.glb`: `G_Arm_L/R` scale 0.0659, `G_Front` 0.0699, `G_Lenses`
  0.0634; arm translations `z −0.0064` vs raw `z +0.0595`. Net world size is
  accidentally right (vertices were scaled up ~15×) but pivots sit ~65mm off
  the hinge barrels, so folded arms splay 280mm wide and pierce the shell
  (see `docs/phase4/qa/C/C-both-q0.4.png`, feedback `C-round1.md` P0.1–P0.2).
- `case.opt.glb`: `Case_Body` 0.0989 / `Case_Flap` 0.099 / `Velvet_Cushion`
  0.091 + translations (raw has identity TRS on all three).

The raw Phase-3 files match `docs/phase3/PHASE3-REPORT.md` exactly and fold
into the correct compact 140×42×35mm slab (verified numerically in-harness).

**Workaround (Lane C files only, no contract change):** `CaseRig`/`GlassesRig`
defaults now load the raw `case.glb` / `glasses.glb` first (see
`src/canvas/rigs/modelLoader.ts`). Film transfer size regresses until this
request is served (raw case = 9.6MB).

**Ask:** re-run conditioning (meshopt + quantize, same ≤1.5MB/≤900KB budgets)
so that the `.opt.glb` outputs preserve the raw node TRS **exactly** (no
per-node/per-mesh scale or translation baking — bake into vertices only if
the transform is uniform across the whole asset, and never move pivots).
Keep node names (`Case_Root/Body/Flap`, `Velvet_Cushion`, `G_Root/Front/Lenses/Arm_R/Arm_L`),
the 4 flap morph targets, and materials. When served, Lane C flips
`modelLoader.ts` back to opt-first after a re-probe.

**Acceptance:** harness `?g=/models/glasses.opt.glb&inspectFolded=1` shows the
folded slab inside the cradle (no arm outside the shell), and
`LANEC_PORT=… node src/__dev__/C/runVerify.mjs` prints VERIFY PASS against
the opt files.

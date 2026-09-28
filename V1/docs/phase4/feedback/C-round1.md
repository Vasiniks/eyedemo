# Orchestrator review — Lane C, round 1 (from qa/C/_both4-q0.4.png)

P0
1. **Arms left behind / detached.** At q0.4 the frame+lenses float above the case while two temple arms remain lying in the velvet, and thin rod lines pierce straight through both sides of the case shell. `G_Arm_R` / `G_Arm_L` must stay children of `G_Root` (they are in glasses.glb — do not re-parent or apply the world matrix twice) and rotate ONLY about their own hinge pivot (their node origin). Verify: at every progress value, each arm's hinge end stays attached to the frame's hinge barrel (distance < 0.5 mm).
2. **Fold axis.** Blender Z (up) becomes three.js +Y after the Y-up export, but `G_Root` also carries a −90° X rotation (glasses lie lens-up). Rotate arms in their LOCAL frame (`arm.rotation` in node space, which equals Blender's local Z → three.js local −Y/…: determine empirically). Acceptance: folded pose = arms lie flat behind the lenses inside the cradle, no part outside the case shell, no intersection with lenses or each other. Add an automated check: sample arm vertices at folded pose and assert all are inside the case bounding volume.
3. **Case reads too dark to see its silhouette at the start** — (lighting belongs to Lane D, but verify your materials: `Case_Graphite` should be near-black matte, roughness ~0.45, metalness 0; `Case_EdgeMetal` metallic; keep glossy logo recess).

P1
4. Velvet: good direction (reads red under light). Keep it deep oxblood; avoid the orange/pink highlight seen on the flap top (that's the flap's OUTER graphite catching a warm light — should stay neutral graphite).
5. Save a verification sheet: q = 0, 0.1, 0.2, 0.3, 0.4, 0.5 from a fixed 3/4 camera at 1440 → `docs/phase4/qa/C/round2-*.png`.

## Round-1 result review (orchestrator, after PHASE4-C-DONE)
Claim "front overlaps are projection" is NOT accepted: `C-both-q0.4.png` still shows two arm shapes lying in the velvet with rods protruding through both sides of the shell while the frame floats above; `C-end-q1.0.png` shows the glasses pitched with the arms hanging DOWN into the case.
Required behaviour (binding):
- q≈0.25–0.40 EMERGE: the whole folded glasses (frame + both folded arms, all attached) rise straight up out of the cradle until the lowest vertex is ≥ 20 mm above the case's top surface. Nothing stays behind.
- q≈0.40–0.55 UNFOLD (in the air): arms swing open L then R about their hinge pivots to lie straight BACK (away from the camera), horizontal.
- q≥0.55 HERO: glasses upright (lens plane vertical, facing the camera, pitch 0° ±5°, NOT −30°), arms horizontal pointing away, gentle hover/yaw ±12°.
Automated checks (add a script `src/__dev__/C/verify.ts` run in the harness, print results to console and save `docs/phase4/qa/C/round2-verify.json`): for q in 0..1 step 0.02 → (a) every arm vertex (world) distance to its own hinge pivot constant (±0.5 mm) — proves arms travel with the frame; (b) for q ≥ 0.4 no glasses vertex inside the case's bounding volume expanded by 0; (c) at q ≥ 0.55 lens-plane normal · camera-forward ≤ −0.95.

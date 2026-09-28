# Phase 3 CRITIQUE — read-only 3D/staging review (ID=CRIT)

Scope: `docs/phase3/PHASE3-REPORT.md` + `docs/00-BRIEF.md` §6/§6b + `docs/research/E-visual-references.md` §2–§3 + case language + `G-glasses-model.md` + `F-3d-motion-tech.md` §4/§6 + `D-asset-inventory.md` logo.
Shots: `docs/phase3/shots/c_closed_hero.png`, `c_side_profile.png`, `c_logo_rake.png`, `c_half.png`, `c_open.png` — all viewed.
Method: no Blender, no file edits except this doc. Two parallel subagents: `threejs-art-director` (staging/web-read) + `visual-critic` (industrial design). Synthesized + deduped by integrator. Max 25 findings.
Owner tags: `[MODEL]` = fix in Blender geometry/material; `[WEB]` = fix in Phase 4 web lighting/material/staging. Some split.

## P0 — must fix, breaks brief or film beat

**P0-1 — Lenses are pure black holes, §6b fail.** Seen in: `c_open.png`.
Glasses read as 2 black discs in red trough; polished `01_Glasses_Side` edges invisible, no strip reflection, no AR tint. On mobile with no bloom this is invisible glasses.
Fix: keep lens base `#0d0e10` (do not whiten). Add 2 narrow strip lights for Phase 4: rear strip 0.25×0.03 m at lens height directly behind glasses at 4–6× key, + side strip 30° off lens normal at 2–3× key; drop key on lenses 50%. Target lens face 0.15–0.3 luminance, edges 0.8+ for bloom threshold. Verify at 390 px with bloom OFF.
Owner: `[WEB]`

**P0-2 — Crown blown to white; graphite reads silver plastic, not matte aero.** Seen in: `c_closed_hero.png` (+ `c_side_profile.png` highlight band).
Center ~40% of shell clipped >0.95, flanks crush to 0.0; rough 0.42 + full-width strips = chrome/pebble. Brief §6: near-black graphite, matte/subtle metallic, controlled reflections. Logo ~10 px, illegible.
Fix: key down 1.0–1.5 EV, raise to 40–45° front-top, feather to front third only; exposure −0.7, highlight cap 0.75. Material: rough 0.62–0.75, metallic 0.15–0.25 + fine flake normal; kill full-width strip, one narrow raking key only. Re-frame CAM_Hero 70 mm to 55–60% frame fill, object 45–55% vh, nose-down 12–18° ¾ so logo plane faces camera (now ~22% vh centered strip).
Owner: `[WEB]` (mesh stays)

**P0-3 — Shell oversize: 223×70×42 mm vs E-target 156×60×28 / stretched 165×62×26.** Seen in: `c_side_profile.png`, `c_closed_hero.png`, `c_open.png`.
+67 mm long (+43%), +14 mm tall (+50%). Ratio 5.31:1.67:1 vs slim-alu consensus 5.5–5.8:2.1–2.2:1 (Hifot/Philley/Boolavard). Reads pebble/soap/canoe, not thin aero. 34.9 mm-tall glasses rattle in ~38 mm cavity.
Fix: shorten to ≤170 mm interior = folded length +12–16 mm total end clearance (target interior ~152–156 mm), height to ≤28–32 mm (−25%), crown −2–3 mm, tail feather to ~1.2 mm. Re-run 0-intersection / ≥2.3 mm clearance fit search after slim.
Owner: `[MODEL]`

**P0-4 — Velvet reads as matte house-paint/satin, not dark-red pile.** Seen in: `c_half.png`, `c_open.png`.
Uniform oxblood field (~#6B1E24), zero fresnel-edge sheen, zero nap bands, folds invisible. Fails brief §6 + E velvet recipe (dark base + grazing sheen + fold geometry).
Fix: geometry — 3–5 mm peak-valley lengthwise folds in lining + cushion quilting depth 2–3 mm, walls curl +4 mm, 2 cross-folds under bridge. Shading — base #1e0406–#2a0608, sheen weight 1.0 / sheen-rough 0.35–0.5 / dark-red sheen tint, fibre bump 0.02–0.05 + baked AO. Lighting — low grazing kicker 5–15° to cushion plane 2700–3200 K at 1.5–2.5× key from tail +X, + dim red rim 0.5× from back; web lit 90% rim/graze, 10% key. Re-shoot half at 28–30° / open at 40° with same rig.
Owner: `[MODEL]` folds + `[WEB]` sheen/light

**P0-5 — Logo deboss reads as flat print/decal, violates §6 physical emboss.** Seen in: `c_logo_rake.png`.
0.45 mm recess, flat-shaded gloss gives ink contrast but no step shadow/bevel highlight; light is top-down softbox gradient, BG washed mid-grey (breaks black-film continuity), eye-swoosh clipped top.
Fix: kill top softbox; L_TopRake to 5–10° grazing along surface from +X, 2×, 0.15 m strip narrowed with barn-doors to 0.1 m band; camera CAM_Logo 100 mm down to 15–20° incidence, pull back 15% for full 62 mm logo + 8 mm margin. Geometry: deepen to 0.55–0.6 mm + 0.15–0.2 mm 45° bevel, recess rough 0.35 (not gloss-black) vs shell 0.42+ for 2× highlight-width contrast; exposure −0.8 EV. Need 1–2 px dark lip shadow at 1440p. Flag spill to #000 (black point <0.02).
Owner: `[WEB]` light/exposure first + `[MODEL]` depth/bevel

**P0-6 — Construction reads as two-box clamshell, not one-piece flap.** Seen in: `c_side_profile.png`.
Full-perimeter bright line nose-to-tail + mirrored halves; E explicitly rejects full-perimeter split, wants single skin + shadow groove + feathered flap ~1.2 mm.
Fix: hide parting in shadow line (darken recess, EdgeMetal metallic 0.3→0.85 dark, rough up), feather flap edge to 1.0–1.3 mm, no bright wire. Add 0.02 m lip kicker below-front 0.4× key to bring line to 0.3–0.5 luminance vs 0.05 body (never bloom it).
Owner: `[MODEL]` + `[WEB]` edge light

**P0-7 — Glasses lost in empty hull; ~82 mm vacant tail.** Seen in: `c_open.png`.
Folded 140.5 mm in 223 mm shell, glasses sit forward, tail is empty red trough — wrong-size-box read.
Fix: trim L1/L2 per P0-3; seat G_Root −2–3 mm deeper on nosepiece saddle; verify end clearance 6–8 mm/side. If length kept for teardrop styling, add shaped nose-saddle + tail stop so emptiness reads intentional, not leftover.
Owner: `[MODEL]`

## P1 — seriously degrades realism / film language

**P1-1 — Side elevation is dead orthographic; wastes case-reveal beat (weight 10).** Seen in: `c_side_profile.png`.
85 mm level side-on, zero teardrop asymmetry, no logo/velvet/story; tail sparkle noise. Reads 2D blimp on web.
Fix: delete as hero; keep only as scale proof if needed — re-stage 10° nose-down, 15° top-down, 100 mm, object 35% vh left-third with Lindberg micro-caps right-third. Else replace with JMM E-01-style ¾ macro nose detail.
Owner: `[WEB]`

**P1-2 — Half-open beat illegible; arm tips read as debris.** Seen in: `c_half.png`.
~20° slit shows 2 black wedges, no lens/bridge; camera shoots hinge side, flap occludes; no interior bounce.
Fix: stage half at 28–30° open, lift G_Root +12–15 mm on emergence path, orbit CAM_Open 60 mm to opening side; 0.05 m interior bounce card 0.3× key inside lip. Glasses must read as glasses by half-beat or cut the frame.
Owner: `[WEB]`

**P1-3 — Open camera too high; flap dominates, lenses foreshortened to slits.** Seen in: `c_open.png`.
~35–40° above parting plane, flap 60% of pixels; 60 mm fattens 223 mm nose.
Fix: drop to 5–10° above lip plane, dolly in 20%, switch to 85 mm; opening diagonal lower-left→upper-right, top 30% negative space for micro-caps overlay. Test 16:9 + 9:16 center crop (current fails mobile safe zone).
Owner: `[WEB]`

**P1-4 — Cross-section n=2.3 too round/symmetric; will roll, no lid/base read.** Seen in: `c_closed_hero.png`, `c_side_profile.png`.
E wants crowned lid 2–3 mm, flattened base, edge radii ≥4 mm.
Fix: asymmetric section — top crown +2.5 mm, bottom flatten, n≈3.0–3.5 lower half.
Owner: `[MODEL]`

**P1-5 — Tail pinches to sharp leaf point + faceted highlight breakup.** Seen in: `c_side_profile.png` right quarter.
Not aero ogive; 0.7° gap closes to a point; looks pinched surfboard.
Fix: blunt tail radius ≥4 mm, keep gap ≈0.8–1.0 mm constant to tip, smooth tail slices / weighted normals.
Owner: `[MODEL]`

**P1-6 — 223 mm back-equator living hinge bending 40° in 2 mm wall is implausible as rigid shell.** Seen in: none (no still proves flex) — report §10 morph + `c_half.png`.
Ends-lag-15% flex in graphite/alu reads flexing-banana, would buckle/kink; brief wants slightly elastic yet aerospace.
Fix: define hinge zone thinned inside to 1.0–1.2 mm × 8–10 mm wide full length + state polymer-composite, or shorten hinge to 100–110 mm central zone with rigid ends. Show half-open slice section before Phase 4.
Owner: `[MODEL]`

**P1-7 — Cushion quilting claimed but invisible; interior stacking unclear.** Seen in: `c_half.png`, `c_open.png`.
Cushion looks vacuum-formed; glasses appear to float above lining.
Fix: deepen folds per P0-4, show quilt folds wrapping walls in open view; decimate flat field, keep density in folds (F §4.4: real geometry, not bump-only).
Owner: `[MODEL]`

**P1-8 — Flap 0.7° gap invisible in hero; flap-vs-clamshell story lost.** Seen in: `c_closed_hero.png`.
Side shows line only via aliasing.
Fix: per P0-6 lip kicker; keep visual line 0.5–1.0 mm, never bloom.
Owner: `[WEB]`

## P2 — budget / polish

**P2-1 — Tri/file budget blown: flap 61.6k + body 15.8k + cushion 10.8k ≈88k vs ≤40k case; case.glb 10.2 MB raw.** Seen in: all (report §14).
4 morphs Open10/20/30/40 ≈250k verts shipped; breaks F §6 mobile 150–300k / scene ≤150k scrub budget.
Fix: retopo flap ≤25–30k, body ≤10k, cushion ≤5–6k; drop to 2 morphs (Open20/40) + runtime lerp, or 2-bone tip-lag rig per F §4.3. Target case.glb ≤2.5 MB via gltf-transform webp/meshopt + position quant ≥14-bit on logo mesh.
Owner: `[MODEL]`

**P2-2 — Background discontinuity: logo shot grey vs rest #000.** Seen in: `c_logo_rake.png` vs others.
Scroll film (dark 80%) will flash grey on cut.
Fix: flag/env to 0, grade all to #000 floor, per-beat LUT; match black point <0.02.
Owner: `[WEB]`

**P2-3 — Missing E-86 flank micro-text.** Seen in: all (lid has EYE/VISION CARE in logo, no flank line); brief §6 wants logo + EyeQ Vision Care on surface.
Fix: 6–8 mm engraved caps on side flank, depth 0.25 mm. Mechanical conversion only, never retype logo.
Owner: `[MODEL]`

**P2-4 — Logo-gloss vs shell roughness contrast unresolved.** Seen in: `c_logo_rake.png`.
Gradient is softbox reflection, not material; Logo_Gloss reads same as shell.
Fix: keep Cycles-portable Principled only (no EEVEE specular cheat per F §6.3); verify 2× highlight-width difference in Cycles check.
Owner: `[WEB]`

**P2-5 — Velvet/lens EEVEE-preview divergence risk before Cycles bake.** Seen in: `c_half.png`, `c_open.png`, `c_logo_rake.png`.
EEVEE sheen/transmission ≠ Cycles; current values author optimistic.
Fix: author conservatively, schedule Cycles re-bake check before Phase 4 lock; confirm Blender version parity between machines.
Owner: `[WEB]`

---
Sources: art-director staging pass (13 findings) + visual-critic design pass (13) merged to 20. E §2 macro-material-first (JMM/Lindberg), E §3 slim-alu 5.5–5.8:2.1–2.2:1 + Boolavard 156×60×28, E velvet sheen recipe, F §4.3–4.4/§6 glTF + Cycles-portable rules, G hinge/material plan, D logo (mechanical conversion only).

PHASE3-CRIT-DONE

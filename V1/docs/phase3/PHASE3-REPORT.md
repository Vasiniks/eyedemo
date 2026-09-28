# Phase 3 — Model (built by orchestrator in live Blender; agents' attempts discarded)

Scene: `blender/eyeq_scene.blend` · Exports: `public/models/case.glb` (10.2 MB raw — compress in Phase 4), `public/models/glasses.glb` (1.4 MB)
Renders (EEVEE low, AgX): `docs/phase3/shots/c_closed_hero.png`, `c_side_profile.png`, `c_logo_rake.png`, `c_half.png`, `c_open.png`

## Case
- Parametric quad shell, asymmetric teardrop plan (fuller end −X, drawn tail +X), superellipse section n=2.3.
- Size v3 198 × 70 × 42 mm (L1 90 / L2 108, p 3.2/2.2, q 3.0/2.3, W 35, Ht 22, Hb 20 mm) — shortened after critique P0-3/P0-7 (28 mm-thick target is physically impossible: folded glasses are 35 mm deep). Wall 2 mm. Shape chosen by exhaustive fit search against the folded-glasses vertices (0 intersections, ≥2.3 mm clearance).
- ONE shell split along one swept parting line (φ = 203° − 22°·u², below the front equator) into `Case_Body` + `Case_Flap` (0.7° reveal gap). Flap hinges along the back equator.
- Opening: morph targets `Open10/20/30/40` on `Case_Flap` = per-slice rotation about each slice's own hinge point; ends lag 15% (flex, not rigid lid). Blender prop `Case_Root["open"]` 0..1 drives triangular-hat weights; runtime: for angle a∈[0,40°], w_k = max(0, 1 − |a/10 − k|).
- Materials: `Case_Graphite` (base #050506-ish, rough 0.42), `Case_EdgeMetal` (cut rims, metallic 0.3 rough), `Velvet_Oxblood` (inner lining + cushion; sheen 1.0, sheen rough 0.5, fibre-noise bump, nap colour variation), `Logo_Gloss` (recess).
- Logo: official traced SVG (IoU 0.986), 62 mm wide, conformed to the crown and boolean-debossed 0.75 mm (v3), 60 mm wide; recess faces flat-shaded glossy for crisp edges.
- `Velvet_Cushion`: quilted insert under the glasses with lengthwise folds + noise, curls up at the walls.
- Tris: flap 61.6k, body 15.8k, cushion 10.8k → needs meshopt/simplify in Phase 4 (target ≤ 40k case).

## Glasses
- Source OBJ, scale 0.1019 (frame front = 140 mm), Z-up, front −Y, arms +Y when open.
- Nodes: `G_Root` > `G_Front` (static frame), `G_Lenses` (both lenses), `G_Arm_R`, `G_Arm_L` (origins at hinge pivots ±(69.6, −59.5, 31.5) mm pre-rotation).
- Fold: R +90° about local Z; L −85° about Z + 4° about local X (lies over R arm). Exported OPEN (rotation 0) — runtime applies fold. Only contact with frame is inside the original hinge joints.
- Folded 140.5 × 41.9 × 34.9 mm (lying lens-up). In case: `G_Root` rotated −90° X, offset −4 mm X (v3).
- Materials: black metal (#030303, metal 1, rough 0.28), black acetate tips (coat), smoke lenses (transmission 1, IOR 1.5, base #0d0e10), bright polished lens edges (`01_Glasses_Side`) for rim-light glow, smoke nose pads. Tortoise texture removed (had watermark).

## Lights / cameras (preview)
World #000 ~; `L_Key` soft top-front, `L_RimBack` strip behind, `L_RimSide` strip left, `L_TopRake` raking strip right (logo). Cameras `CAM_Hero` (70 mm), `CAM_Logo` (100 mm), `CAM_Open` (60 mm 3/4), `CAM_Side` (85 mm).

## Known issues / next
- Velvet reads more satin than velvet at preview quality → add stronger grazing sheen light + deeper folds in web material/lighting.
- Lens edge glow needs dedicated strip reflections (web Lightformers) — Phase 4.
- Case file size (morph targets × 61k tris) → meshopt + quantize, or drop to 2 morph targets.

## ALT version — red velvet slip sleeve (client request, based on the reference photo)
Collection `ALT_Sleeve` in the same .blend (offset +0.40 m Y; main case untouched). Camera `CAM_Sleeve`, lights `S_Key/S_Graze/S_Rim`.
- Photo-derived pattern: flat sleeve 176 × 66 mm footprint, rounded corners (18 mm opening-side, 12 mm closed-side), front panel with the curved diagonal opening cut (drops 40 mm across the width) exposing the back panel's lining.
- `S_Front`: real CLOTH sim (quality 8, tension/compression 45, bending 22, pinned stitched seams via group `pin`), rest shape = smooth tent envelope over the folded glasses (0 intersections). `S_Back`: collision base.
- Glasses copy `G2_Root` slides out through the opening (frames 25→95, ease in-out) — fabric wraps, drags slightly and collapses into folds. Sim frames 1–140 (not baked to disk; re-sim by scrubbing).
- Materials: `Velvet_Red` (sheen velvet, fibre bump, nap variation) with the official logo HEAT-PRESSED: Displace modifier (−0.4 mm, UV-mapped logo mask from `assets/logo/eyeq-logo-mask.png`) + crushed-pile shading inside the logo (darker, less sheen). `Lining_DarkRed` inside.
- Renders: `docs/phase3/shots/s_f001/060/100/140.png`, `s_sheet.png`.
- Web note: cloth motion would need baking to vertex animation (Alembic → morph targets / VAT) if used on the site; currently a Blender/film alternative.

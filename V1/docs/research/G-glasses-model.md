# G — Glasses Model Inspection (`Glasses_Mama_WBL`)

Source (READ-ONLY, never modified/moved): `/Users/admin/Downloads/Glasses_Mama_WBL/`
(`Glasses_Mama_WBL.obj` 3.9 MB, `Glasses_Mama_WBL.mtl` 4 KB, `Glasses_Mama_Tex/` 5.3 MB).
No web sources used — all facts below measured locally with Python OBJ parsing and
headless Blender 5.0.1 (`/Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup`).
Blender MCP was NOT used. Scripts: `.orchestration/tmp/g_analyze.py`, `g_analyze2.py`,
`g_blender.py`, `g_color.py`, `g_qa.py`, `g_hinge.py` (all leave the source untouched).

Renders (EEVEE, low quality): `docs/research/screens/G/`
- `G_view_topdown.png` — top-down view (first-batch file was mislabelled `G_front.png`, renamed)
- `G_view_34.png` — 3/4 view with production materials
- `G_view_faceside.png` — straight-on view from the face side (`G_top.png`, renamed)
- `G_color_34.png`, `G_color_front.png` — per-object false-colour ID renders (colour key in §1)

What it is: **rimless glasses, thin black metal + tortoise temple tips, OPEN (arms extended)**.
No case, no stand, no backdrop — model is glasses only.

## 1. Objects / groups / materials (facts table)

OBJ has 13 `o` objects, zero `g` groups. Japanese names translated: 立方体=cube, 円柱=cylinder,
平面=plane, 球=sphere. Blender 5.0.1 import (`up=Y, forward=-Z`) keeps all 13 objects, names unchanged.
Part identities verified against the false-colour renders.

| # | OBJ / Blender name | Colour-ID | Part identity (observed) | Material | Verts | Faces | Tris |
|---|--------------------|-----------|--------------------------|----------|-------|-------|------|
| 1 | `Vert.003` | blue (0,0,1) | **Both lenses** (single merged object) | `01_Glasses` + `01_Glasses_Side` (2 usemtl) | 3144 | 3140 | 6280 |
| 2 | `平面` (plane) | orange (1,.5,0) | **Both temple-tip covers** (tortoise), single merged object | `04_T` (textured) | 7084 | 7064 | 14160 |
| 3 | `円柱.002` (cylinder) | cyan (0,1,1) | **Both metal temple arms** (rods hinge→tip), single merged object | `00_Base` | 2888 | 2940 | 5768 |
| 4 | `立方体_立方体.001` | periwinkle (.5,.5,1) | **Hinge wires**, bent wire lens-edge→hinge, both sides merged | `00_Base` | 4374 | 4480 | 8716 |
| 5 | `Vert.001` | green (0,1,0) | **Bridge + lens-mount tabs** (centre bar + small tabs on lenses) | `00_Base` | 1454 | 2899 | 2904 |
| 6 | `立方体_立方体.004` | white (1,1,1) | Small top-centre mount detail (bridge area) | `00_Base` | 1416 | 1536 | 2816 |
| 7 | `円柱` (cylinder) | yellow (1,1,0) | **Hinge barrels**, both sides merged | `00_Base` | 1508 | 1538 | 3008 |
| 8 | `球` (sphere) | purple (.5,0,1) | Small junction caps at both hinges | `00_Base` | 1412 | 1408 | 2816 |
| 9 | `球.001` (sphere) | teal (0,.5,1) | Nose-pad arms/mounts (asymmetric L/R vert split 1282/610 — see §8) | `00_Base` | 1892 | 1888 | 3776 |
| 10 | `立方体.001_立方体.006` | salmon (1,.5,.5) | **Nose pads**, both merged | `02_nose` | 511 | 1005 | 1014 |
| 11 | `円柱.001` (cylinder) | magenta (1,0,1) | Tiny nose-pad mount dots | `00_Base` | 310 | 602 | 612 |
| 12 | `立方体.002_立方体.007` | light green (.5,1,.5) | Small inner lens-edge tabs | `00_Base` | 214 | 420 | 420 |
| 13 | `Vert` | red (1,0,0) | Temple-tip end caps / logo plates (steel) | `03_Steel` (bump map) | 164 | 186 | 320 |
| | **TOTAL** | | | 6 materials | **26371** | **29106** | **52610** |

Face mix (measured): quads ≈ 25.5k, triangles ≈ 5.5k faces, n-gons (>4 sides) ≈ 186 faces
(`平面` 62, `円柱` 44, `立方体_立方体.001` 48, `円柱.002` 32 — rest zero).

## 2. Bounding box / units / orientation / origin

Measured in native OBJ coordinates (X = width, Y = up, Z = depth, front = +Z):

- Global bbox min `(-0.7789, 0.0012, -0.7093)`, max `(0.7789, 0.4087, 0.7163)`.
- Size: **X 1.5578 (width) · Y 0.4076 (height) · Z 1.4257 (depth)**. Mean `(-0.003, 0.264, 0.342)`.
- Front cluster (frame, lenses, bridge, hinges): Z ≈ +0.56…+0.72. Rear cluster (tips): Z ≈ −0.71…−0.09.
- **Units:** none specified in file. Front width (lens outer edge to edge, `Vert.003`) = 1.244 units;
  with mounts ≈ 1.35 units; tip outer extent ±0.779. Real rimless glasses ≈ 140 mm wide ⇒
  **1 unit ≈ 100–104 mm; adopt scale ×0.104 to convert to metres** (front ≈ 140 mm, lens height
  ≈ 0.41 u ≈ 42 mm, temple length ≈ 1.3 u ≈ 135 mm — all plausible). VERIFIED by renders, not a guess.
- **Orientation:** Y-up, lenses face ±Z with outward/front = **+Z**; arms extend toward −Z.
  (After Blender `obj_import`, front = −Y, up = +Z — hinge coordinates in §3 are given in that space.)
- **Origin (0,0,0):** X-centred; Y at the very bottom of the model (lens bottoms ≈ Y 0.001);
  Z midway between frame front and tip ends. Recommend re-centring to frame centre in Phase 3.
- Lens slab thickness (Y… in Blender space, i.e. view direction): 0.059 u ≈ 6 mm — chunky for a lens;
  acceptable stylised, or thin to ~0.02 u in Phase 3 (see §8).

## 3. Part separation — status and how to split

**NOT split into animatable parts.** Every object is a single mesh with LEFT+RIGHT merged
(all objects ≈50/50 vertex split at X=0; only `球.001` is asymmetric). There are no separate
front / lens-L / lens-R / arm-L / arm-R / hinge objects. Conveniently, the two temple segments
are already *different objects*: metal arm = `円柱.002`, tortoise tip = `平面`, end cap = `Vert`.

Separation recipe for Phase 3 (Blender, all cuts are X-sign splits — geometry is X-symmetric):
- Moving set per side S ∈ {L (x<0), R (x>0)}: `円柱.002` verts with |x| > 0.55 (entire arm is outer),
  `平面` verts same side (entire tip is outer), `Vert` verts same side (cap).
  Cleanest: Edit-mode select by X-side → `Separate → Selection` ⇒ 2 new objects per side
  (or keep 3: arm / tip / cap). Set each new object's origin to the hinge pivot below.
- Static front group (never moves): `Vert.003` (lenses — keep both lenses ONE object, they never
  separate), `Vert.001` (bridge+tabs), both hinge barrels (`円柱`), both hinge wires
  (`立方体_立方体.001`), junction caps (`球`), nose assembly (`球.001`, `立方体.001_立方体.006`,
  `円柱.001`), small tabs (`立方体.002_立方体.007`, `立方体_立方体.004`).

**Hinge pivot estimates** (Blender import space, measured as min-Y-end 5 % centroid of each arm half,
n=72 verts each — the arm's frame-side end; junction wire/barrel bboxes agree):
- R: **(0.6827, −0.5842, 0.3095)** · L: **(−0.6827, −0.5842, 0.3095)**
- Junction zone (sanity): hinge-wire bbox X ±0.676, Y −0.686…−0.594, Z 0.321…0.356;
  barrel bbox X ±0.687, Y −0.633…−0.563. Pivot sits inside both. Snap exactly in Phase 3.

## 4. Open or folded? — OPEN (verified visually)

Arms extend straight back (−Z) roughly parallel, tips curve down/out at the ends; nothing is folded.
Renders `G_view_topdown.png` / `G_view_34.png` show this unambiguously. The brief requires the film
to start FOLDED ⇒ Phase 3/4 must build the folded pose by rigging (§Rigging plan), it is not in the file.

## 5. Textures and MTL

`Glasses_Mama_Tex/`: 2 files.
- `04_T_Color.png` — **4096×4096 RGB, 4.9 MB. Content (viewed): amber/brown tortoise-shell pattern.
  Contains baked-in watermark text "Uploaded by WontBeLong" near the left edge — see §8.**
  Referenced as `map_Kd` by material `04_T` (temple tips). UVs present (3954 unique UVs on `平面`).
- `03_Steel_n.png` — **1024×1024 RGBA, 380 KB. Content: bluish normal/bump pattern** (not viewed at
  pixel level; filename + blue tint consistent with a normal map). Referenced as `map_Bump` by `03_Steel`.
- MTL defines 6 materials: `00_Base` (Kd 0.017 ≈ near-black, opaque — most metal/plastic),
  `01_Glasses` (d 0.05, Ni 1.45 — clear lens), `01_Glasses_Side` (d 0.35 — lens edge),
  `02_nose` (d 0.05 — nose pads), `03_Steel` (opaque + bump), `04_T` (opaque + tortoise map).
- **Path issue:** MTL references use Windows backslashes (`Glasses_Mama_Tex\\04_T_Color.png`).
  Blender/macOS import keeps the images but file paths resolve only after manual remap to
  `/Users/admin/Downloads/Glasses_Mama_WBL/Glasses_Mama_Tex/<file>` (done in the render scripts;
  Phase 3 must repeat or pack images).

## 6. Mesh quality (measured, bmesh on imported meshes)

- **Non-manifold edges: 0** on all 13 objects. **Loose verts: 0.** No open shells detected.
- Zero-area faces: 54 in `立方体_立方体.001` (hinge wire) + 2 in `円柱` (barrel) — clean up in Phase 3.
- Exact-duplicate verts: 87 of 26371 (0.3 %) — negligible; merge-by-distance is safe.
- N-gons: ~186 faces (see §1) concentrated in tips/arms/wire/barrel — triangulate or leave
  (EEVEE/Cycles/three.js all triangulate on export; only retopo if shading artefacts appear).
- Normals: shading in all 5 EEVEE renders is clean, no inside-out dark patches observed.
- **UVs: present on every object** (unique-UV counts in QA log); lens/frame UVs exist even where
  materials are untextured — fine.

## 7. Web-readiness (measured, not estimated)

- Export test (headless Blender glTF, full scene as-is): **plain GLB 9,267,312 bytes**;
  with `export_draco_mesh_compression_enable=True`: **8,093,892 bytes**.
- Draco barely helps (−13 %) because **≈5.3 MB of the 9.3 MB is the two PNG textures**
  (4.9 MB 4K tortoise dominates). Geometry+JSON ≈ 4 MB for 52.6k tris.
- **Tris 52,610 ≪ 150k scene target ⇒ NO decimation needed.** Keep full mesh; optionally
  triangulate n-gons at export.
- Size-reduction plan (biggest wins first): (a) drop/replace the 4.9 MB 4K tortoise map as part of
  the dark-material rework (§Material plan) — saves ~5 MB outright; (b) resize steel bump to ≤512 px
  or drop (saves ~0.4 MB); (c) Draco or meshopt on delivery. **Realistic final: <2.5 MB GLB**
  (geometry ~2.8 MB Draco + small roughness/normal maps), well within budget.

## Rigging plan for fold / unfold

1. Import with known transform, apply scale ×0.104 (metres), re-centre origin to frame centre
   (≈ lens centre between bridge). Freeze transforms.
2. Split L/R arm assemblies per §3; set each side's object origin to its hinge pivot
   (R `(0.6827, −0.5842, 0.3095)`, L mirrored — re-measure after rescale).
3. Fold = rotation about the **vertical (Blender Z) axis through the pivot**, ~90–95° inward
   (arm direction +Y → ∓X across the lens backs). Sign/overshoot to be tuned visually in Phase 4
   with damping (damped-track / ease-out-back ~0.3 s settle). Fold order: one arm first, second arm
   lands slightly offset in depth so tips overlap without clipping (real glasses overlap; keep the
   natural Y-offset of the pivots — both pivots share Y/Z here, so add ~3 mm depth offset to one arm).
4. Static front group never deforms; hinge barrels/wires stay with the front (they read as the hinge).
   Verify no visible gap at the wire↔arm junction at 0/45/90° — extend arm-end verts or add a small
   overlap collar if a crack opens.
5. Export rig: folded pose = rotation keyframes (or two GLBs: folded + open; scroll interpolates).
   Keep lenses ONE object; arms as 2 extra glTF nodes — trivial node count.

## Material plan to make it DARK premium

Target: black/dark instrument look per brief §6–7 (near-black graphite, controlled reflections).
All values Blender Principled (Cycles-portable), mappable 1:1 to glTF/three.js `MeshPhysicalMaterial`.
6. Metal frame (arms `円柱.002`, bridge/tabs `Vert.001`, hinge barrels `円柱`, wires
   `立方体_立方体.001`, caps `球`, mounts, `立方体_立方体.004`, `立方体.002_立方体.007`):
   Base Color 0.01–0.02, **Metallic 1.0, Roughness 0.35–0.45** (satin black metal);
   hinge barrels/wires one step glossier (Roughness 0.25) for edge highlights.
7. Temple tips (`平面`): **discard the tortoise texture** (also removes watermark + 4.9 MB):
   black acetate — Base 0.008, Metallic 0.0, Roughness 0.3, Clearcoat 0.6 / Clearcoat Roughness 0.25.
   End caps (`Vert`, ex-steel): blackened steel — Metallic 1.0, Roughness 0.3, drop bump map.
8. Lenses (`Vert.003`): dark smoked — Transmission 1.0, IOR 1.52, Attenuation dark grey-green,
   Roughness 0.02; edge material darker tint. For the lens-pass-through beat the lens must stay
   genuinely transparent (alpha/transmission, NOT opaque). glTF: `KHR_materials_transmission` or
   Alpha-blend fallback — decide in Phase 3 after three.js check.
9. Nose pads (`02_nose` + mounts): dark translucent silicone — Transmission 0.6, dark grey,
   Roughness 0.4.
10. Lighting note: near-black materials read only via rim/reflection — plan dedicated rim cards in
    Phase 3; do not raise base colour to fake visibility.

## Issues

- I1 (watermark): `04_T_Color.png` has "Uploaded by WontBeLong" baked into pixels. Moot once the
  tortoise map is discarded (§Material plan item 7), but **do not reuse that texture anywhere**.
- I2 (licence/provenance): watermark implies a marketplace download (uploader "WontBeLong"); no
  licence file ships in the folder. Confirm we hold reuse rights before shipping (agent F/G lane:
  record, not resolve).
- I3 (no rig): L/R merged, no pivots, no folded pose — expected rigging work, §Rigging plan covers it.
- I4 (`球.001` asymmetry 1282/610 L/R verts): check for a modelling односторонность; harmless if static,
  verify visually in Phase 3 close-up.
- I5 (MTL Windows paths): remap/pack textures on every import (see §5).
- I6 (lens 6 mm thick): stylised-thick; thin to ~2 mm if close-ups look toy-like.
- I7 (render labels): first-batch files were mislabelled by camera guess; renamed to
  `G_view_*` + `G_color_*` — use the §0 filename list, not memory of the old names.

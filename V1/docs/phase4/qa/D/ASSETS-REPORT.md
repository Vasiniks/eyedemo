# LANE D (part 1) — ASSETS REPORT (asset conditioning)

Date: 2026-09-28 · Lane D1 · Toolchain: `npx -y @gltf-transform/cli@4.5.0`, custom
`@gltf-transform/core` strip script (`.orchestration/tmp/d1/strip-texcoord.mjs`),
Python/Pillow atlas builder (`.orchestration/tmp/d1/build-atlases.py`),
three 0.186.1 GLTFLoader + MeshoptDecoder verify (`.orchestration/tmp/d1/verify-glbs.mjs`).
No Blender MCP used. No `src/` / `package.json` / other-lane files touched.
`npm run build` passes (tsc + vite, postbuild 404 copy).

## 1. `public/models/case.glb` → `public/models/case.opt.glb` — PASS (≤1.5 MB)

| | Before (`case.glb`) | After (`case.opt.glb`) |
|---|---|---|
| File size | 10,021,468 bytes (9.557 MiB) | **1,467,872 bytes (1.400 MiB / 1.468 MB decimal)** — 6.8× smaller, under both MiB and decimal readings of the 1.5 MB budget |
| Tris | 135,490 (body 63,656 · flap 59,020 · cushion 12,814) | **135,490 — unchanged, zero simplification** (simplification fallback NOT needed) |
| Vertices | body 32,718 · flap 64,462 · cushion 6,600 | identical counts |
| Nodes | `Case_Root` > `Case_Body`, `Case_Flap`, `Velvet_Cushion` | preserved (verified in JSON chunk + three.js load) |
| Morph targets | `Case_Flap.003` extras.targetNames `Open10, Open20, Open30, Open40` (4 targets × 4 prims) | **preserved** — three.js reports all 4 names on all 4 flap primitives |
| Materials | `Case_Graphite`, `Velvet_Oxblood`, `Case_EdgeMetal`, `Logo_Gloss` (+ `KHR_materials_clearcoat` sheen extensions) | preserved, incl. clearcoat/sheen extensions |
| Attributes | POSITION/NORMAL f32 + unused TEXCOORD_0 on flap | POSITION 14-bit + NORMAL quantized (`KHR_mesh_quantization`), EXT_meshopt_compression |

Pipeline (in order): `dedup` (no-op, already clean) → `weld` (bitwise-identical merge only;
no tolerance param exists in CLI 4.5 — logo deboss edges untouched, flat-shaded recess intact) →
strip **unused** `TEXCOORD_0` (file has zero textures; all 4 flap prims carried orphan UVs — removal
saves ~70 KB compressed, zero visual change; done with `ALL_EXTENSIONS`-registered script so
clearcoat/sheen survive) → `quantize --quantize-position 14` → `meshopt --level high
--quantize-position 14`. `optimize` one-shot was deliberately NOT used (its
`--join/--simplify/--flatten` defaults would destroy node names + morphs).

## 2. `public/models/glasses.glb` → `glasses.opt.glb` — PASS (≤900 KB)

| | Before | After |
|---|---|---|
| File size | 1,365,620 bytes (1.302 MiB) | **394,236 bytes (385.0 KiB)** — 3.5× smaller |
| Tris | 52,610 (arms 10,124×2 · front 26,082 · lenses 6,280) | **52,610 — unchanged, no simplification per contract** |
| Nodes | `G_Root` > `G_Arm_L`, `G_Arm_R`, `G_Front`, `G_Lenses` | preserved |
| Morph targets | none (correct — fold is runtime) | none |
| Materials | `00_Base.001`, `04_T.001`, `03_Steel.001`, `02_nose.001`, `01_Glasses.001`, `01_Glasses_Side.001` (+ clearcoat/transmission/ior) | preserved, incl. polished lens-edge material for rim-light glow |
| Compression | f32, uncompressed | 14-bit position quant + meshopt high |

Pipeline: `dedup` → `weld` → `quantize --quantize-position 14` → `meshopt --level high
--quantize-position 14`. TEXCOORD kept (harmless at this size; no strip needed).

## 3. three.js load verification (GLTFLoader + MeshoptDecoder) — PASS

Script: `.orchestration/tmp/d1/verify-glbs.mjs` (three 0.186.1, bundled
`meshopt_decoder.module.js`). Full output:

```
mesh Mesh: tris=30940 verts=15693 morphPosCount=0 mat=Case_Graphite
mesh Mesh_1: tris=30940 verts=15693 morphPosCount=0 mat=Velvet_Oxblood
mesh Mesh_2: tris=1776 verts=1332 morphPosCount=0 mat=Case_EdgeMetal
mesh Case_Flap003: tris=23479 verts=14853 morphPosCount=4 mat=Case_Graphite
mesh Case_Flap003_1: tris=17640 verts=8962 morphPosCount=4 mat=Velvet_Oxblood
mesh Case_Flap003_2: tris=564 verts=564 morphPosCount=4 mat=Case_EdgeMetal
mesh Case_Flap003_3: tris=17337 verts=40083 morphPosCount=4 mat=Logo_Gloss
mesh Velvet_Cushion: tris=12814 verts=6600 morphPosCount=0 mat=Velvet_Oxblood
FILE: public/models/case.opt.glb (1467872 bytes)
  nodes: Group:Scene, Object3D:Case_Root, Group:Case_Body, Mesh:Mesh,
         Mesh:Mesh_1, Mesh:Mesh_2, Group:Case_Flap, Mesh:Case_Flap003,
         Mesh:Case_Flap003_1, Mesh:Case_Flap003_2, Mesh:Case_Flap003_3,
         Mesh:Velvet_Cushion
  morphs: Case_Flap003: [Open10, Open20, Open30, Open40] influences=[0,0,0,0] (×4 prims)
  total tris: 135490
  bbox min (m): -0.09000, -0.05438, -0.06014
  bbox max (m): 0.10800, 0.06778, 0.06016
  bbox size mm: 198.00 x 122.16 x 120.29   (X = 198 mm shell length per Phase-3 contract;
    Y/Z span includes morph-target extremes as reported by three's Box3)
  bbox center mm: 9.00, 6.70, 0.01

mesh G_Arm_L_1: tris=2884 verts=1711 morphPosCount=0 mat=00_Base.001
mesh G_Arm_L_2: tris=7080 verts=4008 morphPosCount=0 mat=04_T.001
mesh G_Arm_L_3: tris=160 verts=198 morphPosCount=0 mat=03_Steel.001
mesh G_Arm_R_1: tris=2884 verts=1711 morphPosCount=0 mat=00_Base.001
mesh G_Arm_R_2: tris=7080 verts=4007 morphPosCount=0 mat=04_T.001
mesh G_Arm_R_3: tris=160 verts=198 morphPosCount=0 mat=03_Steel.001
mesh G_Front_1: tris=25068 verts=16652 morphPosCount=0 mat=00_Base.001
mesh G_Front_2: tris=1014 verts=549 morphPosCount=0 mat=02_nose.001
mesh G_Lenses_1: tris=4792 verts=2524 morphPosCount=0 mat=01_Glasses.001
mesh G_Lenses_2: tris=1488 verts=924 morphPosCount=0 mat=01_Glasses_Side.001
FILE: public/models/glasses.opt.glb (394236 bytes)
  nodes: Group:Scene, Object3D:G_Root, Group:G_Arm_L, Mesh:G_Arm_L_1×3,
         Group:G_Arm_R, Mesh:G_Arm_R_1×3, Group:G_Front, Mesh:G_Front_1×2,
         Group:G_Lenses, Mesh:G_Lenses_1×2
  morphs: (none)
  total tris: 52610
  bbox min (m): -0.08336, -0.12783, -0.02056
  bbox max (m): 0.07536, 0.01743, 0.02097
  bbox size mm: 158.73 x 145.26 x 41.53   (OPEN export: front 140 mm + extended arms)
  bbox center mm: -4.00, -55.20, 0.21
```

(GLTF splits multi-material meshes into per-prim meshes at load — hence `Mesh_1`,
`G_Front_1` etc. — group/node names above are the preserved contract names.)

## 4. Logo atlases — PASS

Sources: `assets/web/brands-light/*.png` (8) + `assets/web/insurance-light/*.png` (8);
single-color light knockouts, used unmodified (RGBA-converted, LANCZOS contain-fit only).

- `public/web/atlas-brands.png` **2048×2048** (499,712 bytes), grid **2 cols × 4 rows**,
  cell 1024×512, padding 48 px. Order: maui-jim, ray-ban, prada, miu-miu, persol,
  oakley, tiffany, versace.
- `public/web/atlas-insurers.png` **2048×1024** (226,875 bytes), grid **4 cols × 2 rows**,
  cell 512×512, padding 32 px. Order (B §5): sun-life, medavie-blue-cross, manulife,
  greenshield, canada-life, desjardins, ia-financial-group, empire-life.
- Straight (non-premultiplied) alpha: transparent RGBA canvas, `alpha_composite` paste,
  PNG saved straight. No flatten, no background bake.
- `public/web/atlas-brands.json` + `public/web/atlas-insurers.json`: per logo —
  id, order, source file + size, aspect (e.g. tiffany 8.205, persol 1.598,
  ia-financial 1.831), cell + content pixel rects (top-left origin), cell + content UV
  rects (bottom-left / three.js origin). Drawn sizes recorded (see §3 tables in QA:
  brands widths 665–928 px, insurers uniform 448 px wide).

## 5. Green-fringe trap @400% — PASS (looked, no fringe)

Method: 128–200 px edge crops (tiffany thin strokes, persol detail, IA tall logo,
Medavie letterforms) upscaled NEAREST 4×, saved raw + composited on Void `#050607`.
Crops in `docs/phase4/qa/D/`: `brands-persol-edge@400*.png`,
`brands-tiffany-edge@400*.png`, `insurers-ia-edge@400*.png`,
`insurers-mbc-edge@400*.png`, plus `fringe-contact-sheet.png` (all four on-void).

Measurements (semi-transparent pixels 1–254):
brands atlas edge mean RGB (241,239,235), greenish 0%, dark 0% (n=138,721);
insurers mean (242,240,236), greenish 0%, dark 0% (n=79,707).
All four crops: 0% greenish, 0% dark. Looked at at 400%: clean light-gray
antialiased steps on black, no green/dark halos. Straight-alpha handling confirmed.

## 6. HDRI — PASS

- `public/env/studio_small_08_1k.hdr` (1024×512 Radiance HDR, **1,508,872 bytes**),
  downloaded direct-HTTPS `https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr`.
- Asset **Studio Small 08** (https://polyhaven.com/a/studio_small_08), author **Sergej
  Majboroda**, licence **CC0**; category Studio/Photo Studios/Softbox & Lamp Setups
  (softbox+umbrella, indoor, low contrast) — suited to brief §6b strip-light lens
  reflections. Source + licence recorded in `public/env/SOURCE.md`.
- Validated: magic `#?RADIANCE`, `FORMAT=32-bit_rle_rgbe`, `-Y 512 +X 1024`.

## 7. Files written (lane-owned only)

- `public/models/case.opt.glb`, `public/models/glasses.opt.glb` (raw `case.glb`/`glasses.glb` untouched)
- `public/web/atlas-brands.png/.json`, `public/web/atlas-insurers.png/.json`
  (`public/web/brands-light/`, `insurance-light/` empty placeholder dirs left untouched)
- `public/env/studio_small_08_1k.hdr`, `public/env/SOURCE.md`
- `docs/phase4/qa/D/ASSETS-REPORT.md` (this file) + 9 QA PNGs
- Scratch (not shipped): `.orchestration/tmp/d1/` (pipeline intermediates, scripts, verify output)

## 8. Known issues / notes for downstream lanes

1. `case.opt.glb` requires meshopt + quantization decoders at runtime: self-host
   `meshopt_decoder` (three examples module) and confirm `GLTFLoader` quantization
   support in the app's three version (verified working with three 0.186.1 here).
   `extensionsRequired`: `EXT_meshopt_compression`, `KHR_mesh_quantization`.
2. `Box3` Y/Z spans on the case include morph-target extremes (three expands bounds
   over morphs); runtime framing should use the 198 mm shell length, not the
   122×120 mm reported extremes.
3. `public/web/brands-light/` + `insurance-light/` are empty placeholder dirs; if Lane E/D2
   needs individual files served, copy from `assets/web/*` (request via
   `docs/phase4/requests/` if it falls outside D ownership).
4. HDRI is 1k (≈1.44 MiB). If Lane D2 wants 2k, re-download `studio_small_08_2k.hdr`
   (~5–6 MB, over the §5 1.5 MB env budget — keep 1k unless a swatch proves otherwise).
5. `npm run build` passes; no dev-server Playwright run was needed for this lane
   (no DOM/canvas output yet) — visual verification = 400% fringe crops, looked at.

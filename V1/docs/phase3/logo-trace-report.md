# Phase 3 LOGO — Mechanical trace report (EyeQ logo + light variants)

Date: 2026-09-27 · Agent: PHASE3-LOGO · No Blender MCP used (per task).
Rule compliance: logo NEVER redrawn/redesigned/retyped — all outputs are
mechanical conversions of `assets/source/logo/eyeq-logo-header-original.png`
(800×373, black on transparent). Nothing in `/Users/admin/Downloads/` touched.

## 1. EyeQ logo vectorization

**Method** (script `.orchestration/tmp/logo_trace.py`, fully mechanical):
1. Alpha channel of the original → 4× upscale (3200×1492) with LANCZOS.
2. Threshold at 50% (128) → binary mask.
3. `cv2.findContours` with `RETR_CCOMP` → 13 outer contours + 4 hole
   contours (holes = counters of E letters, eye-ring interior, VISION CARE
   letter counters — all preserved, zero manual edits).
4. `approxPolyDP` ε=0.4 px @4× (0.1 px @1×) for compact smooth curves.
5. SVG: single `fill="#000000"`, `fill-rule="evenodd"`, 13 `<path>` elements,
   no other element types. `viewBox="16 21 777 300"` — tight to the ink bbox
   measured at α>127 (path coordinates stay in full-canvas pixel space, so
   Blender SVG import lands at true scale/position).

**Fidelity verification** (script-internal, cairosvg rasterizer):
- Rendered a full-canvas-viewBox copy of the SVG at 800×373, threshold 50%,
  IoU vs original alpha mask (same threshold).
- **IoU = 0.986165 ≥ 0.985 ✔** (target met on first passing setting, no re-tune needed).
- ε sweep for the record: ε=0.4 → 0.986165 (5697 pts, 66 590 B);
  ε=0.25/0.15/0.0 → 0.986433 (8657 pts, identical output). Residual ~1.4% is
  subpixel edge antialiasing from the prescribed 4×-LANCZOS step, not missing
  geometry — ε=0.4 kept (smaller file, smoother emboss curves).
- Overlay diff (2×, 1600×746): `docs/phase3/logo-trace-diff.png` —
  original-only = red, trace-only = cyan, agreement = light gray. Visual check:
  solid gray artwork, no structural red/cyan regions (edge-subpixel only).

**Outputs:**
| file | content |
|---|---|
| `assets/logo/eyeq-logo.svg` | single-color vector, 13 paths, tight viewBox — feeds P3-CASE emboss (F §4.2: SVG curve → extrude → boolean) |
| `assets/logo/eyeq-logo-white.png` | 800×373, RGB=#FFFFFF, alpha byte-identical to original (56 312 opaque px) — dark-bg use |
| `assets/logo/eyeq-logo-white@2x.png` | 1600×746 rendered FROM the SVG geometry, RGB=#FFFFFF — dark-bg use |
| `assets/logo/READY` | empty marker file ✔ |

## 2. Eyewear brand light variants (`assets/web/brands-light/`, 8/8)

Method (`.orchestration/tmp/logo_variants.py`): convert to RGBA **first**
(palette `miu-miu`/`persol` and LA `ray-ban`/`oakley` — green-RGB-under-tRNS
trap confirmed in source: transparent pixels carry RGB (71,112,76); neutralized
because RGB is overwritten wholesale), set RGB=#F2F0EC, keep alpha exactly,
trim to α>16 bbox + 2% padding per side. Shapes unaltered.
Notable trims: `ray-ban` 2400×2400→2400×1198, `prada` →2277×354,
`miu-miu` →3684×571, `versace` →1230×272. Verified: RGB uniform #F2F0EC in all 8.

**Not cleanly convertible (recorded):** `maui-jim` — the multicolor parrot
plumage (red/orange/blue/green) is flattened to monochrome #F2F0EC per the
recolor instruction; bird silhouette/alpha intact but brand colors lost. If the
design phase wants the parrot in color on black, that file needs a design
decision (light chip or selective recolor) — not an asset edit.

## 3. Insurance light variants (`assets/web/insurance-light/`, 8/8)

Same recolor/trim pipeline. Source-specific handling:
- True-alpha sources (`empire-life` RGBA, `canada-life-min.webp` = PNG data RGBA):
  direct recolor, alpha preserved.
- SVGs (`mbc-logo-en`, `ia-financial-group`): rasterized via cairosvg @1600 px
  wide first, then recolored (all-blue #0094d7 → flat #F2F0EC; dark blues/grays
  of IA → flat #F2F0EC).
- Opaque white-bg sources (`sun-life`, `manulife`, `greenshield` palette;
  `desjardins.webp` = JPEG data, no alpha): mechanical white→alpha
  (α = 255 − min(R,G,B)), then recolor. Verified: background α=0, ink α=255.
- Misleading extensions kept honest: outputs are `canada-life-min.png` and
  `desjardins.png` (real PNGs).

**Not cleanly convertible (recorded):** all color brand marks are flattened —
Sun Life yellow sun, Manulife green bars, Canada Life red block, Desjardins
green hexagon, Empire Life blue+lime mark all become monochrome #F2F0EC
(silhouettes/alpha intact). Same design-phase caveat as the Maui Jim parrot.
`greenshield` (381×132 source) is the lowest-resolution output (331×72 after
trim) — may look soft if displayed large; no higher-res source exists on site.

## 4. Handoff notes for P3-CASE (emboss)
- SVG paths are in 800×373-pixel coordinates with tight viewBox; importAdd todo list:
  - SVG (13 closed paths, evenodd holes) → scale so 777 px width = real logo
    width on flap → extrude 0.2–0.6 mm → boolean (F §4.2 recipe).
- Draco: keep ≥14-bit position quantization on the logo mesh or exclude it
  (F §4.2 risk note).

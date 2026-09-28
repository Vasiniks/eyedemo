"""PHASE3-LOGO step 2: white EyeQ variants + light brand/insurance variants.

Mechanical only - no shape edits:
 - eyeq-logo-white.png: original pixels, RGB set to #FFFFFF, alpha preserved.
 - eyeq-logo-white@2x.png: SVG geometry rendered at 1600x746, RGB #FFFFFF.
 - brands-light/<name>.png (8): RGBA sources -> RGB:=#F2F0EC keep alpha;
   palette/LA sources converted to RGBA FIRST (green-RGB-under-tRNS trap).
 - insurance-light/<name>.png (8): same; opaque white-bg sources get
   mechanical white->alpha (alpha = 255 - min(R,G,B)); SVGs rasterized first.
 - All brand/insurance outputs trimmed to alpha bbox + 2% padding per side.
"""
import io
import numpy as np
from PIL import Image
import os

ROOT = "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"
LIGHT = (242, 240, 236)  # #F2F0EC
os.makedirs(f"{ROOT}/assets/logo", exist_ok=True)
os.makedirs(f"{ROOT}/assets/web/brands-light", exist_ok=True)
os.makedirs(f"{ROOT}/assets/web/insurance-light", exist_ok=True)
log = []


def recolor_light(img_rgba):
    """Set RGB to LIGHT, preserve alpha exactly."""
    a = np.array(img_rgba)
    out = np.empty_like(a)
    out[..., 0], out[..., 1], out[..., 2] = LIGHT
    out[..., 3] = a[..., 3]
    return Image.fromarray(out)


def white_to_alpha(img_rgb):
    """Mechanical white-bg -> alpha: alpha = 255 - min(R,G,B)."""
    a = np.array(img_rgb.convert("RGB")).astype(np.int16)
    alpha = (255 - a.min(axis=2)).astype(np.uint8)
    return alpha


def trim_pad(img_rgba, thresh=16, pad_frac=0.02):
    alpha = np.array(img_rgba)[..., 3]
    ys, xs = np.where(alpha > thresh)
    assert len(xs), "empty alpha"
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
    tw, th = x1 - x0 + 1, y1 - y0 + 1
    px, py = int(round(tw * pad_frac)), int(round(th * pad_frac))
    W, H = img_rgba.size
    box = (max(0, x0 - px), max(0, y0 - py), min(W, x1 + 1 + px), min(H, y1 + 1 + py))
    return img_rgba.crop(box), (x0, y0, x1, y1), box


# ---- 1. EyeQ white variants ----
src = Image.open(f"{ROOT}/assets/source/logo/eyeq-logo-header-original.png").convert("RGBA")
a = np.array(src)
w = np.empty_like(a)
w[..., 0], w[..., 1], w[..., 2] = (255, 255, 255)
w[..., 3] = a[..., 3]
Image.fromarray(w).save(f"{ROOT}/assets/logo/eyeq-logo-white.png")
log.append(f"eyeq-logo-white.png: 800x373 RGBA, RGB=255, alpha unas bytes identicas "
           f"al original (opacos={(a[...,3]>127).sum()})")

import cairosvg
svg = open(f"{ROOT}/assets/logo/eyeq-logo.svg").read()
full = svg.split("viewBox=\"")[1]
vb = full.split("\"")[0]  # tight bbox viewBox; paths are full-canvas coords
W0, H0 = 800, 373
render = svg.replace(f'viewBox="{vb}"', f'viewBox="0 0 {W0} {H0}"', 1)
png2 = cairosvg.svg2png(bytestring=render.encode(), write_to=None,
                        output_width=W0 * 2, output_height=H0 * 2)
r2 = Image.open(io.BytesIO(png2)).convert("RGBA")
Image.fromarray(np.dstack([
    np.full((H0*2, W0*2), 255, np.uint8)] * 3 +
    [np.array(r2)[..., 3]])).save(f"{ROOT}/assets/logo/eyeq-logo-white@2x.png")
log.append("eyeq-logo-white@2x.png: 1600x746 renderizado desde el SVG (geometria "
           "vectorial), RGB=255, alfa del trazado")

open(f"{ROOT}/assets/logo/READY", "w").write("")
log.append("assets/logo/READY: marcador creado")

# ---- 2. Brand light variants (8) ----
BRANDS = ["maui-jim", "ray-ban", "prada", "miu-miu", "persol", "oakley",
          "tiffany", "versace"]
for name in BRANDS:
    src_p = f"{ROOT}/assets/source/brands/{name}.png"
    im = Image.open(src_p)
    pre = f"{im.size} {im.mode}"
    rgba = im.convert("RGBA")  # palette/LA -> RGBA FIRST (green-box trap)
    out = recolor_light(rgba)
    out, tight, box = trim_pad(out)
    out.save(f"{ROOT}/assets/web/brands-light/{name}.png")
    log.append(f"brands {name}.png: {pre} -> RGBA -> RGB#F2F0EC, trim {tight} "
               f"+2% -> {out.size}")

# ---- 3. Insurance light variants (8) ----
INS = ["sun-life.png", "mbc-logo-en.svg", "manulife.png", "greenshield.png",
       "canada-life-min.webp", "desjardins.webp", "ia-financial-group.svg",
       "empire-life.png"]
for fn in INS:
    name = fn.rsplit(".", 1)[0]
    src_p = f"{ROOT}/assets/source/insurance/{fn}"
    if fn.endswith(".svg"):
        png = cairosvg.svg2png(url=src_p, write_to=None, output_width=1600)
        rgba = Image.open(io.BytesIO(png)).convert("RGBA")
        pre = f"SVG -> raster {rgba.size} RGBA"
    else:
        im = Image.open(src_p)
        pre = f"{im.size} {im.mode}"
        if im.mode == "RGBA":
            rgba = im.convert("RGBA")
            pre += " (alfa propio)"
        elif im.mode == "LA":
            rgba = im.convert("RGBA")
        else:  # P / RGB / palette / JPEG-data: blanco -> alfa mecanico
            rgb = im.convert("RGB")
            alpha = white_to_alpha(rgb)
            rgba = rgb.copy()
            rgba.putalpha(Image.fromarray(alpha))
            pre += " (fondo blanco -> alfa 255-minRGB)"
    out = recolor_light(rgba)
    out, tight, box = trim_pad(out)
    out.save(f"{ROOT}/assets/web/insurance-light/{name}.png")
    log.append(f"insurance {name}.png: {pre} -> RGB#F2F0EC, trim {tight} "
               f"+2% -> {out.size}")

print("\n".join(log))
with open(f"{ROOT}/.orchestration/tmp/logo_variants.log", "w") as f:
    f.write("\n".join(log) + "\n")

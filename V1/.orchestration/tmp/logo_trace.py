"""PHASE3-LOGO step 1: mechanical trace of official EyeQ logo PNG -> SVG.

Method (fully mechanical, no manual shape edits):
  1. Load assets/source/logo/eyeq-logo-header-original.png (800x373 RGBA).
  2. Take alpha channel, upscale 4x with LANCZOS, threshold at 50% (128).
  3. cv2.findContours RETR_CCOMP -> outer contours + hole contours (hierarchy).
  4. Light polygon simplification (approxPolyDP) tuned to keep IoU >= 0.985.
  5. Emit single-color SVG, viewBox tight to ink bbox, fill-rule evenodd.
  6. Verify: render a full-canvas-viewBox copy at 800x373 with cairosvg,
     threshold at 50%, compute IoU vs original alpha mask; write 2x overlay diff.
"""
import cv2
import numpy as np
from PIL import Image
import io, os

ROOT = "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"
SRC = f"{ROOT}/assets/source/logo/eyeq-logo-header-original.png"
TMP = f"{ROOT}/.orchestration/tmp"
OUT_SVG = f"{ROOT}/assets/logo/eyeq-logo.svg"
DIFF_PNG = f"{ROOT}/docs/phase3/logo-trace-diff.png"
os.makedirs(f"{ROOT}/assets/logo", exist_ok=True)
os.makedirs(f"{ROOT}/docs/phase3", exist_ok=True)

W, H = 800, 373
SCALE = 4  # upscale factor before tracing

im = Image.open(SRC)
assert im.size == (W, H), im.size
a = np.array(im)
alpha = a[..., 3]
orig_mask = alpha > 127  # 50% threshold
print(f"orig opaque px: {orig_mask.sum()} ({orig_mask.mean()*100:.2f}%)")

ys, xs = np.where(orig_mask)
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
print(f"ink bbox (alpha>127): ({x0},{y0})-({x1},{y1}) -> w={x1-x0+1} h={y1-y0+1}")

# 4x upscale of alpha with high-quality filter, then threshold
up = np.array(Image.fromarray(alpha).resize((W * SCALE, H * SCALE), Image.LANCZOS))
mask4 = (up > 127).astype(np.uint8) * 255

contours, hierarchy = cv2.findContours(mask4, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
hier = hierarchy[0]
print(f"contours found: {len(contours)}")

# Organize: outer (parent==-1) with children holes
outers = []
children_of = {}
for i, h in enumerate(hier):
    parent = h[3]
    if parent == -1:
        outers.append(i)
        children_of[i] = []
    # else handled below
for i, h in enumerate(hier):
    parent = h[3]
    if parent != -1:
        # attach to top-level ancestor
        anc = parent
        while hier[anc][3] != -1:
            anc = hier[anc][3]
        children_of.setdefault(anc, []).append(i)
n_holes = sum(len(v) for v in children_of.values())
print(f"outer contours: {len(outers)}, hole contours: {n_holes}")


def fmt(v):
    s = f"{v:.2f}"
    return s.rstrip("0").rstrip(".") if "." in s else s


def path_of(cnt, eps):
    approx = cv2.approxPolyDP(cnt, eps, True)
    pts = approx[:, 0, :].astype(np.float64) / SCALE
    d = "M" + "L".join(f"{fmt(x)},{fmt(y)}" for x, y in pts) + "Z"
    return d, len(pts)


def build_svg(eps):
    parts = []
    npts = 0
    for oi in outers:
        d, n = path_of(contours[oi], eps)
        npts += n
        for ci in children_of.get(oi, []):
            dh, nh = path_of(contours[ci], eps)
            npts += nh
            d += dh
        parts.append(f"<path d=\"{d}\"/>")
    body = "".join(parts)
    svg = (
        f"<svg xmlns=\"http://www.w3.org/2000/svg\" "
        f"viewBox=\"{x0} {y0} {x1-x0+1} {y1-y0+1}\" "
        f"fill=\"#000000\" fill-rule=\"evenodd\">{body}</svg>\n"
    )
    return svg, npts


def iou_of(svg_text):
    """Render full-canvas copy at 800x373, threshold, IoU vs original mask."""
    import cairosvg
    full = svg_text.replace(
        f'viewBox="{x0} {y0} {x1-x0+1} {y1-y0+1}"', f'viewBox="0 0 {W} {H}"', 1
    )
    # paths are in full-canvas coords already, so rendering with 0 0 W H works
    png = cairosvg.svg2png(bytestring=full.encode(), write_to=None,
                           output_width=W, output_height=H)
    r = np.array(Image.open(io.BytesIO(png)))
    tm = r[..., 3] > 127
    inter = np.logical_and(orig_mask, tm).sum()
    union = np.logical_or(orig_mask, tm).sum()
    return inter / union, tm


best = None
for eps in (0.4, 0.25, 0.0):
    svg, npts = build_svg(eps)
    iou, _ = iou_of(svg)
    print(f"eps={eps}: points={npts} bytes={len(svg)} IoU={iou:.6f}")
    best = (eps, svg, iou)
    if iou >= 0.985:
        break

eps, svg, iou = best
assert iou >= 0.985, f"IoU {iou} below target"
with open(OUT_SVG, "w") as f:
    f.write(svg)
print(f"WROTE {OUT_SVG} ({len(svg)} bytes, eps={eps}, IoU={iou:.6f})")

# 2x overlay diff: original red / trace cyan, both=white, neither=near-black
import cairosvg
full = svg.replace(
    f'viewBox="{x0} {y0} {x1-x0+1} {y1-y0+1}"', f'viewBox="0 0 {W} {H}"', 1
)
png2 = cairosvg.svg2png(bytestring=full.encode(), write_to=None,
                        output_width=W * 2, output_height=H * 2)
tm2 = np.array(Image.open(io.BytesIO(png2)))[..., 3] > 127
orig2 = np.array(Image.fromarray((orig_mask.astype(np.uint8)) * 255)
                 .resize((W * 2, H * 2), Image.NEAREST)) > 127
diff = np.zeros((H * 2, W * 2, 3), np.uint8) + 10
both = np.logical_and(orig2, tm2)
o_only = np.logical_and(orig2, ~tm2)
t_only = np.logical_and(~orig2, tm2)
diff[both] = (235, 235, 235)
diff[o_only] = (255, 45, 45)
diff[t_only] = (0, 229, 255)
Image.fromarray(diff).save(DIFF_PNG)
print(f"WROTE {DIFF_PNG} orig-only={o_only.sum()} trace-only={t_only.sum()} both={both.sum()}")
print(f"FINAL IoU={iou:.6f}")

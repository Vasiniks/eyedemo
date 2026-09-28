"""Build straight-alpha logo atlases with contain-fit cells + UV JSON.
Brands: 2048x2048, 2 cols x 4 rows (cell 1024x512), pad 48.
Insurers: 2048x1024, 4 cols x 2 rows (cell 512x512), pad 32.
Straight alpha: transparent RGBA canvas, LANCZOS resize, alpha_composite paste.
"""
from PIL import Image
import json, os

ROOT = '/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1'
BRANDS_ORDER = ['maui-jim','ray-ban','prada','miu-miu','persol','oakley','tiffany','versace']
INSURERS_ORDER = [
  ('sun-life','sun-life.png'),
  ('medavie-blue-cross','mbc-logo-en.png'),
  ('manulife','manulife.png'),
  ('greenshield','greenshield.png'),
  ('canada-life','canada-life-min.png'),
  ('desjardins','desjardins.png'),
  ('ia-financial-group','ia-financial-group.png'),
  ('empire-life','empire-life.png'),
]

def build(src_list, atlas_w, atlas_h, cols, rows, pad, out_png, out_json, label):
    cell_w = atlas_w // cols
    cell_h = atlas_h // rows
    atlas = Image.new('RGBA', (atlas_w, atlas_h), (0,0,0,0))
    entries = []
    for i, (lid, src) in enumerate(src_list):
        col = i % cols
        row = i // cols
        cx, cy = col*cell_w, row*cell_h
        im = Image.open(src).convert('RGBA')
        sw, sh = im.size
        aspect = sw/sh
        avail_w = cell_w - 2*pad
        avail_h = cell_h - 2*pad
        scale = min(avail_w/sw, avail_h/sh)
        dw, dh = max(1, round(sw*scale)), max(1, round(sh*scale))
        resized = im.resize((dw, dh), Image.LANCZOS)
        dx = cx + (cell_w - dw)//2
        dy = cy + (cell_h - dh)//2
        # paste via alpha_composite on a temp layer to keep straight alpha
        layer = Image.new('RGBA', (atlas_w, atlas_h), (0,0,0,0))
        layer.alpha_composite(resized, (dx, dy))
        # NOTE: alpha_composite adds premultiplied internally but stores straight; ok
        atlas = Image.alpha_composite(atlas, layer)
        # UV rects: pixels top-left origin; uv bottom-left (three.js) origin
        # content rect
        content = {'x': dx, 'y': dy, 'w': dw, 'h': dh}
        cell = {'x': cx, 'y': cy, 'w': cell_w, 'h': cell_h}
        uv_content = {
          'u0': dx/atlas_w, 'v0': 1-(dy+dh)/atlas_h,
          'u1': (dx+dw)/atlas_w, 'v1': 1-dy/atlas_h,
        }
        uv_cell = {
          'u0': cx/atlas_w, 'v0': 1-(cy+cell_h)/atlas_h,
          'u1': (cx+cell_w)/atlas_w, 'v1': 1-cy/atlas_h,
        }
        entries.append({
          'id': lid, 'order': i,
          'source': os.path.basename(src),
          'source_size': {'w': sw, 'h': sh},
          'aspect': round(aspect, 5),
          'drawn_size': {'w': dw, 'h': dh},
          'cell_px': cell, 'content_px': content,
          'cell_uv_bl': uv_cell, 'content_uv_bl': uv_content,
        })
        print(f'{label} [{i}] {lid}: src {sw}x{sh} aspect {aspect:.3f} -> drawn {dw}x{dh} at ({dx},{dy}) cell ({cx},{cy},{cell_w}x{cell_h})')
    os.makedirs(os.path.dirname(out_png), exist_ok=True)
    atlas.save(out_png, 'PNG')
    print(f'saved {out_png} ({atlas_w}x{atlas_h}) {os.path.getsize(out_png)} bytes')
    meta = {'atlas': os.path.basename(out_png), 'width': atlas_w, 'height': atlas_h,
            'cols': cols, 'rows': rows, 'cell': {'w': cell_w, 'h': cell_h},
            'padding': pad, 'fit': 'contain', 'alpha': 'straight (non-premultiplied)',
            'uv_origin': 'bottom-left (three.js convention); pixel rects top-left origin'}
    with open(out_json, 'w') as f:
        json.dump({'meta': meta, 'logos': entries}, f, indent=2)
    print(f'saved {out_json}')
    return atlas, entries

brands_src = [(b, f'{ROOT}/assets/web/brands-light/{b}.png') for b in BRANDS_ORDER]
ins_src = [(lid, f'{ROOT}/assets/web/insurance-light/{fn}') for lid, fn in INSURERS_ORDER]

a1, e1 = build(brands_src, 2048, 2048, 2, 4, 48,
  f'{ROOT}/public/web/atlas-brands.png', f'{ROOT}/public/web/atlas-brands.json', 'brands')
a2, e2 = build(ins_src, 2048, 1024, 4, 2, 32,
  f'{ROOT}/public/web/atlas-insurers.png', f'{ROOT}/public/web/atlas-insurers.json', 'insurers')

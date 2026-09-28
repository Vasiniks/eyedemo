"""Green-fringe 400% check: crop logo edges from atlases, upscale NEAREST 4x, save QA crops.
Also print edge-pixel RGB stats for semi-transparent pixels (should be light, not green/black)."""
from PIL import Image
import os

ROOT = '/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1'
QA = f'{ROOT}/docs/phase4/qa/D'
os.makedirs(QA, exist_ok=True)

def edge_stats(im, name):
    # semi-transparent pixels 1..254
    px = im.load()
    w, h = im.size
    n = 0; rsum=gsum=bsum=0; greenish=0; dark=0
    for y in range(h):
        for x in range(w):
            r,g,b,a = px[x,y]
            if 1 <= a <= 254:
                n+=1; rsum+=r; gsum+=g; bsum+=b
                if g > r+30 and g > b+30: greenish+=1
                if r<80 and g<80 and b<80: dark+=1
    if n:
        print(f'{name}: edge px n={n} mean RGB=({rsum//n},{gsum//n},{bsum//n}) greenish={greenish} ({100*greenish//max(n,1)}%) dark={dark} ({100*dark//max(n,1)}%)')
    else:
        print(f'{name}: no edge pixels')
    return n

for atlas_path, crops in [
    (f'{ROOT}/public/web/atlas-brands.png', [
        # (crop_name, box l,u,r,b in atlas px, why)
        ('brands-persol-edge', (179, 1072, 179+160, 1072+160), 'persol top-left edge, detailed strokes'),
        ('brands-tiffany-edge', (48, 1735, 48+200, 1735+113), 'tiffany thin strokes full-row slice'),
    ]),
    (f'{ROOT}/public/web/atlas-insurers.png', [
        ('insurers-ia-edge', (1056, 645, 1056+160, 645+160), 'ia-financial tallest logo edge'),
        ('insurers-mbc-edge', (544, 222, 544+200, 222+67), 'medavie thin letterforms slice'),
    ]),
]:
    atlas = Image.open(atlas_path).convert('RGBA')
    print('===', atlas_path, atlas.size)
    edge_stats(atlas, atlas_path.split('/')[-1])
    for cname, box, why in crops:
        crop = atlas.crop(box)
        edge_stats(crop, cname)
        big = crop.resize((crop.width*4, crop.height*4), Image.NEAREST)
        # put on checker? No - on dark #050607 to mimic film, plus keep transparency visible.
        # Save two versions: raw crop @400% (transparent) and on-void composite.
        out_raw = f'{QA}/{cname}@400.png'
        big.save(out_raw)
        # composite on Void for fringe visibility
        bg = Image.new('RGBA', big.size, (5,6,7,255))
        comp = Image.alpha_composite(bg, big).convert('RGB')
        out_void = f'{QA}/{cname}@400-on-void.png'
        comp.save(out_void)
        print(f'saved {out_raw} + {out_void} ({why})')

print('done')

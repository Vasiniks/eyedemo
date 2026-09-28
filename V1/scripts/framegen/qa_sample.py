"""FRAMEGEN QA: pick 12 interpolated frames (highest motion, biased to segments
70-145, 235-325, 325-411), save full frame + 2x center crop to docs/phase4/qa/v4/.
Also verifies continuity/count and writes public/v1film/hd.json."""
import os, csv, json
import numpy as np, cv2

ROOT = "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"
HD = f"{ROOT}/public/v1film/hd"
QA = f"{ROOT}/docs/phase4/qa/v4"
NSRC = 3588
EXPECTED = 3 * (NSRC - 1) + 1  # 10762

files = sorted(f for f in os.listdir(HD) if f.endswith(".webp"))
print(f"files={len(files)} expected={EXPECTED}")
missing = [i for i in range(1, EXPECTED + 1) if f"f_{i:05d}.webp" not in set(files)]
print(f"missing={len(missing)} {missing[:10]}")
assert len(files) == EXPECTED and not missing, "INCOMPLETE - rerun pipeline first"

rows = list(csv.DictReader(open(f"{ROOT}/scripts/framegen/scores.csv")))
print(f"scores rows={len(rows)} replaced={sum(int(r['replaced']) for r in rows)}")

SEGS = [(70, 145), (235, 325), (325, 411)]
picks = []
used = set()
for lo, hi in SEGS:
    cand = [r for r in rows if lo <= int(r["src"]) <= hi]
    cand.sort(key=lambda r: float(r["cov"]), reverse=True)
    for r in cand:
        key = (r["src"], r["t"])
        if key not in used:
            picks.append(r)
            used.add(key)
        if len([p for p in picks if lo <= int(p["src"]) <= hi]) >= 4:
            break
# top up to 12 from global top-motion if segments short
cand = sorted(rows, key=lambda r: float(r["cov"]), reverse=True)
for r in cand:
    if len(picks) >= 12:
        break
    key = (r["src"], r["t"])
    if key not in used:
        picks.append(r)
        used.add(key)
picks = picks[:12]
print(f"picks={[(p['src'], p['t'], round(float(p['cov']),3), p['replaced']) for p in picks]}")

for j, p in enumerate(picks):
    s, t = int(p["src"]), float(p["t"])
    k = 1 if t < 0.5 else 2
    idx = 3 * s - 2 + k
    img = cv2.imread(f"{HD}/f_{idx:05d}.webp", cv2.IMREAD_COLOR)
    h, w = img.shape[:2]
    cw, ch = 480, 273
    x0, y0 = w // 2 - cw // 2, h // 2 - ch // 2
    crop = img[y0:y0 + ch, x0:x0 + cw]
    crop2x = cv2.resize(crop, (cw * 2, ch * 2), interpolation=cv2.INTER_LANCZOS4)
    tag = "REPLACED" if p["replaced"] == "1" else "RIFE"
    cv2.imwrite(f"{QA}/framegen-{j+1:02d}-src{s}-t{t:.2f}-{tag}.png",
                np.hstack([cv2.resize(img, (960, 546)), crop2x]))
    print(f"sample {j+1}: out f_{idx:05d} src={s} t={t:.2f} {tag} cov={p['cov']} r={p['r']}")

n_repl = sum(int(r["replaced"]) for r in rows)
sidecar = {"count": EXPECTED, "w": 1920, "h": 1092, "interp": 3,
           "sourceCount": NSRC, "realEvery": 3, "pattern": "f_%05d.webp",
           "replaced": n_repl}
json.dump(sidecar, open(f"{ROOT}/public/v1film/hd.json", "w"), indent=2)
print("hd.json:", sidecar)
total = sum(os.path.getsize(f"{HD}/{f}") for f in files)
print(f"total size={total/1e6:.0f}MB avg={total/len(files)/1024:.0f}KB")
print("QA DONE", flush=True)

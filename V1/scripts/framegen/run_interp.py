"""FRAMEGEN pipeline: 3588 src frames (3024x1720 webp) -> 10762 HD frames (1920x1092 webp q72).
RIFE-HDv3 v4.6 on MPS, coarse flow scales [8,4,2], manual t=1/3,2/3 via flow scaling.
Quality gate: motion-masked relative MAD r; r>0.55 -> replace with nearest real.
Streaming, resumable (skips existing outputs), chunked logging. Chunk ~= 200 pairs.
Output: public/v1film/hd/f_%05d.webp, count = 3*(3588-1)+1 = 10762.
Real frames at (i-1)%3==0 (i=1,4,7,...)."""
import os, sys, time, csv
import numpy as np, cv2
from PIL import Image
from concurrent.futures import ThreadPoolExecutor

ROOT = "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"
sys.path.insert(0, f"{ROOT}/scripts/framegen/bin/Practical-RIFE")
sys.path.insert(0, f"{ROOT}/scripts/framegen/bin/Practical-RIFE/train_log")

SRC = f"{ROOT}/render-repo/out/frames"
DST = f"{ROOT}/public/v1film/hd"
W, H, Q, METHOD = 1920, 1092, 72, 2
NSRC, CHUNK, T_FAIL = 3588, 200, 0.55
SCALES = [8, 4, 2]
os.makedirs(DST, exist_ok=True)

import torch
from model.warplayer import warp
from IFNet_HDv3 import IFNet

device = torch.device("mps")
net = IFNet()
sd = torch.load(f"{ROOT}/scripts/framegen/bin/Practical-RIFE/train_log/flownet.pkl", map_location="cpu")
net.load_state_dict({k.replace("module.", ""): v for k, v in sd.items()})
net.to(device).eval()
torch.set_grad_enabled(False)
print("RIFE v4.6-HD on MPS ready", flush=True)

pool = ThreadPoolExecutor(max_workers=8)
scores_path = f"{ROOT}/scripts/framegen/scores.csv"
new_scores = not os.path.exists(scores_path)
score_f = open(scores_path, "a", newline="")
score_w = csv.writer(score_f)
if new_scores:
    score_w.writerow(["src", "t", "cov", "r", "replaced"])

def load_hd_bgr(n):
    im = cv2.imread(f"{SRC}/f_{n:05d}.webp", cv2.IMREAD_COLOR)
    return cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)

def to_t(bgr):
    rgb = bgr[..., ::-1]
    t = torch.from_numpy(rgb.transpose(2, 0, 1).copy()).unsqueeze(0).to(device) / 255.0
    return torch.nn.functional.pad(t, (0, 0, 0, 28), mode="reflect")

def save_webp(bgr, idx):
    rgb = bgr[..., ::-1]
    Image.fromarray(np.ascontiguousarray(rgb)).save(
        f"{DST}/f_{idx:05d}.webp", "WEBP", quality=Q, method=METHOD)

def out_idx(s, k):
    return 3 * s - 2 + k  # k=0 real(s), 1 t=1/3, 2 t=2/3

def gate(a_bgr, b_bgr, i_bgr, t):
    """Return (pass: bool, r, cov)."""
    sa = cv2.resize(a_bgr, (480, 273))
    sb = cv2.resize(b_bgr, (480, 273))
    si = cv2.resize(i_bgr, (480, 273))
    ga = cv2.cvtColor(sa, cv2.COLOR_BGR2GRAY).astype(np.float32)
    gb = cv2.cvtColor(sb, cv2.COLOR_BGR2GRAY).astype(np.float32)
    d = cv2.GaussianBlur(np.abs(ga - gb), (5, 5), 1.0)
    m = d > 6.0
    cov = float(m.mean())
    if cov < 0.002:
        return True, 0.0, cov
    gi = cv2.cvtColor(si, cv2.COLOR_BGR2GRAY).astype(np.float32)
    blend = ((1 - t) * ga + t * gb)
    r = float(np.abs(gi - blend)[m].mean() / (d[m].mean() + 1.0))
    return (r <= T_FAIL), r, cov

def interp_pair(A, B):
    I0p, I1p = to_t(A), to_t(B)
    with torch.no_grad():
        fl, mask, _ = net(torch.cat((I0p, I1p), 1), SCALES)
        f = fl[2]
        outs = []
        for t in (1 / 3, 2 / 3):
            w0 = warp(I0p, f[:, :2] * (2 * t))
            w1 = warp(I1p, f[:, 2:4] * (2 * (1 - t)))
            o = (w0 * mask + w1 * (1 - mask)).clamp(0, 1)[:, :, :H, :]
            arr = (o[0].cpu().numpy().transpose(1, 2, 0) * 255).astype(np.uint8)
            outs.append(arr[..., ::-1].copy())  # BGR
    return outs

start_all = time.time()
replaced_total = 0
A = None  # cached BGR of src s
pairs = list(range(1, NSRC))  # 1..3587
nchunks = (len(pairs) + CHUNK - 1) // CHUNK
for ci in range(nchunks):
    t_chunk = time.time()
    chunk_pairs = pairs[ci * CHUNK:(ci + 1) * CHUNK]
    futs = []
    replaced_chunk = 0
    for s in chunk_pairs:
        if A is None:
            A = load_hd_bgr(s)
        B = load_hd_bgr(s + 1)
        i1_path = f"{DST}/f_{out_idx(s,1):05d}.webp"
        i2_path = f"{DST}/f_{out_idx(s,2):05d}.webp"
        r0_path = f"{DST}/f_{out_idx(s,0):05d}.webp"
        need_i = [not os.path.exists(i1_path), not os.path.exists(i2_path)]
        if not os.path.exists(r0_path):
            futs.append(pool.submit(save_webp, A, out_idx(s, 0)))
        if any(need_i):
            outs = interp_pair(A, B)
            for k, (t, need) in enumerate(zip((1/3, 2/3), need_i)):
                if not need:
                    continue
                ok, r, cov = gate(A, B, outs[k], t)
                if not ok:
                    outs[k] = (B if t > 0.5 else A).copy()
                    replaced_chunk += 1
                    score_w.writerow([s, f"{t:.4f}", f"{cov:.4f}", f"{r:.3f}", 1])
                else:
                    score_w.writerow([s, f"{t:.4f}", f"{cov:.4f}", f"{r:.3f}", 0])
                futs.append(pool.submit(save_webp, outs[k], out_idx(s, k + 1)))
        A = B
    # wait for chunk encodes (bounds RAM), keep A cached for next chunk
    for f_ in futs:
        f_.result()
    score_f.flush()
    replaced_total += replaced_chunk
    dt = time.time() - t_chunk
    el = time.time() - start_all
    done = (ci + 1) * CHUNK
    eta = el / min(done, len(pairs)) * len(pairs) - el
    print(f"chunk {ci+1}/{nchunks} pairs {chunk_pairs[0]}-{chunk_pairs[-1]} "
          f"{dt:.0f}s repl={replaced_chunk} elapsed={el/60:.1f}m eta={eta/60:.1f}m", flush=True)
    torch.mps.empty_cache()

# final real frame 3588 -> 10762
if not os.path.exists(f"{DST}/f_{3*NSRC-2:05d}.webp"):
    save_webp(A if A is not None else load_hd_bgr(NSRC), 3 * NSRC - 2)
pool.shutdown()
score_f.close()
n_files = len([f for f in os.listdir(DST) if f.endswith(".webp")])
print(f"DONE files={n_files} expected={3*(NSRC-1)+1} replaced_total(see scores.csv) elapsed={(time.time()-start_all)/60:.1f}m", flush=True)

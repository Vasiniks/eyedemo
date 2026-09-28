"""FRAMEGEN calibration: SSIM(interp vs linear blend) on critical segments + encode timing."""
import sys, time, io
import numpy as np, cv2
from PIL import Image

ROOT = "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"
sys.path.insert(0, f"{ROOT}/scripts/framegen/bin/Practical-RIFE")
sys.path.insert(0, f"{ROOT}/scripts/framegen/bin/Practical-RIFE/train_log")
import torch
from model.warplayer import warp
from IFNet_HDv3 import IFNet

SRC = f"{ROOT}/render-repo/out/frames"
W, H = 1920, 1092

def load_hd(n):
    im = cv2.imread(f"{SRC}/f_{n:05d}.webp", cv2.IMREAD_COLOR)
    return cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)  # BGR uint8

def ssim_gray(a, b):
    a = a.astype(np.float32); b = b.astype(np.float32)
    mu_a = cv2.GaussianBlur(a, (11, 11), 1.5)
    mu_b = cv2.GaussianBlur(b, (11, 11), 1.5)
    mu_a2, mu_b2, mu_ab = mu_a**2, mu_b**2, mu_a * mu_b
    sa2 = cv2.GaussianBlur(a * a, (11, 11), 1.5) - mu_a2
    sb2 = cv2.GaussianBlur(b * b, (11, 11), 1.5) - mu_b2
    sab = cv2.GaussianBlur(a * b, (11, 11), 1.5) - mu_ab
    C1, C2 = 6.5025, 58.5225
    m = ((2 * mu_ab + C1) * (2 * sab + C2)) / ((mu_a2 + mu_b2 + C1) * (sa2 + sb2 + C2))
    return float(m.mean())

device = torch.device("mps")
net = IFNet()
sd = torch.load(f"{ROOT}/scripts/framegen/bin/Practical-RIFE/train_log/flownet.pkl", map_location="cpu")
net.load_state_dict({k.replace("module.", ""): v for k, v in sd.items()})
net.to(device).eval()
torch.set_grad_enabled(False)

def interp(a, b, t):
    I0 = torch.from_numpy(a[..., ::-1].transpose(2, 0, 1).copy()).float().unsqueeze(0).to(device) / 255.0
    I1 = torch.from_numpy(b[..., ::-1].transpose(2, 0, 1).copy()).float().unsqueeze(0).to(device) / 255.0
    I0p = torch.nn.functional.pad(I0, (0, 0, 0, 28), mode="reflect")
    I1p = torch.nn.functional.pad(I1, (0, 0, 0, 28), mode="reflect")
    with torch.no_grad():
        flow_list, mask, _ = net(torch.cat((I0p, I1p), 1), [4, 2, 1])
        f = flow_list[2]
        w0 = warp(I0p, f[:, :2] * (2 * t))
        w1 = warp(I1p, f[:, 2:4] * (2 * (1 - t)))
        out = (w0 * mask + w1 * (1 - mask)).clamp(0, 1)[:, :, :H, :]
    return (out[0].cpu().numpy().transpose(1, 2, 0) * 255).astype(np.uint8)[..., ::-1]  # BGR

pairs = [72, 100, 140, 240, 280, 320, 330, 360, 400]
print("pair | t=1/3 ssim | t=2/3 ssim | infer_s", flush=True)
for s in pairs:
    a, b = load_hd(s), load_hd(s + 1)
    ga = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
    gb = cv2.cvtColor(b, cv2.COLOR_BGR2GRAY)
    t0 = time.time()
    outs = {}
    for t in (1/3, 2/3):
        o = interp(a, b, t)
        outs[t] = o
        blend = ((1 - t) * a + t * b).astype(np.uint8)
        go = cv2.cvtColor(o, cv2.COLOR_BGR2GRAY)
        gbl = cv2.cvtColor(blend, cv2.COLOR_BGR2GRAY)
        sc = cv2.resize(go, (480, 273)); sb = cv2.resize(gbl, (480, 273))
        print(f"{s} t={t:.2f} ssim={ssim_gray(sc, sb):.4f}", flush=True)
    dt = time.time() - t0
    print(f"pair {s}: {dt:.2f}s total", flush=True)
    cv2.imwrite(f"/tmp/framegen_cal_{s}.png", np.hstack([a, outs[1/3], outs[2/3], b]))

# encode timing
a = load_hd(300)
rgb = cv2.cvtColor(a, cv2.COLOR_BGR2RGB)
for method in (1, 2, 4):
    t0 = time.time()
    for _ in range(3):
        buf = io.BytesIO()
        Image.fromarray(rgb).save(buf, "WEBP", quality=72, method=method)
    print(f"PIL webp q72 method={method}: {(time.time()-t0)/3*1000:.0f}ms size={buf.tell()//1024}KB", flush=True)
cv2.imwrite("/tmp/framegen_cal_src.png", a)
t0 = time.time()
for _ in range(3):
    cv2.imwrite("/tmp/cw.webp", a, [cv2.IMWRITE_WEBP_QUALITY, 72])
import os
print(f"cv2 webp q72: {(time.time()-t0)/3*1000:.0f}ms size={os.path.getsize('/tmp/cw.webp')//1024}KB", flush=True)
print("CALIB DONE", flush=True)

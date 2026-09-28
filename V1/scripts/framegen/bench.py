"""FRAMEGEN benchmark: RIFE-HDv3 v4.6 on MPS vs DISOpticalFlow at 1920x1092."""
import sys, time
import numpy as np, cv2
from PIL import Image

SRC = "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1/render-repo/out/frames"

def load_hd(n):
    im = Image.open(f"{SRC}/f_{n:05d}.webp").convert("RGB")
    return im.resize((1920, 1092), Image.LANCZOS)

a = np.asarray(load_hd(300))
b = np.asarray(load_hd(301))
print("src pair loaded", a.shape, flush=True)

# --- DISOpticalFlow timing ---
for preset in (cv2.DISOPTICALFLOW_PRESET_ULTRAFAST, cv2.DISOPTICALFLOW_PRESET_FAST,
               cv2.DISOPTICALFLOW_PRESET_MEDIUM):
    dis = cv2.DISOpticalFlow_create(preset)
    ga = cv2.cvtColor(a, cv2.COLOR_RGB2GRAY)
    gb = cv2.cvtColor(b, cv2.COLOR_RGB2GRAY)
    t0 = time.time()
    for _ in range(3):
        f = dis.calc(ga, gb, None)
    dt = (time.time() - t0) / 3
    print(f"DIS preset={preset}: flow {dt*1000:.0f}ms mag={np.abs(f).mean():.2f}", flush=True)

# --- remap / warp timing ---
f = cv2.DISOpticalFlow_create(cv2.DISOPTICALFLOW_PRESET_MEDIUM).calc(
    cv2.cvtColor(a, cv2.COLOR_RGB2GRAY), cv2.cvtColor(b, cv2.COLOR_RGB2GRAY), None)
H, W = f.shape[:2]
gx, gy = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
t0 = time.time()
for _ in range(5):
    mx = (gx + 0.33 * f[..., 0]).astype(np.float32)
    my = (gy + 0.33 * f[..., 1]).astype(np.float32)
    w = cv2.remap(a, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
print(f"remap warp: {(time.time()-t0)/5*1000:.0f}ms", flush=True)

# --- webp encode timing ---
import io
for method in (0, 2, 4):
    t0 = time.time()
    for _ in range(3):
        buf = io.BytesIO()
        Image.fromarray(a).save(buf, "WEBP", quality=72, method=method)
    print(f"webp q72 method={method}: {(time.time()-t0)/3*1000:.0f}ms size={buf.tell()//1024}KB", flush=True)

# --- RIFE timing ---
sys.path.insert(0, "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1/scripts/framegen/bin/weights/train_log/train_log")
sys.path.insert(0, "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1/scripts/framegen/bin/Practical-RIFE")
import torch
from RIFE_HDv3 import Model
device = torch.device("mps")
model = Model()
model.load_model("/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1/scripts/framegen/bin/weights/train_log/train_log")
model.flownet.to(device)
model.eval()
print("RIFE v4.6-HD loaded on MPS", flush=True)

def pad(x, m=32):
    _, _, h, w = x.shape
    ph = (m - h % m) % m
    pw = (m - w % m) % m
    return torch.nn.functional.pad(x, (0, pw, 0, ph)), ph, pw

I0 = torch.from_numpy(a.transpose(2, 0, 1)).float().unsqueeze(0).to(device) / 255.0
I1 = torch.from_numpy(b.transpose(2, 0, 1)).float().unsqueeze(0).to(device) / 255.0
P0, ph, pw = pad(torch.cat((I0, I1), 1))
with torch.no_grad():
    _ = model.flownet(P0, [4, 2, 1])  # warmup
    torch.mps.synchronize()
    t0 = time.time()
    for _ in range(3):
        _, _, merged = model.flownet(P0, [4, 2, 1])
    torch.mps.synchronize()
    print(f"RIFE fp32 fullres: {(time.time()-t0)/3:.2f}s/frame", flush=True)
    # scale=0.5 variant
    t0 = time.time()
    for _ in range(3):
        _, _, merged = model.flownet(P0, [8, 4, 2])
    torch.mps.synchronize()
    print(f"RIFE fp32 scale0.5-flow: {(time.time()-t0)/3:.2f}s/frame", flush=True)

"""FRAMEGEN speed test: fp32 vs fp16, full vs coarse flow scales."""
import sys, time
import numpy as np, cv2

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
    return cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)

a, b = load_hd(320), load_hd(321)  # temple-arm motion
device = torch.device("mps")
net = IFNet()
sd = torch.load(f"{ROOT}/scripts/framegen/bin/Practical-RIFE/train_log/flownet.pkl", map_location="cpu")
net.load_state_dict({k.replace("module.", ""): v for k, v in sd.items()})
net.to(device).eval()
torch.set_grad_enabled(False)

def to_t(x, dtype):
    t = torch.from_numpy(x[..., ::-1].transpose(2, 0, 1).copy()).unsqueeze(0).to(device) / 255.0
    return torch.nn.functional.pad(t.to(dtype), (0, 0, 0, 28), mode="reflect")

ref = None
for dtype in (torch.float32, torch.float16):
    I0p, I1p = to_t(a, dtype), to_t(b, dtype)
    for scales in ([4, 2, 1], [8, 4, 2]):
        with torch.no_grad(), torch.autocast(device_type="mps", dtype=dtype) if dtype == torch.float16 else torch.no_grad():
            try:
                net(torch.cat((I0p, I1p), 1), scales)
                torch.mps.synchronize()
                t0 = time.time()
                for _ in range(3):
                    fl, mask, _ = net(torch.cat((I0p, I1p), 1), scales)
                torch.mps.synchronize()
                dt = (time.time() - t0) / 3
                f = fl[2].float()
                w0 = warp(I0p.float(), f[:, :2] * (2/3))
                w1 = warp(I1p.float(), f[:, 2:4] * (4/3))
                out = (w0 * mask.float() + w1 * (1 - mask.float())).clamp(0, 1)[:, :, :H, :]
                arr = (out[0].cpu().numpy().transpose(1, 2, 0) * 255).astype(np.uint8)
                ok = np.isfinite(out.float().cpu().numpy()).all()
                if ref is None:
                    ref = arr.astype(np.float32)
                    print(f"dtype={dtype} scales={scales}: {dt:.2f}s finite={ok} (REF)", flush=True)
                else:
                    mad = np.abs(arr.astype(np.float32) - ref).mean()
                    print(f"dtype={dtype} scales={scales}: {dt:.2f}s finite={ok} MADvsREF={mad:.2f}", flush=True)
            except Exception as e:
                print(f"dtype={dtype} scales={scales}: FAIL {type(e).__name__} {e}", flush=True)
print("SPEED DONE", flush=True)

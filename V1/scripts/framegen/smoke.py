"""FRAMEGEN smoke test: load RIFE-HDv3 v4.6 on MPS, run one pair at 1920x1092,
synthesize t=1/3 and t=2/3 by scaling bidirectional mid-frame flow."""
import sys, time
import numpy as np, cv2
from PIL import Image

ROOT = "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"
sys.path.insert(0, f"{ROOT}/scripts/framegen/bin/Practical-RIFE")
sys.path.insert(0, f"{ROOT}/scripts/framegen/bin/Practical-RIFE/train_log")
import torch
from model.warplayer import warp
from IFNet_HDv3 import IFNet

SRC = f"{ROOT}/render-repo/out/frames"

def load_hd(n):
    im = Image.open(f"{SRC}/f_{n:05d}.webp").convert("RGB")
    return np.asarray(im.resize((1920, 1092), Image.LANCZOS))

a, b = load_hd(300), load_hd(301)
print("pair loaded", a.shape, flush=True)

device = torch.device("mps")
net = IFNet()
sd = torch.load(f"{ROOT}/scripts/framegen/bin/Practical-RIFE/train_log/flownet.pkl",
                map_location="cpu")
net.load_state_dict({k.replace("module.", ""): v for k, v in sd.items()})
net.to(device).eval()
print("weights loaded", flush=True)

I0 = torch.from_numpy(a.transpose(2, 0, 1).copy()).float().unsqueeze(0).to(device) / 255.0
I1 = torch.from_numpy(b.transpose(2, 0, 1).copy()).float().unsqueeze(0).to(device) / 255.0
inp = torch.cat((I0, I1), 1)
I0p = torch.nn.functional.pad(I0, (0, 0, 0, 28), mode="reflect")
I1p = torch.nn.functional.pad(I1, (0, 0, 0, 28), mode="reflect")
inp = torch.cat((I0p, I1p), 1)  # 1092->1120

torch.set_grad_enabled(False)
with torch.no_grad():
    flow_list, mask, merged = net(inp, [4, 2, 1])  # warmup
    torch.mps.synchronize()
    t0 = time.time()
    for _ in range(3):
        flow_list, mask, merged = net(inp, [4, 2, 1])
    torch.mps.synchronize()
    print(f"forward: {(time.time()-t0)/3:.2f}s", flush=True)
    print("flow", flow_list[2].shape, "mask", mask.shape, "mid", merged[2].shape, flush=True)

    f = flow_list[2]  # [:,:2]=mid->I0 side, [:,2:]=mid->I1 side
    for t in (1/3, 2/3):
        w0 = warp(I0p, f[:, :2] * (2 * t))
        w1 = warp(I1p, f[:, 2:4] * (2 * (1 - t)))
        out = (w0 * mask + w1 * (1 - mask)).clamp(0, 1)[:, :, :1092, :]
        arr = (out[0].cpu().numpy().transpose(1, 2, 0) * 255).astype(np.uint8)
        Image.fromarray(arr).save(f"/tmp/framegen_t{t:.2f}.png")
        print(f"t={t:.2f} saved {arr.shape}", flush=True)
print("SMOKE OK", flush=True)

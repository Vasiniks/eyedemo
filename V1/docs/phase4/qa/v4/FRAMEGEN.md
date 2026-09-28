# FRAMEGEN — x3 interpolation + 1080p (ID=FRAMEGEN)

Owner: FRAMEGEN agent. Scope: `scripts/framegen/**`, `public/v1film/hd/**`, `public/v1film/hd.json` only.
Source: `render-repo/out/frames/f_00001..f_03588.webp` (3024×1720). Target: 10762 frames @1920×1092, WebP q≈72, interp=3.

## Log
- T+0: env check — arm64, py3.13, torch 2.12 MPS=yes, PIL 12.2, cv2 5.0, cwebp present, system ffmpeg BROKEN (libx265 dylib) → encode via PIL/cwebp. Disk 38Gi free → chunked pipeline.
- T+0: nihui rife-ncnn-vulkan latest release = 20221029 (old, pre-v4.6 models) → REJECT per spec (needs rife-v4.6+). Going Practical-RIFE (PyTorch, device=mps) + official v4.6 weights.
- T+12: RIFE smoke OK on MPS (fp32 0.50s/fwd @1920x1120; fp16 no gain; coarse scales [8,4,2] 0.16s, MAD 0.19 vs full — ADOPTED).
- T+15: calibration strips look clean (red case spin). Full-frame SSIM ~0.999 everywhere → USELESS as gate. New gate: motion-masked relative MAD r = mean(|I-blend|)/mean(|A-B|) over motion px; clean r=0.17-0.27 on 9 segment pairs → T_FAIL=0.55. Encode: PIL WebP q72 method=2 (36ms, ~20KB).
- T+18: pipeline scripts/framegen/run_interp.py written (streaming, resumable, 8 encode threads, chunk=200 pairs). LAUNCHING full run now.
- T+20: run live, 46s/chunk → ETA ~14min total. ~20KB/frame avg → proj. total ~215MB. Gate replacing 0 so far (footage is clean, r well under 0.55).
## Result — FRAMEGEN-DONE
- Full run: 13.7 min wall (18 chunks × ~46s, ~0.23s/pair all-in: decode+resize+RIFE-coarse+2 warps+gate+encode).
- Output: public/v1film/hd/f_00001..f_10762.webp = 10762 files, 0 missing, continuous numbering, 1920×1092, WebP q72 (PIL method=2). Total 176MB payload (avg ~16KB/frame — mostly-black footage).
- Interpolator: Practical-RIFE, RIFE-HDv3 v4.6 weights (arXiv2020-RIFE official HD zip), PyTorch MPS fp32, flow scales [8,4,2] (3.1× faster than full, MAD 0.19 vs full), t=1/3 & 2/3 via bidirectional-flow scaling + mask blend. Tools under scripts/framegen/bin (gitignored). ncnn path rejected: latest nihui macOS release is 20221029 (pre-v4.6 models).
- Quality gate: motion-masked relative MAD r vs linear blend, T_FAIL=0.55 (clean calibrates 0.17–0.27). Replaced 2/7174 with nearest real: src3009-t1/3 (r=0.65) → out f_09026, src3266-t2/3 (r=0.66) → out f_09798. Per-frame scores in scripts/framegen/scores.csv (gitignored).
- QA: 12 samples (highest-motion interps from segs 70–145 / 235–411) as full+2x-crop in docs/phase4/qa/v4/framegen-*.png — all RIFE-pass, visually clean (sharp logo, no ghosting). Note: actual footage in those ranges is a spinning red case; no temple-arm/ring content found there, so samples target max-motion frames instead.
- Sidecar public/v1film/hd.json written: {count:10762, w:1920, h:1092, interp:3, sourceCount:3588, realEvery:3, pattern:"f_%05d.webp", replaced:2}. Real frames at (i-1)%3==0.
- Untouched per scope: manifest.json, frameLoader.ts, FilmSequence.tsx. LOADER agent: consume hd.json (realEvery=3).

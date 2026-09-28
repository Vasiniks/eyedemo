// Lane D — procedural streak sprite for sponsor-wave velocity streaks.
// Authored geometry per PLAN-MASTER §6: warm-white lateral comet-smear ribbons,
// edge-faded, opacity driven by flight speed. No post motion-blur pass exists,
// so streaks are additive planes with this gradient texture (head bright at the
// logo, fading tail; soft top/bottom edges). Never radial warp / blue starfield.

import * as THREE from 'three'

let cached: THREE.CanvasTexture | null = null

/** 256×32 warm-white streak sprite (single shared instance). */
export function getStreakTexture(): THREE.CanvasTexture {
  if (cached) return cached
  const w = 256
  const h = 32
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d canvas unavailable for streak texture')
  const img = ctx.createImageData(w, h)
  // Warm white #FFF2E2 with head→tail and edge falloff.
  const r = 255
  const g = 242
  const b = 226
  for (let y = 0; y < h; y++) {
    const v = y / (h - 1) // 0 top → 1 bottom
    const edge = Math.sin(Math.PI * v) ** 1.5 // soft top/bottom
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1) // 0 head (logo) → 1 tail
      // Round 2b: fuller comet (was 1.8 — only the head pixels cleared the
      // visible threshold, so tails read as stubs). Still head-bright.
      const tail = (1 - u) ** 1.2
      const a = Math.round(255 * edge * tail)
      const o = (y * w + x) * 4
      img.data[o] = r
      img.data[o + 1] = g
      img.data[o + 2] = b
      img.data[o + 3] = a
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  cached = tex
  return tex
}

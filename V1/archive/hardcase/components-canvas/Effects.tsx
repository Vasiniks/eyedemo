// EyeQ Vision Care — post FX, beat-gated (Lane B, step 4).
// <EffectComposer> mounts ONLY in B6–B9 on desktop tiers (high/laptop).
// Mobile / low / RM: null (opacity crossfades only, §9). Bloom ramp
// 0.15→0.6→1.4 + threshold 0.85→0.6 + radius 0.4→0.7 driven per-frame from
// samplePortal (mutated, never setState). Vignette 0.5/0.5→0.65.

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import type { BloomEffect, VignetteEffect } from 'postprocessing'
import { filmProgress } from '../../motion/progress'
import { samplePortal } from '../../motion/chapters'
import { useFilmStore } from '../../store/useFilmStore'

const WAVE_BEATS = new Set(['B6', 'B7', 'B8', 'B9'])

function BloomDriver({
  bloomRef,
  vignetteRef,
}: {
  bloomRef: React.RefObject<BloomEffect | null>
  vignetteRef: React.RefObject<VignetteEffect | null>
}) {
  useFrame(() => {
    const s = samplePortal(filmProgress.p)
    const bloom = bloomRef.current
    if (bloom) {
      bloom.intensity = s.bloom
      // Threshold + radius live on the luminance material / blur pass
      // (postprocessing 6.x: no direct effect props — verified in types).
      bloom.luminanceMaterial.threshold = s.bloomThreshold
      bloom.mipmapBlurPass.radius = s.bloomRadius
    }
    const vig = vignetteRef.current
    if (vig) {
      // Vignette pulse with wave velocity (restraint: 0.5→0.65 max).
      const beat = filmProgress.beat
      vig.darkness = beat === 'B6' || beat === 'B7' ? 0.65 : 0.5
    }
  })
  return null
}

export function Effects() {
  const beat = useFilmStore((s) => s.beat)
  const quality = useFilmStore((s) => s.quality)
  const bloomRef = useRef<BloomEffect | null>(null)
  const vignetteRef = useRef<VignetteEffect | null>(null)

  const postTier = quality === 'high' || quality === 'laptop'
  if (!postTier || !WAVE_BEATS.has(beat)) return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        ref={bloomRef}
        mipmapBlur
        intensity={0.15}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.2}
        radius={0.4}
      />
      <Vignette offset={0.5} darkness={0.5} />
      <BloomDriver bloomRef={bloomRef} vignetteRef={vignetteRef} />
    </EffectComposer>
  )
}

// EyeQ Vision Care — discrete film store, DOM only (Lane B, step 3).
// zustand holds discrete {beat, quality, reducedMotion, veil} with selectors.
// NOTHING per-frame goes through here: R3F reads filmProgress in useFrame.

import { create } from 'zustand'
import type { BeatId } from '../motion/chapters'
import type { QualityTier } from '../motion/tiers'

interface FilmStore {
  beat: BeatId
  /** Coarse progress for HUD/debug (3 decimals). */
  pCoarse: number
  /** White-veil opacity 0..1 (B9 handoff). */
  veil: number
  quality: QualityTier
  reducedMotion: boolean
  setBeat: (beat: BeatId) => void
  setProgressCoarse: (p: number) => void
  setVeil: (v: number) => void
  setQuality: (q: QualityTier) => void
  setReducedMotion: (v: boolean) => void
}

export const useFilmStore = create<FilmStore>((set) => ({
  beat: 'B1',
  pCoarse: 0,
  veil: 0,
  quality: 'laptop',
  reducedMotion: false,
  setBeat: (beat) => set((s) => (s.beat === beat ? s : { beat })),
  setProgressCoarse: (pCoarse) => set((s) => (s.pCoarse === pCoarse ? s : { pCoarse })),
  setVeil: (veil) => set((s) => (Math.abs(s.veil - veil) < 0.002 ? s : { veil })),
  setQuality: (quality) => set((s) => (s.quality === quality ? s : { quality })),
  setReducedMotion: (reducedMotion) => set((s) => (s.reducedMotion === reducedMotion ? s : { reducedMotion })),
}))

/** Discrete beat/veil selectors (zero per-frame renders). */
export const useFilmBeat = (): BeatId => useFilmStore((s) => s.beat)
export const useFilmQuality = (): QualityTier => useFilmStore((s) => s.quality)

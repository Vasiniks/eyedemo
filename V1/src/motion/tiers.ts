// EyeQ Vision Care — render tiers (Lane B, step 4). PLAN-MASTER §9.
// Governor (D+B step 15) lowers DPR → kills post → kills shadows, never
// landmarks. This module resolves the START tier; the governor consumes it.

import { isMobileWidth } from './chapters'
import { prefersReducedMotion } from './lenis'

export type QualityTier = 'high' | 'laptop' | 'mobile' | 'low' | 'rm'

export interface TierSpec {
  tier: QualityTier
  /** R3F dpr prop. */
  dpr: number | [number, number]
  /** EffectComposer (Bloom+Vignette) allowed. */
  post: boolean
  /** Native transmission lens allowed (else opacity crossfade). */
  transmission: boolean
  shadows: boolean
}

const SPECS: Record<QualityTier, TierSpec> = {
  high: { tier: 'high', dpr: [1, 2], post: true, transmission: true, shadows: true },
  laptop: { tier: 'laptop', dpr: [1, 1.5], post: true, transmission: true, shadows: true },
  mobile: { tier: 'mobile', dpr: [1, 1.25], post: false, transmission: false, shadows: false },
  low: { tier: 'low', dpr: 1, post: false, transmission: false, shadows: false },
  rm: { tier: 'rm', dpr: 1, post: false, transmission: false, shadows: false },
}

function tierOverride(): QualityTier | null {
  if (typeof window === 'undefined') return null
  const q = new URLSearchParams(window.location.search).get('tier')
  if (q === 'high' || q === 'laptop' || q === 'mobile' || q === 'low') return q
  return null
}

/** Laptop (medium) is the default desktop tier (§9). */
export function resolveTier(width = typeof window !== 'undefined' ? window.innerWidth : 1440): TierSpec {
  const override = tierOverride()
  if (override) return SPECS[override]
  if (prefersReducedMotion()) return SPECS.rm
  if (isMobileWidth(width)) return SPECS.mobile
  return SPECS.laptop
}

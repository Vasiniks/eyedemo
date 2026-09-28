// EyeQ Vision Care — singleton Lenis + single GSAP ticker (Lane B, step 3).
// Contract (§6): `lenis.on('scroll', ScrollTrigger.update)` +
// `gsap.ticker.add(t => lenis.raf(t * 1000))` + `lagSmoothing(0)`.
// Lenis ON desktop, OFF on touch (native scroll; syncTouch:false). NO Lenis
// at all under prefers-reduced-motion. StrictMode-safe (idempotent init).

import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
let rafHandler: ((time: number) => void) | null = null
let initialised = false

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof window.matchMedia === 'function') {
    try {
      if (window.matchMedia('(pointer: coarse)').matches) return true
    } catch {
      // fall through to touch-point check
    }
  }
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export interface MotionInit {
  lenis: Lenis | null
  reducedMotion: boolean
  touch: boolean
}

export function initMotion(): MotionInit {
  const reducedMotion = prefersReducedMotion()
  const touch = isTouchDevice()
  if (initialised) return { lenis, reducedMotion, touch }
  initialised = true

  if (!reducedMotion && !touch) {
    lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      syncTouch: false,
      anchors: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    rafHandler = (time: number) => {
      lenis?.raf(time * 1000)
    }
    gsap.ticker.add(rafHandler)
    gsap.ticker.lagSmoothing(0)
  }
  return { lenis, reducedMotion, touch }
}

export function getLenis(): Lenis | null {
  return lenis
}

export function destroyMotion(): void {
  if (rafHandler) {
    gsap.ticker.remove(rafHandler)
    rafHandler = null
  }
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
  initialised = false
}

export { ScrollTrigger, gsap }

// EyeQ Vision Care — filmProgress: the SOLE 3D input (Lane B, step 3).
// Mutable ref object (never React state): R3F reads `filmProgress.p` in
// useFrame and mutates refs. Discrete consumers (zustand store, veil, HUD)
// subscribe. Everything stays a pure function of p.

import { beatAt, getLensAnchor, type BeatId } from './chapters'

export interface FilmProgressState {
  /** Master progress 0→1 over the dark pin. */
  p: number
  beat: BeatId
}

export const filmProgress: FilmProgressState = { p: 0, beat: 'B1' }

type Listener = () => void
const listeners = new Set<Listener>()

export function subscribeFilmProgress(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function notify(): void {
  listeners.forEach((fn) => {
    try {
      fn()
    } catch {
      // A failing subscriber must never break the conductor.
    }
  })
}

/** Write path for the master timeline onUpdate AND the QA hook. */
export function setFilmProgress(pRaw: number): void {
  const p = Math.min(1, Math.max(0, pRaw))
  const beat = beatAt(p)
  const changed = p !== filmProgress.p || beat !== filmProgress.beat
  filmProgress.p = p
  filmProgress.beat = beat
  if (changed) notify()
}

export function getFilmProgress(): FilmProgressState {
  return { p: filmProgress.p, beat: filmProgress.beat }
}

export interface FilmDebugHook {
  /** Jump the film to progress p (proves pure-function-of-progress). */
  setProgress: (p: number) => void
  getProgress: () => FilmProgressState
  /**
   * Damped camera progress (CameraRig `smooth`). QA waits for convergence
   * (|smooth − p| < ε) instead of wall-time so captures are deterministic at
   * any frame rate. Reads 0 until the first frame renders.
   */
  getSmooth: () => number
  /** Live portal anchor (centre + normal) for aim verification. */
  getAnchor: () => { center: [number, number, number]; normal: [number, number, number] }
}

/**
 * Damped progress value (dev/QA convergence signal). CameraRig writes its
 * `smooth` here per frame; QA waits on it instead of wall-time so captures
 * are deterministic at any frame rate (software GL converges slowly).
 */
export const camSmooth = { v: 0 }

/** Dev-only QA hook (`window.__film`). Installed by Providers in dev builds. */
export function installFilmDebugHook(): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as { __film?: FilmDebugHook }
  if (w.__film) return
  w.__film = {
    setProgress: (p: number) => setFilmProgress(p),
    getProgress: () => getFilmProgress(),
    getSmooth: () => camSmooth.v,
    getAnchor: () => {
      const a = getLensAnchor()
      return { center: [...a.center], normal: [...a.normal] }
    },
  }
}

declare global {
  interface Window {
    __film?: FilmDebugHook
  }
}

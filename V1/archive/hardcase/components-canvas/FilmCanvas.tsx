// EyeQ Vision Care — ONE persistent <Canvas>, Home-only (Lane B, step 4).
// Composition order (§7.3): children (SceneStage → CaseRig → GlassesRig →
// SponsorField → LensPortal, composed by the parent) → CameraRig → Effects.
// R3F reads filmProgress in useFrame and mutates refs (never setState).
// RAF gating: offscreen (IO) or veil-full (handoff) → frameloop 'never'
// (prove offscreenRunningCount:0 in profile). Route change = full dispose.

import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { resolveTier } from '../../motion/tiers'
import { filmProgress, subscribeFilmProgress } from '../../motion/progress'
import { tokens } from '../../tokens'

const INITIAL_POS: [number, number, number] = [0.216, 0.12, 0.384]

export function FilmCanvas({ children }: { children?: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(true)
  const [veilFull, setVeilFull] = useState(false)
  const [hidden, setHidden] = useState(
    typeof document !== 'undefined' ? document.hidden : false,
  )
  const spec = resolveTier()

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) setVisible(entry.isIntersecting)
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onVis = (): void => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(
    () =>
      subscribeFilmProgress(() => {
        // Handoff: canvas fully under the veil → stop the loop (§6-B9).
        setVeilFull(filmProgress.p >= 0.999)
      }),
    [],
  )

  const running = visible && !hidden && !veilFull

  return (
    <div
      ref={wrapRef}
      data-film-canvas="true"
      aria-hidden="true"
      style={{
        // Absolute (NOT fixed): ScrollTrigger's pin sets an identity transform
        // on #film-pin, which would re-contain fixed descendants to the full
        // 800vh shell. Absolute inset-0 × 100vh inside the pinned (itself
        // viewport-locked) trigger = viewport-locked canvas at 1× cost.
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: tokens.void,
      }}
    >
      <Canvas
        dpr={spec.dpr}
        frameloop={running ? 'always' : 'never'}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows={spec.shadows}
        camera={{ fov: 35, near: 0.01, far: 60, position: INITIAL_POS }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0
        }}
      >
        <color attach="background" args={[tokens.void]} />
        <fogExp2 attach="fog" args={[tokens.void, 0.035]} />
        <Suspense fallback={null}>
          {children}
          <CameraRig />
          <Effects />
        </Suspense>
      </Canvas>
    </div>
  )
}

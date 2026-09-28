// EyeQ Vision Care — LensPortal + white handoff (Lane B, step 9).
// The camera passes THROUGH the lens (brief §4N): approach along the lens
// normal (B8 rail) → transmission/refraction ramp → bloom → Paper white,
// and the DOM white act begins seamlessly under the veil.
//
// Stand-in contract: renders a lens DISC at the live lens anchor until Lane
// C's glasses are integrated. Once GlassesRig calls setLensAnchor() with the
// real G_Lenses transform AND passes `linked`, the disc unmounts (the real
// lens carries the material) but the ramp hooks + veil keep driving.
// Position the disc from G_Lenses once available (API.md §3).

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { darkVhForWidth, getLensAnchor, samplePortal } from '../../motion/chapters'
import { filmProgress, subscribeFilmProgress } from '../../motion/progress'
import { useFilmStore } from '../../store/useFilmStore'
import { tokens } from '../../tokens'

const DISC_RADIUS = 0.032 // stand-in right-lens radius, metres
const Z_AXIS = new THREE.Vector3(0, 0, 1)

/** Chorography portal: 80% camera path + bloom + DOM veil, 20% shader (§1-C13). */
export function LensPortal({ linked = false }: { linked?: boolean }) {
  const groupRef = useRef<THREE.Group | null>(null)
  const matRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const edgeRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const quality = useFilmStore((s) => s.quality)
  const transmissionAllowed = quality === 'high' || quality === 'laptop'

  useFrame(() => {
    // Track the LIVE anchor per frame (integration: the real right lens once
    // `LensAnchorReporter` publishes it; stand-in before that).
    const g = groupRef.current
    if (g) {
      const anchor = getLensAnchor()
      g.position.set(anchor.center[0], anchor.center[1], anchor.center[2])
      g.quaternion.setFromUnitVectors(
        Z_AXIS,
        new THREE.Vector3(anchor.normal[0], anchor.normal[1], anchor.normal[2]).normalize(),
      )
    }
    const s = samplePortal(filmProgress.p)
    const mat = matRef.current
    if (mat) {
      if (transmissionAllowed) {
        mat.transmission = s.transmission
        mat.opacity = 1
        mat.transparent = false
      } else {
        // Mobile/low fallback: opacity crossfade (never transmission, §9).
        mat.transmission = 0
        mat.transparent = true
        mat.opacity = 1 - 0.55 * s.transmission
      }
      mat.roughness = s.roughness
      mat.ior = s.ior
      mat.thickness = s.thickness
    }
    if (edgeRef.current) {
      // Polished bright lens edge for rim-light glow (brief §6b/§6c.4).
      edgeRef.current.opacity = 0.25 + 0.75 * s.edgeFire
    }
  })

  // Linked to the real G_Lenses: the real mesh carries the material.
  // (Integration: the crossing reads via camera rail + bloom + veil; the
  // disc stays available for isolated QA by passing linked={false}.)
  if (linked) return null

  return (
    <group ref={groupRef}>
      <mesh>
        <circleGeometry args={[DISC_RADIUS, 48]} />
        <meshPhysicalMaterial
          ref={matRef}
          color="#9aa4a8"
          metalness={0}
          roughness={0.12}
          transmission={0}
          ior={1.1}
          thickness={0.002}
          specularIntensity={1}
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bright polished edge ring — catches the Lightformer strips. */}
      <mesh>
        <ringGeometry args={[DISC_RADIUS * 0.97, DISC_RADIUS * 1.04, 64]} />
        <meshBasicMaterial ref={edgeRef} color="#e8f0ff" transparent opacity={0.25} toneMapped={false} />
      </mesh>
    </group>
  )
}

/**
 * #white-veil DOM overlay: opacity 0→1 from p=0.985 (400 ms expo.inOut
 * equiv) + circle() iris contraction. Imperative (no React renders).
 * Paper #F5F1E8 — never pure #FFF (§1-C15). RM = dimmed hard cut.
 */
export function WhiteVeil() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const update = (): void => {
      const el = ref.current
      if (!el) return
      const { p, beat } = filmProgress
      const reducedMotion = useFilmStore.getState().reducedMotion
      const t = Math.min(1, Math.max(0, (p - 0.985) / 0.015))
      const base = beat === 'B9' || p >= 0.985 ? (reducedMotion ? 1 : expoInOutLocal(t)) : 0
      // Post-handoff fade-out (integration): p stays 1 while the visitor
      // scrolls the real white act, but this fixed overlay would sit OVER the
      // white-act content (and later the dark footer) forever. Fade it out as
      // the white act arrives: 0 while pinned, →0 over 40% viewport past pin
      // release (= dark scroll budget; the pin is page-first, so no DOM
      // measurement — immune to the pin's fixed positioning). Pure function
      // of (p, scrollY): scrub-reversible.
      let postFade = 0
      if (!reducedMotion) {
        const release = (darkVhForWidth(window.innerWidth) / 100) * window.innerHeight
        postFade = Math.min(1, Math.max(0, (window.scrollY - release) / (window.innerHeight * 0.4)))
      }
      const opacity = base * (1 - postFade)
      const opacityStr = String(opacity)
      if (el.style.opacity !== opacityStr) el.style.opacity = opacityStr
      const reduced = reducedMotion ? 'none' : `circle(${30 + 120 * t}% at 50% 50%)`
      const clip = t <= 0 ? 'none' : reduced
      if (el.style.clipPath !== clip) el.style.clipPath = clip
      const store = useFilmStore.getState()
      store.setVeil(t <= 0 ? 0 : opacity)
    }
    const unsub = subscribeFilmProgress(update)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      unsub()
      window.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <div
      id="white-veil"
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        background: tokens.paper,
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

function expoInOutLocal(t: number): number {
  const c = Math.min(1, Math.max(0, t))
  if (c === 0) return 0
  if (c === 1) return 1
  if (c < 0.5) return Math.pow(2, 20 * c - 10) / 2
  return (2 - Math.pow(2, -20 * c + 10)) / 2
}

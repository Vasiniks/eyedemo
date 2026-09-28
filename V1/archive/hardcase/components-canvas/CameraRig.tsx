// EyeQ Vision Care — CameraRig: progress → camera, the ONLY camera driver
// (Lane B, step 4). Reads filmProgress.p in useFrame, damps toward it
// (rig.smooth = damp(target, λ=5.2); rig.target stays exact for nav/a11y),
// samples the §6 path (chapters.sampleCamera — pure function of p), and
// writes camera + fog + exposure. RM: smooth = target (snap, no flights).

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { isMobileWidth, sampleCamera } from '../../motion/chapters'
import { camSmooth, filmProgress, subscribeFilmProgress } from '../../motion/progress'
import { useFilmStore } from '../../store/useFilmStore'

const DAMP_LAMBDA = 5.2
const MAX_DT = 1 / 30

export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const size = useThree((s) => s.size)
  const smooth = useRef(0)

  useEffect(
    () =>
      subscribeFilmProgress(() => {
        // Keep the discrete store in sync (beat changes only re-render).
        const { p, beat } = filmProgress
        const store = useFilmStore.getState()
        store.setBeat(beat)
        store.setProgressCoarse(Math.round(p * 1000) / 1000)
      }),
    [],
  )

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, MAX_DT)
    const reducedMotion = useFilmStore.getState().reducedMotion
    const target = filmProgress.p
    smooth.current = reducedMotion
      ? target
      : THREE.MathUtils.damp(smooth.current, target, DAMP_LAMBDA, dt)
    camSmooth.v = smooth.current

    const mobile = isMobileWidth(size.width)
    const s = sampleCamera(smooth.current, mobile)

    camera.position.set(s.position[0], s.position[1], s.position[2])
    camera.lookAt(s.target[0], s.target[1], s.target[2])
    const persp = camera as THREE.PerspectiveCamera
    if (Math.abs(persp.fov - s.fov) > 1e-4) {
      // eslint-disable-next-line react-hooks/immutability -- camera rig write channel (pure fn of p)
      persp.fov = s.fov
      persp.updateProjectionMatrix()
    }
    if (Math.abs(camera.near - s.near) > 1e-6) {
      camera.near = s.near
      camera.updateProjectionMatrix()
    }

    const fog = scene.fog as THREE.FogExp2 | null
    // eslint-disable-next-line react-hooks/immutability -- camera rig write channel (pure fn of p)
    if (fog && Math.abs(fog.density - s.fog) > 1e-5) fog.density = s.fog
    if (Math.abs(gl.toneMappingExposure - s.exposure) > 1e-4) {
      // eslint-disable-next-line react-hooks/immutability -- camera rig write channel (pure fn of p)
      gl.toneMappingExposure = s.exposure
    }
    // Canvas fade across B9 (450 ms equiv, scrub-mapped — no React render).
    const opacity = s.canvasOpacity
    if (gl.domElement.style.opacity !== String(opacity)) {
      // eslint-disable-next-line react-hooks/immutability -- camera rig write channel (pure fn of p)
      gl.domElement.style.opacity = String(opacity)
    }
  })

  return null
}

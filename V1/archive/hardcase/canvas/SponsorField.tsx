// Lane D — SponsorField (PLAN-MASTER step 8).
// Two spatial arrival waves, pure function of master progress `p`:
//
//   Wave 1 (p 0.70–0.85): 8 eyewear brands — spawn VERY far (z −18…−22m, tiny),
//     rush toward camera fast with velocity-tied streaks, decelerate hard
//     (baked expo arrival), settle + hover, ACCUMULATE into a composed
//     1.1m-arc constellation (3 depth layers, front/mid/back tiers).
//   Wave 2 (p 0.85–0.92): 8 insurers — same depth-flight system, own rhythm:
//     shorter travel (z −10…−12m), tighter cadence, 0.7m baseline+scatter
//     layout, dimmer tier, shorter streaks (PLAN-MASTER §0.1 overrides the
//     stagger-fade-only proposal: Wave 2 IS spatial).
//
// Travel is camera-relative z motion of billboard groups, never scaling.
// Logos are single-color light knockouts, unlinked (no pointer handlers),
// alphaTest 0.4 / depthWrite true / toneMapped false, Bone opacities per tier.

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { filmProgress } from '../motion/progress'
import {
  WAVE1,
  WAVE2,
  computeSlots,
  computeSpawns,
  hoverOffset,
  logoFlight,
  type Slot,
  type WaveId,
} from './stage/slots'
import { FALLBACK_ASPECTS, loadAtlasManifests, logosFor, type AtlasManifest } from './stage/logos'
import { getStreakTexture } from './stage/streakTexture'
import { clamp01, lerp, smoothstep } from './stage/math'
import { readStageProgress, type StageProgress } from './SceneStage'

/** Which wave(s) to mount. Lane B mounts one instance per wave (`wave={1|2}`);
 *  the isolated harness mounts both. Default 'both'. */
export type WaveFilter = 1 | 2 | 'both'

interface SponsorFieldProps {
  /** Defaults to Lane B's shared filmProgress (production wiring). */
  progress?: StageProgress
  /** Which wave(s) to mount (dev/QA isolation). Default 'both'. */
  wave?: WaveFilter
  /** Streak ribbons on/off. Default: off on coarse pointers (mobile). */
  streaks?: boolean
  /** Compact (mobile) layouts. Default: viewport width < 768px. */
  compact?: boolean
  /** HARNESS ONLY — render a single logo index 0–7 of the mounted wave(s),
   *  hiding its siblings (flight-sequence QA). Never set in production. */
  solo?: number
}

/** Estimated on-screen height of a settled logo (px) — harness legibility math. */
export function projectedHeightPx(
  worldHeightM: number,
  distM: number,
  fovDeg: number,
  canvasHeightPx: number,
): number {
  const visibleH = 2 * distM * Math.tan((fovDeg * Math.PI) / 360)
  return (worldHeightM / visibleH) * canvasHeightPx
}

export function SponsorField(props: SponsorFieldProps) {
  const [manifests, setManifests] = useState<{ w1: AtlasManifest; w2: AtlasManifest } | null>(null)
  useEffect(() => {
    let live = true
    loadAtlasManifests().then((m) => {
      if (live) setManifests(m)
    })
    return () => {
      live = false
    }
  }, [])
  if (!manifests) return null
  return (
    <Suspense fallback={null}>
      <SponsorInner manifests={manifests} {...props} />
    </Suspense>
  )
}

interface InnerProps extends SponsorFieldProps {
  manifests: { w1: AtlasManifest; w2: AtlasManifest }
}

function SponsorInner({ manifests, progress = filmProgress, wave = 'both', streaks, compact, solo }: InnerProps) {
  const viewportWidth = useThree((s) => s.size.width)
  const gl = useThree((s) => s.gl)
  const [texW1, texW2] = useTexture([manifests.w1.textureUrl, manifests.w2.textureUrl])

  const isCompact = compact ?? viewportWidth < 768
  const coarsePointer = useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches,
    [],
  )
  const streaksEnabled = streaks ?? !coarsePointer

  useMemo(() => {
    for (const t of [texW1, texW2] as THREE.Texture[]) {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    }
  }, [texW1, texW2, gl])

  return (
    <group>
      {(wave === 'both' || wave === 1) && (
        <Wave
          wave="w1"
          manifest={manifests.w1}
          texture={texW1}
          progress={progress}
          compact={isCompact}
          streaksEnabled={streaksEnabled}
          solo={solo}
        />
      )}
      {(wave === 'both' || wave === 2) && (
        <Wave
          wave="w2"
          manifest={manifests.w2}
          texture={texW2}
          progress={progress}
          compact={isCompact}
          streaksEnabled={streaksEnabled}
          solo={solo}
        />
      )}
    </group>
  )
}

interface WaveProps {
  wave: WaveId
  manifest: AtlasManifest
  texture: THREE.Texture
  progress: StageProgress
  compact: boolean
  streaksEnabled: boolean
  solo?: number
}

function Wave({ wave, manifest, texture, progress, compact, streaksEnabled, solo }: WaveProps) {
  const cfg = wave === 'w1' ? WAVE1 : WAVE2
  const logos = useMemo(() => logosFor(wave), [wave])
  const streakTex = useMemo(() => getStreakTexture(), [])

  const aspects = useMemo(
    () => logos.map((l) => manifest.entries[l.id]?.aspect ?? FALLBACK_ASPECTS[l.id] ?? 2),
    [logos, manifest],
  )
  const slots: Slot[] = useMemo(() => computeSlots(wave, aspects, compact), [wave, aspects, compact])
  const spawns = useMemo(() => computeSpawns(wave), [wave])

  // Per-logo geometry: shared-atlas texture, UVs remapped to the content rect.
  const geos = useMemo(() => {
    return logos.map((logo, i) => {
      const [w, h] = slots[i].size
      const g = new THREE.PlaneGeometry(w, h)
      const uv = manifest.entries[logo.id]?.uv
      if (uv) {
        const attr = g.getAttribute('uv') as THREE.BufferAttribute
        for (let k = 0; k < attr.count; k++) {
          attr.setXY(k, uv.u0 + attr.getX(k) * (uv.u1 - uv.u0), uv.v0 + attr.getY(k) * (uv.v1 - uv.v0))
        }
        attr.needsUpdate = true
      }
      return g
    })
  }, [logos, slots, manifest])
  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos])

  const ribbonGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), [])
  useEffect(() => () => ribbonGeo.dispose(), [ribbonGeo])

  const groups = useRef<(THREE.Group | null)[]>([])
  const planeMats = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const ribbons = useRef<(THREE.Mesh | null)[][]>([])
  const ribbonMats = useRef<(THREE.MeshBasicMaterial | null)[][]>([])

  useFrame(({ camera, clock, size }) => {
    const p = clamp01(readStageProgress(progress))
    const time = clock.elapsedTime
    const persp = camera as THREE.PerspectiveCamera
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(persp.fov * 0.5))
    for (let i = 0; i < 8; i++) {
      const g = groups.current[i]
      const pm = planeMats.current[i]
      if (!g || !pm) continue
      const st = logoFlight(wave, i, p, spawns[i], slots[i])
      g.visible = st.t > 0.0001 && (solo === undefined || solo === i)
      if (!g.visible) continue
      g.position.set(st.pos[0], st.pos[1], st.pos[2])
      if (st.settled) g.position.y += hoverOffset(slots[i].phase, time)
      g.quaternion.copy(camera.quaternion)
      pm.opacity = cfg.opacity[i] * st.fade
      // Round 2: distant thin wordmarks erode under minified mipmaps +
      // alphaTest 0.4 (they pop in only when close). Relax the cutout while
      // far so the mark reads as a tiny bright point from spawn, hardening
      // to the crisp cutout as it arrives.
      pm.alphaTest = lerp(0.12, 0.4, smoothstep(0.15, 0.35, st.t))

      const sN = st.speed // 1 → 0 over flight; 0 once settled
      // Brief motion-stretch along travel at peak speed: the mark smears
      // laterally while fast, relaxing to true shape as it decelerates.
      // (Travel is camera-relative +z, so on a billboard this reads as a
      // velocity pulse; settled marks are always undistorted.)
      g.scale.set(1 + 0.35 * sN, 1 + 0.12 * sN, 1)
      // Round 2: streaks are sized in SCREEN pixels, not world metres — a
      // world-size ribbon on a 30px-distant logo is sub-pixel and invisible
      // (round-1 finding). World length = pixel length × metres-per-pixel at
      // the logo's depth, so the comet reads at every distance.
      const dist = camera.position.distanceTo(g.position)
      const px = (2 * dist * tanHalf) / Math.max(1, size.height)
      // Round 2b: streaks decay SLOWER than the arrival curve (2^(−4t) vs
      // 2^(−10t)): the expo flight parks the logo while it is still visibly
      // moving, so a fast-decaying tail vanishes before the eye registers
      // it. The slow tail reads as a dissipating comet through decel;
      // endFade still guarantees streak-free settled marks.
      const sNslow = st.t >= 1 ? 0 : Math.pow(2, -4 * st.t)
      const lenPx = Math.min(26 + 150 * sNslow * cfg.streakLength, 200)
      const len = lenPx * px
      // Streaks die out over the last ~15% of flight so no ghost bar lingers
      // on nearly-settled marks; settled logos are streak-free.
      const endFade = 1 - smoothstep(0.85, 1, st.t)
      const op = Math.pow(sNslow, 0.5) * cfg.streakOpacity * st.fade * endFade
      // Trail side: the lateral direction the mark came from (spawn − slot).
      const trailDir = spawns[i][0] >= slots[i].pos[0] ? 1 : -1
      for (let r = 0; r < 3; r++) {
        const mesh = ribbons.current[i]?.[r]
        const mat = ribbonMats.current[i]?.[r]
        if (!mesh || !mat) continue
        const h = (r === 0 ? 3.5 : r === 1 ? 5.5 : 8) * px
        mesh.visible = streaksEnabled && op > 0.004
        if (!mesh.visible) continue
        // Lateral comet-smear: head overlaps the mark, tail extends
        // spawn-ward; slight vertical/asymmetric offsets per ribbon.
        mesh.scale.set(len, h, 1)
        mesh.position.set(
          trailDir * len * 0.32 + (r === 0 ? 0.012 : r === 1 ? -0.016 : 0.004) * sN,
          (r === 0 ? 0.012 : r === 1 ? -0.014 : 0.002) * (0.4 + 0.6 * sN) + (r - 1) * h * 0.55,
          -0.001 - r * 0.001,
        )
        mat.opacity = r === 0 ? op : r === 1 ? op * 0.7 : op * 0.45
      }
    }
  })

  return (
    <group>
      {logos.map((logo, i) => (
        <group
          key={`${wave}-${logo.id}`}
          ref={(g) => {
            groups.current[i] = g
          }}
          visible={false}
        >
          <mesh geometry={geos[i]} renderOrder={1}>
            <meshBasicMaterial
              ref={(m) => {
                planeMats.current[i] = m
              }}
              map={texture}
              transparent
              alphaTest={0.4}
              depthWrite
              toneMapped={false}
              opacity={0}
            />
          </mesh>
          {[0, 1, 2].map((r) => (
            <mesh
              key={r}
              geometry={ribbonGeo}
              renderOrder={3}
              ref={(m) => {
                ribbons.current[i] = ribbons.current[i] ?? []
                ribbons.current[i][r] = m
              }}
            >
              <meshBasicMaterial
                ref={(m) => {
                  ribbonMats.current[i] = ribbonMats.current[i] ?? []
                  ribbonMats.current[i][r] = m
                }}
                map={streakTex}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

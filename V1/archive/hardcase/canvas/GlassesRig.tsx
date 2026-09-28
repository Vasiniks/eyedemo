import { Suspense, useEffect, useRef } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import {
  glassesFold,
  glassesHover,
  glassesHoverAmount,
  glassesLift,
} from './rigs/progressMap'
import { GLASSES_URLS, withMeshopt } from './rigs/modelLoader'
import { upgradeRigMaterials } from './rigs/materialUpgrades'

/**
 * Lane C — GlassesRig (Phase 4 step 6, round-2 binding).
 *
 * Consumes the RAW Phase-3 `public/models/glasses.glb`
 * (see rigs/modelLoader.ts — the conditioned `.opt.glb` carries
 * per-node differential scales that disassemble the rig; Lane D
 * reconditions under docs/phase4/requests/C-opt-recondition.md).
 * As-built contract (PLAN-MASTER §5 ORCHESTRATOR OVERRIDE):
 *   nodes  G_Root > G_Front, G_Lenses (one mesh, static), G_Arm_R, G_Arm_L
 *          (origins at hinge pivots; arm geometry extends local −Z;
 *          exported OPEN, rotations 0).
 *   seat   G_Root already carries the lying pose (rot −90° X) + cradle offset
 *          — load case + glasses into the same parent at origin and the
 *          glasses sit in the cradle. This rig never touches G_Root itself;
 *          lift/stand/hover run on a wrapper group above the loaded scene.
 *   fold   about arm-local Y: R +90°, L −85° + 4° tilt about local X
 *          (verified empirically in the Lane-C harness: folded arms tuck
 *          across the lens backs into a compact 140×42×35mm slab inside
 *          the cradle — see docs/phase4/qa/C/).
 *   hero   wrapper stands 0→90° about X (cancels the seat rotation → lens
 *          plane vertical facing +Z, arms pointing −Z away) + staged
 *          heroYaw about Y so the lenses face the staging camera.
 *          Pitch is 0° ± hover — never the old −30° settle.
 *
 * Sole input is lane-local `progress` q∈[0,1] (B3–B4 window of the master).
 * Pure function of (q, clock) — scrub-reversible (hover is the only
 * time-driven term, and it scales with a q-gated amount).
 *
 * NOTE on state: hinge nodes + rest poses + fade materials live in a
 * module-level WeakMap keyed by the loaded scene (primed once in the effect,
 * read per-frame) — per-frame scene-graph writes stay out of React
 * state/refs entirely (see CaseRig note).
 */

export type FoldAxis = 'x' | 'y' | 'z'

export interface GlassesRigProps {
  /** Lane-local progress 0–1 (B3–B4 window of the film master). */
  progress?: number
  /** Override model URL (harness use). */
  url?: string
  /** Group position / rotation passthrough for staging. */
  position?: [number, number, number]
  rotation?: [number, number, number]
  /** Harness-only overrides to verify the fold axes empirically. */
  debugFoldAxis?: FoldAxis
  debugFoldSignR?: number
  debugFoldSignL?: number
  debugTiltAxis?: FoldAxis
  /**
   * Harness-only: pin lift at seat with full opacity so the folded pose can
   * be inspected (q still drives the fold angles).
   */
  inspectFolded?: boolean
  /**
   * Staged hero yaw (degrees about wrapper Y, 0→full over q0.40–0.55).
   * Faces the lenses at the staging camera: the dev harness passes 29
   * (its fixed 3/4 camera azimuth); the film defaults to 0 (faces +Z —
   * Lane B aims its own camera).
   */
  heroYawDeg?: number
}

/* Verified in the Lane-C harness against docs/phase4/qa/C/ captures:
 * folded arms lie flat behind the lens plane, tips clear of each other
 * (R carries a +3mm depth offset while folded, §6 B3). */
export const FOLD_AXIS: FoldAxis = 'y'
export const FOLD_SIGN_R = 1
export const FOLD_SIGN_L = -1
export const FOLD_MAG_R = 90
export const FOLD_MAG_L = 85
export const TILT_AXIS: FoldAxis = 'x'
export const TILT_DEG = 4
/** Depth offset (m) on the R arm while folded so tips never clip. */
export const FOLD_DEPTH_OFFSET_M = 0.003

const DEG = Math.PI / 180

interface RigNodes {
  armR: THREE.Object3D | null
  armL: THREE.Object3D | null
  mats: THREE.Material[]
  restR: THREE.Euler
  restL: THREE.Euler
  basePosR: THREE.Vector3
}

/** Hinge nodes + rest poses + fade materials per loaded scene. */
const rigNodeCache = new WeakMap<THREE.Object3D, RigNodes>()

function getRigNodes(scene: THREE.Object3D): RigNodes {
  const cached = rigNodeCache.get(scene)
  if (cached) return cached
  const armR = scene.getObjectByName('G_Arm_R')
  const armL = scene.getObjectByName('G_Arm_L')
  const mats: THREE.Material[] = []
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.isMesh) {
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const m of list) {
        m.transparent = true
        mats.push(m)
      }
    }
  })
  const nodes: RigNodes = {
    armR: armR ?? null,
    armL: armL ?? null,
    mats,
    restR: armR ? armR.rotation.clone() : new THREE.Euler(),
    restL: armL ? armL.rotation.clone() : new THREE.Euler(),
    basePosR: armR ? armR.position.clone() : new THREE.Vector3(),
  }
  rigNodeCache.set(scene, nodes)
  return nodes
}

interface ModelProps extends Required<Pick<GlassesRigProps, 'progress'>> {
  url: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  foldAxis: FoldAxis
  foldSignR: number
  foldSignL: number
  tiltAxis: FoldAxis
  inspectFolded: boolean
  heroYawDeg: number
}

function GlassesModel({ progress, url, position, rotation, foldAxis, foldSignR, foldSignL, tiltAxis, inspectFolded, heroYawDeg }: ModelProps) {
  const gltf = useLoader(GLTFLoader, url, withMeshopt)
  const wrapper = useRef<THREE.Group>(null)

  // Material prep once per load. YXZ order: stand-up pitch first, then
  // hero yaw about world Y (yawing a lying slab like a compass would
  // tip the lens normal off vertical — order matters).
  useEffect(() => {
    upgradeRigMaterials(gltf.scene)
    if (wrapper.current) wrapper.current.rotation.order = 'YXZ'
  }, [gltf])

  useFrame(({ clock }) => {
    const w = wrapper.current
    if (!w) return
    const nodes = getRigNodes(gltf.scene)
    const q = progress
    const lift = glassesLift(q)
    const { foldL, foldR } = glassesFold(q)
    const hoverAmt = glassesHoverAmount(q)
    const hover = glassesHover(clock.elapsedTime)

    // Emerge: rise folded + settle tilt, stand up in open air, then hover.
    // inspectFolded pins the seat pose with full opacity for fold QA.
    const liftY = inspectFolded ? 0 : lift.y
    const liftRotX = inspectFolded ? 0 : lift.rotX
    const heroYaw = inspectFolded ? 0 : heroYawDeg * lift.yawAmt
    const hoverScale = inspectFolded ? 0 : hoverAmt
    w.position.y = liftY + hover.bobY * hoverScale
    w.rotation.x = liftRotX * DEG
    w.rotation.y = heroYaw * DEG + hover.yaw * DEG * hoverScale

    const op = inspectFolded ? 1 : lift.opacity
    for (const m of nodes.mats) m.opacity = op
    w.visible = op > 0.001

    // Unfold: staggered L-then-R with baked overshoot + settle.
    // foldL/foldR are remainders in degrees (85/90 → 0); sign = handedness.
    if (nodes.armR) {
      nodes.armR.rotation.copy(nodes.restR)
      nodes.armR.rotation[foldAxis] += foldR * DEG * foldSignR
      const foldedFrac = Math.min(1, Math.abs(foldR) / FOLD_MAG_R)
      nodes.armR.position.copy(nodes.basePosR)
      // Local +z maps to world +y here: stacks the R slab a hair above L
      // while folded so the temple tips never clip each other.
      nodes.armR.position.z += FOLD_DEPTH_OFFSET_M * foldedFrac
    }
    if (nodes.armL) {
      nodes.armL.rotation.copy(nodes.restL)
      nodes.armL.rotation[foldAxis] += foldL * DEG * foldSignL
      // L −85° + 4° tilt about local X, scaled by folded fraction.
      const foldedFrac = Math.min(1, Math.abs(foldL) / FOLD_MAG_L)
      nodes.armL.rotation[tiltAxis] += TILT_DEG * DEG * foldedFrac
    }
  })

  return (
    <group ref={wrapper} position={position} rotation={rotation}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export function GlassesRig(props: GlassesRigProps) {
  const {
    progress = 0,
    url = GLASSES_URLS[0],
    position,
    rotation,
    debugFoldAxis = FOLD_AXIS,
    debugFoldSignR = FOLD_SIGN_R,
    debugFoldSignL = FOLD_SIGN_L,
    debugTiltAxis = TILT_AXIS,
    inspectFolded = false,
    heroYawDeg = 0,
  } = props
  return (
    <Suspense fallback={null}>
      <GlassesModel
        progress={progress}
        url={url}
        position={position}
        rotation={rotation}
        foldAxis={debugFoldAxis}
        foldSignR={debugFoldSignR}
        foldSignL={debugFoldSignL}
        tiltAxis={debugTiltAxis}
        inspectFolded={inspectFolded}
        heroYawDeg={heroYawDeg}
      />
    </Suspense>
  )
}

import { Suspense, useEffect, useRef } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { caseFlapAngle, caseFlapWeights, smoothstep } from './rigs/progressMap'
import { CASE_URLS, withMeshopt } from './rigs/modelLoader'
import { upgradeRigMaterials } from './rigs/materialUpgrades'

/**
 * Lane C — CaseRig (Phase 4 step 5).
 *
 * Consumes the RAW Phase-3 `public/models/case.glb`
 * (see rigs/modelLoader.ts — the conditioned `.opt.glb` carries
 * per-node differential scales; Lane D reconditions under
 * docs/phase4/requests/C-opt-recondition.md).
 * As-built contract (PLAN-MASTER §5 ORCHESTRATOR OVERRIDE):
 *   nodes  Case_Root > Case_Body, Case_Flap, Velvet_Cushion
 *   flap   4 morph targets Open10/Open20/Open30/Open40 (absolute poses at
 *          10/20/30/40°, ends lag 15%) — hat interpolation, elastic overshoot
 *          drives `a` slightly past 40 then settles to 40.
 *   logo   real deboss geometry (untouched here).
 *
 * Sole input is lane-local `progress` q∈[0,1] (see rigs/progressMap.ts for
 * the master-p remap). Pure function of q — scrub-reversible.
 *
 * NOTE on state: morph carriers live in a module-level WeakMap keyed by the
 * loaded scene (primed once in the effect, read per-frame). This keeps the
 * per-frame scene-graph writes out of React state/refs entirely — the
 * idiomatic R3F pattern the react-hooks immutability rule otherwise flags.
 */

export interface CaseRigProps {
  /** Lane-local progress 0–1 (B2 window of the film master). */
  progress?: number
  /** Override model URL (harness use). */
  url?: string
  /** Group position / rotation passthrough for staging. */
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/** Morph carriers per loaded scene (module state — never React state). */
const flapMeshCache = new WeakMap<THREE.Object3D, THREE.Mesh[]>()

function getFlapMeshes(scene: THREE.Object3D): THREE.Mesh[] {
  const cached = flapMeshCache.get(scene)
  if (cached) return cached
  const meshes: THREE.Mesh[] = []
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.isMesh && mesh.morphTargetInfluences && mesh.morphTargetInfluences.length >= 4) {
      meshes.push(mesh)
    }
  })
  flapMeshCache.set(scene, meshes)
  return meshes
}

function CaseModel({ progress, url, position, rotation }: { progress: number; url: string } & Pick<CaseRigProps, 'position' | 'rotation'>) {
  const gltf = useLoader(GLTFLoader, url, withMeshopt)
  const group = useRef<THREE.Group>(null)

  // Upgrade materials once per load.
  useEffect(() => {
    upgradeRigMaterials(gltf.scene)
  }, [gltf])

  useFrame(() => {
    const g = group.current
    if (!g) return
    const q = progress
    // Case reveal (B1 head of the window): scale 0.92→1 + settle over q 0–0.15.
    const reveal = smoothstep(0, 0.15, q)
    g.scale.setScalar(0.92 + 0.08 * reveal)
    // Flap pose via morph hat weights.
    const weights = caseFlapWeights(caseFlapAngle(q))
    for (const mesh of getFlapMeshes(gltf.scene)) {
      const inf = mesh.morphTargetInfluences
      if (!inf) continue
      inf[0] = weights[0]
      inf[1] = weights[1]
      inf[2] = weights[2]
      inf[3] = weights[3]
    }
  })

  return (
    <group ref={group} position={position} rotation={rotation}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export function CaseRig(props: CaseRigProps) {
  const { progress = 0, url = CASE_URLS[0], position, rotation } = props
  return (
    <Suspense fallback={null}>
      <CaseModel progress={progress} url={url} position={position} rotation={rotation} />
    </Suspense>
  )
}

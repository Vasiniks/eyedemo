import * as THREE from 'three'

/**
 * Lane C round-2 automated checks (binding: docs/phase4/feedback/C-round1.md).
 *
 * Runs INSIDE the dev harness against the live rig scene (the real
 * CaseRig/GlassesRig output, not a reimplementation): steps q 0→1 in
 * 0.02 increments, lets the rigs settle, and measures —
 *   (a) every sampled arm vertex (world) distance to its own hinge pivot
 *       stays constant (±0.5mm) → arms travel with the frame, plus the
 *       hinge-pivot → frame-centre distance stays constant (attachment);
 *   (b) for q ≥ 0.4 no sampled glasses vertex lies inside the cradle
 *       volume (Case_Body + Velvet_Cushion union bbox, flap excluded —
 *       it swings away; the bowl is what must be vacated);
 *   (c) for q ≥ 0.55 lens-plane normal · camera-forward ≤ −0.95
 *       (upright, facing the staging camera).
 * Prints `LANEC-VERIFY <json>` to the console; the node runner
 * (runVerify.mjs) saves it to docs/phase4/qa/C/round2-verify.json.
 */

export interface ArmCheck {
  samples: number
  minM: number
  maxM: number
  spreadMm: number
  pass: boolean
}

export interface ClearanceCheck {
  worstQ: number
  minClearanceMm: number
  violations: number
  pass: boolean
}

export interface FacingCheck {
  worstQ: number
  worstDot: number
  pass: boolean
}

export interface LaneCVerifyResult {
  ok: boolean
  qStep: number
  heroYawDeg: number
  cameraPos: [number, number, number]
  cameraForward: [number, number, number]
  armR: ArmCheck
  armL: ArmCheck
  attachR: ArmCheck
  attachL: ArmCheck
  clearance: ClearanceCheck
  facing: FacingCheck
  notes: string[]
}

const Q_STEP = 0.02
const TOL_M = 0.0005
const ARM_TARGET_SAMPLES = 300
const GLASSES_TARGET_SAMPLES = 4000

const raf = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })

async function waitForModels(scene: THREE.Scene): Promise<void> {
  for (let i = 0; i < 600; i++) {
    if (scene.getObjectByName('G_Root') && scene.getObjectByName('Case_Body')) return
    await raf()
  }
  throw new Error('verify: timed out waiting for G_Root / Case_Body')
}

function collectMeshes(root: THREE.Object3D | undefined): THREE.Mesh[] {
  const out: THREE.Mesh[] = []
  if (!root) return out
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) out.push(obj as THREE.Mesh)
  })
  return out
}

/** Strided (mesh, vertex) sample descriptors — identical set every q. */
interface VertSample {
  mesh: THREE.Mesh
  idx: number
}

function describeVertices(meshes: THREE.Mesh[], target: number): VertSample[] {
  let total = 0
  for (const m of meshes) {
    const pos = m.geometry.getAttribute('position') as THREE.BufferAttribute | undefined
    total += pos ? pos.count : 0
  }
  const stride = Math.max(1, Math.floor(total / target))
  const out: VertSample[] = []
  for (const mesh of meshes) {
    const pos = mesh.geometry.getAttribute('position') as THREE.BufferAttribute | undefined
    if (!pos) continue
    for (let idx = 0; idx < pos.count; idx += stride) out.push({ mesh, idx })
  }
  return out
}

function unionBox(meshes: THREE.Mesh[]): THREE.Box3 {
  const box = new THREE.Box3()
  const tmp = new THREE.Box3()
  for (const m of meshes) {
    tmp.setFromObject(m)
    box.union(tmp)
  }
  return box
}

export async function runLaneCVerification(opts: {
  scene: THREE.Scene
  camera: THREE.Camera
  setQ: (q: number) => void
  heroYawDeg: number
}): Promise<LaneCVerifyResult> {
  const { scene, camera, setQ, heroYawDeg } = opts
  const notes: string[] = []
  await waitForModels(scene)

  const armR = scene.getObjectByName('G_Arm_R')
  const armL = scene.getObjectByName('G_Arm_L')
  const front = scene.getObjectByName('G_Front')
  const lenses = scene.getObjectByName('G_Lenses')
  const gRoot = scene.getObjectByName('G_Root')
  if (!armR || !armL || !front || !lenses || !gRoot) {
    throw new Error('verify: missing rig nodes')
  }

  // Cradle volume: the bowl that must be vacated (flap swings away).
  const cradleBox = unionBox([
    ...collectMeshes(scene.getObjectByName('Case_Body') ?? undefined),
    ...collectMeshes(scene.getObjectByName('Velvet_Cushion') ?? undefined),
  ])
  if (cradleBox.isEmpty()) throw new Error('verify: empty cradle bbox')
  notes.push(
    `cradle bbox (Case_Body+Velvet_Cushion): min ${cradleBox.min.toArray().map((x) => x.toFixed(4)).join(',')} max ${cradleBox.max.toArray().map((x) => x.toFixed(4)).join(',')}`,
  )

  const armMeshesR = collectMeshes(armR)
  const armMeshesL = collectMeshes(armL)
  const glassesMeshes = collectMeshes(gRoot)
  // Fixed sample sets: per-vertex min/max over q proves rigid travel.
  const sampR = describeVertices(armMeshesR, ARM_TARGET_SAMPLES)
  const sampL = describeVertices(armMeshesL, ARM_TARGET_SAMPLES)
  const sampGlass = describeVertices(glassesMeshes, GLASSES_TARGET_SAMPLES)
  const mnR = new Float64Array(sampR.length).fill(Infinity)
  const mxR = new Float64Array(sampR.length).fill(-Infinity)
  const mnL = new Float64Array(sampL.length).fill(Infinity)
  const mxL = new Float64Array(sampL.length).fill(-Infinity)
  let aRMin = Infinity
  let aRMax = -Infinity
  let aLMin = Infinity
  let aLMax = -Infinity
  let worstClearQ = -1
  let minClear = Infinity
  let violations = 0
  let worstFaceQ = -1
  let worstDot = -Infinity

  const pivotR = new THREE.Vector3()
  const pivotL = new THREE.Vector3()
  const frontC = new THREE.Vector3()
  const frontBox = new THREE.Box3()
  const lensQ = new THREE.Quaternion()
  const lensN = new THREE.Vector3()
  const camF = new THREE.Vector3()
  const zAxis = new THREE.Vector3(0, 0, 1)
  const tmpV = new THREE.Vector3()

  const steps = Math.round(1 / Q_STEP)
  for (let s = 0; s <= steps; s++) {
    const q = Math.min(1, s * Q_STEP)
    setQ(q)
    await raf()
    await raf()
    await raf()
    scene.updateMatrixWorld(true)

    armR.getWorldPosition(pivotR)
    armL.getWorldPosition(pivotL)
    frontBox.setFromObject(front)
    frontBox.getCenter(frontC)

    // (a) per-vertex distance to own pivot (must be constant over q for
    // rigid travel) + pivot-to-frame attachment distance.
    const accArm = (samples: VertSample[], mn: Float64Array, mx: Float64Array, pivot: THREE.Vector3): void => {
      for (let i = 0; i < samples.length; i++) {
        const smp = samples[i]
        const attr = smp.mesh.geometry.getAttribute('position') as THREE.BufferAttribute
        tmpV.fromBufferAttribute(attr, smp.idx).applyMatrix4(smp.mesh.matrixWorld)
        const d = tmpV.distanceTo(pivot)
        if (d < mn[i]) mn[i] = d
        if (d > mx[i]) mx[i] = d
      }
    }
    accArm(sampR, mnR, mxR, pivotR)
    accArm(sampL, mnL, mxL, pivotL)
    const dAttachR = pivotR.distanceTo(frontC)
    const dAttachL = pivotL.distanceTo(frontC)
    if (dAttachR < aRMin) aRMin = dAttachR
    if (dAttachR > aRMax) aRMax = dAttachR
    if (dAttachL < aLMin) aLMin = dAttachL
    if (dAttachL > aLMax) aLMax = dAttachL

    // (b) cradle clearance for q ≥ 0.4.
    if (q >= 0.4 - 1e-9) {
      for (const smp of sampGlass) {
        const attr = smp.mesh.geometry.getAttribute('position') as THREE.BufferAttribute
        tmpV.fromBufferAttribute(attr, smp.idx).applyMatrix4(smp.mesh.matrixWorld)
        if (cradleBox.containsPoint(tmpV)) violations++
        const clear = cradleBox.distanceToPoint(tmpV)
        if (clear < minClear) {
          minClear = clear
          worstClearQ = q
        }
      }
    }

    // (c) lens facing for q ≥ 0.55.
    if (q >= 0.55 - 1e-9) {
      lenses.getWorldQuaternion(lensQ)
      lensN.copy(zAxis).applyQuaternion(lensQ)
      camera.getWorldDirection(camF)
      const dot = lensN.dot(camF)
      if (dot > worstDot) {
        worstDot = dot
        worstFaceQ = q
      }
    }
  }

  // Worst per-vertex spread over q (the binding's "constant ±0.5mm").
  const spreadOf = (mn: Float64Array, mx: Float64Array): { spread: number; mean: number } => {
    let worst = 0
    let sum = 0
    for (let i = 0; i < mn.length; i++) {
      const sp = mx[i] - mn[i]
      if (sp > worst) worst = sp
      sum += (mx[i] + mn[i]) / 2
    }
    return { spread: worst, mean: mn.length > 0 ? sum / mn.length : 0 }
  }
  const mkArm = (mn: Float64Array, mx: Float64Array): ArmCheck => {
    const { spread, mean } = spreadOf(mn, mx)
    return { samples: mn.length, minM: mean, maxM: mean, spreadMm: spread * 1000, pass: mn.length > 0 && spread <= TOL_M }
  }
  const armRc = mkArm(mnR, mxR)
  const armLc = mkArm(mnL, mxL)
  const mkRange = (mn: number, mx: number, samples: number): ArmCheck => ({
    samples,
    minM: mn,
    maxM: mx,
    spreadMm: (mx - mn) * 1000,
    pass: samples > 0 && mx - mn <= TOL_M,
  })
  const attachRc = mkRange(aRMin, aRMax, steps + 1)
  const attachLc = mkRange(aLMin, aLMax, steps + 1)
  const clearance: ClearanceCheck = {
    worstQ: worstClearQ,
    minClearanceMm: minClear * 1000,
    violations,
    pass: violations === 0,
  }
  const facing: FacingCheck = { worstQ: worstFaceQ, worstDot, pass: worstDot <= -0.95 }
  if (minClear * 1000 < 20) {
    notes.push(`min clearance ${minClear.toFixed(4)}m below the 20mm binding target — check worstQ ${worstClearQ}`)
  }

  camera.getWorldDirection(camF)
  const result: LaneCVerifyResult = {
    ok: armRc.pass && armLc.pass && attachRc.pass && attachLc.pass && clearance.pass && facing.pass,
    qStep: Q_STEP,
    heroYawDeg,
    cameraPos: [camera.position.x, camera.position.y, camera.position.z],
    cameraForward: [camF.x, camF.y, camF.z],
    armR: armRc,
    armL: armLc,
    attachR: attachRc,
    attachL: attachLc,
    clearance,
    facing,
    notes,
  }
  console.log('LANEC-VERIFY ' + JSON.stringify(result))
  return result
}

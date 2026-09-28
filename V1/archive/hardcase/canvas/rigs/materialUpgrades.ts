import * as THREE from 'three'

/**
 * Lane C — material upgrades for the hero objects (steps 5, 6).
 *
 * Keyed by Blender material NAME so both `*.opt.glb` and raw `*.glb` work.
 * Tokens: Velvet-shadow #22060A (base), Sheen #8E2E38 (lamp-catch, render
 * only), Graphite-800 #121519 / Graphite-700 #1B2027 (case refs),
 * Steel-edge #4B5563 (chamfer catchlights only).
 */

let fibreBump: THREE.DataTexture | null = null

/**
 * Tiny procedural fibre-noise bump for the velvet pile. Generated once at
 * runtime — no asset file, no network. Subtle by design (bumpScale ~1.5mm
 * equivalent would be far too strong; keep it near the quantisation floor).
 */
export function getVelvetFibreBump(): THREE.DataTexture {
  if (fibreBump) return fibreBump
  const size = 256
  const data = new Uint8Array(size * size)
  // Seeded LCG so reloads reproduce identical state (pure-function discipline).
  let seed = 0x2b4f1a9d
  const rand = (): number => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0xffffffff
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Anisotropic streaks (pile direction) + fine grain.
      const streak = Math.sin((x * 0.7 + y * 0.13) * 0.9 + rand() * 0.6) * 0.5 + 0.5
      const grain = rand()
      data[y * size + x] = Math.round(255 * (0.35 * streak + 0.65 * grain))
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RedFormat)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(6, 3)
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.needsUpdate = true
  fibreBump = tex
  return tex
}

/**
 * Upgrade an exported `Velvet_Oxblood` material so it reads as VELVET under
 * grazing light instead of flat dark cloth. The export ships with NO base
 * color (defaults to white — reads silver) and a weak sheen; we ground it:
 * dark oxblood base, full sheen in deep red, tighter roughness, fibre bump.
 */
export function upgradeVelvet(mat: THREE.MeshPhysicalMaterial): void {
  mat.color.set('#22060A') // Velvet-shadow token — light-absorbing base
  mat.roughness = 0.85
  mat.metalness = 0
  mat.sheen = 0.85
  mat.sheenColor.set('#8E2E38') // Sheen token (deep red lamp-catch)
  mat.sheenRoughness = 0.4
  mat.bumpMap = getVelvetFibreBump()
  mat.bumpScale = 0.15
  mat.needsUpdate = true
}

/**
 * Keep the graphite shell a neutral near-black matte, never silver and
 * never warm-tinted: Phase-3 base (#050506-ish, rough 0.42) grounded to
 * the Graphite tokens, zero metalness so warm practicals can't bronze
 * it, low env response so it holds a silhouette in the dark.
 */
export function upgradeGraphite(mat: THREE.MeshPhysicalMaterial): void {
  mat.color.set('#0B0D10')
  mat.roughness = 0.45
  mat.metalness = 0
  mat.envMapIntensity = 0.5
  mat.emissive.set('#000000')
  if ('sheen' in mat) mat.sheen = 0
  mat.needsUpdate = true
}

/** Cut rims stay metallic (chamfer catchlights only — never flat fill). */
export function upgradeEdgeMetal(mat: THREE.MeshPhysicalMaterial): void {
  mat.envMapIntensity = 0.8
  mat.emissive.set('#000000')
  mat.needsUpdate = true
}

/** Glossy deboss recess — crisp edges, no light spill. */
export function upgradeLogoGloss(mat: THREE.MeshPhysicalMaterial): void {
  mat.envMapIntensity = 0.6
  mat.emissive.set('#000000')
  mat.needsUpdate = true
}

/** Bright polished lens edges (01_Glasses_Side.001) catch the strip lights. */
export function upgradeLensEdge(mat: THREE.MeshPhysicalMaterial): void {
  mat.envMapIntensity = 1.6
  mat.needsUpdate = true
}

/** Smoke lenses: delivered dark-smoke transmission — keep, tame env wash. */
export function upgradeLens(mat: THREE.MeshPhysicalMaterial): void {
  mat.envMapIntensity = 1.0
  mat.emissive.set('#000000')
  mat.needsUpdate = true
}

/** Smoke nose pads: dark silicone that must NEVER glow pink. The export
 *  ships them transmissive (transmission 0.7) so the warm velvet practical
 *  pipes straight through them — kill transmission to opaque, ground the
 *  base, kill emissive/sheen, starve environment. */
export function upgradeNosePad(mat: THREE.MeshPhysicalMaterial): void {
  mat.transmission = 0
  mat.thickness = 0
  mat.color.set('#0A0B0C')
  mat.roughness = 0.55
  mat.metalness = 0
  mat.emissive.set('#000000')
  mat.emissiveIntensity = 0
  if ('sheen' in mat) {
    mat.sheen = 0
    mat.sheenColor.set('#000000')
  }
  mat.envMapIntensity = 0.35
  mat.needsUpdate = true
}

/** Walk a loaded rig and upgrade every known material by name. */
export function upgradeRigMaterials(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh || !(mesh as THREE.Mesh).isMesh) return
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const m of mats) {
      if (!(m instanceof THREE.MeshPhysicalMaterial) && !(m instanceof THREE.MeshStandardMaterial)) continue
      const phys = m as THREE.MeshPhysicalMaterial
      switch (m.name) {
        case 'Velvet_Oxblood':
          if (phys instanceof THREE.MeshPhysicalMaterial) upgradeVelvet(phys)
          break
        case 'Case_Graphite':
          upgradeGraphite(phys)
          break
        case 'Case_EdgeMetal':
          upgradeEdgeMetal(phys)
          break
        case 'Logo_Gloss':
          upgradeLogoGloss(phys)
          break
        case '01_Glasses_Side.001':
          upgradeLensEdge(phys)
          break
        case '01_Glasses.001':
          upgradeLens(phys)
          break
        case '02_nose.001':
          if (m instanceof THREE.MeshPhysicalMaterial) upgradeNosePad(m)
          else if (m instanceof THREE.MeshStandardMaterial) {
            m.emissive.set('#000000')
            m.needsUpdate = true
          }
          break
        default:
          break
      }
    }
  })
}

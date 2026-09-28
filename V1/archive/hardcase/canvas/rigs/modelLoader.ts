import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

/**
 * Lane C — shared GLB loader.
 *
 * `case.opt.glb` / `glasses.opt.glb` are meshopt-compressed
 * (EXT_meshopt_compression, gltf-transform conditioned), so the loader must
 * carry three's bundled MeshoptDecoder — no extra dependency, no CDN.
 * KHR_mesh_quantization is handled natively by GLTFLoader.
 */

let shared: GLTFLoader | null = null

export function getRigLoader(): GLTFLoader {
  if (!shared) {
    shared = new GLTFLoader()
    // Bundled with the pinned `three` dep (no install, no network).
    shared.setMeshoptDecoder(MeshoptDecoder)
  }
  return shared
}

/** R3F `useLoader` extension: wires the meshopt decoder onto each instance. */
export function withMeshopt(loader: GLTFLoader): void {
  loader.setMeshoptDecoder(MeshoptDecoder)
}

/** Raw Phase-3 exports first (authoritative assembly: node names,
 *  hinge-pivot origins, transforms — see docs/phase3/PHASE3-REPORT.md).
 *  The conditioned `.opt.glb` files are second choice until Lane D
 *  reconditions them WITHOUT per-node differential scales
 *  (docs/phase4/requests/C-opt-recondition.md — the current opts
 *  shrink parts ~15× about their own origins and detach the arms). */
export const CASE_URLS = ['/models/case.glb', '/models/case.opt.glb'] as const
export const GLASSES_URLS = ['/models/glasses.glb', '/models/glasses.opt.glb'] as const

/** Fetch-first URL that exists (HEAD check), so a missing .opt file falls back. */
export async function resolveModelUrl(candidates: readonly string[]): Promise<string> {
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: 'HEAD' })
      if (res.ok) return url
    } catch {
      /* try next */
    }
  }
  return candidates[0]
}

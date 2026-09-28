// Lane D — logo orders + atlas manifests (PLAN-MASTER §6 B6/B7, brief §6c).
// Orders are binding. Display names match the live-site identities; the atlas
// PNGs are single-color light knockouts (brief §6c.2), rendered unlinked.
//
// W1 eyewear (8): Maui Jim, Ray-Ban, Prada, Miu Miu, Persol, Oakley,
//   Tiffany & Co., Versace.
// W2 insurers (8): Sun Life, Medavie Blue Cross, Manulife, GreenShield,
//   Canada Life, Desjardins, IA Financial Group, Empire Life.

import type { WaveId } from './slots'

export interface LogoDef {
  /** Atlas id (matches public/web/atlas-*.json logo entries). */
  id: string
  /** Human-readable identity (alt text / SR lists owned by Lane E). */
  name: string
}

export const WAVE1_LOGOS: LogoDef[] = [
  { id: 'maui-jim', name: 'Maui Jim' },
  { id: 'ray-ban', name: 'Ray-Ban' },
  { id: 'prada', name: 'Prada' },
  { id: 'miu-miu', name: 'Miu Miu' },
  { id: 'persol', name: 'Persol' },
  { id: 'oakley', name: 'Oakley' },
  { id: 'tiffany', name: 'Tiffany & Co.' },
  { id: 'versace', name: 'Versace' },
]

export const WAVE2_LOGOS: LogoDef[] = [
  { id: 'sun-life', name: 'Sun Life' },
  { id: 'medavie-blue-cross', name: 'Medavie Blue Cross' },
  { id: 'manulife', name: 'Manulife' },
  { id: 'greenshield', name: 'GreenShield' },
  { id: 'canada-life', name: 'Canada Life' },
  { id: 'desjardins', name: 'Desjardins' },
  { id: 'ia-financial-group', name: 'IA Financial Group' },
  { id: 'empire-life', name: 'Empire Life' },
]

export function logosFor(wave: WaveId): LogoDef[] {
  return wave === 'w1' ? WAVE1_LOGOS : WAVE2_LOGOS
}

export interface AtlasUv {
  u0: number
  v0: number
  u1: number
  v1: number
}

export interface AtlasEntry {
  /** Logo w/h aspect (true artwork aspect, from source_size). */
  aspect: number
  /** Content UV rect, bottom-left origin (three.js convention). */
  uv: AtlasUv
}

export interface AtlasManifest {
  /** Texture image URL (e.g. /web/atlas-brands.png). */
  textureUrl: string
  entries: Record<string, AtlasEntry>
}

interface RawAtlasLogo {
  id: string
  source_size: { w: number; h: number }
  content_uv_bl: { u0: number; v0: number; u1: number; v1: number }
}

interface RawAtlas {
  logos: RawAtlasLogo[]
}

/** Fallback aspects (atlas source_size w/h) if the JSON cannot be fetched. */
export const FALLBACK_ASPECTS: Record<string, number> = {
  'maui-jim': 960 / 496,
  'ray-ban': 2400 / 1198,
  prada: 2277 / 354,
  'miu-miu': 3684 / 571,
  persol: 3222 / 2016,
  oakley: 960 / 361,
  tiffany: 1280 / 156,
  versace: 1230 / 272,
  'sun-life': 800 / 196,
  'medavie-blue-cross': 1600 / 240,
  manulife: 738 / 141,
  greenshield: 331 / 72,
  'canada-life': 537 / 188,
  desjardins: 894 / 194,
  'ia-financial-group': 1600 / 874,
  'empire-life': 1280 / 407,
}

function fallbackManifest(textureUrl: string, ids: string[]): AtlasManifest {
  const entries: Record<string, AtlasEntry> = {}
  for (const id of ids) {
    // Full-texture fallback: geometry still aspect-correct; padding differs.
    entries[id] = { aspect: FALLBACK_ASPECTS[id] ?? 2, uv: { u0: 0, v0: 0, u1: 1, v1: 1 } }
  }
  return { textureUrl, entries }
}

async function loadOne(jsonUrl: string, ids: string[]): Promise<AtlasManifest> {
  const res = await fetch(jsonUrl)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${jsonUrl}`)
  const raw = (await res.json()) as RawAtlas
  const entries: Record<string, AtlasEntry> = {}
  for (const logo of raw.logos) {
    entries[logo.id] = {
      aspect: logo.source_size.w / logo.source_size.h,
      uv: logo.content_uv_bl,
    }
  }
  for (const id of ids) {
    if (!entries[id]) throw new Error(`Atlas ${jsonUrl} missing logo ${id}`)
  }
  return { textureUrl: jsonUrl.replace(/\.json$/, '.png'), entries }
}

/** Fetch both atlas manifests; per-atlas fallback keeps one wave alive. */
export async function loadAtlasManifests(): Promise<{ w1: AtlasManifest; w2: AtlasManifest }> {
  const w1Ids = WAVE1_LOGOS.map((l) => l.id)
  const w2Ids = WAVE2_LOGOS.map((l) => l.id)
  const [w1, w2] = await Promise.all([
    loadOne('/web/atlas-brands.json', w1Ids).catch(() =>
      fallbackManifest('/web/atlas-brands.png', w1Ids),
    ),
    loadOne('/web/atlas-insurers.json', w2Ids).catch(() =>
      fallbackManifest('/web/atlas-insurers.png', w2Ids),
    ),
  ])
  return { w1, w2 }
}

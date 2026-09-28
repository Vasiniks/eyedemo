// V1-CORE — tiny external film-progress store.
// FilmSequence writes; BrandWaves / FilmCaptions / Header read.
import { useSyncExternalStore } from 'react';
import {
  SNAP_SOURCE_KEYS,
  sourceToFilm,
  resolveFilmSpace,
  V2_FILM_MANIFEST,
  CHAPTER_TICKS,
} from './filmCurve';

let p = 0;
const listeners = new Set<() => void>();

// V3-SCROLL — beat dwell log (QA: fast flicks must hold every key beat
// ≥250 ms). Film progress partitions into one zone per snap key (nearest
// key-film wins); time spent per zone accumulates here for Playwright to
// read via `window.__v1BeatDwells`. Pure observation — no scroll shaping.

const KEY_FILMS: number[] = (() => {
  try {
    const space = resolveFilmSpace(V2_FILM_MANIFEST);
    return SNAP_SOURCE_KEYS.map((s) => sourceToFilm(s, space));
  } catch {
    return [];
  }
})();

const beatDwellMs: number[] = SNAP_SOURCE_KEYS.map(() => 0);
let beatZone = -1;
let beatZoneSince = 0;

function nowMs(): number {
  try {
    return performance.now();
  } catch {
    return Date.now();
  }
}

function zoneOf(v: number): number {
  if (KEY_FILMS.length === 0) return -1;
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < KEY_FILMS.length; i++) {
    const d = Math.abs(v - KEY_FILMS[i]);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

function trackBeatDwell(v: number): void {
  const z = zoneOf(v);
  const t = nowMs();
  if (beatZone < 0) {
    beatZone = z;
    beatZoneSince = t;
    return;
  }
  if (z !== beatZone) {
    if (beatZone >= 0 && beatZone < beatDwellMs.length) {
      beatDwellMs[beatZone] += Math.max(0, t - beatZoneSince);
    }
    beatZone = z;
    beatZoneSince = t;
  }
}

/** Per-key accumulated on-screen time (ms); includes the open zone. */
export function getBeatDwells(): Array<{ source: number; dwellMs: number }> {
  const t = nowMs();
  return SNAP_SOURCE_KEYS.map((source, i) => ({
    source,
    dwellMs: Math.round(beatDwellMs[i] + (i === beatZone ? Math.max(0, t - beatZoneSince) : 0)),
  }));
}

/** Reset the dwell log (tests only). */
export function resetBeatDwells(): void {
  for (let i = 0; i < beatDwellMs.length; i++) beatDwellMs[i] = 0;
  beatZone = zoneOf(p);
  beatZoneSince = nowMs();
}

try {
  (window as unknown as { __v1BeatDwells?: () => unknown }).__v1BeatDwells =
    getBeatDwells as unknown as () => unknown;
  (window as unknown as { __v1ResetBeats?: () => unknown }).__v1ResetBeats =
    resetBeatDwells as unknown as () => unknown;
} catch {
  /* SSR / tests without window */
}

export function setFilmProgress(v: number): void {
  const nv = Math.max(0, Math.min(1, v));
  trackBeatDwell(nv);
  if (Math.abs(nv - p) < 0.0005) return;
  p = nv;
  listeners.forEach((l) => l());
}

export function getFilmProgress(): number {
  return p;
}

export function subscribeFilmProgress(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useFilmProgress(): number {
  return useSyncExternalStore(subscribeFilmProgress, getFilmProgress, getFilmProgress);
}

// Alias required by the brief.
export const subscribe = subscribeFilmProgress;

// POLISH-FILM — ordinal chapter ticks for the film progress rail.
// Fractions only (no labels, no text); derived from the CURVE beat table so
// the rail and the scroll→film pacing share one source of truth.
export const FILM_CHAPTERS: readonly number[] = CHAPTER_TICKS;

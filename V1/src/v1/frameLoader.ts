// F4-PERF + LOADER (v4) — progressive loader for the film (3 tiers:
// full 3024×1720 q80 · web 1512×860 q68 · mobile 1024×582 q64) + hd
// 1920×1092 q72 ×3 interpolated (10762 frames, interp 3, driven by
// public/v1film/hd.json when present, absent → fall back to web).
// Desktop (incl. retina) serves hd when the sidecar exists, else web;
// full only with ?hq=1; mobile ≤820px / saveData / slow connection.
// Never blocks on the whole set: picks a tier, fetches a small initial
// batch (first 60 frames + every 12th frame + tail; hd: first 60 REAL
// frames + every 12th real + tail), then fills in around the playhead
// ±60 frames web-space (hd: ±180, i.e. same film span ×3) with a priority
// queue (max 4 concurrent fetches, createImageBitmap decode
// off-main-thread, LRU 240 desktop / 120 mobile / 300 hd). Requests far
// from the playhead are aborted; missing frames fall back to the nearest
// loaded neighbour (hd fast scroll: nearest loaded REAL); FilmSequence
// cross-blends only while moving, crisp single frame at rest.

export interface FilmTier {
  w: number;
  h: number;
  dir: string;
}

export interface FilmManifest {
  count: number;
  sourceFrames: number;
  fpsMult: number;
  tiers: { full: FilmTier; web: FilmTier; mobile?: FilmTier; hd?: FilmTier };
  pattern: string;
  // Legacy V1 shape (pre-tier manifests) — still accepted as fallback.
  width?: number;
  height?: number;
  pad?: number;
  ext?: string;
  step?: number;
}

export type TierName = 'full' | 'web' | 'mobile' | 'hd';

/** HD sidecar shape (public/v1film/hd.json, written by FRAMEGEN). */
export interface HdSidecar {
  count: number;
  w: number;
  h: number;
  interp?: number;
  sourceCount?: number;
  realEvery?: number;
  pattern?: string;
  dir?: string;
  replaced?: number;
}

export const HD_DEFAULTS = {
  w: 1920,
  h: 1092,
  dir: 'hd',
  count: 10762,
  interp: 3,
  pattern: 'f_%05d.webp',
} as const;

/** HD interpolation factor: 2 in-betweens per source pair. */
export const HD_INTERP = 3;
/** Narrow window (hd indices) for in-between fill near the playhead. */
export const HD_NEAR = 30;

export const MAX_CONCURRENT = 6;
/** Decoded-bitmap caps: 240 desktop tiers, 120 mobile, 300 hd (LOADER envelope). */
export const LRU_CAP: Record<TierName, number> = { full: 240, web: 240, mobile: 120, hd: 300 };
const FIRST_BATCH_N = 60;
const STRIDE = 12;

export async function loadManifest(): Promise<FilmManifest> {
  const res = await fetch('/v1film/manifest.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`manifest ${res.status}`);
  return (await res.json()) as FilmManifest;
}

/**
 * LOADER: fetch the hd sidecar. Returns null when absent (FRAMEGEN still
 * running, or 404) — callers fall back to the web tier. Never throws.
 * Accepts the FRAMEGEN shape {count,w,h,interp,sourceCount,realEvery,
 * pattern,replaced} plus tolerant aliases (width/height, dir).
 */
export async function loadHdSidecar(): Promise<HdSidecar | null> {
  try {
    const res = await fetch('/v1film/hd.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>;
    const count = Math.floor(Number(j.count ?? j.sourceCount ?? 0));
    if (!count || count < 1) return null;
    const w = Math.floor(Number(j.w ?? j.width ?? HD_DEFAULTS.w)) || HD_DEFAULTS.w;
    const h = Math.floor(Number(j.h ?? j.height ?? HD_DEFAULTS.h)) || HD_DEFAULTS.h;
    return {
      count,
      w,
      h,
      interp: Math.floor(Number(j.interp ?? HD_INTERP)) || HD_INTERP,
      sourceCount:
        j.sourceCount !== undefined ? Math.floor(Number(j.sourceCount)) : undefined,
      realEvery:
        j.realEvery !== undefined ? Math.floor(Number(j.realEvery)) : undefined,
      pattern:
        typeof j.pattern === 'string' && j.pattern.includes('%')
          ? (j.pattern as string)
          : HD_DEFAULTS.pattern,
      dir: typeof j.dir === 'string' && j.dir ? (j.dir as string) : HD_DEFAULTS.dir,
      replaced:
        j.replaced !== undefined ? Math.floor(Number(j.replaced)) : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * LOADER: manifest + optional hd sidecar in one call. The hd tier entry is
 * merged into manifest.tiers.hd (dims/dir) so tierSize/frameUrl work even
 * for readers that only look at the manifest.
 */
export async function loadManifestWithHd(): Promise<{
  manifest: FilmManifest;
  hd: HdSidecar | null;
}> {
  const manifest = await loadManifest();
  const hd = await loadHdSidecar();
  if (hd && manifest.tiers && !manifest.tiers.hd) {
    manifest.tiers.hd = { w: hd.w, h: hd.h, dir: hd.dir ?? HD_DEFAULTS.dir };
  }
  return { manifest, hd };
}

/**
 * F4-PERF: desktop (incl. retina) serves the 1512 web tier; full only with
 * ?hq=1. Mobile for ≤820px wide or saveData/slow connections.
 * (LOADER: sync legacy — never returns hd; use pickTierWithHd after the
 * sidecar fetch so stills/SSR stay on web without async.)
 */
export function pickTier(): TierName {
  if (typeof window === 'undefined') return 'web';
  try {
    if (new URLSearchParams(window.location.search).get('hq') === '1') return 'full';
  } catch {
    /* ignore malformed query strings */
  }
  const w = window.innerWidth || 0;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const saveData = !!conn?.saveData;
  const slow = /^(slow-2g|2g|3g)$/.test(conn?.effectiveType || '');
  if (w <= 820 || saveData || slow) return 'mobile';
  return 'web';
}

/**
 * LOADER: desktop default → hd when the sidecar is present.
 * Mobile stays mobile, ?hq=1 → full, hd absent → web.
 */
export function pickTierWithHd(hdAvailable: boolean): TierName {
  if (typeof window !== 'undefined') {
    try {
      if (new URLSearchParams(window.location.search).get('hq') === '1') return 'full';
    } catch {
      /* ignore */
    }
    const w = window.innerWidth || 0;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const saveData = !!conn?.saveData;
    const slow = /^(slow-2g|2g|3g)$/.test(conn?.effectiveType || '');
    const nav = navigator as Navigator & { deviceMemory?: number };
    const mem = nav.deviceMemory ?? 8;
    const cores = nav.hardwareConcurrency || 8;
    if (w <= 820 || saveData || slow || mem <= 2) return 'mobile';
    // hd is ~3x the frames/bytes of web: only for capable devices on fast links.
    const fast = !conn?.effectiveType || conn.effectiveType === '4g';
    if (hdAvailable && fast && mem >= 8 && cores >= 8 && w >= 1280) return 'hd';
    return 'web';
  }
  return 'web';
}

/** Canvas DPR cap: 1.25 desktop, 1 on mobile widths (F4-PERF envelope, LOADER keeps). */
export function canvasDprCap(): number {
  if (typeof window === 'undefined') return 1.25;
  return (window.innerWidth || 0) <= 820 ? 1 : 1.25;
}

/**
 * LOADER: true when hd index j (0-based) is a REAL (camera) frame.
 * FRAMEGEN writes 1-based files 1,4,7,… i.e. (n-1)%3==0 with n=j+1 —
 * in 0-based loader indices that is j%3==0 (first AND last frames real).
 * The LOADER brief writes this as (i-1)%3==0 with 1-based i.
 */
export function isRealHdIndex(j: number): boolean {
  return ((j % HD_INTERP) + HD_INTERP) % HD_INTERP === 0;
}

/** True for every frame except hd in-betweens. */
export function isRealFrame(tier: TierName, j: number): boolean {
  return tier !== 'hd' || isRealHdIndex(j);
}

function pad5(i: number): string {
  return String(i + 1).padStart(5, '0');
}

export function frameUrl(m: FilmManifest, tier: TierName, i: number, hd?: HdSidecar | null): string {
  if (tier === 'hd') {
    const dir = hd?.dir ?? m.tiers?.hd?.dir ?? HD_DEFAULTS.dir;
    const pattern = hd?.pattern ?? m.pattern ?? HD_DEFAULTS.pattern;
    const file = (pattern || 'f_%05d.webp').replace('%05d', pad5(i));
    return `/v1film/${dir}/${file}`;
  }
  if (m.tiers) {
    const entry: FilmTier =
      tier === 'mobile'
        ? (m.tiers.mobile ?? m.tiers.web)
        : tier === 'full'
          ? m.tiers.full
          : m.tiers.web;
    const file = (m.pattern || 'f_%05d.webp').replace('%05d', pad5(i));
    return `/v1film/${entry.dir}/${file}`;
  }
  // Legacy fallback.
  const pad = m.pad ?? 4;
  return `/v1film/${String(i + 1).padStart(pad, '0')}.${m.ext ?? 'jpg'}`;
}

export function tierSize(
  m: FilmManifest,
  tier: TierName,
  hd?: HdSidecar | null,
): { w: number; h: number } {
  if (tier === 'hd') {
    if (hd) return { w: hd.w, h: hd.h };
    if (m.tiers?.hd) return { w: m.tiers.hd.w, h: m.tiers.hd.h };
    return { w: HD_DEFAULTS.w, h: HD_DEFAULTS.h };
  }
  if (m.tiers) {
    const entry: FilmTier =
      tier === 'mobile'
        ? (m.tiers.mobile ?? m.tiers.web)
        : tier === 'full'
          ? m.tiers.full
          : m.tiers.web;
    return { w: entry.w, h: entry.h };
  }
  return { w: m.width ?? 16, h: m.height ?? 9 };
}

export type Frame = ImageBitmap | HTMLImageElement;

export class FrameLoader {
  readonly manifest: FilmManifest;
  readonly tier: TierName;
  readonly count: number;
  readonly hd: HdSidecar | null;
  /** True when serving the ×3 hd tier (index space is hd frames). */
  readonly isHd: boolean;
  /** Listener fired (at most once per rAF) when newly decoded frames land. */
  onUpdate: (() => void) | null = null;

  private frames: (Frame | null)[] = [];
  private state: Uint8Array; // 0 empty · 1 loading · 2 loaded · 3 failed
  private pending = new Set<number>();
  private controllers = new Map<number, AbortController>();
  private active = 0;
  private lru = new Map<number, Frame>();
  private pos = 0; // current playhead (fractional frame index)
  private updateQueued = false;
  private destroyed = false;
  private suspended = false;
  private firstBatchDone = false;
  private firstBatchWaiters: Array<() => void> = [];
  private firstBatchTotal = 0;
  private firstBatchLoaded = 0;
  private firstBatchSet: Set<number> | null = null;
  private canBitmap: boolean;
  private fastHint = false;
  readonly lruCap: number;

  constructor(manifest: FilmManifest, tier: TierName, hd?: HdSidecar | null) {
    this.manifest = manifest;
    this.hd = hd ?? null;
    // Graceful fallback when an old manifest has no mobile tier.
    let t = tier === 'mobile' && !manifest.tiers?.mobile ? 'web' : tier;
    // LOADER: hd requested but sidecar absent and no manifest hd entry →
    // fall back to web (FRAMEGEN still running). Never strand on 404s.
    if (t === 'hd' && !this.hd && !manifest.tiers?.hd) t = 'web';
    this.tier = t;
    this.isHd = t === 'hd';
    this.count = this.isHd
      ? Math.max(1, Math.floor(this.hd?.count ?? HD_DEFAULTS.count))
      : Math.max(1, Math.floor(manifest.count));
    this.frames = new Array(this.count).fill(null);
    this.state = new Uint8Array(this.count);
    this.lruCap = LRU_CAP[this.tier] ?? 450;
    this.canBitmap =
      typeof window !== 'undefined' && typeof window.createImageBitmap === 'function';
  }

  /** Queue the initial batch; resolves when it lands (preloader waits only here). */
  loadFirstBatch(): Promise<void> {
    const set = new Set<number>();
    if (this.isHd) {
      // LOADER: hd first batch = REAL frames only — first 60 reals, every
      // 12th real across the film, plus the tail (end card) + last real.
      let realsSeen = 0;
      for (let i = 0; i < this.count && realsSeen < FIRST_BATCH_N; i++) {
        if (isRealHdIndex(i)) {
          set.add(i);
          realsSeen += 1;
        }
      }
      for (let i = 0; i < this.count; i += STRIDE * HD_INTERP) {
        // STRIDE in web-space × interp → same film span, landing on reals.
        const r = i - ((((i % HD_INTERP) + HD_INTERP) % HD_INTERP) % HD_INTERP);
        if (r >= 0 && r < this.count && isRealHdIndex(r)) set.add(r);
      }
      set.add(this.count - 1);
      // Last real frame (tail may itself be interpolated if count shifts).
      for (let i = this.count - 1; i >= 0; i--) {
        if (isRealHdIndex(i)) {
          set.add(i);
          break;
        }
      }
    } else {
      for (let i = 0; i < Math.min(FIRST_BATCH_N, this.count); i++) set.add(i);
      for (let i = 0; i < this.count; i += STRIDE) set.add(i);
      // Always include the tail so the end card can show immediately too.
      set.add(this.count - 1);
    }
    this.firstBatchSet = set;
    this.firstBatchTotal = set.size;
    this.firstBatchLoaded = 0;
    if (this.firstBatchTotal === 0) {
      this.firstBatchDone = true;
      return Promise.resolve();
    }
    set.forEach((i) => this.pending.add(i));
    this.pump();
    return new Promise<void>((resolve) => {
      this.firstBatchWaiters.push(resolve);
    });
  }

  /**
   * Tell the loader where the playhead is; enqueues ±60 frames around it
   * (hd: ±180, same film span in the ×3 index space).
   * LOADER: hd fetches REAL frames first across the window; in-betweens
   * only within ±HD_NEAR of the playhead and only while !fast. Fast scroll
   * drops queued in-betweens (re-enqueued on slowdown).
   */
  setPosition(fracIndex: number, radius = 60, fast = false): void {
    this.pos = Math.max(0, Math.min(this.count - 1, fracIndex));
    this.fastHint = fast;
    if (this.suspended || this.destroyed) return;
    const c = Math.round(this.pos);
    if (!this.isHd) {
      const lo = Math.max(0, c - radius);
      const hi = Math.min(this.count - 1, c + radius);
      for (let i = lo; i <= hi; i++) {
        if (this.state[i] === 0) this.pending.add(i);
      }
    } else {
      const rHd = radius * HD_INTERP;
      const lo = Math.max(0, c - rHd);
      const hi = Math.min(this.count - 1, c + rHd);
      for (let i = lo; i <= hi; i++) {
        if (this.state[i] === 0 && isRealHdIndex(i)) this.pending.add(i);
      }
      if (fast) {
        // Drop queued in-betweens while fast — reals own the bandwidth.
        for (const q of Array.from(this.pending)) {
          if (!isRealHdIndex(q) && this.state[q] === 0) this.pending.delete(q);
        }
      } else {
        const nLo = Math.max(0, c - HD_NEAR);
        const nHi = Math.min(this.count - 1, c + HD_NEAR);
        for (let i = nLo; i <= nHi; i++) {
          if (this.state[i] === 0 && !isRealHdIndex(i)) this.pending.add(i);
        }
      }
    }
    // Abort in-flight fetches far from the playhead (off-screen scroll jump):
    // anything loading outside 2× radius is stale — free its slot.
    const span = (this.isHd ? radius * HD_INTERP : radius) * 2;
    const keepLo = c - span;
    const keepHi = c + span;
    for (const [i, ctl] of this.controllers) {
      if (i < keepLo || i > keepHi) {
        try {
          ctl.abort();
        } catch {
          /* already settled */
        }
      }
    }
    this.pump();
  }

  /** Pause network fill while the film is off-screen (draw loop also skips). */
  setSuspended(s: boolean): void {
    this.suspended = s;
    if (s) {
      // Abort everything in flight; queues rebuild from setPosition on resume.
      for (const [, ctl] of this.controllers) {
        try {
          ctl.abort();
        } catch {
          /* already settled */
        }
      }
    } else {
      this.pump();
    }
  }

  loadedCount(): number {
    return this.lru.size;
  }

  /** Size of the initial batch the preloader waits for (0 until loadFirstBatch). */
  firstBatchSize(): number {
    return this.firstBatchTotal;
  }

  isLoaded(i: number): boolean {
    return this.state[i] === 2;
  }

  get(i: number): Frame | null {
    const f = this.frames[i];
    if (f) this.touch(i);
    return f ?? null;
  }

  /** Nearest loaded frame at or around i (outward search), or null. */
  nearest(i: number): { frame: Frame; index: number } | null {
    const c = Math.max(0, Math.min(this.count - 1, Math.round(i)));
    if (this.frames[c]) {
      this.touch(c);
      return { frame: this.frames[c] as Frame, index: c };
    }
    for (let d = 1; d < this.count; d++) {
      const a = c - d;
      const b = c + d;
      if (a >= 0 && this.frames[a]) {
        this.touch(a);
        return { frame: this.frames[a] as Frame, index: a };
      }
      if (b < this.count && this.frames[b]) {
        this.touch(b);
        return { frame: this.frames[b] as Frame, index: b };
      }
    }
    return null;
  }

  /**
   * LOADER: nearest loaded REAL frame around i (hd fast-scroll drawing —
   * never show an interpolated frame while fast). Non-hd tiers delegate to
   * nearest(). Returns null when no real is loaded yet.
   */
  nearestReal(i: number): { frame: Frame; index: number } | null {
    if (!this.isHd) return this.nearest(i);
    const c = Math.max(0, Math.min(this.count - 1, Math.round(i)));
    // Snap the target itself down to its real neighbour first so fast draws
    // prefer the already-decoded real either side of an in-between.
    const base = c - (((c % HD_INTERP) + HD_INTERP) % HD_INTERP);
    for (let d = 0; d < this.count; d++) {
      const a = base - d * HD_INTERP;
      const b = base + d * HD_INTERP;
      // Check the nearer side first (b when c sits past base).
      const first = c - base < HD_INTERP / 2 ? base : base;
      void first;
      if (a >= 0 && this.frames[a]) {
        this.touch(a);
        return { frame: this.frames[a] as Frame, index: a };
      }
      if (b < this.count && b !== a && this.frames[b]) {
        this.touch(b);
        return { frame: this.frames[b] as Frame, index: b };
      }
      if (a < 0 && b >= this.count) break;
    }
    // No real loaded yet — fall back to any loaded neighbour (never blank).
    return this.nearest(i);
  }

  destroy(): void {
    this.destroyed = true;
    this.pending.clear();
    for (const [, ctl] of this.controllers) {
      try {
        ctl.abort();
      } catch {
        /* noop */
      }
    }
    this.controllers.clear();
    for (const [, f] of this.lru) closeFrame(f);
    this.lru.clear();
    this.frames.fill(null);
    this.firstBatchWaiters = [];
  }

  private touch(i: number): void {
    const f = this.lru.get(i);
    if (f !== undefined) {
      this.lru.delete(i);
      this.lru.set(i, f);
    }
  }

  private emitUpdate(): void {
    if (this.updateQueued || this.destroyed) return;
    this.updateQueued = true;
    requestAnimationFrame(() => {
      this.updateQueued = false;
      this.onUpdate?.();
    });
  }

  private pump(): void {
    if (this.destroyed || this.suspended) return;
    while (this.active < MAX_CONCURRENT && this.pending.size > 0) {
      // Highest priority = closest to the playhead; first-batch members win ties.
      // LOADER hd: real frames win over in-betweens by a distance penalty so
      // the ×3 set resolves to watchable reals first; in-betweens only win
      // when they sit almost exactly on the playhead while slow.
      let best = -1;
      let bestScore = Infinity;
      for (const i of this.pending) {
        if (this.state[i] !== 0) {
          this.pending.delete(i);
          continue;
        }
        if (this.isHd && this.fastHint && !isRealHdIndex(i)) {
          this.pending.delete(i);
          continue;
        }
        const dist = Math.abs(i - this.pos);
        let score = this.firstBatchSet?.has(i) ? dist - 1e6 : dist;
        if (this.isHd && !isRealHdIndex(i)) score += 500;
        if (score < bestScore) {
          bestScore = score;
          best = i;
        }
      }
      if (best < 0) break;
      this.pending.delete(best);
      this.state[best] = 1;
      this.active += 1;
      void this.fetchOne(best).finally(() => {
        this.active -= 1;
        this.pump();
      });
    }
  }

  private async fetchOne(i: number): Promise<void> {
    const url = frameUrl(this.manifest, this.tier, i, this.hd);
    const ctl = new AbortController();
    this.controllers.set(i, ctl);
    try {
      let frame: Frame;
      if (this.canBitmap) {
        // Fetch + createImageBitmap: decode happens off the main thread.
        const res = await fetch(url, { cache: 'force-cache', signal: ctl.signal });
        if (!res.ok) throw new Error(`frame ${i}: ${res.status}`);
        const blob = await res.blob();
        frame = await window.createImageBitmap(blob);
      } else {
        frame = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.decoding = 'async';
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`img ${i}`));
          img.src = url;
        });
      }
      if (this.destroyed) {
        closeFrame(frame);
        return;
      }
      this.frames[i] = frame;
      this.state[i] = 2;
      this.lru.delete(i);
      this.lru.set(i, frame);
      // Per-tier LRU eviction — never evict a first-batch frame still awaited.
      while (this.lru.size > this.lruCap) {
        const oldest = this.lru.keys().next();
        if (oldest.done) break;
        const k = oldest.value as number;
        this.lru.delete(k);
        if (this.frames[k]) {
          closeFrame(this.frames[k] as Frame);
          this.frames[k] = null;
          this.state[k] = 0;
        }
      }
    } catch (err) {
      // Aborts are not failures — requeue as empty so a later pass retries.
      if (err instanceof DOMException && err.name === 'AbortError') {
        if (!this.destroyed) this.state[i] = 0;
      } else if (!this.destroyed) {
        this.state[i] = 3;
      }
    } finally {
      this.controllers.delete(i);
    }
    if (this.firstBatchSet?.has(i)) {
      this.firstBatchLoaded += 1;
      if (!this.firstBatchDone && this.firstBatchLoaded >= this.firstBatchTotal) {
        this.firstBatchDone = true;
        this.firstBatchSet = null;
        const waiters = this.firstBatchWaiters;
        this.firstBatchWaiters = [];
        waiters.forEach((w) => w());
      }
    }
    this.emitUpdate();
  }
}

function closeFrame(f: Frame): void {
  if (typeof (f as ImageBitmap).close === 'function') {
    try {
      (f as ImageBitmap).close();
    } catch {
      /* already closed */
    }
  }
}

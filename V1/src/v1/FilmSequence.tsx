// V1-CORE + V2-FILM + V3-PERF + F4-PERF — scroll-scrubbed film sequence.
// Pinned full-viewport canvas, 800vh (560vh mobile). Frames come from the
// three-tier film (public/v1film/full + /web + /mobile + manifest.json,
// 3588 frames) via frameLoader: web tier on all desktop (full only ?hq=1),
// small first batch + stride prefetch, then priority fill ±60 around the
// playhead (4 concurrent, createImageBitmap off-main-thread, LRU 240/120,
// abort far requests, suspend off-screen). Missing frames fall back to the
// missing frames fall back to the
// nearest loaded neighbour (hd fast: nearest loaded REAL); cross-blend
// ONLY while moving — at rest (velocity <0.0005 film/frame for 120ms) the
// draw snaps to the single nearest frame, never a blend (LOADER-a). Grain/vignette are static CSS layers (no per-frame
// canvas work); letterbox bars are pure #000.
//  - Shared Lenis singleton from ./lenis (single RAF with the GSAP ticker);
//    scrubbed draw at rAF with fractional frame interpolation (cross-blend
//    two nearest frames).
//  - Frames decoded via createImageBitmap (fallback: <img>), canvas DPR ≤ 2
//    desktop / ≤ 1.5 mobile, drawing paused when the film is off-screen.
//  - Preloader counter 000→100 (tabular Inter) then slow iris/fade from Void.
//  - Cinematic finish: film grain ≤4%, soft vignette, letterbox easing open.
//  - Thin progress rail with ordinal chapter ticks (no text).
//  - Paper veil over the last ~3% for a seamless handoff into the white act.
//  - Scroll-velocity micro-response: scale 1.0→1.01, eased back (GPU only).
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureLenis } from './lenis';
import { initSnap } from './snap';
import { setFilmProgress, useFilmProgress, FILM_CHAPTERS } from './progress';
import { scrollToFilm } from './filmCurve';
import {
  loadManifest,
  loadManifestWithHd,
  pickTier,
  pickTierWithHd,
  canvasDprCap,
  frameUrl,
  tierSize,
  FrameLoader,
  type FilmManifest,
  type HdSidecar,
  type Frame,
} from './frameLoader';
import BrandWaves from './BrandWaves';
import FilmCaptions from './FilmCaptions';
import SidePanels from './SidePanels';

gsap.registerPlugin(ScrollTrigger);

function useReducedMotion(): boolean {
  const [rm, setRm] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setRm(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return rm;
}

function useManifest(): FilmManifest | null {
  const [m, setM] = useState<FilmManifest | null>(null);
  useEffect(() => {
    let live = true;
    loadManifest()
      .then((man) => {
        if (live) setM(man);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);
  return m;
}

// Reduced motion: no pin — 5 key frames as stills with captions.
function FilmStills() {
  const m = useManifest();
  const fracs = [0, 0.2, 0.45, 0.7, 0.95];
  // V3-PERF: stills honour the tier pick (mobile widths serve the mobile tier).
  const stillTier = (() => {
    const t = pickTier();
    return t === 'full' ? 'web' : t;
  })();
  return (
    <section className="v1-stills" aria-label="EyeQ Vision Care film stills">
      {fracs.map((f) => {
        const idx = m ? Math.min(m.count - 1, Math.round(f * (m.count - 1))) : 0;
        const src = m ? frameUrl(m, stillTier, idx) : undefined;
        return (
          <figure className="v1-still" key={f}>
            {src && <img src={src} alt="" loading={f === 0 ? 'eager' : 'lazy'} />}
            <div className="v1-still__caption">
              <FilmCaptions progress={f} />
              <SidePanels progress={f} instant />
            </div>
          </figure>
        );
      })}
    </section>
  );
}

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth01 = (t: number): number => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

// F5-MOBILE (ID=MOBILE): portrait focal follows the SUBJECT SIDE MAP
// (source frames): 1–30 centre; 30–145 RIGHT; 145–215 →LEFT; 215–325 LEFT;
// 325–411 centre; 411–470 RIGHT; 470–615 centre (lens dive then white).
// Smoothstep interpolation — no jumps. Pure arithmetic, no allocations.
// Landscape/desktop always 0.5 (unchanged). Right≈0.72, left≈0.28.
function mobileFocalX(src: number): number {
  const CENTRE = 0.5;
  const RIGHT = 0.72;
  const LEFT = 0.28;
  if (src <= 30) return CENTRE;
  if (src < 50) {
    const t = (src - 30) / 20;
    const s = t * t * (3 - 2 * t);
    return CENTRE + (RIGHT - CENTRE) * s;
  }
  if (src <= 145) return RIGHT;
  if (src < 215) {
    const t = (src - 145) / 70;
    const s = t * t * (3 - 2 * t);
    return RIGHT + (LEFT - RIGHT) * s;
  }
  if (src <= 325) return LEFT;
  if (src < 355) {
    const t = (src - 325) / 30;
    const s = t * t * (3 - 2 * t);
    return LEFT + (CENTRE - LEFT) * s;
  }
  if (src <= 411) return CENTRE;
  if (src < 431) {
    const t = (src - 411) / 20;
    const s = t * t * (3 - 2 * t);
    return CENTRE + (RIGHT - CENTRE) * s;
  }
  if (src <= 470) return RIGHT;
  if (src < 500) {
    const t = (src - 470) / 30;
    const s = t * t * (3 - 2 * t);
    return RIGHT + (CENTRE - RIGHT) * s;
  }
  return CENTRE;
}

// FRAME (ID=FRAME): fit-width band zoom profile for portrait phones.
// Pure contain (1.0) at every wide key source frame (1,70,145,215,280,368,
// 440,600) so the subject can never be cut; mild zoom bumps (≤1.30 ≤ 1.35
// cap) only in tight/detail or full-frame-blur regions between keys.
// sin² pulses → C¹-smooth blends, pure arithmetic, no allocations.
function bandPulse(src: number, a: number, b: number): number {
  const t = (src - a) / (b - a);
  if (t <= 0 || t >= 1) return 0;
  const s = Math.sin(Math.PI * t);
  return s * s;
}
function bandZoom(src: number): number {
  return (
    1 +
    0.2 * bandPulse(src, 232, 262) +
    0.22 * bandPulse(src, 292, 340) +
    0.15 * bandPulse(src, 380, 405) +
    0.3 * bandPulse(src, 452, 560)
  );
}

function FilmCanvas() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const boxTopRef = useRef<HTMLDivElement>(null);
  const boxBotRef = useRef<HTMLDivElement>(null);
  const [loadPct, setLoadPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const railProgress = useFilmProgress();

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;
    let lenis: ReturnType<typeof ensureLenis> | null = null;
    let cleanupSnap: (() => void) | null = null;
    let st: ScrollTrigger | null = null;
    let inView = true;
    let io: IntersectionObserver | null = null;
    let loader: FrameLoader | null = null;
    let count = 0;
    let sourceTotal = 615;
    let fw = 16;
    let fh = 9;
    let target = 0;
    let smooth = 0;
    let lastF = -1; // last drawn fractional position; -1 = nothing yet
    let velSmooth = 0;
    let prevTarget = 0;
    let batchReady = false;
    // LOADER-a: rest detection — blend only while scroll velocity is
    // non-trivial; when velocity settles (<0.0005 film/frame for 120ms)
    // snap to the single nearest frame (hard, crisp). lastActiveMs marks
    // the last tick with real motion; lastCrispIdx dedupes the rest draw
    // so we don't re-blit every rAF while idle.
    let lastActiveMs = 0;
    let lastCrispIdx = -1;
    const SETTLE_VEL = 0.0005;
    const SETTLE_MS = 120;
    const FAST_VEL = 0.004;
    // FRAME: band-rect cache for --film-band-top/--film-band-bottom (CSS px).
    // Writes only when the rect moves ≥0.5px — no per-frame style churn.
    let dprUsed = 1;
    let lastBandTop = -1;
    let lastBandBot = -1;

    const VOID = '#000';
    const PAPER = '#f5f1e8';

    // FRAME: expose the band rect (image top/bottom in viewport px) on the
    // film root so overlays can use the free black space. Cached — writes
    // only on ≥0.5px change (numbers only, no allocations per frame).
    const setBandVars = (topCss: number, botCss: number) => {
      if (Math.abs(topCss - lastBandTop) < 0.5 && Math.abs(botCss - lastBandBot) < 0.5) return;
      lastBandTop = topCss;
      lastBandBot = botCss;
      stage.style.setProperty('--film-band-top', `${topCss.toFixed(1)}px`);
      stage.style.setProperty('--film-band-bottom', `${botCss.toFixed(1)}px`);
    };

    const resize = () => {
      // F4-PERF: canvas DPR cap 1.25 desktop, 1 on mobile widths.
      const dpr = Math.min(canvasDprCap(), window.devicePixelRatio || 1);
      dprUsed = dpr;
      const w = Math.max(1, Math.round(stage.clientWidth * dpr));
      const h = Math.max(1, Math.round(stage.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        // Redraw at the new size — never flash blank.
        lastF = -1;
      }
      // FRAME: sane band defaults (pure contain) before the first draw.
      const cssW = stage.clientWidth;
      const cssH = stage.clientHeight;
      if (cssW > 0 && cssH > 0) {
        if (cssH > cssW) {
          const dhC = fh * (cssW / Math.max(1, fw));
          setBandVars((cssH - dhC) / 2, (cssH + dhC) / 2);
        } else {
          setBandVars(0, cssH);
        }
      }
    };

    // Cover-fit blit of one frame; alpha lets two neighbours cross-blend.
    // focalX 0..1 anchors the crop horizontally (0.5 = centre).
    // FRAME: portrait/narrow viewports use a fit-width band instead — the
    // image fills the full width (contain horizontally, scale = viewport
    // width / film aspect) and sits vertically centred in a pure-#000 field,
    // blended toward a mild zoom (≤1.35× via bandZoom) only where the subject
    // is small enough to still fit fully. At zoom 1 dx = 0 whatever the focal
    // point, so the subject is never cut. Landscape/desktop cover unchanged.
    const blit = (img: Frame, alpha: number, focalX = 0.5, src = 1) => {
      const cw = canvas.width;
      const ch = canvas.height;
      if (ch <= cw) {
        const s = Math.max(cw / fw, ch / fh);
        const dw = fw * s;
        const dh = fh * s;
        const fx = focalX < 0 ? 0 : focalX > 1 ? 1 : focalX;
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, (cw - dw) * fx, (ch - dh) / 2, dw, dh);
        ctx.globalAlpha = 1;
        setBandVars(0, ch / dprUsed);
        return;
      }
      const z = bandZoom(src);
      const s = (cw / fw) * z;
      const dw = fw * s;
      const dh = fh * s;
      const fx = focalX < 0 ? 0 : focalX > 1 ? 1 : focalX;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - dw) * fx, (ch - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
      setBandVars((ch - dh) / 2 / dprUsed, (ch + dh) / 2 / dprUsed);
    };

    const drawFrac = (f: number, fast: boolean, crisp = false) => {
      if (!loader) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const maxI = count - 1;
      const clamped = clamp01(f) * maxI;
      const i0 = Math.min(maxI, Math.floor(clamped));
      const alpha = clamped - i0;
      const i1 = Math.min(maxI, i0 + 1);
      // F5-MOBILE: portrait focal follows the SUBJECT SIDE MAP via the
      // current source frame (1-based): 1–30 centre; 30–145 RIGHT;
      // 145–215 →LEFT; 215–325 LEFT; 325–411 centre; 411–470 RIGHT;
      // 470–615 centre. Smooth interpolation (no jumps). Landscape 0.5.
      // FRAME: in the portrait fit-width band the focal steers the mild
      // zoom (bandZoom) and is a no-op at pure contain (full width fits).
      // Pure arithmetic per frame, no allocations.
      const portrait = ch > cw;
      let focalX = 0.5;
      let src = 1;
      if (portrait) {
        src = 1 + clamp01(f) * (sourceTotal - 1);
        focalX = mobileFocalX(src);
      }
      if (fast) {
        // High velocity: single drawImage (nearest), no cross-blend.
        // LOADER-c hd: fast scroll draws REAL frames only (never a warped
        // in-between) via nearestReal; other tiers use nearest index.
        const ni = alpha < 0.5 ? i0 : i1;
        const n = loader.isHd
          ? (loader.nearestReal(ni)?.frame ?? null)
          : (loader.get(ni) ?? loader.nearest(ni)?.frame ?? null);
        if (!n) return;
        ctx.fillStyle = clamped / maxI >= 0.978 ? PAPER : VOID;
        ctx.fillRect(0, 0, cw, ch);
        blit(n, 1, focalX, src);
        return;
      }
      if (crisp) {
        // LOADER-a: at rest — single nearest frame, hard cut, no blend.
        // Never leaves two frames ghosted in one after a stop.
        const ni = alpha < 0.5 ? i0 : i1;
        const n = loader.get(ni) ?? loader.nearest(ni)?.frame ?? null;
        if (!n) return;
        ctx.fillStyle = clamped / maxI >= 0.978 ? PAPER : VOID;
        ctx.fillRect(0, 0, cw, ch);
        blit(n, 1, focalX, src);
        return;
      }
      // Nearest-loaded fallback while a frame is missing — never blank.
      const a = loader.get(i0) ?? loader.nearest(i0)?.frame ?? null;
      if (!a) return;
      // Opaque base: clear with pure black early, Paper at the tail so any
      // sub-pixel edge matches the incoming act (seamless handoff).
      ctx.fillStyle = clamped / maxI >= 0.978 ? PAPER : VOID;
      ctx.fillRect(0, 0, cw, ch);
      blit(a, 1, focalX, src);
      const b = i1 !== i0 ? loader.get(i1) : null;
      if (b && alpha > 0.001) blit(b, alpha, focalX, src);
    };

    const tick = () => {
      if (document.hidden) {
        prevTarget = target;
        return;
      }
      // V3-PERF: visibility comes from the IntersectionObserver flag —
      // no getBoundingClientRect per frame (layout-read thrash). Drawing
      // and network fill both pause while the film is off-screen.
      if (!inView) {
        prevTarget = target;
        return;
      }
      // Eased follow of the scrub target; Lenis (lerp 0.075) already
      // smooths the scroll input, so this second stage stays light.
      const oldSmooth = smooth;
      smooth += (target - smooth) * 0.14;
      if (Math.abs(target - smooth) < 0.0004) smooth = target;

      // Scroll-velocity micro-response: 1.0 → 1.01 max, eased back.
      const instV = target - prevTarget;
      prevTarget = target;
      velSmooth += (Math.abs(instV) - velSmooth) * 0.1;
      const vScale = 1 + Math.min(0.01, velSmooth * 2.4);
      canvas.style.transform = `scale(${vScale.toFixed(4)})`;

      // LOADER-a: rest detection in film units per tick. Effective velocity
      // is the max of target motion and the eased follow motion (smooth
      // keeps gliding after the target stops). Below SETTLE_VEL for
      // SETTLE_MS we are at rest → crisp single frame, never a blend.
      const nowMs =
        typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
      const targetVel = Math.abs(instV);
      const smoothVel = Math.abs(smooth - oldSmooth);
      const effVel = targetVel > smoothVel ? targetVel : smoothVel;
      if (effVel >= SETTLE_VEL || Math.abs(target - smooth) >= SETTLE_VEL) {
        lastActiveMs = nowMs;
      }
      const settled =
        nowMs - lastActiveMs > SETTLE_MS &&
        effVel < SETTLE_VEL &&
        Math.abs(target - smooth) < SETTLE_VEL;

      const fast = velSmooth > FAST_VEL;
      const f = smooth * Math.max(1, count - 1);
      if (loader) loader.setPosition(f, 60, fast);
      if (settled) {
        // At rest: snap to the single nearest frame (hard, crisp). Force
        // the redraw even when f hasn't moved — the last moving draw may
        // have been a cross-blend left ghosted on screen.
        if (count > 0 && batchReady) {
          const crispIdx = Math.round(clamp01(smooth) * (count - 1));
          if (crispIdx !== lastCrispIdx || Math.abs(f - lastF) > 0.001 || lastF < 0) {
            drawFrac(smooth, false, true);
            lastF = f;
            lastCrispIdx = crispIdx;
          }
        }
      } else {
        // Moving: blends allowed (fast → single real/nearest, no blend).
        lastCrispIdx = -1;
        if (Math.abs(f - lastF) > 0.02 || (smooth === target && lastF < 0)) {
          if (count > 0 && batchReady) {
            // F4-PERF: high scroll velocity → single drawImage, no blend.
            drawFrac(smooth, fast);
            lastF = f;
          }
        }
      }
      // Direct-DOM chrome (no React re-render): rail fill, paper veil,
      // letterbox ease-open over the first beat. Transforms/opacity only.
      if (railFillRef.current) {
        railFillRef.current.style.transform = `scaleY(${smooth.toFixed(4)})`;
      }
      if (veilRef.current) {
        const v = smooth01((smooth - 0.975) / 0.025);
        veilRef.current.style.opacity = v.toFixed(3);
        veilRef.current.style.visibility = v > 0.001 ? 'visible' : 'hidden';
      }
      const open = smooth01(smooth / 0.08);
      const lb = (1 - open).toFixed(3);
      if (boxTopRef.current) boxTopRef.current.style.transform = `scaleY(${lb})`;
      if (boxBotRef.current) boxBotRef.current.style.transform = `scaleY(${lb})`;
      stage.classList.toggle('is-tail', smooth >= 0.978);
      setFilmProgress(smooth);
    };

    (async () => {
      let m: FilmManifest;
      let hd: HdSidecar | null = null;
      try {
        ({ manifest: m, hd } = await loadManifestWithHd());
      } catch {
        if (!cancelled) setFailed(true);
        return;
      }
      if (cancelled) return;
      // LOADER-b: desktop default → hd when the sidecar is present
      // (mobile stays mobile, ?hq=1 → full, absent → web fallback).
      const tier = pickTierWithHd(!!hd);
      const size = tierSize(m, tier, hd);
      // LOADER-c: film progress maps to the ACTIVE tier index space —
      // hd count (10762) when hd, else manifest count (3588).
      count = tier === 'hd' && hd ? hd.count : m.count;
      sourceTotal = Math.max(2, Math.floor(m.sourceFrames ?? 615));
      fw = size.w;
      fh = size.h;

      loader = new FrameLoader(m, tier, hd);
      loader.onUpdate = () => {
        // New frames landed — force a redraw on the next tick (and reset
        // the rest dedupe so a settled crisp frame still refreshes).
        lastF = -1;
        lastCrispIdx = -1;
      };

      // V3-PERF (SNAP-integration): the ONE shared Lenis from
      // src/v1/lenis.ts — never `new Lenis` here. The singleton owns the
      // GSAP ticker wiring; it outlives this mount (no destroy here).
      lenis = ensureLenis();
      lenis.on('scroll', ScrollTrigger.update);

      resize();
      window.addEventListener('resize', resize);

      st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          // POLISH-CURVE: scroll progress runs through the punch curve —
          // each beat owns its share of scroll (dwell on bird's-eye/endcard,
          // punchy expo/power3 in-out through expand/rotate/sweep/zoom).
          target = scrollToFilm(self.progress, m);
        },
      });
      target = scrollToFilm(st.progress, m);
      prevTarget = target;
      smooth = target;

      gsap.ticker.add(tick);
      // V3-PERF (SNAP-integration): static snap on the shared instance.
      // (App.tsx also calls initSnap(getLenis()) — same singleton, harmless.)
      cleanupSnap = initSnap(lenis);

      // V3-PERF: off-screen → suspend network fill + skip drawing.
      // IntersectionObserver only (no per-frame layout reads).
      io = new IntersectionObserver(
        (entries) => {
          inView = entries[0]?.isIntersecting ?? true;
          loader?.setSuspended(!inView);
        },
        { threshold: 0 },
      );
      io.observe(stage);

      // V2-FILM: preloader tracks ONLY the first batch (first ~120 frames +
      // every 8th frame + tail). The rest fills in around the playhead.
      const batchPromise = loader.loadFirstBatch();
      const total = loader.firstBatchSize() || 1;
      const pctTimer = window.setInterval(() => {
        if (cancelled || !loader) {
          window.clearInterval(pctTimer);
          return;
        }
        const pct = Math.min(99, Math.round((loader.loadedCount() / total) * 100));
        setLoadPct((prev) => (pct > prev ? pct : prev));
      }, 120);
      try {
        await batchPromise;
      } catch {
        /* loader continues in background; show what we have */
      }
      if (cancelled) return;
      window.clearInterval(pctTimer);
      batchReady = true;
      loader.setPosition(smooth * Math.max(1, count - 1));
      resize();
      drawFrac(smooth, false);
      lastF = smooth * Math.max(1, count - 1);
      setLoadPct(100);
      // Hold the 100 beat, then slow iris/fade from Void into frame 1.
      window.setTimeout(() => {
        if (!cancelled) {
          setReady(true);
          stage.classList.add('is-intro');
          ScrollTrigger.refresh();
        }
      }, 450);
    })();

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      st?.kill();
      try {
        cleanupSnap?.();
      } catch {
        /* snap already torn down */
      }
      cleanupSnap = null;
      io?.disconnect();
      io = null;
      // NOTE: no lenis.destroy() — the singleton outlives this mount.
      lenis = null;
      window.removeEventListener('resize', resize);
      loader?.destroy();
      loader = null;
    };
  }, []);

  const padded = String(loadPct).padStart(3, '0');

  return (
    <section ref={sectionRef} className="v1-film" aria-label="EyeQ Vision Care film">
      <div ref={stageRef} className="v1-film__stage">
        <canvas ref={canvasRef} className="v1-film__canvas" aria-hidden="true" />
        {failed && (
          <div className="v1-film__error" role="img" aria-label="EyeQ Vision Care film unavailable" />
        )}
        {/* Cinematic finish: grain + vignette are static CSS layers
            (F4-PERF: no per-frame canvas grain/vignette work). */}
        <div className="v1-finish v1-finish--grain" aria-hidden="true" />
        <div className="v1-finish v1-finish--vignette" aria-hidden="true" />
        <div className="v1-letterbox v1-letterbox--top" aria-hidden="true">
          <div ref={boxTopRef} className="v1-letterbox__bar" style={{ background: '#000' }} />
        </div>
        <div className="v1-letterbox v1-letterbox--bot" aria-hidden="true">
          <div ref={boxBotRef} className="v1-letterbox__bar" style={{ background: '#000' }} />
        </div>
        {/* Paper veil: the last ~2.5% crossfades to Paper so the white act
            lands with no colour jump. */}
        <div ref={veilRef} className="v1-veil" aria-hidden="true" />
        <div className="v1-overlay v1-overlay--waves">
          <OverlayWaves />
        </div>
        <div className="v1-overlay v1-overlay--captions">
          <OverlayCaptions />
        </div>
        <div className="v1-overlay v1-overlay--side">
          <OverlaySide />
        </div>
        {/* Thin progress rail with ordinal chapter ticks (no text). */}
        <div
          className="v1-progress"
          role="progressbar"
          aria-label="Film progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(railProgress * 100)}
          aria-hidden="true"
        >
          <div className="v1-progress__track">
            <div ref={railFillRef} className="v1-progress__fill" />
          </div>
          {FILM_CHAPTERS.map((c) => (
            <span
              key={c}
              className="v1-progress__tick"
              style={{ top: `${(c * 100).toFixed(1)}%` }}
            />
          ))}
        </div>
        <div className={`v1-preloader${ready ? ' is-done' : ''}`} aria-hidden={ready}>
          <p className="eyeq-microcap eyeq-microcap--dark">Loading film</p>
          <p className="v1-preloader__count eyeq-numerals" role="status" aria-label={`${loadPct} percent loaded`}>
            {padded}
          </p>
        </div>
      </div>
    </section>
  );
}

// Thin wrappers so overlay components re-render only via the progress store.
function OverlayWaves() {
  const p = useFilmProgress();
  return <BrandWaves progress={p} />;
}

function OverlayCaptions() {
  const p = useFilmProgress();
  return <FilmCaptions progress={p} />;
}

// POLISH-SIDE: stats/catchphrase panels in the empty side, same store.
function OverlaySide() {
  const p = useFilmProgress();
  return <SidePanels progress={p} />;
}

export function FilmSequence() {
  const rm = useReducedMotion();
  if (rm) return <FilmStills />;
  return <FilmCanvas />;
}

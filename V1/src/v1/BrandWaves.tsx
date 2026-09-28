import { useEffect, useState } from "react";
import "./waves.css";

/* V2-WAVES — hyperspace brand/insurer waves (STAR moment).
 *
 * Wave 1 = 8 eyewear brands, source 215–325, subject LEFT → logos settle
 *   into the RIGHT empty side (x 64–94%, never the subject's half).
 * Wave 2 = 8 insurers, source 411–470, subject RIGHT → logos settle into
 *   the LEFT empty side (x 6–36%). Nothing during the ring (325–411) or
 *   the lens dive (≥470). Headers live in SidePanels (WORDS lane) — this
 *   file owns logos + depth tunnel only, no text.
 * Film fractions use the canonical 615 cut: F(s) = (s-1)/614.
 * GPU only (transforms/opacity; blur is static depth + short exit rush).
 * Reduced motion: static constellation, no tunnel, no streaks, no drift. */

type Depth = "near" | "mid" | "far";
type Slot = {
  x: number; y: number;
  depth: Depth; z: number; src: string; alt: string; wave: 1 | 2;
};

const BRANDS: Slot[] = [
  { x: 68, y: 31, depth: "near", z: 0,    src: "/web/brands-light/maui-jim.png", alt: "Maui Jim",  wave: 1 },
  { x: 80, y: 36, depth: "mid",  z: -120, src: "/web/brands-light/ray-ban.png",  alt: "Ray-Ban",   wave: 1 },
  { x: 86, y: 47, depth: "far",  z: -160, src: "/web/brands-light/prada.png",    alt: "Prada",     wave: 1 },
  { x: 70, y: 52, depth: "near", z: 0,    src: "/web/brands-light/miu-miu.png",  alt: "Miu Miu",   wave: 1 },
  { x: 77, y: 62, depth: "mid",  z: -120, src: "/web/brands-light/persol.png",   alt: "Persol",    wave: 1 },
  { x: 85, y: 65, depth: "far",  z: -160, src: "/web/brands-light/oakley.png",   alt: "Oakley",    wave: 1 },
  { x: 66, y: 74, depth: "mid",  z: -120, src: "/web/brands-light/tiffany.png",  alt: "Tiffany & Co.", wave: 1 },
  { x: 79, y: 78, depth: "far",  z: -160, src: "/web/brands-light/versace.png",  alt: "Versace",   wave: 1 },
];

const INSURERS: Slot[] = [
  { x: 32, y: 31, depth: "near", z: 0,    src: "/web/insurance-light/sun-life.png",           alt: "Sun Life", wave: 2 },
  { x: 20, y: 36, depth: "mid",  z: -120, src: "/web/insurance-light/mbc-logo-en.png",        alt: "Medavie Blue Cross", wave: 2 },
  { x: 14, y: 47, depth: "far",  z: -160, src: "/web/insurance-light/manulife.png",           alt: "Manulife", wave: 2 },
  { x: 30, y: 52, depth: "near", z: 0,    src: "/web/insurance-light/greenshield.png",        alt: "GreenShield", wave: 2 },
  { x: 23, y: 62, depth: "mid",  z: -120, src: "/web/insurance-light/canada-life-min.png",    alt: "Canada Life", wave: 2 },
  { x: 15, y: 65, depth: "far",  z: -160, src: "/web/insurance-light/desjardins.png",         alt: "Desjardins", wave: 2 },
  { x: 33, y: 74, depth: "mid",  z: -120, src: "/web/insurance-light/ia-financial-group.png", alt: "iA Financial Group", wave: 2 },
  { x: 21, y: 78, depth: "far",  z: -160, src: "/web/insurance-light/empire-life.png", alt: "Empire Life", wave: 2 },
];

/* F5-MOBILE (ID=OVERLAY): portrait phones have no empty side, so the
 * desktop side-constellations would land ON the glasses. For ≤820px
 * portrait the FRAME agent exposes --film-band-top / --film-band-bottom on
 * the film root (top-band bottom edge / bottom-band top edge); fallback is
 * top 0–22% / bottom 70–100% of the viewport. Wave 1 settles as a compact
 * 2-row constellation in the TOP band, wave 2 in the BOTTOM band; side
 * panels take the OTHER band (see side.css). Flight stays depth-first
 * (translateZ rush) so logos fly in from depth, never across the subject.
 * Transforms/opacity only; no per-frame allocations (arithmetic on cached
 * band edges, static grid table). Desktop unchanged. */
const MOBILE_GRID_X = [17, 39, 61, 83];
const FALLBACK_TOP_EDGE = 0.22;
const FALLBACK_BOT_EDGE = 0.7;

function parseBandEdge(raw: string, total: number, fallback: number): number {
  const v = (raw || '').trim();
  if (!v) return fallback;
  if (v.endsWith('%')) {
    const n = parseFloat(v.slice(0, -1));
    if (Number.isFinite(n)) return Math.min(0.95, Math.max(0.05, n / 100));
    return fallback;
  }
  if (v.endsWith('px')) {
    const n = parseFloat(v.slice(0, -2));
    if (Number.isFinite(n) && total > 0) return Math.min(0.95, Math.max(0.05, n / total));
    return fallback;
  }
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return fallback;
  if (n > 1) return total > 0 ? Math.min(0.95, Math.max(0.05, n / total)) : fallback;
  return Math.min(0.95, Math.max(0.05, n));
}

function useFilmBands(W: number, H: number) {
  const [bands, setBands] = useState(() => ({ topEdge: FALLBACK_TOP_EDGE, botEdge: FALLBACK_BOT_EDGE }));
  useEffect(() => {
    try {
      const root = document.querySelector('.v1-film');
      if (!root) {
        setBands({ topEdge: FALLBACK_TOP_EDGE, botEdge: FALLBACK_BOT_EDGE });
        return;
      }
      const cs = getComputedStyle(root);
      const rawTop = cs.getPropertyValue('--film-band-top');
      const rawBot = cs.getPropertyValue('--film-band-bottom');
      let topEdge = parseBandEdge(rawTop, H, FALLBACK_TOP_EDGE);
      let botEdge = parseBandEdge(rawBot, H, FALLBACK_BOT_EDGE);
      if (topEdge < 0.05 || topEdge > 0.4) topEdge = FALLBACK_TOP_EDGE;
      if (botEdge < 0.6 || botEdge > 0.95) botEdge = FALLBACK_BOT_EDGE;
      setBands((prev) =>
        prev.topEdge === topEdge && prev.botEdge === botEdge ? prev : { topEdge, botEdge },
      );
    } catch {
      setBands({ topEdge: FALLBACK_TOP_EDGE, botEdge: FALLBACK_BOT_EDGE });
    }
  }, [W, H]);
  return bands;
}

const F = (s: number): number => (s - 1) / 614;
/* Whole-beat windows: wave 1 owns 215–325, wave 2 owns 411–470. */
const W1_START = F(215);
const W1_END = F(325);
const W2_START = F(411);
const W2_END = F(470);
/* Long run-up: stagger arrivals across the first ~half of each window,
 * hold the constellation, then rush past the camera at the tail. */
const W1_ITEM0 = W1_START + 0.006;
const W1_STAGGER = 0.011;
const W1_DUR = 0.062;
const W1_LAST_SETTLE = W1_ITEM0 + 7 * W1_STAGGER + W1_DUR;
const W1_EXIT_START = W1_END - 0.012;
const W1_EXIT_SPAN = 0.011;
const W2_ITEM0 = W2_START + 0.004;
const W2_STAGGER = 0.0045;
const W2_DUR = 0.03;
const W2_LAST_SETTLE = W2_ITEM0 + 7 * W2_STAGGER + W2_DUR;
const W2_EXIT_START = W2_END - 0.011;
const W2_EXIT_SPAN = 0.01;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutExpo = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/* Depth system: size ratio in CSS (near 1.0 / mid 0.72 / far 0.5).
 * F4-MFILM: far softer via opacity 0.75 + 1.2px static blur on the far
 * tier ONLY (3 logos/wave ≤4-filter budget); mid/near use opacity only.
 * Near logos ≈150–190px @1512. */
const DEPTH_OP: Record<Depth, number> = { near: 0.96, mid: 0.88, far: 0.75 };
const DEPTH_BLUR: Record<Depth, number> = { near: 0, mid: 0, far: 1.2 };
const DEPTH_DRIFT: Record<Depth, number> = { near: 6, mid: 4, far: 2.5 };

function useViewport() {
  const [s, setS] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1440,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  }));
  useEffect(() => {
    const f = () => setS({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return s;
}

function useReducedMotion() {
  const [rm, setRm] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setRm(mq.matches);
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return rm;
}

/* Depth tunnel: N faint warm-white streak lines converging on the vanishing
 * point in the empty side. Original light-year feel, not Star Wars: hairline
 * (1px), low alpha, fanned rays + a few concentric drift rings implied by
 * staggered lengths. Geometry is static; intensity is velocity-tied via
 * opacity only (GPU). Hidden under reduced motion. */
const TUNNEL_RAYS = 16;
function DepthTunnel({ vx, vy, alpha, wave, short }: { vx: number; vy: number; alpha: number; wave: 1 | 2; short?: boolean }) {
  if (alpha <= 0.004) return null;
  const rays = [];
  for (let i = 0; i < TUNNEL_RAYS; i++) {
    const ang = (i / TUNNEL_RAYS) * Math.PI * 2 + (wave === 2 ? 0.2 : 0);
    const len = (120 + ((i * 53) % 140)) * (short ? 0.45 : 1);
    rays.push(
      <div
        key={i}
        className="bw-tunnel-ray"
        style={{
          left: `${vx}%`,
          top: `${vy}%`,
          width: `${len}px`,
          opacity: (alpha * (0.35 + ((i * 37) % 40) / 100)).toFixed(3),
          transform: `rotate(${(ang * 180 / Math.PI).toFixed(1)}deg) scaleX(${(0.6 + ((i * 29) % 50) / 100).toFixed(2)})`,
        }}
      />,
    );
  }
  return (
    <div className="bw-tunnel" aria-hidden>
      <div
        className="bw-tunnel-core"
        style={{ left: `${vx}%`, top: `${vy}%`, opacity: (alpha * 0.5).toFixed(3) }}
      />
      {rays}
    </div>
  );
}

function LogoItem({ slot, i, p, W, H, start, dur, z0, exitT, reduced, mob, topEdge, botEdge }: {
  slot: Slot; i: number; p: number; W: number; H: number;
  start: number; dur: number; z0: number; exitT: number; reduced: boolean;
  mob: 0 | 1 | 2; topEdge: number; botEdge: number;
}) {
  const t = clamp01((p - start) / dur);
  if (t <= 0) return null;
  let bx = slot.x;
  let by = slot.y;
  if (mob !== 0) {
    const mi = i >= 20 ? i - 20 : i;
    const gx = MOBILE_GRID_X[mi & 3];
    if (mob === 1) {
      // Top band rows sit BELOW the fixed header (BOOK/MENU ≈ top 8%),
      // above the subject (band bottom ≈ 22%).
      // MOBTWEAK: clamp logo CENTRES ≥16px below the 64px header's bottom
      // edge (top of logo ≥80px). Reserve half logo height + breathe per
      // depth tier (near 24 / mid 19 / far 16) so no logo edge can creep
      // under the header on short viewports (360×780).
      bx = gx;
      by = topEdge * 100 * (mi < 4 ? 0.55 : 0.85);
      const halfReserve = slot.depth === "near" ? 24 : slot.depth === "mid" ? 19 : 16;
      const minCentre = ((64 + 16 + halfReserve) / H) * 100;
      if (by < minCentre) by = minCentre;
      // Keep the lower row inside the band (above the subject).
      const maxCentre = topEdge * 100 - (halfReserve / H) * 100;
      if (maxCentre > minCentre && by > maxCentre) by = maxCentre;
    } else {
      // Bottom band rows sit ABOVE the SKIP FILM footer (≈ bottom 5%),
      // below the subject (band top ≈ 70%).
      // MOBTWEAK: clamp logo CENTRES ≥24px above the skip control's top
      // edge (skip top ≈72px from bottom → centre ≤ H-72-24-half).
      bx = gx;
      by = (botEdge + (1 - botEdge) * (mi < 4 ? 0.22 : 0.5)) * 100;
      const halfReserve = slot.depth === "near" ? 24 : slot.depth === "mid" ? 19 : 16;
      const maxCentre = ((H - 72 - 24 - halfReserve) / H) * 100;
      if (by > maxCentre) by = maxCentre;
    }
  }

  /* Flight: pinpoint far away → hyper-fast expo rush → hard brake with a
   * tiny overshoot at t≈0.86–1 (≤2.5%), settled by t=1. */
  const eBase = reduced ? 1 : easeOutExpo(t);
  let e = eBase;
  if (!reduced && t > 0.86 && t < 1) {
    const over = (t - 0.86) / 0.14;
    e = eBase * (1 + 0.025 * Math.sin(over * Math.PI));
  }
  if (reduced) e = 1;

  const settled = t >= 1;
  const driftAmp = reduced || !settled ? 0 : DEPTH_DRIFT[slot.depth];
  const driftX = driftAmp ? Math.sin(p * 40 + i * 1.7) * driftAmp : 0;
  const driftY = driftAmp ? Math.cos(p * 34 + i * 2.1) * (driftAmp * 0.8) : 0;
  const ox = (((bx - 50) * e) / 100) * W + driftX;
  const oy = (((by - 50) * e) / 100) * H + driftY;
  const exitZ = exitT * exitT * 2600;
  const zz = reduced ? slot.z : z0 + (slot.z - z0) * e + exitZ;

  /* Opacity: fast-in × depth tier (≥0.9) × exit fade. */
  const enterOp = reduced ? 1 : Math.min(1, t / 0.06);
  const opacity = enterOp * DEPTH_OP[slot.depth] * (1 - exitT);

  /* Streak trail: long, length ∝ velocity (d/dt of expo = 2^-10t). */
  const speed = reduced ? 0 : Math.pow(2, -10 * t);
  const streakLen = Math.max(0, speed * Math.min(340, W * 0.24));
  const streakOp = Math.min(0.9, speed * 1.1) * (1 - exitT);
  const showStreak = !reduced && t < 0.92 && exitT < 0.5 && streakLen > 4;
  const ang = (Math.atan2(((50 - by) / 100) * H, ((50 - bx) / 100) * W) * 180) / Math.PI;

  /* Exit: rush past camera — scale up + fade. No exit blur filter
   * (F4-MFILM perf: transforms/opacity only; static far-tier blur is the
   * sole filter, 3 logos/wave, so ≤4 filtered elements at once). */
  const exitScale = 1 + exitT * 2;
  const totalBlur = reduced ? 0 : DEPTH_BLUR[slot.depth];

  return (
    <div
      className="bw-item"
      style={{
        transform: `translate3d(${ox.toFixed(1)}px,${oy.toFixed(1)}px,${zz.toFixed(0)}px)`,
        opacity: opacity.toFixed(3),
      }}
    >
      <div
        className={`bw-logo bw-${slot.depth}${settled && exitT <= 0 && !reduced ? " is-settled" : ""}`}
        style={
          exitT > 0
            ? {
                transform: `translate(-50%,-50%) scale(${exitScale.toFixed(3)})`,
              }
            : totalBlur > 0
              ? {
                  transform: `translate(-50%,-50%)`,
                  filter: `blur(${totalBlur.toFixed(2)}px)`,
                }
              : undefined
        }
      >
        {showStreak && (
          <div className="bw-streak" aria-hidden
            style={{ width: `${streakLen.toFixed(0)}px`, opacity: streakOp.toFixed(3), transform: `rotate(${ang.toFixed(1)}deg)` }} />
        )}
        <img src={slot.src} alt={slot.alt} draggable={false} />
      </div>
    </div>
  );
}

/* Tunnel intensity envelope: fade in over the run-up, hold through the
 * flight, fade as the last logo settles; small flare on exit. */
function tunnelAlpha(p: number, start: number, lastSettle: number, exitT: number): number {
  const enter = clamp01((p - start) / 0.02);
  const leave = 1 - clamp01((p - (lastSettle - 0.015)) / 0.03);
  return Math.max(0, Math.min(enter, leave)) * 0.55 + exitT * (1 - exitT) * 0.3;
}

export default function BrandWaves({ progress }: { progress: number }) {
  const p = progress;
  const { w: W, h: H } = useViewport();
  const reduced = useReducedMotion();
  const bands = useFilmBands(W, H);
  const isPortraitMobile = W <= 820 && H > W;
  const topEdge = bands.topEdge;
  const botEdge = bands.botEdge;
  if (p < W1_START - 0.004 || p > W2_END + 0.02) return null;
  // Ring breathe gap (burst 325 → sweep 411): no logos, no tunnel.
  if (p >= W1_END - 0.001 && p < W2_START - 0.004) return null;
  const w1ExitT = reduced
    ? clamp01((p - W1_EXIT_START) / 0.04) * 0.9
    : clamp01((p - W1_EXIT_START) / W1_EXIT_SPAN);
  const w2ExitT = reduced ? clamp01((p - W2_EXIT_START) / 0.04) * 0.9 : clamp01((p - W2_EXIT_START) / W2_EXIT_SPAN);
  const showW1 = p < W1_END + 0.002;
  const showW2 = p >= W2_START - 0.004 && p <= W2_END + 0.02;
  if (!showW1 && !showW2) return null;
  const w1Tunnel = showW1 && !reduced ? tunnelAlpha(p, W1_START, W1_LAST_SETTLE, w1ExitT) : 0;
  const w2Tunnel = showW2 && !reduced ? tunnelAlpha(p, W2_START, W2_LAST_SETTLE, w2ExitT) : 0;
  const w1Mob = isPortraitMobile ? 1 : 0;
  const w2Mob = isPortraitMobile ? 2 : 0;
  const w1Vx = isPortraitMobile ? 50 : 77;
  const w1Vy = isPortraitMobile ? (topEdge * 70) : 52;
  const w2Vx = isPortraitMobile ? 50 : 22;
  const w2Vy = isPortraitMobile ? ((botEdge + (1 - botEdge) * 0.36) * 100) : 52;
  return (
    <div className="bw-root" aria-hidden>
      {showW1 && w1Tunnel > 0.004 && <DepthTunnel vx={w1Vx} vy={w1Vy} alpha={w1Tunnel} wave={1} short={isPortraitMobile} />}
      {showW1 &&
        BRANDS.map((s, i) => (
          <LogoItem key={s.src} slot={s} i={i} p={p} W={W} H={H}
            start={W1_ITEM0 + i * W1_STAGGER} dur={W1_DUR} z0={-7000} exitT={w1ExitT} reduced={reduced}
            mob={w1Mob} topEdge={topEdge} botEdge={botEdge} />
        ))}
      {showW2 && w2Tunnel > 0.004 && <DepthTunnel vx={w2Vx} vy={w2Vy} alpha={w2Tunnel} wave={2} short={isPortraitMobile} />}
      {showW2 &&
        INSURERS.map((s, i) => (
          <LogoItem key={s.src} slot={s} i={i + 20} p={p} W={W} H={H}
            start={W2_ITEM0 + i * W2_STAGGER} dur={W2_DUR} z0={-5000} exitT={w2ExitT} reduced={reduced}
            mob={w2Mob} topEdge={topEdge} botEdge={botEdge} />
        ))}
    </div>
  );
}

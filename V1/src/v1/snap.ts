// MAGNET — true magnetic snap for the film scroll.
// Client: "guide the scrolling to the important parts like magnets — snap
// to the actual parts more; currently I can stop at awkward positions."
//
// Whenever the user stops inside the film section (settled: idle 140 ms,
// Lenis ~zero velocity, no touch in progress), ALWAYS glide to the
// direction-aware nearest key pose — no capture window, so there are no
// awkward rest positions. Glide: Lenis `scrollTo` 0.6 s easeOutCubic.
// Direction-aware: scrolling forward and past 35% of the gap commits to the
// next pose, else the previous (mirrored for backward). Any new input
// cancels the glide. Only inside the film section (`.v1-film`). Off for
// prefers-reduced-motion. The subtle "sticky" pull near poses lives in
// lenis.ts (virtualScroll ±6% gap ×0.7); this module only does the idle
// glide and never fights live input.
import type Lenis from 'lenis';
import { ensureLenis, isScrollGateActive } from './lenis';
import {
  snapKeyScrolls,
  snapMagnetTarget,
  SNAP_SOURCE_KEYS,
  type MagnetDirection,
} from './filmCurve';

const IDLE_MS = 140;
const RETRY_MS = 120;
const SNAP_DURATION = 0.6;
/** Lenis velocity units (px/frame) below which scroll counts as settled. */
const SETTLE_VELOCITY = 0.35;
/** Quiet period after the last touchend before a touch-driven snap may fire. */
const TOUCH_SETTLE_MS = 600;
/** Rest within this scroll-progress distance of a key counts as on-key. */
const ON_KEY_EPS = 1e-4;

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

function filmMetrics(): { top: number; dist: number } | null {
  const section = document.querySelector('.v1-film') as HTMLElement | null;
  if (!section) return null;
  const top = section.offsetTop;
  const dist = Math.max(1, section.offsetHeight - window.innerHeight);
  return { top, dist };
}

/** Start the magnet snap. Returns a cleanup fn. No-op under reduced-motion. */
export function initSnap(lenis?: Lenis | null): () => void {
  if (typeof window === 'undefined') return () => undefined;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => undefined;

  const keys = snapKeyScrolls();
  let active: Lenis | null = lenis ?? null;
  try {
    active ??= ensureLenis();
  } catch {
    return () => undefined;
  }
  const l = active;
  if (!l) return () => undefined;

  let idleTimer: number | null = null;
  let snapping = false;
  let disposed = false;
  let lastTouchEnd = 0;
  let lastDir: MagnetDirection = 0;
  let lastY = window.scrollY;

  // QA hook: Playwright reads the live key list + last magnet decision via
  // window.__v1Magnet (keys in scroll-progress units, sources in frames).
  try {
    (window as unknown as { __v1Magnet?: unknown }).__v1Magnet = {
      keys,
      sources: [...SNAP_SOURCE_KEYS],
    };
  } catch {
    /* SSR / tests without window */
  }

  const clearIdle = () => {
    if (idleTimer !== null) {
      window.clearTimeout(idleTimer);
      idleTimer = null;
    }
  };

  // Any fresh input cancels an in-flight glide immediately.
  const cancelSnap = () => {
    clearIdle();
    if (snapping) {
      snapping = false;
      try {
        l.stop();
        l.start();
      } catch {
        /* lenis already torn down */
      }
    }
  };

  const scheduleIdle = (delay: number = IDLE_MS) => {
    if (disposed || snapping) return;
    clearIdle();
    idleTimer = window.setTimeout(onIdle, delay);
  };

  /** Track scroll direction from Lenis velocity (fall back to ΔscrollY). */
  const trackDirection = () => {
    try {
      const v = l.velocity;
      if (Math.abs(v) > 0.05) {
        lastDir = v > 0 ? 1 : -1;
        return;
      }
    } catch {
      /* fall through to ΔscrollY */
    }
    const y = window.scrollY;
    const dy = y - lastY;
    if (Math.abs(dy) > 0.5) lastDir = dy > 0 ? 1 : -1;
    lastY = y;
  };

  /** True only when scroll has fully settled — no Lenis motion, no fling. */
  const isSettled = (): boolean => {
    try {
      // isScrolling is truthy while Lenis drives smooth/native scroll
      // (wheel smoothing, momentum glide, or an in-flight scrollTo).
      if (l.isScrolling) return false;
      if (Math.abs(l.velocity) > SETTLE_VELOCITY) return false;
    } catch {
      return false;
    }
    // Mobile flings: native inertia keeps the page moving after touchend
    // without Lenis events — wait for the quiet period before snapping.
    if (performance.now() - lastTouchEnd < TOUCH_SETTLE_MS) return false;
    return true;
  };

  const onIdle = () => {
    idleTimer = null;
    if (disposed || snapping) return;
    // Magnet gate: let the soft hold breathe — never glide mid-gate.
    if (isScrollGateActive()) {
      scheduleIdle(RETRY_MS);
      return;
    }
    // Still gliding (momentum / fling)? Back off and re-check — never snap
    // mid-motion.
    if (!isSettled()) {
      scheduleIdle(RETRY_MS);
      return;
    }
    const m = filmMetrics();
    if (!m) return;
    const y = window.scrollY;
    lastY = y;
    // Only inside the film section (1px tolerance at the edges).
    if (y < m.top - 1 || y > m.top + m.dist + 1) return;
    const scrollP = (y - m.top) / m.dist;
    // MAGNET: always a target — no capture window. Direction-aware so a
    // forward push past 35% of the gap commits to the next pose.
    const target = snapMagnetTarget(scrollP, lastDir);
    if (Math.abs(scrollP - keys[target]) < ON_KEY_EPS) return;
    const targetY = m.top + keys[target] * m.dist;
    snapping = true;
    try {
      (window as unknown as { __v1Magnet?: { target?: number } }).__v1Magnet!.target = target;
    } catch {
      /* ignore */
    }
    try {
      l.scrollTo(targetY, { duration: SNAP_DURATION, easing: easeOutCubic });
      // scrollTo has no completion callback — unlock after the ease lands.
      window.setTimeout(() => {
        snapping = false;
        try {
          lastY = window.scrollY;
        } catch {
          /* ignore */
        }
      }, SNAP_DURATION * 1000 + 400);
    } catch {
      snapping = false;
    }
  };

  const onLenisScroll = () => {
    trackDirection();
    // Programmatic magnet scrolls also emit here — ignore while snapping so
    // we don't fight the ease; any real user input arrives via wheel/touch.
    if (!snapping) scheduleIdle();
  };

  const onUserInput = () => {
    trackDirection();
    if (snapping) cancelSnap();
    else scheduleIdle();
  };

  const onTouchStart = () => {
    // A finger down means a touch gesture is in progress — never snap into
    // it; stamp lastTouchEnd far future-side via explicit flag instead: just
    // cancel + reschedule, the touchend handler re-arms the quiet period.
    if (snapping) cancelSnap();
    else clearIdle();
  };

  const onTouchEnd = () => {
    lastTouchEnd = performance.now();
    if (snapping) cancelSnap();
    else scheduleIdle();
  };

  l.on('scroll', onLenisScroll);
  window.addEventListener('wheel', onUserInput, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onUserInput, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onUserInput);
  scheduleIdle();

  return () => {
    disposed = true;
    clearIdle();
    try {
      l.off('scroll', onLenisScroll);
    } catch {
      /* already destroyed */
    }
    window.removeEventListener('wheel', onUserInput);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onUserInput);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchEnd);
    window.removeEventListener('keydown', onUserInput);
  };
}

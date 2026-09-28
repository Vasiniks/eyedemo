// V3-SCROLL — shared Lenis singleton (owns all Lenis config).
// MAGNET — subtle sticky pull inside the film: |deltaY| capped per event
// (~60 px desktop wheel, ~45 px touch) so fast flicks can't skip key beats,
// plus slightly reduced sensitivity (×0.7) within ±6% of the nearest gap
// around each key pose (via snapMagnetWindow), plus a short soft gate
// (~320 ms reduced sensitivity) when the playhead crosses a key at speed.
// Below the film (white act + rest) Lenis runs snappier: lerp ≈0.16 with no
// clamping. FilmSequence.tsx and snap.ts must both use this — never
// `new Lenis` inline. Synced to the GSAP ticker (one RAF total).
import gsap from 'gsap';
import Lenis from 'lenis';
import { snapKeyScrolls, snapMagnetWindow } from './filmCurve';

/** Per-event |deltaY| caps inside the film (px, post-multiplier). */
export const SCROLL_WHEEL_CAP = 60;
export const SCROLL_TOUCH_CAP = 45;
/** Sensitivity scale inside a magnet window / during a gate hold. */
export const SCROLL_NEAR_SCALE = 0.35;
/** MAGNET — subtle sticky-pull scale within ±6% of a key pose. */
export const MAGNET_NEAR_SCALE = 0.7;
/** Soft-hold length after crossing a key frame at speed. */
export const SCROLL_GATE_MS = 320;
/** Lenis velocity (px/frame) above which a key crossing trips a gate. */
const GATE_VELOCITY = 4;
export const SCROLL_LERP_FILM = 0.11;
export const SCROLL_LERP_BELOW = 0.16;

let lenis: Lenis | null = null;
let rafFn: ((time: number) => void) | null = null;
let gateUntil = 0;
let lastScrollP: number | null = null;

/** True while a key-frame gate hold is softening input. */
export function isScrollGateActive(): boolean {
  try {
    return performance.now() < gateUntil;
  } catch {
    return false;
  }
}

function filmMetrics(): { top: number; dist: number } | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  const section = document.querySelector('.v1-film') as HTMLElement | null;
  if (!section) return null;
  const top = section.offsetTop;
  const dist = Math.max(1, section.offsetHeight - window.innerHeight);
  return { top, dist };
}

function wireTicker(): void {
  if (rafFn || !lenis) return;
  rafFn = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(rafFn);
  gsap.ticker.lagSmoothing(0);
}

/** Create (once) and return the shared Lenis instance. Safe to call twice. */
export function ensureLenis(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({
    lerp: SCROLL_LERP_FILM,
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2,
    syncTouch: false,
    virtualScroll: (data) => {
      try {
        const m = filmMetrics();
        if (!m) return undefined as unknown as boolean;
        const y = window.scrollY;
        // Below the film: snappy, unclamped.
        if (y >= m.top + m.dist) {
          if (lenis) lenis.options.lerp = SCROLL_LERP_BELOW;
          return undefined as unknown as boolean;
        }
        if (lenis) lenis.options.lerp = SCROLL_LERP_FILM;
        // Only shape input inside the film; above it leave scroll alone.
        if (y < m.top - 1 || y > m.top + m.dist + 1) return undefined as unknown as boolean;
        const isTouch = (data.event?.type ?? '').includes('touch');
        const cap = isTouch ? SCROLL_TOUCH_CAP : SCROLL_WHEEL_CAP;
        let d = data.deltaY;
        if (Math.abs(d) > cap) d = Math.sign(d) * cap;
        const scrollP = (y - m.top) / m.dist;
        const keys = snapKeyScrolls();
        for (let i = 0; i < keys.length; i++) {
          if (Math.abs(scrollP - keys[i]) <= snapMagnetWindow(i)) {
            d *= MAGNET_NEAR_SCALE;
            break;
          }
        }
        // Soft gate hold: keep sensitivity low just after a fast crossing.
        if (performance.now() < gateUntil) d *= SCROLL_NEAR_SCALE;
        data.deltaY = d;
      } catch {
        /* never break scroll on a shaping error */
      }
      return undefined as unknown as boolean;
    },
  });
  // Key-frame gates: crossing a key at speed trips a short soft hold, and
  // the zone lerp (film 0.11 / below-film 0.16) follows programmatic scrolls
  // (keyboard, scrollbar) that bypass virtualScroll.
  try {
    lenis.on('scroll', (l: Lenis) => {
      try {
        const m = filmMetrics();
        if (!m) return;
        const y = (l as unknown as { scroll?: number }).scroll ?? window.scrollY;
        l.options.lerp = y >= m.top + m.dist ? SCROLL_LERP_BELOW : SCROLL_LERP_FILM;
        const p = (y - m.top) / m.dist;
        if (lastScrollP !== null && Math.abs(l.velocity) > GATE_VELOCITY) {
          const keys = snapKeyScrolls();
          for (let i = 0; i < keys.length; i++) {
            if ((lastScrollP - keys[i]) * (p - keys[i]) < 0) {
              gateUntil = performance.now() + SCROLL_GATE_MS;
              break;
            }
          }
        }
        lastScrollP = p;
      } catch {
        /* ignore */
      }
    });
  } catch {
    /* older Lenis without .on — gates simply stay off */
  }
  wireTicker();
  return lenis;
}

/** The shared instance, or null if not created yet (e.g. reduced-motion). */
export function getLenis(): Lenis | null {
  return lenis;
}

/** Tear down the singleton (HMR / tests only). */
export function destroyLenis(): void {
  if (rafFn) {
    gsap.ticker.remove(rafFn);
    rafFn = null;
  }
  lenis?.destroy();
  lenis = null;
  gateUntil = 0;
  lastScrollP = null;
}

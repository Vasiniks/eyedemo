# V2-SNAP integration note (for the FILM agent)

SNAP owns `src/v1/lenis.ts` (shared Lenis singleton), `src/v1/snap.ts`
(`initSnap`), plus snap helpers in `filmCurve.ts`. `App.tsx` already calls
`initSnap(getLenis())` once. Two small changes needed in `FilmSequence.tsx`
— nothing else:

1. **Single Lenis.** Replace:
   ```ts
   import Lenis from 'lenis';
   ```
   with:
   ```ts
   import { ensureLenis } from './lenis';
   ```
   and replace the creation block:
   ```ts
   lenis = new Lenis({
     lerp: 0.075,
     smoothWheel: true,
     wheelMultiplier: 0.9,
     touchMultiplier: 1.4,
   });
   lenis.on('scroll', ScrollTrigger.update);
   rafLenis = (time: number) => {
     lenis?.raf(time * 1000);
   };
   gsap.ticker.add(rafLenis);
   gsap.ticker.lagSmoothing(0);
   ```
   with:
   ```ts
   lenis = ensureLenis();
   lenis.on('scroll', ScrollTrigger.update);
   ```
   (`ensureLenis` already wires the GSAP ticker once; `rafLenis` and its
   `gsap.ticker.remove(rafLenis)` cleanup line can go. Keep `lenis?.destroy()`
   OUT — the singleton outlives the film mount; SNAP owns teardown.)
   Do NOT touch the ScrollTrigger pin/scrub logic or the `tick` draw loop.

2. **Pass the instance to snap.** Replace the `hookSnap()` dynamic import
   with a static import and a single call after ScrollTrigger setup:
   ```ts
   import { initSnap } from './snap';
   // …
   initSnap(lenis);
   ```
   then delete `hookSnap()` and its call site. (`App.tsx` also calls
   `initSnap(getLenis())` — same singleton, same target, harmless duplicate;
   leave it.)

Why: until (1), `initSnap` falls back to a second Lenis that fights the
film's own smoother (the nudge still lands, but smoothing doubles). After
this change there is exactly one Lenis, one RAF, shared by scrub + snap.

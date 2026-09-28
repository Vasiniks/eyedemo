# FilmCanvas API — Lane B conductor contract (PLAN-MASTER §6, §7.3)

**Canonical paths** (per §7.2 + scaffold; the `src/canvas/*` shorthand in some
lane notes means this directory):

- `src/components/canvas/FilmCanvas.tsx` — ONE persistent `<Canvas>`, Home-only
- `src/components/canvas/CameraRig.tsx` — the ONLY camera driver
- `src/components/canvas/Effects.tsx` — beat-gated Bloom+Vignette (B6–B9, desktop tiers)
- `src/components/canvas/LensPortal.tsx` — stand-in lens disc + `<WhiteVeil/>`
- `src/motion/{lenis,progress,chapters,masterTimeline,tiers}.ts` — conductor
- `src/store/useFilmStore.ts` — discrete DOM store (beat/quality/RM/veil)

## 1. Composition (parent owns order)

```tsx
import { FilmCanvas } from './components/canvas/FilmCanvas'
import { LensPortal, WhiteVeil } from './components/canvas/LensPortal'
// Lanes C/D compose their rigs as children, in §7.3 order:
<FilmCanvas>
  <SceneStage />    {/* D: set + Environment + Lightformers + fog/exposure */}
  <CaseRig />       {/* C: case.glb, Case_Flap 40° keys + tip-lag */}
  <GlassesRig />    {/* C: glasses.glb, fold→open, G_Lenses static */}
  <SponsorField wave={1|2} /> {/* D: instanced planes + streaks */}
  <LensPortal linked={glassesLinked} />
</FilmCanvas>
<WhiteVeil /> {/* DOM #white-veil, fixed, Paper — conductor-driven */}
```

`FilmCanvas` renders `{children}` → `<CameraRig/>` → `<Effects/>` internally.
Home is the ONLY route that mounts it (route change = full dispose).

## 2. The sole 3D input: `filmProgress`

```ts
import { filmProgress } from './motion/progress' // { p: 0..1, beat: 'B1'..'B9' }
```

- **R3F components: read `filmProgress.p` in `useFrame`, mutate refs, never
  `setState` per frame.** Damping: `THREE.MathUtils.damp(cur, target, 5.2, dt)`,
  dt capped at 1/30. Reduced-motion: snap (`smooth = target`).
- **DOM components: subscribe discretely.**
  `useFilmStore(s => s.beat)` (re-renders on beat change only) or
  `subscribeFilmProgress(fn)` from `motion/progress` for imperative updates.
- **QA:** dev builds expose `window.__film.setProgress(p)` / `.getProgress()`.
  Same ref, same state — proves pure-function-of-progress.

## 3. Lens anchor (portal rail source of truth)

`motion/chapters.ts` exports `getLensAnchor(): { center, normal }` and
`setLensAnchor(center, normal)`. Default = stand-in (right lens hovering
above the case). **Lane C:** once the real `G_Lenses` exists, call
`setLensAnchor()` per frame from its world transform (centre + plane normal),
and pass `linked` to `<LensPortal/>` so the stand-in disc unmounts.
CameraRig B8–B9 rails onto whatever the anchor reports — no CameraRig change
needed. (Left lens is the mirror backup.)

## 4. Sampling helpers (pure functions of p — reuse, don't re-author)

`motion/chapters.ts`: `sampleCamera(p, mobile)` (position/target/fov/fog/
exposure/near/veil/canvasOpacity), `samplePortal(p)` (transmission/roughness/
ior/thickness/edgeFire/bloom/threshold/radius), `beatAt(p)`, `BEATS`
(label→[start,end]), `darkVhForWidth(w)`, `expoInOut(t)`.

Camera spine: MOTION §2 keys ×1.20 dolly reframe (198 mm shell override).
Mobile: pullback ×1.45 on radius, FOV +9°. Exposure 1.0→1.15 → 1.35 portal →
2.2 handoff. Fog 0.035 → 0.015 waves → 0.030 approach → 0 under veil.

## 5. Tiers (`motion/tiers.ts`)

`resolveTier()` → `{ tier, dpr, post, transmission, shadows }`.
Laptop (DPR ≤1.5) is the desktop default; mobile ≤1.25 with NO post and NO
transmission (opacity crossfade instead); `?tier=low|mobile|laptop|high`
overrides for QA; RM forces the `rm` spec. Effects mounts only on
high/laptop in beats B6–B9.

## 6. What lanes MUST NOT do

- Canvas positioning: the FilmCanvas wrapper is `absolute / 100vh` INSIDE
  `#film-pin` (deliberately NOT `fixed`: ScrollTrigger's pin sets an identity
  transform on the trigger, which re-contains fixed descendants to the full
  800vh shell — observed 1440×7200 canvas in QA). Absolute inside the pinned
  (itself viewport-locked) trigger renders viewport-locked at 1× cost.
  Keep ALL fixed-position DOM (HUD, overlays) OUTSIDE `#film-pin`.

- No second ticker (`lenis.on('scroll', ScrollTrigger.update)` + single
  `gsap.ticker` in `motion/lenis.ts` is the only clock). No `ScrollControls`,
  no `ScrollSmoother`, no pointer-parallax on the film camera.
- No scrubbed-tween eases other than `ease:'none'`; curves are baked into
  sampled values (expo-shaped keys), not tween eases.
- No `setState` per frame in Canvas children; no layout props in scroll.
- `#film-pin` shell heights + `#white-veil` element are DOM contracts owned
  with Lane E (see `docs/phase4/requests/B-film-integration.md`).

## 7. Isolated proof (step 4)

`dev-b.html` + `src/__dev__/b/` = Lane B's harness: box stand-ins on the
full §6 path, progress slider, 12-stop QA. Open
`http://localhost:5102/dev-b.html`. Screenshots: `docs/phase4/qa/B/`.

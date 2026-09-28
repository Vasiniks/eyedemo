# PLAN — Technical Architecture (ARCH lane, Phase 4)

Planning-only. No app scaffolded, no packages installed, no source written.
Sources read fully: `docs/00-BRIEF.md`, `docs/research/00-PHASE2-SYNTHESIS.md`,
`F-3d-motion-tech.md` (incl. §2g version table, §4–§6), `E-visual-references.md`,
`B-content-inventory.md`, `D-asset-inventory.md`, `G-glasses-model.md`.
Consulted: `frontend-architect` subagent (read-only). Skills loaded live:
`awwwards-playbook`, `build-threejs-scroll-worlds`, `cinematic-gsap-lenis-motion-system`
(remaining motion skills consumed via their observed summaries in F §1 — same content).
Context7 re-verified 2026-09-27: `/pmndrs/react-three-fiber` (frameloop/demand/invalidate/`loop.ts`
external-ticker path, zustand-in-`useFrame` pattern), `/darkroomengineering/lenis`
(GSAP-ticker wiring, `autoRaf:false`, `respectReducedMotion` default true).
GitHub survey (§6): 11 repos/files actually opened via `get_file_contents`/`search_code` this session.

Normative rule for all builders: **one scroll owner (Lenis), one clock (GSAP ticker),
one conductor (master film timeline).** Anything that adds a second ticker, a second
smooth-scroller, or drei `ScrollControls` is a P0 architecture violation (F §2c verified conflict).

---

## 1. Stack confirmation

**Confirm F §5: Vite + React 19 + R3F + drei + three + GSAP ScrollTrigger + Lenis, static build.**
No change proposed. Justification stands (single client-interactive scroll film; no SSR need;
static `dist/` deployable anywhere; playbook-pinned versions match). Rejections stand:
Next.js App Router (server surface + hydration delay before first Canvas frame, zero SSR benefit
for a scroll film), vanilla three (splits DOM/3D ownership, loses drei ecosystem).

**Routing: YES, add `react-router-dom`.** The site is not one page. B §0 page map that must
remain reachable: `/` (cinematic home), `/pages/services`-equivalent, `/pages/contact`-equivalent,
3 policy pages (`/policies/refund-policy`, `/policies/privacy-policy`, `/policies/terms-of-service`),
catalog (`/collections/*` + 22 `/products/*`, orphaned but must stay reachable per synthesis §1).
Only `Home` mounts the film `<Canvas>`; all other routes are light DOM (no three.js in their
chunks). Router gives code-splitting per route, no full reload, preserved Lenis instance.
Use `BrowserRouter`; static hosts need a rewrite (`dist/404.html` copy of `index.html`,
plus `_redirects` `/* /index.html 200` on Netlify / equivalent). If the deploy target cannot do
rewrites, fall back to `HashRouter` — decide at deploy step, code stays identical behind
`createBrowserRouter`/`createHashRouter` swap in one file (`src/app/router.tsx` owns it).

### Exact package list (pin at scaffold, do not float majors)

Versions below are F §2g `npm view` observations of 2026-09-27, kept verbatim except where noted.

```json
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-router-dom": "7.x (verify exact via npm view at scaffold; ~7.9.x expected)",
    "three": "0.186.1",
    "@react-three/fiber": "9.8.1",
    "@react-three/drei": "10.7.9",
    "@react-three/postprocessing": "3.1.3",
    "postprocessing": "6.39.5",
    "gsap": "3.15.0",
    "@gsap/react": "2.1.2",
    "lenis": "1.3.26",
    "zustand": "5.0.15",
    "maath": "0.10.8"
  },
  "devDependencies": {
    "vite": "8.3.1",
    "typescript": "~5.9 (verify at scaffold)",
    "@playwright/test": "1.63.0",
    "gltf-transform": "4.x CLI (dev-only, asset pipeline — verify at scaffold)"
  }
}
```

Notes:
- `maath`/`zustand` are OPTIONAL includes (damping helpers / discrete film state). Tree-shaken if
  unused; delete if Phase 4 proves manual `THREE.MathUtils.damp` + mutable ref suffice.
- `lenis@1.3.26` ships the React binding at subpath `lenis/react` (verified in Lenis README this
  session). Default to **plain `lenis` + `useEffect`** (fewer moving parts); `ReactLenis root
  options={{autoRaf:false}}` is the approved alternative — same ticker contract either way.
- No `three-mesh-bvh` (no raycast-heavy interaction planned). No `ScrollSmoother` (Club-only).
  No `ScrollControls` (rejected, F §2c). No marquee package — rails are ~40 lines of GSAP
  (`marquee-loop` skill pattern); do not add `react-fast-marquee` as a dependency (survey §6.9
  is study-only: borrow its `autoFill`/measure-multiplier idea, not the package).
- `vite 8.3.1` is the observed value; the consulted architect suggested 7.x from memory —
  **F's observed 8.3.1 wins** (evidence over recall). Re-verify with `npm view vite version` at scaffold.

---

## 2. Structure, component tree, scene graph, timeline wiring, sync, resize

### 2.1 Folder structure

```
src/
  main.tsx                    # createRoot, RouterProvider, StrictMode
  app/
    router.tsx                # routes (lazy except Home shell); Browser/Hash swap lives here
    providers.tsx             # LenisProvider + GSAP registration + reduced-motion gate
  routes/
    Home.tsx                  # owns #film-pin layout + WhiteTail + rails + footer sections
    Services.tsx              # light DOM (copy: B §3–§4)
    Contact.tsx               # light DOM (new-store info: brief §2)
    Policies.tsx              # refund/privacy/terms (one route, three sections)
    Catalog.tsx               # 22 products reachable, not featured (synthesis §1)
  components/
    dom/
      Header.tsx / Footer.tsx / SkipLinks.tsx
      ChapterOverlay.tsx      # 9 dark-beat captions (one <section> per beat, aria-label)
      Preloader.tsx           # counter 0→100 + curtain (playbook R2)
      WhiteSection.tsx        # practical info tail (20%)
      LogoRails.tsx           # two vertical opposing marquees (E-30 rotated 90°)
      BookingCTA.tsx          # magnetic button; href = brief §6c(3) URL verbatim
      Scrims.tsx              # local contrast scrims behind copy (never full-page blanket)
    canvas/
      FilmCanvas.tsx          # the ONE persistent <Canvas>; Home-only
      CameraRig.tsx           # useFrame: damp toward timeline progress
      CaseRig.tsx             # case.glb + flap pivot group (runtime hinge + tip-lag)
      GlassesRig.tsx          # glasses.glb + L/R temple pivot groups
      SceneStage.tsx          # scene.glb (velvet bed, plinths, dark set) + lights + Environment
      SponsorField.tsx        # instanced alpha planes + streak instances per wave
      LensPortal.tsx          # lens transmission material + bloom/exposure ramp hooks
      Effects.tsx             # <EffectComposer> Bloom+Vignette, beat-gated mount
  motion/
    lenis.ts                  # singleton Lenis + GSAP ticker wiring + destroy
    masterTimeline.ts         # ONE timeline factory: labels, scrub, pin, onUpdate→ref
    progress.ts               # filmProgress mutable ref { p, beat } — sole 3D input
    chapters.ts               # chapter ledger: label→[start,end], camera endpoints, mobile overrides
  store/
    useFilmStore.ts           # zustand: discrete { beat, quality, reducedMotion } — DOM only
  data/
    services.json / lenses.json / insurers.json / brands.json / reviews.json  # B-verbatim copy
  styles/
    tokens.css / film.css / rails.css / white.css
public/
  models/case.glb / glasses.glb / scene.glb
  env/studio_small_2k.ktx2 (or .hdr — pipeline decides, ONE file)
  fonts/fraunces-var.woff2 / inter-var.woff2 (+ subsets)
  web/brands-light/* (8) / web/insurance-light/* (8) / web/eyeq-logo-white.*
  decoders/draco/* (self-hosted, if Draco chosen over meshopt)
```

### 2.2 Component tree — DOM layers vs single persistent Canvas

```
<RouterProvider>
  <LenisProvider>                       # motion/lenis.ts; skipped entirely if reduced-motion
    <SkipLinks/> <Header/>
    <Routes>
      <Route Home>                      # ONLY route that mounts FilmCanvas
        <Preloader/>                    # fixed overlay, counter→curtain, then unmount
        <div id="film-pin">             # pinned 800vh; canvas fixed behind, captions scroll over
          <FilmCanvas/>                 # position:fixed inset-0 z-0, aria-hidden="true"
          <ChapterOverlay ×9/>          # z-10, real <section>/<h2>, carry ALL meaning
        </div>
        <WhiteCurtain/>                 # DOM white overlay div, opacity←timeline tail
        <WhiteSection/>                 # normal flow ~200vh: booking, hours, map, services digest
        <LogoRails/>                    # two vertical opposing marquees, DOM <img>, masked edges
        <Reviews/> <Footer/>
      </Route>
      <Route Services|Contact|Policies|Catalog>  # light DOM, NO Canvas import in chunk
    </Routes>
    <Footer/> (route-shared chrome outside Home film)
```

Rules: canvas is `aria-hidden`, `pointer-events:none` except explicit hotspots (none planned —
all CTAs are DOM). Semantic DOM carries 100% of the information (F §4.14). Canvas mounts only
under `Home`; route change unmounts it with full dispose (see §2.5 cleanup).

### 2.3 Scene graph (inside the single Canvas)

```
<FilmCanvas dpr={tier} frameloop="always" gl={{antialias:true, toneMapping:ACESFilmic, exposure:1.0}}>
  <color attach="background" args={['#050505']} />
  <fogExp2 attach="fog" args={['#050505', 0.028]} />   # density animated per beat (wave dip)
  <SceneStage/>      # scene.glb: velvet bed + set; <Environment files=studio> + key/rim/fill
    <Lightformer form="rect" intensity={4} position={[3,2,-2]} scale={[4,1.2,1]} />  # right strip (dark-field)
    <Lightformer form="rect" intensity={3} position={[-3,1.5,-1]} />                 # left strip
    <Lightformer form="rect" intensity={1.2} color="#7a1420" position={[0,0.5,2]} />  # red-kissed rim
  <CaseRig/>         # case.glb: shell mesh + flapPivot<group> (hinge Empty) + velvet mesh (sheen)
  <GlassesRig/>      # glasses.glb: frontGroup(static) + templeL<pivot> + templeR<pivot>
  <SponsorField wave={1|2}/>  # instancedMesh alpha planes + streakMesh; slots from §2.4 table
  <LensPortal/>      # lens mesh ref: transmission 1 → bloom ramp; portal overlay hook
  <CameraRig/>       # default camera; pos/target/fov/fog/exposure = f(smooth progress)
  <Effects/>         # mounted ONLY during wave1/wave2/approach/entry beats, else null
```

Draw-call budget check: stage(~15) + case(~6) + glasses(~8) + sponsors(2 instanced draws + streaks 1)
+ lights/env(~0 draws) + effects(2–3 passes when mounted) ≈ 35–45 draws film — inside the
desktop 90–160 / mobile 50–90 envelopes (§4) with headroom for logo-relief geometry.

### 2.4 Master timeline — the single source of truth

Pacing weights from brief §5 (10/15/15/15/15/15/7/5/3, dark 80/20) → cumulative progress.
Timeline `duration:100` (arbitrary units), labels at exact boundaries:

| Label | p-range | Weight | Camera / world state (endpoints, mobile override in parens) |
|---|---|---|---|
| `case` | 0–10 | 10 | macro shell, raking key; pos [0,0.35,1.6] tgt [0,0,0] fov 32 (mobile: z 2.1, fov 40) |
| `open` | 10–25 | 15 | flap 0→48° `expo.out` + tip-lag 10%, overshoot settle ~0.3s-equiv; iris `circle()` widen caption |
| `velvet` | 15–25 (overlap) | — | rim ramp 1.2→2.2, sheen light sweep; nap bands via fold geometry + grazing key |
| `emerge` | 25–40 | 15 | folded glasses y −0.05→+0.35, slight rot; fog 0.028→0.022 |
| `unfold` | 40–55 | 15 | temples 92°→0° staggered L then R (+6% progress offset), `power3.out` damping |
| `info` | 55–70 | 15 | slow orbit ±18°, dolly 1.6m→1.1m fov 32→28; 7 Essilor names micro-caps overlay (verbatim B §4) |
| `wave1` | 70–85 | 15 | 8 brand planes z −60→slots on `expo.in→out` blend; FOV 38→46→38; fog dip 0.022→0.012→0.02 |
| `wave2` | 85–92 | 7 | 8 insurer planes, tighter slots, same system, no FOV kick (restraint) |
| `approach` | 92–97 | 5 | dolly to lens centre along lens normal; `chromaticAberration` 0.03→0.06 |
| `entry` | 97–100 | 3 | Bloom 0→1.6 + exposure 1.0→2.2 + `#white-curtain` opacity 0→1; camera near crosses lens plane under cover |
| `white` | DOM | 20% | unpinned normal flow; canvas RAF-gated offscreen (§4) |

Construction (illustrative snippet — pattern, not shipped code):

```ts
// motion/masterTimeline.ts
export function createFilmTimeline() {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },   // constant-velocity dolly segments stay linear;
    scrollTrigger: {              // arrivals get their own expo.out tweens INSIDE segments
      trigger: '#film-pin', start: 'top top', end: '+=800vh',
      scrub: 1.0, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
    },
    onUpdate() { filmProgress.p = tl.progress(); filmProgress.beat = beatAt(tl.progress()); },
  });
  tl.addLabel('case', 0).addLabel('open', 10) /* …etc… */ .addLabel('entry', 97);
  return tl;
}
```

- `scrub:1.0` (inside skill tokens 0.8–1.4; 1.0 chosen — reversibility first). Snap OFF.
- Arrival eases live *inside* segment tweens (`expo.out`/`power4.out`); the timeline spine stays `none`.
- All world state (flap angle, temple angles, emergence y, sponsor z, bloom, fog, exposure, white
  curtain) is a **pure function of `filmProgress.p`** — no velocity state except render damping.

### 2.5 How R3F reads it — refs, never per-frame re-renders

```ts
// motion/progress.ts
export const filmProgress = { p: 0, beat: 'case' };   // mutable ref-object, NOT React state
```

- `masterTimeline.onUpdate` writes `filmProgress.p`. Nothing else writes it.
- `CameraRig`/`CaseRig`/`GlassesRig`/`SponsorField` read it inside `useFrame` and damp toward
  targets (`THREE.MathUtils.damp` or `maath/easing.damp3` — Context7-verified pattern:
  mutate `ref.current.position`, never `setState`). Zustand store holds only discrete values
  (`beat` string for captions/nav, `quality`, `reducedMotion`) and is subscribed with selectors —
  zero per-frame renders. (Verified Context7 pattern: `useFrame(() => ref.current.position.x =
  api.getState().x)`.)
- Reduced-motion: `rig.smooth = rig.target` (no damping), camera snaps to chapter endpoints.
- Cleanup (StrictMode-safe, `@gsap/react useGSAP` + `gsap.context`): on Home unmount —
  `tl.scrollTrigger?.kill(); tl.kill(); lenis.destroy(); useGLTF.clear(); geometries/materials/
  render-targets dispose; cancel RAF`. Canvas remount on route change must not leak GL contexts
  (guard: exactly one `<Canvas>` in the app, Home-only).

### 2.6 Lenis ↔ ScrollTrigger ↔ R3F frameloop sync

Single-ticker wiring (Context7 + Lenis README re-verified this session, canonical 4 lines):

```ts
// motion/lenis.ts
const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, autoRaf: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

- `frameloop="always"` during film chapters (scroll-driven scene never rests mid-film).
- Off-film (white tail, other routes, `document.hidden`): gate RAF — set `frameloop="never"`-equivalent
  via `useFrame` early-return + `gl.render` skip, or unmount Canvas on non-Home routes (chosen:
  unmount). IntersectionObserver on `#film-pin` pauses the loop when the film is offscreen.
- Reduced-motion: **do not create Lenis at all** (`if (matchMedia('(prefers-reduced-motion:
  reduce)').matches) return` + `import 'lenis/dist/lenis.css'` skipped). Lenis itself also defaults
  `respectReducedMotion:true` — belt and suspenders.
- After every async load (fonts, each .glb, logo images): `ScrollTrigger.refresh()`. Pin spacer
  heights authored in CSS first (`#film-pin{height:800vh}` + `100svh` units for mobile URL-bar safety).

### 2.7 Resize handling

- `ResizeObserver` on `#film-pin` wrapper → `camera.aspect`, `renderer.setSize(w,h,false)`,
  `ScrollTrigger.refresh()` (debounced 150ms).
- Camera endpoints carry mobile overrides (table §2.4); select via `gsap.matchMedia`
  (`(max-width:768px)`) at timeline creation, not per frame.
- `useThree(s=>s.viewport)`-derived sponsor slot scales recomputed on resize (slots are functions
  of viewport, not constants).

---

## 3. Asset pipeline

### 3.1 Inputs (from Phase 3 — ARCH does not touch Blender)

| File | Contents | Budget |
|---|---|---|
| `public/models/case.glb` | shell + flap (closed rest pose) + logo relief geometry + velvet bed + hinge Empty | ≤1.2 MB |
| `public/models/glasses.glb` | front group + templeL/R pivot nodes + smoked lenses (transmission) | ≤900 KB |
| `public/models/scene.glb` | dark set, plinths, practicals (no lights baked — geometry only) | ≤2.5 MB total all three |
| `public/env/studio_small_2k.*` | ONE studio HDRI, 2k max (1k if swatch test passes) | ≤1.5 MB |
| `public/web/brands-light/*` (8) + `public/web/insurance-light/*` (8) | single-colour light logo planes (brief §6c(2)) | ≤80 KB each |
| `public/fonts/*.woff2` | Fraunces variable + Inter variable, latin subsets | ≤120 KB total |

Glasses source truth (G): 52.6k tris, no decimation needed; kill the 4.9 MB 4K tortoise map
(dark-material rework drops it) → realistic final <2.5 MB all-in (G §7).

### 3.2 glTF conditioning (Phase 3 export gate, commands for the record)

```bash
# inspect first
gltf-transform inspect public/models/case.glb
# KTX2 textures (color sRGB only; data maps linear), resize hero surfaces to 2k max
gltf-transform uastc   --level 4 --zstd 18  # hero color maps (case/velvet), sRGB
gltf-transform Geoffrey  --level 2            # normal/AO/roughness (linear)
gltf-transform resize --width 2048 --height 2048  # clamp; props/atlas 512–1024
# geometry: meshopt preferred (decoder ~30KB wasm, no CDN); Draco fallback self-hosted
gltf-transform meshopt --level default
# hard rules: position quantization ≥14-bit on logo-relief mesh; +Y up, metres, applied transforms,
# pivot Empties preserved as nodes; round-trip each .glb in clean viewer + useGLTF before choreography
```

Choose **meshopt OR Draco, never stacked**. KTX2 requires `extendLoader` KTX2 wiring in `useGLTF`
(F §2c verified pattern) — self-host decoders under `public/decoders/`, never the gstatic CDN
at runtime.

### 3.3 Logo planes → texture atlas

- 16 logos → **two atlases** (brands 2048×2048, insurers 2048×1024), each cell contain-fit,
  uniform card height, `alphaTest:0.4`, `depthWrite:true` (avoids sort soup, F §4.7).
- Green-RGB-under-transparency quirk (D §7.5: miu-miu/persol palette PNGs) — atlas bake must run
  in an alpha-aware pipeline (premultiplied=false, verify no green fringe at 400% zoom).
- Sponsor planes sample atlas UVs; DOM rails use individual files (a11y `<img alt>` + links preserved).

### 3.4 Preloading + preloader progress

- `useGLTF.preload('/models/case.glb')` etc. + `drei/Preload` + `useProgress` → drives
  `Preloader` counter 0→100 (playbook R2: counter 1.4s `power2.inOut` → curtain
  `clip-path:inset(0 0 100% 0)` 1.0s `power4.inOut`).
- Progress by **required asset weight** (bytes loaded / total), never a fake timer.
- Hero readable ≤1.8s: first-frame = case.glb + env only; glasses.glb + atlases stream after
  (nested `<Suspense>` staged loading, F §6.2 split rationale).
- WebGL/model/texture failure → per-chapter `onError` → poster still + full DOM chapter remains;
  console-clean required.

### 3.5 Fonts (self-hosted woff2 subsets)

- Fraunces variable (display, optical sizes — E pairing 1) + Inter variable (UI, also matches live site).
- Google Fonts source, `pyftsubset` latin-only; `preload` Fraunces-600 only; `font-display:swap`.
- LCP element is DOM H1 (Fraunces, never `opacity:0`, no JS-split on LCP line) — Canvas fades
  `opacity:0→1` after first frame so it never blocks LCP.

---

## 4. Performance tiers

| Dimension | Desktop-high | Laptop (default) | Mobile | Reduced-motion |
|---|---|---|---|---|
| DPR cap | ≤2.0 | ≤1.5 | ≤1.25 (max 1.5) | 1 |
| Visible tris | 350k max | 250k | 150–300k | same as device tier, static |
| Draw calls | ≤90 | ≤70 | 50–90 | same, no loop |
| Shadows | 2 lights, 1024 | 1 key, 1024 | 1 key, 1024 or off | off |
| Post | Bloom+Vignette, portal/wave beats only | same, half-res bloom | NONE (opacity crossfades) | NONE |
| Lens | native `MeshPhysicalMaterial` transmission | same | opacity crossfade fallback | hard cut, dimmed white |
| Transmission res | `transmissionResolutionScale 1.0` | 0.5 | n/a | n/a |
| Frameloop | always (film) | always (film) | always film / gated offscreen | demand / static |
| Textures | 2k hero max | 2k hero | 1k hero, 512 atlas cells | same as mobile |
| `MeshTransmissionMaterial` | allowed (portal pulse only) | allowed | FORBIDDEN (cost) | forbidden |

- **Frame-time targets:** steady ≤16.7ms ideal, ≤25ms fallback; scrub jitter <3 dropped frames/sec;
  governor (`drei/PerformanceMonitor`, opened in survey listing) lowers DPR → kills post → kills
  shadows, in that order, before touching landmarks.
- **Offscreen pause:** `IntersectionObserver` on `#film-pin` + `document.hidden` listener → skip
  `gl.render`, pause marquees (`animation-play-state:paused`), kill GSAP tickers for unmounted beats.
  Prove `offscreenRunningCount:0` in browser profile (skill 9 protocol), never screenshots alone.
- **Transfer budgets:** critical initial 3–6 MB mobile / 5–10 MB desktop; route JS ≤~350 KB gz
  (playbook gate; Home ≤650 KB total incl. Canvas chunk — Canvas chunk lazy via
  `React.lazy(()=>import('./canvas/FilmCanvas'))` pre-mounted 400px before viewport).
- Tier select: `matchMedia('(max-width:768px)')` + `deviceMemory`/`hardwareConcurrency` heuristics +
  live `PerformanceMonitor` downgrade; manual override query param `?tier=low` for QA.

---

## 5. QA harness

### 5.1 Playwright beat-capture script (`scripts/qa/beats.spec.ts`)

Beat ↔ progress map (from §2.4 cumulative ranges; midpoints + boundaries = 12 stops):

```ts
const STOPS = [
  ['00-preloader', null],        // load, capture during counter
  ['01-case',      0.05],
  ['02-open',      0.17],
  ['03-velvet',    0.24],
  ['04-emerge',    0.32],
  ['05-unfold',    0.47],
  ['06-info',      0.62],
  ['07-wave1',     0.77],
  ['08-wave2',     0.885],
  ['09-approach',  0.945],
  ['10-entry',     0.985],
  ['11-white',     null],        // scroll past pin into white tail
  ['12-rails',     null],        // logo rails section
];
```

Mechanism: for progress stops, `page.evaluate(p => filmProgressDebug.set(p))` — expose a
**dev-only** `window.__film.setProgress(p)` (writes the same ref the timeline writes; asserts
pure-function-of-progress by construction) then `waitForTimeout(600)` (damping settle) +
screenshot. For DOM stops, `scrollIntoView` + settle. Matrix: **1440×900 + 390×844** (768×1024
for camera-endpoint chapter checks per skill 3 QA), output `docs/phase4/qa/<beat>-<viewport>.png`.
Also capture: reverse-scroll pass (set 0.77→0.32, assert no pops), `reload-at-depth` (goto with
scroll restoration mid-film), `?tier=low`, and `prefers-reduced-motion:reduce` emulation
(assert: no Lenis, static chapters, all copy present, canvas poster/static).

Critics review `docs/phase4/qa/` images per beat — that folder is the review contract.

### 5.2 Lighthouse budget (`lighthouserc` or CI assert)

| Metric | Budget |
|---|---|
| LCP (mobile, white-tail H1 path) | <2.5 s |
| CLS | <0.05 |
| TBT | <300 ms |
| Route JS (gz) | <~350 KB |
| Accessibility | 100 (headings order, focus, contrast ≥4.5:1 over brightest frame) |
| Best practices | 100 (no CDN decoders, self-hosted fonts, https booking link as-is http URL preserved verbatim — do not "fix" to https; B-verified destination) |

Note: booking URL is `http://` (B §2) — preserve exactly; mixed-content warning is the vendor's,
not ours to rewrite.

---

## 6. GitHub reference survey (all actually opened this session)

| # | Repo / file opened | Stars / license / freshness | Borrow (exact file path) | Avoid |
|---|---|---|---|---|
| 1 | `pmndrs/drei` — `src/core/MeshTransmissionMaterial.tsx` (full source read) | pmndrs org, MIT, maintained (file present on main 2026-09-27) | Props contract for lens portal: `transmission`, `thickness`, `roughness`, `chromaticAberration` (0.03), `anisotropicBlur` (0.1), `distortion/distortionScale`, `samples` (6), `resolution/backsideResolution`, `backside` flag. Key impl detail: keep three `transmission:0` + internal `_transmission` unless `transmissionSampler` (avoids three's extra transmission pass); `time` uniform drives `temporalDistortion`. | Do NOT use for the whole film — portal pulse only; fullscreen `resolution` default is the mobile perf cliff. Prefer native `MeshPhysicalMaterial` transmission for the lens rest state. |
| 2 | `pmndrs/drei` — `src/core/Lightformer.tsx` (full source read) | same as above | Dark-field rig recipe: `form="rect"`, `intensity` (multiplies color), `toneMapped={false}`, `target` lookAt, `DoubleSide` basic material; animatable with scroll by mutating `intensity`/position from progress. This is the §6b strip-light solution in code. | Don't use its `light` prop (spawns real pointLights per panel) — panels feed the env map; keep real lights to the §4 shadow budget. |
| 3 | `pmndrs/drei` — `src/core/` listing (confirms `Environment.tsx`, `useEnvironment.tsx`, `PerformanceMonitor.tsx`, `Detailed.tsx`, `Preload.tsx`, `Gltf.tsx`) | same as above | `Environment` with `files` (single studio HDRI) + `Lightformer` children = the studio; `PerformanceMonitor onIncline/onDecline` = the §4 governor; `Detailed distances=[0,10,20]` = logo-relief LOD fallback; `Preload` + `useProgress` = preloader data source. | `ScrollControls` (same package) — owns its own scroll container, fights Lenis (F §2c). `useAnimations` clips for flap/temples — runtime pivots instead (reversibility). |
| 4 | `pmndrs/react-three-fiber` — `docs/advanced/scaling-performance.mdx` (full read) | pmndrs org, MIT, maintained | `frameloop="demand"` + `invalidate()` pattern for white-tail/offscreen gating; `performance={{min:0.5}}` + `regress()` movement regression during scrub (drop pixel ratio while scrolling, restore at rest); zustand-`getState()`-in-`useFrame` (no per-frame renders). | `frameloop="demand"` as the film default — the film never rests mid-pin; demand is for tail/routes/fallback only. |
| 5 | `darkroomengineering/lenis` — `README.md` (full read) | MIT © darkroom.engineering; v1.3.26 | Canonical 4-line GSAP wiring (§2.6); `lerp:0.09–0.1`; `anchors:true` for booking/contact anchors; `respectReducedMotion:true` default (keep!); `lenis/react` `ReactLenis root autoRaf:false` alternative; Plugins section blesses `r3f-scroll-rig` interop. | `smoothWheel` custom easing experiments; `syncTouch:true` (unstable iOS<16); CSS scroll-snap (unsupported — use lenis/snap only if needed, not planned). |
| 6 | `14islands/r3f-scroll-rig` — `src/` listing | 978★, maintained (updated 2026-09-25), 14islands agency | Scroll-sync architecture study: shared store + renderer-api split (`src/store.ts`, `src/renderer-api.ts`, `src/hooks/`) — the cleanest prior art for DOM↔R3F progress sharing; Lenis-blessed plugin. | Do NOT adopt the package (we own one timeline + one ref; a second sync layer = second conductor). Study `store.ts` shape only. |
| 7 | `pmndrs/react-postprocessing` — `README.md` (full read) | pmndrs org, MIT, maintained | `<EffectComposer><DepthOfField/><Bloom luminanceThreshold luminanceSmoothing height/><Noise/><Vignette eskil offset darkness/></EffectComposer>` — single-triangle fullscreen passes, WebGL2 MSAA default. Borrow the exact chain for portal beats; `height/width` downscale = the perf lever. | `DepthOfField` default ON (unverified prop cost + focus risk — F §2d; default OFF, verify from installed `postprocessing@6.39.5` types before any use). No motion-blur effect exists — streaks must be authored geometry. |
| 8 | `mrdoob/three.js` — `examples/webgl_materials_physical_transmission.html` (full read) | three.js org, MIT, maintained | Canonical glass: `transmission:1, roughness:0–0.15, ior:1.5, thickness:0.01–0.05, specularIntensity:1, DoubleSide, transparent:true` + ACES + HDR equirect env + `renderer.transmissionResolutionScale`. These become the lens starting values (§2.4 approach targets). | Copying the demo's `SphereGeometry` staging — ours is a thin lens slab (G I6: thin to ~2mm) with real env, not a hero sphere. |
| 9 | `justin-chu/react-fast-marquee` — `src/components/Marquee.tsx` (full read) | 1516★, maintained (updated 2026-09-18) | Measurement pattern: `ResizeObserver` → `containerWidth/marqueeWidth` → `multiplier` copies + `duration = width/speed` (px/sec!); `direction:"up"/"down"` supported (rotation approach documented in code); `play`/`pauseOnHover` props; `onMount` recalc hook (= our `ScrollTrigger.refresh()` call-site). | The package itself (we hand-roll ~40 lines per `marquee-loop` skill: duplicated track, linear `0→-50%`, edge masks). Their up/down uses rotate transforms — ours uses native vertical `translateY` loop to keep text crisp. |
| 10 | `DavidHDev/react-bits` — `Hyperspeed` (`src/ts-default/Backgrounds/Hyperspeed/Hyperspeed.tsx` + presets via `search_code`, full shader source read) | maintained, MIT-style bits library | Warp-technique study: instanced streak geometry (`InstancedBufferGeometry` + per-instance `aOffset/aMetrics/aColor`), FOV kick on speed-up (`fov`→`fovSpeedUp` lerped), fog uniforms shared across materials, `uTravelLength`-parameterised travel, bloom pass over streaks. This validates our F §4.7 recipe (instanced streaks + FOV 38→46 + fog dip) as buildable without a motion-blur pass. | The whole component (road/highway metaphor, click-hold interaction, its own RAF loop + EffectComposer) — nothing mounts as-is; extract streak-instancing + FOV-lerp math only, driven by our timeline progress, warm-white palette (no neon cars, no Star Wars read). |
| 11 | `pmndrs/react-three-next` — `README.md` (full read) | pmndrs-adjacent starter, maintained | `tunnel-rat` `<View/>` pattern: canvas NOT unmounted across routes, 3D usable in any div, `gl.scissor` viewports — the reference if router+Canvas persistence ever becomes necessary; TTL/JS/Lighthouse discipline (79KB first load, score 100) as a budget attitude reference. | The starter itself (Next.js — rejected §1). Our rule is simpler: Canvas lives on Home only, full dispose on leave. Adopt `<View/>` only if a future route needs in-page 3D. |

Page transitions (Vite/React): no dedicated transitions repo survived the "actually opened" bar —
`react-three-next` (above) covers canvas-persistent routing; DOM transitions use the web platform
`document.startViewTransition` + GSAP curtain overlay (playbook §2 gate), owned by the MOTION lane.
Recorded honestly rather than padding the list.

---

## 7. Build order — Phase 4 steps 1–18, dependencies, parallel lanes

Step numbering reconstructed from brief §5 beats + white tail + site obligations (coordinator:
reconcile with SITE/IA lane's numbering; dependencies below are the binding part).

```
1  scaffold (vite+router+TS+lint+folders §2.1, pinned versions §1)
   └── blocks everything. Owner: A. 1 agent, 0.5 day.
2  tokens+fonts+base CSS (tokens.css, Fraunces/Inter subsets, scrims, 100svh pin shell)
   └── needs 1. Owner: A. Parallel with 3 after 1 lands.
3  motion core: lenis.ts + progress.ts + chapters.ts + useFilmStore + masterTimeline skeleton
   (labels only, no beat content) + Preloader shell
   └── needs 1. THE critical path — blocks 4–11. Owner: B. Contract: §2.4 label table is frozen here.
4  FilmCanvas + CameraRig (box-stand-in scene, full progress→camera path, all 12 QA stops green
   on boxes) + Effects mount-gating + resize + tier switch
   └── needs 3. Owner: B. Proves the conductor before any .glb arrives.
5  CaseRig (case.glb wiring, flap pivot, velvet sheen verify vs E recipe)
   └── needs 4 + Phase3 case.glb. Owner: C. Files: canvas/CaseRig.tsx only.
6  GlassesRig (glasses.glb, L/R pivots, fold→open, smoked-lens transmission)
   └── needs 4 + Phase3 glasses.glb. Owner: C (same owner as 5 — pivot discipline shared).
     PARALLEL with 5 once 4 lands (different files, shared contract: pivot Empty names).
7  SceneStage (scene.glb, Environment+Lightformers, fog/exposure per beat)
   └── needs 4 + Phase3 scene.glb. Owner: D. PARALLEL with 5/6.
8  SponsorField (atlas planes + streaks + slots wave1/wave2, FOV/fog choreography)
   └── needs 4 + atlas (§3.3). Owner: D. PARALLEL with 5/6/7 (owns SponsorField.tsx + atlas script).
9  LensPortal + white curtain handoff (transmission ramp, bloom/exposure, overlay 0→1, RAF gate)
   └── needs 4,6,7. Owner: B. Beats approach/entry/white.
10 ChapterOverlay copy wiring (B-verbatim data/*.json → 9 sections, masked reveals per MOTION lane)
   └── needs 3 (labels) only. Owner: E. PARALLEL with 4–9 from step 3 onward (owns dom/ + data/).
11 WhiteSection (booking CTA, hours, map, services digest, policies links) + Footer + Header
   └── needs 1. Owner: E. PARALLEL with everything (owns WhiteSection.tsx, Header, Footer).
12 LogoRails (two vertical marquees, masks, reduced-motion static, IO pause)
   └── needs 1 + light logo files. Owner: E. PARALLEL (owns LogoRails.tsx + rails.css).
13 Routes: Services/Contact/Policies/Catalog (light DOM, lazy chunks, no Canvas import)
   └── needs 1,11. Owner: F. PARALLEL from step 11.
14 QA harness (scripts/qa/beats.spec.ts, 12 stops × 2 viewports, reduced-motion + tier=low passes)
   └── needs 4 (stops exist on boxes from step 4!). Owner: B. Runs continuously after 4.
15 Perf pass (budgets §4, PerformanceMonitor governor, KTX2/Draco verify, transfer weigh-in)
   └── needs 5–8. Owner: D + B.
16 A11y/reduced-motion pass (static chapters, focus order, contrast at brightest frame, no-Lenis branch)
   └── needs 10–13. Owner: E + F.
17 Preloader→hero tuning (counter weight, curtain, LCP ≤2.5s, hero ≤1.8s readable)
   └── needs 4,14. Owner: B.
18 Final verification (iterate-until-verified gates: 3 viewports × forward/back/flick/reload-at-depth/
   resize, console-clean, Lighthouse budgets §5.2, docs/phase4/qa/ complete)
   └── needs everything. Single integrator (B or coordinator).
```

File-ownership (parallel builders never touch another lane's files without contract change):
- A: scaffold, styles/tokens, fonts. B: motion/*, FilmCanvas, CameraRig, Effects, LensPortal, scripts/qa/*.
  C: CaseRig, GlassesRig. D: SceneStage, SponsorField, asset-conditioning scripts.
  E: components/dom/*, data/*.json. F: routes/Services|Contact|Policies|Catalog.
- Shared contracts (change only via coordinator): §2.4 label/progress table, `#film-pin` 800vh shell,
  `filmProgress` shape, pivot Empty names from Phase 3, B-verbatim copy (never edited for style).

Critical path: 1 → 3 → 4 → (5,6,7,8 parallel) → 9 → 15 → 18. DOM track (10–13,16) runs fully
parallel from step 3/1. First QA signal at step 4 (boxes on all 12 stops) — no waiting for .glbs.

---

*Copy discipline: every string in data/*.json quoted from B §2–§11 or brief §2 new-store info;
anything needed-but-missing marked `[COPY NEEDED]` (known gaps: booking location-code currency
Burlington→Brampton per synthesis §7, Gucci has no logo asset per D §7.9). No business content
invented in this plan.*

# A11Y + Reduced-Motion + Perf — Static Audit (Phase 4 Helper)

Scope: static source read only (no running server). Stack: Vite 8 + React 19 + react-router-dom 7 (`package.json`, `src/main.tsx:1-20`, `src/app/router.tsx:15-24`). No Tailwind/Next.
Client rule `docs/00-BRIEF.md` §6d applies: nothing not on the live site. DRAFT copy (`src/data/index.ts:59-60`, `SHOW_DRAFT_COPY=false`) and `src/__dev__/` harnesses are NOT live content and are excluded except where noted. Navigation = HOME · SERVICES · CONTACT + Book-an-exam CTA + footer policy links.

Method: 4 parallel read-only subagents (semantics/keyboard, reduced-motion, contrast with computed ratios, perf/Canvas/assets). Findings below are factual with `file:line`.

---

## P0 (must fix before launch — blocks a11y/perf)

### P0-1. Canvas (three/fiber/drei) is statically imported — will enter initial bundle once wired
- `src/components/canvas/FilmCanvas.tsx:10` — `import { Canvas } from '@react-three/fiber'` top-level static. Zero `React.lazy` / `import()` / `dynamic(` hits in `src/`.
- `Suspense` is only *inner* (`FilmCanvas.tsx:92`, `src/canvas/CaseRig.tsx:97`, `src/canvas/GlassesRig.tsx:221`, `src/canvas/SponsorField.tsx:76`), not a lazy boundary for Canvas itself.
- `src/app/router.tsx:1-6` — all routes statically imported; comment `:11-12` admits code-splitting is deferred to Lane F step-13.
- Today `src/routes/Home.tsx:1-24` imports zero Canvas (placeholder `#film-pin`), so the bundle is accidentally light — but wiring the film as-is ships three/fiber/drei on first paint.
- **Fix:** `React.lazy(() => import('…/FilmCanvas'))` + route-level `lazy()` in `router.tsx`, Canvas behind `IntersectionObserver`/scroll-proximity boundary; keep inner `<Suspense fallback={null}>`. Verify with `vite build --mode production` bundle report.

### P0-2. Raw 9.6 MB `case.glb` ships and is tried FIRST
- `public/models/case.glb` 10,021,468 B (9.6 MB) alongside `case.opt.glb` 1,467,872 B (1.4 MB); `public/` total 16 MB, `public/models` 13 MB.
- `src/canvas/rigs/modelLoader.ts:35-36` — `CASE_URLS=['/models/case.glb','/models/case.opt.glb']` tries raw first.
- **Fix:** swap order to try `case.opt.glb` first (or remove raw `case.glb` from `public/` if unneeded); preload only the optimized URL. Keep `glasses.opt.glb` (394,236 B) as the glasses URL for the same reason.

### P0-3. `h1→h3` skip on Services; two `h1`s on TokensQA; Home scaffold has zero headings
- `src/routes/Services.tsx:81` `h1` "Services" → `:100` `h3` service blocks (and `:28` `h3` lens slides) before first `h2` (`:114`, `:125`) — skipped level.
- `src/routes/TokensQA.tsx:90,98` — two `h1`s (Void + Paper swatches). Dev/QA route, but fix or `noindex`/remove before launch.
- `src/routes/Home.tsx:9,17` — scaffold shell, zero headings; homepage `h1` lives in `src/components/dom/WhiteSection.tsx:31` ("FROM EYE EXAMS…") so final composition must render exactly one `h1`.
- **Fix:** Services: demote block titles to `h2` (lenses/insurance stay `h2`, children `h3`); TokensQA: one `h1` + `h2` per swatch; Home: assert single `h1` when film + white act compose.

### P0-4. Text over live canvas without scrim: pre-scroll header + skip-film link
- Header `--dark` pre-scroll (`src/components/dom/lane-e.css:114-116`, `src/components/dom/Header.tsx:85`): bone 13–14 px text + logo directly on live WebGL (transparent bg); veil `rgba(5,6,7,.55)+blur(20px)` only after `is-scrolled--dark` (`lane-e.css:126-131`, 120 px threshold).
- Skip-film `bone-dim` 12 px (`lane-e.css:211-230`, `Header.tsx:125`): `background:none`, underline only, over uncontrolled backdrop.
- **Fix:** give pre-scroll header the same `.55` veil (or render light-theme header sooner); add scrim/backdrop to skip-film link. Chapter copy already has a 120 px gradient scrim (`lane-e.css:367-374`, `src/components/dom/Scrims.tsx:4-6`) — acceptable pattern to copy.

### P0-5. No focus trap / background not inert when menu open
- `src/components/dom/Header.tsx:28-68,104-187`: trigger + close are native `<button>`s (`:104`, `:142`), `aria-expanded` (`:108`) + `aria-controls` (`:109`), `role="dialog" aria-modal="true"` (`:134-140`), Escape closes + returns focus (`:56-61`), closed links removed via `tabIndex` (`:151,160-164,171-174,183`). Good.
- Missing: Tab containment — background (brand `:87`, book `:96`, skip-film `:123`) stays tabbable; overlay stays mounted with opacity/scale/pointer-events (`lane-e.css:243-260`).
- **Fix:** trap Tab inside overlay while open + `inert` (or `aria-hidden` + negative tabindex) on background; trigger should toggle (currently only opens, `:110`).

---

## P1 (should fix — contrast edges, motion gaps, perf tuning)

### P1-1. Rail frame numbers at 60% opacity FAIL 4.5:1 (normal 10 px text)
- `src/components/dom/lane-e.css:736-746`: bone-dim 60% → effective `#787366` on Void `#050607` = **4.29:1 FAIL** (pass 3:1); lamp 60% hero variant → `#84652A` = **3.74:1 FAIL**.
- Static-grid `figcaption` at 85% (`:840`) = 7.87:1 PASS — only animated-rail 60% variants fail.
- **Fix:** bump rail nums to ≥85% opacity and/or ≥12 px.

### P1-2. Lamp-amber `#D9A441` on Paper ≈ 2.0:1 — active dot has no non-color cue
- `src/routes/parts/route.css:347` slide-dot `[aria-current]`, `src/components/dom/lane-e.css:483` CTA-paper arrow, header-light book arrow. On Void 9.0:1 / Ink 8.2:1 PASS; on Paper 2.0:1 FAIL (3:1 UI).
- **Fix:** darken active-dot/arrow on light bg (ink or deep bronze) or add shape/size cue besides color.

### P1-3. `useFrame` loops with NO reduced-motion branch (bob/hover/flight persist under RM)
- Present/centralized RM: `src/motion/lenis.ts:17-19`, `src/store/useFilmStore.ts:16,21,29,34`, `src/app/providers.tsx:15-16` + `src/motion/tiers.ts:40`; local `LogoRails.tsx:21-32`, `Sections.tsx:36,65`, `BookingCTA.tsx:24`. CSS kill-switches `src/styles/tokens.css:162-169`, `lane-e.css:1357-1374`, `route.css:820-828`. Lenis (`lenis.ts:41,46-61`), master timeline (`masterTimeline.ts:34-37`), CameraRig (`CameraRig.tsx:36-42`), LensPortal veil (`LensPortal.tsx:107,111,116`), rails static fallback (`LogoRails.tsx:322-330,359-366`), reveals (`Sections.tsx:40-52,71-83`), CTA (`BookingCTA.tsx:24`) all branch correctly.
- NO branch: `SceneStage.tsx:100-106` (key/velvet/grazing/sweepX), `SponsorField.tsx:181-226` (+`hoverOffset` `src/canvas/stage/slots.ts:265-266`, `streaksEnabled:99` checks coarse-pointer only), `CaseRig.tsx:68-85`, `GlassesRig.tsx:156-174` (`glassesHover` ±1.5 mm @ 0.4 Hz, `:164`), `FilmCanvas.tsx:30-40,48-55`, `Effects/BloomDriver` (`Effects.tsx:50-51` indirect via tier only; `BloomDriver:24-40` no direct check), lens-disc ramp (`LensPortal.tsx:40-62`, indirect via `tiers.ts:40` only).
- **Fix:** gate each `useFrame` on `reducedMotion` (freeze at `q`/`p` end-state, skip `hoverOffset`/bob/streaks); add RM check to `BloomDriver`; wire `ChapterOverlay.tsx:81-99` `mode="stacked"` to auto-activate under RM (currently manual toggle `src/__dev__/E/main.tsx:73,81` only).

### P1-4. `BottomScrim` exported but never wired; video play veil thin
- `src/components/dom/Scrims.tsx:8-20` 40% mobile scrim exported (`index.ts:6`), zero production imports.
- About `PLAY VIDEO` paper 14 px (`lane-e.css:980-994`, `Sections.tsx:117-124`) over poster/first frame with flat `rgba(5,6,7,.35)`, no blur — likely <4.5:1 over bright footage.
- **Fix:** wire-or-remove `BottomScrim`; raise video veil to `.55` + blur to match film scrim.

### P1-5. Files > 300 KB (6) + 1.4 MB HDRI on critical path
| path | size |
|---|---|
| `public/models/case.glb` | 9.6 MB |
| `public/env/studio_small_08_1k.hdr` | 1.4 MB |
| `public/models/case.opt.glb` | 1.4 MB |
| `public/models/glasses.glb` | 1.3 MB |
| `public/web/atlas-brands.png` | 488 KB |
| `public/models/glasses.opt.glb` | 385 KB |
- `src/canvas/SceneStage.tsx:119` loads the 1.4 MB HDRI via `<Environment files="/env/studio_small_08_1k.hdr" resolution={256} frames={Infinity}>`.
- **Fix:** compress/shrink HDRI (or lower `resolution`, single `frame`), split `atlas-brands.png`, serve `.opt.glb` only; preload`<link>` only for LCP asset.

### P1-6. DPR caps present — confirm they stay; no manual `setPixelRatio` drift
- `src/motion/tiers.ts:22-26`: high [1,2] / laptop [1,1.5] / mobile [1,1.25] / low 1 / rm 1; default desktop = laptop cap 1.5 (`:37-43`), high only via `?tier=high`. `FilmCanvas.tsx:80` `dpr={spec.dpr}` + `frameloop` gating (`:81`), IO + `visibilitychange` + veil-full gating (`:28-57`). Zero manual `gl.setPixelRatio`/`devicePixelRatio` in prod. Dev harnesses cap independently (`__dev__/C/main.tsx:197`, `__dev__/D/main.tsx:181`).
- **Fix:** no change; keep default ≤1.5, RM/mobile ≤1.25/1.

### P1-7. Images: plain `<img>`, partial lazy, zero srcset/decoding/fetchpriority
- Lazy present: `LogoRails.tsx:38,200,217,233`, `Services.tsx:129`, `Contact.tsx:64`, iframe `StoreBits.tsx:49`. Missing (correctly eager, but untuned): `Header.tsx:88-93` (has `width={800} height={373}`, file `public/web/eyeq-logo-header-original.png` 81.7 KB), `WhiteSection.tsx:24-30`, `chrome.tsx:18-22,:60` (no dims). Zero `decoding` / `fetchPriority` / `srcset`/`sizes` hits in `src/`.
- **Fix:** `decoding="async"` everywhere, `fetchpriority="high"` on LCP logo, explicit dims on `chrome.tsx` logos, `srcset` for atlas/brand PNGs.

### P1-8. Fonts 217 KB vs §5 120 KB budget note; video/map already click-to-play (good)
- `tokens.css:62,69,76` all `@font-face` `font-display:swap`; `index.html:7` preloads only `fraunces-var.woff2` (65.8 KB); italic (79.8 KB) + Inter (71.3 KB) not preloaded. Self-recorded total 216.9 KB (`tokens.css:52-57`).
- Video click-to-play, no autoplay/preload (`Sections.tsx:126-134`, remote Shopify CDN `chapters.json:59`); map click-to-activate + `loading="lazy"` (`StoreBits.tsx:40-52`).
- **Fix:** subset/trim fonts toward budget or accept overage explicitly; keep video/map as-is.

---

## Passing (no action)

- Landmarks: `Services.tsx:78-79,139`, `Contact.tsx:26-27,95`, `Policies.tsx:31-32,68` each have `RouteHeader` (`chrome.tsx:12` header + `:24` nav Primary) + single `main#f-content` + `RouteFooter` (`chrome.tsx:57` footer + `:77` nav Terms). No duplicate `main`. (`Home.tsx` shell defers header/footer to Lane E `Header.tsx:84` / `Footer.tsx:26` — P0-3 covers composition.)
- Headings `h2>h3` correct: `Sections.tsx:87,184,219`; `Policies.tsx:34→57→parts/policies-data.ts:73,102,113`; WhiteSection single `h1`.
- Alt: EyeQ `Header.tsx:88-93` (`alt=""` + link `aria-label`, acceptable), `WhiteSection.tsx:24-30`, `chrome.tsx:18-22` good; brand/insurer desktop+grid `LogoRails.tsx:38,217,233` + `Services.tsx:129` good. Mobile marquee `LogoRails.tsx:200` uses `alt=""` ×16 but `RailsSrLists` (`:269-284`) restores names in pair layout — extend to `RailsMobileStrip` (`:359-375`) when touching rails.
- Skip links present: `Home.tsx:10`, `SkipLinks.tsx:36-41`, `chrome.tsx:13-15`; reveals `lane-e.css:93`, `route.css:36-38`.
- Focus: global `:focus-visible` 2 px lamp-amber (`tokens.css:149-152`); no Tailwind (none in repo).
- No `div onClick`, no production forms (hits only `src/__dev__/*`; `Contact.tsx:2-3` "No form"); map/iframe buttons labelled (`Contact.tsx:69-74`, `StoreBits.tsx:54-59`, titles `Contact.tsx:62`, `StoreBits.tsx:47`).
- Contrast PASS table: bone `#E9E2D3` 15.7/15.2/14.3:1; bone-dim `#C5BCA6` 10.7/10.4:1; paper `#F5F1E8` 18.0/17.4/16.3:1; ink `#131417` 16.3/18.4:1; ink-body `#2A2B2E` 12.6/14.2:1; ink-muted `#5E5B54` 6.0/6.8:1 (smallest margin, passes). `muted-on-dark #8F97A3`, `bed #ECE6D6` defined-but-unused — leave alone. DRAFT 9 px tag (`lane-e.css:30-43`) gated off live — no action unless previews ship.

---

## Ranked fix order for builders

1. P0-1 lazy-split Canvas + routes. 2. P0-2 serve `.opt.glb` first. 3. P0-3 heading levels. 4. P0-4 header/skip-film scrim. 5. P0-5 menu trap + inert. 6. P1-1 rail nums. 7. P1-2 amber-on-paper cue. 8. P1-3 gate `useFrame` loops + auto-stacked chapters. 9. P1-4 scrims. 10. P1-5 HDRI/atlas diet. 11. P1-7 image attrs. 12. P1-8 font budget sign-off.

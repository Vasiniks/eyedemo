# Lane ownership — EyeQ Vision Care Phase 4 (PLAN-MASTER §12, strict)

Only edit files your lane owns. Need a change in another lane's file or a
shared contract? Write it to `docs/phase4/requests/<your-lane>-<topic>.md`
and work around it — never edit it yourself.

Shared contracts (coordinator-only changes): §6 label/progress table,
`#film-pin` 800vh/560vh shell, `filmProgress` shape, Phase-3 node names (§5),
B-verbatim copy, tokens §2.

## Lane A — scaffold / tokens / fonts (steps 1–2) — BLOCKS ALL LANES
- `package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`,
  `playwright.config.ts`, `index.html`, `.gitignore`
- `src/main.tsx`, `src/app/*`, `src/tokens.ts`
- `src/styles/*` (tokens.css + film/rails/white shells)
- `src/routes/TokensQA.tsx` (acceptance artifact; remove pre-launch)
- `src/routes/Home|Services|Contact|Policies|Catalog.tsx` — mount-point
  shells only; content belongs to E (Home) / F (rest)
- `public/fonts/*`, `public/web/*` (copies of approved assets; never edit pixels),
  `public/_redirects`, `dist/404.html` (via postbuild)
- Empty lane dirs created as scaffold (components/dom, components/canvas,
  motion, store, data, scripts/qa) — structure only, no files inside.
- Pinned §7.1 (installed, verified): vite 8.3.1, react 19.3.0,
  react-router-dom 7.18.4 (latest 7.x at scaffold), three 0.186.1,
  @react-three/fiber 9.8.1, @react-three/drei 10.7.9,
  @react-three/postprocessing 3.1.3, postprocessing 6.39.5, gsap 3.15.0,
  @gsap/react 2.1.2, lenis 1.3.26, zustand 5.0.15, maath 0.10.8,
  typescript 5.9.2, @playwright/test 1.63.0, @gltf-transform/cli 4.5.0.
- Deviations from §7.1 recall (resolved at install, kept majors pinned):
  @vitejs/plugin-react 5.1.2 → 6.1.1 (5.x peer-blocks vite 8);
  @types/three 0.186.1 → 0.186.0 (0.186.1 unpublished);
  @types/react(-dom) → 19.3.0 (19.3.3 unpublished).
- Fonts (public/fonts, latin subsets, swap): fraunces-var 65.8K +
  fraunces-italic-var 79.8K + inter-var 71.3K = 216.9K total — §5 120K budget
  exceeded; 3 variable files replace ~9 static instances. Google serves
  opsz+wght axes only (no SOFT/WONK); declared SOFT 50/WONK 1 in CSS apply
  if a fuller file lands later. All contain ® ™ – · (verified via fontTools).

## Lane B — conductor / camera / portal / QA (steps 3–4, 9, 14, 17–18)
- `src/motion/*` (lenis.ts, progress.ts, chapters.ts, masterTimeline.ts),
  `src/store/useFilmStore.ts`
- `src/canvas/FilmCanvas.tsx`, `CameraRig.tsx`, `Effects.tsx`, `LensPortal.tsx`
- `src/components/dom/Preloader.tsx`, `scripts/qa/*`
- Owns `#film-pin` shell dimensions + `Providers` Lenis/GSAP wiring.

## Lane C — hero objects (steps 5–6)
- `src/canvas/CaseRig.tsx`, `src/canvas/GlassesRig.tsx`

## Lane D — stage / waves / perf (steps 7–8, 15)
- `src/canvas/SceneStage.tsx`, `src/canvas/SponsorField.tsx`
- Asset-conditioning scripts, `public/env/*`, `public/decoders/*`
- NOTE: `public/web/atlas-brands.*` + `atlas-insurers.*` already present —
  left untouched (presumed Lane D / Phase 3 output).

## Lane E — DOM / copy (steps 10–12, 16)
- `src/components/dom/*` (Header, Footer, SkipLinks, ChapterOverlay,
  WhiteSection, LogoRails, BookingCTA, Scrims)
- `src/data/*.json` (services, lenses, insurers, brands, reviews — B-verbatim)
- `src/styles/film.css`, `rails.css`, `white.css` content (A created shells)

## Lane F — routes (step 13)
- `src/routes/Services.tsx`, `Contact.tsx`, `Policies.tsx`, `Catalog.tsx`
  content (A created mount shells); lazy chunks; zero Canvas imports.

## Never touch (any lane)
- `blender/`, `assets/source/`, `docs/phase3/`, `public/models/*`
- Another lane's files (see requests/ protocol above).

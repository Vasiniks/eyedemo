# F4-MAIN — red-velvet V1 is the homepage; hard-case 3D film removed

Client: "scrap the other animation with the hard case — just use the red velvet as main." Brief §6d (highest priority, claim-free / same-nav rule) respected throughout.

## 1. '/' now renders the V1 experience
- `src/app/router.tsx`: `{ path: '/', element: <V1App /> }` reusing `src/v1/App.tsx` (untouched — owned by other agents; a live edit to `FilmSequence.tsx` mid-task was picked up by rebuild, no conflict).
- `src/main.tsx`: added `lenis/dist/lenis.css` + `./v1/v1.css` in the same order as `src/v1/main.tsx` (v1 last so it wins). No other style changes.
- `index.html`: added `theme-color #050607`, `html{background:#050607}`, preload of `/v1film/manifest.json` — same first-paint contract as `v1.html` (left untouched, still works in dev).
- `src/app/providers.tsx`: passive pass-through. The old conductor Lenis (`src/motion/lenis.ts`) must NOT init — V1 owns its scroll singleton (`src/v1/lenis.ts`, started by `FilmSequence`); two Lenis instances break wheel input.
- `src/routes/Home.tsx`: 3D content deleted; thin wrapper returning `<V1App />` (kept so any stale import still renders the velvet film, zero 3D).
- Services / Contact / Policies routes untouched.

## 2. Hard-case 3D removed from the app (plain `mv`, no git)
`archive/hardcase/` now holds: `canvas/` (← `src/canvas/`), `components-canvas/` (← `src/components/canvas/`), `__dev__/b|C|D` (← `src/__dev__/` B/C/D; E/F stay), `dev-b.html`, `dev-C.html`, `dev-D.html` (root harnesses), `models/case.glb`, `case.opt.glb`, `glasses.glb`, `glasses.opt.glb` (← `public/models/`). `dist/models/` builds empty — nothing 3D ships.
- No `three` / `@react-three/*` / `postprocessing` / `maath` / `@gsap/react` imports remain in `src` (grep-verified; leftovers are comments/README only). `postprocessing` was used solely by the archived `Effects.tsx`; `maath` and `@gsap/react` had zero src imports.
- `package.json`: removed `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `maath`, `@gsap/react`, `@types/three`. Kept `gsap` + `lenis` (V1 film) and `zustand` (still imported by the now-unreferenced `src/store/useFilmStore.ts`). No `npm install` run (node_modules still resolves everything; bundle decides).
- Left in `src` but unreferenced (orchestrator follow-up: reassign or archive): `src/motion/*`, `src/store/*`. They import only `gsap`/`lenis`/`zustand` — no bundle impact.

## 3. Build + bundle
- `npm run build` passes (`tsc -b && vite build` + postbuild 404 copy).
- Bundle: `dist/assets/index-E05QTm4m.js` 559 KB / gzip 188 KB, CSS 57 KB. Zero `three.js` markers in bundle (`WebGLRenderer` count 0, `@react-three|three.module|OrbitControls|ContactShadows` count 0). `dist` is 246 MB total — that is the V1 film frame library (`public/v1film/`), not 3D.

## 4. Visual QA (served `dist` via `vite preview` on :5706, Playwright Chromium)
- `main-desktop-top.png` (1512×860): dark header (logo, BOOK AN EXAM, MENU), red-velvet case frame with EyeQ mark, SKIP FILM, progress rail. LOOKED — correct.
- `main-desktop-white.png`: light header flip, white act H1 "FROM EYE EXAMS TO EVERYDAY STYLE.", brand rails (Oakley/Tiffany/Versace/Maui Jim/Ray-Ban) + insurer rails (Canada Life/Desjardins/iA/Empire/Sun Life), booking CTA. LOOKED — correct.
- `main-desktop-full.png`: film → white act → sections → footer stacking. LOOKED — correct.
- `main-mobile-top.png` / `main-mobile-white.png` (390×844): velvet frame, then white act H1 + CTA + store ledger (Vodden St address, 905-497-0222, email, hours). LOOKED — correct.
- Route health: `/pages/services` H1 "Services" + header/footer ✓; `/pages/contact` H1 "Contact" + header/footer ✓; `/policies/privacy-policy` renders (H1 "Terms and Policies" — shared Policies template) + header/footer ✓.

F4-MAIN-DONE

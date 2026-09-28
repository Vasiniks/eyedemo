# V2 QA — film-integration round (READ-ONLY review)

Date: 2026-09-28 · Server: `npx vite --port 5405 --strictPort` · Page: `/v1.html`
Viewports: 1512×860 + 390×844 (every screenshot looked at).
Builder status at QA time: **none of V2-FILM / V2-SNAP / V2-WAVES / V2-WORDS had EXITed** (all mid-flight). This reviews whatever exists; re-run after EXITs land.

## Verdict: DO NOT SHIP — boot is broken (P0 ×6)

Film region shows "film unavailable" + preloader stuck at 000; zero side panels render (Vite 500); snapping unwired. All 9 key frames uncapturable.

## P0 (blockers, per owner)

1. **V2-FILM — manifest 404.** `GET /v1film/manifest.json` 404 (`public/v1film/` split into `full/`+`web/` mid-migration, no manifest at root). No frames load, progress stuck 0. Fix: restore manifest at the path `FilmSequence.tsx` fetches; point loader at the new tier layout.
2. **V2-WORDS — `SidePanels.tsx` Vite 500.** Imports `./side.css` (only `sidePanels.css` exists). Fix import path.
3. **V2-WORDS — missing `sideCopy` exports.** `SidePanels.tsx` needs `SHOW_DRAFT_COPY`, `BRAND_COUNT`, `INSURER_COUNT`, and `SidePanelDef.dockTop` — none on disk. Fix: add them (`SHOW_DRAFT_COPY=false`, counts 8/8, `dockTop?` optional).
4. **V2-SNAP — snap unwired.** `snap.ts` imports `snapKeyScrolls`/`snapCaptureWindow` from `filmCurve.ts`, which exports neither. Fix: export key-scroll marks for source frames 1/70/145/215/280/368/440/500/600 + capture window; wire to the single Lenis instance.
5. **V2-FILM — header theme over white act.** ~75px black strip at viewport top in the 1512×860 white-act shot; `App.tsx` light switch needs progress ≥0.87, but progress is 0 while film is dead. Fix: drive theme from scroll position alone; re-shoot.
6. **V2-WORDS — draft-gating unverified.** `SHOW_DRAFT_COPY` default + zero-draft-lines-in-DOM not confirmable while WORDS 500s. Fix: default false, assert no draft lines at boot (§6d).

## P1

7. **V2-FILM/V2-SNAP — single-Lenis risk** (`ensureLenis` vs `FilmSequence` Lenis); verify one instance after P0-1/4.
8. **V2-FILM — preloader counter** stuck 000; bind to real load progress (resolves with P0-1).
9. **V2-SNAP — re-shoot 390×844** at 3/9 snap marks after P0-1/4.
10. **V2-WORDS — lock positives** (below); diff DOM text before/after fixes.

## Positives — do not regress (§6d compliant)

Preloader type; white-act H1 "FROM EYE EXAMS TO EVERYDAY STYLE.", live booking CTA, new-store address/phone/email/hours; 8 brand + 8 insurer rails; reviews 4.9 (208); 7 Essilor names verbatim; nav HOME·SERVICES·CONTACT + footer Refund/Privacy/Terms. Mobile 390×844 clean, no overflow.

## Method notes

- Key frames (1/70/145/215/280/368/440/500/600): uncapturable — all show preloader. Sources exist (`render-repo/out/frames/f_*.webp` ×3588).
- 20s scroll video: no video-capture tool available; stepped scroll sweep (top→white act→sections) used as proxy. Lenis feel not verified.
- Words-in-empty-side, fly-in prominence/duration, smooth scroll: unverifiable until P0-1–4 land. Re-run this QA after all four EXITs.

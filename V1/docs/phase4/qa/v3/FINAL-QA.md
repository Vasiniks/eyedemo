# FINAL-QA — FINALQA2 (ID=FINALQA2, port 5720, production build)

READ-ONLY QA. Served via `npx vite build && npx vite preview --port 5720 --strictPort` (build 38.5s, 578KB JS gzip 189KB; preview at http://127.0.0.1:5720/ — note: `localhost` failed IPv6, `127.0.0.1` works). Pages: `/`, `/pages/services`, `/pages/contact`. Fanned out 4 parallel subtasks (film / mobile / content / lighthouse+console). Time-boxed; report written before box end.

## 1) Homepage film scroll fluidity @1512×860
- Slow scroll top→bottom, 660 rAF samples: **p50 8.3ms / p95 9.3ms, 0 long tasks, 1× 600ms hitch** (single warm ring/dive keyframe). Rating: fluid, no sustained jank.
- Beats observed (all hit, flick PASS, each ≥250ms-capable, no skip): scroll hint → reviews `4.9 (208)` left → 7 Essilor lens names right → brands header right → tinted ring (clean) → insurers header left → white endcard.
- Flick test: 6 stops (prog 2/18/36/54/74/90), each real canvas content (pixel sd 17–26). **Blanks: N** — tail uniform-white is intentional paper endcard handoff.
- Code (read-only): draw loop transform/opacity-only (`src/v1/.../FilmSequence.tsx:353–377`), no per-frame layout reads, sticky CSS stage, off-main-thread createImageBitmap, LRU 240, 4-way fetch w/ far-playhead abort, DPR cap 1.25, single-drawImage fast path at velocity.
- Evidence: `docs/phase4/qa/v3/finalqa/film-01-intro-top|film-02-reviews-y2000|film-03-brands-y4000|film-04-tail-y5800 + film-findings.md`.
- Anomaly (not P0): page twice self-navigated to services/contact mid-test; scroll-only repro with 3.5s dwell stayed stable on `/`, no navigate()/location-write in film code — suspected shared-Chrome interference from parallel subtasks; re-run isolated before filing.

## 2) Mobile 390×844 — all PASS, no P0/P1
| Page | H-scroll | Subject cut | Overlays/collisions | Nav/CTAs |
| `/` | PASS (390=390) | PASS (case+glasses centered) | PASS (dark bg only, rail at edge) | PASS (MENU→drawer, SKIP FILM) |
| `/pages/services` | PASS | PASS (type-led hero, no photo) | PASS (stacked) | PASS (black "Book an exam") |
| `/pages/contact` | PASS (overflow=[]) | PASS (type-led hero) | PASS (stacked rows/buttons) | PASS (Get directions/Call/Book full-width) |
- Evidence: `finalqa/mobile-home-full-390|mobile-home-hero-390|mobile-home-navdrawer-390|mobile-home-film-mid-390|mobile-home-film-deep-390|mobile-services-full-390|mobile-services-hero-390|mobile-contact-full-390|mobile-contact-hero-390.png`. Consistent with prior `HOME-mobile-*` / `PAGES-*-mobile.png`.

## 3) Content completeness vs `docs/research/B-content-inventory.md`
- Nav §1 PASS (Home/Services/Contact → `/`,`/pages/services`,`/pages/contact`; footer policies trio). Title-case vs live HOME caps — cosmetic only.
- H1+About §2 PASS (H1 verbatim; 3 paras verbatim). PLAY VIDEO omitted by design (old-store interior, `src/components/dom/Sections.tsx:171`).
- Services §3 PASS (H1, 3 intros incl. `Eye Q Optical` + Gucci/Prada/Ray-Ban; both service blocks verbatim).
- Lenses §4 PASS w/ note (7 names + heading on home+services; 3 Essilor full texts in DOM on services `src/routes/parts/content.ts:84,89`, `src/data/lenses.json`; home uses `lens.short` précis + `Read more →` — document as précis, full on services).
- Insurance §5 PASS (heading verbatim + 8 in order Sun Life…Empire Life).
- Reviews §7 PASS (`4.9 (208 reviews)`, 6 texts + SW/H/NZ/AH/LL/EP verbatim, `Review by XX` only).
- Brands §9 PASS (8 in order; renders `Tiffany & Co.` vs inventory `Tiffany` — see P1-4).
- Promos/social §6/11 PASS (promo 0, social 0).
- **Large Book-exam CTAs: PASS with exact URL** `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` — home 6×, services 4×, contact 3× (`src/data/store.json:22`, `src/routes/parts/content.ts:14`).
- **Map loaded:** home Y (2 iframes + 1 canvas film); contact Y (1 iframe `maps.google.com…Vodden`); services N (0 iframe/canvas — see P1-3).
- **Pause buttons: NONE** — `pause` 0 hits; buttons only MENU/SKIP/Replay/Back/Prev/Next/Activate map.
- **Invented captions: NONE visible** — alts descriptive only, figcaptions = brand names / `Review by XX`.
- Known rebrand deviations (intentional new Brampton store, flag for product sign-off, not P0): 0 hits for OLD-STORE `(905)333-3931`/`info@eyeq2020`/`Guelph Line`/fax; site shows `2-227 Vodden St E Brampton / 905-497-0227 / eyeshine2020@gmail.com`; hours `Mon–Fri 11-6:30/Sat 11-5/Sun 11-4` (live: NONE); header `BOOK AN EXAM/Book an exam` wording variant vs live `BOOK YOUR EYE EXAM TODAY!` (live H1 CTA preserved elsewhere).
- Evidence: `finalqa/content-home|content-services|content-contact.png`.

## 4) Lighthouse `/` + console
| Form factor | Perf | A11y | BP | SEO |
| Desktop CLI lab | 82 | 100 | 96 | 92 |
| Mobile CLI lab | 87 | 100 | 96 | 92 |
| DevTools audit (both, excl. perf) | – | 100 | 100 | 92 |
- Lab metrics: Desktop LCP 2.8s / CLS 0 / TBT 0ms / FCP 0.5s / SI 1.9s. Mobile LCP 3.2s / CLS 0 / TBT 30ms / FCP 2.3s / SI 4.7s. INP n/a lab.
- Console: `/` zero errors/warnings (1 issue: 36 lazy images w/o explicit dims); services 1 warn (preloaded `v1film/manifest.json` unused in window); contact 1 flaky error once `InitMapsJwt Rpc failed xhr error code 6` (not reproduced).
- Network: **no 4xx/5xx** (all 200/304). ~300 `ERR_ABORTED` on `v1film/web/f_*.webp` = client-cancelled speculative preloads, not server failures.
- Evidence: `finalqa/lh-desktop.json|lh-mobile.json|report.json|home-audit.png|contact-audit.png`.

## Ranked findings (file + fix)
- **P0: NONE** — no exceptions, no failed same-origin requests, A11y 100, film fluid, mobile pass, content-complete.
- **P1-1 SEO robots.txt invalid (92 driver).** File: `public/robots.txt` (19 errors per LH). Fix: valid syntax, re-run LH SEO.
- **P1-2 Unsized lazy images (36).** Files: marquee/card components (brand/insurance PNGs, `about-eyewear-640.webp`, `services-exam-1024.webp`, `lenses-polarized-1024.webp`, `lenses-tech-640.webp`). Fix: add `width`/`height` or `aspect-ratio`. CLS 0 in lab but at risk on slow nets.
- **P1-3 Services has no map.** File: `src/routes/Services.tsx` Visit block (directions link only, no `<iframe>`). Fix: add `StoreBits` iframe if parity wanted.
- **P1-4 Strict-verbatim `Tiffany & Co.` → `Tiffany`.** Files: `src/data/*.json` brands. Fix: rename if strict parity required.
- **P1-5 Lone 600ms film hitch.** Files: `src/v1/frameLoader.ts` + `FilmSequence.tsx`. Fix: pre-warm ring/dive keyframes (trivial, 1/660 frames).
- **P1-6 Documented deviations needing sign-off (not code bugs):** new-store hours/address/phone/email, header CTA wording variant, home lens précis vs full, PLAY VIDEO omission. Fix: product confirms rebrand intent in report; no code change proposed.

FINALQA2-DONE

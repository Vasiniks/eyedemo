# VISUAL PRE-CRITIQUE — Phase 4 fix round (READ-ONLY helper)

Date: 2026-09-28 · Helper time-boxed pass, no code edits.
Judged against: `docs/00-BRIEF.md` §5 (9-beat film sequence + 80/20 pacing), §6 (hard object reqs), §6b (bright lenses via lighting, never whitened), §6c (8 brands / 8 insurers / smoke rimless Mama_WBL), §6d (NOTHING not on live site — highest priority), and `docs/phase4/PLAN-MASTER.md` §13 anti-slop gates A1–A15.

Newest screenshots judged (mtime sort 09-27):
- C: `docs/phase4/qa/C/round2-34-q0{,0.2,0.3,1,0.8}.png`, `round2-side-q{0,0.2…1}.png`, `C-hinge-q0.53.png`, `C-end-q1.0.png`, `C-side-q1.0.png` (+ `round2-verify.json`)
- D: `docs/phase4/qa/D/r2-both-1440/390.png`, `r2-w2-settled-1440/390.png`, `r2-w2-flight-1440.png`, `r2-w1-settled-1440/390.png`, `r2-w1-seq-{tiny,rush,decel,settled}-1440.png`, `r2-03-sweep-1440.png`, `r2-01-stage-1440.png`
- E: `docs/phase4/qa/E/r2-white-top-1440/390.png`, `r2-white-edges-1440.png`, `r2-rails-t{0,6}-1440.png`, `r2-railspair-t{0,6}-1440.png`, `r2-chapter-b5-1440.png`, `r2-rest-{about,services,lenses,reviews,visit}-1440.png`, `r2-footer-1440/390.png`, `r2-header-dark/paper-1440.png`, `r2-menu-1440.png`, `r2-skip-in-film-1440.png`, `r2-rm-static-1440.png`, `r2-rails-mobile-390.png` (+ `ROUND2.md`)
- beats: `docs/phase4/qa/beats/01-case-1440.png`, `02-open-1440.png`, `03-velvet-1440.png`, `04-emerge-1440.png`, `05-unfold-1440.png`, `06-info-1440.png`, `07-wave1-1440/390.png`, `08-wave2-1440/390.png`, `09-approach-1440/390.png`, `10-entry-1440/390.png`, `11-white-dom-1440.png`, `rm-static-1440.png`, `tier-low-1440.png`, `reverse-077-1440.png`
- F: `docs/phase4/qa/F/services-1440-full.png`, `contact-1440-full.png`, `policies-refund-1440-full.png`, `services-390-full.png`, `contact-390-full.png`

Method: 4 parallel `visual-critic` subagents (C object / D waves / E white+rest / F+beats continuity), stills only — motion curves, damping overshoot, and scrub continuity NOT verifiable from stills.

Global §6d sweep: NO catalog/frames/browse/search/account/cart/form/social/promos/stats found in any shot — PASS. One verbatim-check flagged P1 (Services closer paragraph). DRAFT lines correctly absent from production frames; beats-harness DRAFT/QA chrome flagged P1 (must be stripped from contract shots, flag default false).

---

## LANE C — object (case / flap / velvet / glasses) + beats 01–05

### P0 (ranked)
- **C-P0-1 — Lenses read dead black, zero §6b dark-field.** Shots: `docs/phase4/qa/C/round2-side-q1.png`, `round2-side-q0.8.png`, `round2-34-q1.png`, `C-side-q1.0.png` (only 2–3px glints in `C-end-q1.0.png`). Fails brief §6b + A12. Fix: 2 vertical strip cards behind lenses (±0.35m x, −0.45m z, 0.1×1.0m, #E8F0FF, int 4→6) + 1 low side card for edges; lens-edge roughness ~0.15, envMapIntensity 2.0; do NOT touch lens base color.
- **C-P0-2 — Beats viewer shows wrong objects entirely.** Shots: `docs/phase4/qa/beats/01-case-1440.png` … `05-unfold-1440.png` (rectangular box + flat red slab + round Lennon glasses). Fails §6 (thin sculpted aerospace shell, folded dark rimless Mama_WBL) + A13 real-assets-only. Fix: STOP lighting this scene; wire real `case.glb` + `glasses.glb` into CaseRig/GlassesRig at origin, re-capture beats 01–05 first.
- **C-P0-3 — Right lens whitened flat grey in beats.** Shots: `docs/phase4/qa/beats/01-case-1440.png` … `05-unfold-1440.png` (R = opaque light-grey disc, L = black). Fails §6b (never whitened) + §6c.4 smoke. Fix: revert to dark smoke transmission (rough 0.02–0.05, IOR 1.52, dark grey-green attenuation, ~2mm); brightness back ONLY via C-P0-1 strips.
- **C-P0-4 — Velvet reads red plastic, not pile.** Shots: `docs/phase4/qa/C/round2-side-q0.5.png`→`q1.png`, `C-end-q1.0.png`, `C-hinge-q0.53.png` (smooth cherry-red, hard white streak, no folds/pile). Fails §6 + A1. Fix: kill frontal fill on cushion; single grazing Spot #FF8A7A ~15° incidence front-left, 0.6m, 30°, penumbra 1.0; Velvet_Oxblood roughness 0.9, sheen 1.0, sheenColor #FF3040, sheenRough 0.32 + 0.5mm pile bump.
- **C-P0-5 — No physical emerge, glasses float detached.** Shots: `docs/phase4/qa/C/round2-side-q0.8.png`, `q1.png`, `C-end-q1.0.png` (~2–3 case-heights above mouth). Fails §5 + §6 + B3 envelope. Fix: clamp travel ≤90mm above cradle, overlap case mouth until q≈0.4; re-stage side camera lower (−4° tilt).
- **C-P0-6 — Side/back view glasses vanish.** Shot: `docs/phase4/qa/C/C-side-q1.0.png` (1 thin black line edge-on). Fails §6c.4 + §6b. Fix: dedicated back/rim spot camera-left-rear (−30° az, +20° el, #FFF2E2, 20° cone) on lens edges/barrels only; verify in this camera first.
- **C-P0-7 — Embossed logo never glints.** Shots: `docs/phase4/qa/C/round2-34-q*.png` (closed-crown views, 60mm deboss should catch). Fails §6 + Step-5 gate. Fix: macro 3/4 cam (≈(0.14,0.12,0.29)×1.2, FOV 32°, crown target), rake key #FFF2E2 top-left (−30°/+40°) int 2.5 across p 0.04–0.08; Logo_Gloss rough ~0.25 vs Case_Graphite ~0.6.

### P1
- **C-P1-1 — Flap reads ~60–80° (clamshell), not 40°.** `docs/phase4/qa/C/round2-side-q0.5.png`, `q0.6.png`. Fails §6 + C2. Fix: morph param a≤42 max, verify hat weights; re-shoot q 0.75/0.87/1.0 (32°→43.5°→38.2°→40°).
- **C-P1-2 — Red spill pinks the graphite lid.** `docs/phase4/qa/C/C-end-q1.0.png`. Fix: flag velvet Spot off lid (gobo / rotate 20° to cushion), drop 6→3 past q0.4.
- **C-P1-3 — Case key blows to white streak (wet plastic).** `docs/phase4/qa/C/round2-34-q0.png`. Fails §6 matte. Fix: key → 0.5m softbox int 2.5→1.8, case roughness 0.45→0.6, steel edges to 1px chamfers.
- **C-P1-4 — Red laser-line reflection in velvet.** `docs/phase4/qa/C/round2-34-q0.8.png`, `q1.png`. Fix: rotate strip 30° off specular, broaden to 0.3m, or move to lens-edges-only group.
- **C-P1-5 — Hinge macro shows no hinge.** `docs/phase4/qa/C/C-hinge-q0.53.png`. Fails §6 hinge+damping. Fix: reframe on pivot (dolly 0.22m×1.2, az −18°→+18°), f/11-equiv DOF, capture 0°/45°/90° + junction crack check.
- **C-P1-6 — q0.8 vs q1 pixel-identical (elastic settle invisible).** `round2-34-q0.8.png` vs `q1.png`. Fix: confirm Open30/Open40 weights vary a=32–43.5; log w_1..w_4 at q 0.8/0.87/1.0.

---

## LANE D — waves (8 brands + 8 insurers) + beats 06–08

### P0 (ranked)
- **D-P0-1 — No waves in film harness at all.** `docs/phase4/qa/beats/07-wave1-1440.png`, `08-wave2-1440.png` (+390s) — p=0.77/0.885 show only glasses+case, zero planes. Fails §5 + §6c.1 + B6/B7. Fix: mount `SponsorField` in `FilmCanvas` on `filmProgress.p`, reload atlases in film harness, re-shoot.
- **D-P0-2 — `canada life` white-box fill.** `docs/phase4/qa/D/r2-both-1440.png`, `r2-w2-settled-1440.png`. Fails §6c.2 + A4. Fix: re-knockout to Bone-only strokes, no fill; rebuild `atlas-insurers.png`.
- **D-P0-3 — W2 bottom-row collision.** `docs/phase4/qa/D/r2-both-1440.png` (Sun Life ∩ canada, MEDAVIE clipped, Desjardins+iA floaters). Fails B7 slots. Fix: apply W2 slot table + 56px min-gap clamp; delete orphan indices.
- **D-P0-4 — Opaque black quad bars trail every logo.** `docs/phase4/qa/D/r2-w1-seq-rush-1440.png`, `r2-w1-seq-decel-1440.png` (30–50px bars past PRADA/Ray-Ban/Oakley). Fails A4 + A13. Fix: `transparent:true, alphaTest:0.4, depthWrite:true, toneMapped:false`; size planes to content UV rect from `atlas-*.json`.
- **D-P0-5 — W2 flight nearly empty, zero streaks.** `docs/phase4/qa/D/r2-w2-flight-1440.png` (p=0.886: 1 logo + speck; expect 2–3 + ribbons). Fails §5 hyperspace + A5 + B7. Fix: `start=0.85+i*0.008` mapping + 2–4 additive ribbons/logo (30% length, 50% op).
- **D-P0-6 — Back-tier never settles in time.** `docs/phase4/qa/D/r2-w1-seq-settled-1440.png` (p=0.81/0.85: TIFFANY/VERSACE still dots). Fails B6. Fix: tighten back-tier travel (−18…−22m) or cut stagger 0.011p so all 8 settle by 0.835.
- **D-P0-7 — Mobile: 7/8 brands, Tiffany missing + touching rows.** `docs/phase4/qa/D/r2-w1-settled-390.png`. Fails §6c.1 + A9 + A11. Fix: mobile override (arc → 2 rows, 2 depths, 0.7×, no overflow @390), re-slot Tiffany.
- **D-P0-8 — Verbatim insurer heading never rendered.** `docs/phase4/qa/beats/08-wave2-1440.png` + all `r2-*.png` (only 6px debug text). Fails §6c.7 + §6d top priority. Fix: `ChapterOverlay` B7 heading Fraunces 30–38px centred + D11 sub-line, no billing language.

### P1
- **D-P1-1 — Back-tier ~64% legibility.** `r2-w1-settled-1440.png`, `r2-both-1440.png`. Fails A9. Fix: lift to ≥72% or +10–15% size.
- **D-P1-2 — Mobile insurer boxes 50–80px (< 120×40 gate).** `r2-both-390.png`, `r2-w2-settled-390.png`. Fails A9. Fix: 2-col grid + min-box enforce, perch W2 below hero clear-radius.
- **D-P1-3 — 16-plane co-read never staged (W1 huge top / W2 crammed bottom 15%).** `r2-both-1440.png` vs `r2-w2-settled-1440.png`. Fails B7 + A11. Fix: W1 outward/up, W2 outer arc, shared alpha 12–20.
- **D-P1-4 — Standin stage pure #000.** `r2-01-stage-1440.png`, `r2-03-sweep-1440.png`. Fix: Void #050607 + fog 0.035 + exposure + HDRI, or mark TODO.
- **D-P1-5 — Harness UI baked into frames + B5 Essilor names missing.** `beats/07-wave1-1440.png`, `06-info-1440.png`. Fix: shoot with `ui=0`; wire `ChapterOverlay` Essilor `<ul>`.

---

## LANE E — lens entry → white → rails → rest-of-home

### P0 (ranked)
- **E-P0-1 — SKIP FILM leaks into rest.** `docs/phase4/qa/E/r2-rest-lenses-1440.png` (SKIP over dark lenses). Fails §3.1 + ROUND2 P0-3 claim. Fix: extend `pastFilm` gate (progress ≥0.985 + white-anchor) to lenses/rest; re-shoot zero-skip.
- **E-P0-2 — Footer policy trio missing.** `docs/phase4/qa/E/r2-footer-1440.png` ("Terms and Policies", no Refund/Privacy/Terms links). Fails §6d + R6. Fix: render 3 links under expander in `Footer.tsx`; re-shoot clickable.
- **E-P0-3 — Lenses rest 6/7, no Read-more, no close-up.** `docs/phase4/qa/E/r2-rest-lenses-1440.png` (Xperio absent; no Read more → /services; no 4:3 image). Fails R3 + A13 + §6c.1. Fix: add Xperio verbatim + 2 Read-mores + credited close-up or `[COPY NEEDED]`.
- **E-P0-4 — Reviews band incomplete in evidence.** `docs/phase4/qa/E/r2-rest-reviews-1440.png` (no header/aggregate in any r2 shot; EP 6th card nowhere). Fails R4. Fix: shoot section top (header + 4.9 (208 reviews)) + scroll to 6th card; add EP verbatim if missing.
- **E-P0-5 — Mobile shows 2 horizontal tickers.** `docs/phase4/qa/E/r2-rails-mobile-390.png`. Fails A5 (≤1 mob) + §8. Fix: production mobile = single 68px marquee; quarantine loop-QA pair to harness route; re-shoot production Home.
- **E-P0-6 — Beats white stop empty.** `docs/phase4/qa/beats/11-white-dom-1440.png` (blank Paper vs `r2-white-top-1440.png` which passes). Fails §6-W + step-14 contract. Fix: mount real `WhiteSection` in beats harness (Lane B), re-shoot stop 11.

### P1
- **E-P1-1 — B5 chapter proves 4/7 Essilor in frame.** `docs/phase4/qa/E/r2-chapter-b5-1440.png`. Fix: shoot 2–3 progress stops covering all 7 + hairlines; ®/™ 60%, 13px roman.
- **E-P1-2 — RM header dark-over-Paper.** `docs/phase4/qa/E/r2-rm-static-1440.png`. Fails RM §3.1 + A9. Fix: force `eyeq-header--light` over RM white.
- **E-P1-3 — About player no poster.** `docs/phase4/qa/E/r2-rest-about-1440.png`. Fails R1. Fix: approved poster frame or `[COPY NEEDED]` still.
- **E-P1-4 — Sticky header clips Visit CTA.** `docs/phase4/qa/E/r2-rest-visit-1440.png`. Fix: scroll-margin/anchor offset below 64px header; re-shoot.
- **E-P1-5 — Harness chrome ships in QA frames.** `docs/phase4/qa/E/r2-skip-in-film-1440.png`, `r2-header-dark-1440.png` (scrubber + beat buttons). Fix: scrubber in `dev-E.html` only; assert no `__film`/scrubber in prod bundle.
- **E-P1-6 — Rails evidence is standalone pair, not production flanks.** `r2-railspair-t0/t6-1440.png` vs `r2-white-edges-1440.png` (ROUND2 admits no rails mount in `Home.tsx`). Fix: Lane B mounts edge flanks in production Home; re-shoot t0/t6 + pause + RM in Home.
- **E-P1-7 (§6d verify, not fail) — Services closer paragraph.** `r2-rest-services-1440.png` ("Looking for a trusted optometrist in Burlington?…") reads preserved-verbatim — VERIFY byte-verbatim from B §2 before launch.

Passes to keep: `09-approach`/`10-entry` (no copy over geometry ✓); `r2-white-top-1440/390` (H1 6-word Fraunces, centred column, Ink 48px CTA, §2 ledger, Paper ✓ A8/A10); desktop rails (`r2-rails-t0/t6`, `r2-white-edges`: 120px Void edge strips, sprockets + Bone-dim numbers + amber heroes, opposing t0→t6, pause ✓ A5); Canada Life knockout legible in E; headers themed correctly in isolation.

---

## LANE F + full-beat continuity

### P0 (ranked)
- **F-P0-1 — No film continuity B1→B9 (one static tableau).** `docs/phase4/qa/beats/01-case-1440.png` → `10-entry-1440.png` (same wide, case bottom + floating glasses, p0.05→0.985). Fails §5 + pacing 80/20 + B1–B9 + A11. Fix: freeze look-dev; wire `masterTimeline` labels + `window.__film.setProgress` → flap morph, `G_Arm_R/L`, CameraRig dolly/FOV per §6 table FIRST; re-capture before polish.
- **F-P0-2 — Case + velvet are placeholder boxes.** `01/02/03-case-1440.png` (black box + oxblood slab, no sculpt/pile, no 0.17→0.24 flap delta). Fails §6 + §5 `case.glb` 198×70×42 + A13. Fix: load real `public/models/case.glb` (Body/Flap/Cushion) + 4-morph 0→40° + grazing #FF8A7A; delete stand-ins. (dup of C-P0-2 — single fix clears both)
- **F-P0-3 — Glasses never folded/emerge/unfold; arms clip lenses.** `01/04/05-1440.png` (open + hovering at p0.05; bar through rims). Fails §6 + B3/B4. Fix: folded rest at load, opacity 0 until B3, y +90mm→0, L→R unfold with overshoot; arms behind lenses.
- **F-P0-4 — Lenses flat/crushed, no dark-field.** `04/06/07-1440.png` (L pure black, R flat grey, no edge/strip). Fails §6b+§6c.4 + A12. Fix: drei Environment + 2× Lightformer behind/beside + #FFF2E2 key; `uApproach`/fresnel rim 0.5→3.0 in B4/B8; keep smoke transmission.
- **F-P0-5 — Waves absent in 3D.** `07/08-wave1/2-1440.png` (empty black, debug text only). Fails §6c.1 + §0.1/C1 + B6/B7 + A4. Fix: `SponsorField` 8+8 alpha planes from light atlases with §6 travel/stagger/duration/opacity; 16-plane settle p≈0.90. (dup of D-P0-1 — single fix clears both)
- **F-P0-6 — Approach/entry/white handoff broken.** `09-approach-1440.png` (still wide, no rail), `10-entry-1440.png` (black fill, no bloom), `11-white-dom-1440.png` (blank Paper + QA panel, no H1/CTA/ledger). Fails §5 + B8/B9/W + A10/A11. Fix: lens-normal rail 0.30→0.045m FOV 35→48→68, near 0.01→0.002, transmission 0→0.9, bloom 0.15→1.4, exposure→2.2, veil `circle()` iris 400ms expo.inOut from p0.985 + RAF-off; render WhiteSection (§2 ledger).
- **F-P0-7 — RM + low-tier identical to base (no fallback).** `rm-static-1440.png`, `tier-low-1440.png`, `reverse-077-1440.png` ≈ `06-info-1440.png`. Fails §9 + §10 + §11.1. Fix: gate `FilmCanvas` on RM/tier — RM = poster stills + full DOM + static 8+8 grids, no pin/streaks/CA, dimmed-cut veil; low kills post/transmission.

### P1
- **F-P1-1 — Contact map blank.** `docs/phase4/qa/F/contact-1440-full.png`, `contact-390-full.png` (white card + Activate only). Fails §3 Contact. Fix: embed `maps.google.com…Vodden…output=embed` + click-activate poster→iframe; keep Get directions + Call below.
- **F-P1-2 — Mobile Services insurance void.** `docs/phase4/qa/F/services-390-full.png` (~600px empty black block). Fails §3 + A9. Fix: 390px 2-col grid, fixed rows, `contain-fit`, Bone 68–76%; re-capture 390-full.
- **F-P1-3 — Policies stitched strip illegible / route ambiguity.** `docs/phase4/qa/F/policies-refund-1440-full.png` (~10kpx, microscopic). Fails OVERRIDE `/policies/*` + A8/A9. Fix: per-policy routes, Paper body 16/26 + H1; capture per-route.
- **F-P1-4 — DRAFT + QA chrome burned into every beat.** All `beats/*.png` (slider + B1 B2… + `DRAFT: B1 — …`). Fails §6d (flag default false). Fix: `SHOW_DRAFT_COPY=false` default; QA panel on debug param only, never in `qa/` contract shots.
- **F-P1-5 — Header QA pill bar over real nav.** `F/services-1440-full.png`, `contact-1440-full.png` (Services·Contact·Refund·Privacy·Terms pills over Home·Services·Contact+Book). Fails §6d + OVERRIDE nav. Fix: remove pill bar from app chrome (Playwright helper only); keep 64/56px header + Book pill.

---

## Suggested fix order for next round (cross-lane)
1. Wire real assets + timeline first (C-P0-2 / F-P0-1…P0-3, F-P0-5/D-P0-1, F-P0-6): nothing else is judgable until beats 01–11 move.
2. Lighting second (C-P0-1/P0-4/P0-6/P0-7, F-P0-4): strips + grazing velvet + rim + logo rake.
3. Overlay/content third (D-P0-2…P0-8, E-P0-1…P0-6, F-P1-4/P1-5): knockouts, slots, headings, gates, harness hygiene.
4. Routes + fallbacks last (F-P0-7, F-P1-1…P1-3, E-P1-1…P1-6, C-P1-x, D-P1-x).

Stills cannot verify: hinge damping/overshoot timing, wave stagger/flight easings, veil 400ms/iris, pin behavior, RM/low-tier branching — need scrub clips + 0/45/90° junction crops + RM/tier captures in next round.

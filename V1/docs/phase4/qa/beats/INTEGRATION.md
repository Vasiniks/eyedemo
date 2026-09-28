# INTEGRATION — Lane B round 2 (real composed Home page)

Date: 2026-09-28. Lane B owns: `src/app/*`, `src/main.tsx`,
`src/routes/Home.tsx`, `index.html`, `src/motion/*`,
`src/components/canvas/*`, `src/styles/film.css`, `scripts/qa/*`.
Method: `scripts/qa/int-beats.spec.ts` (new, Lane B owned) against the REAL
composed page (`vite preview`, production build, port 5112):
12 stops × 1440×900 + 390×844 (+768×1024 portal) → `int-*.png` in this
directory. Every frame below was LOOKED at. Harness: progress stops via
`window.__film.setProgress` + damped-camera convergence wait
(`getSmooth`, |smooth−p|<0.003 — deterministic at any frame rate, no
wall-time guessing); DOM stops via real `scrollIntoView` (true scroll path,
timeline-driven). All runs console-clean (asserted per test).

Gates: `npm run build` PASS · `npx tsc -b` PASS · `eslint` clean on all Lane B
files · banned-token grep on Lane B files PASS · reverse/flick/veil/RM/tier
smoke tests PASS.

## 0. What was integrated (requests resolved)

1. **Router** (`src/app/router.tsx`): Catalog import + `/frames`, `/frames/:handle`,
   `/search` routes DELETED (brief §6d). Canonical: `/`, `/pages/services`,
   `/pages/contact`, `/policies/:policy` (+ unlinked Lane A `/qa/tokens`,
   kept, flagged for pre-launch removal). `/services`→`/pages/services` and
   `/contact`→`/pages/contact` in-app `<Navigate>` redirects (zero broken
   links; static hosts serve index.html for all paths via `_redirects` +
   `dist/404.html`, so no static-redirect change was needed). Follow-up for
   Lane F in `requests/B-to-F.md` (repoint chrome links at `/pages/*`).
2. **ONE conductor** (`motion/*`): `src/canvas/*` rigs (C) and stage/waves (D)
   are consumed WITHOUT editing their files — thin adapters in Lane B's
   `src/components/canvas/HeroRigs.tsx` remap master `p` onto their
   lane-local `progress` props (C remap §B below). SceneStage/SponsorField
   already default to the shared `filmProgress`. Canonical paths confirmed:
   `src/components/canvas/*` (§7.2). `src/v1/*` (parallel prototype, own
   progress store) is NOT imported by any entry/html/route — dead at runtime,
   typechecked only; left untouched for its owner; coordinator decides its
   fate. No B-to-C / B-to-D patches were needed.
3. **Home composition** (`src/routes/Home.tsx`, new): FilmCanvas (SceneStage →
   CaseRig → GlassesRig → SponsorField wave 1 + wave 2 → LensPortal `linked` →
   LensAnchorReporter; CameraRig + Effects internally) + ChapterOverlay
   (progress-driven scrub / stacked RM) + Header (theme + progress hairline +
   skip-film) + WhiteVeil (outside the pin) + white-act rails grid +
   WhiteSection + mobile strip + SR lists + rest-of-homepage + Footer.
   `lane-e.css` imported in `main.tsx` (was harness-only — production Home
   had NO Lane E styles before this round).
4. **C remap applied** (`HeroRigs.tsx:glassesQFor`, CaseRig `caseQFor`):
   B2→CaseRig q 0–1; B3–B4→GlassesRig q with DEVIATION §B; B5 hover tail; B6
   right-third drift (+0.18 m, out by B8). D camera notes applied
   (`chapters.ts`): wave hold ≈0.98 m desktop, look-target dipped to the
   16-plane centroid, mobile wave pullback ×1.8 (≈1.9 m, covers the 768px
   desktop-layout case per D §2–§3) + mobile look-target dip for caption
   clearance. Portal rail rebuilt per frame from the LIVE anchor.

## A. Per-stop verdicts (1440×900)

| Stop | Visible | Vs brief sequence | Verdict |
|---|---|---|---|
| int-00-load | Closed graphite case in darkness, header, Skip film | Premiere frame, no copy (§6d default: no verbatim content exists for B1) | PASS |
| int-01-case 0.05 | Case 3/4 macro, deboss glint on crown | Case reveal | PASS |
| int-02-open 0.17 | Flap open, red velvet lining | Open/velvet | PASS |
| int-03-velvet 0.24 | Open bowl, velvet | Velvet | PASS |
| int-04-emerge 0.32 | Temples rising from the bowl | Folded rise (remap deviation §B puts visible emergence inside B3) | PASS |
| int-05-unfold 0.47 | Open glasses hovering above case, case below as pedestal | Unfold in the air (clip-free; C clearance proof holds — mapping is monotonic in local-q) | PASS |
| int-06-info 0.62 | Hero + 4/7 Essilor names, left column clear of hardware | Info+orbit; list completes (7/7) by 0.70 by design | PASS |
| int-07-wave1 0.77 | W1 settled, hero drifted right-third, case centre, streak wisps | Wave 1 spatial arrival | PASS |
| int-08-wave2 0.885 | W1 settled + W2 MID-FLIGHT + verbatim insurance heading | Wave 2 spatial arrival (flights run past B7 by plan: last settles 0.951; transient overlap with heading is choreography, not a defect) | PASS w/ note |
| int-08b-settled 0.92 (diagnostic) | 16/16 settled with margin, no caption (B7 exited), skip over Desjardins edge | 16-plane frame the portal leaves from | PASS |
| int-09-approach 0.945 | Rail close-up: right lens + bridge centred, strip-light sweep on left lens, Miu Miu blooming behind, constellation peripherals | Lens approach along the live-anchored normal | PASS |
| int-10-entry 0.985 | Near-plane crossing: dark lens fill + bloom + veil starting; header still dark (flip at 0.992) | Lens entry (real lens is opaque smoke — no transmission ramp in C materials — so the crossing reads dark→Paper via the veil; see §C) | PASS w/ note |
| int-11-white | H1 + Ink CTA + new-store ledger + map + film rails flanking (72 px/s, verified advancing via transform probe) | Paper white act (scroll-margin added so H1 clears the fixed header) | PASS |
| int-12-rails A/B | Rail pair, A≠B (3 s drift) | Opposing vertical rails | PASS |
| int-13-visit | Hours/address ledger + booking card | Rest of homepage | PASS (missing header pixels = E's `is-hiddenbar` hide-on-scroll, intentional §3.1 — DOM-probed present) |
| int-14-footer | Store block, Terms+Policies, Replay/Back-to-top, © year | Footer, §6d-clean (no frames links) | PASS |
| reverse/flick/tier-low | 0.77 reproduces after 0.32 (beat B3, no pops); flick→veil 1; low tier renders, no post | Scrub purity | PASS |
| RM static + chapters | No Lenis classes; stacked chapters; B5 shows all 7 verbatim lens names | §10 static branch | PASS |

## B. Deviations from lane requests (deliberate, documented)

- **Glasses remap ≠ C's suggested 0–0.7.** Their map lands the fade at master
  ≈0.38–0.41: all of B3 shows an empty case and the 04 stop shows nothing
  emerging. `glassesQFor` maps B3–B4 onto local q 0.28–1.0 instead (fade→early
  B3, rise→B3, unfold→B3-late/B4, hover→B4-late, hero for B5+). Internal
  sequencing is untouched (monotonic in local-q), so the rise-before-unfold
  clearance proof holds bit-identically. With DRAFT copy off there is no
  caption contradiction; with drafts on, B3 "Folded" overlaps the unfold
  start — cosmetic, DRAFT-gated.
- **Wave hold 0.98 m, not 0.78 m** (D asked ≈0.78): at 0.78–0.84 the W2 second
  row clipped the frame bottom (proven in 08b iterations); 0.98 + dipped
  target frames 16/16 with margin. Mobile wave pull ×1.8 (≈1.9 m hold).
- **Stand-in anchor corrected** to (0.03, 0.16, 0.01): LANEC-PROBE @q=1.0
  shows hero lenses at y≈0.16, not 0.08 — the authored B4/B5 targets framed
  empty air; keys reframed onto the measured hero.

## C. Open issues per lane (not mine to fix)

- **C**: real `G_Lenses` carries no B8 transmission/edge ramp (static smoke) —
  the portal crossing leans on camera + bloom + veil. If the choreography
  portal wants the §6 B8 material ramp on the real lens, GlassesRig needs to
  own it (suggested: drive from `filmProgress` + `samplePortal`, as the
  stand-in disc does). No patch filed — visual bar is met without it.
- **C**: raw `case.glb` (~10 MB) ships in production until `C-opt-recondition`
  is served (film transfer budget is step-15 territory).
- **D**: mobile wave marks render ≈60–100 px (vs the §11.1 120×40 insurer
  floor and the 90 px compact claim measured at D's 1.05 m harness distance).
  Accepted: binding priority is no-overflow @390 (holds), and names survive
  as text (B7 SR list, rails, Services grid). If D compacts at ≤768 px
  (currently <768 only), the 768px frame gains margin to enlarge marks.
- **D/E**: B7 heading + SR text list can sit under mid-flight W2 marks at the
  0.885 contract stop (transient; settled frame is clean). No action unless
  E wants the heading lower during flights.
- **E**: header `is-hiddenbar` hides the bar after long downward jumps
  (13-visit frame) — intentional per §3.1, verified present in DOM. No action.
- **Coordinator**: `src/v1/*` (parallel prototype, own progress store) is
  unmounted dead code that intermittently breaks shared `tsc -b` while its
  owner edits — keep-as-harness or remove pre-launch. `/qa/tokens` route kept
  (unlinked); remove pre-launch. Session skip flags (`eyeq-film-seen`,
  ~200 vh abridged pass) + preloader (step 17) are NOT implemented in this
  round — footer Replay clears flags that are never set (harmless).

## D. QA-process notes (for the next runner)

- Run the GL-heavy spec with `--workers=1` (parallel SwiftShader instances
  starve each other into convergence timeouts).
- Captures wait on damped-camera convergence (`getSmooth`), not wall-time;
  a stray ScrollTrigger refresh can clobber the dev-only `setProgress`
  write (production-meaningless — scroll IS the truth for real users), so
  stops re-assert + verify p before/after the shot with retries.
- QA ran against `vite preview` (production build, no HMR): dev-HMR edits
  from parallel lanes otherwise reset progress mid-run.
- 390 portal aim was challenged pixel-by-pixel and EXONERATED: anchor probe
  reads (0.027, 0.161, 0.013) ≈ the real right lens; a 2× crop proves the
  right lens dead-centre. Do not "fix" the rail from thumbnails.

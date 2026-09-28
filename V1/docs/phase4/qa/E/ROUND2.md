# Lane E round 2 — feedback resolution (E-round1.md → fixed)

Dev harness: `npx vite --port 5115 --strictPort` + `dev-E.html`. All shots below
are `docs/phase4/qa/E/r2-*` at 1440×900 unless marked 390. Every shot was
looked at before claiming the fix.

## P0-1 — Rails rebuilt as dark FILM STOCK → FIXED
Was: light `#ECE6D6` bed + mid-grey tiles (cheap marquee read).
Now (`lane-e.css`, `LogoRails.tsx` comment): continuous Void `#050607` strip,
120px desktop; sprocket perforations in Paper colour along both edges;
light-knockout logos placed DIRECTLY on the dark base (inner tile deleted);
10px micro-cap frame numbers in Bone-dim 60% (hero frames Lamp-amber 60%,
i.e. Ray-Ban 02 / Sun Life 01); 1px Steel-edge dividers at 30%; film grain
≤3% (SVG turbulence, `opacity:.03`); top/bottom masks ≥120px into Paper.
Speeds/directions untouched (72/44 px/s, opposing, rAF, ±15% velocity
coupling, hover-slow, IO-pause, pause control, RM static).
Deviation recorded: dropped the §1-C8 "40–60% rail opacity" wash — a
translucent Void strip over Paper read as exactly the grey the feedback
rejected. Opacity now lives only in numbers/dividers/grain.
- `r2-white-edges-1440.png` — flanks at page edges (measured boxes x=0/w=120
  and x=1320/w=120 at 1440vw), centre column readable between them.
- `r2-railspair-t0-1440.png` vs `r2-railspair-t6-1440.png` — same scroll
  position 6s apart: left rail advanced down, right rail up, seamless wrap,
  pause control centred. (Standalone pair is the loop-QA twin of the flanks;
  same `Rail` component. Production flank placement belongs to Lane B's Home —
  `src/routes/Home.tsx` is still a Lane A shell with no rails mount; the
  harness proves the edge geometry Lane B should reproduce.)

## P0-2 — Header over Paper → FIXED
`.eyeq-header--light` is now always Paper `rgba(245,241,232,.82)` + blur(20px)
+ Ink text + Ink logo (`eyeq-logo-header-original.png`), scrolled or not;
dark theme unchanged (transparent → Void blur). Progress hairline stays
Lamp-amber.
- `r2-header-dark-1440.png` (dark: transparent, white logo) vs
- `r2-header-paper-1440.png` (Paper bar, Ink logo) and `r2-white-top-1440.png`.

## P0-3 — SKIP FILM overlap → FIXED
`Header.tsx`: the control now shows only while the visitor is still above the
white act (scroll-driven `pastFilm` + `progress >= 0.985` handoff + Lane B
`showSkipFilm` gate; any signal hides it faded via `.is-hidden`, removed from
tab order while hidden). First attempt (IO on `#white-act`) still leaked over
the footer once scrolled past — caught in `r2-footer-1440.png`, fixed, re-shot.
- `r2-skip-in-film-1440.png` — visible over the dark film (correct).
- `r2-white-top-1440.png`, `r2-footer-1440.png`, `r2-rest-*-1440.png`,
  `r2-footer-390.png` — absent everywhere at/below the white act.

## P1-4 — Canada Life logo → FIXED (verify)
`public/web/insurance-light/canada-life-min.png` (orchestrator-regenerated)
renders with the "life" knockout in place — see right rail in
`r2-rails-t6-1440.png` / `r2-railspair-t6-1440.png` and close-up
`r2-canada-life-1440.png`. No Lane E code change needed (direct `<img>`,
not the Lane D atlas).

## P1-5 — Rails hug page edges → FIXED (harness) / noted for Lane B
Harness white-act grid is now full-bleed (`auto minmax(0,640px) auto`,
rails `justify-self: start/end`) — measured at the extreme edges (see P0-1).
Side-by-side-centre layout only ever existed in the standalone loop-QA pair,
which is by design. Lane B must reproduce edge flanks in production Home.

## P1-6 — White-act logo gap → FIXED
`.eyeq-white__logo` margin-top 24→32px (H1 keeps 32px) — see
`r2-white-top-1440.png` / `r2-white-top-390.png`.

## P0-7 (§6d) — Forbidden links + DRAFT gating → FIXED
- Deleted: menu "Browse frames" (`/frames`) + "Search" (`/search`)
  (`Header.tsx`); footer "Browse frames" (`Footer.tsx`). Menu is now
  Home · Services · Contact · Book an eye exam + policies trio + tel/address/
  hours — see `r2-menu-1440.png`. Footer: store block + policies + © +
  Replay film + Back to top — see `r2-footer-1440.png`. Grep over
  `src/components/dom/*`: zero remaining `/frames|/search|Catalog|Account|
  Cart|Shop` in UI (two compliance comments only).
- New single build flag `SHOW_DRAFT_COPY` (`src/data/index.ts`,
  `VITE_SHOW_DRAFT_COPY=true`, default false). When false (default):
  `ChapterOverlay` renders verbatim lines only (B5 = 7 Essilor names,
  hairlines, ®/™ 60% — `r2-chapter-b5-1440.png`; DOM asserts all 7 names,
  draft display absent); D13 Brampton block and D15 video description are
  hidden (`Sections.tsx`; DOM asserts `.eyeq-about__brampton` absent);
  `DraftTag` never renders. About shows the 3 verbatim paras + PLAY VIDEO —
  `r2-rest-about-1440.png`.
- Rest sections re-shot with final code: `r2-rest-about/services/lenses/
  reviews/visit-1440.png` (reviews = 1 featured + 5 compact, verbatim).
- Mobile: `r2-white-top-390.png`, `r2-rails-mobile-390.png` (dark 68px strip
  + pause), `r2-footer-390.png`, `r2-header-dark-390.png`. Found & fixed in
  this round: 120px flank strips overlaid the 4-col content on mobile —
  vertical `.eyeq-rails--desktop` is now hidden <768px (plan: mobile gets
  only the horizontal marquee).
- RM: `r2-rm-static-1440.png` — dark static flank cards with labels, no motion.

## Known issues / not mine
- `npm run build` (`tsc -b`) fails on two files outside Lane E ownership:
  `src/__dev__/C/main.tsx` (unused import, Lane C) and `src/app/router.tsx`
  (imports non-existent `../routes/Catalog`; the orchestrator override removed
  the Catalog route). Zero `tsc` errors in `src/components/dom/*`,
  `src/__dev__/E/*`, `src/data/*`. Filed as
  `docs/phase4/requests/E-build-blocker-round2.md` — Lane E did not touch them.
- Production Home rails placement + `#film-pin` shell are Lane B's; menu
  `S`-shortcut/film integration unchanged. `VITE_SHOW_DRAFT_COPY=true`
  preview build not screenshot — default-false path is the shipping gate.
- R3 material close-up: still no supplied image (round-1 known issue, unchanged).

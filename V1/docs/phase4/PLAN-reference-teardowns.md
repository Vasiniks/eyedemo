# PLAN — Reference Teardowns (REF) · Phase 4 Planning

Scope: measured teardown evidence for the EyeQ scroll-driven 3D product film, product
reveal/open mechanics, and circular/lens/iris transitions. Composition and animation stay
original — brief forbids copying identities. Values below are MEASURED from `vf teardown`
artifacts unless marked [UNVERIFIED / from-frames].

Raw artifacts: `.design/ref/airpods-pro/`, `.design/ref/vision-pro/`, `.design/ref/realevate/`
(each: `teardown.md`, `motion.json`, `stack.json`, `three.json`, `shaders/`, `assets.json`,
`fonts.css`, `intro/`, `scroll-sheet-*.png`, `steps/`, `states/`).

Reference selection (from `docs/research/E-visual-references.md`, verified live URLs):
- **R1 — Long scroll-driven product film:** `https://www.apple.com/airpods-pro/` (E-11,
  chapter-per-benefit scroll). Full teardown, all phases complete, 394 s, GPU ANGLE Metal.
- **R2 — Product reveal + lens/portal transition:** `https://www.apple.com/apple-vision-pro/`
  (E-12 immersion blend + E-28 portal, E-29 iris analogue; exploded craft chapters). Full
  teardown, all phases complete, 407/420 s budget, GPU ANGLE Metal.
- **R3 — Circular/lens/iris transition + marquee/rails mechanics:**
  `https://realevate.agency/` (E-13/E-30, Awwwards SOTD 2026-09-27, code-verified marquee +
  `clip-path: inset()` wipes + preloader counter). Teardown PARTIAL (crashed 81/420 s,
  1.0 screens, scroll/hover/pointer phases done) + live JS/CSS measurement of
  `/js/realevate-app.js`, `/js/site-preloader.timing.js`, `style.min.css`.

Not torn down (deliberate): JMM/Lindberg/Cubitts/Moscot (static film/packshot language —
E already captured the art-direction principle; nothing scroll-mechanical to measure);
Locomotive docs (pattern only, library adoption deferred); TAG Heuer / Andy Wolf / Spellwood
SOTDs (E follow-up leads — dive only if MOTION lane requests a horizontal-pin example).

---

## 1. R1 — Apple AirPods Pro · measured

`docHeight` 29,235 px @1440×900 = **32.5 screens** (live re-measure 29,316 px @868 vh = 33.8
screens). Section heights (px @868 vh): welcome 868 · highlights 1,226 · product-viewer
1,060 · product-stories container 17,932 (noise-control 3,006 · audio 2,774 · personalized
2,532 · fitness 2,850 · hearing-health 2,733 · magical 1,720 · battery 2,317) · incentive
831 · contrast 2,584 · environment 908 · values 753 · index 694 · sosumi 1,766 · footer 126.

- **Pins/scrub: NONE.** `motion.json`: 0 pinned, 0 scroll-linked, `scrub_values: []`.
  Native `position: sticky` instead — 24 sticky/fixed nodes live, 3 content-relevant:
  `nav#ac-localnav` sticky top:0 h52; one `.sticky-element` sticky top:0 h868 (= 1 viewport);
  `.all-access-pass` galleries sticky top:auto h56. No GSAP pin anywhere.
- **Reveals (fitted from frames, 9 total):** 700 ms power3.out (opacity 0→1) · 900 ms
  power1.out (y −6.2 px→0) · 300 ms linear · 500 ms power4.out · 900 ms power4.out ·
  300 ms linear · 400 ms power2.out · 800 ms power3.out · 1000 ms power2.out (last four =
  noise-control 4-card cascade, y 0.04→3.47→12.4→23.4 px; exact stagger ms [UNVERIFIED]).
  Bundle vocabulary: GSAP `ease-out` ×4; durations `320`×325, `0`×106, `.32`×94, `.24`×78,
  `.5`×69; CSS `cubic-bezier(0.4,0,0.6,1)`×1564, `(.4,0,.6,1)`×1054, `(0,0,0.2,1)`×570.
- **Split text:** `split_text_blocks: 3` (9 on `/ca/` variant); `staggers: []` — no stagger
  ms observed [UNVERIFIED, do not spec].
- **Sticky product viewer ("Take a closer look", §1060 px):** click-to-swap, NOT
  scroll-scrubbed. 6 pill buttons + prev/next arrows + per-topic videos
  (`anim/initial|fit-feel|heart-rate|touch-controls|case/large.mp4`) each with
  `*_startframe/_endframe.jpg` posters. Unloaded fallback = black silhouette (s04).
- **Circular iris: NOT PRESENT as DOM technique.** 30 clipped nodes sampled: only
  `inset(0 0 99.9% 99.9%)` (a11y-hidden), `inset(1px)`, `inset(1px round 28px)`. Zero
  `circle()/ellipse()`. The concentric-ring "iris" in scroll-sheet-01 is **baked into video
  content** (`hero/large.mp4` 5.9 MB 3600×2100; `hearing-health-halo/large.webm` 11 MB;
  `design/large.webm` 2.3 MB) — not a CSS/JS mask. E-29's "iris-wipe analogue" is a
  content motif, not a measured mechanism.
- **Pipeline: video, no WebGL.** 0 `<canvas>`, `three.json` = no scene, `shaders/` empty,
  rAF 0/s at rest. 16 `<video>` live, all `muted playsInline`; hero `loop` + posters;
  chapter videos `loop:false` except noise-control + hearing-health `loop:true`.
  No GSAP/Lenis/Barba named (Apple custom `overview/head.built.js`, `main.built.js`);
  tone mapping / lights / materials: NONE (nothing to capture).
- **Type/colour:** H2 `.section-header-headline` SF Pro Display 96/100/600/−1.44 px
  `#1d1d1f`; eyebrow 28/32/600/0.196 px; body bg `#ffffff`. 11 woff2 in `assets/`.
- **Intro:** no preloader — blank nav t300 ms, first full content ≈ t700 ms, hero still
  then autoplay video. Native cursor; pointer probe reacts `[none]`; hover = nav
  colour/bg only.

## 2. R2 — Apple Vision Pro · measured

`docHeight` 32,772 px = **36.4 screens**, 473 internal URLs, 5 crawled. `intro_ready_ms 700`.
`motion.json`: `scroll_linked: []`, `reveals: []`, `pinned: []`, `fixed: 4`
(globalnav-curtain, ac-ln ×3). `scrub_values: []`, `staggers: []`. Page is 26×
`<video muted>` chapters — no DOM transform for the wheel-probe to fit, so **no pin length
or scrub factor was captured [UNVERIFIED — do not quote any]**. Chapters are fullscreen
sticky video bleeds ≈ 1 viewport each, back-to-back (from frames).

- **Motion vocabulary (bundle counts):** GSAP eases `linear`×6 only; durations `320`×311,
  `.32`×82, `.24`×78, `.12`×56, `0`×44, `1`×37, `380`×33; ScrollTrigger starts
  `t-100vh`×21, `t-200vh`×12 / ends `b+100vh`×12; CSS `cubic-bezier(0.4,0,0.6,1)`×1754,
  `(0,0,0.2,1)`×665, `(.25,.1,.3,1)`×169. `split_text_blocks: 2`. 0 canvases, 26 videos.
- **Immersion-blend portal (frames + shader + video list):** s01 hero photo + frosted-glass
  blur panel wiping up, headline over blurred ghost → s02–s03 full-bleed passthrough video
  (living room + floating icons; `foundation/large.mp4` 5663 KB w1440 loop:true muted,
  `experience-apps` 7065 KB, `productivity_a` 6085 KB, `experience-entertainment` 8084 KB,
  `experience-photos-videos` 4782 KB) → s04 Environments pano + centered `× Exit View`
  pill (immersion end-state metaphor; no slider widget captured; blend is scroll-driven
  video opacity/scale — exact values [UNVERIFIED]).
- **CUSTOM IRIS SHADER — measured, `shaders/custom-000.vert` + `custom-001.frag`:**
  fullscreen quad, ellipse SDF + `smoothstep(distance−smoothness, distance+smoothness, 0)`;
  defaults `progress = 0.0`, `centerX = 0.5`, `centerY = 0.0`, `width = 1.2`,
  `height = 1.5`, `opacity = 1.0`, `smoothness = 0.2`, `scrim = 1.0`, `opening = true`;
  output `mix(directionEdge-black, black, scrim)`. Which DOM node drives `progress`
  [UNVERIFIED] — port the shader as-is for the EyeQ lens portal (ARCH lane owns wiring).
- **Craft chapters (frames + assets):** (A) `Take a closer look.` white horizontal drawer —
  ~820 px video cards, `< >` pill arrows bottom-right, circle `pause` on video
  (`drawer-design-*`, `drawer-entertainment-*`, `drawer-photos-videos-*`,
  `drawer-productivity-mac`, 4–7 MB each, w820 muted); caption = grey body + black bold
  lead. (B) Black `Innovation you can see…` — 4-layer top-down explosion along Y (curved
  glass → sensor board → midframe/fans → light-seal, s39) reassembling to lens macro +
  spec line (`23 million pixels / three-element lens`, s40–s41) → particle-sphere audio
  viz (s42). Layer spacing / scroll mapping [UNVERIFIED — stills only].
- **3D scene: none.** `three.json` = no scene; `THREE:141 / WebGLRenderer:3` are
  false-positive keyword hits. No tone mapping / lights / materials — do not claim PBR.
- **Transitions/hover/pointer/intro:** no preloader/curtain (blank+t700 ms hero photo,
  logo+sub t3600 ms); page transitions = hard MPA reload with white flash
  (`transition1-600ms` 12.6 KB pure white vs ~55–72 KB content frames — no overlay, no
  View Transitions); hover = one `a Continue` bg `rgb(29,29,31)→rgb(39,39,41)` only;
  pointer = videos only, no parallax/magnetic; fonts SF Pro Display/Text/Icons woff2
  (114–229 KB) in `fonts.css`.

## 3. R3 — Realevate · measured (JS/CSS exact — the numbers lane)

Teardown PARTIAL (browser context crashed 81/420 s; 1.0 screens, motion-map + hover +
pointer phases done) + live measurement of `realevate-app.js` (285,046 chars, GSAP
3.12.2), `site-preloader.timing.js`, `style.min.css?v=1789247590000`.

- **Marquee engine (exact):** `.marquee > .marquee-reveal > .marquee-scroll (flex,
  width:max-content) > N× .marquee-collection (flex-shrink:0, padding-right:
  `--marquee-gap`) > span.marquee-text`. Init: measure ONE collection `m = offsetWidth`
  (incl. gap); clones `d = max(3, ceil(2·innerWidth/m)+1)`; **duration formula
  `v = m/innerWidth·15·f`** (`f` = 1 / 0.5 / 0.25 at ≥991 / <991 / <479 px) — verified
  exact twice (home 1085/1200·15 = 13.5625 s; contact rail 693/1200·15 = 8.6625 s).
  Tween `gsap.to(x: 0→−m [normal] or −m→0 [reverse], duration v, ease:"none", repeat:-1,
  modifiers:{x: wrap ±m})`. Speed ≈ 80 px/s @1200 px. **Linear, constant, NOT
  scroll- or mouse-driven** (verified: synthetic mousemove changed nothing; pointer-probe
  "moves with mouse" = misattributed always-on rAF at 184/s). No CSS keyframes; no
  ScrollTrigger scrub on home marquee. Tokens: `--marquee-gap: 2.601vw·min(1,100svh/950)`,
  `--marquee-text-size: 16vw·min(1,100svh/950)`, text 16vw/1/−0.02em nowrap.
- **Rotate-90° vertical rails — site already does this, copy verbatim:**
  `.contact-hero__marquee-rotate{position:fixed; top:0; left:15vw; transform:rotate(90deg);
  transform-origin:left top}` + inner `.marquee.marquee--contact{width:100vw; top:-12vw;
  rotate:180deg}`. Computed live: wrapper `matrix(0,1,-1,0,0,0)`, inner `rotate:180deg
  top:-144px`. EyeQ recipe: wrapper rotated, track stays horizontal in code; opposing
  direction = inner `rotate:180deg` on ONE rail only (never `scaleY(-1)`/`direction:rtl` —
  breaks wrap math); gap stays part of `m`; duration uses horizontal viewport width.
- **Clip wipes (JS constants):** images `inset(50% 50% 50% 50%) → inset(0%)`, 1.5 s
  `power4.out`, img scale 1.5→1 (pre-state in CSS under `body:not(.is-ready)`). Text lines:
  `inset(0 0 100% 0 → −40% 0 −28% 0)`, `yPercent 100→0`, `skewY −1→0`, 0.8 s `power2.out`,
  line stagger 0.09, element stagger 0.12 (`Pu` variant yPercent 115; `Ct` hero-h1
  yPercent 140, dur 1.0, visible `inset(0 0 −20% 0)`; `Jt` top-down `inset(100% 0 0 0)`,
  stagger 0.025, dur 0.35, `power4.out`). Triggers `top 90% → bottom 0%` default;
  parallax `scrub: 0.3, start "top bottom", end "bottom top"` (category pages; home has
  0 pins/triggers — intro-only motion, 1.0 screens).
- **Preloader (exact):** `counterSteps [27,42,68,92,99]` (frames match t2600 = 27),
  tick 0.6 s `expo.out`, counter enter 0.85 / exit 0.95 s, image reveal 1.5 s `power4.out`,
  navy wipe `inset(0 0 0 0 → 0 0 100% 0)` 1.2 s `cubic-bezier(.73,.15,.15,.99)`, morph
  delay 0.1 / dur 0.8 `power2.inOut`, image delay 0.5, exit delay 0.5, timeout 12 s.
  Total intro ≈ 5–7 s [from frames — teardown intro phase incomplete].
- **Vocabulary:** GSAP `none`×22, `power2.out`×16, `expo.inOut`×16, `power2.inOut`×14,
  `power4.out`×6; durations `.5`×14, `1`×10, `.8`×10, `.75`×8, `.2`×8, `.6`×8;
  staggers `.025`×4, `.08`×2; CSS `--standard-easing / --cta-motion-easing:
  cubic-bezier(.7,.6,0,1)`, `--selection-hover-easing: cubic-bezier(.18,.13,0,.99)`,
  `--overlay-duration: .8s`. Stack: GSAP 1008 hits, ScrollTrigger 174, SplitText 28
  (6 blocks), OGL 276 hits with ZERO canvases on home (idle bundle — do not carry the
  cost). `/bythesea` live: 10,370 px / 868 vh = 11.95 screens, 2 marquees, 28 triggers.
  Fonts Google Sans 500 / Roslindale Display 300 / Monument Extended 400 (woff2 +
  `fonts.css`); colours `--navy #1F2B5E`, `--muted #626C95`, white.

---

## 4. Recommendations for EyeQ (adopt as defaults)

Concrete, in priority order. MOTION/ARCH lanes own final tokens; these are the measured
starting values.

1. **Film shape: chapter-per-benefit stacked sections, one idea per viewport, sticky stage
   + text crossfade** (R1 pacing model — the one transferable thing from 32.5 screens of
   Apple). EyeQ beats map to brief §5 weights (case 10 · open/velvet 15 · emerge 15 ·
   unfold 15 · info+camera 15 · wave1 15 · wave2 7 · approach 5 · entry/white 3; dark
   ≈ 80% / white ≈ 20%). Each beat = one pinned scene + own caption; never two reveals
   competing (E §"Motion/pacing" rule 1).
2. **Rails/waves engine: Realevate marquee verbatim** — measure-one-clone `m`, clone
   `max(3, ceil(2·vw/m)+1)`, tween `x: −m` (or `−m→0` reversed), `dur = m/vw·15·f`,
   `ease:"none"`, `repeat:-1`, wrap modifier; gap inside `m`. Horizontal sponsor waves +
   vertical opposing film rails via the `rotate(90deg) origin left top` wrapper (one rail
   inner `rotate:180deg`). Speed ≈ 80 px/s @1200 px starting point; low velocity, edge
   mask fades, offscreen-pause, reduced-motion = static grid (F §4.10).
3. **Clip-wipe + text-reveal tokens:** images `inset(50%→0%)` 1.5 s `power4.out` +
   scale 1.5→1 (preloader/hero curtain); body lines `inset(0 0 100% 0 → −40% 0 −28% 0)`,
   `yPercent 100→0`, `skewY −1→0`, 0.8 s `power2.out`, line stagger 0.09 / element 0.12;
   hero H1 `yPercent 140`, 1.0 s; triggers `top 90% → bottom 0%`; scrubbed scenes linear
   (`ease:"none"`); UI micro-durations 240–380 ms `cubic-bezier(0.4,0,0.6,1)` /
   `(0,0,0.2,1)`; preloader stepped counter `[27,42,68,92,99]` + navy wipe 1.2 s
   `cubic-bezier(.73,.15,.15,.99)`. (F/E motion tokens 0.8–1.1 s, stagger 0.08–0.14 /
   0.035–0.07 remain the envelope; R3 values sit inside it.)
4. **Lens portal = R2 ellipse-iris shader + R1/R2 video-chapter discipline:** port
   `shaders/custom-000.vert / custom-001.frag` defaults (`center 0.5,0.0; w 1.2, h 1.5;
   smoothness 0.2; opacity/scrim 1.0; opening bool`) with `progress` driven by lens scroll
   (ARCH wires); approach = frosted-blur panel over product ghost resolving to full-bleed,
   capped with an `Exit View`-style pill metaphor; portal chapter video `muted loop:true
   w1440` (5–8 MB class), always-visible pause control (ic! berlin pattern, E-06).
   Transmission/FOV/bloom values come from F §4.8, not from these teardowns (no WebGL
   captured on either Apple page).
5. **Craft chapters as two beats (R2 drawer + explosion, compressed):** white horizontal
   drawer (w820 loop videos, `< >` + pause, bold-lead captions) for hinge/velvet macro;
   black vertical exploded stack (glass→board→frame→seal along Y) reassembling to lens
   macro + one engineering-poetry spec line (ic! berlin "From 0.5 mm…" template, E-06).
   EyeQ needs 1 portal + 2 craft beats — not Apple's 8 chapters / 26 videos / 32 MB page.
6. **Restraint envelope (all three sites agree):** single-shot opacity/y reveals
   300–1000 ms `power2/3/4.out`; native cursor; fixed local nav only; no parallax beyond
   R3's `scrub: 0.3`; intro readable ≤ 1.8 s (playbook gate — R1 t700 ms, R2 t700 ms prove
   it; R3's 5–7 s intro is the counter-example, do NOT match it).

## 5. What NOT to copy (originality + anti-slop guards)

1. **No DOM iris exists to lift** — E-29's "iris-wipe analogue" is baked video footage,
   not a mechanism. EyeQ's lens iris must be original composition (own mask choreography
   + own renders); port R2's ellipse-shader *math* only, never Apple's ring-video look,
   black-silhouette lifestyle imagery, or chromatic-arc motifs.
2. **Do not copy value structure / type / voice:** not Apple's light `#f5f5f7` chapter
   rhythm or SF Pro scale (EyeQ inverts it: dark-room film → white), not Realevate's navy
   `#1F2B5E` / real-estate tone / 20vw center-gap hero, not any hype words (brief §7 bans
   VISION/FOCUS/CLARITY; luxury register = two-word chapters or engineering poetry).
3. **Do not carry their costs:** not 26 videos / 450 images / 473 URLs / 36-screen sprawl;
   not white-flash MPA reloads (EyeQ portal is an in-page iris blend); not always-on
   184 rAF/s + idle OGL bundle on static heroes; not SPA `#page-stage` transition
   machines, unpausable loops, modal stacks (P0 — zero popups in first three viewports),
   gradients/particles/glassmorphism (P1 — zero occurrences across all luxury refs).
4. **Do not misquote failures as values:** R1/R2 yielded ZERO pinned sequences, ZERO
   scrub values, ZERO stagger ms, ZERO tone-mapping/lights/materials (no WebGL on either
   page). Any plan citing "Apple pin vh / scrub factor / PBR settings" is fabricating —
   camera/3D numbers must come from Phase 3 renders + F §4, never from these teardowns.

## 6. Method note + follow-ups

- Commands (working dir project root): `VF=~/.agents/skills/visual-fidelity/scripts/vf`;
  `$VF teardown <url> --out .design/ref/<slug> --pages 5 --budget 420`. R1/R2 full;
  R3 PARTIAL (context crash 81 s) backfilled by live JS/CSS reads — all R3 mechanism
  values above are exact-from-source, flagged where frame-inferred.
- Failure recorded: R3 teardown browser-context crash (`browser.newContext: Target
  page…closed`, tool 120 s timeout) — fallback per brief: manual Playwright measurement
  of scroll length + timing, done and folded in above.
- Follow-ups for MOTION/ARCH lanes (not this lane): TAG Heuer / Andy Wolf AWE / Spellwood
  SOTD choreography deep-dive (E-10 leads); true vertical-rail hunt (E-32 still
  principle-only — R3's contact-rail rotation is now the closest measured precedent);
  Dior re-check (blocked, do not cite).

---

PHASE4-PLAN-REF-DONE
Summary:
- Tore down 3 live refs (AirPods Pro, Vision Pro, Realevate); artifacts in .design/ref/*.
- Key finding: Apple pages use sticky + video chapters, zero GSAP pins/scrubs/WebGL.
- Measured wins: Realevate marquee formula + 90° rail rotation; Vision Pro iris shader.
- Adopt: chapter pacing, marquee engine, clip-wipe tokens, iris-math-only portal.
- Guard: original composition only; never quote unmeasured pins/scrubs/PBR values.

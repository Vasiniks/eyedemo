# PLAN-MASTER — Phase 4 authoritative build plan (EyeQ Vision Care cinematic homepage)

- Status: PLANNING ONLY. No scaffold, no packages, no source code (short illustrative snippets only).
- Inputs merged: `PLAN-site-ia.md`, `PLAN-art-direction.md`, `PLAN-motion.md`,
  `PLAN-architecture.md`, `PLAN-reference-teardowns.md` + `docs/00-BRIEF.md` (§6b/§6c binding)
  + `docs/research/00-PHASE2-SYNTHESIS.md`, `A–G-*.md`, `B-content-inventory.md` (copy authority),
  `C-link-inventory.md` (destination authority).
- Skills applied: `awwwards-playbook`, `cinematic-scroll-storytelling`,
  `cinematic-gsap-lenis-motion-system`, `gsap-scrolltrigger-storytelling`,
  `build-threejs-scroll-worlds`, `design-motion-principles` (marketing/landing: primary Jakub,
  secondary Jhey, selective Emil), `no-ai-design-slop`, `marquee-loop`, `masked-reveal`.
- Binding orchestrator resolutions (§0) override any conflicting plan text.
- Do NOT touch: Blender live scene, `blender/`, `public/models/`, `assets/`
  (Phase 3 lane owns them; this plan consumes their outputs by contract in §5).

---

## 0. Binding decisions (orchestrator — non-negotiable)

1. **Wave 2 is spatial.** 8 insurer logos arrive from depth (spawn z-far → slots, expo-shaped
   arrival under scrub-linear master), per brief §4J–4L. ART's "stagger-fade only, never a second
   hyperspace" is REJECTED. Differentiation from Wave 1 is by composition/rhythm (§4, §6.4):
   shorter travel, tighter cadence, tighter/different settled layout, dimmer tier, smaller FOV
   kick, shorter streaks — not by removing depth.
2. **Film copy:** short claim-free editorial lines/chapter labels allowed ONLY as DRAFTS.
   Every drafted line lives in `docs/phase4/COPY-DRAFTS.md` (beat · line · why · alternatives)
   and is marked `DRAFT` in plan and code. Everything else byte-verbatim from B or brief §2.
3. **About:** 3 paras byte-verbatim incl. `Burlington` / `since 2018` (B §2). A separate
   client-approved Brampton-framing block may sit alongside (hairline-divided, never spliced in).
4. **Insurance:** only `We Accept Most Major Insurance Plans` (alt-caps render also verbatim).
   Never assert direct billing. Only permitted sub-line pattern: `COPY-DRAFTS.md` D11.
5. **Scroll budget:** dark ≈ 80% / white ≈ 20% of intro. Keep MOTION budget —
   **1000vh desktop (800 dark + 200 white) / 700vh mobile (560 + 140) / 800vh tablet** —
   unless a conflict forces change (none does; §6.1 keeps it).
6. **Phase 3 asset contract (authoritative, overrides all older dims/names):**
   case 208 × 70 × 41 mm lozenge shell; nodes `Case_Body`, `Case_Flap` (one-piece flap hinged
   along back long edge, opens ≈ 40° with slight end-lag flex); velvet = inner lining material
   `Velvet_Oxblood` (sheen) + velvet cushion; glasses nodes `G_Root` > `G_Front`, `G_Lenses`
   (both lenses one mesh), `G_Arm_R`, `G_Arm_L` (origins at hinge pivots; fold R +90°,
   L −85° + 4° tilt about local X); files `public/models/case.glb`, `public/models/glasses.glb`;
   glasses lie in case lens-side up.

---

## 1. Conflict resolutions (topic · A says · B says · decision · reason)

| # | Topic | Plan A says | Plan B says | Decision | Reason |
|---|---|---|---|---|---|
| C1 | Wave 2 mechanic | ART §2-Beat7: stagger-fade only, "never a second hyperspace" | MOTION §4 + SITE §2.1 + ARCH §2.4: same z-flight system, shorter/tighter | **Wave 2 = spatial arrival from depth**, differentiated per §0.1 (travel −10…−12m vs −18…−22m; stagger 0.008 vs 0.011; duration 0.045 vs 0.060; slots 0.7m baseline+scatter vs 1.1m 3-layer arc; Bone 68–76% vs 82–88%; FOV kick +3° vs +8°; streaks 30% length, 50% opacity) | Binding §0.1 + brief §4J–4L; ART's fade violates the brief |
| C2 | Flap open angle | ART Beat2: lid rotX 0→−105° | MOTION §3.2: 0→40° elastic (rejects 90°+); ARCH §2.4: 0→48° expo.out | **40°** with baked overshoot keys `0°@0 → 32°@0.55 → 43.5°@0.75 (+3.5°) → 38.2°@0.87 → 40.0°@1.00` + 2-segment tip-lag 10% | Brief §6 "slightly elastic, not a 90° box lid" + binding §0.6; 105°/48° rejected |
| C3 | Flap/glasses node names + axes | MOTION/ARCH/G: hinge Empty + runtime pivot groups; fold about Blender-Z ~85–95°; pivots `(±0.6827,−0.5842,0.3095)` pre-scale | Task §2 (Phase 3 as-built): `Case_Body`/`Case_Flap`, `G_Root`>`G_Front`/`G_Lenses`/`G_Arm_R`/`G_Arm_L`, fold R +90° / L −85° + 4° tilt about local X | **Use Phase-3 names/axes exactly** (§5). G pivots are the pre-scale measurement method, not the runtime address | As-built rig wins; plans consume it, never re-author |
| C4 | Case dimensions | E §Case: 156×60×28 → sculpted 165×62×26; MOTION §2: 0.165×0.062×0.026 | Binding: **208×70×41 mm lozenge** | All camera dolly distances scale ×1.26 vs MOTION numbers; FOV/fog/exposure unchanged; reframe QA against 208mm bbox | As-built asset wins; ratio 5.07:1.71:1 replaces 5.5–6.3 families |
| C5 | Film copy status | ART §2: placeholder display lines ("Precision starts in darkness", "Cut for one instrument", …) inline as staging | SITE/MOTION: slots reserved, `[COPY NEEDED]`, H1 belongs in white act not dark | **All non-verbatim lines are DRAFTS** in `COPY-DRAFTS.md` (D1–D17), marked `DRAFT` in plan (§6.5) and code; dark beats default to eyebrow-only if client rejects | Binding §0.2 + brief §6c.5; no claim/stat/promise in any draft |
| C6 | Camera numbers (3 competing sets) | ART §2: FOV 32°/40° mobile, macro 18°, pos `(0,0.04,0.34)`, fog 0.16→0.07→0, exposure 1.05→1.15→1.35→2.2 | MOTION §2: FOV base 35 (+9° mobile), keyframes table, fog 0.035→0.015→0.030, exposure 1.0→1.15→0.4 collapse + strips→6.0; ARCH §2.4: pos `[0,0.35,1.6]`, fov 32, fog 0.028→0.022→0.012 | **MOTION keyframe table is the spine** (§6.2; distances ×1.26 for 208mm case). Fog: MOTION densities (0.035 base, dip 0.015, return 0.030) in Void `#050607` — ART's 0.16 is scale-mismatched, rejected. Exposure: 1.0→1.15, portal waypoint 1.35, handoff 2.2 (union). ART vignette 0.32 / grain 0.06 desktop-only / ContactShadows 0.65 blur 2.2 adopted as look | MOTION is the only progress-mapped, mobile-overridden, portal-railed set; others supply look/material values |
| C7 | Light intensities | ART: Spot `#FFF2E2` 25→32→36→40, velvet Spot `#FF8A7A` 0→6, strips 4→12→20, env 0.35 | MOTION §2: key 0→2.5→1.2→1.8→0.4, rim→3.0, strips→4.0→6.0; ARCH: Lightformer rect 4 / 3 / 1.2 `#7a1420` | **Keep roles, tune gains against the 208mm render.** Implementation = ARCH Lightformer recipe + Environment studio HDRI; choreography = MOTION ramps; ART colors/angles (`#FFF2E2` key top-left −30°/+40°, `#FF8A7A` velvet ramp, `#E8F0FF` strips, grazing-angle mandatory B2–B3) | Units differ (physical vs arbitrary); intent agrees — dark-field/strip discipline per brief §6b is the contract |
| C8 | Rails speed/opacity/style | SITE: 2×96px, 100% opacity; ART: 96–120px, 40–60% opacity, full film-strip detailing; MOTION: 72px/s desk / 44 mob; REF: Realevate formula, ≈80px/s @1200px | **Rails = DOM vertical marquees, Realevate engine** (measure-one-clone `m`, clones `max(3,ceil(2·vw/m)+1)`, `x:−m`, `dur=m/vw·15·f`, `ease:none`, `repeat:-1`, wrap; vertical via `rotate(90°) origin left top` wrapper, one rail inner `rotate:180°`), **speeds 72 desk / 44 mob px/s** (±15% scroll-velocity coupling, lerped 400ms; hover 72→20, 400ms), **film-strip matte per ART §4.4 at 40–60% rail opacity**, masks, IO-pause, visible pause control, RM static grid | MOTION speed wins (restraint); ART opacity/styling wins (anti-cheap); REF mechanism wins (measured) |
| C9 | Text-reveal tokens | ART: word-mask yPercent 110→0, 0.7–0.9s, stagger 0.025–0.045, `top 82%`, once | MOTION: line-mask 0.9s expo.out stagger 0.09 `top 82%` once; body fade-up y32→0 0.85s; image clip 1.1s + img 1.08→1 1.2s; parallax ≤0.18. REF: clip `inset(50%→0%)` 1.5s power4.out + scale 1.5→1; lines `inset(0 0 100%→−40% 0 −28%)` yPercent 100→0 skewY −1→0 0.8s power2.out stagger 0.09/0.12; H1 yPercent 140 1.0s | **Dark captions: word-mask** (ART values). **White headlines: line-mask** (MOTION 0.9s/expo.out/0.09 as primary; REF values = allowed envelope). **Images: clip 1.1s expo.out + scale 1.08→1** (MOTION restraint; REF 1.5s/1.5 = hero-curtain max only). Easing family: `expo.out` reveals, `expo.inOut` curtain/portal/handoffs, `power2.out` micro, `linear` scrubs/rails | One family (MOTION §7); each skill value assigned to its layer, no mixing |
| C10 | Routes | SITE: `/ /services /contact /frames /frames/<handle> /policies/* /search?q=` + 301s | ARCH: Home, Services/Contact/Policies/Catalog equivalents, BrowserRouter + `dist/404.html` + `_redirects`, HashRouter fallback | **SITE route table is authoritative; ARCH implementation is authoritative** (§7) | SITE is concrete (B §0 + C destinations); ARCH is the build mechanism |
| C11 | Lenis on touch | SITE §5: Lenis OFF on touch (native + `scrub:1.0`) | MOTION/ARCH: single Lenis owner (no touch carve-out) | **Lenis ON desktop, OFF on touch** (native scroll; `syncTouch:false`); `scrub:1.0 anticipatePin:1` both | iOS stability + perf; F §4.11 risk |
| C12 | Preloader timing | SITE: counter ≤1.1s power2.inOut, curtain `inset(0 0 100% 0)` 900ms power4.inOut, ≤1.8s readable, exit even if media lags | MOTION: counter ≤1200ms + curtain yPercent −100 800ms expo.inOut @1200ms, chain +150/+450/+700. ARCH: `useProgress` weight-driven + staged Suspense. REF: steps `[27,42,68,92,99]` tick 0.6s expo.out, navy wipe 1.2s `cubic-bezier(.73,.15,.15,.99)`, timeout 12s | **Progress by required asset weight** (ARCH; never fake timer), display quanta REF steps, timing ≤1.1–1.2s + 800–900ms curtain, hero ≤1.8s, exit even if media lags (poster+skeleton), skip logic per SITE §4 | Union: truth (ARCH) + cadence (REF) + gates (SITE/MOTION) |
| C13 | Portal implementation | REF: port R2 ellipse-iris shader + frosted-blur + portal video 5–8MB w1440 | MOTION/ART/ARCH: 80% camera path + bloom + DOM veil, 20% shader; no custom GLSL by default | **Choreography portal** (dolly + bloom + exposure + DOM veil with `circle()` iris mask, E-29). R2 iris MATH available as veil-mask option. No portal video. Custom GLSL = stretch only (re-plan + perf proof) | Cost guard (REF §5.3) + F §4.8; video/shader rejected as default |
| C14 | Perf tiers (3 envelopes) | F §4.12: DPR 1.25/1.5, tris 150–300k / 500k–1.2M, draws 50–90 / 90–160, transfer 3–6 / 5–10MB | MOTION §8.2 + ARCH §4 (see §9) | **ARCH tier table wins** (adds RM tier, `transmissionResolutionScale`, MeshTransmission carve-out), capped by desktop tris **350k max** (restraint; glasses 52.6k + case + scene fit), draws 35–45 film proven, JS ≤350KB gz/route | Most specific + strictest consistent envelope |
| C15 | White landing color | ART: Paper `#F5F1E8`, ramp 800ms expo.out + 200ms hold | MOTION: bone `#f5f1e8` → paper `#fff` (ART owns tokens) | **Land on Paper `#F5F1E8`** (never pure `#FFF`); Card-white `#FFFFFF` for booking card only | ART token + critic P0-5 |
| C16 | Lens names in film | B-recommended: Essilor as Wave 2 | Brief §6c.1 overrides: Wave 2 = insurers; Essilor = info beat | **B5 info beat = 7 Essilor names** (tracked micro-caps, unlinked, ® intact); full descriptions reserved for white act/services | Brief overrides research recommendation (MOTION §4.4 records this) |

---

## 2. Design tokens (ART owns look; values frozen here)

### 2.1 Color

| Token | Hex | Usage |
|---|---|---|
| `Void` | `#050607` | Page base, film stage, fog match. ~70%+ of dark act |
| `Stage` | `#0A0C0E` | Sticky canvas bg, black section alt, inverted lenses block |
| `Graphite-800` | `#121519` | Card fill on black, dark ledger rows |
| `Graphite-700` | `#1B2027` | Case mid-tone ref, dark UI fills |
| `Graphite-600` | `#262D36` | Case edge-highlight ref, strong hairlines on black |
| `Steel-edge` | `#4B5563` | 1px edges / chamfer catchlights only, never flat fill |
| `Muted-on-dark` | `#8F97A3` | Captions on black only, min 13px, never body |
| `Velvet-shadow` | `#22060A` | Velvet fold shadow (3D base) |
| `Oxblood` | `#4B0F16` | Velvet mid-tone. Beats 2–3 only; elsewhere max 3px bookmark / 8px ticket edge. Never text/button/flat bg |
| `Oxblood-lift` | `#641420` | Velvet fold highlight where grazing key hits (3D only, no DOM) |
| `Sheen` | `#8E2E38` | Lamp-catch tint 22–32% opacity inside render only (no DOM) |
| `Bone` | `#E9E2D3` | Primary text on black (13.2:1 on Void). Wave-1 logos 82–88% |
| `Bone-dim` | `#C5BCA6` | Secondary on black (7.1:1). Micro-caps |
| `Paper` | `#F5F1E8` | White-act bg. Landing color (never pure `#FFF`) |
| `Card-white` | `#FFFFFF` | Booking card, inputs, featured review on Paper only |
| `Ink` | `#131417` | Primary text on light |
| `Ink-body` | `#2A2B2E` | Body on light |
| `Ink-muted` | `#5E5B54` | Meta on light, min 14px |
| `Lamp-amber` (sole accent, <2% viewport) | `#D9A441` | Hours-open 8px dot, stars 16px, active tick 24×2px, focus ring 2px, CTA arrow. Never large fill / on oxblood / display type |

Retired live-site colors (never use): `#FFDE59` hero yellow, `#A42325`/`#B9272A` maroon CTA,
`#EE9441` orange, `#028989` teal, gradient banner art. Inter survives (body face); star semantic
rebuilt in Lamp-amber.
Ratio targets: dark act ≈ 82% Void/Stage, 12% Bone, 5% graphite, 1% oxblood+amber.
White act ≈ 78% Paper, 18% Card-white, 4% Ink. Matches brief 80/20.

### 2.2 Type (Fraunces display + Inter UI, confirmed per E Pairing 1)

- Display **Fraunces** 300 (headlines) / 400 + 400-italic (one emphasized word max/headline).
  `opsz` 72, SOFT 50, WONK 1. Tracking −0.02em. Leading 0.95–1.02.
- UI/body **Inter** 400 body / 500 labels+buttons / 600 numerals only.
  Tracking −0.01em body, +0.18em micro-caps.
- Micro-cap (restraint device): 11px Inter 500 upper +0.18em, Bone-dim / Ink-muted,
  precedes headline with 12px gap + 24px hairline. Max one eyebrow per three sections.

| Role | Size | Leading | Contrast |
|---|---|---|---|
| Display | `clamp(48px,6vw,96px)` Fraunces 300 | 0.98 | Bone on Void (scrim §6.2) |
| H2 | `clamp(30px,3.4vw,48px)` Fraunces 300 | 1.02 | same |
| H3 | 22px Fraunces 400 | 1.15 | same |
| Body | 16px/26px Inter 400 | 1.6 | Bone / Ink-body |
| Small | 14px/22px Inter 400 | 1.55 | Bone-dim / Ink-muted |
| Micro-cap | 11px Inter 500 upper | 1.4 | Bone-dim / Ink-muted |
| Lens-name list (B5) | 13px Inter 400, roman, ® 60%, never bold | 1.5 | Bone on Void |
| Numerals | Inter 600 tabular-nums | — | — |
| Mobile H1 @390 | `clamp(2.25rem,9.2vw+1rem,3rem)` → 36px/36 | — | — |
| Mobile H2 / body | 22px / 15px/24 | — | — |

Rules: one Fraunces per viewport. Never italic Fraunces over moving 3D. Reveals §8.2 only.
Grep-block: VISION/FOCUS/CLARITY standalone, `premium/ultimate/best-in-class/award-winning`,
version pills, eyebrow-every-section.

### 2.3 Grid / spacing / radii / hairlines

- Desktop ≥1024: 12 col, margins `clamp(32px,4vw,72px)`, gutter 24px. Headline measure ≤560px/~22ch.
  Film DOM text cols 1–5 left, bottom-anchored 12–16vh; 200px clear radius around lens/bridge.
- Tablet 768–1023: 6 col, margin 32px, gutter 20px. Film text bottom-sheet ≤480px.
- Mobile <768: 4 col, margin 20px, gutter 16px. Object top 45vh, text bottom sheet.
- Spacing scale: `4·8·16·24·32·48·72·112·168`. Section padding 112–168 desk / 72–96 tab / 56–72 mob.
  Headline→body 24, body→CTA 32, label→headline 12.
- Radii: `2px` hairline cards/frames/reviews; `8px` photography/media only; `999px` status pill +
  hours-dot container only. No 16–24px soft cards.
- Hairlines 1px, no shadows/blur. Black: `rgba(233,226,211,0.14)` / strong `0.24`.
  Light: `rgba(19,20,23,0.14)` / strong `0.22`. Full-grid dividers; sections structured by
  hairlines, not boxes. Services ledger / reviews 1+5 asymmetric / lenses inverted rows.

---

## 3. Site map + page list

Labels uppercase `HOME` `SERVICES` `CONTACT` (B §1). No blog, promos, account, cart routes.

| Route | Purpose | Sections (order) | Copy source | CTAs → exact destinations |
|---|---|---|---|---|
| `/` Home (only cinematic page) | Convert + prove + ground | Film dark 80% → white 20% (§6) → rails bridge → About+video → Services précis → Lenses → Reviews → Visit → footer | B §2 (H1/CTA/about/brands/reviews), B §4 (7 lens names, info beat), B §5 (insurance heading), brief §2 (new-store facts) | `BOOK YOUR EYE EXAM TODAY!` → `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` (`_blank rel=noopener`, C §1). `Get directions` → rebuilt `https://www.google.com/maps/dir/?api=1&destination=2-227+Vodden+St+East%2C+Brampton%2C+ON` (`_blank`). `tel:+19054970227`. `mailto:eyeshine2020@gmail.com` |
| `/services` | Clinical + optics + insurance proof | 1 `Services` H1 2 three intro paras verbatim 3 `Accurate Prescription Fittings`+one-liner 4 `Comprehensive Eye Exams`+desc+`Book your Eye Exam today` 5 `Our Popular High-Definition Lenses` (4 names) 6 Essilor slideshow (3 slides+verbatim descs) 7 `We Accept Most Major Insurance Plans`+8 logos 8 visit strip 9 footer | B §3, B §4 (all 7 + 3 descs), B §5 (heading+8 order), brief §2 | `Book your Eye Exam today` → same scheduler URL, **same-tab** (matches live, C §2). Lens/insurance images unlinked (C §2) |
| `/contact` | Visit facts. No form (none exists, C §3) | 1 `Contact` 2 `PHONE`→new 3 `EMAIL`→new 4 `ADDRESS`→new 5 `HOURS`→brief §2 6 map embed + `GET DIRECTIONS` 7 footer. No fax row | Labels B §8 (structure), values brief §2. Embed `https://maps.google.com/maps?q=2-227+Vodden+St+East%2C+Brampton%2C+ON&t=m&z=15&output=embed&iwloc=near` | `tel:+19054970227` (fixes malformed `tel:(905)3333931`). `mailto:eyeshine2020@gmail.com`. Directions rebuilt URL above |
| `/frames` + `/frames/<handle>` | 22-product catalog reachable, not featured (synthesis §1). No nav slot; footer + Services eyewear mention link | Index filter `All / SUN / OPTICAL` (16 SUN + 5 OPTICAL + 1 untyped Prada, B §10) + search; cards: model + vendor + type. Detail: gallery, verbatim desc where present (`RB3025 Aviator`, `PO0649 Original`), HIGHLIGHTS where present | B §10; homepage 4-card names `Persol PO0649/PO2803S/PO3210S/PO3272S` (B §2) | No checkout (cart CSS-hidden live, C §4). Detail CTA = `Call 905-497-0227` + `Book an eye exam`. NEVER render `$0.00`. `[COPY NEEDED: price/availability policy → COPY-DRAFTS D16]` |
| `/policies/refund-policy`, `/policies/privacy-policy`, `/policies/terms-of-service` | Legal preservation via footer "Terms and Policies" (matches live, C §1) | Body as today; store strings replaced once supplied | B §11, B §8 record-only | Inline contacts → new values. `[COPY NEEDED: Brampton legal entity + returns contact]` |
| `/search?q=` | Preserve predictive search (C Key finding 6) | Client-side filter over 22-product index + anchors (lens names, services, visit) → `/frames/<handle>` or page anchor | B §10 + B §4 | Empty state → COPY-DRAFTS D14 |

Dropped (reason): `/blogs/news` (empty heading, B §0); `/cart` (hidden theme-wide, C §4);
account sheet (signed-out Shopify, no navigation, C §1; static rebuild has no customer system);
old-store block/map/fax, `Powered by Shopify`, promos/socials/form (nonexistent — not invented).
Redirects (zero broken links today, C §7): `/pages/services`→`/services` (301),
`/pages/contact`→`/contact` (301), `/collections/ray-ban-sun|persol|prada`→`/frames` filtered (301),
`/products/*`→`/frames/<handle>` (301), `/policies/*` unchanged.

### 3.1 Header / menu / footer / preloader-first-visit

- Header (persistent minimal, never fully hidden): transparent over dark → translucent blur
  (`backdrop-filter:blur(20px)`, `rgba(5,6,7,.55)` dark / `rgba(255,255,255,.82)` white) after 120px.
  Left: official logo (white variant dark act / black white act — shape-identical, client-confirm).
  Right: `Book an exam` pill (scheduler, `_blank`) + `Menu` 44×44. 64px desk / 56px mob.
  Hide-on-scroll-down past 120px, reveal on scroll-up or act change; Book pill never unmounts.
  Press scale .97, 160ms ease-out. Native cursor only.
- `Skip film ↓` text-button bottom-centre above fold, sticky during dark act only, first tab stop
  after `Skip to content`, shortcut `S`, fades 200ms on use → white-act anchor. 2px film progress bar.
- Menu: `100vw×100dvh` overlay (not drawer), crossfade 250ms ease-out, scale .97.
  Items `Home→/` · `Services→/services` · `Contact→/contact` · `Browse frames→/frames` ·
  `Search` (initial focus) · `Book an eye exam` (scheduler, `_blank`) + footer row (policies trio +
  `tel:+19054970227` + address + short hours). Mobile ≤600 adds 56px bottom-sticky BOOK bar
  (Visit context only). Focus trap, ESC restores focus, `aria-modal`, scroll lock. No submenus.
- Footer: store block (address/directions/phone/email/hours) → `Terms and Policies` expander
  (Refund/Privacy/Terms) → `© <year> EyeQ Vision Care` → `Browse frames`, `Replay film`,
  `Back to top`. Map embed lives in Visit (§4), not repeated. White-on-black ≥7:1; black-on-white ≥4.5:1.
- Search keep / account drop / cart drop per table above (§3).
- Route transitions: View-Transition crossfade 200ms opacity-only (no directional slide); only
  shared-morph = catalog thumb→detail. Film never replays on route change.
- First visit preloader: brand-mark fade 600ms + counter 0→100 ≤1.1s `power2.inOut` (display quanta
  `[27,42,68,92,99]`, tick 0.6s `expo.out`) + curtain `clip-path:inset(0 0 100% 0)` 900ms
  `power4.inOut`; hero readable ≤1.8s; progress by required asset weight (never fake timer);
  staged Suspense (case+env first, glasses+atlases after); poster+skeleton behind; exits even if
  media lags. Return same-session: `sessionStorage["eyeq-film-seen"]=1` at first white-act arrival →
  land at white-act anchor, 800ms fade, film skipped. Cross-session: `localStorage` variant shortens
  to ~200vh abridged pass (not full skip). `Replay film` clears flag. Deep links never force film.
  Reduced-motion / no-JS: no preloader, no pin (§10).

---

## 4. Rest-of-homepage order (below film; all on Paper until footer)

One focal point per viewport. Booking re-appears at R1-adjacent header, R5, white act, menu.

| # | Section | Contents (verbatim) | Why here |
|---|---|---|---|
| R1 | About `ABOUT US` + video | Self-hosted MP4 (B §2 URL), click-to-play `PLAY VIDEO`, poster, muted/loop/controls + 3 paras verbatim (`Welcome to EyeQ Vision Care. Since opening our doors in 2018, we have proudly served the Burlington, Ontario community…` + para 2 + para 3) + separate D13 Brampton block (hairline-divided, `[COPY NEEDED]` wording) | Trust after spectacle; history preserved, present grounded |
| R2 | Services précis | `Comprehensive Eye Exams` + `A complete assessment of your vision and eye health, including prescription testing and screening for common eye conditions.` · `Accurate Prescription Fittings` + `Accurate prescription fitting to ensure clear, comfortable vision tailored to your needs.` · `children's eye exams` + `contact lens fittings` (names only — no other descriptions exist) → `Services` → `/services`. Ledger rows 01–04, Fraunces numerals 28px, 32px row padding, hairline dividers; left sticky H2 | Clinical substance before commerce |
| R3 | Lenses `Our Popular High-Definition Lenses` | 7 names; 3 with descriptions (Stellest/Transitions/Xperio) trimmed to first sentence + `Read more → /services`. Single inverted block (Stage `#0A0C0E`), 22px Fraunces rows + use-case micro-caps right, 14/22 Bone-dim descs, one 4:3 material close-up 8px radius (Blender/forge render or licensed photo, credited) | Optics story pays off the portal |
| R4 | Reviews `WHAT OUR CUSTOMERS SAY` + `Real reviews from real customers` + `4.9` `(208 reviews)` | All 6 texts verbatim, initials exactly `SW/H/NZ/AH/LL/EP` (incl. `Honsa` spelling, B §7). Static cards (1 featured Card-white + 5 compact two-col, 2px radius, 1px hairline, no shadows). Aggregate only — no per-card stars (widget shows none, B §7). No "write a review" CTA | Honest proof band; static = credible |
| R5 | Visit `VISIT OUR STORE` | New address + `GET DIRECTIONS` (rebuilt URL) + map embed rebuilt query + click-to-activate overlay (C §5) + phone + email + hours (brief §2) + `BOOK YOUR EYE EXAM TODAY!`. Split: left hours/address/phone ledger (16px rows, hairlines), right Card-white booking card (48px Ink CTA + email underline). No form | Practical close |
| R6 | Footer (Void) | §3.1 | Wayfinding + legal + replay |

NOT on homepage: catalog cards (stay `/frames`); insurance logo grid (film Wave 2 + right rail carry
marks; full grid on Services); contact form, promos (do not exist).

---

## 5. 3D asset contract (Phase 3 → Phase 4; consume, never re-author)

> **ORCHESTRATOR OVERRIDE — ACTUAL DELIVERED ASSETS (supersedes the table below where they differ; see `docs/phase3/PHASE3-REPORT.md`):**
> - `public/models/case.glb` (10 MB raw → Lane D must condition to ≤1.5 MB with gltf-transform: meshopt + quantize; keep morph targets + node names). Shell is **198 × 70 × 42 mm** (not 208; scale any "×1.26 vs 165 mm" dolly factor to ×1.20). Nodes: `Case_Root` > `Case_Body`, `Case_Flap`, `Velvet_Cushion`. Materials: `Case_Graphite`, `Case_EdgeMetal`, `Velvet_Oxblood`, `Logo_Gloss`.
> - **Flap = 4 morph targets** on `Case_Flap`: `Open10, Open20, Open30, Open40` (absolute poses at 10/20/30/40°, ends lag 15%). Runtime for angle a∈[0,40]: `w_k = max(0, 1 − |a/10 − k|)` for k=1..4 (hat interpolation). Elastic overshoot = drive a slightly past 40 (e.g. 42) then settle to 40 — clamp weights ≥0.
> - Logo is real deboss geometry 0.75 mm deep, 60 mm wide on the crown (glossy recess, flat-shaded). There is NO separate flank "EyeQ Vision Care" engraving — the official logo already contains "EYE" + "VISION CARE". Do not add text geometry.
> - `public/models/glasses.glb` (1.4 MB): `G_Root` > `G_Front`, `G_Lenses`, `G_Arm_R`, `G_Arm_L`. Exported **OPEN** (arm rotations 0). `G_Root` already carries the lying pose (rot −90° X) and its seat offset inside the case — load both glb files into the same parent at origin and the glasses sit in the cradle. Folded pose = runtime: `G_Arm_R.rotation.z(Blender Z → three.js −Y axis after Y-up export; verify visually) = +90°`, `G_Arm_L = −85°` plus `+4°` about local X. Verify axes empirically in the viewer — acceptance = folded arms lie behind the lenses, not through them.
> - Lens materials already dark smoke transmission + bright polished edge material (`01_Glasses_Side.001`) for rim-light glow — lighting must hit those edges (Lightformer strips).
> - No `scene.glb`, no HDRI delivered — Lane D sources one studio HDRI (Poly Haven, CC0) or uses drei `Environment` + `Lightformer` only.

| File | Contents | Budget |
|---|---|---|
| `public/models/case.glb` | Lozenge shell 208×70×41mm; nodes `Case_Body` + `Case_Flap` (hinge = back long edge); lid crown deboss logo geometry (~0.4mm) + `EyeQ Vision Care` flank micro-engrave; inner lining material `Velvet_Oxblood` + velvet cushion (fold geometry, baked AO) | ≤1.2 MB; total all three ≤2.5 MB |
| `public/models/glasses.glb` | `G_Root` > `G_Front` (static: bridge/tabs/barrels/wires/caps/nose — never deforms), `G_Lenses` (both lenses ONE mesh), `G_Arm_R`, `G_Arm_L` (origins at hinge pivots). Black metal (Metallic 1.0, Rough 0.35–0.45; barrels/wires 0.25), black acetate tips (Base 0.008, Rough 0.3, Clearcoat 0.6/0.25), smoke lenses (Transmission 1.0, IOR 1.52, attenuation dark grey-green, Rough 0.02, thickness ~0.002/2mm), nose dark silicone (Transmission 0.6, Rough 0.4). Tortoise 4K map + steel bump DROPPED (watermark + 4.9MB) | ≤900 KB; 52.6k tris kept, no decimation |
| `public/models/scene.glb` (optional set) | Dark set geometry only (no baked lights): plinth/bed, practicals | remainder of 2.5 MB |
| `public/env/studio_small_2k.ktx2` (or `.hdr`) | ONE studio HDRI, 2k max (1k if swatch passes) | ≤1.5 MB |
| `public/web/brands-light/*` (8) + `public/web/insurance-light/*` (8) + `public/web/eyeq-logo-white.*` | Single-color light knockouts, shape-identical (client-confirm, synthesis §7), unlinked everywhere | ≤80 KB each |
| `public/fonts/*.woff2` | Fraunces variable + Inter variable, latin subsets | ≤120 KB total |

Rig behavior (runtime, §6.3): flap `Case_Flap` 0→40° baked-elastic keys (§1-C2) + tip-lag 10%;
glasses `G_Arm_R` +90° / `G_Arm_L` −85° + 4° tilt about local X from folded rest (file stores
folded pose lying in case lens-side up); emergence y +90mm→0, rotX 12°→0°; unfold L leads,
R = L(p−0.08); junction crack check at 0/45/90° is a Phase-3 gate. Camera/scale note: all
MOTION dolly distances ×1.26 vs 165mm authoring to reframe the 208mm shell; FOV/fog/exposure
unchanged. Conditioning: KTX2 (sRGB color only), meshopt OR Draco (never stacked),
position quant ≥14-bit on logo-relief mesh, +Y up / metres / applied transforms / pivots preserved;
round-trip each `.glb` in clean viewer + `useGLTF` before choreography. Atlases: brands
2048×2048 + insurers 2048×1024, contain-fit cells, alpha-aware bake (green-RGB quirk D §7.5:
premultiplied=false, verify 400% zoom), planes `alphaTest:0.4 depthWrite:true toneMapped:false`.
Decoders self-hosted `public/decoders/`, never gstatic CDN.

---

## 6. Unified beat table (authoritative; progress · vh · camera · objects · lights · DOM · easing)

Conductor: ONE `gsap.timeline({defaults:{ease:"none"}, scrollTrigger:{trigger:"#film-pin",
start:"top top", end:"+=800vh" desk / "+=560vh" mob, scrub:1.0, pin:true, anticipatePin:1,
invalidateOnRefresh:true}})` + `addLabel()` per beat. Scrubbed tweens `ease:"none"`
(scroll IS timing); arrival curves baked into keyframes (expo-shaped values). `p` = master progress
0→1 over dark pin; white act = second unpinned region, handoff at p=1.0. R3F reads `p` from
mutable ref `filmProgress {p, beat}` (sole 3D input) + damped `rig.smooth = damp(target, λ=5.2)`;
`rig.target` exact for nav/a11y. No `ScrollControls`, no `ScrollSmoother`, no second ticker:
`lenis.on('scroll',ScrollTrigger.update)` + `gsap.ticker.add(t=>lenis.raf(t*1000))` +
`lagSmoothing(0)`. Weights 10/15/15/15/15/15/7/5/3 = 100 dark units; 1 unit = 8vh desk / 5.6vh mob.
White 25 units = 200vh desk / 140 mob. Boundaries = cumulative/100.

Global 3D: ACESFilmic, studio HDRI 1–2k, exposure 1.0→1.15 → waypoint 1.35 (portal) → 2.2
(handoff, then canvas RAF-gated off). Background + FogExp2 Void `#050607`; density 0.035 base →
0.015 waves dip → 0.030 approach → 0 under veil. Vignette 0.32, grain 0.06 desk-only,
ContactShadows 0.65/blur 2.2. Camera perspective near 0.01 / far 60 (near→0.002 B8–B9 only).
Canvas fixed z-0 `aria-hidden pointer-events:none`; DOM captions z-10 at edges; hero centre-right;
safe cone 0.5m around hero; local scrims only (120px behind copy, bottom-40% `rgba(5,6,7,.55)`
single permitted shape); object centre ≈58–62% vh desk, 540–680px wide (×1.26 reframe for 208mm).
FOV base 35 desk / 44 mob (+9°); macro 18°. Everything pure function of `p` (reload-at-depth,
drag, flick, reverse, resize-mid-beat reproduce identical state). Mobile: pullback ×1.45
(orbit r 0.40m, dive 0.40m out), 3D window 60vh sticky + copy bottom-sheet (20px margin,
bottom-40% scrim `rgba(5,6,7,.55)`), dolly+rise only (no full orbit), lens clear-radius 200px.

| # | Beat (weight · p · vh desk/mob) | Camera (desk; mob ×1.45 radius, +9° FOV) | Objects | Lights | DOM text (verbatim or `DRAFT→COPY-DRAFTS`) | Easing |
|---|---|---|---|---|---|---|
| B1 Case reveal (10 · 0.00–0.10 · 80/56) | `(0.18,0.10,0.32)→(0.14,0.12,0.29)` ×1.26; tgt `(0,0.010,0)`; FOV 32→33. Macro graphite 3/4, ~55% vh | `Case` group opacity 0→1 + scale 0.92→1.0 (first 40%); deboss catches at p≈0.06 (0.1mm bevel, no emissive) | Key `#FFF2E2` 0→2.5 top-left (−30°,+40°); hemi `#1A1D24` 0.25; strips `#E8F0FF` 4 low; env 0.35; velvet light OFF | Eyebrow `DRAFT D1` only (H1 NOT here). No CTA/body/headline over first frame | Scrub linear; caption `expo.out` 900ms |
| B2 Open/velvet (15 · 0.10–0.25 · 120/84) | Push 0.30→0.26m ×1.26, ±6° arc | `Case_Flap` 0→40° baked keys (§1-C2) about back-long-edge hinge + tip-lag 10%; iris `clip-path:circle()` veil opens | Velvet ramp Spot `#FF8A7A` 0→6 (15% behind flap); sheen 0.4→1.0, sheenColor `#FF3040`, sheenRough 0.5→0.32; key 25→32 equiv; oxblood lower third; no text over sheen hotspot | Eyebrow `DRAFT D3` + display `DRAFT D4` (crossfade from B1, shifts up 24px, out at end) | Baked-expo keys, scrub linear |
| B3 Emerge (15 · 0.25–0.40 · 120/84) | Hold 0.26m ×1.26, tilt −4° to velvet | Folded glasses (R+90°/L−85° rest) y +0.090m→0, rotX 12°→0°, opacity 0→1 (first 30%); R tip +3mm depth offset (no clip); idle bob ±1.5mm@0.4Hz begins | Key→36 equiv; dark-field strips 0→4.0 sweep; lens edges ignite mid-beat; velvet Spot holds 6 | Eyebrow `DRAFT D5`. No body — geometry leads | Scrub linear |
| B4 Unfold (15 · 0.40–0.55 · 120/84) | Macro swing: dolly 0.26→0.22m ×1.26, azimuth −18°→+18°; focus hinge barrels/wires | `G_Arm_L` then `G_Arm_R` = L(p−0.08): 85°→0° baked `85°@0 → 0°@0.82, overshoot −7°@0.82 → +2.5°@0.92 → 0°@1.00` (sign tuned to handedness); `G_Front`/`G_Lenses` static; hover idle starts at end | Strips hold 12→high equiv; key→40; lens-edge glow ramps (fresnel pow 3.5, uApproach 0→1 → rim 0.5→3.0) | DOM top-left 10vh. Eyebrow `DRAFT D6` + display `DRAFT D7` (≤6 words) | Baked `expo.out`-shaped angles, scrub linear |
| B5 Info+orbit (15 · 0.55–0.70 · 120/84) | Slowest orbit ±12° (Catmull-Rom 24-pt ONLY here; segment lerps elsewhere), 0.22→0.30m ×1.26 ease-out; glasses sharp, case soft | Idle holds; no new object motion (restraint before waves) | Key hold; strips hold; exposure 1.05→1.15; no new lights | Eyebrow `DRAFT D8` (or verbatim `Our Popular High-Definition Lenses`) + display `DRAFT D9` + **7 Essilor names verbatim** (B §4, 13px Inter roman, ®60%, hairline dividers, unlinked, one per ~17vh, word-mask 90ms stagger): `Varilux® Physio Extensee™` · `Distinctive® Superior` · `Distinctive® Enhanced` · `Distinctive® SV Lenses` · `Essilor Stellest® 2.0 Lenses` · `Transitions® Lenses` · `Xperio® Lenses`. H1 NOT here (white act only) | Scrub linear; text `expo.out` |
| B6 Wave 1 brands (15 · 0.70–0.85 · 120/84) | Pull back 0.30→0.55m ×1.26 centred; glasses drift right-third, defocus ~40%; FOV 35→43 (+8°) →35 | 8 planes (0.28×0.14m @accumulation, scale=dist×k) spawn z −18…−22m (scatter x±6/y±3 seeded) → slots: **1.1m arc, 100° sweep, −8° tilt, 3 depth layers** (front 100% Maui Jim/Ray-Ban; mid 82%+2px blur Prada/Miu Miu/Persol; back 64%+4px blur Oakley/Tiffany/Versace); boxes 110–160×28–40px, gaps ≥64h/48v, ±14px seeded jitter; per-logo flight 0.060p, stagger 0.011p; arrival `e=1−pow(2,−10t)` baked; persist as camera drifts (accumulates); post-settle hover y±0.006m@5s phased; `lookAt(camera)`; last settles ≥0.015p before end | Strips hold; fog dip 0.035→0.015; bloom threshold so only streaks bloom; exposure 1.0→1.15 | Left micro-label `DRAFT D10` only. Logos Bone `#E9E2D3` 82–88%, `alphaTest:0.4 depthWrite:true toneMapped:false`, 1024px cells; unlinked; order: Maui Jim, Ray-Ban, Prada, Miu Miu, Persol, Oakley, Tiffany & Co., Versace | Arrival expo baked, scrub linear; streaks `power2.out` 300ms scrub-evaluated |
| B7 Wave 2 insurers (7 · 0.85–0.92 · 56/39) | Hold 0.55m ×1.26; FOV 35→38 (+3°) →35 (NOT +7–8°) | 8 planes spawn **z −10…−12m** (shorter travel) → slots: **0.7m formation, uniform baseline + scattered second row, pitch ×0.8, gaps 56px** (different layout vs W1 arc); boxes 90–128px wide (min 120×40 enforced); flight 0.045p, stagger 0.008p; heading caption first (word-mask 800ms expo.out), then flights; streaks 30% length, 50% opacity; outer arc so 16 planes read together at p≈0.90 (alpha budget 12–20) | Key −15%, strips 12→8 equiv; logos dimmer tier | Centred heading verbatim `We Accept Most Major Insurance Plans` (Fraunces 30–38px) + sub `DRAFT D11` (16px, never billing language). Logos Bone 68–76%, unlinked, order: Sun Life, Medavie Blue Cross, Manulife, GreenShield, Canada Life, Desjardins, IA Financial Group, Empire Life | Same baked-expo family, shorter window; scrub linear |
| B8 Lens approach (5 · 0.92–0.97 · 40/28) | Straight rail along right-lens normal (≈(−0.08,0.02,0.97) glasses-local; recompute from baked transform; left lens mirror backup) 0.30m→0.045m ×1.26; FOV 35→48; near 0.01→0.002; idle damped to 0; temples/velvet fade via opacity inside 20mm | Lens `MeshPhysicalMaterial`: transmission 0→0.9, rough 0.05–0.12, ior 1.1→1.45, thickness 0.002→1.0 (tune), spec 1, clearcoat 1, smoke attenuation (never opaque); Lightformer strips sweep; AR iridescence 0.35 green-magenta; edge fresnel 0.5→3.0 | Strips→6.0 edge fire; key→0.4; fog back 0.030 (lens vs black) | No copy — geometry leads | Scrub linear |
| B9 Lens entry→white (3 · 0.97–1.00 · 24/17) | Near-plane crosses lens plane (+normal×0.045m → −0.04m behind) UNDER white veil; FOV 48→68→55 settle | Transmission distortion pulse (desktop only, `chromaticAberration 0→0.35→0`, `distortionScale 0→0.5`; fullscreen CA never); bloom 0.15→0.6→1.4 (threshold 0.85→0.6, radius 0.4→0.7); exposure→2.2; canvas opacity 1→0 450ms; RAF-gated offscreen | All 3D irrelevant under veil | White veil `#white-veil` opacity 0→1 400ms `expo.inOut` from p=0.985 + `circle()` iris contraction; cut dark text at 80% coverage; Paper hold 200ms; reduced-motion = dimmed hard cut, no flash/bloom | Linear + 400ms `expo.inOut` overlay |
| W White act (25 units · post-pin · 200/140) | Pin releases (`anticipatePin:1` tuned, no jank); first white headline already `autoAlpha:1` under veil — never empty | Canvas mounted but RAF-gated offscreen (`offscreenRunningCount:0`); R3F unmounted on non-Home routes | N/A (DOM) | Centered 560–640px column on Paper: micro-cap `EYEQ VISION CARE` + black logo; H1 `FROM EYE EXAMS TO EVERYDAY STYLE.` (single `<h1>`); CTA `BOOK YOUR EYE EXAM TODAY!` (Ink 48px, Inter 500 14px, amber arrow) → scheduler `_blank`; new-store ledger (address / `905-497-0227` / email / hours); About 3 paras verbatim + D13 block; old-store data NOWHERE | DOM `expo.out` reveals (§8.2); rails linear infinite |

Streak treatment (W1/W2, authored geometry — no post motion-blur pass exists, F §2d): per-logo
2–4 additive ribbons (0.6×0.008m, length `clamp(vel×0.12,0.05,0.5m)`, warm-white `#FFF2E2`,
edge-faded, lateral comet-smear only — never radial warp/blue starfield); opacity = f(velocity);
FOV kick + fog dip carry the rest. Mobile: arc flattened to 2 rows, depth 4→2 layers, 0.7× scale,
no horizontal overflow @390px; streaks killed on touch (opacity crossfades only).

---

## 7. Component / file structure + single-conductor contracts

### 7.1 Stack (pin at scaffold, no float majors)

Vite 8.3.1 + React 19.3.0 + `react-router-dom` 7.x (verify `npm view` at scaffold; ~7.9.x) +
three 0.186.1 + `@react-three/fiber` 9.8.1 + `@react-three/drei` 10.7.9 +
`@react-three/postprocessing` 3.1.3 + `postprocessing` 6.39.5 + gsap 3.15.0 + `@gsap/react` 2.1.2 +
lenis 1.3.26 + zustand 5.0.15 (optional) + maath 0.10.8 (optional) + TS ~5.9 +
`@playwright/test` 1.63.0 + `gltf-transform` 4.x CLI (dev-only).
Plain `lenis` + `useEffect` default (`lenis/react` `ReactLenis root autoRaf:false` approved alt —
same ticker contract). No `three-mesh-bvh`, no `ScrollSmoother` (Club-only), no `ScrollControls`
(fights Lenis, F §2c), no marquee package (hand-roll ~40 lines, `marquee-loop` pattern;
`react-fast-marquee` study-only). `maath`/`zustand` tree-shaken if unused.
F's observed versions win over recalled ones (Vite 8.3.1, not 7.x). Routing: `BrowserRouter`;
static hosts need rewrite (`dist/404.html` copy of `index.html` + `_redirects` `/* /index.html 200`
/ equivalent); no-rewrite hosts → `HashRouter` (one-file swap in `src/app/router.tsx`).

### 7.2 Folders (file ownership in §11 binds parallel builders)

```
src/
  main.tsx                    # createRoot, RouterProvider, StrictMode
  app/
    router.tsx                # routes (lazy except Home shell); Browser/Hash swap HERE ONLY
    providers.tsx             # LenisProvider + GSAP registration + reduced-motion gate
  routes/
    Home.tsx                  # #film-pin + WhiteTail + rails + footer sections
    Services.tsx              # light DOM (B §3–§4)
    Contact.tsx               # light DOM (brief §2)
    Policies.tsx              # refund/privacy/terms (one route, three sections)
    Catalog.tsx               # /frames index + detail (22 products, not featured)
  components/
    dom/
      Header.tsx / Footer.tsx / SkipLinks.tsx
      ChapterOverlay.tsx      # 9 dark-beat <section>s, carry ALL meaning
      Preloader.tsx           # weight-driven counter + curtain
      WhiteSection.tsx        # practical tail (20%)
      LogoRails.tsx           # two vertical opposing marquees (DOM <img>)
      BookingCTA.tsx          # magnetic; href = scheduler URL verbatim
      Scrims.tsx              # local contrast scrims (never full-page blanket)
    canvas/
      FilmCanvas.tsx          # ONE persistent <Canvas>; Home-only
      CameraRig.tsx           # useFrame damp toward progress
      CaseRig.tsx             # case.glb: Case_Body + Case_Flap hinge + Velvet_Oxblood
      GlassesRig.tsx          # glasses.glb: G_Root/G_Front/G_Lenses/G_Arm_R/L
      SceneStage.tsx          # scene.glb (set geometry) + lights + Environment
      SponsorField.tsx        # instanced alpha planes + streaks per wave
      LensPortal.tsx          # lens transmission + bloom/exposure ramp hooks
      Effects.tsx             # <EffectComposer> Bloom+Vignette, beat-gated mount
  motion/
    lenis.ts                  # singleton Lenis + GSAP ticker + destroy
    masterTimeline.ts         # ONE timeline factory: labels §6, scrub, pin, onUpdate→ref
    progress.ts               # filmProgress {p, beat} — sole 3D input
    chapters.ts               # label→[start,end], camera endpoints, mobile overrides
  store/
    useFilmStore.ts           # zustand discrete {beat, quality, reducedMotion} — DOM only
  data/
    services.json / lenses.json / insurers.json / brands.json / reviews.json  # B-verbatim
  styles/
    tokens.css / film.css / rails.css / white.css
public/  (Phase 3 writes models; web builder writes web/ + fonts + env + decoders)
  models/case.glb / glasses.glb / scene.glb
  env/studio_small_2k.ktx2   # ONE file
  fonts/fraunces-var.woff2 / inter-var.woff2 (+ subsets)
  web/brands-light/* (8) / web/insurance-light/* (8) / web/eyeq-logo-white.*
  decoders/draco/*            # self-hosted if Draco (else meshopt)
```

### 7.3 DOM vs Canvas tree + scene graph

```
<RouterProvider><LenisProvider>
  <SkipLinks/><Header/>
  <Routes>
    <Route Home>              # ONLY route mounting FilmCanvas
      <Preloader/><div id="film-pin"> (800vh desk / 560 mob / pin shell 100svh)
        <FilmCanvas/> (fixed inset-0 z-0, aria-hidden, pointer-events:none)
        <ChapterOverlay ×9/> (z-10, real <section>/<h2>)
      </div><WhiteCurtain/><WhiteSection/><LogoRails/><Reviews/><Footer/>
    </Route>
    <Route Services|Contact|Policies|Catalog>  # light DOM, NO Canvas import in chunk
  </Routes><Footer/>
```
Canvas: `<FilmCanvas dpr={tier} frameloop="always" gl={{antialias:true,
toneMapping:ACESFilmic, exposure:1.0}}>` → `<color #050607/>` + `<fogExp2 #050607 0.035/>` →
`SceneStage` (scene.glb + `<Environment files=studio>` + Lightformers rect 4 @[3,2,−2] /
3 @[−3,1.5,−1] / 1.2 `#7a1420` @[0,0.5,2]) → `CaseRig` → `GlassesRig` → `SponsorField wave`
→ `LensPortal` → `CameraRig` → `Effects` (mounted B6–B9 only, else null).
Draws ≈ 35–45 (stage ~15 + case ~6 + glasses ~8 + sponsors 3 + effects 2–3 when mounted).
Canvas mounts Home-only; route change = full dispose (StrictMode-safe `useGSAP` +
`gsap.context` + `revert()`; `tl.scrollTrigger.kill(); tl.kill(); lenis.destroy();
useGLTF.clear(); dispose geometries/materials/targets; cancel RAF; one `<Canvas>` max).
R3F reads `filmProgress` in `useFrame`, mutates refs (never `setState`); zustand holds discrete
`{beat, quality, reducedMotion}` with selectors (zero per-frame renders). Reduced-motion:
`rig.smooth = rig.target` (snap to chapter endpoints). After fonts / each `.glb` / logo images:
`ScrollTrigger.refresh()`. Resize: `ResizeObserver` → aspect + `setSize` +
debounced-150ms refresh; endpoints via `gsap.matchMedia (max-width:768px)`; sponsor slots are
functions of viewport. Dev-only `window.__film.setProgress(p)` writes the same ref (proves
pure-function-of-progress) for QA.

---

## 8. Motion vocabulary (one easing family)

Family: **`expo.out`** reveals/hovers/cards · **`expo.inOut`** curtain/portal/handoffs ·
**`power2.out`** micro (underlines/arrows/magnets) · **`linear`** scrubs/rails/marquees.
Banned: bounce/elastic/spring/back-ease (except §6 baked scrub keys = geometry, not UI feel),
letter-stagger, scroll-hijack, unpausable carousels, gradient/blob cinema, glassmorphism,
particles (brief §7 + E anti-patterns).

- Section entrances: label → heading (line-mask 0.9s) → media (clip 1.1s) → cards
  (`y 36→0, 0.8s, stagger 0.08`) at `top 80–84%`, `once:true`. One idea per viewport.
- Headlines: line-mask (white) / word-mask (dark captions); `aria-label` full text, spaces kept,
  never split links/buttons/CTA; RM static.
- Body/labels: `fade-up` (y32→0, 0.85s expo.out) or `blur-in` (y18→0 + blur 10→0, small only).
- Images: `clip-path:inset(0 0 100%→0)` 1.1s expo.out + `scale 1.08→1` 1.2s; `refresh()` per load.
  Hero curtain max: `inset(50%→0%)` 1.5s power4.out + 1.5→1 (REF envelope, hero only).
- Parallax ≤0.18 (`scrub:1.2`); text stable, backgrounds slower.
- Hovers: nav underline `scaleX 0→1` 350ms expo.out (CSS); buttons text-roll + bg wipe 400ms;
  cards `scale →1.03` + streak micro-replay 250ms; image zoom 1→1.06 0.7s power3.out;
  arrow x 0→6 + duplicate fade; tilt ≤4° (fine-pointer only); Booking CTA = ONE magnetic
  (`quickTo ≤6px`, 300ms power2.out; text-roll y−100% + wipe 400ms expo.out).
- Cursor: informative-only follower (`mix-blend-difference`, `quickTo` 0.35s power3.out,
  scale 1.75 on labelled targets); hidden touch + RM; never required.
- Rails (§6-W + §1-C8): Realevate engine, 72/44 px/s, ±15% velocity coupling (400ms `quickTo`
  `timeScale`), hover 72→20 (400ms), masks
  `mask-image:linear-gradient(to bottom,transparent,black 12%,black 88%,transparent)`,
  `will-change:transform` tracks only, `content-visibility:auto`, fixed card heights,
  film-strip matte per ART §4.4 (bed `#ECE6D6`, 1px hairlines, 8×8 ticks/48px @20% Ink,
  96×64 frames, duotone black @60% Ink, 9px frame numbers, hero frames Ray-Ban/Sun Life @1.5×),
  opposing via inner `rotate:180°` (never `scaleY(-1)`/`direction:rtl`), gap inside `m`,
  pause on hover/focus + visible pause control (44px mob) + IO offscreen-pause; RM static grid;
  mobile single 48px left rail during film → one 68px horizontal marquee after white act.
- Handoffs: dark→dark continuous dolly (no wipe; light-leak 0→0.8→0 300ms at label edges only);
  dark→white §6-B9; white sections overlap `margin-top:-10vh`, entrances `top 80%`.
- Transitions: native View Transitions + GSAP curtain; `gsap.context()` + `revert()` per route.
- Preloader chain: veil → headline lines (+150ms) → glint (+450ms) → CTA (+700ms);
  mute-by-default; pause/mute controls mandatory; zero popups in first three viewports.
- Copy honesty: only research-verified identities; reviews initials+text exactly B §7;
  `4.9` `(208 reviews)` + `Real reviews from real customers` verbatim.

---

## 9. Performance tiers

| Dimension | Desktop-high | Laptop (default) | Mobile ≤768px | Reduced-motion |
|---|---|---|---|---|
| DPR cap | ≤2.0 | ≤1.5 | ≤1.25 (max 1.5) | 1 |
| Visible tris | 350k max | 250k | 150–300k (50k LOD pref) | same tier, static |
| Draw calls | ≤90 | ≤70 | 50–90 (film 35–45) | same, no loop |
| Shadows | 2 lights 1024 | 1 key 1024 | 1 key 1024 or off | off |
| Post | Bloom+Vignette B6–B9 only | same, half-res bloom | NONE (opacity x-fades) | NONE |
| Lens | native `MeshPhysicalMaterial` transmission | same | opacity-xfade fallback | hard cut, dimmed white |
| `transmissionResolutionScale` | 1.0 | 0.5 | n/a | n/a |
| `MeshTransmissionMaterial` | portal pulse only | portal only | FORBIDDEN | forbidden |
| Frameloop | always (film) | always (film) | always film / gated offscreen | demand / static |
| Textures | 2k hero max | 2k hero | 1k hero, 512 atlas cells | same as mobile |
| HDRI | 1–2k static | 1–2k | 1k static | same |

Frame: steady ≤16.7ms ideal, ≤25ms fallback; scrub jitter <3 dropped frames/s.
Transfer: critical initial 3–6MB mob / 5–10MB desk; route JS ≤350KB gz (Home ≤650KB incl.
Canvas chunk, lazy `React.lazy(FilmCanvas)` pre-mounted 400px before viewport).
Governor (`PerformanceMonitor`): lowers DPR → kills post → kills shadows, never landmarks.
Offscreen: IO on `#film-pin` + `document.hidden` → skip `gl.render`, pause marquees
(`animation-play-state:paused`), kill unmounted beat tickers; prove `offscreenRunningCount:0`
in profile. GPU-only discipline: `transform`/`opacity`/short-lived `clip-path`/streak-only
`filter:blur`; never width/height/top/left/margin in scroll; `will-change` pinned children
during pin only (+ rails tracks). One ticker (audit duplicates; StrictMode ref-guard +
`lenis.destroy()`); cap `dt` 1/30; damp λ=5.2. KTX2/Basis (sRGB color only); meshopt OR Draco;
logo-relief quant ≥14-bit. WebGL/model/texture failure → per-chapter `onError` → poster +
ordered stills + full DOM; console-clean. `?tier=low` manual override for QA.
DOF default OFF (props UNVERIFIED until installed `postprocessing@6.39.5` types checked).
`gsap_validate_gsap_code` before capture.

---

## 10. Accessibility (first-class branch, not post-pass)

- Reduced-motion (`prefers-reduced-motion: reduce`): NO Lenis, NO scrub smoothing, NO pin flights.
  Film → 9 static chapters (poster stills + full DOM copy, same order); flap/arms/idle/streaks/
  chroma/FOV OFF (final poses); rails → static 2-col grid (8+8 labelled); waves → staggered fade
  ≤200ms or static; preloader removed; reveals → `opacity 0→1` 200ms linear; video never autoplays;
  veil = dimmed hard cut (`#f5f1e8`, never strobe). CSS `@media` mirrors JS branch. Test emulation
  AND real OS setting.
- Keyboard: `Skip to content` + `Skip film` first; canvas `aria-hidden`, never focusable; each beat
  caption = real `<section>` + heading (story survives without canvas); menu trap + ESC + restore;
  `S` skips film; CTAs native `<a>`/`<button>`; focus-visible 2px `#D9A441` offset 2px.
- Screen reader: sr-only synopsis per beat + real lists — 7 Essilor `<ul>`, Wave 1
  `<ul aria-label="Featured eyewear brands">`, Wave 2 `<ul aria-label="Accepted insurance plans">`
  (text names; logo `alt` carries names — fixes live empty-alts); video needs D15 description;
  map iframe `title="Map — EyeQ Vision Care, 2-227 Vodden St East, Brampton"`.
- Contrast: Bone `#F5F0E8` on dark (scrims mandatory, §6); `#0A0B0C` on `#FFFFFF`; micro-caps never
  <11px, never sole carrier (facts repeat at body size in white act); `#A42325` review accents only
  where adjacent text still passes.
- Sound: no autoplay with sound; video controls include mute/pause.
- Mobile: canvas sticky 60vh top + copy bottom-sheet (20px margin, bottom-40% scrim
  `rgba(5,6,7,.55)` ≥4.5:1); FOV 55 (vs 40 desk), distance 4.4m (vs 3.2m); DPR ≤1.5;
  bloom/transmission/chromatic OFF; env 256px; GLB <150k tris or poster fallback.
  Targets ≥44px (hamburger 44×44, CTA 190×71, directions 180×48 full-width, sticky 56px BOOK ≤600).
  Hamburger <720px (fixes 600–768 gap). Map 390×220 above hours; menu `100vw×100dvh`, 48px rows.

---

## 11. QA harness (screenshot-based; never "it compiles")

### 11.1 Beat-capture script (`scripts/qa/beats.spec.ts`, owner Lane B)

Stops (progress = §6 cumulative; DOM stops scroll-driven):

```ts
const STOPS = [
  ['00-preloader', null], ['01-case', 0.05], ['02-open', 0.17], ['03-velvet', 0.24],
  ['04-emerge', 0.32], ['05-unfold', 0.47], ['06-info', 0.62], ['07-wave1', 0.77],
  ['08-wave2', 0.885], ['09-approach', 0.945], ['10-entry', 0.985],
  ['11-white', null], ['12-rails', null],
];
```

Mechanism: progress stops via dev-only `window.__film.setProgress(p)` + 600ms settle + screenshot;
DOM stops via `scrollIntoView` + settle. Matrix **1440×900 + 390×844** (+ 768×1024 for camera
endpoints). Output `docs/phase4/qa/<beat>-<viewport>.png` — the review contract critics sign.
Passes: forward, reverse (0.77→0.32, no pops), fast-flick, scrollbar-drag, anchor nav,
reload-at-depth, resize-mid-beat, `?tier=low`, RM emulation (no Lenis, static chapters, all copy,
poster/static canvas). Brightest-frame legibility captures @1440+390 (contrast ≥4.5:1, insurer
boxes ≥120×40px, thin strokes ≥90px wide, no centre-para over hardware). `vf capture/compare`
on scroll fractions + `track` regression guard; frame-time/draw-call/tri/texture-memory recorded;
`offscreenRunningCount:0` proven in profile. Banned-token grep (C5/C15-A6) runs in the same job.

### 11.2 Lighthouse / budget gates (CI assert)

LCP (mobile white-tail H1 path) <2.5s · CLS <0.05 · TBT <300ms · route JS <350KB gz ·
Accessibility 100 (heading order, focus, contrast) · Best practices 100 (self-hosted fonts/decoders;
booking URL kept exact `http://…` — do not "fix" to https; mixed-content is the vendor's).
Hero readable ≤1.8s (playbook gate). Console-clean required.

---

## 12. Build order — Phase 4 steps 1–18, parallel lanes, file ownership, acceptance

Lane ownership (strict — never touch another lane's files without coordinator contract change):
- **A scaffold/tokens:** scaffold, `styles/*`, fonts. **B conductor/camera/portal/QA:** `motion/*`,
  `canvas/FilmCanvas|CameraRig|Effects|LensPortal`, `scripts/qa/*`. **C hero objects:**
  `canvas/CaseRig|GlassesRig`. **D stage/waves/perf:** `canvas/SceneStage|SponsorField`,
  asset-conditioning scripts. **E DOM/copy:** `components/dom/*`, `data/*.json`.
  **F routes:** `routes/Services|Contact|Policies|Catalog`.
- Shared contracts (coordinator-only changes): §6 label/progress table, `#film-pin` 800vh/560vh shell,
  `filmProgress` shape, Phase-3 node names (§5), B-verbatim copy, tokens §2.
- Critical path: 1→3→4→(5,6,7,8 parallel)→9→15→18. DOM track (10–13,16) fully parallel from 1/3.
  First QA signal at step 4 (boxes on all 12 stops — no waiting for `.glb`s).

| Step | Task (owner, deps) | Acceptance criteria | Screenshot verification |
|---|---|---|---|
| 1 | Scaffold Vite+router+TS+lint+folders §7 (A; blocks all; 0.5d) | Pinned versions §7.1; `BrowserRouter` + `dist/404.html` + `_redirects`; one `<Canvas>` max; `npm run build` clean | — (no visual; CI build log) |
| 2 | Tokens+fonts+base CSS (A; needs 1; parallel w/3) | Tokens §2 byte-exact; Fraunces/Inter latin subsets ≤120KB, `font-display:swap`, preload Fraunces-600; `100svh` pin shell; LCP element = DOM H1 (never `opacity:0`) | `tokens` capture @1440+390: Paper/Ink/Void swatches + H1 48–96px |
| 3 | Motion core: `lenis.ts`+`progress.ts`+`chapters.ts`+`useFilmStore`+`masterTimeline` skeleton (labels only) + Preloader shell (B; needs 1; critical path; label table frozen) | Single ticker 4-line wiring; `scrub:1.0 anticipatePin:1 invalidateOnRefresh`; `filmProgress` sole 3D input; RM branch = no Lenis; labels §6 exact | — (code contract; proven by step 4 stops) |
| 4 | FilmCanvas+CameraRig on box stand-ins + Effects gating + resize + tier switch (B; needs 3) | Full §6 camera path on boxes; all 12 QA stops green on boxes; mobile ×1.45 + FOV+9°; resize→aspect+refresh; DPR tiers §9 | `docs/phase4/qa/*-boxes-*.png` 12 stops × 1440+390 — coordinator sign |
| 5 | CaseRig: `case.glb` wiring, `Case_Flap` 40° keys+tip-lag, `Velvet_Oxblood` sheen vs E recipe (C; needs 4 + Phase-3 case.glb) | Flap 40° (§1-C2) scrub-reversible; velvet reads via grazing rim (not flat light); deboss glints p≈0.06 | `02-open` + `03-velvet` @1440+390 vs E velvet bands |
| 6 | GlassesRig: `glasses.glb`, `G_Arm_R/L` fold→open, smoked transmission (C; needs 4 + glasses.glb; PARALLEL w/5) | Fold R+90°/L−85°+4°tilt → 0° staggered L→R(0.08p), overshoot/settle; `G_Lenses` one mesh static; dark-field edge fire (brief §6b, never whitened) | `04-emerge` + `05-unfold` @1440+390; junction 0/45/90° no-crack crops |
| 7 | SceneStage: scene.glb + Environment+Lightformers + fog/exposure per beat (D; needs 4 + scene.glb; PARALLEL) | HDRI on every material; ACES; fog 0.035→0.015→0.030 Void-matched; exposure 1.0→1.15 | `01-case` + `06-info` @1440+390: graphite edges readable, no flat black |
| 8 | SponsorField: atlases + streaks + slots W1/W2 + FOV/fog choreo (D; needs 4 + atlases; PARALLEL) | 8+8 orders §6; W1 1.1m arc 3-layer vs W2 0.7m baseline+scatter; travel/stagger/duration/opacity/kick per §1-C1; `alphaTest:0.4`; 16-plane budget; green-fringe check 400% | `07-wave1` + `08-wave2` @1440+390 brightest-frame; min-box + gap ruler overlay |
| 9 | LensPortal + white-curtain handoff + RAF gate (B; needs 4,6,7) | Rail along lens normal; transmission 0→0.9; bloom 0.15→0.6→1.4; veil from p=0.985 400ms expo.inOut + `circle()` iris; Paper `#F5F1E8` + 200ms hold; offscreen RAF=0 | `09-approach` + `10-entry` + `11-white` @1440+390+768; no clip-pop @390 |
| 10 | ChapterOverlay copy wiring: `data/*.json` (B-verbatim) → 9 sections + masked reveals (E; needs 3; PARALLEL from 3) | Every string verbatim or `DRAFT`-marked; 7 Essilor `<ul>`; W1/W2 `<ul>` labels; logo `alt` names (fixes empty-alts); H1 single, white act only | `06-info` DOM crop: 7 names + hairlines, 13px roman ®60% |
| 11 | WhiteSection + Header + Footer (E; needs 1; PARALLEL) | H1+CTA+ledger (address/phone/email/hours brief §2); booking `_blank` vs Services same-tab; map rebuilt query + click-activate; header 64/56px + Book pill persistent + skip + 2px bar | `11-white` full-page @1440+390; header over dark + over Paper |
| 12 | LogoRails (E; needs 1 + light logos; PARALLEL) | Realevate engine §1-C8; 72/44 px/s; left brands down / right insurers up; matte film-strip §8; masks; hover/IO/pause-control; RM static; mob single-48→68-horizontal | `12-rails` scrolling pair (t0/t+6s differ, loop seamless) + paused-state + RM static |
| 13 | Routes Services/Contact/Policies/Catalog (F; needs 1,11; PARALLEL) | Light DOM, lazy chunks, zero Canvas imports; all B copy full-verbatim; catalog All/SUN/OPTICAL + search; no `$0.00`; 301s §3 | Full-page per route @1440+390 |
| 14 | QA harness `scripts/qa/beats.spec.ts` (B; needs 4; runs continuously) | 12 stops × viewports + reverse/flick/drag/anchor/reload/resize/`?tier=low`/RM; `__film.setProgress` purity; budgets §11.2; banned-token grep | `docs/phase4/qa/` complete = review contract |
| 15 | Perf pass (D+B; needs 5–8) | Tiers §9; governor DPR→post→shadows; KTX2/meshopt-or-Draco verify; transfer weigh-in 3–6/5–10MB; JS ≤350KB gz/route | Profile screenshots (frame-time, draws, tris, texture-mem) + `offscreenRunningCount:0` |
| 16 | A11y/RM pass (E+F; needs 10–13) | §10 all: 9 static chapters, grids, 200ms caps, traps/ESC/`S`/skip links, scrims ≥4.5:1, video pause/mute, map title | RM emulation full set @1440+390 + keyboard-order video |
| 17 | Preloader→hero tuning (B; needs 4,14) | Weight-driven counter, staged Suspense, LCP<2.5s, hero ≤1.8s, exit-if-lagging, skip flags | `00-preloader` sequence (counter/curtain/hero) + WebPageTest-style timing |
| 18 | Final verification (single integrator, B or coordinator; needs all) | `iterate-until-verified`: 3 viewports × forward/back/flick/reload/resize, console-clean, Lighthouse §11.2, `qa/` complete, anti-slop §13 all-checked | Final `qa/` + side-by-side + diff report; maker/judge split where practical |

---

## 13. Anti-slop gates (binding on all builders; verify in QA)

- [ ] A1 No gradient set-dressing (only 40%-viewport caption scrim). Cinema = raking key + rim + falloff.
- [ ] A2 No glassmorphism over 3D (`backdrop-blur` never over canvas; scrim ≤0.55 + 1px hairline max).
- [ ] A3 No particles/dust/sparkles in DOM (sterile dark room; dust only inside render, if at all).
- [ ] A4 Single-color logos or nothing (approved knockouts at §6 opacities/sizes only).
- [ ] A5 Rails stay film, never ticker (vertical only, matte §8, ≤2 desk / 1 mob, pause + RM static).
- [ ] A6 No hype words (grep-block §2.2; two-word editorial or engineering-poetry chapters only).
- [ ] A7 No card grids (ledger / inverted rows / 1+5 asymmetric / static 4×2 insurance; zero 3-equal-cards, 16–24px radii, Paper shadows).
- [ ] A8 Type discipline (Fraunces ≥48px ≤8 words −0.02em, never italic over 3D; Inter else; one display/viewport).
- [ ] A9 Contrast contracts (body ≥4.5:1; no centre-para over hardware; insurer ≥120×40px; brightest-frame @1440+390).
- [ ] A10 White = Paper ramped (800ms expo.out → `#F5F1E8` + 200ms hold; RM dimmed cut, no flash).
- [ ] A11 One idea per viewport, ≤2 pins/page (W2 differentiated arrival, not a repeat; poster ≤1.8s; skippable intro).
- [ ] A12 No custom cursor / outer glow (lens visibility = §6b strips + Env/Lightformer + edges + gated bloom).
- [ ] A13 Real assets only (Cycles-portable glTF; HDRI everywhere; ACES; DPR ≤2; paused offscreen; zero CSS/SVG/div illustration, AI eyes, stock eyes).
- [ ] A14 Zero invented content (quoted or `DRAFT`/`[COPY NEEDED]`; no promos/hours/socials/stats/reviews/sponsors).
- [ ] A15 Zero popups in first three viewports.

## 14. Open items (client confirmations, not builder decisions)

1. Booking location code `eyeqvision1` is Burlington-era (synthesis §7) — confirm Brampton code.
2. Light logo variants are shape-identical recolors (synthesis §7) — confirm acceptable.
3. D1–D17 drafts + `[COPY NEEDED]` items (`COPY-DRAFTS.md`) — approve/replace before launch.
4. New Maps destination string/place ID; legal entity + returns contact; catalog price policy; video description.
5. Fraunces ships OFL via Google Fonts (self-hosted subsets) — no licensing action beyond attribution check.

---

*Interfaces: MOTION timings survive any conductor change (progress-relative); ART tokens §2 frozen;
ARCH contracts §7 frozen; SITE copy/route constraints (§3–§4) non-negotiable. Coordinator merges;
builders collide only via §12 lane files.*

---

PHASE4-PLAN-MASTER-DONE
- Merged 5 lane plans into one executable contract: 9-beat film (1000vh desk / 700vh mob, 80/20) with progress-mapped camera, 40° flap, staggered unfold, differentiated 8+8 spatial arrivals, bloom-to-Paper portal.
- Locked tokens (Void/Bone/Paper/Ink + Lamp-amber; Fraunces + Inter), sitemap + 301s, file/component structure, perf tiers, and screenshot QA (12 stops × 3 viewports + RM + low-tier + Lighthouse).
- Split steps 1–18 into 6 parallel lanes (A/B/C/D/E/F) with exclusive file ownership, per-lane acceptance, and per-lane screenshot gates converging on one integrator.
- Resolved 16 conflicts explicitly (wave-2 depth, 40° flap, node names, 208mm reframe, fog scale, rails engine, reveal tokens, Lenis-on-touch, portal choreography, budgets).
- All film lines are DRAFTs in COPY-DRAFTS.md; everything else verbatim from B or brief §2 — zero invented business content.

## ORCHESTRATOR OVERRIDE — client rule (supersedes §3/§4/§12 where they differ)
REMOVE the Catalog route and every "Frames/Browse frames/Catalog/Search/Account/Cart" link or UI. Routes = `/`, `/pages/services`, `/pages/contact`, `/policies/refund-policy`, `/policies/privacy-policy`, `/policies/terms-of-service` only. Nav = Home · Services · Contact + Book CTA. Nothing may appear that is not on the live site (brief §6d).
DRAFT copy lines are not rendered by default (flag `SHOW_DRAFT_COPY`, default false) — brief §6d.

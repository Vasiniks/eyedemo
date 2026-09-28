# PHASE 4 PLAN — ART DIRECTION (ID: ART)

Planning-only. No app scaffolded, no packages installed, no source written.
Sources: `docs/00-BRIEF.md` (incl. §6b/§6c), `docs/research/00-PHASE2-SYNTHESIS.md`,
`docs/research/A..G-*.md`. Consulted (read-only): `art-director`,
`threejs-art-director`, `visual-critic`. Skills followed: `awwwards-playbook`,
`design-motion-principles` (marketing/landing weighting: primary Jakub, secondary
Jhey, selective Emil), `no-ai-design-slop`, `build-threejs-scroll-worlds`,
`marquee-loop`, `masked-reveal`, `progressive-blur`,
`cinematic-gsap-lenis-motion-system`.

Thesis (one sentence, from E §7/E-proposal): *An instrument of vision, unveiled
like a premiere — graphite shell, blood-red velvet, dark glass, then daylight
and facts.* Every choice below serves the "optician's dark room" narrative
(darkness → controlled light → clarity). Nothing moves for effect.

Ownership boundary: this plan owns look, tokens, composition, lighting states.
Camera/scroll engineering belongs to MOTION; component/code structure to
ARCHITECTURE; copy truth to SITE/IA. Where they overlap, this plan states the
visual contract and defers the mechanism.

---

## 1. Design tokens

### 1.1 Color

Palette discipline: near-black graphite ladder + oxblood velvet red + bone/paper
white. **One accent max** (lamp-amber, functional only). No gradients as design
elements (light falloff lives inside the 3D render only), no glassmorphism, no
purple/blue nebula tones.

| Token | Hex | Usage |
|---|---|---|
| `Void` | `#050607` | Page base, film stage. ~70%+ of dark act. Fog color match (see §2). |
| `Stage` | `#0A0C0E` | Sticky canvas background, section alt on black |
| `Graphite-800` | `#121519` | Card fill on black, ledger rows on dark |
| `Graphite-700` | `#1B2027` | Case body mid-tone reference (3D), dark UI fills |
| `Graphite-600` | `#262D36` | Case edge-highlight reference, strong hairlines on black |
| `Steel-edge` | `#4B5563` | 1px edges / chamfer catchlights only. Never flat fill. |
| `Muted-on-dark` | `#8F97A3` | Captions on black only, min 13px, never body |
| `Velvet-shadow` | `#22060A` | Velvet fold shadow (3D base) |
| `Oxblood` | `#4B0F16` | Velvet mid-tone. Appears in Beats 2–3 only (open + emerge). Elsewhere max as 3px bookmark / 8px ticket edge. Never text, never button, never flat section bg. |
| `Oxblood-lift` | `#641420` | Velvet fold highlight where grazing key hits (3D). No DOM use. |
| `Sheen` | `#8E2E38` | Lamp-catch tint at 22–32% opacity inside render only. No DOM use. |
| `Bone` | `#E9E2D3` | Primary text on black (13.2:1 on Void). Logo-knockout value for waves (82–88%, see §3). |
| `Bone-dim` | `#C5BCA6` | Secondary text on black (7.1:1). Micro-caps, captions. |
| `Paper` | `#F5F1E8` | White-act background. **Not pure #FFF** — the dark→light ramp lands on Paper (critic P0-5). |
| `Card-white` | `#FFFFFF` | Booking card, inputs, featured review card on Paper only. |
| `Ink` | `#131417` | Primary text on light |
| `Ink-body` | `#2A2B2E` | Body text on light |
| `Ink-muted` | `#5E5B54` | Meta text on light, min 14px |
| `Lamp-amber` (sole accent) | `#D9A441` | Functional only: hours-open dot 8px, star rating glyphs 16px, active-section tick 24×2px, focus ring 2px, booking-CTA arrow. <2% of any viewport. Never large fill, never on oxblood, never display type. |

Live-site colors explicitly **retired**: hero yellow `#FFDE59` (baked into old
banner image, D §6), maroon `#A42325`/`#B9272A` (old CTA), orange `#EE9441`,
teal `#028989`, gradient banner art. Nothing from the Shopify theme survives
except Inter (see §1.2) and the review-star semantic (rebuilt in Lamp-amber).

Ratio targets: dark act ≈ 82% Void/Stage, 12% Bone text, 5% graphite, 1%
oxblood+amber. White act ≈ 78% Paper, 18% Card-white, 4% Ink. (Matches brief
80/20 dark/white.)

### 1.2 Type system

**Decision: confirm Fraunces (display) + Inter (UI)** per research E §4 Pairing 1.
Rationale: Fraunces variable optical axis gives the whisper-to-monument range
the film needs (micro-caps restraint → white-act monument); Inter is already
the live site's body face (D §5), zero-cost OFL, invisible in forms/booking UI.
Rejected Pairing 2 (Cormorant thins out below ~28px) and Pairing 3 (Adobe
subscription dependency). Guardrail (critic P0-2, `design-taste-frontend`
§4.1): Fraunces is an LLM-default serif — it earns its place only under strict
rules below (≥48px display, ≤8-word headlines, never italic over 3D).

- Display: **Fraunces**, weights 300 (headlines) / 400 + 400-italic (one
  emphasized word max per headline). Optical size 72pt (`opsz` 72, SOFT 50,
  WONK 1). Tracking `-0.02em`. Leading `0.95–1.02`.
- UI/body: **Inter**, 400 body / 500 labels+buttons / 600 numerals only.
  Tracking `-0.01em` body, `+0.18em` micro-caps.
- Micro-caps label style (the Lindberg/Gentle-Monster restraint device, E):
  11px, Inter 500, uppercase, `+0.18em`, Bone-dim on dark / Ink-muted on light,
  always precedes a headline with 12px gap + 24px hairline. Max one eyebrow per
  three sections (critic P0-2).

Scale (clamp = fluid, px = fixed):

| Role | Size | Weight | Leading | Tracking | Min contrast |
|---|---|---|---|---|---|
| Display | `clamp(48px, 6vw, 96px)` Fraunces | 300 | 0.98 | -0.02em | Bone on Void (scrim, §2) |
| H2 | `clamp(30px, 3.4vw, 48px)` Fraunces | 300 | 1.02 | -0.02em | same |
| H3 | 22px Fraunces | 400 | 1.15 | -0.01em | same |
| Body | 16px/26px Inter | 400 | 1.6 | -0.01em | Bone / Ink-body |
| Small | 14px/22px Inter | 400 | 1.55 | 0 | Bone-dim / Ink-muted |
| Micro-cap | 11px Inter 500 upper | 500 | 1.4 | +0.18em | Bone-dim / Ink-muted |
| Lens-name list (Beat 5) | 13px Inter 400 | 400 | 1.5 | 0 | Bone on Void, roman, ® at 60% size, never bold |
| Numerals (4.9, prices) | Inter 600, tabular-nums | 600 | — | 0 | — |

Rules: one Fraunces per viewport. Everything else Inter. Never two display
faces competing (E house rule). Never italic Fraunces over moving 3D. Masked
word-mask reveals only (skill `masked-reveal`: yPercent 110→0, 0.7–0.9s,
stagger 0.025–0.045, trigger `top 82%`, once). Stagger by word, never letter.

### 1.3 Grid

- Desktop ≥1024px: 12 columns, margins `clamp(32px, 4vw, 72px)`, gutter 24px.
  Reading measure max 560px / ~22ch for headlines. Sticky film stage full-bleed;
  DOM text occupies columns 1–5 left, bottom-anchored `12–16vh`. Never center
  text over the lens/glasses center; keep 200px clear radius around bridge.
- Tablet 768–1023px: 6 columns, margin 32px, gutter 20px. Film text
  bottom-sheet, max 480px.
- Mobile <768px: 4 columns, margin 20px, gutter 16px. Film object top 45vh,
  text bottom sheet; dual rails collapse (see §4).

### 1.4 Spacing scale

`4 · 8 · 16 · 24 · 32 · 48 · 72 · 112 · 168`. Section padding desktop 112–168,
tablet 72–96, mobile 56–72. Headline→body 24, body→CTA 32, label→headline 12.

### 1.5 Radii

`2px` hairline cards/frames/reviews; `8px` photography/media only; `999px`
status pill + hours dot container only. No 16–24px soft cards anywhere (critic
P0-1). Sharp = instrument; round = template.

### 1.6 Lines / hairlines

Always 1px, no shadows, no blur. On black: `rgba(233,226,211,0.14)`, strong
`0.24`. On light: `rgba(19,20,23,0.14)`, strong `0.22`. Full-grid dividers;
labels sit 16px above the line. Services/reviews/visit sections are structured
by hairlines, not boxes (see §5).

---

## 2. The film, beat by beat

Global contracts (visual side; timing/scrub values belong to MOTION):

- Canvas full-bleed z-0, DOM text z-10, object center ≈ 58–62% viewport height
  desktop, 540–680px wide. Type lower-third left, never over focal hardware.
- 3D base: ACES tone mapping, one studio HDRI (`studio_small_09`-class, 1–2k),
  exposure 1.05 → 1.15 (mid-film) → 1.35 (portal) → 2.2 (white handoff, then
  canvas RAF-gated off). Background `Void #050607`; FogExp2 matched `#050607`,
  density 0.16 (Beats 1–5) → 0.07 (waves, keeps depth readable) → 0 (Beat 10).
  Vignette 0.32, grain 0.06 desktop only. ContactShadows 0.65/blur 2.2.
- Camera body: perspective, FOV 32° desktop (≈40mm) / 40° mobile with dolly
  ×1.35; macro beats FOV 18° (≈85mm). Near 0.01, far 30. One idea per viewport
  (critic P0-6); text crossfades, never two reveals competing.
- Copy rule: every DOM string below is quoted from B §§2–5,7–9 or brief §2 new
  store info. Anything else is marked `[COPY NEEDED]`.

### Beat 1 — Case reveal (weight 10)

- Camera: 3/4 hero, FOV 32°, case small centered (0, 0.04, 0.34 → target
  origin), object ≈55% vh. Mobile: same angle, dolly ×1.35.
- Lighting: near-dark. Key SpotLight `#FFF2E2` intensity 25 from top-left
  (−30°, +40°). Hemi fill `#1A1D24` 0.25. Strip cards 2.0×0.15m `#E8F0FF` at 4
  (low). Env intensity 0.35. Velvet light OFF. Logo deboss reads only as a
  catchlight on the lid crown.
- DOM (bottom-left, micro-cap + display + one Inter line):
  micro-cap `01 — DARK ROOM` [COPY NEEDED — label, keep or replace with
  `[COPY NEEDED]`], H-display `Precision starts in darkness.` [COPY NEEDED —
  do not ship; placeholder direction only], no CTA, no body.
- Styling: Fraunces 300 Bone, micro-cap Bone-dim. Caption scrim only:
  `linear-gradient(transparent, rgba(5,6,7,0.55))` bottom 40% — the single
  permitted scrim shape (§anti-slop).

```
DESKTOP Beat 1                    MOBILE Beat 1
+--------------------------------+  +------------------+
|                                |  |                  |
|        .--case 3/4--.          |  |   .--case--.     |
|       / graphite   \           |  |  / graphite \    |
|       | deboss glint|          |  |  +-----------+   |
|        \_________/             |  |                  |
|                                |  +------------------+
| 01 — DARK ROOM                  |  | 01 — DARK ROOM   |
| Precision starts                |  | Precision…       |
| in darkness.                    |  +------------------+
+--------------------------------+
```

### Beat 2 — Open / velvet (weight 15)

- Camera: slow push 0.30→0.26m, ±6° arc. Lid rotX 0→−105° (easeInOut per
  threejs-art-director; elastic overshoot ≤3° settle lives in MOTION).
- Lighting: velvet ramp — SpotLight `#FF8A7A` 0→6 across the beat; sheen
  0.4→1.0, sheenColor `#FF3040`, sheenRoughness 0.5→0.32. Key 25→32.
  Oxblood fills lower third; no text over the sheen hotspot.
- DOM: same anchor, crossfade line 2. Micro-cap `02 — VELVET`
  [COPY NEEDED]; display `Cut for one instrument.` [COPY NEEDED placeholder].
- Velvet recipe (F §4.4, E velvet): base `#4A0A0E–#4B0F16`, roughness
  0.85–1.0, real fold geometry (never normal-map-only), baked AO in crevices.

```
DESKTOP Beat 2                    MOBILE Beat 2
+--------------------------------+  +------------------+
|    ___lid open___               |  |   __lid__        |
|   /  velvet glow \              |  |  / glow  \       |
|  | oxblood folds  |             |  | | folds  |       |
|   \__shadow______/              |  |  \________/      |
| 02 — VELVET                     |  | 02 — VELVET      |
| Cut for one instrument.         |  | Cut for one…     |
+--------------------------------+  +------------------+
```

### Beat 3 — Emerge (weight 15)

- Camera: hold 0.26m, tilt down 4° as glasses rise y +0.0→0.06, rotY −18°→0°.
  Folded pose (arms 85° inward, one arm +3mm depth offset so tips overlap
  without clipping — G rigging plan).
- Lighting: key 32→36; strips 4→12 so folded silhouette separates from black;
  velvet SpotLight holds 6. Idle bob ±1.5mm @ 0.4Hz begins.
- DOM: headline from Beat 2 shifts up 24px, fades 1→0 at beat end. Micro-cap
  `03 — FOLDED` [COPY NEEDED]. No body copy — geometry leads.

### Beat 4 — Unfold (weight 15)

- Camera: macro swing — dolly 0.26→0.22m, azimuth −18°→+18° orbit across beat;
  focus on hinge barrels/wires (glossier metal, roughness 0.25 vs frame 0.35).
- Lighting: strips hold 12; key 36→40. Temple unfold staggered L then R,
  0.1 beat-interval, `power3.out` damping + settle (MOTION owns curve).
- DOM moves top-left `10vh` to clear hardware. Micro-cap `04 — RIMLESS /
  BLACK METAL / SMOKE LENS` [COPY NEEDED]. Display line max 6 words
  [COPY NEEDED]. Lens edge glow begins (see Beat 8 recipe ramp-up).

```
DESKTOP Beats 3–4                 MOBILE Beats 3–4
+--------------------------------+  +------------------+
| 04 — RIMLESS            [hinge] |  | [hinge macro]    |
| Folded arms rise  ===>--(o)     |  |   ===>--(o)      |
| from velvet.  [bridge right-    |  |                  |
| third, text left-third]         |  | Folded arms…     |
+--------------------------------+  +------------------+
```

### Beat 5 — Info + camera orbit (weight 15) — the Essilor beat

- Camera: slowest orbit of the film, ±12°, 0.22→0.30m ease-out; glasses sharp,
  case soft behind.
- Lighting: key 40 hold; strips 12 hold; exposure 1.05→1.15. No new lights —
  restraint before waves.
- DOM (only dense-text beat in the dark; left block 480px max, 13px list with
  12px hairline dividers between names):
  micro-cap `05 — LENSES` [COPY NEEDED]; display `Lenses with a prescription,
  not a pitch.` [COPY NEEDED placeholder]; list (verbatim B §4, roman, ® 60%):
  `Varilux® Physio Extensee™` · `Distinctive® Superior` · `Distinctive®
  Enhanced` · `Distinctive® SV Lenses` · `Essilor Stellest® 2.0 Lenses` ·
  `Transitions® Lenses` · `Xperio® Lenses`.
  Carousel heading `Our Popular High-Definition Lenses` (B §4) may serve as the
  micro-cap source instead — SITE/IA decides; visual treatment identical.
- Styling: names Inter 400 13px Bone, never bold, never italic; ®/™ at 60%.

```
DESKTOP Beat 5                    MOBILE Beat 5 (stacked sheet)
+--------------------------------+  +------------------+
| 05 — LENSES    (glasses soft    |  | (glasses top 40vh)|
| Lenses with a  right, list left)|  +------------------+
| prescription…  Varilux® Physio… |  | 05 — LENSES      |
|                Distinctive® Sup |  | Varilux®…        |
|                …(7 rows, hair-  |  | …(7 rows)        |
|                lines)           |  +------------------+
+--------------------------------+
```

### Beat 6 — Sponsor wave 1: eyewear brands (weight 15)

- Camera: pull back 0.30→0.55m, centered; glasses drift right-third, defocus
  to ~40% so logos own focus. FOV kick 38→46 eases back at settle (depth cue,
  not shake).
- Lighting: strips hold 12; fog 0.16→0.07 (far plane "opens"); Bloom threshold
  set so only streaks bloom, never logos.
- DOM: small left label only — micro-cap `CARRIED IN-STORE — 8 HOUSES`
  [COPY NEEDED]. No headline over center (art-director). One idea/viewport.
- Constellation: see §3. Streak treatment: velocity-stretched additive ribbons
  (0.6×0.008m planes, length = clamp(vel×0.12, 0.05, 0.5m), edge-faded,
  warm-white `#FFF2E2`), lateral comet-smear only — never radial warp, never
  blue starfield (brief: original, not Star Wars). Fog-density dip + FOV kick
  carry the rest. Hold formation 600–800px scroll so names read.

### Beat 7 — Wave 2: insurers (weight 7)

- Camera: hold 0.55m. Tighter, dimmer, faster (0.08 beat-interval vs 0.12).
  Formation 0.7m wide vs wave-1 1.1m arc.
- Lighting: key −15%, strips 12→8; logos at 68–76% Bone (dimmer tier).
- DOM: the one centered-text beat allowed — display
  `We Accept Most Major Insurance Plans` (verbatim B §5; alt caps render
  `WE ACCEPT MOST MAJOR INSURANCE PLANS` also verbatim) Fraunces 30–38px,
  sub-line 16px Inter [COPY NEEDED — e.g. direction "Bring your card…";
  do NOT assert direct-billing, B §5 UNVERIFIED].
- Deliberate anti-duplication (critic P0-6): wave 2 is a stagger-fade, never a
  second hyperspace. Wave 1 = scrub fly-in; wave 2 = fade-settle.

```
DESKTOP Beats 6–7                 MOBILE Beats 6–7
+--------------------------------+  +------------------+
| label   *MauiJim   Ray-Ban      |  | (arc flattened,  |
|  (glasses  Prada  MiuMiu  Persol|  |  2 depth layers, |
|   soft)   Oakley Tiffany Versace|  |  0.7× scale)     |
|   [wave2] We Accept Most Major… |  | We Accept Most…  |
|   SunLife Medavie Manulife…(8)  |  | (4×2 grid fade)  |
+--------------------------------+  +------------------+
```

### Beat 8 — Lens approach (weight 5)

- Camera: push 0.55→0.12m along lens normal to single (left) lens center.
  FOV 32°→18° (macro). Focus distance 0.12 (only DOF moment, desktop only).
  Text out — no type, geometry leads.
- Lighting: strips 12→20 (max); lens-edge glow peaks; AR shimmer
  (iridescence 0.35, green-magenta) most visible here; uApproach 0→1 drives rim
  0.5→3.0 (fresnel pow 3.5).

### Beat 9 — Lens entry → white (weight 3)

- Camera: near-plane crosses lens plane; crossing hidden by white overlay div
  0→1 (DOM, `expo.out`, ~300–600ms scroll-equivalent) + Bloom intensity ramp +
  exposure 1.35→2.2. Chromatic aberration 0.03–0.08 on transmission material
  only — no fullscreen CA pass (F §4.8).
- Lighting: all 3D light becomes irrelevant under overlay; canvas RAF-gated
  offscreen at handoff (perf, skill 9).
- Accessibility (critic P0-5): ramp to Paper `#F5F1E8`, never hard-cut to
  `#FFF`; 200ms Paper hold frame before practical content; reduced-motion =
  instant Paper cut, no flash, no bloom.
- DOM: cut all dark text at 80% white coverage (avoids grey-on-grey).

### Beat 10 — White act (weight ≈20% of intro)

See §4. Hard cut lands on Paper, object gone, rails + practical column.

---

## 3. Sponsor waves visual language

Source constraint (§6c-2): ALL logos render single-color light
(`assets/web/brands-light/`, `assets/web/insurance-light/`,
`assets/logo/eyeq-logo-white*`). Shapes identical to official art; no
recolor-as-new-logo beyond the approved light knockout. Unlinked everywhere
(brief §3, C lane: brand + insurance marks are unlinked today → keep unlinked).

### Wave 1 — 8 eyewear brands (display order, B §9)

Maui Jim · Ray-Ban · Prada · Miu Miu · Persol · Oakley · Tiffany & Co. ·
Versace. (+ Gucci name-drop exists only as services-page text, B §3 — never a
9th logo.)

- Rendering: alpha planes, `transparent:true, alphaTest:0.35–0.5`, depthWrite
  ON where possible; single-color `#E9E2D3` at 82–88% opacity; 1024px canvas
  textures (threejs-art-director). No color, no boxes, no glows.
- Settled constellation (screen space @1440, scales linearly down):
  1.1m-wide shallow arc around glasses, three depth layers —
  front 100% (Maui Jim, Ray-Ban) / mid 82% + 2px blur (Prada, Miu Miu, Persol)
  / back 64% + 4px blur (Oakley, Tiffany, Versace). Logo boxes 110–160px wide,
  28–40px tall. Min gaps 64px h / 48px v. Never a grid — an arc with
  ±14px vertical jitter (authored, seeded, not random per frame).
- Arrival: spawn z −3.5 (beyond fog) → rest z −0.4…−1.4, `expo.in` approach
  blended to `expo.out` settle, 0.12 beat-interval stagger, 6° face-camera +
  0.1 rad/s idle spin post-settle. Accumulates and PERSISTS as camera drifts
  past (brief §5 "accumulates").
- Streaks (original): per-logo 2–4 trailing ribbons as §2-Beat 6. Plus FOV
  38→46 kick and fog dip. No particles (brief §7 bans floating objects), no
  post motion-blur pass (F §2d: none verified — authored geometry instead).

### Wave 2 — 8 insurers (display order, B §5)

Sun Life · Medavie Blue Cross · Manulife · GreenShield · Canada Life ·
Desjardins · IA Financial Group · Empire Life, under verbatim heading
`We Accept Most Major Insurance Plans`.

- Rendering: same planes, Bone at 68–76% (one dimmer tier — hierarchy between
  waves), boxes 90–128px wide. Uniform baseline row + scattered second row,
  56px gaps; tighter 0.7m formation; min box 120×40px (critic P0-4).
- Arrival: stagger-fade only (0.08 interval), no streaks, no FOV kick. Wave 1
  owns velocity; wave 2 owns information. Never two hyperspaces (critic P0-6).
- Reduced-motion: both waves become static two-row formations, full DOM list
  with real names (screen-reader truth lives in DOM, canvas `aria-hidden`).

### Legibility on black (test contract)

- Eyewear ≥82% Bone holds 4.5:1 for large glyphs; insurers at 68–76% pass only
  ≥120×40px boxes — ARCHITECTURE/MOTION must enforce minimums, QA captures at
  1440 + 390 brightest-frame.
- Thin strokes (Tiffany serif, Medavie letterforms): never below 90px wide;
  mid/back layers get blur ONLY on wave-1 decorative depths, never on wave-2
  info tier.
- Mobile: waves scale 0.7, depth layers 4→2 (threejs-art-director), arc
  flattened to two rows; no horizontal overflow at 390px.

---

## 4. Lens portal + white act

### 4.1 The lens as we approach (beats 8–9 look)

- Glass: `MeshPhysicalMaterial`, transmission 0.92–1.0, roughness 0.05–0.12,
  ior 1.52, thickness 0.002 (≈2mm per G-I6 thin-down), specularIntensity 1,
  clearcoat 1. Smoke tint via attenuation (dark grey-green), never opaque.
- Reflections: drei `Environment` + animatable Lightformer strip panels
  sweeping across the lens (brief §6b mechanism); polished bright lens edges
  (edge material darker tint + higher specular); subtle AR-coating tint
  (green-magenta iridescence 0.35) in reflections; gentle Bloom on web only at
  portal (threshold gated so UI never blooms).
- Edge glow: fresnel rim (pow 3.5) + edge-glow mask, uApproach-driven 0.5→3.0.
  Dark-field discipline (§6b): visibility comes from rim/strip light, never
  from whitening the lens material.

### 4.2 Passing through (Beat 9)

Choreography, not shader (F §4.8: 80% camera path + bloom + overlay, 20%
shader): dolly along lens normal → transmission distortion pulse (only if
desktop perf allows; `chromaticAberration 0.03–0.08`) → near-plane crossing
hidden under white overlay → exposure 2.2 → Paper hold 200ms → practical
content. Reduced-motion: cut, no flash, no pulse.

### 4.3 White act layout

Centered practical column 560–640px on Paper `#F5F1E8`:

1. Micro-cap `EYEQ VISION CARE` (verbatim B §11 header text) + official logo
   (existing art; light section uses standard black logo D §1 — never the
   white film file here).
2. H1 `FROM EYE EXAMS TO EVERYDAY STYLE.` (verbatim B §2) — the page's single
   `<h1>` (SITE/IA owns heading order; art demands Fraunces 300 here).
3. CTA `BOOK YOUR EYE EXAM TODAY!` (verbatim B §2) → verbatim booking URL
   (brief §6c-3) as solid Ink 48px button, Inter 500 14px, arrow in Lamp-amber.
   One primary action per viewport (critic P2).
4. New-store block (verbatim brief §2, ledger rows with hairlines):
   `2-227 Vodden St East, Brampton, ON` · `tel:+19054970227` displayed
   `905-497-0227` · `eyeshine2020@gmail.com` · `Mon–Fri 11:00 am–6:30 pm ·
   Sat 11:00 am–5:00 pm · Sun 11:00 am–4:00 pm`.
5. About paras (verbatim B §2, all three, Burlington 2018 wording intact —
   historical copy preserved as-quoted; SITE/IA decides framing vs new store).
6. Old-store data (Burlington address/phones/info@eyeq2020.ca) appears NOWHERE
   (brief §2).

```
DESKTOP White act                 MOBILE White act
+--------------------------------+  +------------------+
| rail |  EYEQ VISION CARE       | rail | rail L 48px |
| L    |  FROM EYE EXAMS TO…(H1) | R   | or hidden     |
| 96-  |  [BOOK YOUR EYE EXAM…]  | 96- | CENTER column |
| 120px|  2-227 Vodden St East…  |120px| H1 / CTA /    |
|      |  905-497-0227 / email   |     | store block   |
|      |  hours ledger           |     | (stacked)     |
+--------------------------------+  +------------------+
```

### 4.4 The two vertical brand film-rails (anti-cheap spec)

This is the highest cheap-risk element (critic P0-3). Rules that keep it
"brand film" instead of "mall ticker":

- Geometry: 96–120px wide desktop (64px tablet), full-height, inset inside
  margins, flanking the practical column. Left rail = eyewear (down-loop),
  right rail = insurers (up-loop, `direction:reverse`). Opposing directions,
  linear `0→-50%` duplicated-track loop (`ease:"none"`, ~22s per 1000px),
  transform-only (skill `marquee-loop`).
- Film-strip detailing (matte, never glossy): rail bed Paper-dark `#ECE6D6`
  with 1px hairlines both edges; sprocket ticks 8×8px every 48px at 20% Ink;
  brand frames 96×64px; duotone black logos at 60% Ink; frame-number micro-cap
  9px below each frame; overall rail opacity 40–60%. Rhythm break: duplicate
  two hero frames (Ray-Ban, Sun Life) at 1.5× height.
- Anti-cheap laws: vertical ONLY (never a horizontal ticker); matte, no
  scale/rotate/skew on loop (velocity-skew allowed on left rail only if MOTION
  proves it stable — otherwise none); pause on hover/focus; IntersectionObserver
  offscreen-pause; reduced-motion = static wrapped grid; mobile = single 48px
  left rail or hidden, never two fast marquees at 390px; logo crops 3:2,
  `contain`-fit, min 120px wide source, no CSS perforations beyond the tick
  spec; no heavy shadows/filters per item.
- Content: official light/dark logo files only (D inventory); unlinked (C
  lane). Left rail draws from `brands-light`, right from `insurance-light`.

---

## 5. Rest-of-site look (below the white act — stays on Paper until footer)

One continuous Paper surface; variety comes from density and inversion, never
from decoration. No bento grids, no icon-tile rows, no card-on-every-block
(critic P0-1, E P2-6).

- **Services** — ledger, not cards. Left sticky H2 `Services` (B §3 H1); four
  rows (comprehensive eye exams / children's eye exams / contact lens fittings
  / Accurate Prescription Fittings + Comprehensive Eye Exams with their
  verbatim one-line descriptions, B §3): 01–04 Fraunces numerals 28px + Inter
  title + 1-line desc, 32px row padding, full-width hairline dividers. Booking
  link `Book your Eye Exam today` (verbatim B §3) as text-link with amber
  arrow, same URL. Intro paras verbatim (incl. "Eye Q Optical" spelling as
  observed — flag to SITE/IA, do not silently correct).
- **Lenses** — the single inverted block (Stage `#0A0C0E`). Same 7 Essilor
  names as 22px Fraunces rows with use-case micro-caps right; the three
  verbatim descriptions (Stellest 2.0 / Transitions® / Xperio®, B §4) as
  14/22px Bone-dim under their rows. One material close-up 4:3, 8px radius
  (real Blender/forge render or licensed photo, credited — playbook R7).
  Heading `Our Popular High-Definition Lenses` (verbatim B §4).
- **Insurance** — static 4×2 logo grid, Ink at 70%, 24px gutters, no animation
  (information, not atmosphere). Heading repeats `We Accept Most Major
  Insurance Plans` at 30px. No direct-billing claim (UNVERIFIED, B §5).
- **Reviews** — header `4.9 — 208 reviews` (Fraunces 48px + Lamp-amber stars
  16px) + `WHAT OUR CUSTOMERS SAY` / `Real reviews from real customers`
  (verbatim B §2). One featured Card-white + five compact two-col cards, 2px
  radius, 1px hairline, no shadows. All six texts verbatim with initials
  SW/H/NZ/AH/LL/EP exactly as shown (B §7, incl. `Honsa` spelling); no names,
  no star counts, no dates invented. Staff names Anees/Hosna/Mojo appear only
  inside quoted text.
- **Visit/contact** — split: left hours/address/phone ledger (16px rows,
  hairlines), right Card-white booking card (48px Ink CTA + email underline
  link). Map embed rebuilt for Brampton address (C lane). No contact form
  (none exists, B/C). Footer returns to Void: Bone-dim micro-caps, three
  columns (visit / policies trio refund·privacy·terms / booking), `© 2026
  EyeQ Vision Care` (verbatim pattern B §11). No social icons (none exist,
  B §11 — do not invent).
- **Buttons/links/hovers**: primary = solid Ink (light) / solid Bone (dark),
  48px min, Inter 500 14px, arrow translates x 0→6px on hover 0.35–0.6s
  `power3.out`; text links = underline draw (scaleX 0→1, 0.4s); magnetic
  ≤0.35 strength on booking CTA only; image zoom 1→1.06, 0.7s. Grayscale→color
  only on small media. No custom cursor (critic P1-7 — it would read as glow
  blob and hide the §6b lens work). Focus: 2px Lamp-amber outline, always
  visible, never removed.

---

## 6. Anti-slop checklist (project-specific)

Binding on all Phase 4 implementation; MOTION/ARCHITECTURE must verify each:

- [ ] **A1 — No gradient set-dressing.** No linear/radial CSS gradient larger
      than the 40%-viewport caption scrim. Cinema comes from the render's
      raking key + rim + falloff, never purple washes. (E P1-4, critic P0-1)
- [ ] **A2 — No glassmorphism over 3D.** Text sits on scrim ≤0.55 + 1px
      hairline max. Zero `backdrop-blur` over canvas. (critic P0-1)
- [ ] **A3 — No particles/dust/sparkles in DOM.** Sterile dark room; dust only
      if inside the render. (brief §7, critic P0-1)
- [ ] **A4 — Single-color logos or nothing.** One color logo in any wave/rail
      collapses the act — waves use approved light knockouts at specced
      opacities/sizes only. (critic P0-1/4)
- [ ] **A5 — Rails stay film, never ticker.** Vertical only, matte per §4.4,
      max two rails desktop / one mobile, pause + reduced-motion static.
      (critic P0-3)
- [ ] **A6 — No hype words.** Grep-block: VISION/FOCUS/CLARITY as standalone
      display, "premium," "ultimate," "best-in-class," "award-winning,"
      version pills, eyebrow-every-section. Brief §7 + E P1-3. Chapter titles
      are two-word editorial or engineering-poetry ("From 0.5 mm to 300 km/h"
      register, ic! berlin E-06) — never one-word hype.
- [ ] **A7 — No card grids.** Services = ledger, lenses = inverted rows,
      reviews = 1+5 asymmetric, insurance = static grid. Zero 3-equal-cards,
      zero 16–24px radii, zero drop shadows on Paper. (critic P0-1)
- [ ] **A8 — Type discipline.** Fraunces ≥48px display only, ≤8-word
      headlines, −0.02em, never italic over 3D; Inter everywhere else. One
      display face per viewport. (critic P0-2)
- [ ] **A9 — Contrast contracts hold.** Bone-on-Void body ≥4.5:1; no centered
      paragraph over moving hardware; insurer boxes ≥120×40px; brightest-frame
      captures at 1440 + 390. (critic P0-4, playbook legibility gate)
- [ ] **A10 — White landing is Paper, ramped.** 800ms `expo.out` to `#F5F1E8`,
      200ms hold, reduced-motion instant cut, no flash. (critic P0-5)
- [ ] **A11 — One idea per viewport, max two pins/page.** Wave 2 never a
      second hyperspace; hero poster readable ≤1.8s without JS; intro
      skippable. (critic P0-6)
- [ ] **A12 — No custom cursor, no outer glow.** Lens visibility only via
      §6b dark-field strips + Environment/Lightformer + polished edges +
      gated bloom. (critic P1-7, brief §6b)
- [ ] **A13 — Real assets only.** Case/velvet/glasses = Cycles-portable glTF;
      HDRI on every material; ACES; DPR ≤2; paused offscreen. Zero CSS/SVG/div
      illustration, zero AI eye closeups, zero stock eyes. (critic P1-8,
      playbook Real-Assets gate)
- [ ] **A14 — Zero invented content.** All copy quoted (§2) or `[COPY NEEDED]`.
      No invented promos (none exist, B §6), hours (live site has none — new
      hours only from brief §2), social links, stats, reviews, sponsors.
- [ ] **A15 — Zero popups in first three viewports.** (E P0-2: every reference
      with a modal stack was penalized.)

## Open questions for coordinator (not decisions)

1. Beat 1/2/4/6 display lines are `[COPY NEEDED]` — SITE/IA must supply or
   confirm chapter titling (two-word editorial vs engineering-poetry).
2. Wave-2 sub-line must avoid asserting direct billing (UNVERIFIED, B §5) —
   needs client confirmation (also synthesis §7: Burlington-era booking code).
3. About paras retain "Burlington…since 2018" wording — SITE/IA + client to
   decide framing against the Brampton store; ART preserves verbatim either way.
4. Fraunces ships OFL via Google Fonts; logo-light recolors are
   shape-identical client-confirmation items (synthesis §7) — not ART's call.

---

*End of PLAN-art-direction. Files referenced, none modified. Blender, `blender/`,
`public/models/`, `assets/` untouched per instructions.*

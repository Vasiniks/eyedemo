# PLAN — MOTION: master scroll choreography + site-wide motion language
Phase 4 · EyeQ Vision Care cinematic homepage · PLANNING ONLY (no code, no packages, no Blender)

Sources read: `docs/00-BRIEF.md` (all, incl. §6b/§6c), `docs/research/00-PHASE2-SYNTHESIS.md`,
`docs/research/B-content-inventory.md`, `docs/research/E-visual-references.md`,
`docs/research/F-3d-motion-tech.md`, `docs/research/G-glasses-model.md`.
Specialists consulted (read-only): `motion-designer`, `threejs-art-director`.
Skills loaded: `cinematic-gsap-lenis-motion-system`, `build-threejs-scroll-worlds`,
`gsap-scrolltrigger-storytelling`, `design-motion-principles`, `masked-reveal`,
`marquee-loop`, `no-ai-design-slop`. GSAP MCP: `gsap-timeline` + `gsap-scrolltrigger`
official guidance (labels, position params, scrub/pin, containerAnimation `ease:"none"`,
refreshPriority — note: higher refreshPriority refreshes first, verified correction).

Scope: this plan owns MOTION only (choreography, timing, eases, camera/object math,
portal, rails, vocabulary, a11y, perf). SITE/IA, ART DIRECTION, ARCHITECTURE,
REFERENCE TEARDOWNS are other planners' lanes. Blender/Phase-3 assets are inputs —
this plan never models, only drives baked pivots via scroll progress.

Copy rule: every string below is quoted verbatim from B or the brief's new-store block.
Anything not in B is marked `[COPY NEEDED]`. No invented claims, stats, promos.

Global thesis: "optician's dark room" (brief §5, E §7) — darkness → controlled light →
clarity. Every motion explains light, material, or spatial causality. Nothing moves
for decoration. One easing family site-wide (§7). Scrubbed film = linear; DOM reveals
= expo.out; curtain/handoff = expo.inOut; micro = power2.out (see §7).

Stack assumption (from F, for ARCHITECTURE planner to confirm): Vite + React 19 +
R3F 9.8 + drei 10.7 + three 0.186 + GSAP 3.15 ScrollTrigger + Lenis 1.3. One GSAP
master timeline, scrubbed, pinned; R3F reads `progress` from a ref and damps toward
it (`rig.target` exact / `rig.smooth` damped). No drei `ScrollControls` (owns its own
scroll container, fights Lenis — F §2c). No ScrollSmoother (Club-only). One ticker:
`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t*1000))`
+ `gsap.ticker.lagSmoothing(0)`.

---

## 1. Total scroll budget

Weight basis (brief §5): `10 / 15 / 15 / 15 / 15 / 15 / 7 / 5 / 3` = 100 dark units.
White act ≈ 20% of whole intro ⇒ dark = 80%, white = 20% ⇒ white = 25 units,
whole intro = 125 units.

Chosen budget (balances dwell for reading vs. pin fatigue; matches F §4.6 envelopes):

- **Desktop: 1000 vh total** — dark film 800 vh + white act 200 vh. 1 unit = 8 vh.
- **Mobile (≤768 px): 700 vh total** — dark film 560 vh + white act 140 vh. 1 unit = 5.6 vh.
  Shorter because FOV is wider, type overlays stack above the 3D window, and long
  pins trap small screens (E §6 restraint law).

Master timeline: one `gsap.timeline({ defaults:{ease:"none"}, scrollTrigger:{
trigger:"#film", start:"top top", end:"+={total}", scrub:1.0, pin:true,
anticipatePin:1, invalidateOnRefresh:true } })` with `addLabel()` per beat.
Scrubbed tweens use `ease:"none"` (scroll position IS the timing — E §6.2, F §4.6);
arrival *curves* are baked into the interpolated values (expo-shaped keyframes),
not into tween eases. DOM captions inside beats may use `expo.out` micro-tweens
driven by `containerAnimation`/progress callbacks, never competing scrub eases.

Progress convention: `p` = master timeline progress 0→1 over the DARK pin only
(white act is a second, unpinned DOM region; handoff at p=1.0). Beat boundaries:

| # | Beat (brief) | Weight | p start–end | Desktop vh | Mobile vh | What animates (3D + DOM) | Ease rule |
|---|---|---|---|---|---|---|---|
| B1 | Case reveal | 10 | 0.00–0.10 | 80 | 56 | Case fades/scales in from black; raking key ramps 0→2.5; camera push-in opens; caption micro-caps fades | scrub linear; caption `expo.out` 900 ms equiv |
| B2 | Open / velvet | 15 | 0.10–0.25 | 120 | 84 | Flap 0→40° w/ overshoot+settle (§3); velvet sheen ramps; red rim 0→3.0; iris `clip-path:circle()` DOM veil opens | baked-expo keyframes, scrub linear |
| B3 | Emerge | 15 | 0.25–0.40 | 120 | 84 | Folded glasses rise out of velvet (y +90 mm→0 equiv); rotX 12°→0°; dark-field strips sweep 0→4.0; lens edges catch fire | scrub linear |
| B4 | Unfold | 15 | 0.40–0.55 | 120 | 84 | Temples L then R, 85°→0° w/ stagger + overshoot (§3); hover idle starts at beat end | baked `expo.out`-shaped angles, scrub linear |
| B5 | Info + camera | 15 | 0.55–0.70 | 120 | 84 | Slow orbit 180° (damped segments); 7 Essilor lens names appear one by one in tracked micro-caps; camera micro-push | scrub linear; text `expo.out`, line stagger 90 ms |
| B6 | Wave 1 (brands) | 15 | 0.70–0.85 | 120 | 84 | 8 eyewear-brand planes fly z-far→slots (§4); FOV kick +8°; fog dip; streaks by velocity | arrival curve expo (baked), scrub linear |
| B7 | Wave 2 (insurers) | 7 | 0.85–0.92 | 56 | 39 | 8 insurer planes, tighter/faster variant (§4); FOV kick +7° then ease back; heading `We Accept Most Major Insurance Plans` | same as B6, shorter window |
| B8 | Lens approach | 5 | 0.92–0.97 | 40 | 28 | Camera dollies along right-lens normal to threshold; FOV 35→48; transmission 0→0.9; refraction/chroma ramp begins | scrub linear |
| B9 | Lens entry → white | 3 | 0.97–1.00 | 24 | 17 | Near-plane cross; bloom 0.6→1.4; white overlay 0→1; canvas hands off to DOM (§5) | linear + 400 ms `expo.inOut` overlay |
| W | White act (practical) | 25 | post-pin | 200 | 140 | Unpinned DOM: practical info, booking CTA, 2 vertical opposing brand rails, then rest of homepage (§6) | DOM `expo.out` reveals, rails linear infinite |

Check: 80+120+120+120+120+120+56+40+24 = 800 dark (desktop); +200 white = 1000. Mobile:
56+84+84+84+84+84+39+28+17 = 560; +140 = 700. p boundaries = cumulative weight / 100.

Lenis (from skill + F §4.11, motion-designer consult):
`new Lenis({ lerp:0.09, smoothWheel:true, wheelMultiplier:1.0, touchMultiplier:1.5,
anchors:true })`; single `gsap.ticker` owner; `lagSmoothing(0)`. Reduced-motion:
no Lenis at all (native scroll). ScrollTrigger defaults: `scrub:1.0` (cinematic
delay band 0.8–1.2; 1.0 chosen — 1.2 felt drunk in consult, 0.8 felt CCTV),
`anticipatePin:1`, `invalidateOnRefresh:true`. No snap on the film (snap fights
reversibility; GSAP guidance). `ScrollTrigger.refresh()` after fonts, logo images,
and both `.glb` loads. `refreshPriority`: pin trigger highest (refreshes FIRST —
per verified MCP correction, higher = first).

Reload-at-depth, scrollbar-drag, fast-flick, reverse, resize-mid-beat must all
reproduce identical state: everything is a pure function of `p` (§8).

---

## 2. Camera path

Conventions: metres, origin = case centre at rest. Case ≈ 0.165 × 0.062 × 0.026 m
(E §7 target 165×62×26 mm). Perspective, base FOV 35 (desktop) / 44 (mobile, +9°).
`near 0.01 / far 60`; near animates →0.002 only during B8–B9. No auto-orbit, no
pointer-parallax on the film camera (consult: pointer parallax disabled — it fights
the portal alignment; allowed ±6 px on DOM layers only, §7).

Interpolation: **damped segments** (`rig.smooth = damp(rig.smooth, rig.target,
λ=5.2, dt)` in `useFrame`; render state only — `rig.target` stays exact for nav/a11y).
Catmull-Rom (resampled 24 pts) ONLY for the B5 orbit arc; everything else is
segment lerps between authored endpoints so story pacing stays intentional
(`build-threejs-scroll-worlds` rule: parameterize by chapter progress, not arc length).
`scrollWeight` dwell lives in the vh budget (§1), never in path distortion.

Keyframes (desktop; mobile = pullback ×1.45 on radius + FOV +9°, see overrides):

| Beat edge (p) | Position (x,y,z) m | Target (x,y,z) m | FOV | Notes |
|---|---|---|---|---|
| 0.00 (B1 start) | (0.18, 0.10, 0.32) | (0, 0.010, 0) | 32 | Macro graphite shell, raking key left-high 45°, fill 0.15. Shell fills ~55% vh, centred |
| 0.10 (B2 start) | (0.14, 0.12, 0.29) | (0, 0.012, 0) | 33 | Push-in holds while flap starts; key 2.5→1.2, red rim 0→3.0 (#7a1010 rear-right) |
| 0.25 (B3 start) | (0.12, 0.14, 0.26) | (0, 0.015, 0) | 34 | Flap at 40°; camera tips down to velvet; grazing light across folds |
| 0.40 (B4 start) | (−0.14, 0.12, 0.22) | (0, 0.060, 0) | 35 | Cut-around: camera swings to 3/4 front as glasses rise; dark-field strips 2×4.0 cool-white grazing lenses |
| 0.55 (B5 start) | orbit r=0.28, h=0.12, θ 0→180° | (0, 0.070, 0) | 35 | Slow orbit (Catmull-Rom 24-pt resample); Essilor captions; strips 2.0, key 1.8 |
| 0.70 (B6 start) | (0, 0.10, 0.42) | (0, 0.070, 0) | 35→43→35 | Wave 1: FOV kick +8° at peak velocity, ease back by beat end; fog 0.035→0.015 dip |
| 0.85 (B7 start) | (0, 0.09, 0.36) | (0, 0.070, 0) | 35→42→35 | Wave 2: kick +7°, tighter slots; exposure 1.0→1.15 |
| 0.92 (B8 start) | approach along right-lens normal ≈ (−0.08, 0.02, 0.97) from 0.30 m out | lens centre | 35→48 | Lens normal precomputed from baked glasses transform; camera path is straight rail, no curve |
| 0.97 (B9 start) | lens centre + normal × 0.045 m | lens centre | 48→68 | Threshold: transmission 0.9, chroma ramp, bloom 0.6; `near→0.002` |
| 1.00 (handoff) | lens centre + normal × −0.04 m (behind lens plane) | lens centre | 68→55 settle | Near-plane crossed under white overlay (§5); canvas `opacity 1→0` 450 ms |

Fog: `FogExp2 #000, density 0.035` base; dips to 0.015 during B6–B7 (far plane
"opens" for hyperspace), returns 0.030 for B8 (lens reads against black), then
white overlay takes over. ACESFilmic, exposure 1.0→1.15 (B6–B7) →0.4 key collapse
in B9 as lens emissive + strips →6.0 blow out to white.

Clipping discipline: keep ≥8 mm off opaque surfaces except the authored B9 pass;
fade temples/velvet via `material.opacity` inside 20 mm during B8 (no visible pop);
logos `depthWrite:false, alphaTest:0.4` so they never clip each other.

Mobile overrides: pullback ×1.45 (orbit r 0.40 m, dive start 0.40 m out),
FOV base 44 (±kick same deltas), 3D window 60 vh with copy stacked above
(canvas `position:sticky`, not fullscreen-behind-type — type never overUnreadable 3D
on 390 px). DPR ≤1.5, bloom/chroma OFF (§8).

Lighting choreography (tied to `p`, all intensities in physical-ish arbitrary units
tuned against the studio HDRI — ARCHITECTURE/ART-DIRECTION lock the HDRI asset):
B1 key 0→2.5 6500 K; B2 key→1.2 + red rim→3.0; B3–B4 dark-field strips→4.0 +
rim 2.0 (lens-edge fire per brief §6b); B5–B7 key 1.8 + strips 2.5 (logo legibility);
B8–B9 key→0.4, strips→6.0, lens emissive→white. Velvet dies under flat light —
grazing angle mandatory in B2–B3 (E velvet recipe).

DOM/3D composition: desktop canvas fixed full-viewport behind DOM, z-0; type lives
at edges (top-left headline, bottom micro-caps), hero 3D centre-right, safe cone
0.5 m around hero never occluded by copy scrims. Local scrims only (gradient
scrim 120 px behind copy, not full-page blanket — contrast ≥4.5:1 at brightest
frame). Canvas `aria-hidden`; all meaning duplicated in DOM (§8).

---

## 3. Object animation (all pure functions of `p`; damping only in render smoothing)

### 3.1 Case reveal (B1, p 0.00–0.10) — light-driven, never a pop
- Case group `opacity 0→1` + `scale 0.92→1.0` over first 40% of beat, scrub linear.
- Key light `0→2.5` over the whole beat; graphite edge highlights arrive before
  the silhouette is fully readable (light reveals form — the dark-room thesis).
- Emboss/deboss logo catches light at p≈0.06 (micro-bevel 0.1 mm does the work;
  no emissive, no glow — brief §6 forbids).
- DOM: one tracked micro-caps line fades `autoAlpha 0→1`, `y 12→0`, `expo.out`
  900 ms equiv. `[COPY NEEDED]` for the exact opening caption (must come from B
  or be flagged — candidates: `FROM EYE EXAMS TO EVERYDAY STYLE.` is the H1 and
  belongs in the white act, NOT here; dark beats use at most 5–8 word chapter
  titles in the Lindberg/Mykita register, e.g. chapter numerals — final strings
  are SITE/IA lane; this plan reserves the slot and timing only).

### 3.2 Flap open (B2, p 0.10–0.25) — 0→40°, overshoot + settle, slightly elastic
- Rotation about authored long-spine hinge axis (Phase-3 Empty; runtime pivot group).
  Target sweep **40°** (brief §6: "slightly elastic, not a 90° box lid" — the
  90°+ values from one consult are REJECTED as violating the brief).
- Baked elastic keyframes (evaluated by `p`, so scrub-reversible; the "ease" is in
  the keys, the tween stays linear):
  `0° @0.00 → 32° @0.55 → 43.5° @0.75 (overshoot +3.5°) → 38.2° @0.87 (settle −1.8°)
  → 40.0° @1.00`. Tip-lag: 2-segment flap rig, tip = 10% lagged damped follow
  (fake flex; keeps rigid-hinge read away without a shape-key pipeline).
- Velvet response coupled: sheen weight ramps with flap angle (velvet is revealed
  BY the opening — causality), red rim 0→3.0 delayed 15% behind flap.
- Fallback (only if runtime rig fails): baked shape-key Basis→Open via
  `useAnimations`, `action.time = p` — heavier, keep as contingency, not primary.
- Non-scrub contexts only (reduced-motion OFF path never uses this): 900 ms
  `expo.out`; stage-demo alt `elastic.out(1,0.55)` 1100 ms — never inside scrub.

### 3.3 Glasses emerge (B3, p 0.25–0.40) — lift path out of the velvet
- Folded glasses group: `y +0.090 m → 0` (90 mm lift, starts inside velvet saddle),
  `rotX 12°→0°`, `opacity 0→1` (first 30% of beat), scrub linear.
- Emergence height choreographed so folded temples clear the case lip (G hinge
  pivots: R `(0.6827, −0.5842, 0.3095)` pre-scale; Phase 3 re-measures post-scale —
  this plan consumes the pivot, never re-authors it).
- Dark-field strips sweep 0→4.0 across the beat; lens edges ignite mid-beat
  (smoke-tinted lenses, brief §6c.4: black metal, smoke lenses, black tips).
- Interpenetration guard: one arm lands +3 mm depth-offset so folded tips overlap
  without clipping (real-glasses overlap, G §Rigging-3).

### 3.4 Unfold (B4, p 0.40–0.55) — arm timing offset L/R, overshoot, damping
- Fold = rotation about Blender-Z (vertical) axis through each hinge pivot,
  ~85–95° inward. Runtime nested `<group>` pivots (F §4.5 recommendation).
- Timing: LEFT arm leads; RIGHT arm = LEFT(`p` − 0.08) — 0.08 progress lag
  (≈140 ms equiv). Stagger reads as deliberate, mechanical, premium.
- Per-arm baked keys (scrub linear): `85° @0.00 → 0° @0.82 with overshoot
  −7° @0.82 → +2.5° @0.92 → 0° @1.00` (sign = past-centre then settle; tune sign
  visually in Phase 4 against hinge-axis handedness).
- Static front group never deforms (lenses stay ONE object; hinge barrels/wires
  stay with front). Junction crack check at 0/45/90° is a Phase-3 modelling gate.
- At beat end: hover/rotate idle starts (§3.5).

### 3.5 Hover / rotate idle (B4 end → B8)
- Independent ticker (NOT scrubbed — ambient life must not rewind with scroll):
  `y ±0.004 m @ 0.36 Hz (2800 ms sine)`, `rotY ±3° @ 4500 ms`, `rotZ ±0.6°`,
  all `sine.inOut` yoyo. Subtle — "best animation goes unnoticed"
  (design-motion-principles golden rule).
- Lightformer strip shimmer only other ambient loop (reflection sweep across
  lenses, ±5% intensity, 6 s period). No float/drift on camera, case, or logos.
- Idle pauses during B6–B7 velocity peaks (logos own the motion) and during B8–B9
  (portal owns it); resumes amplitude-ramped (300 ms) so there is no step.
- Reduced-motion: idle OFF entirely (static final pose).

---

## 4. Sponsor arrival math (Wave 1 + Wave 2)

Facts (brief §6c.1, B §8/§5): Wave 1 = 8 eyewear brands in DOM order —
`Maui Jim, Ray-Ban, Prada, Miu Miu, Persol, Oakley, Tiffany & Co., Versace`
(B §8). Wave 2 = 8 insurers — `Sun Life, Medavie Blue Cross, Manulife,
GreenShield, Canada Life, Desjardins, IA Financial Group, Empire Life` (B §5)
under heading `We Accept Most Major Insurance Plans` (B §5; alt-caps render
`WE ACCEPT MOST MAJOR INSURANCE PLANS` also attested). All logos render
single-colour/light on transparent (`assets/web/brands-light/`,
`assets/web/insurance-light/` per brief §6c.2), unlinked (C: all 16 unlinked —
keep unlinked). (Consult drafts showing 10/6 counts are corrected here to 8/8.)

System (F §4.7): instanced alpha planes, camera-relative z-travel, NO post
motion-blur pass (none verified — F §2d). Each logo = plane with official art,
`transparent:true, alphaTest:0.4, depthWrite:false`, `MeshBasicMaterial`
(`toneMapped:false` so whites stay paper). Planes `lookAt(camera)` every frame.

### 4.1 Start, curve, duration, stagger
- Spawn: `z = −18 to −22 m` (beyond fog, invisible), lateral scatter
  `x ±6 m, y ±3 m` (seeded, deterministic — same scroll = same sky).
- Travel: toward precomputed accumulation slots (§4.3) on an exponential arrival:
  fast mid-flight, hard deceleration. Baked per-logo progress remap
  `e = 1 − pow(2, −10·t)` (`expo.out` shape) applied to the logo's local `t`,
  evaluated under scrub-linear master. Felt register: hyperspace z-flight with
  warm-white streaks on near-black + fog + FOV — NOT blue starfield, no crawl
  (brief: "original — not Star Wars").
- Duration per logo: Wave 1: **0.060 progress** (≈48 vh desktop / 34 vh mobile —
  each logo's flight lasts ~40% of the wave window); Wave 2: **0.045 progress**.
- Stagger between logos: Wave 1: **0.011 progress** (≈9 vh desktop); Wave 2:
  **0.008**. Wave 1 spans p 0.70–0.85 (8 logos × stagger + flight ≈ window);
  Wave 2 spans p 0.85–0.92. Last logo settles ≥0.015 progress before beat end
  (settle dwell — never cut mid-flight).
- Scale compensation: `scale = dist × k` so arrival size is uniform
  (0.28 × 0.14 m planes at accumulation radius); no size pops.

### 4.2 Streak / motion-blur treatment (tied to velocity, authored geometry)
- 2–4 stretched additive streak instances trail each logo (elongated planes,
  `scaleX 3.2→1`, `skewX −14°→0°`, `opacity 0.55→0`, `blur 8→0` over the first
  35% of that logo's window — `power2.out` 300 ms equiv, scrub-evaluated).
- Global velocity FX: FOV kick (§2: +8° W1 / +7° W2, eased back), fog-density dip
  0.035→0.015, radial `Vignette` pulse (verified prop; `offset 0.5, darkness
  0.5→0.65`). No fullscreen CA pass; per-material `chromaticAberration` reserved
  for B9 only. Streak opacity is a pure function of per-logo velocity
  (`d(position)/d(p)`) — fast scroll = longer streaks, stopped scroll = clean
  logos. This is the "hyperspace" read, and it is free on the GPU (transforms +
  opacity only).

### 4.3 Accumulation (where each settles + gentle hover afterwards)
- Layout: arc gallery, radius **1.6 m (W1) / 2.1 m (W2)**, sweep 100° (desktop;
  mobile 1.2/1.5 m, 70°), centred on camera target, tilted −8° (gallery wall
  reads below the glasses, never occluding them). Slots precomputed, deterministic.
- Persistence: W1 gallery PERSISTS as camera drifts past into W2 (brief:
  "accumulates"); W2 slots sit on a second, outer arc so both read together at
  p≈0.90 (16 planes max visible — within F §4.7 alpha budget 12–20; mobile atlas
  shares 1 texture per wave to cap overdraw).
- Post-settle hover: `y ±0.006 m @ 5 s sine`, per-logo phase offset (i/8 × 2π);
  opacity 1.0; no rotation (logos are print artifacts — planes stay honest).
- Wave 2 variant: same system, fewer vh per logo, tighter slots (slot pitch ×0.8),
  heading caption first (`We Accept Most Major Insurance Plans`, word-mask reveal
  800 ms `expo.out`), then flights. W2 streaks 30% shorter (smaller kick).

### 4.4 Essilor beat (B5) — NOT a flight wave
The 7 lens names (`Varilux® Physio Extensee™` · `Distinctive® Superior` ·
`Distinctive® Enhanced` · `Distinctive® SV Lenses` · `Essilor Stellest® 2.0 Lenses`
· `Transitions® Lenses` · `Xperio® Lenses` — B §4, ®/™ intact) appear as tracked
micro-caps DOM lines around the slow orbit, one per ~17 vh, word-mask reveal.
Descriptions for Stellest/Transitions/Xperio exist verbatim (B §4) but are TOO
LONG for the film — reserve them for the white act / services section (SITE/IA
lane). Film shows names only. (B §Recommended-wave-2-group proposed Essilor as
wave 2; brief §6c.1 OVERRIDES: Wave 2 = insurers. This plan follows the brief.)

---

## 5. Lens approach + portal (B8–B9, p 0.92–1.00; 64 vh desktop / 45 vh mobile)

Two-stage (F §4.8): APPROACH (real optics) → PASS (choreography + bloom + overlay).
The portal is 80% camera path + bloom + white overlay, 20% shader. No custom GLSL
portal shader (stretch only, needs re-plan + perf proof).

1. **Alignment (B8, p 0.92–0.97):** camera leaves orbit and rails onto the
   right-lens normal (≈ direction (−0.08, 0.02, 0.97) in glasses-local — recompute
   from baked transform at build; left lens is the mirror backup). Straight dolly,
   0.30 m → 0.045 m from lens centre. FOV 35→48. `near 0.01→0.002`. Glasses idle
   damps to zero (portal needs a stable target). Lens material (native
   `MeshPhysicalMaterial`): `transmission 0→0.9, roughness 0.05–0.12, ior 1.1→1.45,
   thickness 0.002→1.0 (tune), specularIntensity 1`, studio HDRI reflections on
   (without env the lens reads black — F §4.8 risk). Strips →6.0 for edge fire.
2. **Refraction/distortion ramp (p 0.95–0.98):** `chromaticAberration 0→0.35→0`
   (only if `MeshTransmissionMaterial` is used AND desktop tier; else skip —
   FOV kick carries the effect), `distortionScale 0→0.5`, bloom
   `intensity 0.15→0.6 (threshold 0.85→0.6, radius 0.4→0.7)` (verified Bloom props).
   FOV 48→68 (stretch ecstasy, 0.03 progress). Reduced-motion: none of this.
3. **Pass-through (p 0.98–1.00):** camera near-plane crosses the lens plane UNDER
   a white DOM overlay (`#white-veil`, `opacity 0→1`, 400 ms `expo.inOut`,
   starting at p=0.985 so the crossing is fully covered). Bloom →1.4 at the same
   instant, then canvas `opacity 1→0` 450 ms. No visible clip pop at any viewport
   (test 390 px where FOV differs — QA gate).
4. **DOM handoff:** at p=1.00 the pin releases (`anticipatePin:1` tuned so there
   is no pin-release jank; `ScrollTrigger.refresh()` after practical images load).
   R3F canvas stays mounted but RAF-gated offscreen (skill 9: `is-offscreen` →
   cancel RAF, `offscreenRunningCount:0`). White act begins seamlessly: first
   white headline is already at `autoAlpha:1` under the veil as it clears —
   reader never sees an empty viewport (playbook gate: no empty viewports).
5. White-flash a11y: ramp only, never 0→100% cut; reduced-motion = hard cut at
   reduced brightness (veil `#fff` → `#f5f1e8` warm bone, never pure strobe).

Lens thickness note: G measures 6 mm stylised-thick; thin to ~2 mm in Phase 3 if
close-ups read toy-like — MOTION consumes whatever Phase 3 bakes, with
`thickness` retuned to match.

---

## 6. White act + rails (200 vh desktop / 140 vh mobile, unpinned DOM)

Function: daylight + facts after the dark room. Palette warm bone `#f5f1e8` →
paper `#fff` (ART DIRECTION owns exact tokens; motion respects them).

Content order (copy verbatim from B; SITE/IA owns final order — motion reserves
slots + timings): H1 `FROM EYE EXAMS TO EVERYDAY STYLE.` + CTA
`BOOK YOUR EYE EXAM TODAY!` → booking URL (brief §6c.3) → practical block
(phone `905-497-0227`, `tel:+19054970227`; email `eyeshine2020@gmail.com`;
`2-227 Vodden St East, Brampton, ON`; hours `Mon–Fri 11:00 am–6:30 pm ·
Sat 11:00 am–5:00 pm · Sun 11:00 am–4:00 pm` — brief §2) → about paras → services
→ lens descriptions → insurance → reviews → rails feed rest of homepage.
`[COPY NEEDED]`: any transitional sentence between portal and H1 (do not invent;
if none exists, hard-cut to H1 with no bridge line).

### 6.1 Rails — two vertical opposing-direction brand film rails
- Mechanics (E-30 rotated 90°, skill `marquee-loop`): two vertical tracks, each a
  duplicated logo column (`0→−50%` loop, `ease:"none"`, `repeat:-1`), one up-loop,
  one down-loop (`direction:reverse`). DOM `<img>` (light logos, official art,
  `contain`-fit, uniform card height, never cropped/recoloured) — NOT WebGL
  (a11y + links + perf — F §4.10).
- Speeds: **72 px/s desktop / 44 px/s mobile** (slow film, not motorsport —
  E restraint). Scroll-velocity coupling: ±15% around base, lerped 400 ms linear
  (`quickTo` on `timeScale`), so fast scrolls breathe the rails without hijacking
  readability. Hover on a rail card: that rail eases `72→20 px/s` 400 ms linear
  (hover-pause only because cards are content; skill guardrail respected).
- Masks: `mask-image:linear-gradient(to bottom, transparent, black 12%, black 88%,
  transparent)` on each rail container; `will-change:transform` on tracks only;
  `content-visibility:auto` on cards. Fixed card heights (no layout shift) +
  `ScrollTrigger.refresh()` after logo images load.
- Left rail = 8 eyewear brands (order B §8); right rail = 8 insurers (order B §5),
  each list duplicated 2× for the loop. Headings above rails use the verbatim
  section names (`OUR FEATURED EYEWEAR BRANDS`, `We Accept Most Major Insurance
  Plans`). Reduced-motion: static wrapped grid, no marquee (§8).

### 6.2 Text reveal vocabulary (white act + rest of site — one family)
- Headlines: split-LINE mask reveals (lines, not letters — design-motion-principles
  calm-editorial rule). `yPercent 110→0`, `duration 0.9 s`, `ease expo.out`
  (fallback `power4.out` where expo feels too hot on small type), line stagger
  `0.09 s`, trigger `top 82%`, `once:true`. `aria-label` full text, spaces
  preserved, reduced-motion static (§8). Short text only; never split links/buttons
  or the booking CTA.
- Body/labels: `fade-up` (`y 32→0, autoAlpha 0→1`, 0.85 s `expo.out`) or `blur-in`
  (`y 18→0 + blur 10→0`, small elements only — never large-image blur).
- Image clip reveals: `clip-path:inset(0 0 100% 0 → 0 0 0% 0)` 1.1 s `expo.out` +
  inner `img scale 1.08→1` 1.2 s, same trigger. Parallax: `±0.18 max`
  (`data-parallax-speed ≤ 0.18`, scrub 1.2) — backgrounds slower, text stable.
- Booking CTA (the ONE magnetic element): `quickTo x/y ≤6 px`, 300 ms
  `power2.out`; text-roll `y −100%` + bg wipe 400 ms `expo.out`. No other magnets.

---

## 7. Rest-of-site motion vocabulary (restrained, one easing family)

Easing family (single source of truth): **`expo.out`** (reveals, hovers, cards),
**`expo.inOut`** (curtain, portal overlay, route handoffs), **`power2.out`**
(micro: underlines, arrows, magnets), **`linear`** (scrubs, rails, marquees).
Banned site-wide: bounce, elastic, spring, back-ease (except the two baked
scrub keyframes in §3 which are geometry, not UI feel), letter-stagger,
scroll-hijack, unpausable carousels, gradient/blob "cinema", glassmorphism,
particles (brief §7 + E anti-patterns).

| Element | Spec |
|---|---|
| Section entrances | Label → heading (line-mask 0.9 s) → media (clip 1.1 s) → cards (`y 36→0, 0.8 s, stagger 0.08 s`) at `top 80–84%`, `once:true`. One idea per viewport (E-11 chapter rule). |
| Image clip reveals | §6.2. `ScrollTrigger.refresh()` after each image load. |
| Hover system | Nav links: underline `scaleX 0→1` 350 ms `expo.out` (CSS). Buttons: text-roll + bg wipe 400 ms. Cards (sponsor/brand): `scale 1→1.03` max + streak micro-replay 250 ms (never layout props). Image zoom `1→1.06`, 0.7 s `power3.out`. Arrow nudge `x 0→6` + duplicate fade. Card tilt ≤4° (desktop, fine-pointer only). |
| Preloader | Counter 0→100 (≤1200 ms) + `clip-path` curtain lift `yPercent 0→−100` 800 ms `expo.inOut` at 1200 ms; hero readable ≤1.8 s (playbook gate). Chain: veil → headline lines (+150 ms) → glasses glint (+450 ms) → CTA (+700 ms). Mute-by-default if any film; pause/mute controls mandatory (ic! berlin pattern, E-06). Zero popups in first three viewports (E P0). |
| Page/route transitions | Native View Transitions (`document.startViewTransition`), shared `hero-glasses`, 450 ms `expo.inOut` fade + scale 0.98→1. Rails persist through white-act transitions. Kill/revert ScrollTriggers per route (`gsap.context()` + `revert()`, React `useGSAP`). |
| Section handoffs | Dark→dark: continuous dolly, no wipe; light-leak `opacity 0→0.8→0` 300 ms at label edges only. Dark→white: §5. White rest: sections overlap `margin-top:-10vh`, entrances at `top 80%`. |
| Cursor | Informative-only follower (`mix-blend-difference`, `quickTo` 0.35 s `power3.out`, scale 1.75 on labelled targets); hidden on touch + reduced-motion. Never required for comprehension. |
| Copy honesty | Sponsor/brand/review marks render only research-verified identities (E P0 fake-proof gate). Reviews show initials + text exactly as B §7 (no invented names/stars/dates). `4.9` `(208 reviews)` + `Real reviews from real customers` verbatim. |

---

## 8. Reduced-motion + low-power fallbacks; performance rules

### 8.1 Reduced motion (`prefers-reduced-motion: reduce`) — first-class branch, not a post-pass
- JS early-return: NO Lenis, NO scrub smoothing (`rig.smooth = rig.target` snap to
  nearest composed chapter endpoint), NO pin-driven camera flights.
- Film becomes ordered static chapters (poster stills + full DOM copy, same reading
  order — the B content must read fully without WebGL).
- Flap/arms/idle/streaks/chroma/FOV kicks OFF (final poses shown); marquees → static
  grids; bloom/flash OFF (handoff hard-cut at reduced brightness); ambient loops stopped.
- Reveals collapse to `opacity 0→1` 200 ms linear only. Every beat keyboard-reachable;
  skip-link to white/practical + footer; no scroll trap; footer reachable.
- CSS `@media (prefers-reduced-motion: reduce)` mirrors the JS branch. Test with
  emulation AND real OS setting (F §4.13 gate).

### 8.2 Low-power / small-screen tiers
- Mobile (≤768 px): DPR ≤1.5 (cap 1.25 ideal), NO bloom/DOF/chroma (opacity
  crossfades only), 50 k-tri LOD, static 1–2 K HDRI, logo atlases, rails 44 px/s.
- Desktop: DPR ≤2 (cap 1.5 ideal), Bloom+Vignette gated to B6–B9 only, ≤120 k tris,
  ≤4 MB critical 3D transfer, 60–90 draw calls, ≤2 shadow lights (F §4.12).
- Quality governor: lowers DPR → disables post → simplifies materials, BEFORE ever
  deleting landmarks. `document.hidden` pauses RAF; offscreen canvas cancels RAF
  (`offscreenRunningCount:0` proven in browser profile, not screenshots).
- WebGL/model/texture failure: per-chapter `onError` → poster + ordered stills +
  full DOM (same information, §8.1). Console-clean required.

### 8.3 Performance rules for motion (GPU-only discipline)
- Animate ONLY `transform`, `opacity`, short-lived `clip-path`, and streak-only
  `filter:blur`. NEVER width/height/top/left/margin during scroll (layout thrash).
- `will-change:transform` on pinned children DURING pin only; clear on leave.
  `will-change` on rails tracks only.
- One ticker (GSAP) owns time; R3F `useFrame` reads the ref (never `setState`
  per frame). Exactly one `gsap.ticker.add(lenis.raf)` — audit for duplicates;
  React 19 StrictMode double-mount guarded by ref + cleanup (`lenis.destroy()`).
- Cap `dt` at 1/30 after stalls; `maath/damp3` or `THREE.MathUtils.damp` λ=5.2.
- No more than 2 concurrent blur layers; halve pixelRatio ≤1.5 on mobile before
  touching choreography. Textures KTX2/Basis, sRGB ONLY on colour; Draco-or-meshopt
  (not stacked blindly); logo-relief mesh position quantisation ≥14-bit.
- Verification (brief §8: Playwright, never "it compiles"): every camera endpoint
  at 1440×900 / 768×1024 / 390×844; slow/fast/reverse/drag/anchor/reload-at-depth/
  resize-mid-beat; `vf capture/compare` on scroll fractions; frame-time/draw-call/
  tri/texture-memory numbers recorded. `gsap_validate_gsap_code` before capture
  (playbook). Maker/judge split per `iterate-until-verified` where practical.

---

## Handoff notes (for the coordinator + ARCHITECTURE/ART-DIRECTION/SITE lanes)
1. This plan assumes F's stack + Lenis/GSAP wiring; if ARCHITECTURE changes the
   conductor, §§1–2 timings survive (they are progress-relative) but ticker code does not.
2. Camera/lighting numbers assume the Phase-3 pivots (flap hinge Empty, G hinge
   pivots re-measured post-scale), thin aero case, velvet sheen stack, and studio
   HDRI — if any asset differs, retune §§2–3 against renders, never against memory.
3. Copy slots marked `[COPY NEEDED]` (dark-beat chapter titles, portal→H1 bridge
   if any) belong to SITE/IA + client sign-off; MOTION reserves timing, not words.
4. Booking CTA destination: `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1`
   (brief §6c.3; Burlington-era code — client to confirm Brampton code per F §7).

PHASE4-PLAN-MOTION-DONE
Summary:
1. 1000 vh desktop / 700 vh mobile intro (dark 80% + white 20%) with p-mapped beats matching brief weights 10/15/15/15/15/15/7/5/3.
2. Damped-segment camera path with authored keyframes/FOV/fog per beat; mobile pullback ×1.45, portal rail along lens normal.
3. Light-driven object animation: 40° elastic flap, staggered L/R unfold with overshoot, velocity-driven sponsor streaks (8+8, expo arrival), bloom-to-white portal handoff.
4. White act: 72/44 px/s opposing DOM rails with velocity coupling; single expo/power2/linear easing family; masked-line text vocabulary.
5. Reduced-motion static-chapter branch + GPU-only, single-ticker, budgeted perf rules with Playwright/vf verification gates.

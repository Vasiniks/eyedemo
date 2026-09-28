# F — 3D / Motion Technical Research
EyeQ Vision Care cinematic homepage — Phase 2, Letter F
Date: 2026-09-27. Research-only. No code scaffolded, no packages installed in project.

Brief source: `docs/00-BRIEF.md` (read fully).
Key constraints honoured: thin aerodynamic black case, physical emboss/deboss logo (never decal/floating/glow), one-piece elastic flap, dark-red velvet, dark folded→unfolding glasses, dark cinematic ~80% / white ~20%, no template/Apple-clone/WebGL-demo/particles/gradient tropes. Empty project folder — stack must be recommended. Blender previews EEVEE-low; final Cycles bake on another machine — keep scenes Cycles-portable. Glasses source model: `/Users/admin/Downloads/Glasses_Mama_WBL/` (agent G inspects; not duplicated here).

---

## 1. Installed skills — what each gives us, when to use it

All 14 skills below were actually loaded via the `skill` tool on 2026-09-27. Summaries are from observed skill content, not memory.

| # | Skill (base dir) | What it gives us | Use when (EyeQ mapping) |
|---|---|---|---|
| 1 | `threejs-scenes` (`/Users/admin/.config/opencode/skills/threejs-scenes`) | Vanilla three.js WebGL2 production system: core principles, fundamentals, instancing vs BatchedMesh, textures/maps, custom ShaderMaterial, lighting/IBL, performance, programmatic generation, post-processing chain (`RenderPass → UnrealBloom → grade → OutputPass`, grade in linear HDR, tone-map once), camera handling, animation-system (AnimationMixer/clips), production-lessons (disposal, draw-call budgets, determinism), embed patterns for artifacts, `scripts/query-threejs-docs.js` live-docs lookup against `https://threejs.org/docs/llms.txt`. Style: no semis, pointer events only, DPR cap 2, annotate draw-call/memory class. | Vanilla-three fallback knowledge, shader/post chain reference, perf rules. Prefer R3F for the real build (React integration); use this skill's `post-processing.md`, `performance.md`, `materials.md`, `lighting.md` as checklists. |
| 2 | `blender-hard-surface-modeling` (`/Users/admin/.config/opencode/skills/blender-hard-surface-modeling`) | Hard-surface workflow: large→medium→small forms, quad-dominant clean topology, subdivision + support loops + bevel modifier + weighted normals, non-destructive Mirror/Bevel/Subdiv/Solidify stack, edge-highlight realism, final validation (topology, shading, silhouette). Explicitly NOT organic sculpting/cloth/terrain. | THE case-modeling workflow: thin sculpted shell blockout → clean edge flow → bevel for edge highlights → validate subdivision. Applies to case + emboss logo. |
| 3 | `build-threejs-scroll-worlds` (`/Users/admin/.agents/skills/build-threejs-scroll-worlds`) | One persistent world + one normalized reversible scroll state. World bible → scene ledger (4–8 chapters, camera endpoints + mobile overrides + fog/light/asset deps per chapter), scroll-conductor (`rig.target` exact vs `rig.smooth` damped render state), Catmull-Rom vs segment camera paths, continuous vs connected-sets vs layered-reveal topology, progressive loading (first frame complete, prefetch 1–2 ahead), budgets (mobile 150–300k tris / 50–90 calls / DPR 1.25–1.5; desktop 500k–1.2M / 90–160 / DPR 1.5–2), reduced-motion snapping, full journey QA matrix. Includes portable `references/scroll-conductor.js`. | Master pattern for the EyeQ film: single R3F Canvas alive through all dark chapters; GSAP ScrollTrigger progress drives `target`, damped in `useFrame` for `smooth`. Chapter ledger = brief pacing (case 10 / open 15 / emerge 15 / unfold 15 / info+camera 15 / wave1 15 / wave2 7 / approach 5 / entry 3). |
| 4 | `webgl-3d-object` (`/Users/admin/.agents/skills/webgl-3d-object`) | Single hero-object recipe: perspective camera, `MeshStandard/PhysicalMaterial` with tuned metalness/roughness/emissive, key+ambient/hemisphere+rim lighting, shadow plane, subtle rotation/bob/parallax only, resize + full dispose teardown, DPR cap 1.75, reduced-motion still frame. Avoid: CSS-3D fakery, unlit materials, bloom hiding form. | Isolated product moments (e.g. post-white static glasses turntable) and lighting/material starter values (premium metal 0.45–0.7 / 0.25–0.45). NOT the film driver — film uses skill 3 + GSAP. |
| 5 | `cinematic-gsap-lenis-motion-system` (`/Users/admin/.agents/skills/cinematic-gsap-lenis-motion-system`) | Full DOM motion language: `npm i gsap lenis`, Lenis→GSAP-ticker wiring (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t=>lenis.raf(t*1000))`, `lagSmoothing(0)`), tokens (eases power3/4.out, expo.out; scrub 0.8–1.4; reveals 0.75–1.1s; stagger words 0.035–0.07 / lines 0.08–0.14; trigger `top 82%`; `anticipatePin:1`), masked text/image-clip/parallax/pinned-horizontal/story-scene/magnetic/quickTo-cursor/mouse-parallax modules, init order, QA (JS-off visible, reduced-motion static, no layout-prop animation, `ScrollTrigger.refresh()` after fonts/images, `gsap.context()` + `revert()` in React). | THE DOM side of EyeQ: white/practical section reveals, masked headlines, image-clip reveals, vertical logo rails (marquee variant), hover system, cursor (only if informative). Single Lenis+ScrollTrigger engine shared with 3D. |
| 6 | `gsap-scrolltrigger-storytelling` (`/Users/admin/.agents/skills/gsap-scrolltrigger-storytelling`) | Sticky product-story pattern: one scrubbed master timeline, `pin:true` long sections with labelled scenes, transform/opacity only, `gsap.context()` cleanup, `matchMedia` mobile simplification, layer-reveal + section-handoff (scale/mask/blur/translate) + pointer smoothing. Avoid: unrelated per-tick anims, overlong pins, layout props, orphaned triggers. | Direct template for film choreography: one master GSAP timeline (labels per beat) with ScrollTrigger `scrub`, pinned dark-film container; drives both DOM and (via progress ref) the R3F camera. |
| 7 | `scroll-world-storytelling` (`/Users/admin/.agents/skills/scroll-world-storytelling`) | Three-mode router: video-scrub vs Three.js-world vs HTML/data/type. Contract: 5–7 beats, beat ledger (id/scene/eyebrow/headline/body/evidence/motion/scroll-weight), style bible, native reversible scroll, reduced-motion ordinary flow, verify forward/backward/flick/mobile/a11y/console. Mode costs: video = photographic finish + heavy seek tuning; three.js = realtime depth + WebGL perf/fallback work; HTML = accessible/lightweight. | Decision framework: EyeQ = Three.js-world primary (spatial case/glasses/camera) + HTML mode for white/practical tail. Explicitly rejects mixing modes by default — keep one renderer, let DOM carry meaning. |
| 8 | `design-motion-principles` (`/Users/admin/.agents/skills/design-motion-principles`) | Create vs Audit modes, Emil/Jakub/Jhey weighting by project type, frequency gate (rare→expressive, daily→subtle, 100s/day→none, keyboard→never), duration by context, golden rule (best animation goes unnoticed), mandatory `prefers-reduced-motion`, motion cookbook + gotchas + audit checklist. Marketing/landing → primary Jakub, secondary Jhey, selective Emil. | Taste gate for EyeQ (marketing/landing): restrained cinematic, word-not-letter stagger, no bounce/elastic, reduced-motion mandatory. Use in Phase 4 reviews. |
| 9 | `optimize-web-animations` (`/Users/admin/.agents/skills/optimize-web-animations`) | Measure-first perf loop: baseline in real browser (top/mid/footer/mobile), count running CSS anims + canvases separately, patch smallest owner (`is-offscreen` + IntersectionObserver → `animation-play-state:paused`; RAF gating for canvas/WebGL: cancel offscreen, resume on entry, disconnect on cleanup), verify `offscreenRunningCount:0`, gates `git diff --check / lint / build`, narrow commits, evidence-led report. Leak hardening: clear timers, cancel RAF, dispose three resources, kill GSAP tweens, `isDisposed` loader guards, cap physics dt after pauses. | THE perf/QA loop for Phase 4: gate R3F RAF offscreen, pause marquees/post offscreen, dispose on unmount, prove with browser profiles — never screenshots alone. |
| 10 | `marquee-loop` (`/Users/admin/.agents/skills/marquee-loop`) | Seamless infinite loop: duplicate sequence, linear `0→-50%` transform, stable item widths, edge masks/fades, hover-pause only when useful, reduced-motion static/slow. Guardrails: no critical reading content, no heavy shadows/filters per item. | THE vertical opposing logo rails: two CSS/GSAP marquees (one reversed), alpha-textured logo planes as DOM (not WebGL), edge mask fades, `prefers-reduced-motion` freeze. |
| 11 | `masked-reveal` (`/Users/admin/.agents/skills/masked-reveal`) | Premium word-mask headline reveal without paid SplitText: `word-mask` overflow-hidden + `word` yPercent 110→0, 0.7–0.9s, stagger 0.025–0.045, trigger `top 82%`, once; `aria-label` full text, spaces preserved, reduced-motion static, React `gsap.context` cleanup, `ScrollTrigger.refresh()` after layout shifts. | Headline reveals in white/practical + subtle dark-film captions. Short text only; never links/buttons inside split. |
| 12 | `awwwards-playbook` (`/Users/admin/.agents/skills/awwwards-playbook`) | Award bar as engineering gates: jury weights (design 40/usability 30/creativity 20/content 10), definition-of-done table (intro ≤1.8s, ≥1 pinned/scrubbed sequence, authored entrance per section, hover per interactive, real assets only — 0 CSS/SVG illustration, ACES/AgX + HDRI on all 3D, DPR≤2, LCP<2.5s CLS<0.05 JS<~350KB gz/route, reduced-motion final states), recipes R1–R8 (Lenis+GSAP single ticker, preloader→hero, split-line, clip-path, pinned horizontal, image sequence, R3F hero with `Environment`+`MeshTransmissionMaterial`+`Float`, hover/magnetic), `gsap_validate_gsap_code` before capture. Pinned versions: gsap 3.15, @gsap/react 2.1, lenis 1.3, three 0.186, R3F 9.8, drei 10.7. | Acceptance bar + copy-paste recipes for EyeQ build; R7 is the lens/transmission starter, R1 the Lenis wiring. Use `vf teardown/feel` gates in Phase 4. |
| 13 | `visual-fidelity` (`/Users/admin/.agents/skills/visual-fidelity`) | `VF=~/.agents/skills/visual-fidelity/scripts/vf` (GPU Chromium, SwiftShader fallback): `capture` (viewports + scroll fractions + layout JSON), `compare` (pixel %, hotspot cells, element deltas, omissions/extras, side-by-side/diff), `teardown` (intro frames, scroll contact sheets, motion map with fitted eases, stack detect, live three.js scene via devtools hook incl. tone mapping/lights/materials/meshes/fog/env, every compiled GLSL in `shaders/custom-*`, hover diffs, transitions, real assets with source URLs), `feel` (mechanism parity %). Protocol: same conditions, production build, look at images, scroll-fraction captures for pinned pages, `track` regression guard. | Visual QA harness for Phase 4 (brief §8 mandates Playwright screenshots, never "it compiles"). Teardown reference sites only if needed; always teardown own build before done. |
| 14 | `iterate-until-verified` (`/Users/admin/.agents/skills/iterate-until-verified`) | Execute vs Compose modes, task-contract lock, ambition→observable gates matrix, decompose with single integrator, separate maker/judge (verifier gets task+rubic+candidate, blind where practical), proof matched to work (code→tests/builds; visual→renders at sizes + interaction + a11y + side-by-side; research→primary sources + contradiction search), loop to green, stop honestly on blocker. | Process wrapper for Phase 3/4: gate every effect (renders at 1440/768/390, reverse-scroll, reduced-motion, console-clean, perf numbers) before calling done. |

Skill not in the requested list but loaded opportunistically: `scroll-craft` — interviewed as possible alternative; REJECTED for EyeQ because its hard rules (photographic world, ≥4 device families, no continuous chain by default, grammar/fingerprint system) fight the brief's single continuous dark film. Noted here so Phase 4 does not adopt it accidentally.

---

## 2. Current docs (Context7, queried 2026-09-27)

All queries below were actually executed; code/props quoted from Context7 returns. URLs are the exact sources Context7 cited.

### 2a. three.js — MeshPhysicalMaterial sheen + transmission
Library ID used: `/mrdoob/three.js` (selected over `/websites/threejs`, `/llmstxt/threejs_llms-full_txt` — highest snippet count 23525 + High reputation + benchmark 84.59).

- Transmission example — https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_physical_transmission.html — canonical glass setup: `new THREE.MeshPhysicalMaterial({ transmission, roughness, ior, thickness, specularIntensity, specularColor, envMap, envMapIntensity, side: DoubleSide, transparent: true })` + `renderer.toneMapping = ACESFilmicToneMapping` + HDR equirect env (`UltraHDRLoader`, `EquirectangularReflectionMapping`) + `renderer.transmissionResolutionScale` control. Takeaway: lenses want `transmission:1, roughness:~0–0.15, ior:1.5, thickness:0.01–0.05, specularIntensity:1`, an HDR/studio env (else glass reads black), ACES tone mapping. Observed, not invented.
- Attenuation variant — https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_physical_transmission_alpha.html — same plus `attenuationColor/attenuationDistance`, GLTF-loaded physical materials editable live. Relevant if lenses need slight tint.
- Sheen controls — https://github.com/mrdoob/three.js/blob/dev/utils/docs/template/static/scenes/material-browser.html — `sheen 0–1`, `sheenRoughness 0–1`, `sheenColor` (color picker). TSL guide — https://github.com/mrdoob/three.js/blob/dev/tsl/content/Guide.md — `materialSheen = sheen * sheenColor * sheenColorMap`, `materialSheenRoughness`, `materialTransmission = transmission * transmissionMap.r`, `materialThickness`, `materialIOR`, `materialDispersion`. Takeaway: velvet = `sheen:1.0, sheenRoughness:~0.4–0.6, sheenColor:dark-red` on top of near-black rough base; three.js sheen is a real PBR fuzz lobe, not a hack.
- GLTFExporter support — https://github.com/mrdoob/three.js/blob/dev/docs/pages/GLTFExporter.html — supports `KHR_materials_sheen`, `KHR_materials_transmission`, `KHR_materials_ior`, `KHR_materials_volume`, `KHR_materials_specular`, `KHR_materials_clearcoat`, `KHR_mesh_quantization`, `EXT_mesh_gpu_instancing`, `EXT_texture_webp`. So Blender sheen/transmission/ior survive a correct glTF export path. Observed list, quoted verbatim.

### 2b. @react-three/fiber — frameloop, useFrame, ScrollControls vs GSAP
Library ID used: `/pmndrs/react-three-fiber` (550 snippets, High, 83.34).

- On-demand rendering — https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx — `<Canvas frameloop="demand">` renders only on prop change; idle scene = idle GPU. EyeQ film is scroll-driven, NOT constantly moving → start `frameloop="always"` during film dev, switch toward demand+gated invalidate or manual RAF gating per skill 9 for production. Observed.
- External ticker driving — https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/loop.ts (`update(timestamp, state)`; `frameloop==='never'` + numeric timestamp → clock derived from external ticker, e.g. GSAP). Proves GSAP-ticker-driven R3F is a supported pattern, not a hack.
- `invalidate()` one-shot scheduling — same `loop.ts` source — demand-mode render scheduling semantics. Use with scroll-progress invalidations if demand mode adopted.

### 2c. @react-three/drei — useGLTF, useAnimations, Environment, MeshTransmissionMaterial, ScrollControls
Library ID used: `/pmndrs/drei` (717 snippets, High, 85.98).

- `useGLTF(path, useDraco=true, useMeshOpt=true, extendLoader)` — https://github.com/pmndrs/drei/blob/master/docs/loaders/gltf-use-gltf.mdx — Draco defaults to CDN `https://www.gstatic.com/draco/v1/decoders/`; `setDecoderPath` for self-host; `extendLoader` for KTX2. EyeQ: self-host decoders + KTX2 via `extendLoader` (static hosting, no CDN dependency at runtime).
- `useAnimations(animations)` → `{ ref, mixer, names, actions, clips }`, `actions.jump.play()` — https://github.com/pmndrs/drei/blob/master/docs/abstractions/use-animations.mdx — pattern for any baked Blender clips (flap shape-keys as morphs or armature actions). EyeQ decision (see §4): prefer runtime hinge rotation, so this is fallback only.
- `Environment frames={Infinity} resolution={256}` animated env — https://github.com/pmndrs/drei/blob/master/docs/staging/environment.mdx — cheap dynamic reflections; EyeQ: static small studio HDRI (1–2k) preferred over animated env for perf.
- `MeshTransmissionMaterial` props — https://github.com/pmndrs/drei/blob/master/docs/shaders/mesh-transmission-material.mdx — `transmission, thickness, backsideThickness, roughness, chromaticAberration (default 0.03), anisotropicBlur (0.1), distortion/distortionScale (0/0.5), temporalDistortion, transmissionSampler, backside, resolution/backsideResolution (fullscreen default), samples (6), background`. EyeQ lens-portal: EITHER native `MeshPhysicalMaterial` transmission (cheaper, glTF-faithful) OR `MeshTransmissionMaterial` (prettier distortion/CA, costlier, needs `resolution` tuning + `backside` only if required). Observed defaults quoted.
- `ScrollControls` (`pages, damping 0.2, distance, eps, horizontal, infinite, maxSpeed`) + `<Scroll>` / `<Scroll html>` + `useScroll` — https://github.com/pmndrs/drei/blob/master/docs/controls/scroll-controls.mdx — creates its OWN scroll container in front of canvas. CONFLICT WARNING (verified by reading the API): EyeQ uses native document scroll + Lenis + GSAP ScrollTrigger as the single conductor (skills 3/5/6). Do NOT nest drei `ScrollControls` inside a Lenis page — two scroll owners = fighting conductors. Use GSAP progress → ref → `useFrame` camera instead. `ScrollControls` rejected for EyeQ, recorded here so Phase 4 does not adopt it.

### 2d. @react-three/postprocessing — Bloom, DOF, motion blur
Library IDs used: `/pmndrs/react-postprocessing` (566 snippets, 88.51) + `/websites/pmndrs_github_io_postprocessing_public` (resolver result).

- `<EffectComposer depthBuffer><Bloom …/><Vignette …/></EffectComposer>` — https://github.com/pmndrs/react-postprocessing/blob/master/_autodocs/INDEX.md and https://github.com/pmndrs/react-postprocessing/blob/master/_autodocs/api-reference/effects.md — `Bloom` props observed: `luminanceThreshold (0–1), luminanceSmoothing, intensity, width/height (lower=faster), kernelSize, mipmapBlur, blendFunction, opacity`. `Vignette` — https://github.com/pmndrs/drei/blob/master/docs/staging/environment.mdx (cross-ref; canonical Vignette doc at https://github.com/pmndrs/react-postprocessing/blob/master/docs/effects/vignette.mdx): `offset 0.5, darkness 0.5, eskil, blendFunction`.
- Motion blur: NO dedicated motion-blur effect found in the returned `@react-three/postprocessing` API docs. Streak/speed lines for sponsor hyperspace must therefore be AUTHORED GEOMETRY/shader (stretched emissive streak instances, FOV kick, radial-blur overlay), not a post pass. Recorded as observed-absence; Phase 4 must not plan around a blur pass that was not verified. `DepthOfField` exists in the underlying `postprocessing` lib but was NOT returned with verified props in this pass → mark UNVERIFIED for exact prop names; prefer light DOF or none (perf + focus risk), verify props in Phase 4 from installed `postprocessing@6.39.5` types before use.
- Cost rule from skill 1 (threejs-scenes `post-processing.md`): grade in linear HDR, tone-map once; on mobile disable god-rays/DOF by default. Adopted as budget rule.

### 2e. GSAP ScrollTrigger (gsap MCP + Context7)
Context7 library ID: `/websites/gsap_v3` (2747 snippets, High, 81.34). GSAP MCP `gsap_get_gsap_guidance` also queried for "pin a section on scroll scrub cinematic camera timeline with Lenis smooth scroll" — returned official `gsap-timeline` + `gsap-scrolltrigger` skills verbatim (timeline position params, labels, nesting, ScrollTrigger config table, scrub/pin/markers, containerAnimation with mandatory `ease:"none"`, refresh/cleanup, plus a verified correction: higher `refreshPriority` refreshes first).

- Timeline-driven scroll — https://gsap.com/docs/v3/Plugins/ScrollTrigger — master pattern observed: `gsap.timeline({ scrollTrigger: { trigger:".container", pin:true, start:"top top", end:"+=500", scrub:1, snap:{snapTo:"labels",…}} })` + `tl.addLabel()` beats. Adopt: one master film timeline, labels per brief beat, `scrub:1 (≈0.8–1.4 cinematic)`, snap OFF for film (snap fights scrub reversibility; only snap discrete galleries, none planned).
- Scroll-jacking note — same source: ScrollTrigger does NOT hijack scroll; smooth-scroll via ScrollSmoother (Club plugin — NOT available; EyeQ uses Lenis instead). Recorded so nobody plans ScrollSmoother.
- Lenis+GSAP wiring — https://github.com/darkroomengineering/lenis/blob/main/README.md — canonical 4 lines observed: `new Lenis()`, `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t=>lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`. React variant — https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md — `ReactLenis root options={{autoRaf:false}}` + manual raf via `gsap.ticker`. Adopt the manual-ticker variant (one engine, one ticker).

### 2f. Lenis
Library ID: `/darkroomengineering/lenis` (96 snippets, High, 91.28). Same sources as above. Extra: Vue integration doc confirms `autoRaf:false` + manual ticker is the intended GSAP interop, not a workaround. `lenis/react` `ReactLenis` is the React binding; alternatively plain `lenis` + `useEffect` (fewer deps). Decision deferred to Phase 4 scaffold; both verified to support the same ticker pattern.

### 2g. npm versions (observed via `npm view` 2026-09-27)
| Package | Observed version |
|---|---|
| three | 0.186.1 |
| @react-three/fiber | 9.8.1 |
| @react-three/drei | 10.7.9 |
| @react-three/postprocessing | 3.1.3 |
| postprocessing (peer of above) | 6.39.5 |
| gsap | 3.15.0 |
| lenis | 1.3.26 |
| @gsap/react | 2.1.2 |
| zustand (R3F/DOM shared progress store, if needed) | 5.0.15 |
| maath (damping/easing helpers, optional) | 0.10.8 |
| draco3dgltf (decoder notes; prefer drei-bundled/CDN or self-host) | 1.5.7 |
| meshoptimizer | 1.3.0 |
| vite | 8.3.1 |
| react | 19.3.0 |
| three-mesh-bvh (raycast accel; likely unnecessary) | 0.9.15 |

These versions are COMPATIBLE as a set (matches awwwards-playbook pinned set: gsap 3.15 / lenis 1.3 / three 0.186 / R3F 9.8 / drei 10.7 — observed in skill content). Final pin in Phase 4 scaffold; do not float majors.

---

## 3. Blender MCP — read-only check

Called `get_addon_status` and `get_scene_info` ONLY (no scene modification), as instructed.

- Result (2026-09-27): BOTH calls failed with `Could not connect to Blender. Make sure the Blender addon is running.`
- Blender version: UNVERIFIED (could not be reached at research time).
- Scene contents: UNVERIFIED (same reason).
- Implication: Blender→web pipeline below is derived from docs + skills, NOT from a live scene inspection. Phase 3 MUST re-run these two calls once Blender is open and record the real version before modelling. No Blender state was touched from here.

---

## 4. Per-effect recommendations

Convention per effect: Recommended → Alternatives → Risks. "Survives glTF" claims cite §2a exporter list; anything else is marked UNVERIFIED or judgement.

### 4.1 Aerodynamic thin case (Blender curve/subd/boolean workflow)
- Recommended: skill 2 workflow. Blockout elongated shell from subdivided cube/plane + curves-as-profile (side silhouette first — brief demands sculpted, not boxy), Solidify for uniform thin wall, Mirror for symmetry, Bevel modifier (2–3 segments, ~1–3mm equivalent) for edge highlights, Subdivision Surface L2 preview / L1–L2 baked on export, Weighted Normals. Panel split line for flap modelled as real gap (0.5–1mm) + inner lip, not texture. Keep quads, pole-free curvature zones.
- Alternatives: pure NURBS→mesh convert (cleaner long curves, worse subd control); sculpt-then-retopo (organic dents easy, edge precision hard — reject for aerospace shell).
- Risks: over-dense subd (export tris explode — decimate to budget §4.11 before export); boxy default (art-direct silhouette against brief §6: "not a box, not a bulky hinge"); thin-wall see-through at grazing angles (Solidify + DoubleSide discipline; verify in EEVEE preview).

### 4.2 Physical emboss/deboss logo (raster→vector→extruded boolean vs displacement+normal bake; glTF survival)
- Recommended: TRUE GEOMETRY boolean. Official EyeQ logo (agent B/C source, from https://eyeqoptical.ca/) → vector trace (manual redraw in Illustrator/Inkscape against the official artwork; NEVER auto-trace-and-ship without visual sign-off, never redraw as new logo) → import SVG curve → extrude 0.3–0.6mm → Boolean DIFFERENCE (deboss) or UNION proud 0.2–0.4mm (emboss) into case top + "EyeQ Vision Care" companion text as second curve object. Apply boolean, clean n-gons → quads, re-bevel lip micro-edge (0.1mm) so light catches it. glTF survival: VERIFIED — real mesh survives any exporter; exporter extension list (§2a, https://github.com/mrdoob/three.js/blob/dev/docs/pages/GLTFExporter.html) is irrelevant because no material trick is involved.
- Alternatives: displacement + normal bake (cheaper tris, reads well at distance) — REJECTED as primary: displacement needs high subdiv at runtime or baked normal only (normal-only reads as decal under raking light, violates "physically embossed, not decal"); use ONLY as LOD2/mobile fallback mesh (UNVERIFIED bake quality until Phase 3 tests).
- Risks: font/vector rights (use official artwork only); boolean shading artefacts (shade-smooth + weighted normals + EEVEE raking-light check); micro-geometry lost under Draco quantization (set quantization ≥14-bit position or exclude logo mesh from aggressive compression — verify in Phase 3); "floating text" look if depth wrong (keep relief shallow, lighting does the work).

### 4.3 One-piece flap opening (baked shape-key/armature vs runtime hinge rotation with slight bend)
- Recommended: RUNTIME rotation about an authored hinge line + procedural micro-bend. Model flap closed; define hinge axis object (Empty) along the long spine edge; in R3F, flap mesh (or flap bone group) rotates open driven by master-timeline progress with `expo.out`-ish easing + tiny overshoot/damping (brief: "smooth, slightly elastic, not a 90° box lid" — target ~35–55° sweep, tuned visually). Bend faked by 2-segment flap rig (root 90% rotation, tip 10% lagged flex via damped follow) or a 2-bone armature with rotation-only keys evaluated at runtime. No shape-key export needed; no clip timing to fight scrub reversibility.
- Alternatives: baked shape-key (Basis→Open) or armature action clip via `useAnimations` (https://github.com/pmndrs/drei/blob/master/docs/abstractions/use-animations.mdx) — scrub `mixer`/`action.time` from timeline progress. Viable but heavier pipeline (clip authoring + testing reverse fidelity) and fights the "elastic" procedural damping. Keep as fallback if art direction demands non-rigid deformation beyond 2-segment fake.
- Risks: rigid-hinge look (mitigate with tip-lag + motion-choreographed camera so hinge is rarely the focal plane); pivot misplacement (author Empty ON the spine, export with applied transforms, verify pivot in Phase 3 glTF round-trip); scrub-reversal pops (all flap state must be pure function of timeline progress — no velocity state except damped render smoothing).

### 4.4 Velvet (Blender sheen + fibre detail; three.js sheen params; baked textures)
- Recommended: MeshPhysicalMaterial sheen stack BAKED in Blender, EVALUATED in three.js. Blender Principled (Cycles-portable): base color deep dark red (~#4A0A0E–#6B1015 range, tune visually), roughness ~0.85–1.0, `Sheen:1.0, Sheen Tint ~0.5, Sheen Color dark red`, plus subtle procedural fibre normal (fine noise, 0.02–0.05 strength) + fold geometry (real modelled soft folds, not bump-only) + baked AO in crevices. Export `KHR_materials_sheen` (verified supported §2a). three.js evaluation: `sheen:1.0, sheenRoughness:0.45–0.6, sheenColor:new Color(dark red)` (ranges from https://github.com/mrdoob/three.js/blob/dev/utils/docs/template/static/scenes/material-browser.html), roughness ~0.9, NO metalness. Add 1k–2k baked diffuse/AO/normal set (KTX2, sRGB ONLY on color) so pile reads at all angles. Light with soft key + dim warm rim; velvet dies under flat light.
- Alternatives: full groom/fibre cards (overkill, overdraw + export weight — reject); plain diffuse red (reads as plastic — reject).
- Risks: sheen invisible without env/rim (ship the studio HDRI); KTX2 compressor washing deep reds (verify swatch renders); EEVEE sheen preview ≠ Cycles (brief mandates EEVEE-now/Cycles-later — author conservatively, re-bake check in Phase 3 Cycles pass).

### 4.5 Folded glasses + unfolding (hinge pivots, rig in Blender vs runtime pivot groups)
- Recommended: RUNTIME pivot groups (same philosophy as flap). Source model `Glasses_Mama_WBL` inspected by agent G — DO NOT re-model here. Pipeline: in Blender, separate temples + front into named empties AT hinge axes (left/right temple pivots + optional nose-bridge staging pivot), apply transforms, export hierarchy. In R3F, nested `<group>` pivots rotate open (temple ~90° fold→open) with staggered timing + `power3.out` damping + hover float after. All angles = f(p)/timeline progress.
- Alternatives: baked Blender rig/action (`useAnimations`) — fallback if hinge deformation (spring, cam) must be non-rigid; costs clip/scrub testing.
- Risks: pivot-axis errors (single most common glasses failure — verify axis gizmos in Blender BEFORE export); interpenetration during unfold (choreograph emergence height + temple stagger so arms clear the case lip); source-model scale/units (normalize in Blender, meters, verify bounding box on import — agent G provides dims).

### 4.6 Cinematic scroll camera (GSAP timeline scrubbed by ScrollTrigger with Lenis; single master timeline)
- Recommended: ONE master `gsap.timeline({ scrollTrigger:{ trigger:"#film", start:"top top", end:"+=" + totalScroll, scrub:1, pin:true, anticipatePin:1 } })` with `addLabel()` per brief beat (labels: case/open/velvet/emerge/unfold/info/wave1/wave2/approach/entry). Camera state (position/target/fov/fog/key/practicals) interpolated per-frame in R3F `useFrame` from `timeline.progress()` (stored in a ref — NEVER setState per frame) with `maath/damp3` or manual `THREE.MathUtils.damp` toward target (skill 3 `rig.target`/`rig.smooth` split). Eases inside timeline segments: `expo.out`/`power4.out` for arrivals, `none` ONLY for true constant-velocity dolly segments. All world state (flap angle, glasses unfold, velvet light ramp, sponsor z, bloom ramp) reads the SAME progress value — one conductor, no competing tickers. Wiring per https://github.com/darkroomengineering/lenis/blob/main/README.md (4 lines) + https://gsap.com/docs/v3/Plugins/ScrollTrigger timeline pattern.
- Alternatives: drei `ScrollControls` — REJECTED (§2c: owns its own scroll container, fights Lenis); raw scroll-listener camera — REJECTED (no scrub smoothing, no pin semantics, reinvents ScrollTrigger).
- Risks: pin-spacing layout jumps (author pin container heights first, `ScrollTrigger.refresh()` after fonts/models load); scrub lag feeling drunk (keep `scrub:0.8–1.2`, `lagSmoothing(0)`); camera wall-clipping (pre-viz path curve, clamp near plane, test reverse + scrollbar-drag + reload-at-depth per skill 3 QA).

### 4.7 Sponsor depth arrival (camera-relative z-travel from far plane, exponential easing, streak/motion-blur, textured alpha planes, accumulation layout)
- Recommended: instanced textured planes + authored streaks, NO post motion-blur pass (none verified §2d). Each sponsor logo = plane with alpha-mapped official artwork (agents B/C supply files/rights; keep UNLINKED if currently unlinked per brief §3), `transparent:true, alphaTest:0.35–0.5` (avoids sort soup), depthWrite ON where possible. Spawn at far z (beyond fog, ~-60 to -120 units, tuned), travel toward camera-relative slots on exponential-ish ease (`expo.in` approach blended to `expo.out` settle over the wave's timeline slice), scale-compensated so arrival size is uniform. Speed feel from: (a) elongated additive streak instances trailing each logo (stretched boxes/planes, 2–4 per logo, fade by velocity), (b) FOV kick 38→46 during wave + ease back, (c) radial-gradient vignette pulse via post `Vignette` intensity (verified prop), (d) fog-density dip so far plane "opens". Wave 1 (sponsors) accumulates into an arc/grid gallery that PERSISTS as camera drifts past (brief: "accumulates"); Wave 2 (EyeQ content group) shorter (7 vs 15) — same system, fewer items, tighter slots. Layout: precomputed slot array (arc radius/angle/count from agent B content count — UNVERIFIED count here), positions pure functions of wave progress.
- Alternatives: per-logo 3D extrusions (heavy, unnecessary — logos are print artifacts, planes are honest); real motion-blur pass (UNVERIFIED availability — do not plan on it); particles (brief bans floating random objects — reject).
- Risks: trademark/logo misuse (use ONLY official files, exact colors, no重排; agent C clears links); alpha-sort shimmer (alphaTest + depthWrite discipline + max ~12–20 visible planes/wave); overdraw on mobile (cap plane size, share 1–2 atlas textures per wave if counts allow); "Star Wars clone" read (brief demands original hyperspace-feel — differentiate via color script: warm white streaks on near-black + fog + FOV, no blue starfield, no crawl text).

### 4.8 Lens portal (camera through lens mesh; transmission/refraction shader, fisheye/chromatic distortion pass, white bloom)
- Recommended (two-stage): (1) APPROACH — lens uses native `MeshPhysicalMaterial` (`transmission:1, roughness:0.05–0.12, ior:1.52, thickness:0.02, specularIntensity:1`, per https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_physical_transmission.html) with studio env; camera dollies to lens center along normal. (2) PASS — at threshold distance, crossfade: lens transmission → fullscreen white via timeline-controlled `Bloom` intensity ramp (verified props §2d) + exposure ramp + optional `MeshTransmissionMaterial` distortion pulse ONLY if perf allows (props verified §2c: `distortion/distortionScale/chromaticAberration`), then camera near-plane crosses lens plane while a white overlay div opacity 0→1 covers the cut. Fisheye/chromatic: prefer camera FOV narrow kick + `chromaticAberration:0.03–0.08` on the transmission material over a fullscreen CA pass (cheaper, verified prop). The "portal" is thus 80% choreography (camera path + bloom + white overlay), 20% shader.
- Alternatives: custom GLSL refraction portal (full control, full risk — shader compile/perf/fallback burden; keep as Phase-4-stretch only); video crossfade (breaks realtime continuity — reject).
- Risks: transmission without env = black lens (ship HDRI); near-plane clip pop (animate `camera.near` or overlay timing to hide crossing, test at 390px width where FOV differs); perf cliff of double-transmission (lens + transmission material + bloom — gate behind desktop tier, mobile gets simplified opacity crossfade); white flash accessibility (respect reduced-motion: cut, don't flash).

### 4.9 White transition
- Recommended: DOM overlay (white div) opacity driven by the SAME master timeline end-labels, 300–600ms equivalent scroll distance, `expo.out`. Hands off from WebGL (canvas stays mounted but RAF-gated offscreen per skill 9) to DOM white/practical section. Clean, reversible, testable.
- Alternatives: in-shader whiteout (ties transition to GPU state — harder to make accessible/reversible; reject).
- Risks: flash discomfort (no instant 0→100%; ramp; reduced-motion = hard cut at low brightness); pin-release jank at handoff (tune `end` + `anticipatePin`, refresh after practical images load).

### 4.10 Vertical opposing logo rails (CSS/GSAP marquee with masks)
- Recommended: skill 10 + skill 5. Two vertical tracks (one `translateY` up-loop, one down-loop via `direction:reverse` or negative xPercent equivalent), each: duplicated logo list (official files only), linear `0→-50%` loop (`ease:"none"`, `repeat:-1`, `duration` by content height ~20–40s), edge mask fades (`mask-image:linear-gradient`), `will-change:transform` only on tracks, pause offscreen via IntersectionObserver (skill 9), `prefers-reduced-motion` → static wrapped grid. DOM `<img>` + links (preserving agent-C link decisions), NOT WebGL planes (a11y + perf + clickability).
- Alternatives: WebGL logo wall (reject — kills links/a11y/perf for zero visual gain); JS physics marquee (reject — linear loop is the correct primitive).
- Risks: logo rights/cropping (never crop/recolor; uniform card height, contain-fit); layout shift (fixed row heights, `ScrollTrigger.refresh()` after logo images load); over-animating (rails are atmosphere — keep velocity low, no skew unless wave-linked).

### 4.11 Lenis + ScrollTrigger + R3F sync
- Recommended (verified, §2e/2f): single GSAP ticker owns time. `const lenis = new Lenis({ lerp:0.09, smoothWheel:true })`; `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t=>lenis.raf(t*1000))`; `gsap.ticker.lagSmoothing(0)`. R3F `<Canvas frameloop="always">` during film; `useFrame` reads `filmProgressRef.current = masterTimeline.progress()` (written in timeline `onUpdate`) and damps camera/world toward it. React binding: plain `lenis` + `useEffect` (fewer deps) OR `lenis/react` `ReactLenis root options={{autoRaf:false}}` (https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md) — same ticker contract either way. Cleanup: `gsap.context()`/`useGSAP` revert + `lenis.destroy()` + kill triggers on unmount/route change. Reduced motion: skip Lenis entirely (`if (matchMedia('(prefers-reduced-motion: reduce)').matches) return`), native scroll + snapped chapter states.
- Alternatives: `ScrollControls` (rejected §2c), ScrollSmoother (Club-only, unavailable — recorded §2e), independent RAF loops per system (reject — tearing/jank).
- Risks: ticker ownership confusion (exactly ONE `gsap.ticker.add(lenis.raf)` — audit for duplicates); React 19 strict-mode double-mount creating two Lenises (guard with ref + cleanup); anchor links fighting smooth scroll (Lenis `anchors:true` or manual `scrollTo`, test booking/contact anchors).

### 4.12 Performance budgets
Adopted from skills 3/9/12 + threejs-scenes performance rules; numbers are STARTING ENVELOPES to be profiled on target hardware, not success claims.

| Budget | Mobile tier | Desktop tier |
|---|---|---|
| DPR cap | 1.25 (max 1.5) | 1.5 (max 2) |
| Visible tris (film) | 150–300k | 500k–1.2M |
| Draw calls | 50–90 | 90–160 |
| Shadowed lights | 1 (key only, 1024 map) | 2–4 (1024–2048) |
| Fullscreen blended layers | ≤2 | ≤3 |
| Critical initial transfer | 3–6 MB | 5–10 MB |
| Steady frame | ≤25ms fallback, 16.7ms ideal | ≤16.7ms |
| Textures | 512–1K atlases for props; 2K max for case/velvet hero surfaces; KTX2/Basis everywhere | same, +4K ONLY if a surface genuinely fills frame (UNLIKELY — avoid) |
| Geometry compression | Draco (self-hosted decoders) or meshopt via `useGLTF(..., useDraco, useMeshOpt)` + `extendLoader` KTX2 (https://github.com/pmndrs/drei/blob/master/docs/loaders/gltf-use-gltf.mdx) | same |
| Post | NO bloom/DOF/CA on mobile (opacity crossfades only); desktop Bloom + Vignette only during portal/wave beats, disabled otherwise | Bloom/Vignette gated per-beat; DOF UNVERIFIED — default OFF |
| JS per route | — | <~350KB gz (playbook gate) |
| RAF discipline | `frameloop` gated + `is-offscreen` pausing (skill 9); `document.hidden` pause; quality governor lowers DPR/effects before deleting landmarks | same |

Risks: HDRIs bloat transfer (use ONE 1–2k studio HDRI, not 8k); transmission doubles render cost (portal beat only); logo planes overdraw (atlas + alphaTest); unprofiled "it compiles" claims (brief §8 forbids — Playwright + `vf` numbers required).

### 4.13 Reduced-motion fallback
- Recommended (skills 5/8/11): `matchMedia('(prefers-reduced-motion: reduce)')` → (a) NO Lenis, NO scrub smoothing, NO pin-driven camera flights; (b) camera/world snap to nearest composed chapter endpoint (skill 3: exact progress, no damping); (c) film becomes ordered static chapters (poster stills + full DOM copy, same reading order); (d) marquees static, bloom/flash OFF (hard cut at reduced brightness), ambient loops stopped; (e) every beat reachable by keyboard, footer reachable, no scroll trap. Implement as FIRST-CLASS branch (CSS `@media (prefers-reduced-motion: reduce)` + JS early-return), not a post-pass.
- Risks: treating reduced-motion as "less JS" only (must also be a complete INFORMATION experience — agent B content must read fully without WebGL); forgetting `ScrollTrigger` cleanup in the branch (test with emulation + real OS setting).

### 4.14 Accessibility of a long scroll film
- Semantic DOM carries meaning (skill 3/7): real headings/copy/links/footer ABOVE/BESIDE canvas; canvas `aria-hidden`, all information duplicated in DOM. One `<h1>`, ordered chapters, visible focus, 44px min targets, link purposes preserved from agent C.
- Contrast over 3D: authored scrims behind copy (local, not full-page blanket), ≥4.5:1 text (playbook gate), verify at brightest frame per scroll-craft method.
- Keyboard: native scroll preserved (never hijack wheel), skip-link to white/practical + footer, anchor navigation restores exact chapter state (progress = pure function of scroll — reload-at-depth works).
- Vestibular: no autoplay loops, no parallax beyond ±16px equivalents, FOV kicks disabled under reduced-motion, white flash ramped or cut.
- Fallback: poster + ordered stills + full DOM if WebGL/model/texture fails (per-chapter `onError` → DOM chapter remains). Console-clean required.
- Risks: canvas-as-content (screen readers get nothing — the DOM duplication is load-bearing, not decorative); focus lost inside pin spacers (test tab order end-to-end at 3 viewports).

---

## 5. Stack recommendation — ONE choice

### Recommended: Vite + React 19 + React Three Fiber (R3F) + drei + @react-three/postprocessing + GSAP + Lenis, static hosting

Justification (small-business marketing site, static hosting likely):
1. Single declarative tree for DOM + 3D (R3F) beats vanilla-three imperative wiring for a content-heavy site (agents B/C feed real copy/links into the same components) and beats Next.js (no SSR/ISR need; film is client-interactive; static export keeps hosting cheap and cacheable).
2. Verified interop: R3F external-ticker support (`loop.ts` frameloop-never path), Lenis↔GSAP 4-line wiring (https://github.com/darkroomengineering/lenis/blob/main/README.md), GSAP timeline+ScrollTrigger master pattern (https://gsap.com/docs/v3/Plugins/ScrollTrigger) — all observed, no glue invention.
3. Playbook-pinned set matches this stack exactly (skill 12: gsap 3.15 / lenis 1.3 / three 0.186 / R3F 9.8 / drei 10.7).
4. Static output (`vite build` → `dist/`) deploys anywhere (Netlify/Vercel static, Cloudflare Pages, cPanel, S3+CloudFront). No server, no per-request cost — correct for a marketing site.
5. React 19 + `@gsap/react` `useGSAP` gives correct StrictMode-safe trigger cleanup (GSAP MCP best practice), which vanilla-three hand-rolls badly.

Rejected:
- Next.js App Router: real benefits (SSR/SEO, image optimization, routes) do NOT pay for EyeQ's single cinematic page + static tail; adds server surface, caching complexity, and heavier JS. Reconsider ONLY if the business later needs bookings/blog/SSR-local-SEO at scale. (Judgement, marked as such.)
- Vanilla three (no React): viable for pure film, but splits DOM/3D ownership, complicates agent B/C content injection, and loses drei/R3F ecosystem (Environment, useGLTF, MeshTransmissionMaterial). Keep threejs-scenes skill as reference only.

### Exact package list (versions OBSERVED via `npm view` 2026-09-27 — pin these at scaffold)

```json
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "three": "0.186.1",
    "@react-three/fiber": "9.8.1",
    "@react-three/drei": "10.7.9",
    "@react-three/postprocessing": "3.1.3",
    "postprocessing": "6.39.5",
    "gsap": "3.15.0",
    "@gsap/react": "2.1.2",
    "lenis": "1.3.26",
    "zustand": "5.0.15",
    "maath": "0.10.8"
  },
  "devDependencies": {
    "vite": "8.3.1",
    "@playwright/test": "1.63.0"
  }
}
```

Notes:
- `maath`/`zustand` are OPTIONAL (damping helpers / shared progress store) — include at scaffold, tree-shaken if unused. Remove if Phase 4 proves manual damp + ref suffice.
- `lenis/react` vs plain `lenis`: `lenis@1.3.26` ships both (`lenis/react` subpath verified in https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md); no extra package. Decide at scaffold; default plain `lenis` + `useEffect` (fewer moving parts).
- Decoders/compression: `draco3dgltf@1.5.7` / `meshoptimizer@1.3.0` observed; prefer drei's `useGLTF` Draco+meshopt flags + self-hosted decoder path + KTX2 `extendLoader` over hand-rolled. `three-mesh-bvh@0.9.15` NOT recommended (no raycast-heavy interaction planned).
- Playwright for visual QA per brief §8 (already has `.playwright-mcp/` in workspace — reuse).

---

## 6. Blender → web pipeline

### 6.1 What is BAKED in Blender vs done at RUNTIME

| Asset / behaviour | BAKED in Blender | RUNTIME (web) | Why |
|---|---|---|---|
| Case shell, flap (closed), velvet folds, glasses parts, logo relief geometry | YES — mesh, pivots (Empties on hinge axes), UVs, vertex AO | — | Geometry is deterministic; scrub needs stable topology |
| Velvet/lens/case PBR (sheen, transmission, ior, roughness, normal/AO maps) | YES — materials + baked texture sets (diffuse/AO/normal, 1–2k) | Evaluated by three.js (`sheen/sheenRoughness/sheenColor`, `transmission/thickness/ior`) | glTF `KHR_materials_sheen/transmission/ior` carry intent (§2a); runtime re-authors nothing |
| Lighting look | NO (reference HDRI + light rig only) | Studio HDRI (1–2k) + 1–4 lights, ACES, exposure per beat | Web light ≠ Cycles; bake would fight live camera |
| Flap open, glasses unfold, emergence path | NO (only rest pose + pivots) | Timeline progress → pivot rotations + damped follow | Scrub-reversible; no clip timing to maintain |
| Sponsor flight, streaks, FOV kicks, bloom ramps | NO | Instanced planes + timeline-driven transforms + post toggles | Content-driven (agent B/C counts), resolution-responsive |
| Camera path | NO (previz only) | Master timeline → damped `useFrame` interpolation | Single conductor; mobile overrides live in code |
| White transition, rails, copy reveals | NO | DOM/GSAP | Accessible, cheap, testable |

Rule: if it must reverse perfectly with scroll, it is a pure function of timeline progress at runtime. Only rest geometry + maps are baked.

### 6.2 Export settings
- Format: `.glb` (binary glTF, self-contained) per object group: `case.glb` (shell+flap+logo relief+velvet), `glasses.glb` (front+temples+pivots). Split so glasses can stream after case first-frame. (Pipeline judgement; counts/sizes verified in Phase 3.)
- Textures: KTX2/Basis (color sRGB, data linear), mipmaps on, anisotropy ONLY on shallow-angle hero surfaces.
- Geometry: Draco OR meshopt (not both stacked blindly); position quantization ≥14-bit on logo-relief mesh; test file-size vs shading artefacts in Phase 3.
- Transforms: apply all, +Y up, meters, pivot Empties preserved as nodes, NO unapplied mirror/subdiv at export (apply or export-cage decided in Phase 3 after EEVEE check).
- Validation: round-trip each `.glb` through a clean viewer + `useGLTF` preload BEFORE choreography; check pivots, normals, sheen/transmission presence, scale.

### 6.3 EEVEE-preview-now / Cycles-bake-later
- Now (this machine): model + shade + previz in EEVEE low (fast iteration, matches brief §4). Author materials as Principled stacks that TRANSLATE to Cycles (no EEVEE-only tricks: no Shader-to-RGB cheats, no screen-space-only effects).
- Later (other machine): open SAME `.blend`, switch to Cycles, bake diffuse/AO/normal sets at final res, re-export `.glb` with baked maps. Keep `.blend` Cycles-portable from day one (real lights + HDRI path relative, no EEVEE-locked nodes).
- Risk: EEVEE sheen/transmission preview divergence (recorded §4.4) — mitigate by conservative values + scheduled Cycles re-bake check before Phase 4 lock. Blender version UNVERIFIED (§3) — confirm version parity between machines in Phase 3 or bakes may differ.

---

## Recommended architecture diagram (text)

```
                    ┌─────────────────────────────────────────────┐
                    │  NATIVE DOCUMENT SCROLL (Lenis smooth)      │
                    │  single owner; reduced-motion → native only │
                    └──────────────────────┬──────────────────────┘
                                           │ scroll events
                                           ▼
                    ┌─────────────────────────────────────────────┐
                    │  GSAP TICKER (sole clock)                   │
                    │  lenis.raf(t*1000); lagSmoothing(0)         │
                    │  ScrollTrigger.update on lenis scroll       │
                    └──────────────────────┬──────────────────────┘
                                           │
                    ┌──────────────────────▼──────────────────────┐
                    │  MASTER FILM TIMELINE (scrub ~1, pin #film) │
                    │  labels: case/open/velvet/emerge/unfold/    │
                    │  info/wave1/wave2/approach/entry/white      │
                    │  onUpdate → filmProgressRef.current = p     │
                    └───────┬────────────────────────┬────────────┘
                            │ DOM branch             │ 3D branch (ref, no setState)
                            ▼                        ▼
              ┌─────────────────────┐   ┌──────────────────────────────┐
              │ DOM / GSAP layer    │   │ R3F <Canvas> (one, persistent)│
              │ masked headlines    │   │ useFrame: damp toward p       │
              │ image-clip reveals  │   │ case.glb / glasses.glb        │
              │ white overlay 0→1   │   │ flap+temple pivot groups      │
              │ vertical logo rails │   │ sponsor instanced alpha planes│
              │ (marquee-loop)      │   │ + streak instances + FOV kick │
              │ practical info (B/C)│   │ lens physical transmission    │
              └─────────────────────┘   │ EffectComposer: Bloom+Vignette│
                                        │ (portal/wave beats only)      │
                                        └──────────────────────────────┘
                    ┌─────────────────────────────────────────────┐
                    │  STATIC HOSTING (vite build → dist/)        │
                    │  self-hosted Draco/KTX2 decoders, 1 HDRI    │
                    │  Playwright + vf gates; reduced-motion +    │
                    │  WebGL-fail → full DOM fallback             │
                    └─────────────────────────────────────────────┘
```

---

## Risks (top 10, with mitigations)

1. Blender unreachable at research time (§3) — pipeline unvalidated against real version/scene. Mitigate: Phase 3 re-runs status calls first, records version, confirms EEVEE/Cycles parity across machines.
2. Logo-relief Trifecta (rights + boolean shading + Draco quantization eating 0.3mm detail). Mitigate: official art only, micro-bevel + raking-light EEVEE check, quantization test in Phase 3.
3. Hinge-pivot misplacement (flap + 2 temple axes). Mitigate: Empties on axes, applied transforms, glTF round-trip axis check before any choreography.
4. Velvet reads as plastic (no sheen env / flat light / washed KTX2 reds). Mitigate: sheen stack + real folds + rim/HDRI + swatch-render verification.
5. Transmission perf cliff (lens + bloom + streaks on mobile). Mitigate: tiered post (mobile crossfade only), portal-beat-only composer, DPR caps, profiled budgets §4.12.
6. Two-scroll-owner regression (someone adds ScrollControls or a second Lenis). Mitigate: architecture diagram is normative; code-review gate on ticker ownership.
7. Sponsor logo misuse (wrong files, recolor, crop, linked-when-unlinked). Mitigate: consume ONLY agent B/C-cleared assets + link map; uniform contain-fit cards.
8. White-flash / vestibular harm + reduced-motion afterthought. Mitigate: first-class reduced-motion branch (§4.13), ramped white, FOV/blur gates, keyboard + contrast QA (§4.14).
9. Pin/refresh jank (fonts/models loading after trigger measurement). Mitigate: `ScrollTrigger.refresh()` after each async load, image dimensions fixed, pin heights authored.
10. "Cinematic" scope creep (particles, extra pins, custom portal shader, Next.js migration). Mitigate: brief §7 ban list + skill 8 taste gate + iterate-until-verified gates; custom GLSL and video-scrub modes explicitly deferred unless a gated failure demands them.

---

## Sources (exact URLs observed this pass)

- Brief: `docs/00-BRIEF.md` (workspace).
- Skills: loaded via skill tool — `threejs-scenes, build-threejs-scroll-worlds, webgl-3d-object, cinematic-gsap-lenis-motion-system, gsap-scrolltrigger-storytelling, scroll-world-storytelling, design-motion-principles, optimize-web-animations, marquee-loop, masked-reveal, awwwards-playbook, visual-fidelity, iterate-until-verified, blender-hard-surface-modeling` (+ opportunistic `scroll-craft`, rejected with reason).
- https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_physical_transmission.html
- https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_physical_transmission_alpha.html
- https://github.com/mrdoob/three.js/blob/dev/utils/docs/template/static/scenes/material-browser.html
- https://github.com/mrdoob/three.js/blob/dev/tsl/content/Guide.md
- https://github.com/mrdoob/three.js/blob/dev/docs/pages/GLTFExporter.html
- https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx
- https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/loop.ts
- https://github.com/pmndrs/drei/blob/master/docs/loaders/gltf-use-gltf.mdx
- https://github.com/pmndrs/drei/blob/master/docs/abstractions/use-animations.mdx
- https://github.com/pmndrs/drei/blob/master/docs/staging/environment.mdx
- https://github.com/pmndrs/drei/blob/master/docs/shaders/mesh-transmission-material.mdx
- https://github.com/pmndrs/drei/blob/master/docs/controls/scroll-controls.mdx
- https://github.com/pmndrs/react-postprocessing/blob/master/_autodocs/INDEX.md
- https://github.com/pmndrs/react-postprocessing/blob/master/_autodocs/api-reference/effects.md
- https://github.com/pmndrs/react-postprocessing/blob/master/docs/effects/vignette.mdx
- https://gsap.com/docs/v3/Plugins/ScrollTrigger
- https://github.com/darkroomengineering/lenis/blob/main/README.md
- https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md
- GSAP MCP `gsap_get_gsap_guidance` (gsap-timeline + gsap-scrolltrigger verbatim).
- `npm view` versions table (§2g), observed 2026-09-27.
- Blender MCP `get_addon_status` + `get_scene_info` → connection failure (recorded §3).

UNVERIFIED items are labelled inline (Blender version/scene, sponsor counts, exact DOF prop names, bake quality, mobile GPU headroom). No facts invented; judgements marked as such.

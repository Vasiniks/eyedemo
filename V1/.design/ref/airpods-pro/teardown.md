# Teardown: https://www.apple.com/airpods-pro/

Title: AirPods Pro 3 - Apple · viewport 1440×900 · 32.5 screens · 5 other page(s) crawled

WebGL: GPU (ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Pro, Unspecified Version)) · 394 s of a 420 s budget
Phases completed: scroll motion map, hover + cursor, pointer probe, states, page transitions, continuous scroll, crawl (5 pages)

## Stack (runtime + bundle evidence)
- runtime: {"split_text_blocks":3}
- bundle keywords: Observer:616 · requestAnimationFrame:492 · clip-path:425 · THREE:242 · rive:177 · Points:74 · matter:60 · IntersectionObserver:16 · ogl:8 · WebGLRenderer:6 · mix-blend-mode:6
- canvases: none · videos: 11 · rAF calls/s: 0
- fonts loaded: SF Pro Display 600 normal, SF Pro Text 300 normal, SF Pro Text 400 normal, SF Pro Text 600 normal, SF Pro Icons 300 normal, SF Pro Icons 400 normal, SF Pro Icons 600 normal
- font files → families: fonts.json / fonts.css (copy fonts.css and the files it names; it maps each family to its saved file)

## Motion vocabulary from the code
- GSAP eases: ease-out ×4
- durations: 320 ×325, 0 ×106, .32 ×94, .24 ×78, .5 ×69, 1 ×57, .12 ×56, 400 ×48 · staggers: —
- ScrollTrigger start/end: t - 100vh ×32, t - 200vh ×20, a0t - 100vh ×16, (b - 100vh) + 20px ×8, t + 60h - 100vh ×8 / b + 100vh ×20, a0b ×12, a0b - 100vh ×8, t - 20px ×8, b + 100% ×8 · scrub: —
- CSS eases: cubic-bezier(0.4, 0, 0.6, 1) ×1564, cubic-bezier(.4,0,.6,1) ×1054, cubic-bezier(0, 0, 0.2, 1) ×570, cubic-bezier(.25,.1,.3,1) ×169, cubic-bezier(0.28, 0.11, 0.32, 1) ×72, cubic-bezier(0.4, 0, 0.3, 2) ×30

## Intro sequence
Frames at 0.3–7 s after navigation: intro/t*.jpg · video intro/intro.webm. LOOK at them in order: preloader, counter, curtain, hero entrance order.

## Motion map (measured while wheel-scrolling)
- intro finished ≈ 700 ms after navigation (first full-content frame)
- scroll-linked elements: 0 · one-shot reveals: 9 · pinned: 0 · fixed UI: 4
- REVEAL span "Dust, sweat, and water resistance" @step 4: opacity  opacity 0→1 · 700ms power3.out
- REVEAL span "Force sensor with volume swipe" @step 4: opacity matrix(1, 0, 0, 1, 0, -6.18515) → matrix(1, 0, 0, 1, 0, 0) opacity 0.003→1 · 900ms power1.out
- REVEAL div "Intelligent noise control The best thingyou’ve n" @step 6: opacity matrix(1, 0, 0, 1, 0, 1.65052) → none opacity 0.753→1 · 300ms linear
- REVEAL figure "Removes up to 2x more unwanted noise than AirPod" @step 8: opacity matrix(1, 0, 0, 1, 0, 2.72579) → none opacity 0.699→1 · 500ms power4.out
- REVEAL figure "Removes up to 4x more unwanted noise than origin" @step 8: opacity matrix(1, 0, 0, 1, 0, 10.9617) → none opacity 0.397→1 · 900ms power4.out
- REVEAL li "New ultra-low-noise microphones. Using advanced " @step 9: opacity matrix(1, 0, 0, 1, 0, 0.0414563) → none opacity 0.882→1 · 300ms linear
- REVEAL li "Voice Isolation. AirPods Pro 3 reduce background" @step 9: opacity matrix(1, 0, 0, 1, 0, 3.47248) → none opacity 0.665→1 · 400ms power2.out
- REVEAL li "Adaptive Audio. AirPods Pro 3 combine Active Noi" @step 9: opacity matrix(1, 0, 0, 1, 0, 12.4137) → none opacity 0.36→1 · 800ms power3.out
- REVEAL li "Conversation Awareness. AirPods Pro 3 can detect" @step 9: opacity matrix(1, 0, 0, 1, 0, 23.432) → none opacity 0.132→1 · 1000ms power2.out

## Hover & cursor
- cursor: native (auto)
- a "Continue": self background: rgb(29, 29, 31) → rgb(39, 39, 41)
- a "Apple": self color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | self border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 3× child span color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 3× child span border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 2× child svg color: rgba(0, 0, 0, 0) → rgb(0, 0, 0)
- a "Store": self color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | self border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 4× child span color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 4× child span border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 2× child svg color: rgba(0, 0, 0, 0) → rgb(0, 0, 0)
- span "Store": self color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | self border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 2× child span color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 2× child span border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | child svg color: rgba(0, 0, 0, 0) → rgb(0, 0, 0)
- span "": self color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | self border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | child svg color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | child svg border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | child path color: rgba(0, 0, 0, 0) → rgb(0, 0, 0)

## States
- button[aria-expanded=false]: states/buttonariaexpandedfa-120ms.jpg, states/buttonariaexpandedfa-450ms.jpg, states/buttonariaexpandedfa-1100ms.jpg
- [role=tab]: states/roletab-120ms.jpg, states/roletab-450ms.jpg, states/roletab-1100ms.jpg
- PAGE TRANSITION 1 → https://www.apple.com/ca/airpods-pro/ (client-side, SPA-style: look for barba/taxi/View Transitions/router + GSAP): states/transition1-100ms.jpg, states/transition1-300ms.jpg, states/transition1-600ms.jpg, states/transition1-1000ms.jpg, states/transition1-1600ms.jpg · back: states/transition1-back-150ms.jpg, states/transition1-back-600ms.jpg
- PAGE TRANSITION 2 → https://www.apple.com/ (client-side, SPA-style: look for barba/taxi/View Transitions/router + GSAP): states/transition2-100ms.jpg, states/transition2-300ms.jpg, states/transition2-600ms.jpg, states/transition2-1000ms.jpg, states/transition2-1600ms.jpg · back: states/transition2-back-150ms.jpg, states/transition2-back-600ms.jpg
- PAGE TRANSITION 3 → https://www.apple.com/us/shop/goto/store (client-side, SPA-style: look for barba/taxi/View Transitions/router + GSAP): states/transition3-100ms.jpg, states/transition3-300ms.jpg, states/transition3-600ms.jpg, states/transition3-1000ms.jpg, states/transition3-1600ms.jpg · back: states/transition3-back-150ms.jpg, states/transition3-back-600ms.jpg

## Pointer (mouse probe: 4 corners vs centre, ambient changes excluded)
- top: reacts in [none]
- mid-page: reacts in [none]

## Motion PATHS (reproduce these exactly: shape, centre, radius, sweep, direction vs scroll; not a generic float)
- no curved paths measured (everything moves in straight lines or not at all)

## WebGL / three.js
- no three.js scene observed
- shaders captured: 0 (0 custom → shaders/custom-*). Custom shaders ARE the look: port them, don't approximate.

## Assets (network)
assets.json maps every saved file to its source URL. Files keep the last two URL segments in their name (image-<dir>-<file>-<hash>.webp): use that to put the right photo in the right place.
- font (11): assets/font-v3-sf-pro-text_semibold-117a79c0.woff2 229KB, assets/font-v3-sf-pro-text_light-4e55b19a.woff2 220KB, assets/font-v3-sf-pro-text_regular-3cccedef.woff2 215KB, assets/font-v3-sf-pro-display_light-be76bdbb.woff2 127KB, assets/font-v3-sf-pro-display_semibold-bbfbf88f.woff2 126KB, assets/font-v3-sf-pro-display_bold-6d8c88e6.woff2 125KB, assets/font-v3-sf-pro-display_regular-e4d0d032.woff2 114KB, assets/font-v3-sf-pro-text_regular-italic-55df7438.woff2 86KB, assets/font-v3-sf-pro-icons_semibold-e870953b.woff2 14KB, assets/font-v3-sf-pro-icons_light-94ac44ac.woff2 14KB
- video (15): assets/video-hearing-health-halo-large-92f84932.webm 10962KB, assets/video-hero-large-ccf53094.mp4 5911KB, assets/video-design-large-4a52526c.webm 2328KB, assets/video-battery-large-b7c88761.mp4 2161KB, assets/video-noise-control-large-6ed086b7.webm 1775KB, assets/video-connectivity-large-bed07b27.mp4 1674KB, assets/video-touch-controls-large-ecefce64.mp4 1320KB, assets/video-heart-rate-large-59a8d698.mp4 1221KB, assets/video-fitness-hero-large-d39c0a7f.webm 1087KB, assets/video-case-large-d851eb17.mp4 910KB
- image (445): assets/image-is-mac-card-50-tradein-video-card-202405-cb8c0fe2.png 1698KB, assets/image-is-ipad-card-50-tradein-video-card-202405-824b6c3f.png 1698KB, assets/image-is-mac-card-50-upgrade-video-card-202607-249b71dc.png 1685KB, assets/image-is-ipad-card-50-upgrade-video-card-202607-3cd10efa.png 1685KB, assets/image-is-ipad-card-50-applecare-one-video-card-202511-6b28e48b.png 1520KB, assets/image-rol-noise_control_startframe__fea2j3ie71ea_large-42441a08.png 998KB, assets/image-is-mac-card-100-customize-202603-b5bd4cc5.png 909KB, assets/image-lth-hearing_health_lifestyle__cj3yilvm69ea_large-b469d51d.png 743KB

## Pages (5 crawled of 491 internal URLs found)
- https://www.apple.com/ca/airpods-pro/ → pages/ca-airpods-pro/s*.jpg (11 shots, 30.4 screens)
- https://www.apple.com/ → pages/root/s*.jpg (8 shots, 6.8 screens)
- https://www.apple.com/us/shop/goto/store → pages/us-shop-goto-store/s*.jpg (11 shots, 14.8 screens)
- https://www.apple.com/us/shop/goto/buy_mac → pages/us-shop-goto-buy-mac/s*.jpg (10 shots, 8.5 screens)
- https://www.apple.com/us/shop/goto/buy_ipad → pages/us-shop-goto-buy-ipad/s*.jpg (10 shots, 8.5 screens)

## Evidence to LOOK at (in this order)
1. intro/t*.jpg (the first 7 seconds)
2. scroll-sheet-*.png (46 frames of one continuous scroll, 5×4 per sheet, read left→right, top→bottom)
3. steps/s*.jpg for exact frames per half-screen
4. states/*.jpg (menu, hover, pointer, every transition)
5. pages/*/s*.jpg
6. progress/p*.png: frames by scroll progress (0–100%), used by `vf feel` to pair reference and build
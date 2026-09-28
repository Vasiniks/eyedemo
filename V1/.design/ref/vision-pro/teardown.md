# Teardown: https://www.apple.com/apple-vision-pro/

Title: Apple Vision Pro - Apple · viewport 1440×900 · 36.4 screens · 5 other page(s) crawled

WebGL: GPU (ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Pro, Unspecified Version)) · 407 s of a 420 s budget
Phases completed: scroll motion map, hover + cursor, pointer probe, states, page transitions, continuous scroll, crawl (5 pages)

## Stack (runtime + bundle evidence)
- runtime: {"split_text_blocks":2}
- bundle keywords: Observer:530 · clip-path:284 · requestAnimationFrame:187 · THREE:141 · Points:68 · matter:60 · rive:55 · IntersectionObserver:16 · ogl:8 · mix-blend-mode:7 · WebGLRenderer:3 · gl_FragColor:3
- canvases: none · videos: 26 · rAF calls/s: 0
- fonts loaded: SF Pro Display 400 normal, SF Pro Display 600 normal, SF Pro Display 700 normal, SF Pro Text 300 normal, SF Pro Text 400 normal, SF Pro Text 400 italic, SF Pro Text 600 normal, SF Pro Text 600 italic, SF Pro Icons 300 normal, SF Pro Icons 400 normal, SF Pro Icons 600 normal
- font files → families: fonts.json / fonts.css (copy fonts.css and the files it names; it maps each family to its saved file)

## Motion vocabulary from the code
- GSAP eases: linear ×6
- durations: 320 ×311, .32 ×82, .24 ×78, .12 ×56, 0 ×44, 1 ×37, 380 ×33, 260 ×27 · staggers: —
- ScrollTrigger start/end: t - 100vh ×21, a0t - 100vh ×15, t - 200vh ×12, a0b - 100vh ×9, a0t - 100h ×3 / b + 100vh ×12, a0b ×9, a0t ×6, a0b - 10vh ×6, a0b - 100vh ×6 · scrub: —
- CSS eases: cubic-bezier(0.4, 0, 0.6, 1) ×1754, cubic-bezier(.4,0,.6,1) ×1054, cubic-bezier(0, 0, 0.2, 1) ×665, cubic-bezier(.25,.1,.3,1) ×169, cubic-bezier(0.28, 0.11, 0.32, 1) ×72, cubic-bezier(0.4, 0, 0.3, 2) ×35

## Intro sequence
Frames at 0.3–7 s after navigation: intro/t*.jpg · video intro/intro.webm. LOOK at them in order: preloader, counter, curtain, hero entrance order.

## Motion map (measured while wheel-scrolling)
- intro finished ≈ 700 ms after navigation (first full-content frame)
- scroll-linked elements: 0 · one-shot reveals: 0 · pinned: 0 · fixed UI: 4

## Hover & cursor
- cursor: native (auto)
- a "Continue": self background: rgb(29, 29, 31) → rgb(39, 39, 41)
- a "Apple": self color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | self border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 3× child span color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 3× child span border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 2× child svg color: rgba(0, 0, 0, 0) → rgb(0, 0, 0)
- a "Store": self color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | self border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 4× child span color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 4× child span border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 2× child svg color: rgba(0, 0, 0, 0) → rgb(0, 0, 0)
- span "Store": self color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | self border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 2× child span color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | 2× child span border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | child svg color: rgba(0, 0, 0, 0) → rgb(0, 0, 0)
- span "": self color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | self border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | child svg color: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | child svg border: rgba(0, 0, 0, 0) → rgb(0, 0, 0) | child path color: rgba(0, 0, 0, 0) → rgb(0, 0, 0)

## States
- button[aria-expanded=false]: states/buttonariaexpandedfa-120ms.jpg, states/buttonariaexpandedfa-450ms.jpg, states/buttonariaexpandedfa-1100ms.jpg
- PAGE TRANSITION 1 → https://www.apple.com/ca/apple-vision-pro/ (client-side, SPA-style: look for barba/taxi/View Transitions/router + GSAP): states/transition1-100ms.jpg, states/transition1-300ms.jpg, states/transition1-600ms.jpg, states/transition1-1000ms.jpg, states/transition1-1600ms.jpg · back: states/transition1-back-150ms.jpg, states/transition1-back-600ms.jpg
- PAGE TRANSITION 2 → https://www.apple.com/ (client-side, SPA-style: look for barba/taxi/View Transitions/router + GSAP): states/transition2-100ms.jpg, states/transition2-300ms.jpg, states/transition2-600ms.jpg, states/transition2-1000ms.jpg, states/transition2-1600ms.jpg · back: states/transition2-back-150ms.jpg, states/transition2-back-600ms.jpg
- PAGE TRANSITION 3 → https://www.apple.com/us/shop/goto/store (client-side, SPA-style: look for barba/taxi/View Transitions/router + GSAP): states/transition3-100ms.jpg, states/transition3-300ms.jpg, states/transition3-600ms.jpg, states/transition3-1000ms.jpg, states/transition3-1600ms.jpg · back: states/transition3-back-150ms.jpg, states/transition3-back-600ms.jpg

## Pointer (mouse probe: 4 corners vs centre, ambient changes excluded)
- top: reacts in [none]
- mid-page: reacts in [bottom-left] · animates by itself in [top-left, top, top-right, left, center, right, bottom, bottom-right]

## Motion PATHS (reproduce these exactly: shape, centre, radius, sweep, direction vs scroll; not a generic float)
- no curved paths measured (everything moves in straight lines or not at all)

## WebGL / three.js
- no three.js scene observed
- shaders captured: 2 (2 custom → shaders/custom-*). Custom shaders ARE the look: port them, don't approximate.

## Assets (network)
assets.json maps every saved file to its source URL. Files keep the last two URL segments in their name (image-<dir>-<file>-<hash>.webp): use that to put the right photo in the right place.
- font (12): assets/font-v3-sf-pro-text_semibold-117a79c0.woff2 229KB, assets/font-v3-sf-pro-text_light-4e55b19a.woff2 220KB, assets/font-v3-sf-pro-text_regular-3cccedef.woff2 215KB, assets/font-v3-sf-pro-display_light-be76bdbb.woff2 127KB, assets/font-v3-sf-pro-display_semibold-bbfbf88f.woff2 126KB, assets/font-v3-sf-pro-display_bold-6d8c88e6.woff2 125KB, assets/font-v3-sf-pro-display_regular-e4d0d032.woff2 114KB, assets/font-v3-sf-pro-text_semibold-italic-d18565d4.woff2 98KB, assets/font-v3-sf-pro-text_regular-italic-55df7438.woff2 86KB, assets/font-v3-sf-pro-icons_semibold-e870953b.woff2 14KB
- video (28): assets/video-experience-entertainment-large-4f0a358a.mp4 8084KB, assets/video-drawer-photos-videos-transform-2d-large-5dbc474b.mp4 7082KB, assets/video-experience-apps-large-ef111bf3.mp4 7065KB, assets/video-productivity_a-large-f5c6596c.mp4 6085KB, assets/video-drawer-photos-videos-fov-large-9c16830e.mp4 5848KB, assets/video-spatial-audio-large-513ce7c7.mp4 5777KB, assets/video-foundation-large-34cb8c2f.mp4 5663KB, assets/video-drawer-entertainment-spatial-gallery-large-b7dae601.mp4 5103KB, assets/video-experience-photos-videos-large-18ed6d12.mp4 4782KB, assets/video-drawer-productivity-mac-large-e8702fe2.mp4 4006KB
- image (450): assets/image-is-mac-card-50-tradein-video-card-202405-cb8c0fe2.png 1698KB, assets/image-is-ipad-card-50-tradein-video-card-202405-824b6c3f.png 1698KB, assets/image-is-mac-card-50-upgrade-video-card-202607-249b71dc.png 1685KB, assets/image-is-ipad-card-50-upgrade-video-card-202607-3cd10efa.png 1685KB, assets/image-is-ipad-card-50-applecare-one-video-card-202511-6b28e48b.png 1520KB, assets/image-is-mac-card-100-customize-202603-b5bd4cc5.png 909KB, assets/image-eos-photos_videos_startframe__dnwwa2e1qys2_large-adc1bb91.jpg 546KB, assets/image-ty-productivity_a_startframe__b78h8iwbcw76_large-5dea633b.jpg 392KB

## Pages (5 crawled of 473 internal URLs found)
- https://www.apple.com/ca/apple-vision-pro/ → pages/ca-apple-vision-pro/s*.jpg (11 shots, 36.3 screens)
- https://www.apple.com/ → pages/root/s*.jpg (8 shots, 6.8 screens)
- https://www.apple.com/us/shop/goto/store → pages/us-shop-goto-store/s*.jpg (11 shots, 14.8 screens)
- https://www.apple.com/us/shop/goto/buy_mac → pages/us-shop-goto-buy-mac/s*.jpg (10 shots, 8.5 screens)
- https://www.apple.com/us/shop/goto/buy_ipad → pages/us-shop-goto-buy-ipad/s*.jpg (10 shots, 8.5 screens)

## Evidence to LOOK at (in this order)
1. intro/t*.jpg (the first 7 seconds)
2. scroll-sheet-*.png (52 frames of one continuous scroll, 5×4 per sheet, read left→right, top→bottom)
3. steps/s*.jpg for exact frames per half-screen
4. states/*.jpg (menu, hover, pointer, every transition)
5. pages/*/s*.jpg
6. progress/p*.png: frames by scroll progress (0–100%), used by `vf feel` to pair reference and build
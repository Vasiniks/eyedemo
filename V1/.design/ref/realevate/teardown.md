# Teardown: https://realevate.agency/

Title: Realevate | Exceptional Real Estate Investments in Cyprus, Montenegro & Georgia · viewport 1440×900 · 1.0 screens · 0 other page(s) crawled

WebGL: GPU (ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Pro, Unspecified Version)) · 81 s of a 420 s budget
Phases completed: scroll motion map, hover + cursor, pointer probe, states

## Stack (runtime + bundle evidence)
- runtime: {"gsap":"3.12.2","gsap_animated_elements":44,"scrolltrigger":{"pins":0,"triggers":[]},"split_text_blocks":6}
- bundle keywords: gsap:1008 · ogl:276 · ScrollTrigger:174 · requestAnimationFrame:134 · clip-path:100 · Observer:88 · SplitText:28 · rive:28 · mix-blend-mode:10 · Flip:7 · IntersectionObserver:7 · ScrollSmoother:6 · Points:4 · fbm:2 · barba:1
- canvases: none · videos: 0 · rAF calls/s: 184
- fonts loaded: Google Sans 500 normal, Roslindale Display 300 normal, Monument Extended 400 normal
- font files → families: fonts.json / fonts.css (copy fonts.css and the files it names; it maps each family to its saved file)

## Motion vocabulary from the code
- GSAP eases: none ×22, power2.out ×16, expo.inOut ×16, power2.inOut ×14, power4.out ×6, power2.in ×6, power3.out ×4, expo ×2
- durations: .5 ×14, 1 ×10, .8 ×10, .75 ×8, .2 ×8, .6 ×8, 1.6 ×8, 1.4 ×8 · staggers: 0 ×6, .025 ×4, {each:o.cardStagger,from:"end"} ×4, .08 ×2, {each:Jt.stagger,from:"end"} ×2
- ScrollTrigger start/end: top bottom ×6, bottom bottom ×6, top top ×4, top 90% ×2 / bottom top ×12, bottom bottom ×4, bottom 0% ×2 · scrub: !0 ×8, 0 ×2
- CSS eases: cubic-bezier(.7, .6, 0, 1) ×4, cubic-bezier(.18, .13, 0, .99) ×2, cubic-bezier(.16,1,.3,1) ×2, cubic-bezier(.15, .32, .2, .99) ×2, cubic-bezier(.15,.32,.2,.99) ×2
- `scrollTrigger:{trigger:h,start:kr.start,end:kr.end,invalidateOnRefresh:!1}`
- `scrollTrigger:{trigger:se,scroller:h,start:kr.start,end:kr.end,invalidateOnRefresh:!1}`
- `scrollTrigger:{id:ya,trigger:e,start:"top top",end:"bottom top",scrub:!0,invalidateOnRefresh:!0}`
- `scrollTrigger:{id:ce.exitId,trigger:e,start:"bottom bottom",end:"bottom top",scrub:!0,onUpdate(r){t&&De(r.progress>0)}`
- `scrollTrigger:{id:ce.exitId,trigger:e,start:"bottom bottom",end:"bottom top",scrub:!0,onUpdate(o){t&&De(o.progress>0)}`
- `scrollTrigger:{id:n,trigger:t,start:"top bottom",end:"bottom top",scrub:s,invalidateOnRefresh:!0}`

## Intro sequence
Frames at 0.3–7 s after navigation: intro/t*.jpg · video intro/intro.webm. LOOK at them in order: preloader, counter, curtain, hero entrance order.

## Motion map (measured while wheel-scrolling)
- the page does NOT scroll: it's a one-screen layout; its motion lives in the intro, hovers, state toggles and page transitions below
- intro finished ≈ unknown after navigation (first full-content frame)
- scroll-linked elements: 0 · one-shot reveals: 0 · pinned: 0 · fixed UI: 18

## Hover & cursor
- cursor: native (auto)
- a "By The Sea Coastal, Marina & Seafront pr": self filter: none → brightness(1) | child img transform: none → s1 | child img filter: brightness(1) saturate(1) → brightness(1) saturate(1)
- span "": child img transform: none → s1 | child img filter: brightness(1) saturate(1) → brightness(1) saturate(1)
- a "Evergreen Gulf Resorts, parks & Forest O": self filter: none → brightness(1) | child img transform: none → s1 | child img filter: brightness(1) saturate(1) → brightness(1) saturate(1)
- span "": child img transform: none → s1 | child img filter: brightness(1) saturate(1) → brightness(1) saturate(1)
- a "Urban Living City center & Old city vibe": self filter: none → brightness(1) | child img transform: none → s1 | child img filter: brightness(1) saturate(1) → brightness(1) saturate(1)
- span "": child img transform: none → s1 | child img filter: brightness(1) saturate(1) → brightness(1) saturate(1)
- a "Rare Gems One of a kind & Unique concept": self filter: none → brightness(1) | child img transform: none → s1 | child img filter: brightness(1) saturate(1) → brightness(1) saturate(1)

## States
- no menu/tab toggles found
- no internal link to test a page transition

## Pointer (mouse probe: 4 corners vs centre, ambient changes excluded)
- top: reacts in [left, right] · animates by itself in [bottom-left, bottom, bottom-right] · elements that move with the mouse (parallax/magnetic): img "" .; div "Elevating Life Elevating" .marquee-scroll

## Motion PATHS (reproduce these exactly: shape, centre, radius, sweep, direction vs scroll; not a generic float)
- no curved paths measured (everything moves in straight lines or not at all)

## WebGL / three.js
- no three.js scene observed
- shaders captured: 0 (0 custom → shaders/custom-*). Custom shaders ARE the look: port them, don't approximate.

## Assets (network)
assets.json maps every saved file to its source URL. Files keep the last two URL segments in their name (image-<dir>-<file>-<hash>.webp): use that to put the right photo in the right place.
- font (3): assets/font-fonts-serif-6122821f.woff2 44KB, assets/font-fonts-sans-latin-6d379bda.woff2 26KB, assets/font-fonts-extended-e21864b2.woff2 25KB
- image (68): assets/image-slider-ever-1_converted-1cafaa01.avif 388KB, assets/image-slider-ever-3_converted-ba1aa413.avif 373KB, assets/image-evergreen-evergreen-big-image-74688721.avif 329KB, assets/image-slider-BTS-3_converted-270e056f.avif 323KB, assets/image-slider-ever-4_converted-83aaaa48.avif 309KB, assets/image-slider-BTS-6_converted-ef561daa.avif 294KB, assets/image-slider-ever-12_converted-eba16820.avif 260KB, assets/image-assets-hero-load-visual-482990c5.avif 233KB

## Pages (0 crawled of 1 internal URLs found)

## Evidence to LOOK at (in this order)
1. intro/t*.jpg (the first 7 seconds)
2. scroll-sheet-*.png (0 frames of one continuous scroll, 5×4 per sheet, read left→right, top→bottom)
3. steps/s*.jpg for exact frames per half-screen
4. states/*.jpg (menu, hover, pointer, every transition)
5. pages/*/s*.jpg
6. progress/p*.png: frames by scroll progress (0–100%), used by `vf feel` to pair reference and build
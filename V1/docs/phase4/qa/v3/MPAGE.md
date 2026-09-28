# V3-MPAGE — DOM chrome polish (film hand-off → footer)

Date: 2026-09-28 · Server: `npx vite --port 5504 --strictPort` · Page: `/v1.html`
Viewports (every screenshot looked at): 390×844, 768×1024, 1024×768, 1512×860, 1920×1080.
Skills: emil-design-eng, design-motion-principles (Create; landing → Jakub primary / Emil nav), review-animations bar, fixing-motion-performance, optimize-web-animations, web-perf, no-ai-design-slop.
Copy: verbatim throughout — zero text changes (§6d; `draftTags=0` in DOM at all widths, `SHOW_DRAFT_COPY` untouched).

## Verdict: SHIP the chrome

Zero horizontal overflow at all 5 widths, zero sub-44px tap targets, H1 `is-in` settles everywhere, rails crisp at 1512/1920/768, 390 header breathes, lint clean on `src/components/dom/`. (`tsc -b` shows 3 pre-existing errors in `src/v1/frameLoader.ts` — FILM's file, untouched.)

## Motion findings (review-animations table)

| Before | After | Why |
| --- | --- | --- |
| Reveal rise 32–36px (`__reveal`, `--rise`, footer 28px) | 20 / 24 / 20px | Binding caps travel at 8–24px; 36px read as float, not settle |
| CTA magnetic ±6px, direct `mousemove→transform` | ±4px, rAF-lerped follow + eased release, fine-pointer only | Binding ≤4px; lerp removes stepper jitter, release no longer snaps |
| Word/line reveals translate-only | Same + `blur(4px)→0` (0.8s, shared stagger delay) | Binding's masked-reveal dialect; blur masks the crossfade pop (small one-shot surfaces only) |
| Clip settle `scale(1.08)`, 1.2s | `scale(1.04)`, 1.0s | 1.08 was a visible zoom; 1.04 settles, duration back inside the 0.5–1.0s family |
| H1 post-land `font-variation-settings` drift (600ms) | Removed (class kept as hook, no visual change) | Transforms/opacity only — opsz drift is paint work with no perceptual gain |
| Ledger stagger tail to 0.48s | Capped at 0.40s | Long tails make lists feel slow; keeps the 0.08 band |
| Rail rAF spins forever (idle when hidden); mobile marquee RAF runs on desktop while CSS-hidden | Rails IO-gated (RAF fully stops offscreen, restarts with fresh clock); marquee gated on `max-width: 767px` + change listener | optimize-web-animations: offscreen animation work → 0; no wasted desktop RAF |
| `.eyeq-cta` permanent `will-change: transform` | Removed (rails tracks keep theirs — they animate continuously) | Permanent layers cost memory on every CTA instance |
| RM block missed `filter` | Added `filter: none !important` | New blur(4px) entrances would otherwise leave RM text blurred |

## Chrome / responsive changes

- Header: 390px pill tightened (12px font, 14px padding, arrow hidden ≤480px — placed after the hover block so it wins at equal specificity), pill `min-height: 44px`; render-phase prev-theme pattern kept (lint-clean, endorsed).
- Skip-film + footer nav buttons: `min-height: 44px` (tap target, zero visual change).
- White act: `scroll-margin-top: 56px` for skip/anchor landings; 768–1100px padding 96px (was 112px, airy on iPad).
- Mobile: featured review + visit card padding 40→28px; rail sticky box clamped (`max-height: 100svh; overflow: clip`) so tall strips can't stretch the grid.
- Rails: `decoding="async"` on logo imgs (DPR crispness unchanged — knockout PNGs, transform-only motion).

## Verification (port 5504, looked at)

| Width | Overflow | <44px targets | H1 | Notes |
| --- | --- | --- | --- | --- |
| 390 | 0 | none | is-in settled | header breathes; mobile strip below white act; ledger stacks right |
| 768 | 0 | none | is-in settled | 64px tablet rails, logos legible |
| 1024 | 0 | none | is-in settled | footer hours wrap 2 lines, acceptable |
| 1512 | 0 | none | is-in settled | rails crisp, hairline ledger draws, amber progress hairline |
| 1920 | 0 | none | is-in settled | column holds 640px, rails don't stretch |

- `mpage-{top,white,foot,full}-<w>.png` (20 shots) + `mpage-scroll-1512.webm` (15s top→bottom scroll).
- §6d: no copy added/changed; only new-store §2 data + undrafted live-site content render.

## Known non-issues / left for others

- Map slot renders as white click-to-activate cover until clicked (by design, StoreBits).
- Film frames/progress/snap are other agents' scope; header `progress` hairline verified visually only.
- `frameLoader.ts` tsc errors pre-date this pass (FILM).

Files touched (MPAGE scope only): `src/components/dom/lane-e.css`, `BookingCTA.tsx`, `Header.tsx`, `LogoRails.tsx`, `src/v1/v1.css`. `src/v1/App.tsx` read, no change needed.

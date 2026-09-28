ID=SIDE (port 5307). Files: src/v1/* and v1.html (you own them; CURVE2 is finished), plus a new data file src/v1/sideCopy.ts.
The Blender film is being re-rendered on another machine with NEW framing: the subject is placed to ONE SIDE so the page can show text in the empty side. Until the new frames arrive the old centred frames remain — build against this source-frame side map (manifest.sourceFrames=615):
| source frames | subject | EMPTY side for text |
| 1–145 (bird's-eye, tilt, take-out) | right | LEFT |
| 175–325 (rise/unfold, hero, spin) | left | RIGHT |
| 325–411 (tinted ring) | centre | none — nothing over the ring |
| 425–470 (sweep) | right | LEFT |
| 470–615 (lens dive, white, end card) | centre | none |
1. Side panels (the client wants "stats or catchphrases that pop up on the side"): editorial, restrained, one panel per beat, living in the empty side's outer 34% (never over the subject), entering with the site's masked-line reveal + a small count-up for numbers, exiting before the side flips. Content — STATS must be real (from docs/research/B-content-inventory.md): "4.9 ★ — 208 Google reviews" (beat 1–145), "7 Essilor® lenses" with the verbatim lens names (175–235), "8 eyewear brands" as the header of wave 1 (235–325, RIGHT side), "8 insurance plans — We accept most major insurance plans" as the header of wave 2 (425–470, LEFT side). CATCHPHRASES: the client explicitly asked for them — write 3–4 short (≤6 words), claim-free, non-generic lines in an optician's-dark-room voice (no "vision/focus/clarity" clichés, no promises, no stats), put them in sideCopy.ts with `draft: true`, render them (client request), and append them to docs/phase4/COPY-DRAFTS.md under "Client-requested catchphrases (awaiting approval)".
2. Re-time/re-place BrandWaves: wave 1 logos settle into the RIGHT empty side during 235–325 (under their "8 eyewear brands" header); wave 2 insurers settle into the LEFT side during 425–470; both keep the depth fly-in, but never enter the subject's half; nothing during the ring.
3. Smooth scroll: Lenis must be active and silky — lerp ≈0.075, smoothWheel true, wheelMultiplier ≈0.9, touchMultiplier 1.4, synced to GSAP ticker (one RAF); verify no double RAF; keep the canvas frame cross-blend. Respect prefers-reduced-motion (no Lenis).
4. Target viewport 1512×860 (MacBook Pro 14) + 390 mobile (on mobile stack text below/above the subject, smaller).
5. Playwright screenshots at 12 scroll stops (1512×860 + 390) + a 10s scroll video → docs/phase4/qa/polish/side-*; LOOK at them. End with POLISH-SIDE-DONE.

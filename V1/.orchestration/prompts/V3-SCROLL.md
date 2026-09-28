ID=SCROLL (port 5502). Own: `src/v1/lenis.ts`, `src/v1/snap.ts`, `src/v1/filmCurve.ts`, `src/v1/progress.ts`.
Client: "a bit snappier scroll, uniform sensitivity."
1. Lenis snappier: lerp ≈0.11 (was ~0.075), duration-based easing off, wheelMultiplier normalised so one wheel notch / trackpad swipe moves a consistent amount on Mac trackpad, mouse wheel and touch (touchMultiplier ≈1.2, syncTouch off); verify both input types.
2. Uniform sensitivity: rebalance filmCurve so the visual change per 100 px of scroll is roughly constant across beats (measure: frames advanced per 100 px; target within ±35% across beats), keep only short dwells at key frames (the snap handles emphasis), keep the take-out smooth. Keep total film length sensible (~7–8 screen heights desktop, ~5–6 mobile).
3. Snap: keep the gentle nudge but make it quicker and subtler (duration 0.7 s, capture window ≈¼ gap), never during momentum, never on mobile flings until settled.
Verify with Playwright: measure frames-per-100px per beat (table in your report) + a 20 s scroll video (trackpad-like wheel deltas and touch) → docs/phase4/qa/v3/scroll-*.

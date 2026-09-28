ID=TEXT (port 5203). Files: `src/v1/FilmCaptions.tsx`, `src/v1/captions.css`, `v1-text.html` + `src/v1/dev-text.tsx`.
Export `default function FilmCaptions({progress}:{progress:number})` — restrained editorial overlay, pure function of progress, masked line reveals (clip-path/translateY, 900ms-feel easing mapped to progress), NEVER covering the centre of the frame (glasses). ONLY real copy (verbatim from docs/research/B-content-inventory.md):
- p 0.00–0.06: bottom-left: official EyeQ logo `public/web/eyeq-logo-white.png` (small, 120px) + micro-cap "EYEQ VISION CARE" + a thin 'scroll' hint line animation.
- p 0.24–0.38: left column: verbatim heading for the lens section ("Our Popular High-Definition Lenses" — check exact casing in B) + the 7 Essilor lens names verbatim as a list (13px Inter, ® at 60%), revealing one by one.
- p 0.58–0.70: nothing (wave 2 label belongs to BrandWaves).
- p 0.72–0.84: bottom-centre micro-cap only: nothing invented — leave empty unless there is a verbatim line that fits; do not invent.
Typography: Fraunces for any display, Inter for UI; colours Bone #E9E2D3 on the dark film. Hide captions under prefers-reduced-motion? No — show them statically.
Screenshots on a black test background at p = 0.02, 0.28, 0.34 (1440 + 390) → `docs/phase4/qa/v1/text-*.png`. LOOK at them.

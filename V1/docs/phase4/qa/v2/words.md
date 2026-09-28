# V2-WORDS QA — side panels on the blank parts (real frames)

Harness: `v1-words.html` + `src/v1/dev-words.tsx` (dev only) — REAL new-film
frames (`render-repo/out/frames/f_NNNNN.webp`, output frame
`i = round(1+(s−1)·140/24)`) as cover background + `FilmCaptions` +
`SidePanels` at `p = (s−1)/614` with production easings. Dashed guides mark
the outer-36% safe zones. Screenshots: `words-s<src>-1512.png` (1512×860),
`words-s<src>-390.png` (390×844), plus one `words-s100-draft-1512.png`.

## Placement vs real frames (all verified by looking)

| src | beat | panel | result |
|-----|------|-------|--------|
| 1 | logo on sleeve | none | CLEAN — no text over the logo |
| 70 | tilt, sleeve centre-right | reviews LEFT | clear; panel ends x≈210, sleeve starts x≈330 |
| 100 | slide-out | reviews LEFT (`4.9 ★` count-up + `208 Google reviews`) | clear of sleeve |
| 145 | out of sleeve | reviews exiting, lenses entering | handoff, no overlap |
| 180/185 | pull away, subject left | lenses RIGHT, all 7 verbatim + heading `Our Popular High-Definition Lenses` (lands fully by ~s183) | clear; glasses end x≈905, column starts x≈967 |
| 215 | hero | nothing (lenses exited s213, brands enter s218) | CLEAN snap |
| 260/280 | spin, subject left | brands header only (`Eyewear brands` + `8`), docked top-right; lower half free for WAVES | clear; spin arm passes below the header |
| 368 | ring | none | CLEAN — ring untouched |
| 440/445 | sweep, subject right | insurers LEFT (`8 insurance plans` + verbatim `We Accept Most Major Insurance Plans`), docked top-left | clear of glasses/arms |
| 500 | lens dive | none | CLEAN |
| 600 | end card | none | CLEAN (store info is in the film) |

Mobile 390 (s100/s180/s260/s445): panels stack below the subject as a
compact block, smaller type — never over the subject.

## Copy / rules

- Real stats verbatim (B §7/§4/§9/§5): `4.9`, `208 Google reviews`, 7 lens
  names (®/™ intact, 60% super), brand count `8` only, heading
  `We Accept Most Major Insurance Plans` verbatim.
- DRAFT catchphrases: in data with `draft:true`, rendered ONLY when
  `VITE_SHOW_DRAFT_COPY=true` (brief §6d). Default build shows none —
  verified; draft build (`words-s100-draft-1512.png`) shows the tagged line.
- Type: Fraunces display numerals/headings, Inter micro-caps labels, Bone
  on black; masked-line reveal in, ≤10px drift + fade exit before side
  flips; numbers count up (tabular); transforms/opacity only.

## Files owned

- `src/v1/sideCopy.ts` (new beat map + `SHOW_DRAFT_COPY` gate),
  `src/v1/SidePanels.tsx` (rewritten, imports `side.css`),
  `src/v1/side.css` (new; supersedes deleted `sidePanels.css`),
  `src/v1/FilmCaptions.tsx` + `src/v1/captions.css` (hint-only; the old
  left-column lens list removed — it would overlap the subject and duplicate
  the RIGHT panel). `tsc --noEmit` clean.

Note for WAVES: headers dock at top 15% — brand logos own right y≈38–74%,
insurer logos left y≈38–74%; no collisions by construction.

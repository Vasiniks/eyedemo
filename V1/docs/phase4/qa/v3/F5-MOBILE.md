# F5-MOBILE — portrait focal-point crop follows the subject side map

ID=MOBILE · port 5709 · owns ONLY `src/v1/FilmSequence.tsx`.

## What was wrong

Portrait phones (390×844) used `focalX = 0.5 + 0.08 * smooth` — a blind drift
that ignored where the subject actually is in each source frame, and the blit
clamped focal to `[0.3, 0.7]`, so a true side bias was unreachable.

## Fix (`FilmSequence.tsx` only)

- New pure function `mobileFocalX(src)` — subject side map over the current
  **source frame** (1-based), smoothstep-interpolated, no jumps:
  - 1–30 centre `0.5`
  - 30→50 ease centre → RIGHT `0.72`; hold RIGHT through 145
  - 145→215 ease RIGHT → LEFT `0.28` (transition per map)
  - hold LEFT through 325; 325→355 ease LEFT → centre
  - hold centre through 411; 411→431 ease centre → RIGHT
  - hold RIGHT through 470; 470→500 ease RIGHT → centre; hold centre to 615
- `drawFrac` computes `src = 1 + clamp01(f) * (sourceTotal - 1)` from film
  progress (`sourceTotal` from the manifest, default 615) and uses
  `mobileFocalX(src)` **only when portrait** (`ch > cw`); landscape/desktop
  stays exactly `0.5` (unchanged).
- `blit` clamp widened from `[0.3, 0.7]` to `[0, 1]` — any 0..1 keeps a
  cover-fit crop inside the image, so `0.72/0.28` are reachable.
- Perf: pure arithmetic per frame, no allocations, one `if (portrait)` branch.

## Verify (390×844, Playwright, vite :5709, scroll fracs from shipped
`snapKeyScrolls()` — zero drift on all 9)

| shot | src | focal | looked at | verdict |
|------|-----|-------|-----------|---------|
| mobile-1.png | 1 | 0.50 | logo eye-mark in frame | PASS |
| mobile-70.png | 70 | 0.72 | sleeve + takeout mouth visible | PASS |
| mobile-145.png | 145 | 0.72 | sleeve left, glasses lens right — both in frame | PASS |
| mobile-215.png | 215 | 0.28 | hero glasses span frame, both lenses | PASS |
| mobile-280.png | 280 | 0.28 | spin temple detail + brand marks | PASS |
| mobile-368.png | 368 | 0.50 | ring hero + duplicates centred | PASS |
| mobile-440.png | 440 | 0.72 | sweep lens + insurance logos | PASS |
| mobile-500.png | 500 | 0.50 | lens-dive full-frame blur (correct) | PASS |
| mobile-600.png | 600 | 0.50 | white endcard | PASS |

Desktop spot-check (1512×860, s215 hero): centred, unchanged.
`npx tsc --noEmit`: clean (exit 0). No console/page errors during the runs.

F5-MOBILE-DONE

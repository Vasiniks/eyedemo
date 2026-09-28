# MOB-OVERLAY — mobile overlay band fix (≤820px portrait)

ID=OVERLAY · port 5712 · homepage `/` red-velvet film.

## Problem
On portrait phones there is no empty side, so the insurer/brand fly-ins
landed ON the glasses (see `mobile-440.png`) and side text competed with
the subject.

## Fix (owned files only)
- `src/v1/BrandWaves.tsx` — ≤820px portrait (`W<=820 && H>W`) settles as a
  compact 2-row × 4 constellation inside the black bands: wave 1 (brands)
  in the TOP band, wave 2 (insurers) in the BOTTOM band. Flight stays a
  depth rush (`translateZ` expo + overshoot, same timing/hold as desktop),
  so logos fly in from depth, never across the subject. Band edges come
  from the FRAME vars `--film-band-top` / `--film-band-bottom` on
  `.v1-film` (parsed `%`/`px`/fraction, sanitised); fallback is top 0–22%
  / bottom 70–100%. Rows sit clear of chrome: top rows at 55%/85% of the
  top band (below BOOK/MENU), bottom rows at 22%/50% of the bottom band
  (above SKIP FILM). Tunnel vanishing point recentres between the rows and
  rays shorten ×0.45 on mobile so the streak field stays in-band.
- `src/v1/waves.css` — portrait breakpoint
  `(max-width:820px) and (orientation:portrait)`; near ≈96px wide
  (`min(96px,24vw)`), mid 68px, far 50px. Desktop rules untouched.
- `src/v1/SidePanels.tsx` — aside gains `sd--{id}` class (timing/copy
  unchanged, hold windows `p0/p1` unchanged).
- `src/v1/side.css` — portrait bands: `.sd--reviews/.sd--lenses/.sd--brands`
  fill the BOTTOM band (`top:var(--film-band-bottom,70%)`, bottom-anchored
  short stack); `.sd--insurers` fills the TOP band
  (`height:var(--film-band-top,22%)`, `padding-top:max(68px,9vh)` to clear
  the fixed header). Outer inline centering/drift neutralised
  (`transform:none !important`; entrance lives in the inner masked lines,
  exit in opacity). Compact type (big 30px, head 19px, names 11px).
  Verbatim headers kept: `Eyewear brands`/`8`, `8 insurance plans` /
  `We Accept Most Major Insurance Plans`, lens names, reviews stat.
- `src/v1/captions.css` — portrait scroll hint pinned to the bottom band
  (`bottom:max(20px,3vh)`). Desktop unchanged.

## Performance
Transforms/opacity only. No new filters (sole static far-tier blur kept),
no per-frame allocations (static grid table + cached band edges, pure
arithmetic in `LogoItem`), no layout reads in the scrub path (bands read
once per resize via `getComputedStyle`, never per frame).

## Brief §6d
Nothing not on the live site: only the 8 existing brand / 8 existing
insurer logos and verbatim headers repositioned; DRAFT catchphrases still
gated behind `SHOW_DRAFT_COPY`; no new copy, marks, or claims.

## Verification (Playwright, server `npm run dev -- --port 5712`)
Scroll fracs run through the punch curve: w1hold scroll 0.45 (film ~0.47,
pre-exit hold), w2hold scroll 0.712 (film ~0.72). Settle-poll + 3.5s
loader catch-up; every PNG below was LOOKed at.

| Viewport | w1 (brands) | w2 (insurers) | Result |
|---|---|---|---|
| 390×844 | `mob-OVERLAY-390x844-w1hold.png` | `mob-OVERLAY-390x844-w2hold.png` | PASS: logos 2-row top/bottom bands, clear of header/glasses/SKIP; side text opposite band, verbatim |
| 360×780 | `mob-OVERLAY-360x780-w1hold.png` | `mob-OVERLAY-360x780-w2hold.png` | PASS: same, no subject overlap |
| 430×932 | `mob-OVERLAY-430x932-w1hold.png` | `mob-OVERLAY-430x932-w2hold.png` | PASS: same, no subject overlap |
| 1512×860 (regression) | `mob-OVERLAY-1512x860-w1hold.png` | `mob-OVERLAY-1512x860-w2hold.png` | PASS: desktop unchanged — logos in L/R empty sides, not bands |

First-round probes at scroll 0.499/0.747 shot the exit fade (transparent by
design) and were re-shot at the corrected holds above. No pageerrors on
any run. `tsc --noEmit` clean.

Files edited (ONLY): `src/v1/BrandWaves.tsx`, `src/v1/waves.css`,
`src/v1/SidePanels.tsx`, `src/v1/side.css`, `src/v1/FilmCaptions.tsx`
(untouched — verified band-safe), `src/v1/captions.css`.

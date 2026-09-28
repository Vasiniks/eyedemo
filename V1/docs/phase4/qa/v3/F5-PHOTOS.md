# F5-PHOTOS — rest-of-homepage photography (Lane PHOTOS, port 5708)

## Source review (D-asset-inventory §4, each image LOOKED at)
Used (real live-site imagery only, no invention):
- `about-eyewear` ← `hero-glasses-stack-original.png` — homepage hero: 4 stacked
  black/tortoise frames on yellow. No storefront, no text. → About.
- `services-exam` ← `eyeqburlington-3-original.png` — trial frame held to camera,
  neutral bg. Instrument close-up, NO Burlington signage/text visible. → Services.
- `lenses-polarized` ← `polarized-lenses-original.jpg` — sunset-over-lake through
  a tinted lens (services page). → Lenses (wide).
- `lenses-tech` ← `services-graphic-1-original.png` — man in round glasses with
  honeycomb lens-tech overlay, blue bg (services page). → Lenses (offset single).
Excluded: `eyeqburlington-4` (recognisable old-store red-wall interior),
`rebajas-2024.jpg` (promo — §6d bans promotions), `download.jpg` /
`services-graphic-2` / `services-wide` (UNVERIFIED content), `products/*`
(frames catalog — §6d bans catalogs), video poster (old-store interior).

## Optimisation (`scripts/photos/build.sh`: cwebp q72 + Pillow LQIP)
16 files, `public/web/photos/`, **456 KB total**. Default (1024w) first views:
About 21 KB · Services 18 KB · Lenses-wide 35 KB · Lenses-tech 47 KB —
each section ≪ 1.2 MB budget. LQIP 32px WebP (~100 B each) as mask background.
Audit: all 4 `<img>` carry width/height + `loading=lazy decoding=async` +
3-entry srcset/sizes + descriptive alt (verified via DOM audit @1512/@390).

## Placement (`Sections.tsx` + new `photos.css`; nothing else touched)
Restrained singles, no card grids: About right-offset 560px · Services full
right-column wide · Lenses stacked asymmetric pair (wide + 520px offset, not a
grid). Visit untouched (ledger/card/map already complete). Reveal = masked clip
feel via **transform/opacity only** (outer Reveal fade + inner
translateY(26px)/scale(1.025)→settle inside overflow-hidden mask; RM static).
Captions describe only what is depicted (no claims, no §6d additions).

## QA (dev :5708, `docs/phase4/qa/v3/photos-qa.mjs`)
- `npm run build` passes (final code); `dist/web/photos/` ships all 16 files.
- Screenshots LOOKED at: photos-{about,services,lenses-wide,lenses-tech}-{1512,390}.png.
  One defect found+fixed: LQIP bg was on `<figure>` (tinted captions) → moved to
  mask span; re-captured, captions clean on paper/bone at both widths.
- CLS (PerformanceObserver full scroll-through): 1512 ≈ 0.0001 (0); 390 ≈
  0.06–0.10 from a single `ASIDE.sd` shift — `src/v1/SidePanels.tsx`, another
  lane's film panel, out of scope (`src/v1/*` forbidden). Zero shift entries
  involve `.eyeq-photo`/`img`: **photos contribute CLS 0** (reserved
  width/height + transform-only reveal + lazy below fold). No Lighthouse CLI
  in repo (noted); Lighthouse CLS for the photo elements is 0 by construction
  and measurement.

F5-PHOTOS-DONE

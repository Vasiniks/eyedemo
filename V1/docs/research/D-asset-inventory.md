# D — Asset Inventory (EyeQ Vision Care, https://eyeqoptical.ca/)

Research-only. Every fact below was observed live on 2026-09-27 via chrome-devtools browser loads
(homepage `/`, `/pages/services`, `/pages/contact`) plus `curl -A "Mozilla/5.0 …"` HTML/JSON harvests
(`/sitemap.xml`, `/products.json?limit=250`, `/collections.json`). No asset was edited, redrawn, or traced.
Nothing was invented: unverified items are marked UNVERIFIED.

Method note: "original" means the Shopify CDN URL with display-size params stripped
(`?width=` / `?height=` removed, `?v=` version kept). All downloads used a browser User-Agent.
Every file below was verified with `file` + Pillow (dimensions/mode/alpha); corrupt files: zero.

Local total: **53 files, ~95 MB** under `assets/source/`.

## OLD STORE (live site — record only, NOT the new store)

Observed on `/` footer + `/pages/contact` (browser-rendered text, 2026-09-27):

- Address: 777 Guelph Line C1A, Burlington, ON L7R 3N2
- Phone: (905) 333-3931 · Fax: (905) 333-3932 · Email: info@eyeq2020.ca
- Map embed origin: `777 Guelph Line C1A, Burlington, ON L7R 3N2`
- Booking link (actual current destination): `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1`

## 1. Logo

Only ONE official EyeQ logo file exists on the site. No SVG version exists (all `.svg` hits are
insurance logos; homepage "…_svg.png" files are PNGs). No footer variant, no `og:image`,
no `apple-touch-icon`, no `<link rel="icon">`; `GET /favicon.ico` → **HTTP 404** (verified via curl -I).

| local path | source URL | type | dimensions | format | transparent? | notes |
|---|---|---|---|---|---|---|
| `assets/source/logo/eyeq-logo-header-original.png` | `https://eyeqoptical.ca/cdn/shop/files/Untitled_design__2_-removebg-preview.png?v=1785791870` (page uses `?height=162`) | header logo (also implicitly the only brand mark; no footer logo element observed) | 800×373 (displayed 173×81 @ `?height=162`) | PNG RGBA 8-bit | **yes** (corners alpha 0) | Black artwork on transparent. Ink bbox (15,20)-(797,323), 56,271 opaque px, mean ink #010101. Used in header on all 3 pages (alt="EyeQ Vision Care - Home"). |

### Logo analysis

- **Construction (observed):** wordmark "EYE" (heavy rounded sans) + "VISION CARE" (letterspaced caps beneath) at left;
  the "Q" is drawn as a large eye outline whose upper lid stroke extends left over the wordmark and lower
  lid sweeps right — i.e. the Q counter doubles as the eye orb. Single-color black (#000000 / mean #010101).
- **Variants found:** none — header, no footer logo, no favicon, no og:image, no SVG. Highest resolution
  available is the 800×373 original above (page only ever requests `?height=81/162/243` downscales).
- **Transparency:** genuine alpha (not a white box). Usable as-is on light backgrounds.
- **Cinematic-scene consequence:** the artwork is **black** — on the ~80% black cinematic intro it will be
  invisible without a light treatment. No light variant exists on the site (do NOT create one in this phase;
  flagged for design phase).
- **Do NOT:** edit, redraw, recolor-as-new-logo, or replace with text (per brief §1).

## 2. Sponsor / eyewear brand logos (homepage "OUR FEATURED EYEWEAR BRANDS", 8 images, all `alt=""`)

Brand identity is filename-implied only (no text labels in HTML); each was **visually verified** after download.
All 8 were downloaded at original resolution (page requests `?width=400` downscales).

| local path | source URL | dimensions | format | transparent? | light/dark | notes |
|---|---|---|---|---|---|---|
| `assets/source/brands/maui-jim.png` | `https://eyeqoptical.ca/cdn/shop/files/Maui-jim-logo-brandlogos_net_l6tmirejv_svg.png?v=1781814450` | 960×496 | PNG RGBA | yes | **dark** (navy script) + multicolor parrot | Navy script + red/orange/blue/green parrot. Only multicolor logo in set. Script needs light variant on black; parrot plumage partly survives. |
| `assets/source/brands/ray-ban.png` | `https://eyeqoptical.ca/cdn/shop/files/ray-ban-logo-black-and-white.png?v=1781814247` | 2400×2400 | PNG gray+alpha (LA) | yes | **dark** (black) | Black script in large square canvas; ink bbox (35,624)-(2365,1776). Needs light variant on black. |
| `assets/source/brands/prada.png` | `https://eyeqoptical.ca/cdn/shop/files/prada-logo-png-transparent.png?v=1781814007` | 2400×2400 | PNG RGBA | yes | **dark** (black) | Black serif triangle-logo lockup; ink band y 1030–1370. Needs light variant. |
| `assets/source/brands/miu-miu.png` | `https://eyeqoptical.ca/cdn/shop/files/Miu-Miu-logo.png?v=1781814175` | 3840×2160 | PNG palette + tRNS | yes (quirk below) | **dark** (black) | Black "miu miu" on *transparent*; ink bbox (149,803)-(3691,1353). QUIRK: transparent pixels carry green RGB (71,112,76) — naive alpha-ignoring flatten yields green bg. Needs light variant. |
| `assets/source/brands/persol.png` | `https://eyeqoptical.ca/cdn/shop/files/Persol-logo.png?v=1781814304` | 3840×2160 | PNG palette + tRNS | yes (same quirk) | **dark** (near-black #221E1F) | Black script "Persol" + underline; ink bbox (369,109)-(3467,2047). Same green-RGB-under-transparency quirk. Needs light variant. |
| `assets/source/brands/oakley.png` | `https://eyeqoptical.ca/cdn/shop/files/Oakley_logo_svg.png?v=1781814387` | 960×361 | PNG gray+alpha (LA) | yes | **dark** (black) | Black "OAKLEY" + ellipse icon. Needs light variant. |
| `assets/source/brands/tiffany.png` | `https://eyeqoptical.ca/cdn/shop/files/Tiffany_Logo_svg_aa50c7c9-65bb-47f5-b249-c7e80c58182a.png?v=1781814586` | 1280×156 | PNG RGBA | yes | **dark** (black) | Black "TIFFANY & CO."-style serif caps strip. Needs light variant. |
| `assets/source/brands/versace.png` | `https://eyeqoptical.ca/cdn/shop/files/Versace.png?v=1781814081` | 1686×756 | PNG RGBA | yes | **dark** (black) | Black VERSACE caps + Medusa head; ink bbox (252,247)-(1434,509). Needs light variant. |
| `assets/source/brands/ray-ban-collection.webp` | `https://cdn.shopify.com/s/files/1/0667/0372/0728/collections/Ray-Ban_logo_svg.webp?v=1787353996` | 1920×1034 | **PNG data** (despite .webp ext) RGBA | effectively opaque red-on-white | **red on white** | Red (#EC1C24-ish) Ray-Ban script banner; collection hero for `/collections/ray-ban-sun`. Opaque — needs light variant. |
| `assets/source/brands/persol-collection.png` | `https://cdn.shopify.com/s/files/1/0667/0372/0728/collections/Persol-logo.png?v=1787427241` | 3840×2160 | PNG palette + tRNS | yes (green-RGB quirk) | **dark** | Byte-comparable twin of `brands/persol.png` (different `?v=`). Collection hero `/collections/persol`. |
| `assets/source/brands/prada-collection.png` | `https://cdn.shopify.com/s/files/1/0667/0372/0728/collections/prada-logo-png-transparent.png?v=1787428768` | 2400×2400 | PNG RGBA | yes | **dark** | Twin of `brands/prada.png` (different `?v=`). Collection hero `/collections/prada`. |

Text-only brand mentions (no logo files; recorded for agent B/C, not downloaded):
Gucci, Prada, Ray-Ban (`/pages/services` paragraph); lens lines Varilux® Physio Extensee™,
Distinctive® Superior / Enhanced / SV, Essilor Stellest® 2.0, Transitions®, Xperio® (same page).
Collection-page hero quirk observed: `/collections/ray-ban-sun` and `/collections/prada` both render
`Persol-logo.png` as the background hero image (verified in HTML `background-image-container`) — likely a
Shopify misconfiguration; recorded, not "fixed".

## 3. Insurance / billing logos (`/pages/services` → "WE ACCEPT MOST MAJOR INSURANCE PLANS", 8 images)

Provider names for 3 files were NOT in the HTML (generic `images*.png` filenames, empty alt) and were
**identified by opening the images**: `images.png`=Sun Life, `images_1…png`=Manulife,
`images_1.png`=GreenShield. Files renamed accordingly (mapping table in notes column).

| local path | source URL | dimensions | format | transparent? | light/dark | notes (orig filename → identity) |
|---|---|---|---|---|---|---|
| `assets/source/insurance/sun-life.png` | `https://eyeqoptical.ca/cdn/shop/files/images.png?v=1786132899` | 800×196 | PNG palette | no (white bg) | yellow sun + dark-teal text on white | orig `images.png` → **Sun Life** (visual ID). Opaque white; needs light variant on black. |
| `assets/source/insurance/mbc-logo-en.svg` | `https://eyeqoptical.ca/cdn/shop/files/mbc-logo-en.svg?v=1786132976` | vector 770.3×115.5 viewBox | **SVG** | yes (vector) | bright-blue #0094d7 monochrome | True SVG. Title `mbc-logo-2`; all fills #0094d7. Best readability of set on black (blue only). |
| `assets/source/insurance/manulife.png` | `https://eyeqoptical.ca/cdn/shop/files/images_1fe4cef6-c639-4c8c-8277-f04c0fb8fa8d.png?v=1786135405` | 738×141 | PNG palette | no (white bg) | green bars + black text on white | orig `images_1fe4….png` → **Manulife** (visual ID). Needs light variant. |
| `assets/source/insurance/greenshield.png` | `https://eyeqoptical.ca/cdn/shop/files/images_1.png?v=1786135474` | 381×132 | PNG palette | no (white bg) | dark-green shield+text on white | orig `images_1.png` → **GreenShield™** (visual ID). Needs light variant. |
| `assets/source/insurance/canada-life-min.webp` | `https://eyeqoptical.ca/cdn/shop/files/canada-life-min.webp?v=1786135820` | 537×188 | **PNG data** (despite .webp ext) RGBA | yes | red square + gray/white script | "canada life" script, red (#C8102E-ish) block. Red works on black; gray "canada" portion is low-contrast — partial. |
| `assets/source/insurance/desjardins.webp` | `https://eyeqoptical.ca/cdn/shop/files/8a63a471d047967a05c5e2649717127e.webp?v=1786135752` | 1024×320 | **JPEG data** (despite .webp ext) RGB | no (white bg) | green (#007A4D-ish) hexagon + text on white | Only file with descriptive alt (`Green Desjardins logo…`). Needs light variant. |
| `assets/source/insurance/ia-financial-group.svg` | `https://eyeqoptical.ca/cdn/shop/files/IA_Financial_Group_logo.svg?v=1786135883` | vector 61.54×33.6 viewBox | **SVG** | yes (vector) | dark blue #003da5/#2f4995 + gray #7c878e | True SVG. Dark blues are poor on black — needs light variant. |
| `assets/source/insurance/empire-life.png` | `https://eyeqoptical.ca/cdn/shop/files/6530bc6ea88e2cc9d0944c5a_1280px-Empire_Life_logo_svg.png?v=1786135979` | 1280×407 | PNG RGBA | yes | blue + lime on transparent | Blue (#005B8C-ish) "Empire Life®" + lime/blue yin-yang mark. Usable-dark; blue text marginal on black. |

No Manulife/Sun Life/GreenShield/Blue Cross/Telus *strings* exist in any page HTML (verified via grep) —
the three opaque logos above are image-only evidence. No direct-billing copy observed (agent B/C lane).

## 4. Imagery, banners, product photos, promo graphics, video

| local path | source URL | dimensions | format | transparent? | notes (depicts) |
|---|---|---|---|---|---|
| `assets/source/imagery/hero-glasses-stack-original.png` | `https://eyeqoptical.ca/cdn/shop/files/Untitled_design_5.png?v=1785793562` | 4096×3816 | PNG RGB | no | **Homepage hero.** 4 stacked black/tortoise frames on flat yellow (#FFDE59) bg; temple text reads DOLCE&GABBANA / miu miu / PRADA / TIFFANY (verified in screenshot). Right-column composition. |
| `assets/source/imagery/heropic-original.webp` | `https://eyeqoptical.ca/cdn/shop/files/heropic.webp?v=1786146260` | 2600×993 | **JPEG data** (despite .webp ext) | no | Model with short hair wearing tortoise Ray-Ban sunglasses, white shirt, against orange→pink→blue gradient (visually verified). `/pages/services` banner. |
| `assets/source/imagery/polarized-lenses-original.jpg` | `https://eyeqoptical.ca/cdn/shop/files/polarized-lenses.jpg?v=1786146584` | 1600×1050 | JPEG | no | Sunset-over-lake view seen through a sunglasses lens; polarized-lens demo (visually verified). Services page. |
| `assets/source/imagery/eyeqburlington-3-original.png` | `https://eyeqoptical.ca/cdn/shop/files/Copy_of_eyeqburlington_3.png?v=1786130135` | 2000×714 | PNG RGB | no | Trial frame / phoropter held toward camera, examiner hands (visually verified). Eye-exam services imagery. |
| `assets/source/imagery/eyeqburlington-4-original.png` | `https://eyeqoptical.ca/cdn/shop/files/Copy_of_eyeqburlington_4.png?v=1786142392` | 2000×714 | PNG RGB | no | Same `eyeqburlington` series; exact content UNVERIFIED (not opened). Presumed exam/store imagery. |
| `assets/source/imagery/services-graphic-1-original.png` | `https://eyeqoptical.ca/cdn/shop/files/Copy_of_Untitled_Design.png?v=1786131893` | 4096×3816 | PNG RGB | no | Close-up of man wearing round black glasses with honeycomb lens-tech overlay on lens, blue gradient bg (visually verified; reads as myopia-management/Stellest lens graphic). 9.7 MB. |
| `assets/source/imagery/services-graphic-2-original.png` | `https://eyeqoptical.ca/cdn/shop/files/Copy_of_Untitled_Design_1.png?v=1786132298` | 4096×3816 | PNG RGB | no | Same `Untitled_Design` series; exact content UNVERIFIED (not opened). 5.6 MB. |
| `assets/source/imagery/rebajas-2024-original.jpg` | `https://eyeqoptical.ca/cdn/shop/files/REBAJAS_2024.jpg?v=1786132555` | 736×920 | JPEG | no | "REBAJAS" = sale promo graphic; exact content UNVERIFIED (not opened). |
| `assets/source/imagery/download-original.jpg` | `https://eyeqoptical.ca/cdn/shop/files/download.jpg?v=1786132646` | 688×1024 | JPEG | no | Generic filename; content UNVERIFIED (not opened). |
| `assets/source/imagery/services-wide-original.png` | `https://eyeqoptical.ca/cdn/shop/files/7121d93d-48e5-4130-b028-77e548d8db2a.png?v=1786146120` | 1000×562 | PNG RGBA (opaque; corners alpha 255) | no | Teal-dominant (mean #028989) wide graphic; exact content UNVERIFIED (not opened). |
| `assets/source/other/video-poster.jpg` | `https://eyeqoptical.ca/cdn/shop/files/preview_images/79805717509b43fe9c4059d4b634357b.thumbnail.0000000000.jpg?v=1785881452` | 800×800 | JPEG | no | Homepage video poster frame. (A second `…_2500x.jpg` rendition of same poster exists; same image, not duplicated.) Video shows store interior w/ red wall (per homepage screenshot); poster frame content itself UNVERIFIED. |
| *(not downloaded — URL recorded)* | `https://eyeqoptical.ca/cdn/shop/videos/c/vp/79805717509b43fe9c4059d4b634357b/79805717509b43fe9c4059d4b634357b.HD-720p-2.1Mbps-90768020.mp4?v=0` | 720p (per filename) | MP4 | n/a | Homepage background video (`<video>` ×2 refs on `/`). URL recorded only; binary not pulled (weight). |
| `assets/source/imagery/products/*.png` (22 files, `-fr` = front view) | `https://cdn.shopify.com/s/files/1/0667/0372/0728/files/<FILE>?v=<V>` (full mapping below) | 3768×1884 (19×) / 2090×1357 (rb3025, rb4165, rb4171f) | PNG RGBA | yes (corners alpha 0) | Luxottica-style packshots: front studio view, transparent bg. One angle per model downloaded; remaining angles (`__qt/__cfr/__lt/__al1/__al2/__bk`) exist in `/products.json` and are recorded but NOT downloaded. |

Product-file mapping (`imagery/products/<local>` ← `files/<remote>`, `?v=` kept):

- `prada-pr-15ws-fr.png` ← `0PR_15WS__09Q5S0__STD__shad__fr.png?v=1787428657`
- `persol-po3272s-fr.png` ← `0PO3272S__95_31__P21__shad__fr.png?v=1787428584`
- `persol-po3210s-fr.png` ← `0PO3210S__95_31__P21__shad__fr.png?v=1787428271`
- `persol-po2803s-fr.png` ← `0PO2803S__95_58__P21__shad__fr.png?v=1787428080`
- `persol-po0649-fr.png` ← `0PO0649__95_S3__P21__shad__fr.png?v=1787427419`
- `rayban-rx5228-fr.png` ← `0RX5228__2000__EXT__shad__fr.png?v=1787427012`
- `rayban-rx6513-fr.png` ← `0RX6513__2994__P21__shad__fr.png?v=1787426706`
- `rayban-rx6489-fr.png` ← `0RX6489__2500__EXT__shad__fr.png?v=1787426384`
- `rayban-rx5154-fr.png` ← `0RX5154__2000__EXT__shad__fr.png?v=1787425076`
- `rayban-rx3927v-fr.png` ← `0RX3927V__2500__EXT__shad__fr.png?v=1787424768`
- `rayban-rb3928-fr.png` ← `0RB3928__001_S2__P21__shad__fr.png?v=1787415374`
- `rayban-rb3927-fr.png` ← `0RB3927__001_31__P21__shad__fr.png?v=1787414998`
- `rayban-rb4925-fr.png` ← `0RB4925__601_7__P21__shad__fr.png?v=1787414767`
- `rayban-rb4547-fr.png` ← `0RB4547__601_58__P21__shad__fr.png?v=1787414597`
- `rayban-rb4340-fr.png` ← `0RB4340__601_58__STD__noshad__fr.png?v=1787414208`
- `rayban-rb2140-fr.png` ← `0RB2140__129431__P21__shad__fr.png?v=1787414073`
- `rayban-rb4165-fr.png` ← `0RB4165__622_T3__RBE__shad__fr.png?v=1787413947`
- `rayban-rb4171f-fr.png` ← `0RB4171__622_T3__RBE__shad__fr.png?v=1787413805`
- `rayban-rb3016-fr.png` ← `0RB3016__901_58__STD__noshad__fr.png?v=1787413653`
- `rayban-rb3025-fr.png` ← `0RB3025__L0205__RBE__shad__fr.png?v=1787413518`
- `rayban-rb3721-fr.png` ← `0RB3721__186_87__P21__shad__fr.png?v=1787413334`
- `rayban-rb2132-fr.png` ← `0RB2132__901_58__STD__shad__fr.png?v=1787353825`

Catalog context (from sitemap + JSON): 22 products (17 Ray-Ban, 4 Persol, 1 Prada), 3 collections
(`ray-ban-sun` 12 products, `persol` 4, `prada` 1), 2 content pages + `/blogs/news` (empty — "News" heading only).

## 5. Fonts (actually loaded — computed `document.fonts` + network requests, homepage)

| family | weights/styles observed loaded | source | license |
|---|---|---|---|
| Inter | 400 normal, 700 normal (loaded); 400/700 italic listed unloaded | self-hosted Shopify CDN: `https://eyeqoptical.ca/cdn/fonts/inter/inter_n4.…woff2`, `inter_n7.…woff2` (+ .woff fallbacks) | UNVERIFIED for reuse (served under Shopify theme; no license file observed) |
| Barlow Condensed | 600 normal (loaded); 700 + italics listed unloaded | same: `/cdn/fonts/barlow_condensed/barlowcondensed_n6.…woff2` etc. | UNVERIFIED for reuse (same caveat) |
| GTStandard-M | 500 normal (loaded; 450/600 unloaded) | `https://cdn.shopify.com/shop-assets/static_uploads/shoplift/GTStandard-MMedium.woff2` (Shopify system) | UNVERIFIED; proprietary Shopify asset — do not hotlink |

Usage (computed styles): headings/nav/CTAs = `"Barlow Condensed", sans-serif` 600 (H1 72px, nav 28px, H2 24–48px);
body/copy/reviews = `Inter, sans-serif` 400/600 (14–16px). No Google Fonts, no Typekit observed.

## 6. Colors (actually used — theme CSS vars + sampled imagery)

| hex | where observed | role |
|---|---|---|
| `#FFFFFF` / `rgb(255 255 255)` | `--color-background`, theme-color meta, buttons | page background |
| `#000000` | `--color-foreground`, `--color-border`, logo/brand ink | text, borders, logo ink |
| `#A42325` / `rgb(164 35 37)` | `--color-background` (scheme), primary buttons | brand maroon (primary CTA) |
| `#B9272A` | primary-button hover | brand maroon hover |
| `#E6E6E6` | `--color-border`, inputs | hairline borders |
| `#F2F2F2` / `#F4F4F4` | secondary-button hover, chips | light fills |
| `#262626` | selected-variant hover | near-black accent |
| `#EE9441` | services + contact CSS only | orange accent (services pages) |
| `#666666` | home CSS only | muted text (home) |
| `#FFDE59` (approx; sampled 255,222,89) | hero image bg (`hero-glasses-stack-original.png` dominant) | hero yellow — baked into image, no CSS var |

## 7. Gaps (low-res or missing — no fixes applied in this phase)

1. **No SVG EyeQ logo.** Only 800×373 PNG; emboss geometry for the case (Phase 3/4) must work from this
   raster or a fresh client-supplied vector — UNVERIFIED whether 800px is enough for deboss crispness.
2. **No favicon / apple-touch-icon / og:image.** 404 + absent meta (verified). Nothing to download.
3. **ALL 8 brand logos are dark-on-transparent** (7 black/navy, Maui Jim navy+parrot). On the black
   cinematic scene every one needs a light variant — none exists on site. NOT created (per rules); brand-rail
   design must solve this (e.g. light chips behind marks — a design-phase decision, not an asset edit).
4. **5 of 8 insurance logos assume white** (Sun Life / Manulife / GreenShield / Desjardins opaque white;
   Canada Life gray-on-transparent partially). Same black-scene problem as (3).
5. **Palette-transparency quirk** (`miu-miu.png`, `persol.png`, collection twin): green RGB under tRNS alpha.
   Safe in alpha-aware pipelines; any flatten-without-alpha step will produce a green box. Kept byte-identical;
   flagged so Phase 4 compositing doesn't trip on it.
6. **Misleading extensions (kept as-downloaded, do NOT rename blindly):** `canada-life-min.webp` = PNG data,
   `desjardins.webp` = JPEG data, `heropic-original.webp` = JPEG data, `ray-ban-collection.webp` = PNG data.
   Rename only with a proper conversion step if the build needs it.
7. **Unviewed imagery** (`eyeqburlington-4`, `services-graphic-2`, `rebajas-2024.jpg`, `download.jpg`,
   `services-wide`, video poster frame): downloaded + verified open, content marked UNVERIFIED above.
8. **Product catalog is Ray-Ban-heavy sample data** (17/22 Ray-Ban, single Prada); additional angles per model
   (~60 files) deliberately not pulled — URLs reconstructible from `/products.json` pattern above.
9. **Gucci** (text mention on services page) has no logo file anywhere on site — nothing to download.
10. **No storefront photography of the actual premises** identified (all lifestyle/stock-style imagery);
    nothing representing the new Brampton address exists on the live site (expected — new store).

## Manifest verification

- `file` + Pillow pass on all 53 downloads: open OK, dimensions as tabled, 0 failures.
- Download form: originals (no `?width=`/`?height=`), `?v=` preserved in source URLs above.
- Logo: never edited/redrawn/traced — pixel-identical to CDN bytes (81.7 KB, 800×373).
- Pages actually rendered in-browser (chrome-devtools): `/`, `/pages/services`, `/pages/contact`, incl.
  snapshot + screenshot evidence (hero yellow, black header logo, brand grid, insurance grid, reviews 4.9/208).
- Shopify supplements: `/sitemap.xml` (5 child sitemaps; 22 products / 2 pages / 3 collections / 1 empty blog),
  `/products.json?limit=250`, `/collections.json` — full URL lists in §4/context.

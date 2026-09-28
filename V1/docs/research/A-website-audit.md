# A — Website Audit: https://eyeqoptical.ca/ (as experienced 2026-09-27)

Audited live with Chrome DevTools MCP (real page loads, clicks, screenshots) at desktop 1440×900 and mobile 390×844 (emulated).
Screenshots: `docs/research/screens/A/` (12 PNGs). All facts observed; unverified items marked UNVERIFIED.

> **OLD STORE (record only — NOT the new store):** 777 Guelph Line C1A, Burlington, ON L7R 3N2 · phone (905) 333-3931 · email info@eyeq2020.ca · fax (905) 333-3932. No opening hours are published anywhere on the site (checked homepage, /pages/contact, footer).

## Summary

EyeQ Vision Care's current site is a small Shopify storefront (template sections `template--27248323854616`, theme instance `t/6`; exact theme name UNVERIFIED — asset set matches Shopify's Horizon-style free theme family).
Three-item nav (HOME / SERVICES / CONTACT), no dropdowns. Homepage = yellow hero with booking CTA → store video + ABOUT US → 8-logo brand grid → static Google-reviews-style testimonial grid (4.9, 208 reviews) → footer with embedded Google Map + old-store address. A product/collection catalog exists (Persol ×4, Prada ×1, Ray-Ban Sun ×12 per `/collections.json`) but is NOT linked from any nav, header, footer, or homepage section — reachable only via direct URL; the homepage's product-list section renders empty (1px tall, no content). Booking goes to an external scheduler (deenandassociates.com, new tab). Tone is plain-template: system-feel typography, flat white sections, no motion beyond native video controls and a manual slideshow on Services.

## Site map (tree of URLs)

```
https://eyeqoptical.ca/
├── /pages/services            (nav: SERVICES)
├── /pages/contact             (nav: CONTACT — OLD store phone/email/address/fax)
├── /cart                       (header cart icon; /cart.json works, currency CAD)
├── /collections/persol         (4 items — NOT linked in nav/footer/homepage)
├── /collections/prada          (1 item — NOT linked anywhere)
├── /collections/ray-ban-sun    (12 items — NOT linked anywhere)
├── /products/persol-po0649 | /products/persol-po2803s | /products/persol-po3210s
├── /products/persol-po3272s | /products/prada-pr-15ws | /products/rayban-rb2132-new-wayfarer
│   (+ more Ray-Ban products per sitemap — full list UNVERIFIED, ~17 products per /products.json)
├── /policies/refund-policy | /policies/privacy-policy | /policies/terms-of-service
│   (reachable ONLY via footer "Terms and Policies" expander; no other links)
└── EXTERNAL: booking → http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1 (new tab)
```

- No shop/collections index page is linked; no blog, FAQ, hours, or insurance page beyond the Services section strip.
- `/sitemap.xml` → 5 sub-sitemaps (products, pages, collections, blogs). `/pages.json` confirms only 2 pages: `contact`, `services`.

## Homepage section-by-section (top → bottom, desktop order)

| # | Section (template id suffix) | Heading | Contents / layout | Imagery | Motion |
|---|---|---|---|---|---|
| 0 | Header (sticky) | "EYEQ VISION CARE" (h1, logo alt) | Left: EyeQ eye-logo (black) `Untitled_design__2_-removebg-preview.png`; center nav HOME / SERVICES / CONTACT (no dropdowns — verified, no submenu markup); right: account icon, cart icon. Screenshot `02-hero-desktop.png` | Logo PNG only | None; sticky |
| 1 | Hero `hero_RkimKJ` | H1 "FROM EYE EXAMS TO EVERYDAY STYLE." (Barlow Condensed 600, 48px, black) + black CTA button "BOOK YOUR EYE EXAM TODAY!" | Full-bleed bright-yellow banner; left text block, right composite photo of 4 eyeglass frames (Dolce & Gabbana, Miu Miu, Prada tortoise, Tiffany-style). Yellow is part of the banner image (`Untitled_design_5.png`), not a CSS color (all ancestor backgrounds compute transparent/white). Screenshot `02-hero-desktop.png` | 1 banner image | None (static image, no slider/autoplay) |
| 2 | Product list `product_list_X8Q7bi` | none | Renders EMPTY — 1px tall, no text, no cards. Shopify "product-list / resource-list" section with no visible output (possibly misconfigured). No screenshot (nothing to show) | none | none |
| 3 | About + video `section_RhpYRt` | H2 "ABOUT US" | Two-column: left deferred-video with poster (store interior, "PLAY VIDEO" button) in rounded frame; right 3 paragraphs of About copy (serving Burlington since 2018, Canadian privately owned). Screenshot `03-about-video-desktop.png` | Video poster `preview_images/798057…thumbnail…jpg`; video file `…/79805717509b43fe9c4059d4b634357b.HD-720p-2.1Mbps-90768020.mp4` (11s) | Click-to-play only (paused on load); native controls + scrubber after load. No autoplay |
| 4 | Brands `blocks_YbpTCU` | H2 "OUR FEATURED EYEWEAR BRANDS" | 4-column × 2-row static logo grid on white: Maui Jim, Ray-Ban, Prada, Miu Miu, Persol, Oakley, Tiffany & Co., Versace. Verified: logos are NOT links (`closest('a')` = null for all 8). Screenshot `04-brands-desktop.png` | 8 logo PNGs/SVGs (CDN `/cdn/shop/files/…`) | None (no marquee/carousel — static grid) |
| 5 | Reviews `17861380124d686817` | H2 "WHAT OUR CUSTOMERS SAY" + "Real reviews from real customers" + 5 red stars + "4.9 (208 reviews)" | 3-column card grid (white cards, dark-red initial avatars, 5 red stars each). 6 review texts in accessibility tree; names/initials: SW, H, NZ, AH, LL, EP — staff praised by name: Anees, Hosna/Honsa, Mojo. Custom static block (`ai-google-reviews-…` CSS classes) — NOT a live third-party widget (no external review iframe/script). Screenshot `05-reviews-desktop.png` | none (CSS avatars) | None (no carousel/autoplay) |
| 6 | Footer (contentinfo) | H3 "VISIT OUR STORE" | Left: live Google Maps embed (Burlington Centre pin); right: OLD address "777 Guelph Line C1A, Burlington, ON L7R 3N2" + "GET DIRECTIONS" link; bottom row: "© 2026 EyeQ Vision Care, Powered by Shopify" + "Terms and Policies" expander → reveals Refund/Privacy/Terms links. No phone/email/social in footer. Screenshot `06-footer-map-desktop.png` | Map tiles (Google) | Map is interactive (zoom/pan) |

Mobile (390×844, screenshots `07-homepage-mobile-390.png`, `08-mobile-menu-open.png`): same section order, single column; brands collapse to 2 columns; reviews stack 1-per-row; header collapses to hamburger ("Menu" disclosure triangle) opening a drawer with HOME / SERVICES / CONTACT + Close button; hero text stacks above glasses image.

## Other pages

- **`/pages/services`** (screenshot `09-services-desktop-full.png`): H1 SERVICES + 2 intro paragraphs (comprehensive/children's exams, contact-lens fittings; brands named: Gucci, Prada, Ray-Ban) → "ACCURATE PRESCRIPTION FITTINGS" line → "COMPREHENSIVE EYE EXAMS" + booking CTA (same external URL) → "OUR POPULAR HIGH-DEFINITION LENSES" (VARILUX® PHYSIO EXTENSEE™, DISTINCTIVE® SUPERIOR / ENHANCED / SV) with Prev/Next buttons → "SLIDESHOW" (3 manual tabs: ESSILOR STELLEST® 2.0 / TRANSITIONS® / XPERIO® with 1-paragraph descriptions each) → "WE ACCEPT MOST MAJOR INSURANCE PLANS" + ~10 insurer logo images (alt text mostly empty; one identified: Desjardins; others UNVERIFIED — agent E covers asset inventory).
- **`/pages/contact`** (screenshot `10-contact-desktop-full.png`): H1 CONTACT; four stacked rows — PHONE `(905)333-3931` (tel: link, OLD), EMAIL `info@eyeq2020.ca` (mailto, OLD), ADDRESS "Visit Us In-Store Burlington Centre 777 Guelph Line C1A…" (OLD), FAX `(905)333-3932`. No form, no hours, no map on the page itself (map lives in footer). No phone/email links exist on the homepage.
- **`/products/persol-po3272s`** (representative; screenshot `11-product-persol-desktop.png`): gallery (3 views: front/angle/quarter), title, 2-paragraph description, HIGHLIGHTS bullets, price **$0.00 CAD**, quick-add bar, ADD buttons, related-product cards (Persol ×3, Prada, Ray-Ban ×2). Prices $0.00 suggests catalog/showcase use, not real checkout.
- **`/collections/persol`** (screenshot `12-collection-persol-desktop.png`): H1 PERSOL, "4 items", Availability/Price filters, Sort button, 4 product cards with ADD buttons.
- **`/policies/refund-policy`**: standard 30-day return template referencing info@eyeq2020.ca. Privacy/Terms exist at same path pattern (linked from footer expander; content not read in full).

## Interactions tested (table: element → action → result)

| Element | Action | Result (observed URL / behavior) |
|---|---|---|
| Hero CTA "BOOK YOUR EYE EXAM TODAY!" (+ Services page copy) | Click (inspected; target=_blank) | Opens **new tab** → `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` (external scheduler; booking flow itself UNVERIFIED — not submitted) |
| About "PLAY VIDEO" poster button | Clicked | Loads deferred video; player showed paused state w/ native controls + 0:11 scrubber; file `…79805717509b…HD-720p-2.1Mbps-90768020.mp4`. No autoplay on load (verified `paused:true` before click) |
| Services slideshow tabs (Slide 1–3) | Clicked Tab 2 | `aria-selected` moved to Tab 2 (works); panel text query still returned slide-1 copy (transition/DOM timing — treat exact panel-swap as UNVERIFIED, tabs themselves function) |
| Services "Next slide" button | Clicked | No change to slideshow tabs (button appears bound to the lens-logo strip, not the tab slideshow) — net effect: nothing visible |
| Brand logos (8) | Inspected | NOT clickable — no link wrapper; click does nothing (keep unlinked in rebuild per brief §3) |
| Reviews block | Inspected | Static content; no "write a review" / Google link (reviewCTA: none found); stars/avatars are CSS |
| Footer "GET DIRECTIONS" | Inspected | `https://www.google.com/maps/dir/?api=1&destination=777+Guelph+Line+C1A%2C+Burlington%2C+ON+L7R+3N2` (OLD store; same-tab link, not clicked to avoid leaving audit context) |
| Footer "Terms and Policies" | Clicked | Expands inline revealing Refund policy / Privacy policy / Terms of service links |
| Header account icon | Clicked | Opens "Sign in or create account" modal (Shop Pay + email form + Orders/Profile links); closed via Close button |
| Header cart icon | Inspected + `/cart.json` | Cart reachable; API returns empty cart, `currency: CAD` |
| Mobile hamburger "Menu" | Clicked | Opens drawer with HOME / SERVICES / CONTACT + Close; no nested menus |
| Footer map embed | Inspected | Live Google embed (`maps.google.com/maps?q=777+Guelph+Line…&output=embed`), Burlington Centre pin, interactive controls present |
| Homepage tel:/mailto: links | Inspected | NONE on homepage (verified zero matches); phone/email links exist only on /pages/contact |

## Tech & third-party

- **Platform:** Shopify (Powered by Shopify link, `/cart.json`, `/products.json`, `/collections.json`, `/pages.json`, `cdn.shop` assets, Shop Pay web components). Theme instance `t/6`, template `27248323854616`; exact theme name UNVERIFIED (asset filenames — `slideshow.js`, `header-drawer.js`, `predictive-search.js`, `quick-add.js` — are consistent with Shopify's Horizon-style free theme).
- **Third-party:** Google Maps embed (footer + contact); Shopify Trekkie analytics + Perf-Kit; Shop account/web-components (`cdn.shopify.com/storefront/…/account.js`); `cdn.nfcube.com` Instafeed (`instafeed-6.6.1.css` — Instagram feed app; no visible feed block found on pages audited); review block is first-party static markup, not a review app. No chat widget detected by selector scan (one ambiguous iframe match — treat chat as UNVERIFIED/absent).
- **Fonts (computed):** Headings/nav/CTA: `"Barlow Condensed", sans-serif` (H1 48px/600/black); body: `Inter, sans-serif`. (Webfont source files UNVERIFIED.)
- **Colors (computed):** Text black `rgb(0,0,0)` on white `rgb(255,255,255)`; CTA black bg / white text; review stars + avatars dark red `#a42325` (from block CSS); hero yellow is image content, exact hex UNVERIFIED; map/address footer on white.
- **Catalog (Shopify JSON):** ~17+ products (Persol 4, Prada 1, Ray-Ban Sun 12), all with `$0.00` prices and `requires_shipping:false`; product photography is multi-angle studio renders on transparent/white (Luxottica-style filenames `0PO…__shad__fr/cfr/qt`).

## Weaknesses (factual, brief — why it feels "plain")

1. Template-stacked white sections with identical centered uppercase H2s; no rhythm, overlap, or full-bleed moments besides the hero.
2. Single static hero image; no motion, no slideshow, no scroll effects anywhere on the homepage.
3. Empty/broken product-list section ships visible dead space in the section order.
4. Entire shoppable catalog ($0.00 showcase products) is orphaned — zero links to it from nav, homepage, or footer.
5. Reviews are static text (no live Google badge/link, no "review us" CTA); brand logos are flat unlinked images, not a marquee.
6. No hours published; contact page is 4 text rows with no form; footer has no phone/email/social.
7. Mixed naming ("EyeQ Vision Care" vs "Eye Q Optical" in Services copy); most Services insurer logos and several images have empty alt text.

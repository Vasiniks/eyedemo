# B — CONTENT INVENTORY (verbatim) — eyeqoptical.ca

Research-only. Every quote below was observed live on 2026-09-27 (UTC) via
chrome-devtools MCP (real page loads + DOM reads), supplemented by Shopify
JSON endpoints and sitemap XML. Nothing invented. Items that could not be
verified are marked UNVERIFIED. Old-store contact info is labelled OLD STORE.

## 0. Page map (from /sitemap.xml + children, fetched 2026-09-27)

- https://eyeqoptical.ca/ (homepage)
- https://eyeqoptical.ca/pages/services
- https://eyeqoptical.ca/pages/contact
- https://eyeqoptical.ca/collections/ray-ban-sun ("Ray-Ban Sun")
- https://eyeqoptical.ca/collections/persol ("Persol")
- https://eyeqoptical.ca/collections/prada ("Prada")
- https://eyeqoptical.ca/blogs/news (exists, EMPTY — heading "News" only, no posts)
- 22 products under /products/* (see §9)
- Policies: /policies/refund-policy, /policies/privacy-policy, /policies/terms-of-service
- No other pages found in sitemap. No announcement bar anywhere.

## 1. Navigation labels

Source: https://eyeqoptical.ca/ (header, desktop + mobile drawer identical)
- Header (desktop): `HOME` `SERVICES` `CONTACT` (+ Account icon, Cart icon — cart link hidden by theme CSS)
- Mobile drawer: `Home` `Services` `Contact`
- Link destinations: `/` , `/pages/services` , `/pages/contact`
- Footer nav: NONE (footer has only store block, copyright, "Terms and Policies" popover with `Refund policy` `Privacy policy` `Terms of service`). Source: https://eyeqoptical.ca/

## 2. Homepage hero + about (verbatim)

Source: https://eyeqoptical.ca/
- H1: `FROM EYE EXAMS TO EVERYDAY STYLE.`
- CTA button: `BOOK YOUR EYE EXAM TODAY!` → `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` (note: http, external "Deen and Associates" scheduler)
- Video block with button `PLAY VIDEO` (as rendered `PLAY VIDEO`); file: `https://eyeqoptical.ca/cdn/shop/videos/c/vp/79805717509b43fe9c4059d4b634357b/79805717509b43fe9c4059d4b634357b.HD-720p-2.1Mbps-90768020.mp4` (Shopify CDN, no YouTube/Vimeo)
- H2: `ABOUT US`
- Para 1: `Welcome to EyeQ Vision Care. Since opening our doors in 2018, we have proudly served the Burlington, Ontario community as a Canadian privately owned vision care practice.`
- Para 2: `At EyeQ Vision Care, our patients are at the heart of everything we do. We are committed to providing exceptional eye care in a welcoming and comfortable environment with a focus on personalized service and lasting relationships. Whether you are visiting for a comprehensive eye exam or searching for the perfect pair of glasses, our experienced team is dedicated to helping you see your best while ensuring every visit exceeds your expectations.`
- Para 3: `We take pride in providing outstanding customer service, quality eye care, and premium eyewear to individuals and families throughout Burlington. Thank you for trusting us with your vision. We look forward to welcoming you to EyeQ Vision Care.`
- H2: `OUR FEATURED EYEWEAR BRANDS`
- H2: `WHAT OUR CUSTOMERS SAY` + sub `Real reviews from real customers` + `4.9` `(208 reviews)`
- Homepage product row (4 cards, all linking to /products/*): `Persol PO0649`, `Persol PO2803S`, `Persol PO3210S`, `Persol PO3272S`

## 3. Services (verbatim)

Source: https://eyeqoptical.ca/pages/services
- H1: `Services`
- Intro para 1: `Looking for a trusted optometrist in Burlington? At Eye Q Optical, we're committed to helping you achieve clear, healthy vision through comprehensive eye care. Our services include comprehensive eye exams, children's eye exams, and contact lens fittings tailored to your individual needs.` (Note: says "Eye Q Optical", not "EyeQ Vision Care")
- Intro para 2: `We also offer a carefully curated collection of premium eyewear from leading designer brands, including Gucci, Prada, and Ray-Ban, making it easy to find frames that match your style while providing exceptional vision.`
- Intro para 3: `Whether you need a routine eye exam, an updated prescription, or your next pair of prescription glasses or sunglasses, our experienced team is here to help. Book your eye exam with Eye Q Optical today and visit our Burlington store to discover quality eye care and eyewear for every lifestyle.`
- Service block 1 — heading: `Accurate Prescription Fittings` + text: `Accurate prescription fitting to ensure clear, comfortable vision tailored to your needs.`
- Service block 2 — heading: `Comprehensive Eye Exams` + text: `A complete assessment of your vision and eye health, including prescription testing and screening for common eye conditions.` + button: `Book your Eye Exam today` → same Deen-and-Associates URL as homepage (`http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1`)
- Service list distilled (names only, from the two paragraphs): `comprehensive eye exams`, `children's eye exams`, `contact lens fittings`, `Accurate Prescription Fittings`, `premium eyewear` (frames). No other services named anywhere.

## 4. Lens offerings (verbatim, every item)

Source: https://eyeqoptical.ca/pages/services
- Carousel heading: `Our Popular High-Definition Lenses`
- Carousel items (in order): `Varilux® Physio Extensee™` · `Distinctive® Superior` · `Distinctive® Enhanced` · `Distinctive® SV Lenses` (titles only, no descriptions)
- Slideshow slide 1 — `Essilor Stellest® 2.0 Lenses` + `Innovative myopia-management lenses designed to help slow the progression of myopia in children while providing clear, comfortable vision.`
- Slideshow slide 2 — `Transitions® Lenses` + `Experience comfortable vision in changing light with Transitions® lenses. These light-adaptive lenses automatically adjust their tint based on the surrounding light, providing clear vision indoors and helping reduce glare and brightness outdoors. They offer convenient, everyday protection without the need to switch between regular glasses and sunglasses.`
- Slideshow slide 3 — `Xperio® Lenses` + `Xperio® polarized lenses are designed to provide clear, comfortable vision outdoors while reducing glare from reflective surfaces. They offer excellent visual clarity and UV protection, making them ideal for driving, outdoor activities, and everyday use in bright conditions.`
- Lens-brand family evident: Essilor (Varilux®, Essilor Stellest®, Transitions®, Xperio® are all Essilor brands; Distinctive™ is an Essilor private-label progressive family). No Zeiss/Hoya/Nikon/Shamir lens brands appear anywhere. No contact-lens brands appear anywhere.

## 5. Insurance / direct billing (verbatim)

Source: https://eyeqoptical.ca/pages/services
- Section heading (only insurance text on the whole site): `We Accept Most Major Insurance Plans` (alt render: `WE ACCEPT MOST MAJOR INSURANCE PLANS`). No "direct billing" wording anywhere — UNVERIFIED whether they direct-bill.
- 8 logos in display order (verified by downloading + viewing each file; `alt` attributes are empty except Desjardins):
  1. Sun Life (`images.png`)
  2. Medavie Blue Cross (`mbc-logo-en.svg` — SVG letterforms spell MEDAVIE / BLUE CROSS, blue #0094d7)
  3. Manulife (`images_1fe4cef6-c639-4c8c-8277-f04c0fb8fa8d.png`)
  4. GreenShield (`images_1.png`)
  5. Canada Life (`canada-life-min.webp`)
  6. Desjardins (`8a63a471d047967a05c5e2649717127e.webp`, alt: `Green Desjardins logo with a hexagonal icon and the brand name on a white and gray checkered background.`)
  7. IA Financial Group (`IA_Financial_Group_logo.svg`)
  8. Empire Life (`6530bc6ea88e2cc9d0944c5a_1280px-Empire_Life_logo_svg.png`)

## 6. Promotions / offers

- NONE. No announcement bar, no sale section, no promo codes, no dated offers on homepage, /pages/services, /pages/contact, or any collection/product page (checked 2026-09-27). All product prices display as `$0.00 CAD` (catalog only).
- One curiosity, NOT a promo: a lens-carousel image file is named `REBAJAS_2024.jpg` ("rebajas" = Spanish for "sale") under the `Distinctive® Enhanced` card, but no sale text is visible anywhere. Do not treat as an offer.

## 7. Testimonials / reviews (verbatim, all 6 visible)

Source: https://eyeqoptical.ca/ — widget element `<google-reviews-…>` (AI-generated Google-reviews section), header `What our customers say` / `Real reviews from real customers` / `4.9` `(208 reviews)`. Cards show avatar initial + monogram + text only — NO full reviewer names, NO star counts, NO dates visible in the widget. Initials recorded exactly as shown:
1. `SW` — `Anees was very helpful and delightful to work with on my choices. He is knowledgeable and as always I am extremely happy with the service and after service care I get from EyeQ`
2. `H` — `Excellent customer service was provided by Hosna`
3. `NZ` — `Professional, knowledgeable, and genuinely kind. Mojo always takes the time to make sure his customers are happy and goes above and beyond to provide excellent service. I always trust him with my glasses and sunglasses because I know I'm in great hands. Highly recommend!`
4. `AH` — `WOW!!!! I just had outstanding service from Mojo at EyeQ. I've been to a few places but this by far is the most thoughtful, informative, honest, and helpful customer service I've received. I didn't feel pressured with being pushed on certain products. Mojo took the time to explain how my lenses work and what to expect. I would highly recommend EyeQ to anyone.`
5. `LL` — `I came in to buy a pair of glasses and had an excellent experience. Anees and Honsa were incredibly professional, knowledgeable, and patient throughout the entire process. They took the time to explain all my options, helped me find the perfect pair of glasses, and made sure I was completely comfortable with my choice. Their customer service was outstanding, and they made the whole experience easy and enjoyable. It's rare to find people who genuinely care about helping customers, and Anees and Honsa went above and beyond. I highly recommend them to anyone looking for quality eyewear and exceptional service. Thank you both for the amazing experience!` (spelling `Honsa` as shown)
6. `EP` — `Very professional, knowledgeable and kind staff. Have been a client for many years now, I can only recommend, excellent service.`
- Staff names appearing in reviews: Anees, Hosna/Honsa (two spellings as shown), Mojo.

## 8. Contact info — OLD STORE (do NOT present as the new store)

Sources: https://eyeqoptical.ca/pages/contact and footer of every page.
- Contact page blocks (verbatim labels): `PHONE` `(905)333-3931` · `EMAIL` `info@eyeq2020.ca` · `ADDRESS` `Visit Us In-Store Burlington Centre 777 Guelph Line C1A, Burlington, ON L7R 3N2` · `FAX` `(905)333-3932`
- Footer store block (verbatim): `Visit our store` / `777 Guelph Line C1A, Burlington, ON L7R 3N2` / `Get directions` (→ Google Maps dir URL for that address) + embedded Google map of same.
- Hours: NONE published anywhere (no hours on contact page, footer, or policies). UNVERIFIED.
- Legal entity (from https://eyeqoptical.ca/policies/privacy-policy): `2434804 Ontario Inc., C1A-777 Guelph Line, Burlington ON L7R3N2, Canada`; policy refers to site as `eyeq-optical.myshopify.com`.

## 9. Featured eyewear brands (display order, homepage)

Source: https://eyeqoptical.ca/ — `OUR FEATURED EYEWEAR BRANDS` logo strip, 8 logos in this DOM order (image `alt` empty; identity from CDN filenames):
1. Maui Jim (`Maui-jim-logo-brandlogos_net_l6tmirejv_svg.png`)
2. Ray-Ban (`ray-ban-logo-black-and-white.png`)
3. Prada (`prada-logo-png-transparent.png`)
4. Miu Miu (`Miu-Miu-logo.png`)
5. Persol (`Persol-logo.png`)
6. Oakley (`Oakley_logo_svg.png`)
7. Tiffany (`Tiffany_Logo_svg_aa50c7c9-65bb-47f5-b249-c7e80c58182a.png`)
8. Versace (`Versace.png`)
- Service page also name-drops `Gucci, Prada,` and `Ray-Ban` (see §3). Gucci appears ONLY there (no Gucci products/collections).
- Brand logos are unlinked (no links on the strip).

## 10. Product/collection groupings (for wave-2 assessment)

Sources: /products.json, /collections.json, /collections/*/products.json (all fetched 2026-09-27). 22 products, every variant priced `0.00` (display `$0.00 CAD`).
- Collection `Ray-Ban Sun` (/collections/ray-ban-sun, 12 products, all vendor `Rayban`, type `SUN`): `Rayban RB2132 - New wayfarer`, `Rayban RB3721`, `Rayban RB3025` (desc: `RB3025 Aviator`), `Rayban RB3016 Clubmaster`, `Rayban RB4171F Erika`, `Rayban RB4165 Justin`, `Rayban RB2140 Wayfarer`, `Rayban RB4340 Wayfarer`, `Rayban RB4547 Boyfriend Two`, `Rayban RB4925 Aviator Puffer — A$AP Rocky`, `Rayban RB3927 by A$AP Rocky`, `Rayban RB3928 by A$AP Rocky`
- Collection `Persol` (/collections/persol, 4 products, vendor `Persol`, type `SUN`): `Persol PO0649` (desc heading `PO0649 Original`), `Persol PO2803S`, `Persol PO3210S`, `Persol PO3272S`
- Collection `Prada` (/collections/prada, 1 product, vendor recorded as `EyeQ Vision Care`, no product_type): `Prada PR 15WS`
- Orphan group (in /products.json but in NO collection, not in nav): 5 Ray-Ban OPTICAL frames, vendor `Rayban`, type `OPTICAL`: `Rayban RX5228`, `Rayban RX6513`, `Rayban RX6489 Aviator`, `Rayban RX5154 Clubmaster`, `Rayban RX3927V` — i.e. a real second product taxonomy exists: SUN (16) vs OPTICAL (5) (+1 untyped Prada).
- No kids/sports/contact-lens/safety-glasses groupings exist anywhere on the site.

## 11. Taglines / headings / misc copy

- Homepage H1: `FROM EYE EXAMS TO EVERYDAY STYLE.` (only tagline-like line on the site)
- Logo alt: `EyeQ Vision Care - Home`; header H1-ish text: `EYEQ VISION CARE`
- Footer legal: `© 2026 EyeQ Vision Care, Powered by Shopify` (© year renders 2026)
- No blog posts; `/blogs/news` shows only heading `News`.
- Social links: NONE (footer social-icons wrapper is empty; no Instagram/Facebook/TikTok/YouTube links anywhere).
- Refund policy (https://eyeqoptical.ca/policies/refund-policy): standard template; store-specific bits: `We have a 30-day return policy…contact us at info@eyeq2020.ca…` (verbatim key sentences in file history; full text is Shopify boilerplate).
- Terms of service (https://eyeqoptical.ca/policies/terms-of-service): pure Shopify template, no store-specific contact strings.
- Booking destination (actual, current): `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` — used by BOTH booking CTAs (homepage `BOOK YOUR EYE EXAM TODAY!`, services `Book your Eye Exam today`).

## Content that MUST be preserved

- [ ] Business name `EyeQ Vision Care` + existing logo (never redraw/recolor/replace)
- [ ] H1 `FROM EYE EXAMS TO EVERYDAY STYLE.` + CTA `BOOK YOUR EYE EXAM TODAY!` → current Deen-and-Associates scheduler URL
- [ ] About copy: `Since opening our doors in 2018… Burlington, Ontario… Canadian privately owned vision care practice.` (all 3 paras verbatim)
- [ ] Services: comprehensive eye exams, children's eye exams, contact lens fittings, Accurate Prescription Fittings (+ its one-line description), Comprehensive Eye Exams (+ its description)
- [ ] All 7 lens names: Varilux® Physio Extensee™, Distinctive® Superior, Distinctive® Enhanced, Distinctive® SV Lenses, Essilor Stellest® 2.0 Lenses, Transitions® Lenses, Xperio® Lenses (+ the 3 Essilor descriptions)
- [ ] Insurance heading `We Accept Most Major Insurance Plans` + all 8 insurers (Sun Life, Medavie Blue Cross, Manulife, GreenShield, Canada Life, Desjardins, IA Financial Group, Empire Life)
- [ ] Reviews: `4.9 (208 reviews)`, all 6 review texts with initials as shown (no invented names/ratings/dates)
- [ ] Nav labels HOME / SERVICES / CONTACT with current destinations; footer policies trio
- [ ] 8 featured eyewear brands in order (Maui Jim, Ray-Ban, Prada, Miu Miu, Persol, Oakley, Tiffany, Versace), unlinked as today; Gucci name-drop on services page
- [ ] OLD-STORE contact block (record only): (905)333-3931, info@eyeq2020.ca, Burlington Centre 777 Guelph Line C1A Burlington ON L7R 3N2, fax (905)333-3932; legal entity 2434804 Ontario Inc.
- [ ] No promos, no hours, no social links on live site → do not invent any

## Recommended wave-2 group (with evidence)

**Recommendation: the Essilor high-definition lens family (Varilux® Physio Extensee™ · Distinctive® Superior / Enhanced / SV · Essilor Stellest® 2.0 · Transitions® · Xperio®).**
- Why: it is the ONLY other named, multi-item, ordered content group on the site besides the 8 eyewear brands — a real "second wave" with 7 entries, its own section heading (`Our Popular High-Definition Lenses`), and 3 of 7 items carrying verbatim descriptions (source: https://eyeqoptical.ca/pages/services). It is eyewear-specific (fits the "eyewear-specific, physical" concept: glass, coatings, light-adaptive tint, polarization — all filmable as material/optics), premium-positioned, and brand-safe (® marks intact).
- Runner-up (evidence-backed alternative): the **SUN vs OPTICAL product taxonomy** — 16 SUN + 5 OPTICAL Ray-Ban/Persol frames plus Prada, with real model names (Wayfarer, Aviator, Clubmaster, Erika, Justin…) and 3 real collections (sources: /products.json, /collections/ray-ban-sun, /collections/persol, /collections/prada). Weaker because product names are long SKUs and all prices are $0.00 placeholders.
- Rejected: insurance logos (8 real marks, but insurers, not eyewear — wrong emotional register for the cinematic wave); reviews (no names/ratings, text-only, unfilmable); Gucci (named once, no products — too thin).

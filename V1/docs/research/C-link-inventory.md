# C — Link / Functionality Inventory — https://eyeqoptical.ca/

Researched: 2026-09-27 (live site, Playwright/Chromium + curl). All URLs verified by actually loading them.
"OLD STORE" = Burlington address/contact currently on the live site. Per `docs/00-BRIEF.md` it must NOT be presented as the new store.

## Key findings

1. **Booking destination (EXACT):** `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1`
   - System: **third-party booking app — "OptiStoreOne WebEx" by Deen and Associates Software Architects Inc.** (NOT a Shopify page, NOT a contact form, NOT phone-only).
   - Verified working 2026-09-27: page title "Book an appointment", live availability table (e.g. Dr. Neeta Virdi Sun Sep 27 2026 01:00–04:00 PM; Dr. Sundeep Saran Tue Oct 13 2026 04:00–07:00 PM), each row has a "View schedule" submit (`onclick="LoadAppointmentGrid('…')"` → POSTs to `LoadAppointmentGrid.php`). Footer link on the scheduler → https://www.optistore.ca.
   - Note the CTA href uses **http://** (not https) exactly as coded on the site.
   - Same URL is used by BOTH booking CTAs: homepage hero "BOOK YOUR EYE EXAM TODAY!" (`target="_blank"`) and services page "BOOK YOUR EYE EXAM TODAY" (no target attribute).
2. **Eyewear brand logos: NONE linked.** All 8 homepage logos are plain `<img>` with no `<a>` parent (verified via DOM `closest('a')` check + screenshot): Maui Jim, Ray-Ban, Prada, Miu Miu, Persol, Oakley, Tiffany & Co., Versace — in that visual order.
3. **Insurance logos: NONE linked.** All 8 logos under "WE ACCEPT MOST MAJOR INSURANCE PLANS" (services page) are plain `<img>`, no `<a>` parent (verified + screenshot): Sun Life, Medavie Blue Cross, Manulife, GreenShield, Canada Life, Desjardins, iA Financial Group, Empire Life.
4. **Phone/email (OLD STORE, contact page only):** phone visible `(905)333-3931` with href `tel:(905)3333931` (malformed — contains parentheses); email `info@eyeq2020.ca` with href `mailto:info@eyeq2020.ca`. Fax `(905)333-3932` is plain text, NOT linked. No tel:/mailto: links exist on homepage or services page (verified by full-HTML regex scan).
5. **Map:** Google Maps embed iframe on all three pages: `https://maps.google.com/maps?q=777+Guelph+Line+C1A%2C+Burlington%2C+ON+L7R+3N2&t=m&z=15&output=embed&iwloc=near` (title "Visit our store", click-to-activate overlay: `pointer-events:none` until clicked). Directions link (all pages, `target="_blank"`): `https://www.google.com/maps/dir/?api=1&destination=777+Guelph+Line+C1A%2C+Burlington%2C+ON+L7R+3N2` (OLD STORE address).
6. **Forms:** NO contact/enquiry/booking form exists anywhere. Contact page is static info cards only. The only `<form>` on every page is the Shopify predictive-search form (`GET /search`, fields `q` + hidden `options[prefix]=last`) — works (results observed in DOM). No data was submitted during research.
7. **Broken links / 404s:** NONE found. All 12 important URLs return HTTP 200 (curl, 2026-09-27): `/`, `/pages/services`, `/pages/contact`, `/cart`, 3× `/policies/*`, `/products/persol-po0649`, `/products/persol-po2803s`, `/search`, `/collections/ray-ban-sun`, and the booking URL. `social-icons__wrapper` in the footer is EMPTY — the site has **no social links at all** (no facebook/instagram hrefs anywhere in the HTML).

---

## 1. Homepage — https://eyeqoptical.ca/

| Label / visible text | Element | Clickable? | href / destination (exact) | Internal / external | target | Observed behavior when clicked |
|---|---|---|---|---|---|---|
| Skip to content | a | yes | `#MainContent` | internal | — | jumps to main content |
| Logo "EyeQ Vision Care - Home" (image) | a > img | yes | `/` | internal | — | reloads homepage |
| HOME | a (desktop nav) | yes | `/` | internal | — | homepage (current page) |
| SERVICES | a (desktop nav) | yes | `/pages/services` | internal | — | loads services page, 200 |
| CONTACT | a (desktop nav) | yes | `/pages/contact` | internal | — | loads contact page, 200 |
| Account (icon) | Shopify `<shopify-account menu="customer-account-main-menu">` web component (signed-out state) | yes | no href — opens customer-account sheet | internal (Shopify) | — | click produced no navigation in test harness; JSON config: "Sign in or create account", Shop login, Google/Facebook continue, Orders/Profile buttons |
| Cart icon (count 0) | a | yes | `/cart` | internal | — | loads cart page ("Your cart is empty"), 200. NOTE: theme CSS hides `a[href="/cart"]` (`display:none !important`) — cart icon is visually suppressed |
| More (overflow menu) | button | yes | — (opens overflow dropdown) | — | — | no overflow items (only 3 nav links); no-op |
| BOOK YOUR EYE EXAM TODAY! (hero CTA) | a (button-styled) | yes | `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` | external | `_blank` (+`rel="noopener noreferrer"`) | opens live third-party scheduler in new tab (see Key finding 1) |
| PLAY VIDEO (poster button) | button | yes | — (loads `<video>` in place) | — | — | deferred-media; reveals self-hosted MP4 `https://eyeqoptical.ca/cdn/shop/videos/c/vp/79805717509b43fe9c4059d4b634357b/79805717509b43fe9c4059d4b634357b.HD-720p-2.1Mbps-90768020.mp4` (autoplay, loop, muted, controls, poster thumbnail) |
| Brand logo images ×8 | img (no link parent) | NO | — | — | — | not clickable (see brand table §5) |
| Google review cards ×6 | article (text only) | NO | — | — | — | static text, no links |
| GET DIRECTIONS | a | yes | `https://www.google.com/maps/dir/?api=1&destination=777+Guelph+Line+C1A%2C+Burlington%2C+ON+L7R+3N2` | external | `_blank` | Google Maps directions to OLD STORE |
| Map embed | iframe | partial | `https://maps.google.com/maps?q=777+Guelph+Line+C1A%2C+Burlington%2C+ON+L7R+3N2&t=m&z=15&output=embed&iwloc=near` | external | — | click-to-activate overlay; map becomes interactive after first click |
| EyeQ Vision Care (copyright) | a | yes | `/` | internal | — | homepage |
| Powered by Shopify | a | yes | `https://www.shopify.com?utm_campaign=poweredby&utm_medium=shopify&utm_source=onlinestore` | external | `_blank` (+nofollow) | shopify.com |
| Terms and Policies | button (`popovertarget="terms-policies-popover"`) | yes | — (opens popover) | — | — | clicked: expands inline list revealing Refund/Privacy/Terms links |
| Refund policy | a (in popover) | yes | `/policies/refund-policy` | internal | — | policy page, 200 |
| Privacy policy | a (in popover) | yes | `/policies/privacy-policy` | internal | — | policy page, 200 |
| Terms of service | a (in popover) | yes | `/policies/terms-of-service` | internal | — | policy page, 200 |
| Product cards ×4 (Persol PO0649/PO2803S/PO3210S/PO3272S, below footer map) | a (`resource-card__link`) | yes | `/products/persol-po0649` etc. | internal | — | product pages, 200 (prices shown $0.00 CAD) |
| Search (magnifier, dialog) | form `GET /search` | yes | `https://eyeqoptical.ca/search?q=…` | internal | — | predictive search works; product results rendered in DOM |

## 2. Services — https://eyeqoptical.ca/pages/services

Same header/footer/chrome as homepage (identical Account, nav, map, directions, footer-behavior). Page-specific rows:

| Label / visible text | Element | Clickable? | href / destination (exact) | Internal / external | target | Observed behavior when clicked |
|---|---|---|---|---|---|---|
| BOOK YOUR EYE EXAM TODAY (under Comprehensive Eye Exams) | a (button-styled) | yes | `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` | external | none (same-tab) | loads live scheduler in same tab, 200 (see Key finding 1). NOTE: no `target="_blank"` here, unlike homepage |
| Lens slideshow Prev/Next + dots | buttons | yes | — (JS slideshow) | — | — | cycles 3 slides (Varilux/Stellest/Transitions/Xperio imagery); no navigation |
| Insurance logo images ×8 | img (no link parent) | NO | — | — | — | not clickable (see insurance table §6) |
| Lens/hero images (Copy_of_eyeqburlington_4.png, Copy_of_eyeqburlington_3.png, Copy_of_Untitled_Design.png, Copy_of_Untitled_Design_1.png, REBAJAS_2024.jpg, download.jpg, 7121d93d-….png, heropic.webp, polarized-lenses.jpg) | img (no link parent) | NO | — | — | — | decorative only |

## 3. Contact / booking — https://eyeqoptical.ca/pages/contact

Same header/footer/map as homepage. NO booking widget and NO contact form on this page. Info cards:

| Label / visible text | Element | Clickable? | href / destination (exact) | Internal / external | target | Observed behavior when clicked |
|---|---|---|---|---|---|---|
| (905)333-3931 (OLD STORE phone) | a | yes | `tel:(905)3333931` | external (dialer) | — | opens dialer (href contains literal parentheses — malformed tel:). NOT verified by placing a call |
| info@eyeq2020.ca (OLD STORE email) | a | yes | `mailto:info@eyeq2020.ca` | external (mail client) | — | opens mail client. NOT verified by sending mail |
| Address text "Burlington Centre 777 Guelph Line C1A, Burlington, ON L7R 3N2" (OLD STORE) | plain text | NO | — | — | — | not linked |
| Fax "(905)333-3932" (OLD STORE) | plain text | NO | — | — | — | not linked |
| GET DIRECTIONS | a | yes | `https://www.google.com/maps/dir/?api=1&destination=777+Guelph+Line+C1A%2C+Burlington%2C+ON+L7R+3N2` | external | `_blank` | Google Maps directions to OLD STORE |
| Map embed | iframe | partial | `https://maps.google.com/maps?q=777+Guelph+Line+C1A%2C+Burlington%2C+ON+L7R+3N2&t=m&z=15&output=embed&iwloc=near` | external | — | click-to-activate, as homepage |

## 4. Header / footer / mobile menu (all pages)

| Label / visible text | Element | Clickable? | href / destination (exact) | Internal / external | target | Observed behavior when clicked |
|---|---|---|---|---|---|---|
| Logo image | a > img | yes | `/` | internal | — | homepage |
| Home / Services / Contact (desktop `header-menu` + mobile drawer `#Details-menu-drawer-container`) | a | yes | `/`, `/pages/services`, `/pages/contact` | internal | — | correct pages; mobile drawer (390px viewport) exposes the SAME 3 links after tapping hamburger ("Menu" summary). Drawer verified open with exactly these 3 links |
| Hamburger "Menu" (mobile ≤990px) | `<summary>` in `header-drawer` | yes | — | — | — | opens drawer; verified |
| Account icon | `shopify-account` component | yes | — (sheet, no URL) | Shopify | — | no navigation observed; signed-out "Sign in or create account" config |
| Cart icon | a | yes | `/cart` | internal | — | cart page, but theme CSS hides it |
| Terms and Policies | button | yes | — (popover) | — | — | expands to 3 policy links (verified) |
| Social icons | — (empty `social-icons__wrapper`, zero `<a>`) | NO | — | — | — | NO social links exist anywhere on the site |
| "Log in" (cart page, empty cart) | a | yes | `https://eyeqoptical.ca/customer_authentication/redirect?locale=en&region_country=CA` | internal (Shopify auth) | — | link present; direct curl returns 406 (Shopify bot-protection on non-browser request) — NOT a user-facing broken link, UNVERIFIED in-browser |
| "Continue shopping" (cart page) | a | yes | `/collections/all` | internal | — | 200 |
| Product links (cart recs, search results) | a | yes | `/products/<handle>` (e.g. persol-po0649) | internal | — | 200 |

## 5. Sponsor / eyewear brand logos — linked or NOT (homepage "OUR FEATURED EYEWEAR BRANDS")

All NOT linked (DOM-verified, screenshot-verified). Visual order row 1 → row 2:

| Brand (as shown) | Image file (cdn/shop/files/…) | Linked? |
|---|---|---|
| Maui Jim | `Maui-jim-logo-brandlogos_net_l6tmirejv_svg.png` | NO |
| Ray-Ban | `ray-ban-logo-black-and-white.png` | NO |
| Prada | `prada-logo-png-transparent.png` | NO |
| Miu Miu | `Miu-Miu-logo.png` | NO |
| Persol | `Persol-logo.png` | NO |
| Oakley | `Oakley_logo_svg.png` | NO |
| Tiffany & Co. | `Tiffany_Logo_svg_aa50c7c9-65bb-47f5-b249-c7e80c58182a.png` | NO |
| Versace | `Versace.png` | NO |

(Per brief §3: keep unlinked in the rebuild.)

## 6. Insurance logos — linked or NOT (services page "WE ACCEPT MOST MAJOR INSURANCE PLANS")

All NOT linked (DOM-verified, screenshot-verified). Visual order row 1 → row 2, file mapping by DOM order:

| Insurer (as shown) | Image file (cdn/shop/files/…) | Linked? |
|---|---|---|
| Sun Life | `images.png` | NO |
| Medavie Blue Cross | `mbc-logo-en.svg` | NO |
| Manulife | `images_1fe4cef6-c639-4c8c-8277-f04c0fb8fa8d.png` | NO |
| GreenShield | `images_1.png` | NO |
| Canada Life | `canada-life-min.webp` | NO |
| Desjardins | `8a63a471d047967a05c5e2649717127e.webp` (alt text names Desjardins) | NO |
| iA Financial Group | `IA_Financial_Group_logo.svg` | NO |
| Empire Life | `6530bc6ea88e2cc9d0944c5a_1280px-Empire_Life_logo_svg.png` | NO |

## 7. Phone / email formats (OLD STORE — contact page only)

- Phone visible `(905)333-3931`, href `tel:(905)3333931` — parentheses retained in URI (technically malformed; most dialers tolerate it).
- Email `info@eyeq2020.ca`, href `mailto:info@eyeq2020.ca` (clean).
- Fax `(905)333-3932` plain text, unlinked.
- No phone/email/hours links on homepage or services page; no store hours published anywhere found.

## 8. Map / directions (OLD STORE)

- Embed (all 3 pages): `<iframe title="Visit our store" src="https://maps.google.com/maps?q=777+Guelph+Line+C1A%2C+Burlington%2C+ON+L7R+3N2&t=m&z=15&output=embed&iwloc=near">`, lazy-loaded, click-to-activate overlay (`pointer-events:none` until first click, re-locks on mouseleave).
- Directions (all 3 pages, `_blank`): `https://www.google.com/maps/dir/?api=1&destination=777+Guelph+Line+C1A%2C+Burlington%2C+ON+L7R+3N2`.
- Map pin card reads "Burlington Centre / Burlington Centre, 777 Guelph…".

## 9. Forms / iframes / Shopify JSON (supplement)

- Forms: only the site-wide predictive-search form (`GET https://eyeqoptical.ca/search`, inputs `q[type=search]`, `options[prefix][hidden]`). Works — live product results observed. No contact, newsletter, or checkout form in-page. No data submitted (inspect-only).
- Iframes per page: (1) Google Maps embed above; (2) invisible Shopify web-pixel sandbox (`/web-pixels@…/custom/web-pixel-shopify-custom-pixel@0530/sandbox/modern/…`, 0×0, `sandbox="allow-scripts allow-forms"`) — analytics, not clickable.
- `/products.json` (200): ≥17 products (Persol ×4, Prada PR 15WS, Ray-Ban optical + sun incl. A$AP Rocky collabs); ALL variants priced `"price":"0.00"` (catalog/showcase only — consistent with external booking, no real checkout flow).
- `/collections.json` (200): `ray-ban-sun` (12), `persol` (4), `prada` (1).
- `/sitemap.xml` (200): index of products/pages/collections/blogs sitemaps; no hidden service URLs beyond the 3 known pages.
- `/cart` (200): "Your cart is empty" + product rec cards; cart icon CSS-hidden theme-wide.

## 10. Broken links / 404s

NONE. 12/12 checked URLs HTTP 200 (list in Key finding 7). One anomaly (not a broken link): `tel:(905)3333931` contains parentheses — recommend `tel:+19053333931` form in rebuild (but with the NEW store number per brief). The `customer_authentication/redirect` 406 is curl-only bot protection, not user-facing.

## Sources (exact URLs loaded/clicked)

- https://eyeqoptical.ca/ (snapshot, link/img/iframe/form enumeration, brand screenshot, Terms-popover click, Account click attempt, mobile 390px + hamburger open)
- https://eyeqoptical.ca/pages/services (enumeration, insurance screenshot, booking-CTA href)
- https://eyeqoptical.ca/pages/contact (enumeration, tel:/mailto: capture)
- http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1 (loaded live, availability table observed; View-schedule form action inspected, not submitted)
- https://eyeqoptical.ca/cart (snapshot)
- https://eyeqoptical.ca/products.json, https://eyeqoptical.ca/collections.json, https://eyeqoptical.ca/sitemap.xml (curl supplement)

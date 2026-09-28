# HOME (ID=HOME, port 5714) — large Book-exam CTA + homepage completeness

Scope: `src/components/dom/**` only (BookingCTA, WhiteSection, Sections,
Footer untouched, StoreBits untouched, LogoRails untouched, lane-e.css,
photos.css untouched, index.ts). No other lane's files edited.

## 1. Large "Book your eye exam" CTA — DONE

- New `BookExamBand` (`src/components/dom/BookingCTA.tsx`, exported via
  `index.ts`): full-width Ink band carrying ONLY the verbatim live label
  `BOOK YOUR EYE EXAM TODAY!` → exact scheduler URL
  `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1`
  (http kept verbatim per brief §6c.3), always `target="_blank" rel="noopener"`
  on the homepage as on the live site (C §1). No invented copy — the band IS
  the link (section has `aria-label`, not invented headings).
- Rendered twice: (a) top of the white act, right after the film
  (`WhiteSection`, replaces the standard 48px CTA), full column width, 72px
  tall; (b) full-bleed Ink band after `VisitSection`, immediately before the
  footer (`HomeSections`). A viewport-breakout for (a) was tried and REVERTED:
  the white column is not viewport-centred once rail asides are in flow, so vw
  math mis-centred ~200px — documented in lane-e.css; the pre-footer band
  carries the full-bleed moment instead.
- Header `Book an exam` pill KEPT (`Header.tsx` untouched): exact URL,
  `_blank`, 44px min-height; never unmounts.
- Micro-interaction (inherited `BookingCTA`, transforms/opacity only, RM
  static): ≤4px magnetic follow (fine-pointer only), fill wipe 400ms expo.out,
  arrow travel, press scale .97, amber focus-visible ring on the band.
- Tap targets (measured): band CTA 72px desktop / 64px mobile; header pill 44px.
- Bug found by screenshot: on 390px the band label wrapped and the 1.4em roll
  mask clipped "TODAY!" — fixed with `white-space:nowrap` + 15px/0.06em mobile
  sizing; close-up re-capture shows the full verbatim label
  (`HOME-mobile-band-closeup.png`). Probe counts: 6 booking links site-wide,
  6/6 exact URL, 6/6 `_blank`, 0 console errors on desktop.

## 2. Homepage completeness audit vs live homepage (B §§1–2,7,9 + C §1)

Every live-homepage item → where it appears on the new homepage:

| Live item (B/C ref) | Verbatim content | Where it appears (new homepage) |
|---|---|---|
| H1 (B §2) | `FROM EYE EXAMS TO EVERYDAY STYLE.` | `WhiteSection` h1 (masked 2-line reveal) — verified in DOM + screenshots |
| Hero CTA (B §2, C §1) | `BOOK YOUR EYE EXAM TODAY!` → Deen URL, `_blank` | Top band (`#book-exam-top`) + bottom band (`#book-exam-bottom`) + Visit card CTA + header pill + menu links |
| ABOUT US + 3 paras (B §2) | Burlington / since 2018 intact, byte-verbatim | `AboutSection` (`videoMeta.paragraphs`) — DOM-verified prefixes match B |
| Featured brands H2 + 8 names in order (B §9) | `OUR FEATURED EYEWEAR BRANDS`, Maui Jim…Versace | NEW `FeaturedBrandsSection` (persistent H2 + 8 unlinked ledger rows, live order) + logos in flanking film rails / mobile strip / film B6 (unlinked as live) |
| Reviews header + agg (B §7) | `WHAT OUR CUSTOMERS SAY`, `Real reviews from real customers`, `4.9 (208 reviews)` | `ReviewsSection` (animated counters on the 2 real numbers only) |
| All 6 reviews verbatim + initials (B §7) | SW/H/NZ/AH/LL/EP texts incl. `Honsa` spelling | `ReviewsSection` (1 featured + 5, no invented names/stars/dates) |
| Services summary (B §3) | 4 names + 2 verbatim descriptions | `ServicesSection` ledger 01–04 + intro lede + `Services →` → `/services` |
| Lenses, all 7 + 3 descriptions (B §4) | Varilux…Xperio w/ ®/™ | `LensesSection` (7 rows, shorts verbatim) + `Read more →` → `/services` |
| Insurance heading + 8 names (B §5) | `We Accept Most Major Insurance Plans`, Sun Life…Empire Life | NEW `InsuranceSection` (persistent H2 + 8 unlinked ledger rows, live order; NO direct-billing wording per §6c.7) + logos in right rail / film B7 |
| Visit/map/hours NEW store (brief §2) | Vodden address, 905-497-0227, eyeshine2020@, hours | `WhiteSection` ledger + `VisitSection` ledger + `MapEmbed` (Vodden embed + directions URLs verified) + footer store block |
| GET DIRECTIONS (C §1, rebuilt for new store) | directions link, `_blank` | `MapEmbed` in white act + Visit (`Get directions →`, href verified Vodden) |
| Services/Contact onward links (task) | — | `Services →` → `/services`; NEW `Contact →` → `/contact` in Visit |
| Nav HOME·SERVICES·CONTACT; footer Refund/Privacy/Terms (B §1, C §1) | — | Header menu + footer `Terms and Policies` expander (hrefs verified) |
| Business name + logo (B §must) | `EyeQ Vision Care` | Header brand + white-act logo + footer |

## 3. Intentionally omitted (NOT bugs)

1. **Old-store video** (`PLAY VIDEO` → Shopify CDN MP4, B §2 / C §1): shows the
   old Burlington interior — REMOVED from `AboutSection` per task instruction
   (was rendered; now heading + 3 verbatim paras only, no poster/player).
2. **Product row** (4 Persol cards → `/products/*`, B §2): live content but a
   catalog/product listing — forbidden by brief §6d (no catalog/frames/product
   pages). Zero `/products/` links site-wide (probed).
3. **Old-store contact block** (B §8: Burlington Centre address, (905)333-3931,
   info@eyeq2020.ca, fax): never presented; replaced everywhere by brief §2
   new-store info. No `eyeq2020` / `Guelph` strings in render.
4. **Shopify chrome**: Account, Cart (CSS-hidden on live), predictive search,
   `Powered by Shopify`, announcement bar (none on live), social icons (empty
   on live — none added), News blog (empty), promos (none on live), hours on
   live (none published — new-store hours shown per §2 only).

## 4. Verification (Playwright, looked at every screenshot)

- Server: `npm run dev -- --port 5714 --strictPort` (stopped after QA).
- Captures: `HOME-desktop-*.png` (1512×860) + `HOME-mobile-*.png` (390×844),
  11 stops each + full-page; screenshots opened and inspected (not just
  compiled). No horizontal overflow either viewport
  (`scrollWidth == innerWidth`); no overlap/clipping; brands/insurance are
  clean 2-col ledgers desktop → single column mobile; map renders Vodden St.
- Console: 0 errors desktop; mobile run showed 2 Google-Maps-iframe-internal
  CORS/resource notes (third-party map JS, pre-existing `StoreBits` lazy
  embed, unrelated to this change).
- `npx tsc -b` clean during work; `npm run build` final: PASS (see below).

## 5. Files edited (owned only)

- `src/components/dom/BookingCTA.tsx` — `size="band"` prop + `BookExamBand`.
- `src/components/dom/WhiteSection.tsx` — top band (replaces standard CTA).
- `src/components/dom/Sections.tsx` — video removed; `FeaturedBrandsSection`,
  `InsuranceSection`, `Contact →` link, bottom band in `HomeSections`.
- `src/components/dom/index.ts` — export `BookExamBand`,
  `FeaturedBrandsSection`, `InsuranceSection`.
- `src/components/dom/lane-e.css` — `.eyeq-bookband`, `.eyeq-cta--band`,
  brand/insurance ledgers, visit contact link, nowrap fix, `overflow-x: clip`
  guard on `.eyeq-white`.

Performance: no new fonts/images/JS libs; band + ledgers animate
transform/opacity only; maps stay `loading="lazy"`; rails/photos untouched.

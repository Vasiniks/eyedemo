# PHASE 4 PLAN — SITE / IA (information architecture, pages, UX)

- Lane: SITE. Planning only — no scaffolding, no packages, no source code.
- Sources read in full: `docs/00-BRIEF.md` (incl. §6b/§6c), `docs/research/00-PHASE2-SYNTHESIS.md`,
  `A-website-audit.md`, `B-content-inventory.md` (copy authority), `C-link-inventory.md` (destination authority),
  `E-visual-references.md` (§7 narrative, motion tokens, anti-patterns).
- Specialists consulted (read-only memos, synthesized — not pasted): `interaction-designer`, `responsive-specialist`.
- Skills loaded: `awwwards-playbook`, `cinematic-scroll-storytelling`, `no-ai-design-slop`, `marquee-loop`, `masked-reveal`.
- Rules honoured: every business string is quoted verbatim from B or brief §2; anything needed-but-missing is
  marked `[COPY NEEDED]`. No invented services, claims, reviews, promos, prices, links. Motion serves the
  "optician's dark room" narrative (brief §5, E §7).

---

## 1. Sitemap

Keep labels uppercase `HOME` `SERVICES` `CONTACT` (B §1). No new page that would need invented content —
so: no blog (live `/blogs/news` is heading-only, B §0), no promos page (none exist, B §6), no account/cart
routes (see §3.4).

| Route | Purpose | Sections in order | Content source | CTAs → exact destinations (C) |
|---|---|---|---|---|
| `/` Home | Convert (book exam) + prove (brands, lenses, reviews, insurance) + ground (visit facts). The only cinematic page | Film (dark act ~80% → white act ~20%, §2.1) → rails bridge (§2.2) → rest of homepage (§2.3) → footer | B §2 (H1, CTA, about, brands, reviews), B §4 (7 lens names for info beat), B §5 (insurance heading; full grid lives on Services), brief §2 (new-store facts) | `BOOK YOUR EYE EXAM TODAY!` → `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` (`target="_blank" rel="noopener"`, C §1). `Get directions` → rebuilt `https://www.google.com/maps/dir/?api=1&destination=2-227+Vodden+St+East%2C+Brampton%2C+ON` (`_blank`). `tel:+19054970227`. `mailto:eyeshine2020@gmail.com` |
| `/services` | Full clinical + optics + insurance proof | 1. `Services` (H1 verbatim) 2. 3 intro paras verbatim 3. `Accurate Prescription Fittings` + one-liner 4. `Comprehensive Eye Exams` + description + `Book your Eye Exam today` button 5. `Our Popular High-Definition Lenses` (4 names) 6. Essilor slideshow (3 slides + verbatim descriptions) 7. `We Accept Most Major Insurance Plans` + 8 logos 8. Visit strip 9. Footer | B §3 (all service copy), B §4 (all 7 names + 3 descriptions), B §5 (heading + 8 in order), brief §2 (visit strip) | `Book your Eye Exam today` → same scheduler URL (same-tab, matching live Services behaviour, C §2). Lens/insurance images unlinked (C §2) |
| `/contact` | Visit facts. No form — none exists on live (C §3); do not invent one | 1. `Contact` 2. `PHONE` → new number 3. `EMAIL` → new email 4. `ADDRESS` → new address 5. `HOURS` → brief §2 hours 6. Map embed + `GET DIRECTIONS` 7. Footer. No fax row (old fax is OLD-STORE data, B §8) | Labels from B §8 (structure), values from brief §2. Map rebuilt for new address (C §5 pattern, new query) | `tel:+19054970227` (fixes malformed `tel:(905)3333931`, C §10). `mailto:eyeshine2020@gmail.com`. Directions → rebuilt URL above. Embed `https://maps.google.com/maps?q=2-227+Vodden+St+East%2C+Brampton%2C+ON&t=m&z=15&output=embed&iwloc=near` |
| `/frames` + `/frames/<handle>` | Keep the 22-product catalog reachable, not featured (synthesis §1). No nav slot; linked from footer + Services eyewear mention | Index: filter `All / SUN / OPTICAL` (real taxonomy: 16 SUN + 5 OPTICAL + 1 untyped Prada, B §10) + search box; cards show model name + vendor + type. Detail: gallery, verbatim description where present (e.g. `RB3025 Aviator`, `PO0649 Original`), HIGHLIGHTS where present | B §10 (names, vendors, types). Homepage 4-card row named `Persol PO0649`, `Persol PO2803S`, `Persol PO3210S`, `Persol PO3272S` (B §2) | No checkout (no real flow exists; cart icon CSS-hidden live, C §4). Detail CTA = `Call 905-497-0227` (`tel:+19054970227`) + `Book an eye exam` (scheduler). `[COPY NEEDED: price/availability policy — live shows $0.00 CAD placeholders (B §10); do NOT render $0.00 as a price. Pending client decision: hide price + "In-store only"]` |
| `/policies/refund-policy`, `/policies/privacy-policy`, `/policies/terms-of-service` | Legal preservation; via footer "Terms and Policies" (matches live, C §1) | Body as today; replace store strings (`info@eyeq2020.ca`, Burlington address, `2434804 Ontario Inc., C1A-777 Guelph Line…`) | B §11, B §8 (record-only) | Inline contacts → new values once supplied. `[COPY NEEDED: updated legal entity + returns contact]` |
| `/search?q=` | Preserve working predictive search (C Key finding 6). Client-side filter over the 22-product index + section anchors (lens names B §4, services, visit) | Result → `/frames/<handle>` or page anchor | B §10 + B §4 | — |

Dropped with reason: `/blogs/news` (empty heading, B §0 — shipping it repeats A weakness #3); `/cart` (hidden theme-wide, C §4); Shopify account sheet (signed-out sheet, no observed navigation, C §1; static rebuild has no customer system — see §3.4); old-store block/map/fax, `Powered by Shopify`.

Redirects (zero broken links today, C §7 — keep it that way): `/pages/services` → `/services` (301),
`/pages/contact` → `/contact` (301), `/collections/ray-ban-sun|persol|prada` → `/frames` filtered (301),
`/products/*` → `/frames/<handle>` (301), `/policies/*` unchanged.

---

## 2. Homepage full structure

### 2.1 Intro film — dark ~80% → white ~20% (pinned, `/` only)

Total pinned length: ~1000vh desktop (dark ~800vh + white ~200vh), ~800vh tablet, ~700vh phone (§5).
One idea per viewport (E-11 chapter rule). Scrub `ease: "none"`, `scrub: 1.0–1.1`, `anticipatePin: 1`
(cinematic-scroll-storytelling + E motion tokens). Persistent film chrome per §3 (logo + Book pill + menu +
skip + 2px progress bar).

| # | Beat (weight, brief §5) | Staging (MOTION lane owns timing) | On-screen text — verbatim sources only |
|---|---|---|---|
| 0 | Preloader → curtain (time-based, ≤1.8s to readable hero; playbook gate) | Counter 0→100, `clip-path` curtain lift, graphite shell framed behind | Brand mark only (official logo, white variant §6c.2). No headline over first frame (JMM restraint, E-01) |
| 1 | Case reveal (10) | Macro graphite shell, raking light, slow drift | Micro-cap eyebrow only. `[COPY NEEDED: ≤4-word chapter eyebrow; must NOT be VISION/FOCUS/CLARITY (brief §7 ban)]` |
| 2 | Open / velvet (15) | One-piece flap, elastic arc; velvet via grazing rim. Iris `clip-path: circle()` expansion (E-29) | No business copy |
| 3 | Emerge (15) | Folded dark glasses rise from case | No business copy |
| 4 | Unfold (15) | Hinge-damped unfold → hover/rotate | No business copy |
| 5 | Info + camera (15) | Slow orbit; EyeQ facts appear subtly around glasses | The Wave-2-adjacent "real EyeQ content group" (brief §5) = **7 Essilor lens names verbatim** (brief §6c.1, B §4): `Varilux® Physio Extensee™` · `Distinctive® Superior` · `Distinctive® Enhanced` · `Distinctive® SV Lenses` · `Essilor Stellest® 2.0 Lenses` · `Transitions® Lenses` · `Xperio® Lenses` (tracked micro-cap list, unlinked, ® intact) + H1 `FROM EYE EXAMS TO EVERYDAY STYLE.` (B §2) as the film's single display moment. No long descriptions here |
| 6 | Wave 1 (15) | 8 eyewear brands fly in from extreme depth (hyperspace-feel z-flight, original), accumulate, recede | Micro-cap `OUR FEATURED EYEWEAR BRANDS` (B §2 H2 verbatim). Logos single-colour light (`assets/web/brands-light/`, §6c.2), unlinked (C §5), in order: Maui Jim, Ray-Ban, Prada, Miu Miu, Persol, Oakley, Tiffany & Co., Versace |
| 7 | Wave 2 (7) | 8 insurer logos, same mechanic, shorter | Micro-cap `We Accept Most Major Insurance Plans` (B §5 verbatim). Logos `assets/web/insurance-light/`, unlinked (C §6), in order: Sun Life, Medavie Blue Cross, Manulife, GreenShield, Canada Life, Desjardins, IA Financial Group, Empire Life |
| 8 | Lens approach (5) | Dolly to one lens; world softens (immersion blend, E-28: opacity + scale, continuous not a cut) | No copy |
| 9 | Lens entry → white (3) | Pass THROUGH lens; iris contracts to white (E-29 invert) → paper-white practical act | H1 `FROM EYE EXAMS TO EVERYDAY STYLE.` + `BOOK YOUR EYE EXAM TODAY!` (scheduler, new tab). Booking moment is in daylight: instant, no theatre |

White practical act (~20% of intro scroll, still pinned): address `2-227 Vodden St East, Brampton, ON` ·
phone `905-497-0227` · hours `Mon–Fri 11:00 am–6:30 pm · Sat 11:00 am–5:00 pm · Sun 11:00 am–4:00 pm`
(all brief §2) + `BOOK YOUR EYE EXAM TODAY!` + `Get directions`. A visitor who skips everything else
still leaves with facts.

### 2.2 Opposing vertical brand rails (film → homepage bridge)

Immediately after unpin: two vertical opposing-direction film rails flanking the content column (brief §5;
mechanic = E-30 duplicated track rotated 90°, E-32 principle-only; marquee-loop + masked-reveal skills).
- Desktop ≥1024: 2 rails × 96px, full-height sticky (`top: 0; height: 100vh`), left scrolls up / right scrolls
  down, linear infinite loop, duplicated logo columns, edge fade masks, 100% opacity.
- Left rail = 8 eyewear brands (light single-colour, B §9 order, unlinked); right rail = 8 insurers (B §5 order, unlinked).
- 768px: 2 × 64px at 60% opacity. Phone: single 48px left rail during film → one 68px horizontal marquee
  after the white act (§5).
- Pause on hover/focus + visible pause control (ic! berlin pattern, E-06; §6). Velocity-skew by scroll
  (MOTION lane); rails are decorative echo — accessible content lives in real lists (§6).

### 2.3 Rest of homepage (order + why)

One focal point per viewport (E anti-pattern #9). Booking re-appears at §§1, 5 below + header pill.

| # | Section | Contents (verbatim) | Why here |
|---|---|---|---|
| R1 | About `ABOUT US` + video | Self-hosted MP4 (B §2 URL), click-to-play `PLAY VIDEO` button, poster, muted/loop/controls + 3 paras verbatim (B §2: `Welcome to EyeQ Vision Care. Since opening our doors in 2018, we have proudly served the Burlington, Ontario community…` + para 2 + para 3). `[COPY NEEDED: one client-approved Brampton-framing sentence alongside — do NOT rewrite the 3 paras; "Burlington" strings are verbatim-preserved and flagged]` | Trust after spectacle: dark room opens into the real practice |
| R2 | Services précis (3 items) | `Comprehensive Eye Exams` + `A complete assessment of your vision and eye health, including prescription testing and screening for common eye conditions.` · `Accurate Prescription Fittings` + `Accurate prescription fitting to ensure clear, comfortable vision tailored to your needs.` · `children's eye exams` + `contact lens fittings` (names from B §3; only the two quoted descriptions exist — the other two get names only, nothing invented) → `Services` → `/services` | Clinical substance before commerce; full proof on Services page |
| R3 | Lenses `Our Popular High-Definition Lenses` (B §4) | 7 names; the 3 with descriptions (Stellest / Transitions / Xperio) trimmed to first sentence + `Read more → /services` (trimming is presentation; full verbatim text on Services) | Optics story pays off the lens pass-through |
| R4 | Reviews `WHAT OUR CUSTOMERS SAY` + `Real reviews from real customers` + `4.9` `(208 reviews)` (B §2) | All 6 texts verbatim with initials exactly as shown (`SW`, `H`, `NZ`, `AH`, `LL`, `EP` — incl. `Honsa` spelling, B §7). Static cards, no carousel. Aggregate only — no per-card stars invented (B §7: widget shows none). No "write a review" CTA (none exists, C) | Honest proof band (anti fake-proof P0); static = credible |
| R5 | Visit `VISIT OUR STORE` (live H3 pattern, A §homepage-6) | New address + `GET DIRECTIONS` (rebuilt URL) + map embed (rebuilt query, click-to-activate overlay per C §5) + phone + email + hours (brief §2) + `BOOK YOUR EYE EXAM TODAY!` repeated | Practical close: one click to book, directions, or call |
| R6 | Footer | Store block + `Terms and Policies` expander (`Refund policy`, `Privacy policy`, `Terms of service`) + `© <year> EyeQ Vision Care` + `Browse frames` → `/frames` + `Replay film` (§4). No social icons (none exist, C §7). No `Powered by Shopify` | Wayfinding + legal + film replay |

NOT on homepage: catalog product cards (stay in `/frames`, not featured); insurance logo grid (film Wave 2 +
rails carry the marks; full grid on Services); contact form, promos (do not exist).

---

## 3. Navigation

### 3.1 Header during the film — persistent minimal, never fully hidden

Booking must stay ≤1 click (interaction-designer): transparent over dark → translucent blur
(`backdrop-filter: blur(20px)`, `rgba(5,6,7,.55)` dark / `rgba(255,255,255,.82)` white) after 120px.
Left: official logo (white variant dark act / black white act — shape-identical, synthesis §7 client-confirm).
Right: `Book an exam` pill (scheduler URL, new tab) + menu button. 64px desktop / 56px mobile.
Hide-on-scroll-down past 120px, reveal on scroll-up or act change; Book pill never unmounts.
Press feedback scale .97, 160ms ease-out. Native cursor only.
`Skip film ↓` text-button: bottom-centre above fold, sticky during dark act only, first tab stop after
`Skip to content`, shortcut `S`, fades 200ms on use → jumps to white-act anchor. Thin 2px film progress bar.

### 3.2 Menu — full-screen overlay, not drawer

`Menu` button (44×44 hit) → `100vw × 100dvh` overlay, crossfade 250ms ease-out, scale .97.
Items: `Home → /` · `Services → /services` · `Contact → /contact` · `Browse frames → /frames` ·
`Search` (initial focus; filters 22-product index + anchors) · `Book an eye exam` (scheduler, new tab) +
footer row: policies trio + `tel:+19054970227` + address + short hours. Mobile adds bottom-sticky 56px BOOK bar.
Focus trap, `ESC` closes and restores focus, `aria-modal` dialog, background scroll lock. No submenus (live has none, C §4).

### 3.3 Footer

Store block + address/directions/phone/email/hours → `Terms and Policies` expander (Refund/Privacy/Terms,
matching live C §1) → `© <year> EyeQ Vision Care` → `Browse frames`, `Replay film`, `Back to top`.
Map embed lives in §2.3-R5, not repeated. White-on-black footer ≥7:1; black-on-white ≥4.5:1.

### 3.4 Search / account / cart (brief: keep reachable "if meaningful")

- **Search: keep** (`/search?q=` + header/menu entry). Works on live (C Key finding 6); genuinely useful over
  22 products + lens names. Client-side filter, instant list, full keyboard, empty state
  `[COPY NEEDED: e.g. "No frames match — call 905-497-0227" + Clear — phone number is real, brief §2]`.
- **Account: drop.** Live account is a signed-out Shopify sheet with no observed navigation (C §1); static
  rebuild has no customer system. A dead "Sign in" manufactures function (fake-proof P0).
  `[COPY NEEDED only if client operates accounts elsewhere — otherwise omit]`.
- **Cart: drop.** CSS-hidden theme-wide; all prices `$0.00` placeholders (C §4, B §10). A buy flow would be
  invented commerce. Catalog offers call + book instead.

---

## 4. Page transitions + preloader (first visit vs return)

- Route transitions: View-Transition crossfade 200ms (opacity only, no directional slide; Home/Services/Contact
  equivalent). Only shared-morph: catalog thumb → detail. Film never replays on route change — Services/Contact
  mount at content (frequent destinations stay instant per restraint law, E §motion-7).
- Preloader (first visit): brand mark fade 600ms + counter 0→100 ≤1.1s (`power2.inOut`), curtain lift
  `clip-path: inset(0 0 100% 0)` 900ms `power4.inOut`, hero readable ≤1.8s (playbook gate). Poster + skeleton
  shimmer behind video/GLB; loader exits even if media lags (cinematic-scroll-storytelling QA).
- Return (same session): `sessionStorage["eyeq-film-seen"]=1` set at first white-act arrival → land at white-act
  anchor with 800ms fade, film skipped. Cross-session: `localStorage` variant shortens (not fully skips) to a
  ~200vh abridged pass — the film is the brand premiere. `Replay film` (hero-adjacent + footer) clears the flag.
  Deep links (`/services`, `/frames/…`) never force the film. Reduced-motion / no-JS: no preloader, no pin (§6).

---

## 5. Mobile (390×844 baseline; breakpoints 1440 / 1024 / 768 / 720 hamburger / 430)

Responsive-specialist synthesis, concrete numbers:

- Film on phones: **same 9 beats, reframed not cut.** Canvas sticky 60vh top + copy bottom-sheet (margin 20px,
  bottom-40% scrim `rgba(5,6,7,.55)` for ≥4.5:1). Camera FOV 55 (vs 40 desktop), distance 4.4m (vs 3.2m),
  dolly+rise only — no full orbit; lens clear-radius 200px never covered by copy. Pinned length 700vh
  (560 dark + 140 white). **Lenis OFF on touch** — native scroll + `scrub: 1.0, anticipatePin: 1`; kill
  hyperspace streaks; DPR ≤1.5; bloom/transmission/chromatic OFF; env 256px; GLB <150k tris or poster fallback.
- Rails: single 48px left rail during film (right dropped) → one 68px horizontal marquee after white act.
  Pause control retained at 44px.
- Type/touch: H1 `clamp(2.25rem, 9.2vw+1rem, 3rem)` → 36px/36 @390; H2 22px; body 15px/24. Targets ≥44px:
  hamburger/close 44×44 (padding-expanded), CTA keeps 190×71, `GET DIRECTIONS` full-width 180×48, sticky
  bottom 56px BOOK bar on ≤600 (Visit context; no global sticky bar — it would cheapen the film, E anti-#2).
  Brand cells unlinked → no hover needed; video tap-to-play 44px; map tap → directions URL.
- Map/hours/booking stack single column; map 390×220 above hours. Menu → full-bleed `100vw×100dvh` (no sliver),
  48px rows. Inline nav ≥768; hamburger below **720px** (fixes the 600–768 gap).

---

## 6. Accessibility

- Reduced motion (`prefers-reduced-motion: reduce`): film → **9 static stills (one per beat) with the same
  captions**, no pin/scrub/smooth-scroll; rails → static 2-col logo grid (8+8, labelled); waves → staggered
  fade ≤200ms or static; preloader removed; reveals resolve to final states (opacity ≤200ms max). Video never autoplays.
- Keyboard: `Skip to content` + `Skip film` first in order; film canvas `aria-hidden="true"`, never focusable;
  each beat caption is a real `<section>` with heading so the story survives without canvas; menu traps focus,
  ESC closes, focus restored; `S` skips film; all CTAs native `<a>`/`<button>`; focus-visible 2px `#D9A441`
  offset 2px (visible on black and white).
- Screen-reader narrative (film text alternative): sr-only synopsis per beat + real lists — 7 Essilor names as
  `<ul>`, Wave 1 / Wave 2 as `<ul aria-label="Featured eyewear brands">` / `<ul aria-label="Accepted insurance plans">`
  (text names; logo `alt` carries names too — fixes live empty-alts, A §weakness-7). Video: description track
  `[COPY NEEDED: 1-sentence video description]`; map iframe `title="Map — EyeQ Vision Care, 2-227 Vodden St East, Brampton"`.
- Contrast: warm-bone `#F5F0E8` ink on dark (ART owns final hex; IA constraint: scrims mandatory under overlay
  copy, §5); `#0A0B0C` on `#FFFFFF` white act; micro-caps never below 11px and never the sole carrier of facts
  (facts repeat at body size in white act). Review `#A42325` accents (A) only where adjacent text still passes.
- Sound: no autoplay with sound anywhere; video controls include mute/pause (E-06 pattern).

---

## 7. Content checklist — synthesis §1 preservation inventory → location

| # | Preserved item (synthesis §1 + B ref) | Location in new site |
|---|---|---|
| 1 | Name `EyeQ Vision Care` + official logo (shape-untouched; white/black act variants client-confirm, synthesis §7) | Header (both acts), menu, footer, preloader mark |
| 2 | Nav `HOME · SERVICES · CONTACT` + search + policies | Header inline ≥768 / overlay menu + footer expander; `/search?q=` |
| 3 | 3 services + 2 verbatim block descriptions (B §3) | Home R2 (précis) + `/services` full verbatim |
| 4 | 7 Essilor lenses + 3 verbatim descriptions (B §4, ®/™ intact) | Film beat 5 (names) + Home R3 (names + first-sentence) + `/services` (full) |
| 5 | Insurance heading + 8 insurers in order (B §5), unlinked (C §6) | Film Wave 2 + right rail + `/services` full grid; no "direct billing" claim (UNVERIFIED, synthesis §3) |
| 6 | Reviews `4.9` `(208 reviews)` + 6 verbatim texts, initials as shown (B §7) | Home R4, all 6 + aggregate, static cards |
| 7 | 8 brands in order, unlinked (B §9, C §5) + Gucci name-drop (B §3 para 2 verbatim) | Film Wave 1 + left rail + `OUR FEATURED EYEWEAR BRANDS` cap; Gucci only inside verbatim Services sentence |
| 8 | About 3 paras verbatim incl. `Since opening our doors in 2018… Burlington… Canadian privately owned…` (B §2) | Home R1 verbatim + `[COPY NEEDED: Brampton-framing sentence, client-approved]` |
| 9 | H1 `FROM EYE EXAMS TO EVERYDAY STYLE.` + `BOOK YOUR EYE EXAM TODAY!` → scheduler URL (B §2, C Key finding 1) | Film beats 5+9, white act, Home R5, header pill, menu, Services, Contact-adjacent strip |
| 10 | Booking URL `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` (exact http) | All booking CTAs (homepage variants `_blank`; Services same-tab per live). Location-code staleness carried as `[CLIENT CONFIRM: Brampton code?]` (synthesis §7) |
| 11 | Self-hosted MP4 + `PLAY VIDEO` (B §2) | Home R1 only, click-to-play |
| 12 | Catalog 22 products reachable, not featured (B §10) | `/frames` + `/frames/<handle>`, footer/Services-linked; no prices, no cart |
| 13 | Policies trio | Footer expander + 3 routes; `[COPY NEEDED: Brampton legal/returns contact]` |
| 14 | New-store facts (brief §2) replacing OLD store everywhere (B §8 record-only) | White act, Home R5, `/contact`, footer, menu ledger, search empty-state |
| 15 | Dropped with reason: old-store block/map/fax, empty `News`, `Powered by Shopify`, hidden cart, account sheet, promos/socials/form (nonexistent — not invented) | Research record-only; 301s per §1; rationale §1 + §3.4 |

`[COPY NEEDED]` rollup (nothing else may be invented): (a) film chapter eyebrows ≤4 words, no hype words;
(b) Brampton-framing sentence beside verbatim About; (c) catalog price/availability policy; (d) exact new Maps
destination string/place ID; (e) Brampton legal entity + returns contact (+fax only if one exists);
(f) 1-sentence video description; (g) search empty-state wording.

---

*Interfaces: MOTION owns beat timings/eases; ART owns type/colour/material; ARCH owns routes/build/search-index.
Coordinator merges. IA constraints (single H1, unlinked logos, no invented copy, reachable catalog, skip-film,
reduced-motion parity) are non-negotiable.*

PHASE4-PLAN-SITE-DONE
- Sitemap preserves Home/Services/Contact + policies + reachable `/frames` catalog (22), drops hidden cart/account and empty News, invents nothing.
- Homepage = 9-beat film (80% dark → lens portal → 20% white practical) → opposing brand rails → About/Services/Lenses/Reviews/Visit in conversion order.
- Persistent minimal header (logo + Book pill + menu) with skip-film control; full-screen menu; footer with policies + replay.
- Return visitors skip the film via sessionStorage flag with replay affordance; transitions are 200ms crossfades.
- Mobile keeps all beats reframed and shortened (700vh, single rail → horizontal marquee, native scroll); full reduced-motion/keyboard/SR parity specified.

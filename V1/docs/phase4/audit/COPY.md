# COPY AUDIT — Phase 4 (brief §6d: nothing that is not on the live site)

- Date (UTC): 2026-09-28 · Auditor: read-only helper (no src/ edits made)
- Sources of truth: `docs/00-BRIEF.md` (§2 new-store info, §6c decisions, §6d CLIENT RULE) + `docs/research/B-content-inventory.md` (verbatim live-site record, fetched 2026-09-27)
- Scope grepped: `src/data/*.json` (7 files) + `src/data/index.ts`, `src/components/dom/**`, `src/routes/**` (incl. `parts/*`), `src/app/router.tsx`, `src/motion/chapters.ts`
- Verdicts: **VERBATIM** (byte-match to inventory) · **NEW-STORE** (brief §2 info, allowed addition) · **DRAFT(hidden?)** (draft:true, must stay unrendered unless `SHOW_DRAFT_COPY=true`) · **NOT-ON-LIVE-SITE** (violates §6d unless dev-only/chrome — see P0 list)
- Default build state: `SHOW_DRAFT_COPY` defaults **false** (`src/data/index.ts:59-60`, env `VITE_SHOW_DRAFT_COPY`); DRAFT gating verified in `ChapterOverlay.tsx:25-38` (`DraftTag` returns null + `visible()` gate) and `Sections.tsx:121,133,147` (ternaries + `SHOW_DRAFT_COPY &&`). So all DRAFT lines below are **hidden in the default build — PASS**.

## 1. src/data/*.json — string table

### store.json (all NEW-STORE per brief §2, or VERBATIM booking)
| file:line | string | verdict |
|---|---|---|
| store.json:3 | `EyeQ Vision Care` | VERBATIM (B §11 logo/header text) |
| store.json:4-5 | `905-497-0227` / `tel:+19054970227` | NEW-STORE (§2 phone) |
| store.json:6-7 | `eyeshine2020@gmail.com` / `mailto:…` | NEW-STORE (§2 email) |
| store.json:9-11 | `2-227 Vodden St East` / `Brampton, ON` / full | NEW-STORE (§2 address) |
| store.json:14-18 | `Mon–Fri 11:00 am–6:30 pm · Sat 11:00 am–5:00 pm · Sun 11:00 am–4:00 pm` | NEW-STORE (§2 hours; live site publishes NO hours, B §8) |
| store.json:20-21 | `BOOK YOUR EYE EXAM TODAY!` / `Book your Eye Exam today` | VERBATIM (B §2 hero CTA + §3 services button) |
| store.json:22 | `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` | VERBATIM (B §11; http kept exact per §6c.3 — do NOT "fix" to https) |
| store.json:27 | `Map — EyeQ Vision Care, 2-227 Vodden St East, Brampton` (iframe title) | NEW-STORE (map rebuilt for new address) |

### brands.json (all VERBATIM, B §9, DOM order kept)
| file:line | string | verdict |
|---|---|---|
| brands.json:3 | `OUR FEATURED EYEWEAR BRANDS` | VERBATIM (B §2 H2) |
| brands.json:5-12 | `Maui Jim`, `Ray-Ban`, `Prada`, `Miu Miu`, `Persol`, `Oakley`, `Tiffany & Co.`, `Versace` (name+alt) | VERBATIM, order intact (B §9). Unlinked — matches live |

### insurers.json (all VERBATIM, B §5, display order kept)
| file:line | string | verdict |
|---|---|---|
| insurers.json:3-4 | `We Accept Most Major Insurance Plans` / `WE ACCEPT MOST MAJOR INSURANCE PLANS` | VERBATIM (B §5; heading + caps alt-render) |
| insurers.json:5 | `Accepted insurance plans` (aria-label) | chrome (a11y name for the strip; not live copy — keep) |
| insurers.json:7-14 | `Sun Life`, `Medavie Blue Cross`, `Manulife`, `GreenShield`, `Canada Life`, `Desjardins`, `IA Financial Group`, `Empire Life` | VERBATIM, order intact. No "direct billing" asserted — PASS (§6c.7) |

### lenses.json (all VERBATIM, B §4)
| file:line | string | verdict |
|---|---|---|
| lenses.json:3 | `Our Popular High-Definition Lenses` | VERBATIM (B §4 carousel heading) |
| lenses.json:6-9 | `Varilux® Physio Extensee™`, `Distinctive® Superior`, `Distinctive® Enhanced`, `Distinctive® SV Lenses` (titles only, no descriptions) | VERBATIM (titles-only state preserved — do NOT invent descriptions) |
| lenses.json:11-23 | `Essilor Stellest® 2.0 Lenses`, `Transitions® Lenses`, `Xperio® Lenses` + 3 descriptions + `short` truncations | VERBATIM descriptions (B §4); `short` fields are mechanical truncations for card layout, not new claims |

### services.json (all VERBATIM, B §3 — incl. allowed Burlington/Gucci verbatim)
| file:line | string | verdict |
|---|---|---|
| services.json:3 | `Services` | VERBATIM (B §3 H1) |
| services.json:5-7 | 3 intro paras (`…optometrist in Burlington? At Eye Q Optical…`, `…Gucci, Prada, and Ray-Ban…`, `…visit our Burlington store…`) | VERBATIM incl. "Eye Q Optical" spelling + Burlington + Gucci name-drop (preserved as-is; old-store presentation rule does NOT apply to verbatim body copy per §6c.6 pattern) |
| services.json:11-16 | `Comprehensive Eye Exams` + description; `Accurate Prescription Fittings` + description | VERBATIM (B §3 blocks) |
| services.json:18-19 | `children's eye exams`, `contact lens fittings` (names only) | VERBATIM (distilled from B §3 paras; no descriptions on live site — none invented) |

### reviews.json (all VERBATIM, B §7)
| file:line | string | verdict |
|---|---|---|
| reviews.json:3-6 | `WHAT OUR CUSTOMERS SAY` / `Real reviews from real customers` / `4.9` / `(208 reviews)` | VERBATIM (B §7; note B §2 records caps variant `WHAT OUR CUSTOMERS SAY` — consistent) |
| reviews.json:8-13 | 6 review texts + initials `SW/H/NZ/AH/LL/EP` (incl. `Honsa` spelling) | VERBATIM. No invented names/stars/dates — PASS |

### chapters.json (film beats — MIXED: 1 verbatim anchor + 13 DRAFT lines)
| file:line | string | verdict |
|---|---|---|
| chapters.json:7-8 | `01 — Dark room` / `Instruments kept in darkness.` (D1/D2) | DRAFT(hidden) — draft:true, gated |
| chapters.json:13-14 | `02 — Velvet` / `Cut for one instrument.` (D3/D4) | DRAFT(hidden) |
| chapters.json:19 | `03 — Folded` (D5) | DRAFT(hidden) |
| chapters.json:25-26 | `04 — Rimless, black metal` / `Hinges, damped by hand.` (D6/D7) | DRAFT(hidden) |
| chapters.json:31-32 | `05 — Lenses` / `Glass with a prescription.` (D8/D9) | DRAFT(hidden); `verbatimAlternative: Our Popular High-Definition Lenses` is the live heading to swap in |
| chapters.json:39 | `Carried in store — eight houses` (D10) | DRAFT(hidden) |
| chapters.json:47 | `We Accept Most Major Insurance Plans` | VERBATIM, draft:false — renders in B7. PASS |
| chapters.json:48 | `Bring your card to your visit.` (D11) | DRAFT(hidden) — note: borderline-direct-billing-adjacent; keep hidden pending approval |
| chapters.json:54 | `Visit us at our new Brampton store.` (D13) | DRAFT(hidden); gated in Sections.tsx:147 |
| chapters.json:55 | `Interior view of the EyeQ practice and eyewear displays.` (D15) | DRAFT(hidden); video description, gated Sections.tsx:121,133 |
| chapters.json:57-63 | `ABOUT US` / `PLAY VIDEO` / 3 about paras (Burlington/since-2018 intact) | VERBATIM (B §2). Burlington here is explicitly allowed (§6c.6) |

## 2. src/components/dom/** — string table

### Header.tsx
| file:line | string | verdict |
|---|---|---|
| Header.tsx:87 | aria-label `EyeQ Vision Care — home` | chrome (a11y; live logo alt is `EyeQ Vision Care - Home` — close enough, keep) |
| Header.tsx:102 | `Book an exam →` | booking CTA variant — NOT verbatim (live: `BOOK YOUR EYE EXAM TODAY!` / `Book your Eye Exam today`). Recommend aligning to a verbatim label; functional CTA itself is allowed (§6d) |
| Header.tsx:112 | `MENU` | chrome (drawer control; live drawer has no such label — keep as control, not content) |
| Header.tsx:130 | `Skip film ↓` | chrome (film control — keep) |
| Header.tsx:139,155 | `Site menu` / `Close menu` / `✕` | chrome (keep) |
| Header.tsx:160-162 | `Home` / `Services` / `Contact` | VERBATIM (live mobile-drawer casing, B §1) |
| Header.tsx:165 | `Book an eye exam` | same CTA-variant note as :102 |
| Header.tsx:171-173 | `Refund policy` / `Privacy policy` / `Terms of service` | VERBATIM (B §1 footer popover trio) |
| Header.tsx:174-176 | `{store.phone}` / `{store.address.full}` / `{store.hoursInline}` | NEW-STORE |
| Header.tsx:185 | `BOOK AN EYE EXAM` | same CTA-variant note as :102 |

### Footer.tsx
| file:line | string | verdict |
|---|---|---|
| Footer.tsx:30 | `VISIT OUR STORE` | VERBATIM (caps render of live `Visit our store`, B §8) |
| Footer.tsx:36,39,41,43 | `Get directions` / new phone / new email / hours | VERBATIM (`Get directions`, B §8) + NEW-STORE (rest) |
| Footer.tsx:46,48-50 | `Terms and Policies` + policy trio | VERBATIM (B §1 popover name + trio) |
| Footer.tsx:56,59 | `Replay film` / `Back to top` | chrome (film controls — keep) |
| Footer.tsx:63 | `© {year} EyeQ Vision Care` | VERBATIM minus `Powered by Shopify` (omission is correct for rebuild; not a violation) |

### Sections.tsx
| file:line | string | verdict |
|---|---|---|
| Sections.tsx:121-133 | play-button `aria-label` incl. `(description draft)` + `—` literals | chrome; draft text only in label when flag on — PASS |
| Sections.tsx:147-152 | `{aboutBrampton.text}` + `DRAFT` tag | DRAFT(hidden) — gated, tagged. PASS |
| Sections.tsx:157 | `{store.address.full}` + `{store.phone}` | NEW-STORE |
| Sections.tsx:174,184-185 | `Services` / `{s.name}` / `{s.description}` | VERBATIM (data-driven) |
| Sections.tsx:191 | `{servicesIntro[0]}` | VERBATIM |
| Sections.tsx:192 | `Services →` | chrome (read-more link affordance — keep; points to /services which exists) |
| Sections.tsx:215-230 | `{lensHeading}` / `{lens.name}` / `{lens.short}` + `®`/`™` splits | VERBATIM |
| Sections.tsx:235 | `Read more →` | chrome (keep) |
| Sections.tsx:251-269 | `{reviewsHeading}` / `{reviewsSub}` / aggregate / initials / quotes | VERBATIM |
| Sections.tsx:296-328 | `VISIT OUR STORE` / `Visit our store` / `Hours, address and phone` / `Address` / `Phone` / address / hours / booking label / email | VERBATIM labels + NEW-STORE values. PASS |

### Other dom components
| file:line | string | verdict |
|---|---|---|
| BookingCTA.tsx:45-52 | `{label}` (defaults to verbatim homepage label) + `→` | VERBATIM (data-driven) |
| ChapterOverlay.tsx:29-30 | `DRAFT` + `Client-approval draft (…)` / `COPY-DRAFTS.md` fallback | DRAFT machinery (only renders when flag on) — PASS |
| ChapterOverlay.tsx:111-192 | beat eyebrow/display/microLabel/heading/sub + lens/brand/insurer names; sr-only fallbacks `Approaching the lens` / `Passing through the lens into daylight` / `Film chapter {id}` / `High-definition lenses named in this chapter` / `Featured eyewear brands` | data-driven VERBATIM-or-DRAFT via `visible()` gate — PASS; sr-only fallbacks are a11y chrome for canvas beats (keep) |
| StoreBits.tsx:11-31 | `Address` / `Phone` / `Email` / days/time (data-driven) | VERBATIM labels (B §8 PHONE/EMAIL/ADDRESS pattern) + NEW-STORE values |
| StoreBits.tsx:58-76 | `Load map — …` / `◈` / `Load map` / `· loads Google Maps on click` / `Get directions →` | chrome (consent-first map veil) + VERBATIM (`Get directions`) — keep |
| WhiteSection.tsx:22-33 | `EYEQ VISION CARE` / `EyeQ Vision Care` (alt) / `FROM EYE EXAMS TO EVERYDAY STYLE.` | VERBATIM (B §11 + B §2 H1) |
| LogoRails.tsx | brand/insurer names+alts (data-driven); sr-only `Featured eyewear brands` / `Accepted insurance plans` / `Featured brands and accepted insurance plans`; `Play brand rails`/`Pause brand rails`, `▶`/`❚❚`, numerals | VERBATIM names; rest is a11y/controls chrome — keep |
| SkipLinks.tsx:37,40 | `Skip to content` / `Skip film` | chrome — keep |
| Scrims.tsx, dom/index.ts | (no strings) | — |

## 3. src/routes/** + router — string table

### parts/content.ts (mirrors data layer for Lane F routes)
| file:line | string | verdict |
|---|---|---|
| content.ts:19-35 | new phone/email/address/hours + map title | NEW-STORE |
| content.ts:39-55 | `Services`, 3 intro paras, 2 blocks + `Book your Eye Exam today` | VERBATIM (same as services.json) |
| content.ts:61-89 | lens heading, 4 names, 3 slides + descriptions | VERBATIM |
| content.ts:97-112 | insurance heading + 8 names | VERBATIM |
| content.ts:118-121 | `PHONE` / `EMAIL` / `ADDRESS` / `HOURS` | VERBATIM (first three, B §8) + NEW-STORE (`HOURS` label for §2 hours — allowed) |

### parts/chrome.tsx · Services.tsx · Contact.tsx · Policies.tsx
| file:line | string | verdict |
|---|---|---|
| chrome.tsx:13-20 | `Skip to content` / `EyeQ Vision Care — home` (+ logo alt `EyeQ Vision Care`) | chrome + VERBATIM alt — keep |
| chrome.tsx:24-38 | `Primary` / `Home` / `Services` / `Contact` | VERBATIM destinations + labels (B §1; casing matches desktop `HOME…` intent via CSS) |
| chrome.tsx:47 | `Book an exam` | CTA-variant note (same as Header :102) |
| chrome.tsx:61-74 | `EyeQ Vision Care` / address / phone / email / hours + `·` | VERBATIM name + NEW-STORE values |
| chrome.tsx:77-87 | `Terms and Policies` + trio | VERBATIM |
| chrome.tsx:92 | `© {year} EyeQ Vision Care` | VERBATIM-minus-Shopify (correct) |
| chrome.tsx:102-134 | `Visit our store` / address / phone / email / hours / `Book your Eye Exam today` / `Get directions` | VERBATIM + NEW-STORE — PASS |
| Services.tsx:28-139 | service/lens/insurer names + `Services` H1 + intros + `Book your Eye Exam today` + `Prev/Next/Choose lens` + `1 / 3` + `01/02` | VERBATIM content; Prev/Next/Choose-lens/counters are carousel chrome (keep) |
| Contact.tsx:29-89 | `Contact` H1 / PHONE/EMAIL/ADDRESS/HOURS labels / new values / `Map` / `Activate the map`+`Activate map` / `Get directions` / `Call 905-497-0227` + `document.title Contact — EyeQ Vision Care` | VERBATIM structure + NEW-STORE values; map-veil + Call-link are chrome/NEW-STORE presentation (keep). NO form, NO fax row — correct (no form on live site; fax is OLD-STORE) |
| Policies.tsx:34-57 | `Terms and Policies` H1/nav + trio titles | VERBATIM |
| policies-data.ts:21-35 | Refund policy body (30-day text, `info@eyeq2020.ca` mailto ×3, `sale items or gift cards`) | VERBATIM Shopify-template preservation (B §11). Old email + `sale items` live inside verbatim policy — flagged below, NOT a P0 delete |
| policies-data.ts:41-204 | Privacy policy body (`eyeq-optical.myshopify.com`, `info@eyeq2020.ca`, `2434804 Ontario Inc., C1A-777 Guelph Line, Burlington ON L7R3N2, Canada`, cart/checkout cookie table, FB/Google/Bing opt-outs, `[INSERT…]`/`[INCLUDE…]`/`[ADD…]` template brackets) | VERBATIM template preservation — flagged below. Brackets are Shopify's own placeholders, not our drafts; do NOT edit policy prose without client sign-off |
| policies-data.ts:210-255 | Terms of service body (incl. `Prices…`, `promotions, offers`, billing/account, `SECTION…`–`CONTACT INFORMATION`) | VERBATIM template preservation — flagged below |
| motion/chapters.ts | (zero user-visible strings — IDs + numerics only) | — |

## 4. P0 — every NOT-ON-LIVE-SITE item + exact line to delete

> Split applied: **A = ship-blockers (delete before launch)** vs **B = dev/chrome (delete or keep-by-convention, noted)**. A11y chrome (aria-labels, skip links, sr-only) is NOT listed for deletion — it is not "content" under §6d.

### A — DELETE before launch (routes/features/links that violate §6d)
1. **P0-A1 — phantom catalog import (build-breaker; target file does not exist).** `src/app/router.tsx:6` — delete line `import { Catalog } from '../routes/Catalog'`. (No `src/routes/Catalog.tsx` exists; glob confirms only Contact/Home/Policies/Services/TokensQA + parts/.)
2. **P0-A2 — catalog route.** `src/app/router.tsx:19` — delete `{ path: '/frames', element: <Catalog /> },`. Live site has NO /frames route or catalog (B §0 page map). §6d explicitly bans catalog/frames/Browse-frames.
3. **P0-A3 — catalog detail route.** `src/app/router.tsx:20` — delete `{ path: '/frames/:handle', element: <Catalog /> },` (same reason).
4. **P0-A4 — search route.** `src/app/router.tsx:22` — delete `{ path: '/search', element: <Catalog /> },`. Live site has NO search (§6d bans search).
5. **P0-A5 — scaffold catalog link.** `src/routes/Home.tsx:19` — delete `<Link to="/frames">Browse frames</Link>` (keep nothing of this line's frames link; see A6).
6. **P0-A6 — Home scaffold shell (dev placeholder, not a page).** `src/routes/Home.tsx:10-21` — delete/replace scaffold block (`Skip to content` anchor, `Film (Lane B mount point)` section, `Lane B — film mounts here`, `Scaffold` nav incl. `Services`/`Contact`/`Browse frames`/`Tokens QA` links) when the real Home composition lands. Until then it is dev-only; must NOT ship.
7. **P0-A7 — QA route.** `src/app/router.tsx:23` — delete `{ path: '/qa/tokens', element: <TokensQA /> },` before launch (dev acceptance artifact; router comment itself says "remove pre-launch"). Companion: `src/routes/Home.tsx:19` `Tokens QA` link (covered by A6) and `src/routes/TokensQA.tsx` incl. `:64` `Display — Fraunces 300, evening frames` (dev-only file; delete file pre-launch).

### B — dev/chrome strings NOT on live site (no delete; listed for the record)
- `src/routes/parts/route.css:538` — comment only (`Catalog/search/frames styles removed`) — code comment, not user-visible. Keep.
- `src/components/dom/Header.tsx:158`, `Footer.tsx:4-5`, `Sections.tsx:100,145`, `Contact.tsx:1-4`, `policies-data.ts:5`, `Policies.tsx:50`, `router.tsx:9-14`, `chapters.json:2`, `data/index.ts:1-4,55-60`, `brands/insurers/lenses/services/reviews/store.json source/note/*Href/*Url/file/hero` fields — comments + meta fields, never rendered. Keep.
- Carousel chrome (`Prev/Next/Choose lens`, `1 / 3`, `01/02`, `Services →`, `Read more →`), film controls (`MENU`, `Skip film ↓`, `Replay film`, `Back to top`, `Play/Pause brand rails`), map veil (`Load map`, `Activate map`, `· loads Google Maps on click`), skip links, sr-only fallbacks, `HOURS` label, `Call 905-497-0227` — standard UX/a11y affordances, not §6d "content". Keep.
- Booking-CTA wordings `Book an exam` (Header.tsx:102, chrome.tsx:47), `Book an eye exam` (Header.tsx:165), `BOOK AN EYE EXAM` (Header.tsx:185): NOT byte-verbatim vs live labels — recommend aligning all instances to `BOOK YOUR EYE EXAM TODAY!` / `Book your Eye Exam today` (stored verbatim in store.json:20-21), but the CTA itself is allowed (§6d) so these are NOT P0 deletes.

## 5. Old-store leakage check (Burlington address/phone/email outside verbatim)

**PASS — no old-store info is presented as the store anywhere outside verbatim preservation:**
- Old phone `(905)333-3931`, fax `(905)333-3932`, address `777 Guelph Line C1A, Burlington ON`, email `info@eyeq2020.ca`, entity `2434804 Ontario Inc.` appear **only** inside `src/routes/parts/policies-data.ts` refund/privacy bodies (:16,:25-26,:43-44) — i.e. inside VERBATIM Shopify policy preservation (B §11), plus acknowledging code comments (`policies-data.ts:5`, `Policies.tsx:50`, `Contact.tsx:1-4`). No old phone/email/address in any data JSON, dom component, chrome, or Contact page. No fax row rendered (Contact.tsx intentionally omits it — correct).
- `Burlington` appears only inside verbatim About paras (chapters.json:61,63) and verbatim Services intros (services.json:5,7; content.ts:42,44) — explicitly allowed (§6c.6). The one non-verbatim mention (`aboutBrampton` D13 "new Brampton store") is DRAFT-hidden.
- ⚠️ **Client decision needed (not a P0):** verbatim refund/privacy bodies contain the OLD email + OLD address/entity. At launch the client should decide: keep byte-verbatim (faithful to live site) or swap `info@eyeq2020.ca` → `eyeshine2020@gmail.com` and the entity/address block → new Brampton address. Also decide fate of Shopify template `[INSERT…]/[INCLUDE…]` brackets and `sale items or gift cards` / cart-checkout cookie-table / FB-Google-Bing opt-out prose (all verbatim template, all flagged here, none invented by us).
- Also verified ABSENT (correctly): announcement bar, promotions/promo codes, statistics (beyond verbatim `4.9 (208 reviews)`), contact form, account, social links, `Powered by Shopify`, `News` blog, `REBAJAS`/sale text, catalog/product names/prices. `Gucci` appears only in verbatim services intro (allowed).

## 6. Gating confirmation (DRAFT-hidden PASS)
- `SHOW_DRAFT_COPY=false` default (index.ts:59-60); `ChapterOverlay.visible()` + `DraftTag` null-gate (:25-38); `Sections.tsx:121,133,147` gate video-description/D13. All 13 DRAFT lines (D1-D11, D13, D15) hidden in default build; single verbatim anchor (B7 heading) renders. No `VITE_SHOW_DRAFT_COPY=true` committed anywhere (env-only).

---
*End of COPY audit. Remaining risk after P0-A deletes + launch decisions in §5: zero known §6d content violations in shippable copy.*

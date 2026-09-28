# COPY-DRAFTS — Phase 4 film/editorial draft lines (ALL DRAFT, client approval required)

> Authority: brief §6c.5 — short claim-free editorial lines/chapter labels allowed ONLY as DRAFTS.
> Single source for every non-verbatim string. Nothing here ships without client sign-off.
> Everything else on the site is verbatim from `docs/research/B-content-inventory.md` (§§2–5,7–9,11)
> or brief §2 new-store info. No claims, no stats, no promises, no invented services/reviews/promos.
> In code/content files each line MUST carry a `DRAFT` marker + pointer to this file.
> Verbatim anchors (NOT drafts, for reference): H1 `FROM EYE EXAMS TO EVERYDAY STYLE.`,
> CTA `BOOK YOUR EYE EXAM TODAY!`, H2 `ABOUT US`, `OUR FEATURED EYEWEAR BRANDS`,
> `WHAT OUR CUSTOMERS SAY` / `Real reviews from real customers` / `4.9` `(208 reviews)`,
> `Our Popular High-Definition Lenses`, `We Accept Most Major Insurance Plans`
> (alt-caps `WE ACCEPT MOST MAJOR INSURANCE PLANS` also attested, B §5),
> 7 lens names with ®/™ intact (B §4), About 3 paras (B §2, Burlington/since-2018 intact),
> new-store block (brief §2): `2-227 Vodden St East, Brampton, ON`, `905-497-0227`,
> `eyeshine2020@gmail.com`, `Mon–Fri 11:00 am–6:30 pm · Sat 11:00 am–5:00 pm · Sun 11:00 am–4:00 pm`.

| # | Beat / slot | DRAFT line (≤4 words for eyebrows; ≤8 words for display) | Why (narrative job) | Alternatives | Status |
|---|---|---|---|---|---|
| D1 | B1 eyebrow (micro-cap, 11px) | `DRAFT: 01 — Dark room` | Numbers the premiere; names the "optician's dark room" thesis without hype words | `01 — Instruments`, `01 — Before light` | DRAFT |
| D2 | B1 display (Fraunces, ≤8 words) | `DRAFT: Instruments kept in darkness.` | Light-reveals-form thesis; pairs with raking key ramp 0→2.5 | `DRAFT: Before light, the instrument.` / omit display, eyebrow only | DRAFT |
| D3 | B2 eyebrow | `DRAFT: 02 — Velvet` | Labels the material beat; keeps one idea/viewport | `02 — Lining`, `02 — Oxblood` | DRAFT |
| D4 | B2 display | `DRAFT: Cut for one instrument.` | Explains the bespoke saddle; avoids "luxury/premium" hype | `DRAFT: One seat, one pair.` / omit | DRAFT |
| D5 | B3 eyebrow | `DRAFT: 03 — Folded` | States the mechanical state; geometry leads, no body copy | `03 — Emergence`, `03 — From the case` | DRAFT |
| D6 | B4 eyebrow | `DRAFT: 04 — Rimless, black metal` | Material spec in Lindberg register; never over moving hinge macro | `04 — Hinge`, `04 — Black metal` | DRAFT |
| D7 | B4 display (≤6 words) | `DRAFT: Hinges, damped by hand.` | Engineering-poetry (ic! berlin "From 0.5 mm…" register, E-06); no performance claim | `DRAFT: Small parts, exact motion.` / omit | DRAFT |
| D8 | B5 eyebrow | `DRAFT: 05 — Lenses` | Labels the Essilor beat; alternative verbatim source `Our Popular High-Definition Lenses` (B §4) may replace it 1:1 | verbatim `Our Popular High-Definition Lenses` as micro-cap | DRAFT (or swap to verbatim) |
| D9 | B5 display | `DRAFT: Glass with a prescription.` | Quiet editorial bridge to 7 verbatim lens names; makes no efficacy claim | `DRAFT: Seven lenses, named.` / omit | DRAFT |
| D10 | B6 label (micro-cap only, no headline over centre) | `DRAFT: Carried in store — eight houses` | Counts without hyping; leaves focus to logos | `DRAFT: Eight houses, one shelf` / eyebrow only | DRAFT |
| D11 | B7 sub-line under verbatim heading (16px Inter) | `DRAFT: Bring your card to your visit.` | Practical next step; asserts NOTHING about direct billing (B §5 UNVERIFIED) | omit sub-line entirely (heading alone) | DRAFT — REJECT any variant containing "direct bill/billing" |
| D12 | Portal→H1 bridge (only if a bridge is needed; default = hard-cut to H1, no line) | `DRAFT: —` (no line; reserved slot) | Reader never sees an empty viewport; veil clears onto H1 directly | `DRAFT: Daylight, then facts.` (only if QA shows a comprehension gap) | DRAFT slot, default EMPTY |
| D13 | About-adjacent Brampton frame (separate block, NEVER merged into the 3 verbatim paras) | `DRAFT: Visit us at our new Brampton store.` + new-store address block | Grounds Burlington-2018 history copy against the Brampton present without rewriting history | `DRAFT: Now welcoming patients in Brampton.` | DRAFT — client must approve wording |
| D14 | Search empty state | `DRAFT: No frames match — call 905-497-0227.` + `Clear` button | Uses only the real phone number (brief §2); no invented policy | `DRAFT: Nothing found — try a brand name.` | DRAFT |
| D15 | Video description (1 sentence, a11y track/poster alt) | `DRAFT: Interior view of the EyeQ practice and eyewear displays.` | Neutral description of the self-hosted MP4 (B §2); no claim | client-supplied description preferred | DRAFT |
| D16 | Catalog availability line (replaces `$0.00` — NEVER render `$0.00` as a price) | `DRAFT: In-store only — call for availability.` | Hides placeholder pricing (B §10) without inventing price/policy | `DRAFT: Available in store.` | DRAFT — pending client price/availability policy |
| D17 | White-act transitional sentence | NONE (default hard-cut to H1, per MOTION). Slot reserved only. | Avoids invented bridge copy | — | [COPY NEEDED] if ever used |

## Client-requested catchphrases (awaiting approval)

> Client explicitly asked for catchphrases that pop up on the side during the
> film. All lines are DRAFT (`draft: true` in `src/v1/sideCopy.ts`), ≤6 words,
> claim-free, non-generic, optician's-dark-room voice — no vision/focus/clarity
> clichés, no promises, no stats. Rendered with a "Draft" tag until approved.

| # | Slot | DRAFT line | Why (narrative job) | Alternatives | Status |
|---|---|---|---|---|---|
| S1 | Beat 1–145, LEFT panel (with `4.9 ★ — 208 Google reviews`) | `DRAFT: Dark room, instruments waiting.` | Names the dark-room thesis; pairs with the bird's-eye/take-out beats | `DRAFT: Before light, the instrument.` | DRAFT |
| S2 | Beat 175–235, RIGHT panel (with `7 Essilor® lenses` + verbatim names) | `DRAFT: Brass hinges, velvet seat.` | Material spec in two nouns; geometry leads | `DRAFT: Small parts, exact motion.` | DRAFT |
| S3 | Wave 1, 235–325, RIGHT header (`8 eyewear brands`) | `DRAFT: One case, one pair.` | Quiet bridge to the brand wall; no hype | `DRAFT: Eight houses, one shelf.` | DRAFT |
| S4 | Wave 2, 425–470, LEFT header (`8 insurance plans — We accept most major insurance plans`) | `DRAFT: Light does the talking.` | Hands the moment to the sweep; makes no claim | omit (heading alone) | DRAFT |

## Rules for drafts

1. Max lengths: eyebrows ≤4 words (plus `01 —` numeral); display lines ≤8 words (B4 ≤6).
2. Banned tokens anywhere in drafts: `VISION`, `FOCUS`, `CLARITY` as standalone display;
   `premium`, `ultimate`, `best-in-class`, `award-winning`, version pills, eyebrow-every-section
   (brief §7 + ART A6). Grep-gate in QA.
3. Never assert: direct billing, efficacy ("see better"), prices, promos, reviews, stats, sponsors.
4. About paras stay byte-verbatim (incl. `Burlington`, `since 2018`, `Canadian privately owned`).
   D13 sits in its own block with a hairline divider — never spliced into the paras.
5. Insurance heading stays verbatim; D11 is the ONLY permitted sub-line pattern and it must not
   contain bill/billing/direct/covered/claim language.
6. Lens names always verbatim with ®/™ intact; ®/™ at 60% size, roman, never bold (ART §1.2).
7. Booking CTA always verbatim `BOOK YOUR EYE EXAM TODAY!` (homepage/white-act/header, `_blank`)
   and `Book your Eye Exam today` (Services page, same-tab) → exact URL
   `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1`
   (http, not https — do not "fix"). `[CLIENT CONFIRM: Brampton location code?]`

## [COPY NEEDED] rollup (non-draft facts the client must supply)

- (a) Exact new Google Maps destination string / place ID for `2-227 Vodden St East, Brampton, ON`.
- (b) Updated legal entity + returns contact for `/policies/*` (replaces `info@eyeq2020.ca`,
      Burlington address, `2434804 Ontario Inc., C1A-777 Guelph Line…`).
- (c) Fax row: omit (no fax exists for the new store) unless client supplies one.
- (d) Catalog price/availability policy (decides D16 final wording).
- (e) Booking location-code currency (`eyeqvision1` is Burlington-era — synthesis §7).
- (f) Light logo variants acceptability (shape-identical recolors — synthesis §7).
- (g) 1-sentence video description (or approve D15).

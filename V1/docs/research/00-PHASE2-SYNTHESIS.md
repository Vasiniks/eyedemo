# Phase 2 — Research Synthesis (orchestrator)

Sources: A-website-audit, B-content-inventory, C-link-inventory, D-asset-inventory, E-visual-references, F-3d-motion-tech, G-glasses-model (all in this folder). Detail lives there; this file is decisions + checklist.

## 1. Preservation inventory (must remain available)
- Name "EyeQ Vision Care" + official logo (`assets/source/logo/eyeq-logo-header-original.png`, 800×373 black/transparent, contains EYE + eye/Q ring + "VISION CARE"). No SVG exists on the live site.
- Nav: HOME · SERVICES · CONTACT (+ search, account). Policies: refund / privacy / terms.
- Services (3), Essilor lens family (7 items), insurance (8 insurers, "WE ACCEPT MOST MAJOR INSURANCE PLANS"), 6 Google reviews + 4.9 / 208, 8 eyewear brands, about/intro copy, video (self-hosted MP4). Verbatim text: B §2–§11.
- Booking CTA → `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` (third-party OptiStoreOne).
- Catalog: 22 products (Persol/Prada/Ray-Ban), all $0.00, orphaned (no inbound links) — keep reachable, not featured.

## 2. Content inventory — key facts
- Promotions: NONE on live site (nothing to preserve). Social links: NONE. Hours: NONE on live site → new-store hours from brief.
- OLD STORE (do not present): 777 Guelph Line C1A, Burlington; (905) 333-3931; info@eyeq2020.ca; fax (905) 333-3932.

## 3. Link / functionality inventory — key facts
- All 8 brand logos and all 8 insurance logos are UNLINKED → keep unlinked.
- Old phone link is malformed (`tel:(905)3333931`); new site uses `tel:+19054970227`, `mailto:eyeshine2020@gmail.com`.
- Map/directions: rebuild for 2-227 Vodden St East, Brampton, ON.
- No contact form exists (do not invent one). Zero broken links.

## 4. Asset inventory — key facts
- 53 files in `assets/source/`. Brand + logo files are dark-on-transparent → need alpha-preserving light recolor for black scenes (P3-LOGO doing this; shapes untouched).
- Fonts on live site: Inter, Barlow Condensed. Colors: maroon #A42325, hero yellow #FFDE59.
- Gaps: no logo SVG (mechanical trace in progress, IoU-verified), palette-alpha PNG trap, Gucci is text-only (not a logo asset).

## 5. Visual reference findings (E)
- Case envelope: L:W:H ≈ 5.6 : 2.15 : 1, ~160–170 × 60–65 × ≤28–30 mm, tapered ends, matte bead-blasted graphite, concealed hardware, one asymmetric longitudinal parting line, flap = continuous panel on virtual long-edge axis, flex + damped overshoot.
- Velvet reads through grazing-angle sheen + nap bands + folds; oxblood/bordeaux not signal red; "velvet is a lighting event".
- Type: Fraunces (display) + Inter (UI) — Inter also matches the live site.
- Direction: "an optician's dark room" — darkness → controlled light → clarity.

## 6. 3D / motion implementation findings (F + G)
- Stack: Vite + React 19 + R3F 9.8 + drei 10.7 + three 0.186 + GSAP 3.15 ScrollTrigger + Lenis 1.3, static build.
- One GSAP master timeline scrubbed by scroll; R3F reads progress. Logo as boolean geometry; flap = runtime hinge + bend (baked Action also exported); velvet = sheen (KHR_materials_sheen); lens = transmission + Lightformer reflections; sponsors = alpha planes travelling on camera-relative z with authored streaks; portal = camera through lens + iris/bloom to white; rails = DOM marquees with masks.
- Glasses model: rimless black metal, 52.6k tris, open pose, arms merged L/R (split recipe + hinge pivots documented), tortoise texture has baked watermark → dropped.

## 7. Risks / constraints
- Primary model unavailable; running on approved fallback.
- Rimless glasses may vanish on black → dark-field/strip lighting + smoke-tinted lenses (brief §6b).
- Booking URL location code is Burlington-era (`eyeqvision1`) — client to confirm whether Brampton has its own.
- Light logo variants are recolors of official art (shape-identical) — client to confirm acceptable.
- Transmission + postprocessing on mobile → quality tiers, reduced-motion fallback.

## 8. Recommended approach / decisions
- Wave 1 = 8 eyewear brands (display order: Maui Jim, Ray-Ban, Prada, Miu Miu, Persol, Oakley, Tiffany & Co., Versace).
- Wave 2 = 8 insurers ("We accept most major insurance plans") — real logo assets, useful trust info. Essilor lens family goes into the EyeQ-information beat around the glasses (text, verbatim). Alternative if client prefers: Essilor lens family as wave 2.
- Keep the supplied rimless glasses, darkened (black metal, smoke lenses, black tips).
- Booking CTA keeps the existing destination unless client supplies a Brampton code.

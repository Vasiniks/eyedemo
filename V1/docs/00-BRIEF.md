# EyeQ Vision Care — Cinematic Homepage — PROJECT BRIEF (Phase 1)

Source of truth for every agent. Read fully before starting any task.

## 1. Business (fixed — never change)
- Name: **EyeQ Vision Care** (exact spelling; never rename, never derive a name from the email/domain).
- Logo: the EXISTING official EyeQ logo from https://eyeqoptical.ca/ — never redraw, regenerate, recolor-as-new-logo, or replace with text.
- Do not invent: services, claims, statistics, sponsors, links, reviews, promotions.

## 2. New store (use wherever the site presents location/contact)
- Phone: 905-497-0227 (tel:+19054970227)
- Email: eyeshine2020@gmail.com
- Address: 2-227 Vodden St East, Brampton, ON
- Hours: Mon–Fri 11:00 am–6:30 pm · Sat 11:00 am–5:00 pm · Sun 11:00 am–4:00 pm
- Old store info from the live site must NOT be presented as the store.

## 3. Reference site
- https://eyeqoptical.ca/ (Shopify-style) · https://eyeqoptical.ca/pages/services
- Must be audited live (Phase 2). Preserve: services, lens offerings, insurance/support, promotions, reviews/testimonials, navigation, booking (actual current destination), contact, sponsor/eyewear brand identities (keep unlinked if currently unlinked).

## 4. Project state
- Working dir `/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1` is EMPTY — no existing codebase/stack. A stack must be chosen (no framework to preserve).
- Glasses model: `/Users/admin/Downloads/Glasses_Mama_WBL/` (Glasses_Mama_WBL.obj 4 MB, .mtl, Glasses_Mama_Tex/).
- Blender available via Blender MCP. Blender previews: EEVEE, low quality (final Cycles bake happens on another machine — keep scenes Cycles-portable).

## 5. Creative concept — the film (scroll-driven, continuous)
Aerodynamic black case in darkness → one-piece flap opens → DARK RED VELVET interior → FOLDED dark glasses emerge → glasses unfold → camera explores → real EyeQ info appears subtly → Sponsor wave 1 flies in from extreme depth (hyperspace-feel, original — not Star Wars) and accumulates → Wave 2 (real EyeQ content group, determined in research) → camera approaches one lens → passes THROUGH lens → white → basic practical info → two vertical opposing-direction brand film rails → rest of homepage.

Pacing (relative): case reveal 10 · open/velvet 15 · emerge 15 · unfold 15 · info+camera 15 · wave1 15 · wave2 7 · lens approach 5 · lens entry/white 3  ⇒ then ≈20% of the intro is white/practical.
Dark cinematic ≈ 80% of the intro. White ≈ 20%.

## 6. Hard object requirements
- Case: extremely thin, elongated, sculpted, aerospace-inspired shell. Not a box, not a bulky hinge case. Near-black / graphite, matte or subtle dark metallic, controlled reflections.
- Logo: physically embossed/debossed geometry (not decal, not floating text, not glow). Plus "EyeQ Vision Care" on the surface.
- Flap: ONE-PIECE continuous shell opening, smooth, slightly elastic, not a 90° box lid.
- Velvet: deep dark red, soft pile, folds, sheen, light absorption — must read as velvet.
- Glasses: dark (black/dark metallic), start FOLDED, emerge physically from case, unfold with believable hinge motion + damping, then hover/rotate.

## 6b. Client direction (added during Phase 2)
- Blender work happens in a LIVE Blender 5.0 scene (MCP add-on), not headless.
- Glass/lenses must read BRIGHT and visible against the black world. Solve with lighting, not by whitening the material: dark-field / rim lighting (bright strip lights behind & beside the glasses so lens edges glow), softbox/strip-light reflections sweeping across the lens (Blender area-light cards; web: drei Environment + Lightformer panels, animatable with scroll), subtle AR-coating tint in reflections, polished bright lens edges, gentle bloom on the web.

## 6c. Client decisions (confirmed after Phase 2)
1. Wave 1 = 8 eyewear brands (Maui Jim, Ray-Ban, Prada, Miu Miu, Persol, Oakley, Tiffany & Co., Versace). Wave 2 = 8 insurer logos ("We accept most major insurance plans"). The 7 Essilor lens names (verbatim, B §4) go in the EyeQ-information beat around the glasses.
2. ALL logos shown single-color/light in the dark scenes (`assets/web/brands-light/`, `assets/web/insurance-light/`, `assets/logo/eyeq-logo-white*.png`). Colored versions not needed in the film.
3. Booking CTA keeps `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1`.
4. Glasses: the supplied rimless model — black metal, smoke-tinted lenses, black arm tips; side/back (dark-field) lighting keeps them visible.

5. Film copy: agents may DRAFT short, claim-free editorial lines/chapter labels per beat. Every drafted line is marked `DRAFT` in code/content files (single source: a copy file) and listed for client approval before launch. No claims, stats, or promises in drafts.
6. About text: keep fully VERBATIM from the live site, including "Burlington" and "since 2018".
7. Insurance: use only the verbatim live heading ("We accept most major insurance plans"); do not assert direct billing.

## 7. Design character
Premium, cinematic, restrained, editorial, physical, eyewear-specific. NOT: template, Shopify-with-effects, Apple clone, WebGL demo, glassmorphism, gradients, particles, floating random objects, one-word hype text (VISION/FOCUS/CLARITY…).

## 8. Workflow
Phase 1 Brief → Phase 2 Research (parallel agents A–F + G model inspection) → Phase 3 Model → Phase 4 Animation (steps 1–18). Report after each phase. Visual QA via Playwright screenshots, never "it compiles".

## 9. Output locations
- Research: `docs/research/`
- Blender files/exports: `blender/` and `public/models/`
- App code: project root (stack chosen after research)

## 6d. CLIENT RULE (highest priority, added Phase 4): NOTHING that is not on the original website
- Do NOT add any content, section, page, feature, or link that the live site does not have. The only additions allowed are the new-store details in §2 (address/phone/email/hours) and the approved DRAFT film lines (§6c.5, marked DRAFT for approval).
- NO catalog / frames / "Browse frames" / product pages or product listings, NO search, NO account, NO cart, NO contact form, NO social links, NO promotions, NO statistics.
- Navigation = HOME · SERVICES · CONTACT (as on the live site) + the Book-an-exam CTA (exists on live site) + footer policy links (Refund / Privacy / Terms exist on live site).
- Given this rule, DRAFT film lines are DISABLED by default: they stay in data with `"draft": true` but are NOT rendered unless a single build flag `SHOW_DRAFT_COPY=true` is set. The film shows only real site content (name/logo, Essilor lens names, services names, brand + insurer logos, "We accept most major insurance plans", H1 "FROM EYE EXAMS TO EVERYDAY STYLE.", booking CTA) and new-store info.

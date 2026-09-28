# PAGES — Services / Contact / Policies + router (ID=PAGES, port 5713)

## Change (own files only: src/routes/**, src/app/router.tsx)
- `src/routes/parts/chrome.tsx` — header nav now links canonical `/`, `/pages/services`, `/pages/contact` (was short `/services`, `/contact`); header `Book an exam` pill is same-tab on Services (live C §2 behaviour) and `_blank` elsewhere; footer gains a `Menu` group linking all three pages (Home/Services/Contact) above the existing Terms and Policies trio.
- `src/routes/Services.tsx` — added LARGE hero `Book an exam` CTA (same-tab, exact booking URL). Inline `Book your Eye Exam today` under Comprehensive Eye Exams stays same-tab; `VisitStrip` stays same-tab (default `bookingNewTab=false`).
- `src/routes/Contact.tsx` — added LARGE hero `Book an exam` CTA (`_blank`, exact booking URL) + `VisitStrip bookingNewTab` at page bottom (large `Book your Eye Exam today` + `Get directions`). Facts/map/directions otherwise unchanged: new-store values from brief §2, no form.
- `src/routes/Policies.tsx`, `src/routes/parts/content.ts`, `src/app/router.tsx` — unchanged (already correct: `/`, `/pages/services`, `/pages/contact`, `/services`+`/contact` redirects, `/policies/:policy`).

## Verify (dev http://127.0.0.1:5713/)
- Routes: `/pages/services` 200, `/pages/contact` 200, `/services` 200 (redirect), `/contact` 200 (redirect).
- Booking href (all CTAs): `http://www.deenandassociates.com/optistoreonewebex/appointmentschedule.php?LOCATION=eyeqvision1` (http verbatim, C Key finding 1). Services inline + hero + VisitStrip = same-tab (no target); header pill on Services = same-tab; Contact hero + VisitStrip = `_blank`.
- No `<form>` in `src/routes/` (matches live C §3 — contact is static info only).
- Contact: phone `tel:+19054970227`, email `mailto:eyeshine2020@gmail.com`, address `2-227 Vodden St East, Brampton, ON`, hours Mon–Fri 11:00 am–6:30 pm · Sat 11:00 am–5:00 pm · Sun 11:00 am–4:00 pm; map iframe src `https://maps.google.com/maps?q=2-227+Vodden+St+East%2C+Brampton%2C+ON&t=m&z=15&output=embed&iwloc=near` present by default (click-to-activate veil only gates pointer-events, same pattern as live C §5); directions `https://www.google.com/maps/dir/?api=1&destination=2-227+Vodden+St+East%2C+Brampton%2C+ON` (`_blank`). Desktop screenshot shows live map pin `227 Vodden St E #2`; mobile full-page shot caught tiles still lazy-loading (iframe src present, loads on scroll — same lazy pattern as live).
- 1512×860: `PAGES-services.png`, `PAGES-contact.png`. 390×844: `PAGES-services-mobile.png`, `PAGES-contact-mobile.png`. Header nav + Book pill visible, no h-overflow, insurance 4-col → 2-col, footer Menu + policies stacked.
- `npm run build` passes (tsc -b + vite build, postbuild 404 copy).

## Checklist — every B-content-inventory Services/Contact item → where it appears
- B §3 H1 `Services` → `Services.tsx` hero `h1` (`SERVICES_H1`).
- B §3 intro para 1 (`Looking for a trusted optometrist in Burlington? …`) → `Services.tsx` section 1, para 1 (`SERVICES_INTRO[0]`).
- B §3 intro para 2 (`We also offer … Gucci, Prada, and Ray-Ban …`) → section 1, para 2 (Gucci name-drop preserved).
- B §3 intro para 3 (`Whether you need a routine eye exam … Burlington store …`) → section 1, para 3.
- B §3 `Accurate Prescription Fittings` + `Accurate prescription fitting to ensure clear, comfortable vision tailored to your needs.` → `Services.tsx` ledger row 01 (`SERVICE_BLOCKS[0]`).
- B §3 `Comprehensive Eye Exams` + `A complete assessment of your vision and eye health, including prescription testing and screening for common eye conditions.` → ledger row 02 (`SERVICE_BLOCKS[1]`).
- B §3 / C §2 button `Book your Eye Exam today` → same Deen URL → ledger row 02 CTA (same-tab) + hero CTA + `VisitStrip` CTA.
- B §4 `Our Popular High-Definition Lenses` → `Services.tsx` lens section `h2` (`LENSES_HEADING`).
- B §4 `Varilux® Physio Extensee™` · `Distinctive® Superior` · `Distinctive® Enhanced` · `Distinctive® SV Lenses` → `f-lens-names` list (`LENS_NAMES_4`, in order).
- B §4 `Essilor Stellest® 2.0 Lenses` + `Innovative myopia-management lenses …` → slideshow slide 1 (`LENS_SLIDES[0]`).
- B §4 `Transitions® Lenses` + `Experience comfortable vision in changing light …` → slide 2.
- B §4 `Xperio® Lenses` + `Xperio® polarized lenses are designed …` → slide 3 (Prev/Next + dots, `1 / 3` counter).
- B §5 `We Accept Most Major Insurance Plans` → `f-insurance` `h2` (`INSURANCE_HEADING`).
- B §5 8 insurers in order (Sun Life, Medavie Blue Cross, Manulife, GreenShield, Canada Life, Desjardins, IA Financial Group, Empire Life) → `f-insurance-grid` 8 cells (`INSURERS`, light knockouts in `public/web/insurance-light/`, unlinked per C §6).
- B §8 contact labels `PHONE` / `EMAIL` / `ADDRESS` (+ `HOURS` — live had none published; new-store hours per brief §2) → `Contact.tsx` `f-facts` rows (`CONTACT_LABELS`).
- B §8 values REPLACED per brief §2 (old store must not be presented): `905-497-0227` (`tel:+19054970227`), `eyeshine2020@gmail.com`, `2-227 Vodden St East, Brampton, ON`, hours above → facts + footer + `VisitStrip`. No fax row (old fax is OLD-STORE data).
- C: `Get directions` (`_blank`) + map embed → `Contact.tsx` `f-map` + `VisitStrip`; no contact/booking form anywhere.
- Router (B §1 + brief §6d): `/` Home, `/pages/services`, `/pages/contact`, `/policies/*`; `/services` → `/pages/services`, `/contact` → `/pages/contact` redirects; header MENU + footer Menu link all three; footer keeps Refund/Privacy/Terms trio.

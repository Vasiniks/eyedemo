LETTER = A — WEBSITE AUDIT. Output: `docs/research/A-website-audit.md`, screenshots in `docs/research/screens/A/`.
Objective: record what https://eyeqoptical.ca/ currently IS and DOES, as a user experiences it.
1. With Playwright, load the homepage at 1440x900 and at 390x844 (mobile). Full-page screenshots of each into screens/A/.
2. Walk the site top to bottom: header/nav (open every menu/dropdown, mobile hamburger), every homepage section in order, footer. For each section record: order index, heading, what it contains, layout, imagery, any animation/slider/carousel behavior (does it autoplay? arrows?), and a screenshot of that section.
3. Visit every page reachable from the main nav and footer (incl. /pages/services, contact, any booking/appointment page, collections/shop if present, policies). For each: URL, purpose, sections, screenshot.
4. Actually click: appointment/booking CTA(s), phone, email, map/directions, sliders, sponsor logos, review widgets. Record what really happens (navigates where / opens modal / nothing).
5. Note tech: platform (Shopify theme name if detectable), third-party widgets (review apps, booking apps, maps embeds, chat), fonts in use (computed font-family), primary colors (computed).
6. Note visual/UX weaknesses that make it feel "plain" (factual, brief).
Deliverable structure: ## Summary · ## Site map (tree of URLs) · ## Homepage section-by-section · ## Other pages · ## Interactions tested (table: element → action → result) · ## Tech & third-party · ## Weaknesses.

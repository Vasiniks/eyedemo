LETTER = C — LINK / FUNCTIONALITY INVENTORY. Output: `docs/research/C-link-inventory.md`.
Objective: every important clickable element on https://eyeqoptical.ca/ (homepage, services, contact/booking, header, footer, mobile menu).
Method: use Playwright to enumerate all <a>, <button>, [role=button], [onclick], forms, iframes on each page. Then physically click the important ones (booking/appointment CTAs, service CTAs, phone, email, map, directions, sponsor/brand logos, social, footer links) and record the real result.
Output a table per page with columns: Label/visible text | Element (a/button/img/iframe) | Clickable? | href/destination (exact) | internal/external | target (_blank?) | Observed behavior when clicked.
Mandatory findings (state clearly at the top in a ## Key findings section):
- The EXACT booking/appointment destination URL(s) and what system it is (e.g. third-party booking app, contact form, Shopify page, phone only).
- Whether EACH sponsor/eyewear brand logo is linked or NOT linked (list per brand).
- Whether insurance logos are linked.
- Phone/email link formats (tel:/mailto:) and the numbers/emails used (label OLD STORE).
- Map: embed type and exact embed/query URL; directions link.
- Forms: fields, action/submit target, whether it works (do NOT actually submit real data — inspect only).
- Broken links / 404s found.

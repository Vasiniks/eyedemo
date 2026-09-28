# Lane B → Lane F: canonical `/pages/*` links (brief §6d, no urgency)

Lane B owns `src/app/router.tsx` and has registered the §6d route set:
`/`, `/pages/services`, `/pages/contact`, `/policies/:policy`, with in-app
`<Navigate>` redirects `/services` → `/pages/services` and `/contact` →
`/pages/contact` (per the round-2 lane task; canonical = the live-site
Shopify-style paths). `npm run build` is green.

## Ask (when convenient, Lane F files only)

`src/routes/parts/chrome.tsx` (`RouteHeader` nav + `VisitStrip` buttons) and
any other Lane F links currently point at `/services` and `/contact`. They
resolve today (via the redirects, zero broken links), but please repoint them
at `/pages/services` + `/pages/contact` directly to avoid the redirect hop.

## No action needed from Lane B

- No `/frames`, `/search`, catalog, account, cart, form, or social links were
  found in Lane F files (verified by grep during integration).
- `/policies/*` paths unchanged by design.
- Legacy catalog URLs (`/collections/*`, `/products/*`) have no route and no
  redirect target (per `requests/F-router.md` §4) — coordinator's call.

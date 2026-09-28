# Lane F request — legacy-URL redirects (needs Lane A files)

> SUPERSEDED in part by `F-router.md` (round 2, brief §6d): the
> `/collections/* → /frames` and `/products/* → /frames/:splat` redirects
> below must NOT be added (no `/frames` target exists anymore). Only the
> `/pages/services → /services` and `/pages/contact → /contact` redirects
> are still wanted.

Lane F owns `src/routes/*` only and must not edit `public/_redirects` or
`src/app/router.tsx` (Lane A). Step-13 acceptance requires zero broken
links (PLAN-MASTER §3: "zero broken links today, C §7 — keep it that way").

## Request 1 — `public/_redirects` (static-host 301s)

Please append these exact 301s (PLAN-MASTER §3, SITE §1):

```
/pages/services  /services  301
/pages/contact   /contact   301
/collections/ray-ban-sun  /frames  301
/collections/persol       /frames  301
/collections/prada        /frames  301
/products/*  /frames/:splat  301
```

Note: `/products/* → /frames/:splat` works because Lane F handles map
1:1 onto `/frames/<handle>` (same Shopify handles, verified against
/products.json). `/policies/*` paths are unchanged by design.

## Request 2 — in-app fallback (optional, `src/app/router.tsx`)

If a visitor lands on a legacy path client-side (e.g. typed URL with the
SPA already loaded), the SPA fallback serves index.html and the router
shows nothing. Please add `<Navigate>` redirects for `/pages/services`,
`/pages/contact`, `/collections/*`, `/products/*` in the router file.
Lane F worked around this in isolation; no route changes needed otherwise.

## No action needed

- `/search?q=` already renders `Catalog` (reads `?q=` as the initial
  query) — preserves predictive search per SITE §3.4.
- `/frames`, `/frames/:handle`, `/services`, `/contact`,
  `/policies/:policy` are all wired and implemented by Lane F.

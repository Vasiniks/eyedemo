# Lane F → router owner: register/remove routes (brief §6d, round 2)

Lane F owns `src/routes/*` only and must not edit `src/app/router.tsx`
(Lane A) or `public/_redirects`. Please apply the exact changes below.
Authority: `docs/00-BRIEF.md` §6d + `docs/phase4/PLAN-MASTER.md`
ORCHESTRATOR OVERRIDE (client rule, highest priority — supersedes §3/§12
route tables and `requests/F-redirects.md` wherever they say `/frames`).

## 1. Remove these routes from `src/app/router.tsx`

Delete the `Catalog` import and these three entries (current lines 6, 19, 20, 22):

```tsx
import { Catalog } from '../routes/Catalog'          // DELETE
{ path: '/frames', element: <Catalog /> },            // DELETE
{ path: '/frames/:handle', element: <Catalog /> },    // DELETE
{ path: '/search', element: <Catalog /> },            // DELETE
```

Lane F has deleted the component itself (`src/routes/Catalog.tsx` and
`src/routes/parts/catalog*.ts` no longer exist), so leaving these entries
in place breaks `npm run build`. There is no `/catalog` route; if one
exists anywhere, remove it too.

## 2. Register exactly these routes (nothing else)

```tsx
{ path: '/', element: <Home /> },
{ path: '/services', element: <Services /> },
{ path: '/contact', element: <Contact /> },
{ path: '/policies/:policy', element: <Policies /> },
```

Per the override the canonical set is `/`, `/pages/services`,
`/pages/contact`, `/policies/refund-policy`, `/policies/privacy-policy`,
`/policies/terms-of-service`. Recommendation: keep `/services` +
`/contact` canonical and add `<Navigate>` fallbacks (or `_redirects`
301s) for `/pages/services` → `/services` and `/pages/contact` →
`/contact`. `/policies/*` paths are unchanged by design. Coordinator
decides if the canonical paths should instead switch to `/pages/*`.

## 3. Do NOT add catalog-related redirects (supersedes F-redirects.md)

`requests/F-redirects.md` asked for `/collections/* → /frames` and
`/products/* → /frames/:splat` 301s. Do NOT add them — there is no
`/frames` target anymore and brief §6d forbids catalog/product/search
pages. Legacy catalog URLs (`/collections/*`, `/products/*`,
`/search`, `/cart`, `/blogs/news`) should have no route and no
redirect target; coordinator decides their final disposition (404 is
acceptable — the live catalog must not be rebuilt).

## 4. Observed catalog references outside Lane F (not edited — FYI)

- `src/routes/Home.tsx:19` — `<Link to="/frames">Browse frames</Link>`
  (Lane A shell; will 404 after §1 — please remove).
- `src/components/dom/Header.tsx:138-139` — `/frames` + `/search` menu
  links (Lane E; brief §6d forbids — please remove).
- `src/components/dom/Footer.tsx:54` — `<a href="/frames">Browse frames</a>`
  (Lane E; please remove).
- `src/routes/TokensQA.tsx:64` — the English word "frames" in a type
  specimen ("evening frames"); not a link, no action needed.

## 5. Lane F state after round 2 (for verification)

- `src/routes/Services.tsx` — H1 `Services`, 3 verbatim intro paras
  (B §3, `Eye Q Optical`/`Burlington` intact), 2 service blocks verbatim,
  `Our Popular High-Definition Lenses` (4 names) + 3-slide Essilor
  slideshow verbatim (B §4), `We Accept Most Major Insurance Plans` + 8
  logos in B §5 order unlinked, booking CTA same-tab, visit strip. No
  `/frames` link.
- `src/routes/Contact.tsx` — `PHONE`/`EMAIL`/`ADDRESS`/`HOURS` labels
  (B §8) with brief §2 values, `tel:+19054970227`,
  `mailto:eyeshine2020@gmail.com`, map embed + `Get directions` rebuilt
  for `2-227 Vodden St East, Brampton, ON`. No form, no fax row.
- `src/routes/Policies.tsx` — H1/nav `Terms and Policies` (B §1 footer
  wording), three bodies byte-verbatim from the live site (old-store
  strings preserved verbatim, flagged in a code comment only).
- `src/routes/parts/chrome.tsx` — nav Home · Services · Contact + Book
  CTA only; footer store block + `Terms and Policies`
  (Refund/Privacy/Terms) + copyright only.
- Isolated harness `dev-F.html` + `src/__dev__/F/main.tsx` covers
  Services/Contact/3 policies only.

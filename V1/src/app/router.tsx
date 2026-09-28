import { createBrowserRouter, Navigate } from 'react-router-dom'
import V1App from '../v1/App'
import { Services } from '../routes/Services'
import { Contact } from '../routes/Contact'
import { Policies } from '../routes/Policies'
import { TokensQA } from '../routes/TokensQA'

// MAIN lane (brief §6d — client rule, highest priority): '/' renders the
// red-velvet V1 experience (src/v1/App.tsx). NO Catalog route and no
// Frames/Browse frames/Catalog/Search/Account/Cart links or UI.
// Canonical routes: `/`, `/pages/services`, `/pages/contact`,
// `/policies/refund-policy`, `/policies/privacy-policy`,
// `/policies/terms-of-service`. `/services` + `/contact` are kept as
// in-app redirects (zero broken links; Lane F chrome + live-site habits
// still link the short forms). Static hosts serve index.html for every path
// (public/_redirects + dist/404.html), so these Navigate fallbacks also cover
// direct visits. BrowserRouter here; no-rewrite hosts swap to HashRouter in
// THIS FILE ONLY. Film never replays on route change.
// NOTE: /qa/tokens is a Lane A acceptance artifact (type scale + swatches);
// unlinked from all navigation; remove pre-launch.
export const router = createBrowserRouter([
  { path: '/', element: <V1App /> },
  { path: '/pages/services', element: <Services /> },
  { path: '/pages/contact', element: <Contact /> },
  { path: '/services', element: <Navigate to="/pages/services" replace /> },
  { path: '/contact', element: <Navigate to="/pages/contact" replace /> },
  { path: '/policies/:policy', element: <Policies /> },
  { path: '/qa/tokens', element: <TokensQA /> },
], { basename: import.meta.env.BASE_URL })

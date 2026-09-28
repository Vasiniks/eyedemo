import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { Providers } from './app/providers'
import './styles/tokens.css'
import './styles/film.css'
import './styles/rails.css'
import './styles/white.css'
// Lane B integration: Lane E component styles (ChapterOverlay, Header,
// WhiteSection, LogoRails, rest-of-homepage, footer). Owned by Lane E;
// imported here because main.tsx is the integration entry.
import './components/dom/lane-e.css'
import 'lenis/dist/lenis.css'
// MAIN lane: '/' renders the V1 App — its lane stylesheet must load here
// (same order as src/v1/main.tsx: globals, lane-e, lenis, then v1 last).
import './v1/v1.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

createRoot(root).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
)

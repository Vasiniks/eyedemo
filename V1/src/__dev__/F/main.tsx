// Lane F isolated dev harness (owned by Lane F — see lane brief).
// Small router over the three Lane F routes only (Services / Contact /
// Policies); the real app's src/app/router.tsx is Lane A owned and stays
// untouched. Open: http://localhost:5106/dev-F.html
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { Services } from '../../routes/Services'
import { Contact } from '../../routes/Contact'
import { Policies } from '../../routes/Policies'
import '../../styles/tokens.css'

const router = createMemoryRouter(
  [
    { path: '/services', element: <Services /> },
    { path: '/contact', element: <Contact /> },
    { path: '/policies/:policy', element: <Policies /> },
    { path: '*', element: <Services /> },
  ],
  { initialEntries: ['/services'] },
)

function HarnessNav() {
  const go = (path: string) => () => {
    void router.navigate(path)
  }
  return (
    <nav
      aria-label="Lane F harness"
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        padding: '8px 16px',
        background: '#0a0c0e',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontSize: 13,
      }}
    >
      {[
        ['/services', 'Services'],
        ['/contact', 'Contact'],
        ['/policies/refund-policy', 'Refund'],
        ['/policies/privacy-policy', 'Privacy'],
        ['/policies/terms-of-service', 'Terms'],
      ].map(([path, label]) => (
        <button
          key={path}
          type="button"
          onClick={go(path)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(233,226,211,0.24)',
            borderRadius: 999,
            color: '#e9e2d3',
            padding: '6px 14px',
            cursor: 'pointer',
          }}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

createRoot(root).render(
  <StrictMode>
    <HarnessNav />
    <RouterProvider router={router} />
  </StrictMode>,
)

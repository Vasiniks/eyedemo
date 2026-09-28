// Lane F — /policies/:policy (step 13). One route, three sections.
// Bodies verbatim from the live Shopify pages (parts/policies-data.ts).
// Old-store strings are preserved verbatim and flagged [COPY NEEDED]
// (client must supply Brampton legal entity + returns contact).
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import './parts/route.css'
import { RouteFooter, RouteHeader } from './parts/chrome'
import { POLICIES } from './parts/policies-data'

const VALID = ['refund-policy', 'privacy-policy', 'terms-of-service'] as const

export function Policies() {
  const { policy } = useParams()
  const active = VALID.includes(policy as (typeof VALID)[number])
    ? (policy as (typeof VALID)[number])
    : 'refund-policy'

  useEffect(() => {
    document.title = 'Policies — EyeQ Vision Care'
  }, [])

  useEffect(() => {
    const el = document.getElementById(`policy-${active}`)
    if (el) el.scrollIntoView({ block: 'start' })
    else window.scrollTo(0, 0)
  }, [active])

  return (
    <div className="f-page" id="f-top">
      <RouteHeader current="policies" />
      <main id="f-content">
        <div className="f-hero">
          <h1 className="eyeq-h1">Terms and Policies</h1>
          <nav className="f-policy-nav" aria-label="Terms and Policies">
            {POLICIES.map((doc) => (
              <Link
                key={doc.slug}
                to={`/policies/${doc.slug}`}
                className="f-policy-link"
                aria-current={doc.slug === active ? 'true' : undefined}
              >
                {doc.title}
              </Link>
            ))}
          </nav>
          {/* [COPY NEEDED: Brampton legal entity + returns contact
              (COPY-DRAFTS.md rollup (b)). Bodies below are verbatim from the
              live site until the client supplies them; old-store strings
              (info@eyeq2020.ca, Burlington address, 2434804 Ontario Inc.)
              are preserved verbatim, never presented as the new store. */}
        </div>
        <div className="f-body">
          <div className="f-policy-article">
            {POLICIES.map((doc) => (
              <section key={doc.slug} id={`policy-${doc.slug}`} aria-label={doc.title}>
                <h2 className="f-policy-title">{doc.title}</h2>
                <div
                  className="f-richtext"
                  // Verbatim merchant HTML (see parts/policies-data.ts).
                  dangerouslySetInnerHTML={{ __html: doc.bodyHtml }}
                />
              </section>
            ))}
          </div>
        </div>
      </main>
      <RouteFooter />
    </div>
  )
}

// Lane F — /services (step 13). Light DOM, zero Canvas imports.
// Sections per PLAN-MASTER §3: H1 → 3 intro paras → 2 service blocks →
// 4 lens names → Essilor slideshow (3 slides) → insurance band → visit.
// All copy verbatim from B §§3–5; booking CTA same-tab (C §2).
import { useEffect, useState } from 'react'
import './parts/route.css'
import { RouteFooter, RouteHeader, VisitStrip } from './parts/chrome'
import {
  BOOKING_URL,
  INSURANCE_HEADING,
  INSURERS,
  LENS_NAMES_4,
  LENS_SLIDES,
  LENSES_HEADING,
  SERVICE_BLOCKS,
  SERVICES_H1,
  SERVICES_INTRO,
} from './parts/content'

function LensSlideshow() {
  const [index, setIndex] = useState(0)
  const total = LENS_SLIDES.length
  return (
    <div className="f-slides">
      <div aria-live="polite">
        {LENS_SLIDES.map((s, i) => (
          <article key={s.name} className={i === index ? 'f-slide is-active' : 'f-slide'} hidden={i !== index}>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
          </article>
        ))}
      </div>
      <p className="f-slide-count" aria-hidden="true">
        {index + 1} / {total}
      </p>
      <div className="f-slide-controls">
        <button
          type="button"
          className="f-slide-btn"
          onClick={() => setIndex((index - 1 + total) % total)}
          aria-label="Previous lens"
        >
          Prev
        </button>
        <button
          type="button"
          className="f-slide-btn"
          onClick={() => setIndex((index + 1) % total)}
          aria-label="Next lens"
        >
          Next
        </button>
        <div className="f-slide-dots" role="group" aria-label="Choose lens">
          {LENS_SLIDES.map((s, i) => (
            <button
              key={s.name}
              type="button"
              className="f-slide-dot"
              aria-label={s.name}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function Services() {
  useEffect(() => {
    document.title = 'Services — EyeQ Vision Care'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="f-page" id="f-top">
      <RouteHeader current="services" />
      <main id="f-content">
        <div className="f-hero">
          <h1 className="eyeq-h1">{SERVICES_H1}</h1>
          <p style={{ marginTop: 24 }}>
            <a className="f-btn" href={BOOKING_URL}>
              Book an exam
            </a>
          </p>
        </div>
        <div className="f-body">
          <section className="f-section">
            <div className="f-measure">
              {SERVICES_INTRO.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>
          </section>

          <section className="f-section">
            <ol className="f-ledger">
              {SERVICE_BLOCKS.map((block, i) => (
                <li key={block.heading} className="f-ledger-row">
                  <span className="f-ledger-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{block.heading}</h3>
                    <p>{block.text}</p>
                    {'cta' in block && (
                      <a className="f-btn" href={BOOKING_URL}>
                        {block.cta}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="f-section" aria-label={LENSES_HEADING}>
            <h2 className="eyeq-h2">{LENSES_HEADING}</h2>
            <ul className="f-lens-names">
              {LENS_NAMES_4.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <LensSlideshow />
          </section>

          <section className="f-insurance" aria-label={INSURANCE_HEADING}>
            <div className="f-insurance-inner">
              <h2 className="eyeq-h2">{INSURANCE_HEADING}</h2>
              <ul className="f-insurance-grid">
                {INSURERS.map((insurer) => (
                  <li key={insurer.name} className="f-insurance-cell">
                    <img src={insurer.logo} alt={insurer.name} loading="lazy" />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <VisitStrip />
        </div>
      </main>
      <RouteFooter />
    </div>
  )
}

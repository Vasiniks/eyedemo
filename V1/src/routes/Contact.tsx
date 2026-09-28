// Lane F — /contact (step 13). Light DOM, zero Canvas imports.
// Labels from B §8 (structure), values from brief §2. No form (none
// exists, C §3), no fax row (old fax is OLD-STORE data, B §8).
// Map embed + directions rebuilt for the new address (C §5 pattern).
import { useEffect, useState } from 'react'
import './parts/route.css'
import { RouteFooter, RouteHeader, VisitStrip } from './parts/chrome'
import {
  BOOKING_URL,
  CONTACT_LABELS,
  DIRECTIONS_URL,
  MAP_EMBED_URL,
  MAP_IFRAME_TITLE,
  STORE,
} from './parts/content'

export function Contact() {
  const [mapActive, setMapActive] = useState(false)

  useEffect(() => {
    document.title = 'Contact — EyeQ Vision Care'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="f-page" id="f-top">
      <RouteHeader current="contact" />
      <main id="f-content">
        <div className="f-hero">
          <h1 className="eyeq-h1">Contact</h1>
          <p style={{ marginTop: 24 }}>
            <a
              className="f-btn"
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book an exam
            </a>
          </p>
        </div>
        <div className="f-body">
          <section className="f-section">
            <ul className="f-facts">
              <li className="f-fact">
                <span className="f-fact-label">{CONTACT_LABELS.phone}</span>
                <a href={STORE.phoneHref}>{STORE.phoneDisplay}</a>
              </li>
              <li className="f-fact">
                <span className="f-fact-label">{CONTACT_LABELS.email}</span>
                <a href={STORE.emailHref}>{STORE.email}</a>
              </li>
              <li className="f-fact">
                <span className="f-fact-label">{CONTACT_LABELS.address}</span>
                <address>{STORE.address}</address>
              </li>
              <li className="f-fact">
                <span className="f-fact-label">{CONTACT_LABELS.hours}</span>
                <div>
                  {STORE.hours.map((h) => (
                    <div key={h.days}>
                      {h.days} {h.time}
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </section>

          <section className="f-map" aria-label="Map">
            <div className="f-map-frame">
              <iframe
                title={MAP_IFRAME_TITLE}
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={mapActive ? undefined : { pointerEvents: 'none' }}
              />
              {!mapActive && (
                <button
                  type="button"
                  className="f-map-veil"
                  onClick={() => setMapActive(true)}
                  aria-label="Activate the map"
                >
                  <span>Activate map</span>
                </button>
              )}
            </div>
            <div className="f-map-actions">
              <a
                className="f-btn"
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions
              </a>
              <a className="f-btn f-btn-ghost" href={STORE.phoneHref}>
                Call {STORE.phoneDisplay}
              </a>
            </div>
          </section>

          <VisitStrip bookingNewTab />
        </div>
      </main>
      <RouteFooter />
    </div>
  )
}

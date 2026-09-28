import { Link } from 'react-router-dom'
import { BOOKING_URL, STORE } from './content'

// Lane F local route chrome (header + footer) for secondary routes.
// Used ONLY inside src/routes/*.tsx (Lane F files). At integration, Lane B /
// the coordinator may replace this with the global Lane E Header/Footer —
// this component is deliberately self-contained so the swap is one import.
// Light pages: Paper bg, Ink text, official logo files, no invented content.

export function RouteHeader({ current }: { current: string }) {
  const bookingSameTab = current === 'services'
  return (
    <header className="f-header">
      <a className="f-skip" href="#f-content">
        Skip to content
      </a>
      <div className="f-header-inner">
        <Link to="/" className="f-brand" aria-label="EyeQ Vision Care — home">
          <img
            src="/web/eyeq-logo-header-original.png"
            alt="EyeQ Vision Care"
            className="f-brand-mark"
          />
        </Link>
        <nav className="f-nav" aria-label="Primary">
          <Link to="/" className={current === 'home' ? 'f-nav-link is-current' : 'f-nav-link'}>
            Home
          </Link>
          <Link
            to="/pages/services"
            className={current === 'services' ? 'f-nav-link is-current' : 'f-nav-link'}
          >
            Services
          </Link>
          <Link
            to="/pages/contact"
            className={current === 'contact' ? 'f-nav-link is-current' : 'f-nav-link'}
          >
            Contact
          </Link>
        </nav>
        <a
          className="f-book-pill"
          href={BOOKING_URL}
          {...(bookingSameTab ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          Book an exam
        </a>
      </div>
    </header>
  )
}

export function RouteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="f-footer">
      <div className="f-footer-inner">
        <div className="f-footer-store">
          <img src="/web/eyeq-logo-white.png" alt="" aria-hidden="true" className="f-footer-mark" />
          <p className="f-footer-name">EyeQ Vision Care</p>
          <address className="f-footer-address">
            {STORE.address}
            <br />
            <a href={STORE.phoneHref}>{STORE.phoneDisplay}</a>
            <br />
            <a href={STORE.emailHref}>{STORE.email}</a>
          </address>
          <p className="f-footer-hours">
            <span style={{ whiteSpace: 'nowrap' }}>Mon–Fri 11:00 am–6:30 pm</span>
            {' · '}
            <span style={{ whiteSpace: 'nowrap' }}>Sat 11:00 am–5:00 pm</span>
            {' · '}
            <span style={{ whiteSpace: 'nowrap' }}>Sun 11:00 am–4:00 pm</span>
          </p>
        </div>
        <nav className="f-footer-policies" aria-label="Terms and Policies">
          <p className="f-footer-heading">Menu</p>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/pages/services">Services</Link>
            </li>
            <li>
              <Link to="/pages/contact">Contact</Link>
            </li>
          </ul>
          <p className="f-footer-heading" style={{ marginTop: 24 }}>
            Terms and Policies
          </p>
          <ul>
            <li>
              <Link to="/policies/refund-policy">Refund policy</Link>
            </li>
            <li>
              <Link to="/policies/privacy-policy">Privacy policy</Link>
            </li>
            <li>
              <Link to="/policies/terms-of-service">Terms of service</Link>
            </li>
          </ul>
        </nav>
      </div>
      <p className="f-footer-copy">© {year} EyeQ Vision Care</p>
    </footer>
  )
}

/** Visit strip shared by Services (PLAN-MASTER §3, section 8).
 * Booking target follows the live behaviour per page: Services renders the
 * button same-tab (C §2); other placements use a new tab. */
export function VisitStrip({ bookingNewTab = false }: { bookingNewTab?: boolean }) {
  return (
    <section className="f-visit" aria-label="Visit our store">
      <div className="f-visit-inner">
        <div>
          <h2 className="eyeq-h2 f-visit-heading">Visit our store</h2>
          <address className="f-visit-address">{STORE.address}</address>
          <p className="f-visit-lines">
            <a href={STORE.phoneHref}>{STORE.phoneDisplay}</a>
            {' · '}
            <a href={STORE.emailHref}>{STORE.email}</a>
          </p>
          <p className="f-visit-lines">
            <span style={{ whiteSpace: 'nowrap' }}>Mon–Fri 11:00 am–6:30 pm</span>
            {' · '}
            <span style={{ whiteSpace: 'nowrap' }}>Sat 11:00 am–5:00 pm</span>
            {' · '}
            <span style={{ whiteSpace: 'nowrap' }}>Sun 11:00 am–4:00 pm</span>
          </p>
        </div>
        <div className="f-visit-ctas">
          <a
            className="f-btn"
            href={BOOKING_URL}
            {...(bookingNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            Book your Eye Exam today
          </a>
          <a
            className="f-btn f-btn-ghost"
            href="https://www.google.com/maps/dir/?api=1&destination=2-227+Vodden+St+East%2C+Brampton%2C+ON"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions
          </a>
        </div>
      </div>
    </section>
  )
}

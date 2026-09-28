import { useEffect, useRef, useState } from 'react';
import { store } from '../../data';

// Lane E — Header (PLAN-MASTER §3.1, step 11). Persistent minimal, never fully
// hidden: transparent over dark → translucent blur after 120px; official logo
// (white variant dark act / black white act — shape-identical); Book pill
// never unmounts; Menu 44×44 opens a 100vw×100dvh overlay; 2px film progress
// hairline; Skip-film control (sticky, dark act only, shortcut S handled in
// SkipLinks).
//
// theme: 'dark' while the film canvas is behind the header, 'light' once the
// white act scrolls under it (Lane B passes this from the conductor). In the
// Lane E harness both themes render for QA.

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function Header({
  theme = 'dark',
  progress = 0,
  showSkipFilm = false,
  onSkipFilm,
}: {
  theme?: 'dark' | 'light';
  progress?: number;
  showSkipFilm?: boolean;
  onSkipFilm?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // WHITE polish: hide on scroll-down / show on scroll-up (Book pill stays
  // mounted — the bar slides, nothing unmounts). Theme flips force a show.
  const [barHidden, setBarHidden] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);
  // Feedback E-round1 P0-3: the Skip-film control must never sit over white-act
  // (or footer) content. It shows only while the visitor is still ABOVE the
  // white act; once the white act is reached — or passed — it fades out and
  // stays out until they scroll back up into the film.
  const [pastFilm, setPastFilm] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lastYRef.current = window.scrollY;
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        tickingRef.current = false;
        const y = window.scrollY;
        setScrolled(y > 120);
        const dy = y - lastYRef.current;
        lastYRef.current = y;
        // Hide only once well into the page; any upward move (or theme/act
        // change below) reveals. Menu open pins the bar visible.
        if (y > 240 && dy > 6) setBarHidden(true);
        else if (dy < -2 || y <= 240) setBarHidden(false);
        const white = document.querySelector('#white-act');
        if (white) {
          const top = (white as HTMLElement).getBoundingClientRect().top + window.scrollY;
          setPastFilm(window.scrollY + window.innerHeight * 0.5 >= top);
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // WHITE polish: act change always reveals the bar (orientation first), and
  // the logo crossfade gets a 250ms mask so the dark↔paper swap never pops.
  // Render-phase adjust (idiomatic prev-value pattern — no set-state-in-effect).
  const [prevTheme, setPrevTheme] = useState(theme);
  if (prevTheme !== theme) {
    setPrevTheme(theme);
    setBarHidden(false);
    setSwapping(true);
  }
  useEffect(() => {
    if (!swapping) return;
    const t = window.setTimeout(() => setSwapping(false), 260);
    return () => window.clearTimeout(t);
  }, [swapping]);

  useEffect(() => {
    if (!menuOpen) return;
    closeBtnRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const skip = () => {
    if (onSkipFilm) {
      onSkipFilm();
      return;
    }
    document.querySelector('#white-act')?.scrollIntoView({ behavior: 'auto' });
  };

  // Hidden once the film is over: scrolled to/past the white act, or master
  // progress at the handoff (pinned-film case), or Lane B withholds it.
  const skipHidden = pastFilm || progress >= 0.985;

  return (
    <div className="eyeq-e">
      <header
        className={`eyeq-header eyeq-header--${theme}${scrolled ? ` is-scrolled--${theme}` : ''}${barHidden && !menuOpen ? ' is-hiddenbar' : ''}${swapping ? ' eyeq-header--swap' : ''}`}
      >
        <a className="eyeq-header__brand" href="/" aria-label="EyeQ Vision Care — home">
          <img
            src={theme === 'dark' ? '/web/eyeq-logo-white.png' : '/web/eyeq-logo-header-original.png'}
            alt=""
            width={800}
            height={373}
          />
        </a>
        <div className="eyeq-header__actions">
          <a
            className="eyeq-header__book"
            href={store.booking.url}
            target="_blank"
            rel="noopener"
          >
            Book an exam <span className="eyeq-arrow" aria-hidden="true">→</span>
          </a>
          <button
            ref={menuBtnRef}
            type="button"
            className="eyeq-header__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="eyeq-menu"
            onClick={() => setMenuOpen(true)}
          >
            MENU
          </button>
        </div>
        <div
          className="eyeq-header__progress"
          style={{ transform: `scaleX(${clamp01(progress).toFixed(3)})` }}
          aria-hidden="true"
        />
      </header>

      {showSkipFilm && (
        <button
          type="button"
          className={`eyeq-skipfilm${skipHidden ? ' is-hidden' : ''}`}
          onClick={skip}
          aria-hidden={skipHidden}
          tabIndex={skipHidden ? -1 : 0}
        >
          Skip film ↓
        </button>
      )}

      <div
        id="eyeq-menu"
        className={`eyeq-menu${menuOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="eyeq-menu__close"
          onClick={() => {
            setMenuOpen(false);
            menuBtnRef.current?.focus();
          }}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
        >
          ✕
        </button>
        <nav aria-label="Menu">
          {/* Brief §6d: menu may contain ONLY Home · Services · Contact + the
              Book-an-exam CTA (+ footer row policies/tel/address/hours below).
              No Frames/Browse frames/Catalog/Search/Account/Cart/socials. */}
          <ul className="eyeq-menu__list">
            <li><a href="/" tabIndex={menuOpen ? 0 : -1}>Home</a></li>
            <li><a href="/services" tabIndex={menuOpen ? 0 : -1}>Services</a></li>
            <li><a href="/contact" tabIndex={menuOpen ? 0 : -1}>Contact</a></li>
            <li>
              <a href={store.booking.url} target="_blank" rel="noopener" tabIndex={menuOpen ? 0 : -1}>
                Book an eye exam
              </a>
            </li>
          </ul>
        </nav>
        <div className="eyeq-menu__foot">
          <a href="/policies/refund-policy" tabIndex={menuOpen ? 0 : -1}>Refund policy</a>
          <a href="/policies/privacy-policy" tabIndex={menuOpen ? 0 : -1}>Privacy policy</a>
          <a href="/policies/terms-of-service" tabIndex={menuOpen ? 0 : -1}>Terms of service</a>
          <a href={store.phoneHref} tabIndex={menuOpen ? 0 : -1}>{store.phone}</a>
          <span>{store.address.full}</span>
          <span className="eyeq-numerals">{store.hoursInline}</span>
        </div>
        <a
          className="eyeq-menu__bookbar"
          href={store.booking.url}
          target="_blank"
          rel="noopener"
          tabIndex={menuOpen ? 0 : -1}
        >
          BOOK AN EYE EXAM
        </a>
      </div>
    </div>
  );
}

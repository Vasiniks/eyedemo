import { useEffect, useRef } from 'react';
import { store } from '../../data';

// Lane E — Footer (PLAN-MASTER §3.1/R6, Void). Store block (new store only) →
// Terms and Policies expander (Refund/Privacy/Terms trio) → © year EyeQ
// Vision Care → Replay film, Back to top (brief §6d: NO Browse frames /
// catalog link — nothing not on the live site). Map embed lives in
// Visit, never repeated here.
// WHITE polish: rise entrance + base hairline draw via .is-in (RM = static).
export function Footer({ onReplayFilm }: { onReplayFilm?: () => void }) {
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const replay = () => {
    if (onReplayFilm) {
      onReplayFilm();
      return;
    }
    try {
      sessionStorage.removeItem('eyeq-film-seen');
      localStorage.removeItem('eyeq-film-seen');
    } catch {
      /* storage unavailable — still replay from top */
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <footer ref={ref} className="eyeq-e eyeq-footer eyeq-footer__reveal">
      <div className="eyeq-footer__grid">
        <div className="eyeq-footer__store">
          <p className="eyeq-microcap eyeq-microcap--dark" style={{ margin: '0 0 16px' }}>
            VISIT OUR STORE
          </p>
          <address>
            {store.address.line1}, {store.address.line2}
            <br />
            <a href={store.directionsUrl} target="_blank" rel="noopener">
              Get directions
            </a>
            <br />
            <a href={store.phoneHref}>{store.phone}</a>
            <br />
            <a href={store.emailHref}>{store.email}</a>
            <br />
            <span className="eyeq-numerals">{store.hoursInline}</span>
          </address>
          <details className="eyeq-footer__policies">
            <summary>Terms and Policies</summary>
            <ul>
              <li><a href="/policies/refund-policy">Refund policy</a></li>
              <li><a href="/policies/privacy-policy">Privacy policy</a></li>
              <li><a href="/policies/terms-of-service">Terms of service</a></li>
            </ul>
          </details>
        </div>
        <nav className="eyeq-footer__nav" aria-label="Footer">
          <button type="button" onClick={replay}>
            Replay film
          </button>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top
          </button>
        </nav>
      </div>
      <div className="eyeq-footer__base">© {year} EyeQ Vision Care</div>
    </footer>
  );
}

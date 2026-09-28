import { useEffect, useRef, useState } from 'react';
import { store } from '../../data';

// Lane E — shared store bits used by WhiteSection (white act) and Visit (R5).
// All values verbatim from brief §2 via src/data/store.json.
// WHITE polish: hairline draws (scaleX 0→1) + staggered text via .is-in.

export function StoreLedger({ idPrefix = 'ledger' }: { idPrefix?: string }) {
  const ref = useRef<HTMLUListElement>(null);
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
      { threshold: 0.2, rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <ul ref={ref} className="eyeq-white__ledger eyeq-ledger-draw" aria-label="Store information" id={idPrefix}>
      <li>
        <span className="eyeq-ledger__k">Address</span>
        <span className="eyeq-ledger__v">
          {store.address.line1}, {store.address.line2}
        </span>
      </li>
      <li>
        <span className="eyeq-ledger__k">Phone</span>
        <span className="eyeq-ledger__v">
          <a href={store.phoneHref}>{store.phone}</a>
        </span>
      </li>
      <li>
        <span className="eyeq-ledger__k">Email</span>
        <span className="eyeq-ledger__v">
          <a href={store.emailHref}>{store.email}</a>
        </span>
      </li>
      {store.hours.map((h) => (
        <li key={h.days}>
          <span className="eyeq-ledger__k">{h.days}</span>
          <span className="eyeq-ledger__v eyeq-numerals">{h.time}</span>
        </li>
      ))}
    </ul>
  );
}

// F4-MAP: load the real map by default (no click gate). loading="lazy" keeps
// it off the critical path; scroll-safe wrapper (pointer-events none until
// click/tap or Ctrl/Cmd held) prevents wheel-trapping. Iframe title verbatim.
export function MapEmbed({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(false);
  const [modHeld, setModHeld] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      setModHeld(e.ctrlKey || e.metaKey);
    const onUp = () => setModHeld(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onUp);
    };
  }, []);
  const interactive = active || modHeld;
  return (
    <div>
      <div
        className={`eyeq-map eyeq-map--live${interactive ? ' is-active' : ''}`}
        style={compact ? { aspectRatio: '16 / 10' } : undefined}
        onClick={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onTouchStart={() => setActive(true)}
      >
        <iframe
          title={store.mapTitle}
          src={store.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        />
        <span className="eyeq-map__hint" aria-hidden="true">
          Click to interact · scroll passes through
        </span>
      </div>
      <a
        className="eyeq-map__dirs"
        href={store.directionsUrl}
        target="_blank"
        rel="noopener"
      >
        Get directions →
      </a>
    </div>
  );
}

import { useRef } from 'react';
import { store } from '../../data';

// Lane E — booking CTA (PLAN-MASTER §8; V3-MPAGE polish).
// Subtle magnetic ≤4px with rAF-lerped follow + eased release (power2-ish),
// fine-pointer only, RM/static otherwise. Text-roll y−100% + fill wipe
// 400ms expo.out live in lane-e.css; press scale .97.
// Homepage opens the scheduler _blank (brief §6c.3, exact http URL — never
// "fix" to https); Services page uses same-tab via newTab={false}.
const MAX_PULL = 4;

export function BookingCTA({
  label = store.booking.labelHomepage,
  newTab = true,
  variant = 'ink',
  size = 'standard',
  className = '',
}: {
  label?: string;
  newTab?: boolean;
  variant?: 'ink' | 'paper';
  size?: 'standard' | 'band';
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  const motionOK = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const step = () => {
    const el = ref.current;
    if (!el) return;
    const c = current.current;
    const t = target.current;
    c.x += (t.x - c.x) * 0.18;
    c.y += (t.y - c.y) * 0.18;
    if (Math.abs(c.x) < 0.05 && Math.abs(c.y) < 0.05 && t.x === 0 && t.y === 0) {
      el.style.transform = '';
      raf.current = 0;
      return;
    }
    el.style.transform = `translate(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px)`;
    raf.current = requestAnimationFrame(step);
  };
  const kick = () => {
    if (!raf.current) raf.current = requestAnimationFrame(step);
  };

  const onMove = (e: React.MouseEvent) => {
    if (!motionOK()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    target.current = {
      x: Math.max(-MAX_PULL, Math.min(MAX_PULL, dx * 0.04)),
      y: Math.max(-MAX_PULL, Math.min(MAX_PULL, dy * 0.08)),
    };
    kick();
  };
  const onLeave = () => {
    target.current = { x: 0, y: 0 };
    if (motionOK()) kick();
    else if (ref.current) ref.current.style.transform = '';
  };

  return (
    <a
      ref={ref}
      className={`eyeq-cta eyeq-cta--${variant}${size === 'band' ? ' eyeq-cta--band' : ''} ${className}`.trim()}
      href={store.booking.url}
      {...(newTab ? { target: '_blank', rel: 'noopener' } : {})}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span className="eyeq-cta__label" aria-hidden="true">
        <span>{label}</span>
        <span>{label}</span>
      </span>
      <span className="eyeq-sr-only">{label}</span>
      <span className="eyeq-cta__arrows" aria-hidden="true">
        <span className="eyeq-arrow">→</span>
        <span className="eyeq-arrow">→</span>
      </span>
    </a>
  );
}

// HOME — large premium "Book your eye exam" band (client request).
// Full-width Ink band carrying ONLY the verbatim live CTA label
// (BOOK YOUR EYE EXAM TODAY! → exact Deen-and-Associates scheduler URL,
// _blank on the homepage as on the live site — brief §6c.3, C §1).
// No invented copy: the band is the link, styled large. Micro-interaction
// is inherited from BookingCTA (magnetic ≤4px fine-pointer, fill wipe,
// arrow travel, press scale); motion is transform/opacity only, RM static.
// Rendered twice on the homepage: top of the white act (right after the
// film) and again before the footer — both from Lane E-owned components so
// no other lane's files are touched.
export function BookExamBand({ id }: { id?: string }) {
  return (
    <section
      className="eyeq-e eyeq-bookband"
      aria-label="Book your eye exam"
      {...(id ? { id } : {})}
    >
      <div className="eyeq-bookband__inner">
        <BookingCTA
          label={store.booking.labelHomepage}
          newTab
          variant="ink"
          size="band"
          className="eyeq-bookband__cta"
        />
      </div>
    </section>
  );
}

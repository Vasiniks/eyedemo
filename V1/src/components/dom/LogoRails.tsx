import { useEffect, useRef, useState } from 'react';
import { brands, insurers, insurerAriaLabel } from '../../data';
import type { LogoEntry } from '../../data';

// Lane E — LogoRails (PLAN-MASTER step 12, §1-C8, skill: marquee-loop).
// Two narrow vertical film-stock rails flanking the white-act column:
// left = eyewear brands (down-loop), right = insurers (up-loop) — continuous,
// OPPOSITE directions, 72px/s desktop / 44px/s mobile, linear, transform-only.
// Dark FILM STOCK (E-round1 P0-1): continuous Void strip (~120px desktop),
// sprocket perforations in Paper colour along both edges, light-knockout
// logos (brief §6c.2) placed DIRECTLY on the dark base (no inner tile),
// 10px frame numbers in Bone-dim / Lamp-amber at 60%, 1px Steel-edge frame
// dividers, film grain ≤3%, top/bottom edge masks ≥120px into Paper.
// Slow on hover/focus + IntersectionObserver offscreen-stop; RM = static
// marquee (vertical pair hidden).

const DESK_SPEED = 72;
const MOB_SPEED = 44;

function usePrefersReducedMotion() {
  const [rm, setRm] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setRm(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return rm;
}

function Frame({ logo, index }: { logo: LogoEntry; index: number }) {
  return (
    <div className={`eyeq-rail__frame${logo.hero ? ' eyeq-rail__frame--hero' : ''}`}>
      <div className="eyeq-rail__cell">
        <img src={logo.file} alt={logo.alt} loading="lazy" decoding="async" draggable={false} />
      </div>
      <div className="eyeq-rail__num" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  );
}

// Vertical rail: track holds 2 copies of the set; offset wraps over one set
// height. direction=+1 drifts down (offset −H→0), −1 drifts up (0→−H).
function Rail({
  logos,
  label,
  direction,
  running,
  speed,
}: {
  logos: LogoEntry[];
  label: string;
  direction: 1 | -1;
  running: boolean;
  speed: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ offset: 0, last: 0, vel: 1, hover: 1, target: 1, kick: 0, skew: 0 });
  const runningRef = useRef(running);
  const speedRef = useRef(speed);
  useEffect(() => {
    runningRef.current = running;
    speedRef.current = speed;
  }, [running, speed]);

  useEffect(() => {
    const track = trackRef.current;
    const set = setRef.current;
    const root = rootRef.current;
    if (!track || !set) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const st = stateRef.current;
    st.offset = direction === 1 ? -set.offsetHeight : 0;
    let raf = 0;
    let inView = true;
    // ±15% scroll-velocity coupling, lerped over ~400ms (PLAN-MASTER §8) +
    // WHITE polish: skew ≤2° with scroll velocity, eased back; frame numbers
    // tick via --rv (see lane-e.css) and the --hot glow while travelling.
    // V3-MPAGE: the rAF loop fully stops offscreen (IO-gated) — zero
    // offscreen animation work; it restarts on re-entry with a fresh clock.
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      st.kick = Math.max(-3, Math.min(3, (y - lastY) / 240));
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = (t: number) => {
      raf = 0;
      if (!inView) return;
      raf = requestAnimationFrame(tick);
      const h = set.offsetHeight || 1;
      if (!runningRef.current) {
        st.last = t;
        return;
      }
      const dt = Math.min(0.05, (t - st.last) / 1000 || 0.016);
      st.last = t;
      // Hover 72→20 eased over ~400ms (PLAN-MASTER §8).
      st.hover += (st.target - st.hover) * 0.12;
      const vTarget = Math.min(1.15, Math.max(0.85, 1 + Math.min(3, Math.abs(st.kick)) * 0.05));
      st.vel += (vTarget - st.vel) * 0.12;
      const step = speedRef.current * st.vel * st.hover * dt;
      if (direction === 1) {
        st.offset += step;
        if (st.offset >= 0) st.offset -= h;
      } else {
        st.offset -= step;
        if (st.offset <= -h) st.offset += h;
      }
      // Signed skew follows scroll velocity, decays to 0 when still.
      const skewTarget = Math.max(-2, Math.min(2, st.kick * 0.6));
      st.skew += (skewTarget - st.skew) * 0.12;
      st.kick *= 0.92;
      track.style.transform = `translate3d(0, ${st.offset.toFixed(1)}px, 0) skewY(${st.skew.toFixed(2)}deg)`;
      track.style.setProperty('--rv', (st.skew * 0.8).toFixed(2));
      rootRef.current?.classList.toggle('eyeq-rail--hot', Math.abs(st.kick) > 0.4);
    };
    st.last = performance.now();
    raf = requestAnimationFrame(tick);
    let io: IntersectionObserver | null = null;
    if (root && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          inView = entries.some((en) => en.isIntersecting);
          if (inView && !raf) {
            st.last = performance.now();
            lastY = window.scrollY;
            raf = requestAnimationFrame(tick);
          }
        },
        { threshold: 0 },
      );
      io.observe(root);
    }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      inView = false;
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [direction]);

  const setHover = (v: number) => {
    stateRef.current.target = v;
  };

  const copies = [0, 1];
  return (
    <div
      ref={rootRef}
      className="eyeq-rail"
      role="presentation"
      onMouseEnter={() => setHover(20 / 72)}
      onMouseLeave={() => setHover(1)}
      onFocus={() => setHover(20 / 72)}
      onBlur={() => setHover(1)}
    >
      <span className="eyeq-sr-only">{label}</span>
      <div className="eyeq-rail__body">
        <div className="eyeq-rail__edge" aria-hidden="true" />
        <div className="eyeq-rail__viewport">
          <div className="eyeq-rail__track" ref={trackRef}>
            {copies.map((c) => (
              <div
                key={c}
                ref={c === 0 ? setRef : undefined}
                className="eyeq-rail__set"
              >
                {logos.map((logo, i) => (
                  <Frame key={`${c}-${logo.name}`} logo={logo} index={i} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="eyeq-rail__edge" aria-hidden="true" />
      </div>
    </div>
  );
}

// Mobile horizontal marquee (68px, brands + insurers in one strip).
function MobileMarquee({ running, speed }: { running: boolean; speed: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(running);
  const speedRef = useRef(speed);
  useEffect(() => {
    runningRef.current = running;
    speedRef.current = speed;
  }, [running, speed]);

  useEffect(() => {
    const track = trackRef.current;
    const set = setRef.current;
    if (!track || !set) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // V3-MPAGE: the horizontal strip is mobile-only (desktop hides it via
    // CSS) — never spin its rAF on desktop viewports.
    const mq = window.matchMedia('(max-width: 767px)');
    let raf = 0;
    let offset = 0;
    let last = performance.now();
    // WHITE polish: same velocity skew as the vertical rails (skewX ≤2°).
    let kick = 0;
    let skew = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      kick = Math.max(-3, Math.min(3, (y - lastY) / 240));
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const tick = (t: number) => {
      raf = 0;
      if (!mq.matches) return;
      raf = requestAnimationFrame(tick);
      const w = set.offsetWidth || 1;
      if (!runningRef.current) {
        last = t;
        return;
      }
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      offset -= speedRef.current * dt;
      if (offset <= -w) offset += w;
      const skewTarget = Math.max(-2, Math.min(2, kick * 0.6));
      skew += (skewTarget - skew) * 0.12;
      kick *= 0.92;
      track.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    };
    if (mq.matches) raf = requestAnimationFrame(tick);
    const onChange = () => {
      if (mq.matches && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    mq.addEventListener('change', onChange);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      mq.removeEventListener('change', onChange);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const all = [...brands, ...insurers];
  return (
    <div className="eyeq-e eyeq-rails--mobile" role="presentation">
      <span className="eyeq-sr-only">Featured brands and accepted insurance plans</span>
      <div className="eyeq-rail__track--h" ref={trackRef}>
        {[0, 1].map((c) => (
          <div key={c} ref={c === 0 ? setRef : undefined} className="eyeq-rail__set--h">
            {all.map((logo) => (
              <div key={`${c}-${logo.name}`} className="eyeq-rail__cell">
                <img src={logo.file} alt="" loading="lazy" draggable={false} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function StaticGrid() {
  const all = [...brands, ...insurers];
  return (
    <div className="eyeq-e eyeq-rails--static" role="list" aria-label="Featured brands and accepted insurance plans">
      {all.map((logo) => (
        <figure key={logo.name} role="listitem">
          <div className="eyeq-rail__cell">
            <img src={logo.file} alt={logo.alt} loading="lazy" />
          </div>
          <figcaption>{logo.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

// Static single-side column (RM flank layout): labelled stack, no motion.
function StaticColumn({ logos, label }: { logos: LogoEntry[]; label: string }) {
  return (
    <div className="eyeq-e eyeq-railside--static" role="list" aria-label={label}>
      {logos.map((logo, i) => (
        <figure key={logo.name} role="listitem" style={{ margin: 0 }}>
          <div className="eyeq-rail__cell">
            <img src={logo.file} alt={logo.alt} loading="lazy" />
          </div>
          <figcaption className="eyeq-rail__num">{String(i + 1).padStart(2, '0')} · {logo.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function BrandRail({ running, speed }: { running: boolean; speed: number }) {
  return (
    <Rail logos={brands} label="Featured eyewear brands" direction={1} running={running} speed={speed} />
  );
}

export function InsurerRail({ running, speed }: { running: boolean; speed: number }) {
  return (
    <Rail logos={insurers} label="Accepted insurance plans" direction={-1} running={running} speed={speed} />
  );
}

// Screen-reader truth: real lists with text names (fixes live empty-alts).
export function RailsSrLists() {
  return (
    <>
      <ul className="eyeq-sr-only" aria-label="Featured eyewear brands">
        {brands.map((b) => (
          <li key={b.name}>{b.name}</li>
        ))}
      </ul>
      <ul className="eyeq-sr-only" aria-label={insurerAriaLabel}>
        {insurers.map((b) => (
          <li key={b.name}>{b.name}</li>
        ))}
      </ul>
    </>
  );
}

function useRailsRunning() {
  const rm = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  );
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((en) => en.isIntersecting)),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible;
  const speed = narrow ? MOB_SPEED : DESK_SPEED;
  return { rm, running, speed, wrapRef };
}

// White-act flank layout (ART §4.4 desktop geometry): Lane B places
// <WhiteActRails side="left"> … WhiteSection … <WhiteActRails side="right">.
// "pair" renders both rails (standalone bridge use).
// F4-RAILS: on ≥1280px the asides are viewport-fixed (v1.css) so the strips
// run white act → footer. This drives .is-live visibility + a 200px
// opacity/blur fade just before the footer; hidden while the film is on
// screen. 768–1279px / <768px are pure-CSS (sticky / hidden) — idle there.
const RAIL_FADE_PX = 200;

function useRailPlacement(wrapRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const apply = () => {
      const host = wrapRef.current?.closest('.v1-rail') as HTMLElement | null;
      if (!host) return;
      if (!mq.matches) {
        host.classList.remove('is-live', 'is-fade');
        host.style.opacity = '';
        host.style.filter = '';
        return;
      }
      const white = document.querySelector('#white-act');
      const footer = document.querySelector('.eyeq-footer');
      if (!white || !footer) return;
      const whiteTop = (white as HTMLElement).getBoundingClientRect().top + window.scrollY;
      const footerTop = (footer as HTMLElement).getBoundingClientRect().top + window.scrollY;
      const pastWhite = window.scrollY + window.innerHeight * 0.5 >= whiteTop;
      const dist = footerTop - (window.scrollY + window.innerHeight);
      if (!pastWhite || dist <= 0) {
        host.classList.remove('is-live');
        host.classList.add('is-fade');
        host.style.opacity = '';
        host.style.filter = '';
        return;
      }
      host.classList.add('is-live');
      host.classList.remove('is-fade');
      const fade = dist >= RAIL_FADE_PX ? 1 : Math.max(0, dist / RAIL_FADE_PX);
      host.style.opacity = fade.toFixed(3);
      host.style.filter = fade >= 1 ? '' : `blur(${((1 - fade) * 6).toFixed(2)}px)`;
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        apply();
      });
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    mq.addEventListener?.('change', apply);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mq.removeEventListener?.('change', apply);
    };
  }, [wrapRef]);
}

export function WhiteActRails({ side = 'pair' }: { side?: 'left' | 'right' | 'pair' }) {
  const { rm, running, speed, wrapRef } = useRailsRunning();
  useRailPlacement(wrapRef);
  if (rm) {
    if (side === 'pair') return <StaticGrid />;
    return side === 'left' ? (
      <StaticColumn logos={brands} label="Featured eyewear brands" />
    ) : (
      <StaticColumn logos={insurers} label="Accepted insurance plans" />
    );
  }
  return (
    <div className="eyeq-e" ref={wrapRef}>
      {side === 'pair' ? (
        <div className="eyeq-rails eyeq-rails--desktop" role="presentation">
          <BrandRail running={running} speed={speed} />
          <InsurerRail running={running} speed={speed} />
        </div>
      ) : (
        <div className="eyeq-railside" role="presentation" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div className="eyeq-rails eyeq-rails--desktop" role="presentation">
            {side === 'left' ? (
              <BrandRail running={running} speed={speed} />
            ) : (
              <InsurerRail running={running} speed={speed} />
            )}
          </div>
        </div>
      )}
      {side === 'pair' && <MobileMarquee running={running} speed={speed} />}
      {side === 'pair' && <RailsSrLists />}
    </div>
  );
}

// Mobile 68px horizontal marquee (brands + insurers in one strip). Lane B
// renders this below the white act on <768px; CSS hides it on desktop.
export function RailsMobileStrip() {
  const { rm, running, speed, wrapRef } = useRailsRunning();
  if (rm)
    return (
      <div className="eyeq-rails--mobile-static">
        <StaticGrid />
      </div>
    );
  return (
    <div className="eyeq-e" ref={wrapRef}>
      <MobileMarquee running={running} speed={speed} />
    </div>
  );
}

export function LogoRails() {
  return <WhiteActRails side="pair" />;
}

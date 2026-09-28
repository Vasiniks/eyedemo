import { useEffect, useRef, useState } from 'react';
import {
  store,
  SHOW_DRAFT_COPY,
  servicesIntro,
  servicesPrecis,
  lensHeading,
  lenses,
  brandHeading,
  brands,
  insurerHeading,
  insurerAriaLabel,
  insurers,
  reviewsHeading,
  reviewsSub,
  reviewsAggregate,
  reviewsAggregateSuffix,
  reviews,
  aboutBrampton,
  videoMeta,
} from '../../data';
import { BookingCTA, BookExamBand } from './BookingCTA';
import { MapEmbed } from './StoreBits';
import './photos.css';

// Lane E — rest-of-homepage sections R1–R5 (PLAN-MASTER §4, step 12-later/16).
// All on Paper until the footer. Editorial, no repetitive card grids
// (anti-slop A7): asymmetric About, ledger Services, one inverted Lenses
// block, 1+featured+5 Reviews, split Visit. Reveals: line-mask 0.9s expo.out
// via IntersectionObserver (.is-in once, top ~82%); RM = static (CSS).

// WHITE polish: one Reveal, four dialects (all expo.out, once, GPU-only).
// fade = y32 rise (default) · clip = clip-path wipe + inner scale settle ·
// rise = y36 + blur-free rise · scale = 0.96 settle · wipe = horizontal clip.
type RevealVariant = 'fade' | 'clip' | 'rise' | 'scale' | 'wipe';
const REVEAL_CLASS: Record<RevealVariant, string> = {
  fade: 'eyeq-e__reveal',
  clip: 'eyeq-e__reveal--clip',
  rise: 'eyeq-e__reveal--rise',
  scale: 'eyeq-e__reveal--scale',
  wipe: 'eyeq-e__reveal--wipe',
};

function Reveal({ children, className = '', as: Tag = 'div', variant = 'fade' as RevealVariant, ...rest }: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'figure' | 'ol' | 'ul';
  variant?: RevealVariant;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }
    // Clip-hidden elements have zero painted area, so IntersectionObserver
    // never reports them as intersecting — observe the parent instead and
    // mark the element itself. (Fade/rise/scale keep self-observation.)
    // The parent can be tall (a section), so gate on the ELEMENT's own
    // viewport position with a threshold ladder for repeated callbacks.
    const clipped = variant === 'clip' || variant === 'wipe';
    const target = clipped && el.parentElement ? el.parentElement : el;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          if (clipped && el.getBoundingClientRect().top > window.innerHeight * 0.85) return;
          el.classList.add('is-in');
          io.disconnect();
        });
      },
      clipped
        ? { threshold: [0, 0.12, 0.25, 0.5, 0.75, 1] }
        : { threshold: 0.12, rootMargin: '0px 0px -18% 0px' },
    );
    io.observe(target);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    // @ts-expect-error dynamic tag with className/ref
    <Tag ref={ref} className={`${REVEAL_CLASS[variant]} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

// WHITE polish: counts only real numbers (4.9 / 208 from reviews.json).
// Renders final text statically (no-JS correct), animates 0→target on entry.
function CountUp({ target, decimals = 0, duration = 1000 }: {
  target: number;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const finalText = target.toFixed(decimals);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.disconnect();
          const t0 = performance.now();
          const tick = (t: number) => {
            const raw = Math.min(1, (t - t0) / duration);
            const eased = raw >= 1 ? 1 : 1 - Math.pow(2, -10 * raw);
            el.textContent = (target * eased).toFixed(decimals);
            if (raw < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, decimals, duration]);
  return <span ref={ref}>{finalText}</span>;
}

function MaskedHeadline({ text, className = '', id }: { text: string; className?: string; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4, rootMargin: '0px 0px -18% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  const words = text.split(/\s+/);
  return (
    <h2 ref={ref} id={id} className={`${className}${shown ? ' is-in' : ''}`}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="eyeq-e__mask">
            <span style={{ transitionDelay: `${(i * 0.09).toFixed(2)}s` }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h2>
  );
}

// R1 — About. 3 paras byte-verbatim (Burlington/since-2018 intact);
// D13 Brampton block hairline-divided, NEVER spliced into the paras.
// HOME: the old-store interior video (B §2, C §1 PLAY VIDEO → Shopify CDN
// MP4) is INTENTIONALLY omitted — it shows the old Burlington interior.
// Listed in docs/phase4/qa/v3/HOME.md. The ABOUT US heading + verbatim copy
// carry the section; no poster, no player, no new copy invented.
export function AboutSection() {
  return (
    <section className="eyeq-e eyeq-section eyeq-about" aria-labelledby="about-h">
      <div className="eyeq-about__grid">
        <div>
          <MaskedHeadline id="about-h" text={videoMeta.heading} className="eyeq-h2 eyeq-section__h2" />
        </div>
        <div className="eyeq-about__body">
          {videoMeta.paragraphs.map((para, i) => (
            <Reveal key={i}>
              <p>{para}</p>
            </Reveal>
          ))}
          {/* D13 Brampton frame: brief §6d — DRAFT, hidden unless SHOW_DRAFT_COPY.
              Never spliced into the 3 verbatim paras above. */}
          {SHOW_DRAFT_COPY && (
          <Reveal>
            <div className="eyeq-about__brampton">
              <p>
                {aboutBrampton.text}
                <span className="eyeq-e__draft-tag" title="Client-approval draft (D13)">
                  DRAFT
                </span>
              </p>
              <address>
                {store.address.full} · <a href={store.phoneHref}>{store.phone}</a>
              </address>
            </div>
          </Reveal>
          )}
        </div>
      </div>
      {/* F5-PHOTOS: homepage-hero eyewear stack, eyeqoptical.ca (D §4).
          Right-offset editorial single; WebP srcset + LQIP bg; CLS-safe. */}
      <Reveal
        as="figure"
        className="eyeq-photo eyeq-photo--about"
      >
        <span className="eyeq-photo__mask" style={{ backgroundImage: 'url(/web/photos/about-eyewear-lqip.webp)' }}>
          <img
            src="/web/photos/about-eyewear-1024.webp"
            srcSet="/web/photos/about-eyewear-640.webp 640w, /web/photos/about-eyewear-1024.webp 1024w, /web/photos/about-eyewear-1600.webp 1600w"
            sizes="(max-width: 640px) 92vw, 560px"
            width={1024}
            height={954}
            loading="lazy"
            decoding="async"
            alt="Four eyeglass frames in black and tortoise stacked on a yellow background, as featured on the EyeQ homepage"
          />
        </span>
      </Reveal>
    </section>
  );
}

// HOME — Featured brands (B §9, verbatim). The 8 logos run persistently in
// the flanking film rails + mobile strip (LogoRails, unlinked as on the live
// site, DOM order intact); this section gives the live H2 its persistent
// white-act home with the 8 names as unlinked text in live order — nothing
// linked, nothing invented, Gucci-free (Gucci is services-page-only, B §9).
export function FeaturedBrandsSection() {
  return (
    <section className="eyeq-e eyeq-section eyeq-brands" aria-labelledby="brands-h">
      <MaskedHeadline id="brands-h" text={brandHeading} className="eyeq-h2 eyeq-section__h2" />
      <Reveal as="ol" className="eyeq-brands__list eyeq-ledger-draw">
        {brands.map((b, i) => (
          <li key={b.name}>
            <span className="eyeq-services__num eyeq-numerals" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="eyeq-brands__name">{b.name}</span>
          </li>
        ))}
      </Reveal>
    </section>
  );
}

// R2 — Services précis. Ledger rows 01–04, Fraunces numerals, sticky H2.
export function ServicesSection() {
  return (
    <section className="eyeq-e eyeq-section" aria-labelledby="services-h">
      <div className="eyeq-services__grid">
        <div className="eyeq-services__sticky">
          <MaskedHeadline id="services-h" text="Services" className="eyeq-h2 eyeq-section__h2" />
        </div>
        <div>
          <Reveal as="ol" className="eyeq-services__rows eyeq-ledger-draw">
            {servicesPrecis.map((s, i) => (
              <li key={s.name}>
                <span className="eyeq-services__num eyeq-numerals" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <h3 className="eyeq-services__name">{s.name}</h3>
                  {s.description && <p className="eyeq-services__desc">{s.description}</p>}
                </span>
              </li>
            ))}
          </Reveal>
          <Reveal>
            <p className="eyeq-section__lede">{servicesIntro[0]}</p>
            <a className="eyeq-services__more" href="/services">
              Services →
            </a>
          </Reveal>
          {/* F5-PHOTOS: trial-frame exam photo, live services imagery (D §4,
              eyeqburlington-3 — instrument close-up, no storefront/signage). */}
          <Reveal
            as="figure"
            className="eyeq-photo eyeq-photo--services"
          >
            <span className="eyeq-photo__mask" style={{ backgroundImage: 'url(/web/photos/services-exam-lqip.webp)' }}>
              <img
                src="/web/photos/services-exam-1024.webp"
                srcSet="/web/photos/services-exam-640.webp 640w, /web/photos/services-exam-1024.webp 1024w, /web/photos/services-exam-1600.webp 1600w"
                sizes="(max-width: 640px) 92vw, 800px"
                width={1024}
                height={366}
                loading="lazy"
                decoding="async"
                alt="Optometrist holding a trial frame toward the camera during an eye exam"
              />
            </span>
      </Reveal>
        </div>
      </div>
    </section>
  );
}

// R3 — Lenses. Single inverted block (Stage); 7 rows, 22px Fraunces; short
// verbatim use-lines for the 3 described lenses + Read more → /services.
// The 4 title-only lenses show names only (no descriptions exist on the live
// site). No use-case micro-caps: no verbatim source exists for them and Lane E
// invents nothing — see docs/phase4/requests/E-lenses-usecaps.md.
// F5-PHOTOS: lens imagery now supplied from the live site (polarised sunset
// + lens-tech overlay, D §4) — no Blender render, nothing invented.

export function LensesSection() {
  return (
    <section className="eyeq-e eyeq-section eyeq-lenses" aria-labelledby="lenses-h">
      <div className="eyeq-lenses__inner">
        <MaskedHeadline id="lenses-h" text={lensHeading} className="eyeq-h2" />
        <ul className="eyeq-lenses__rows">
          {lenses.map((lens) => (
            <Reveal as="li" key={lens.name} variant="wipe">
              <h3 className="eyeq-lenses__name">
                {lens.name.split(/(®|™)/g).map((part, i) =>
                  part === '®' || part === '™' ? (
                    <span key={i} className="eyeq-reg">
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </h3>
              {lens.short && <p className="eyeq-lenses__desc">{lens.short}</p>}
            </Reveal>
          ))}
        </ul>
        {/* F5-PHOTOS: lens stories from the live site (D §4) — polarised-lens
            sunset demo (wide) + lens-tech overlay close-up (offset single).
            Stacked asymmetric pair, not a grid; inverted-block captions. */}
        <Reveal
          as="figure"
          className="eyeq-photo eyeq-photo--lenses-wide"
        >
          <span className="eyeq-photo__mask" style={{ backgroundImage: 'url(/web/photos/lenses-polarized-lqip.webp)' }}>
            <img
              src="/web/photos/lenses-polarized-1024.webp"
              srcSet="/web/photos/lenses-polarized-640.webp 640w, /web/photos/lenses-polarized-1024.webp 1024w, /web/photos/lenses-polarized-1600.webp 1600w"
              sizes="(max-width: 640px) 92vw, 1024px"
              width={1024}
              height={672}
              loading="lazy"
              decoding="async"
              alt="Sunset over a lake seen through a tinted sunglass lens"
            />
          </span>
      </Reveal>
        <Reveal
          as="figure"
          className="eyeq-photo eyeq-photo--lenses-offset"
        >
          <span className="eyeq-photo__mask" style={{ backgroundImage: 'url(/web/photos/lenses-tech-lqip.webp)' }}>
            <img
              src="/web/photos/lenses-tech-1024.webp"
              srcSet="/web/photos/lenses-tech-640.webp 640w, /web/photos/lenses-tech-1024.webp 1024w, /web/photos/lenses-tech-1600.webp 1600w"
              sizes="(max-width: 640px) 92vw, 520px"
              width={1024}
              height={954}
              loading="lazy"
              decoding="async"
              alt="Close-up of a man wearing round eyeglasses with a lens-technology overlay, from the EyeQ services page"
            />
          </span>
      </Reveal>
        <Reveal>
          <a className="eyeq-lenses__more" href="/services">
            Read more →
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// HOME — Insurance (B §5, verbatim). The 8 insurer logos run in the right
// film rail + mobile strip (unlinked as on the live site, display order
// intact); this section gives the live heading its persistent white-act home
// with the 8 names as unlinked text in live order. Verbatim heading only —
// no direct-billing wording exists on the live site (brief §6c.7) and none
// is added here.
export function InsuranceSection() {
  return (
    <section className="eyeq-e eyeq-section eyeq-insurance" aria-labelledby="insurance-h">
      <MaskedHeadline id="insurance-h" text={insurerHeading} className="eyeq-h2 eyeq-section__h2" />
      <Reveal as="ol" className="eyeq-insurance__list eyeq-ledger-draw" aria-label={insurerAriaLabel}>
        {insurers.map((ins, i) => (
          <li key={ins.name}>
            <span className="eyeq-services__num eyeq-numerals" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="eyeq-brands__name">{ins.name}</span>
          </li>
        ))}
      </Reveal>
    </section>
  );
}

// R4 — Reviews. Aggregate only (no per-card stars); 1 featured + 5 compact.
// Counters animate ONLY the two real numbers (4.9 score, 208 count).
export function ReviewsSection() {
  const [featured, ...rest] = reviews;
  const countMatch = reviewsAggregateSuffix.match(/\d+/);
  const reviewCount = countMatch ? parseInt(countMatch[0], 10) : 0;
  const score = parseFloat(reviewsAggregate);
  return (
    <section className="eyeq-e eyeq-section" aria-labelledby="reviews-h">
      <Reveal>
        <p className="eyeq-microcap eyeq-microcap--light eyeq-section__eyebrow eyeq-e__microcap">
          {reviewsHeading}
        </p>
      </Reveal>
      <MaskedHeadline id="reviews-h" text={reviewsSub} className="eyeq-h2 eyeq-section__h2" />
      <Reveal variant="rise">
        <div className="eyeq-reviews__agg">
          <span className="eyeq-reviews__score eyeq-numerals">
            <CountUp target={score} decimals={1} />
          </span>
          <span className="eyeq-reviews__count">
            (<CountUp target={reviewCount} /> reviews)
          </span>
        </div>
      </Reveal>
      <div className="eyeq-reviews__grid">
        {featured && (
          <Reveal variant="scale" className="eyeq-review--featured">
            <figure className="eyeq-review eyeq-review--featured">
              <span className="eyeq-review__mono" aria-hidden="true">
                {featured.initials}
              </span>
              <blockquote className="eyeq-review__text">“{featured.text}”</blockquote>
              <figcaption className="eyeq-sr-only">Review by {featured.initials}</figcaption>
            </figure>
          </Reveal>
        )}
        {rest.map((r) => (
          <Reveal key={`${r.initials}-${r.text.slice(0, 12)}`} variant="rise">
            <figure className="eyeq-review">
              <span className="eyeq-review__mono" aria-hidden="true">
                {r.initials}
              </span>
              <blockquote className="eyeq-review__text">“{r.text}”</blockquote>
              <figcaption className="eyeq-sr-only">Review by {r.initials}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// R5 — Visit. Split: left hours/address/phone ledger, right Card-white
// booking card (48px Ink CTA + email underline). Map + GET DIRECTIONS.
export function VisitSection() {
  return (
    <section className="eyeq-e eyeq-section" aria-labelledby="visit-h">
      <Reveal>
        <p className="eyeq-microcap eyeq-microcap--light eyeq-section__eyebrow eyeq-e__microcap">
          VISIT OUR STORE
        </p>
      </Reveal>
      <MaskedHeadline id="visit-h" text="Visit our store" className="eyeq-h2 eyeq-section__h2" />
      <div className="eyeq-visit__grid">
        <Reveal as="ul" className="eyeq-visit__rows eyeq-ledger-draw" aria-label="Hours, address and phone">
          {store.hours.map((h) => (
            <li key={h.days}>
              <span className="eyeq-ledger__k">{h.days}</span>
              <span className="eyeq-numerals">{h.time}</span>
            </li>
          ))}
          <li>
            <span className="eyeq-ledger__k">Address</span>
            <span>
              {store.address.line1}, {store.address.line2}
            </span>
          </li>
          <li>
            <span className="eyeq-ledger__k">Phone</span>
            <span>
              <a href={store.phoneHref}>{store.phone}</a>
            </span>
          </li>
        </Reveal>
        <Reveal variant="scale" className="eyeq-visit__sticky">
          <div className="eyeq-visit__card">
            <BookingCTA label={store.booking.labelHomepage} newTab variant="ink" />
            <p>
              <a className="eyeq-visit__email" href={store.emailHref}>
                {store.email}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
      <Reveal variant="clip">
        <div className="eyeq-visit__map">
          <MapEmbed compact />
        </div>
      </Reveal>
      {/* HOME: the visit block links onward to the new Contact page. */}
      <Reveal>
        <a className="eyeq-visit__contact" href="/contact">
          Contact →
        </a>
      </Reveal>
    </section>
  );
}

export function HomeSections() {
  return (
    <div className="eyeq-sections">
      <AboutSection />
      <FeaturedBrandsSection />
      <ServicesSection />
      <LensesSection />
      <InsuranceSection />
      <ReviewsSection />
      <VisitSection />
      {/* HOME: second large book-exam band, immediately before the footer. */}
      <BookExamBand id="book-exam-bottom" />
    </div>
  );
}

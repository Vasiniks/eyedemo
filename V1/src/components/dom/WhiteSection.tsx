import { useEffect, useRef } from 'react';
import { BookExamBand } from './BookingCTA';
import { StoreLedger, MapEmbed } from './StoreBits';

// Lane E — WhiteSection: the white act tail (PLAN-MASTER §6-W, step 11).
// Centered 560–640px column on Paper #F5F1E8 (never pure #FFF): micro-cap
// EYEQ VISION CARE + black logo; single <h1> FROM EYE EXAMS TO EVERYDAY
// STYLE.; LARGE full-width book-exam band right after the film (HOME: client
// "add a LARGE Book exam" — verbatim label, scheduler, _blank); new-store
// ledger (brief §2); map rebuilt query + click-to-activate + directions.
// Old-store data NOWHERE.
//
// WHITE polish: H1 is a masked split-line reveal (2 authored lines, same words,
// yPercent 110→0, 1s expo.out, 0.10s stagger) with a subtle optical settle;
// micro-cap/logo rise first; RM = static.
const H1_LINES = ['FROM EYE EXAMS', 'TO EVERYDAY STYLE.'];
const H1_TEXT = 'FROM EYE EXAMS TO EVERYDAY STYLE.';

export function WhiteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const h1 = h1Ref.current;
    if (!section || !h1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('is-in');
      h1.classList.add('is-in', 'is-settled');
      return;
    }
    let settleTimer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            section.classList.add('is-in');
            h1.classList.add('is-in');
            // Optical-size/weight settle once the lines land (~1.2s).
            settleTimer = window.setTimeout(() => h1.classList.add('is-settled'), 1200);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(h1);
    return () => {
      io.disconnect();
      window.clearTimeout(settleTimer);
    };
  }, []);

  return (
    <section
      id="white-act"
      ref={sectionRef}
      className="eyeq-e eyeq-white eyeq-white-act"
      aria-label="EyeQ Vision Care — visit information"
      tabIndex={-1}
    >
      <div className="eyeq-white__grid">
        <div aria-hidden="true" />
        <div className="eyeq-white__col">
          <p className="eyeq-microcap eyeq-microcap--light eyeq-e__microcap eyeq-white__microcap">
            EYEQ VISION CARE
          </p>
          <img
            className="eyeq-white__logo"
            src="/web/eyeq-logo-header-original.png"
            alt="EyeQ Vision Care"
            width={800}
            height={373}
          />
          <h1 ref={h1Ref} className="eyeq-h1 eyeq-white__h1" aria-label={H1_TEXT}>
            {H1_LINES.map((line) => (
              <span key={line} className="wline-mask" aria-hidden="true">
                <span className="wline">{line}</span>
              </span>
            ))}
          </h1>
          <div className="eyeq-white__cta">
            <BookExamBand id="book-exam-top" />
          </div>
          <StoreLedger idPrefix="white-ledger" />
          <div className="eyeq-white__map">
            <MapEmbed />
          </div>
        </div>
        <div aria-hidden="true" />
      </div>
    </section>
  );
}

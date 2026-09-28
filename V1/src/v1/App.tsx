// V1-CORE — page assembly.
// Header (fixed, over everything) → film → WhiteSection flanked by LogoRails
// → rest-of-homepage Sections → Footer. Film last frame is paper-white; the
// white act uses the same Paper colour with no gap for a seamless handoff.
import { useEffect, useState } from 'react';
import {
  Header,
  WhiteSection,
  WhiteActRails,
  RailsMobileStrip,
  HomeSections,
  Footer,
} from '../components/dom/index';
import { FilmSequence } from './FilmSequence';
import { getFilmProgress, subscribeFilmProgress, useFilmProgress } from './progress';
import { initSnap } from './snap';
import { getLenis } from './lenis';

export default function App() {
  const p = useFilmProgress();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const onScroll = () => {
      const white = document.querySelector('#white-act');
      const whiteTop = white
        ? (white as HTMLElement).getBoundingClientRect().top
        : Number.POSITIVE_INFINITY;
      // Light once the white act scrolls under the header — or while the
      // film itself shows the paper-white end card (p >= 0.87).
      setTheme(whiteTop <= 64 || getFilmProgress() >= 0.87 ? 'light' : 'dark');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // Re-evaluate while the eased film progress settles after scroll stops.
    const unsub = subscribeFilmProgress(onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      unsub();
    };
  }, []);

  // POLISH-FILM handoff: the film's final frame is paper-white, so the
  // moment scrub progress reaches the tail, force the white-act H1 reveal
  // open exactly at the cut (add-only; WhiteSection's own IO is idempotent
  // with these classes, and this covers the case where the act hasn't yet
  // hit its 0.35 intersection threshold).
  useEffect(() => {
    let handedOff = false;
    return subscribeFilmProgress(() => {
      if (handedOff || getFilmProgress() < 0.985) return;
      handedOff = true;
      const section = document.querySelector('#white-act');
      const h1 = section?.querySelector('.eyeq-white__h1');
      section?.classList.add('is-in');
      h1?.classList.add('is-in');
      window.setTimeout(() => h1?.classList.add('is-settled'), 1200);
    });
  }, []);

  // V2-SNAP: gentle key-frame nudge, started once (no-op reduced-motion).
  useEffect(() => initSnap(getLenis()), []);

  const skipToWhite = () => {
    document.querySelector('#white-act')?.scrollIntoView({ behavior: 'auto' });
  };

  return (
    <div className="v1">
      <Header theme={theme} progress={p} showSkipFilm onSkipFilm={skipToWhite} />
      <main>
        <FilmSequence />
        <div className="v1-whitewrap">
          <aside className="v1-rail v1-rail--left" aria-hidden={false}>
            <WhiteActRails side="left" />
          </aside>
          <WhiteSection />
          <aside className="v1-rail v1-rail--right">
            <WhiteActRails side="right" />
          </aside>
        </div>
        <div className="v1-mobilestrip">
          <RailsMobileStrip />
        </div>
        <HomeSections />
      </main>
      <Footer onReplayFilm={() => window.scrollTo({ top: 0, behavior: 'auto' })} />
    </div>
  );
}

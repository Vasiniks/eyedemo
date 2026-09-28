import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../styles/tokens.css';
import '../../styles/film.css';
import '../../styles/rails.css';
import '../../styles/white.css';
import '../../components/dom/lane-e.css';
import { SkipLinks } from '../../components/dom/SkipLinks';
import { ChapterOverlay } from '../../components/dom/ChapterOverlay';
import { WhiteSection } from '../../components/dom/WhiteSection';
import { Header } from '../../components/dom/Header';
import { Footer } from '../../components/dom/Footer';
import { LogoRails, WhiteActRails, RailsMobileStrip, RailsSrLists } from '../../components/dom/LogoRails';
import { HomeSections } from '../../components/dom/Sections';

// Lane E isolated dev harness (PLAN-MASTER parallel-safety: own Vite entry,
// own port 5105). Long page: film-beat scrubber → white act + rails → rest
// sections → footer. Open via /dev-E.html on the Lane E dev server.
const STOPS = [0.05, 0.17, 0.32, 0.47, 0.62, 0.77, 0.885, 0.945, 0.985];

export function Harness() {
  const [progress, setProgress] = useState(0.62);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [stacked, setStacked] = useState(false);

  return (
    <div style={{ background: '#050607' }}>
      <SkipLinks />
      <Header
        theme={theme}
        progress={progress}
        showSkipFilm
        onSkipFilm={() => document.querySelector('#white-act')?.scrollIntoView()}
      />

      <div style={{ padding: '96px 32px 32px', maxWidth: 900, margin: '0 auto' }}>
        <p className="eyeq-microcap eyeq-microcap--dark">LANE E HARNESS — film progress scrubber</p>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          style={{ width: '100%' }}
          aria-label="Film progress"
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {STOPS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setProgress(s)}
              style={{
                background: 'none',
                border: '1px solid rgba(233,226,211,.24)',
                color: '#e9e2d3',
                borderRadius: 2,
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {s.toFixed(3)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, color: '#c5bca6', fontSize: 13 }}>
          <label>
            <input type="checkbox" checked={theme === 'light'} onChange={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} /> header light
          </label>
          <label>
            <input type="checkbox" checked={stacked} onChange={() => setStacked((v) => !v)} /> stacked (RM static)
          </label>
          <span className="eyeq-numerals">p = {progress.toFixed(3)}</span>
        </div>
      </div>

      {/* Dark act stand-in: void stage so ChapterOverlay reads on black */}
      <div id="film-pin" style={{ background: '#050607', borderTop: '1px solid rgba(233,226,211,.14)' }}>
        <ChapterOverlay progress={progress} mode={stacked ? 'stacked' : 'scrub'} />
      </div>

      <div id="content" />

      {/* White act with flanking rails (brief §4Q: rails hug the LEFT and
          RIGHT page edges, centre content readable between them). Full-bleed
          grid: rails at the extreme edges, WhiteSection centred. Production
          placement belongs to Lane B's Home; this harness proves the geometry. */}
      <div style={{ background: '#f5f1e8' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 640px) auto', width: '100%' }}>
          <div style={{ justifySelf: 'start' }}>
            <WhiteActRails side="left" />
          </div>
          <div style={{ justifySelf: 'center', width: '100%', maxWidth: 640 }}>
            <WhiteSection />
          </div>
          <div style={{ justifySelf: 'end' }}>
            <WhiteActRails side="right" />
          </div>
        </div>
        <RailsMobileStrip />
        <RailsSrLists />
      </div>
      <div style={{ background: '#f5f1e8', padding: '24px 32px' }}>
        <p className="eyeq-microcap eyeq-microcap--light">STANDALONE RAIL PAIR (LOOP QA)</p>
      </div>
      <div style={{ background: '#f5f1e8', paddingBottom: 48 }}>
        <LogoRails />
      </div>

      <HomeSections />
      <Footer />
    </div>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');
createRoot(root).render(<Harness />);

// V2-WORDS QA harness (dev only; mirrors the v1-text.html pattern).
// Full-viewport stage: REAL new-film frame (render-repo/out/frames, cover)
// + FilmCaptions + SidePanels at film progress p = (s-1)/614.
// Query: ?s=<source frame 1..615> ?guides=1 (safe-area overlay).
// Open e.g. http://localhost:5403/v1-words.html?s=100
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import FilmCaptions from './FilmCaptions';
import SidePanels from './SidePanels';
import './side.css';
import './captions.css';

const outFrame = (s: number): number => Math.round(1 + (s - 1) * (140 / 24));
const frameUrl = (s: number): string =>
  `/render-repo/out/frames/f_${String(outFrame(s)).padStart(5, '0')}.webp`;

const initial = (): number => {
  const q = new URLSearchParams(window.location.search).get('s');
  const v = q === null ? NaN : Number(q);
  return Number.isFinite(v) ? Math.min(615, Math.max(1, Math.round(v))) : 100;
};

function Harness() {
  const [s, setS] = useState<number>(initial);
  const guides = new URLSearchParams(window.location.search).get('guides') !== '0';
  const p = (s - 1) / 614;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        color: '#E9E2D3',
        fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
      }}
    >
      <div data-testid="words-stage" style={{ position: 'absolute', inset: 0 }}>
        <img
          src={frameUrl(s)}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <FilmCaptions progress={p} />
        {/* Real behaviour: progress-driven easings (not instant stills),
            so each screenshot shows exactly what the film shows at src s. */}
        <SidePanels progress={p} />
        {guides && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} data-testid="words-guides">
            {/* empty-side safe zones: outer 36% each side, 6% margin */}
            <div style={{ position: 'absolute', left: '6%', top: 0, bottom: 0, width: '30%', borderLeft: '1px dashed rgba(233,226,211,.5)', borderRight: '1px dashed rgba(233,226,211,.5)', background: 'rgba(233,226,211,.04)' }} />
            <div style={{ position: 'absolute', right: '6%', top: 0, bottom: 0, width: '30%', borderLeft: '1px dashed rgba(233,226,211,.5)', borderRight: '1px dashed rgba(233,226,211,.5)', background: 'rgba(233,226,211,.04)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 0, borderLeft: '1px solid rgba(233,226,211,.35)' }} />
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 12,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          fontSize: 12,
          background: 'rgba(0,0,0,.55)',
          padding: '6px 10px',
        }}
      >
        <strong data-testid="words-p">src {s} · p {p.toFixed(4)} · {`f_${String(outFrame(s)).padStart(5, '0')}`}</strong>
        <input
          data-testid="words-scrub"
          type="range"
          min={1}
          max={615}
          value={s}
          onChange={(e) => setS(Number(e.target.value))}
          style={{ flex: 1 }}
          aria-label="Source frame"
        />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Harness />
  </StrictMode>,
);

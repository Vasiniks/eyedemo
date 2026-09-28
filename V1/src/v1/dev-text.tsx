// EyeQ Vision Care — V1 TEXT isolated dev harness (owns this file + v1-text.html).
// Black stage + scrub slider driving FilmCaptions progress. Open
// http://localhost:5203/v1-text.html — set ?p=0.28 for a fixed beat.
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import FilmCaptions from './FilmCaptions';

const initial = (): number => {
  const q = new URLSearchParams(window.location.search).get('p');
  const v = q === null ? NaN : Number(q);
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.28;
};

function Harness() {
  const [p, setP] = useState<number>(initial);
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
      <div
        data-testid="v1cap-stage"
        style={{ position: 'absolute', inset: 0, background: '#000' }}
      >
        <FilmCaptions progress={p} />
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
        }}
      >
        <strong data-testid="v1cap-p">p {p.toFixed(3)}</strong>
        <input
          data-testid="v1cap-scrub"
          type="range"
          min={0}
          max={1000}
          value={Math.round(p * 1000)}
          onChange={(e) => setP(Number(e.target.value) / 1000)}
          style={{ flex: 1 }}
          aria-label="Film progress"
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

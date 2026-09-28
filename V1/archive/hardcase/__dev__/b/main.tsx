// EyeQ Vision Care — Lane B isolated dev entry (owns this file + dev-b.html).
// Suite: pin shell (#film-pin, same contract id) + FilmCanvas on box
// stand-ins + veil + HUD + white-stub. Proves steps 3/4/9 without touching
// Lane A/E files. Open http://localhost:5102/dev-b.html.

/* eslint-disable react-refresh/only-export-components -- Vite entry point:
 * components are intentionally local (Hud/FilmDev) and never imported. */
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Providers } from '../../app/providers'
import { FilmCanvas } from '../../components/canvas/FilmCanvas'
import { WhiteVeil } from '../../components/canvas/LensPortal'
import { StandInStage } from './StandIns'
import { BEATS } from '../../motion/chapters'
import { createFilmTimeline } from '../../motion/masterTimeline'
import { filmProgress, subscribeFilmProgress } from '../../motion/progress'
import { prefersReducedMotion } from '../../motion/lenis'
import { useFilmStore } from '../../store/useFilmStore'
import './dev-b.css'

/** DRAFT chapter eyebrows (COPY-DRAFTS.md D1/D3/D5/D6/D8/D10 — client sign-off). */
const DRAFT_EYEBROWS: Record<string, string> = {
  B1: 'DRAFT: 01 — Dark room',
  B2: 'DRAFT: 02 — Velvet',
  B3: 'DRAFT: 03 — Folded',
  B4: 'DRAFT: 04 — Rimless, black metal',
  B5: 'DRAFT: 05 — Lenses',
  B6: 'DRAFT: Carried in store — eight houses',
  B7: 'We Accept Most Major Insurance Plans',
  B8: 'DRAFT: — (geometry leads, no copy)',
  B9: 'DRAFT: — (handoff, no copy)',
}

function Hud() {
  const [snap, setSnap] = useState({ p: 0, beat: filmProgress.beat })
  useEffect(() => subscribeFilmProgress(() => setSnap({ ...filmProgress })), [])
  const quality = useFilmStore((s) => s.quality)
  const jump = (p: number): void => {
    window.__film?.setProgress(p)
  }
  return (
    <div id="film-hud" data-testid="film-hud">
      <div>
        beat <strong>{snap.beat}</strong> · p <strong>{snap.p.toFixed(3)}</strong> · tier{' '}
        <strong>{quality}</strong>
      </div>
      <input
        type="range"
        min={0}
        max={1000}
        value={Math.round(snap.p * 1000)}
        onChange={(e) => jump(Number(e.target.value) / 1000)}
        aria-label="Film progress (drives 3D ref only, scroll stays)"
      />
      <div className="hud-beats">
        {BEATS.map((b) => (
          <button key={b.id} type="button" onClick={() => jump(b.start + 0.001)} title={DRAFT_EYEBROWS[b.id]}>
            {b.id}
          </button>
        ))}
      </div>
      <div className="hud-eyebrow">{DRAFT_EYEBROWS[snap.beat]}</div>
    </div>
  )
}

function FilmDev() {
  useEffect(() => {
    const pin = document.getElementById('film-pin')
    if (!pin) return
    const handle = createFilmTimeline(pin, { reducedMotion: prefersReducedMotion() })
    return () => handle.destroy()
  }, [])

  return (
    <>
      <div id="film-pin">
        <FilmCanvas>
          <StandInStage />
        </FilmCanvas>
      </div>
      <Hud />
      {/* White-stub: unpinned DOM after the pin (11-white DOM stop target). */}
      <div id="white-stub" data-testid="white-stub">
        <p className="eyeq-microcap eyeq-microcap--light">EyeQ Vision Care (stub)</p>
        <h1>FROM EYE EXAMS TO EVERYDAY STYLE.</h1>
      </div>
      <WhiteVeil />
    </>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')
createRoot(root).render(
  <StrictMode>
    <Providers>
      <FilmDev />
    </Providers>
  </StrictMode>,
)

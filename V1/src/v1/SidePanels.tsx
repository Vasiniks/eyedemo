// V2-WORDS — editorial side panels for the FINAL film.
// One restrained panel per beat, living INSIDE the empty side's outer ~36%
// (6% safe margin from the edge), vertically centred on the empty area —
// docked headers (brands/insurers) sit above their WAVES constellation so
// the RIGHT lower half (215–325) and LEFT column (411–470) stay free.
// Masked-line reveals (overflow-hidden lines, yPercent 110→0, expo.out) +
// small count-ups for numbers; masked exit before the side flips. Pure
// function of film progress p: transforms/opacity only.
// Stats verbatim from B-content-inventory.md; catchphrases are
// client-requested DRAFTs — rendered ONLY when SHOW_DRAFT_COPY is set
// (brief §6d), always with a DRAFT tag.
import './side.css';
import {
  SIDE_PANELS,
  SHOW_DRAFT_COPY,
  LENS_NAMES,
  BRAND_COUNT,
  INSURANCE_HEADING,
  INSURER_COUNT,
  CATCHPHRASES,
  REVIEWS_SCORE,
  REVIEWS_COUNT,
  type PanelId,
} from './sideCopy';

const LENS_HEADING = 'Our Popular High-Definition Lenses';
const BRANDS_LABEL = 'Eyewear brands';

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (p: number, a: number, b: number): number => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// Motion language: expo.out entrances.
const expoOut = (t: number): number =>
  t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

/** Render ®/™ at 60% size without altering the verbatim strings. */
function Reg({ name }: { name: string }) {
  const parts = name.split(/([®™])/g);
  return (
    <>
      {parts.map((part, i) =>
        part === '®' || part === '™' ? (
          <span key={i} className="sd__reg" aria-hidden="true">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function MaskedLine({
  e,
  className,
  children,
}: {
  e: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className="sd__mask" aria-hidden={false}>
      <span
        className={className}
        style={{
          opacity: e,
          transform: `translateY(${((1 - e) * 110).toFixed(2)}%)`,
          filter: e > 0.98 ? undefined : `blur(${((1 - e) * 4).toFixed(2)}px)`,
        }}
      >
        {children}
      </span>
    </span>
  );
}

function Catchline({ index, e }: { index: number; e: number }) {
  // Brief §6d: DRAFT lines never render unless SHOW_DRAFT_COPY is set.
  if (!SHOW_DRAFT_COPY) return null;
  const c = CATCHPHRASES[index];
  if (!c) return null;
  return (
    <span className="sd__catch" style={{ opacity: e }}>
      <span className="sd__draft-tag">Draft</span>
      {c.line}
    </span>
  );
}

function PanelBody({ id, n, lineE, numE }: {
  id: PanelId;
  n: (target: number, decimals: number) => string;
  lineE: (i: number, count: number) => number;
  numE: number;
}) {
  switch (id) {
    case 'reviews':
      return (
        <>
          <p className="sd__eyebrow">
            <MaskedLine e={lineE(0, 3)}>Google reviews</MaskedLine>
          </p>
          <p className="sd__big eyeq-numerals" aria-label={`${REVIEWS_SCORE} stars, ${REVIEWS_COUNT} Google reviews`}>
            <MaskedLine e={lineE(1, 3)}>
              {n(REVIEWS_SCORE, 1)}
              <span className="sd__star" aria-hidden="true">
                {' '}
                ★
              </span>
            </MaskedLine>
          </p>
          <p className="sd__sub">
            <MaskedLine e={lineE(2, 3)}>{n(REVIEWS_COUNT, 0)} Google reviews</MaskedLine>
          </p>
          <Catchline index={0} e={numE} />
        </>
      );
    case 'lenses':
      return (
        <>
          <p className="sd__eyebrow">
            <MaskedLine e={lineE(0, 8)}>{LENS_HEADING}</MaskedLine>
          </p>
          <ul className="sd__names">
            {LENS_NAMES.map((name, i) => {
              const e = lineE(1 + i, 8);
              if (e <= 0.001) return null;
              return (
                <li
                  key={name}
                  className="sd__name"
                  style={{
                    opacity: e,
                    transform: `translateY(${((1 - e) * 10).toFixed(2)}px)`,
                  }}
                >
                  <span className="sd__index eyeq-numerals">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Reg name={name} />
                </li>
              );
            })}
          </ul>
          <Catchline index={1} e={numE} />
        </>
      );
    case 'brands':
      // Short header only — the RIGHT lower half stays free for WAVES.
      return (
        <>
          <p className="sd__eyebrow">
            <MaskedLine e={lineE(0, 2)}>{BRANDS_LABEL}</MaskedLine>
          </p>
          <p className="sd__big eyeq-numerals" aria-label={`${BRAND_COUNT} eyewear brands carried in store`}>
            <MaskedLine e={lineE(1, 2)}>{n(BRAND_COUNT, 0)}</MaskedLine>
          </p>
          <Catchline index={2} e={numE} />
        </>
      );
    case 'insurers':
      return (
        <>
          <p className="sd__eyebrow">
            <MaskedLine e={lineE(0, 2)}>
              {n(INSURER_COUNT, 0)} insurance plans
            </MaskedLine>
          </p>
          <p className="sd__head" aria-label={INSURANCE_HEADING}>
            <MaskedLine e={lineE(1, 2)}>{INSURANCE_HEADING}</MaskedLine>
          </p>
          <Catchline index={3} e={numE} />
        </>
      );
  }
}

function SidePanel({
  id,
  side,
  p0,
  p1,
  p,
  dockTop,
  instant,
}: {
  id: PanelId;
  side: 'left' | 'right';
  p0: number;
  p1: number;
  p: number;
  dockTop: boolean;
  instant: boolean;
}) {
  const enter = instant ? 1 : smooth(p, p0, p0 + 0.008);
  const exit = instant ? 0 : smooth(p, p1 - 0.012, p1);
  const op = Math.min(enter, 1 - exit);
  if (op <= 0.001) return null;

  // Per-line masked reveal, stagger in progress space, yPercent 110→0 expo.out.
  // Tight stagger so the 7-lens list lands fully by ~src 183 (mid-beat).
  // Exit reverses the stagger (last line out first) so the panel unthreads
  // cleanly instead of fading as a block while the side flips.
  const lineE = (i: number, count: number): number => {
    if (instant) return 1;
    const enterE = expoOut(clamp01((p - (p0 + 0.006 + i * 0.005)) / 0.014));
    const rev = Math.max(0, count - 1 - i);
    const exitE = smooth(p, p1 - 0.012 + rev * 0.0009, p1 - 0.008 + rev * 0.0009);
    return Math.min(enterE, 1 - exitE);
  };
  // Small count-up for numbers, settled well before the panel exits; snaps
  // exact at the top so tabular numerals never rest on a near-value.
  const numRaw = instant ? 1 : expoOut(clamp01((p - (p0 + 0.008)) / 0.03));
  const numT = numRaw > 0.999 ? 1 : numRaw;
  const n = (target: number, decimals: number): string =>
    instant
      ? target.toFixed(decimals)
      : (target * numT).toFixed(decimals);

  // Hairline draws left→right as the panel enters, retracts on exit.
  const ruleEnter = instant ? 1 : expoOut(clamp01((p - (p0 + 0.004)) / 0.012));
  const ruleE = instant ? 1 : Math.min(ruleEnter, 1 - exit);

  // Exit: masked drift ≤10px toward the edge + fade; transforms/opacity only.
  const drift = instant ? 0 : exit * (side === 'left' ? -10 : 10);

  return (
    <aside
      className={`sd sd--${side}${dockTop ? ' sd--docktop' : ''} sd--${id}`}
      style={{
        opacity: op.toFixed(3),
        transform: `translate(${drift.toFixed(2)}px, ${dockTop ? '0' : '-50%'})`,
      }}
      aria-hidden="true"
    >
      <span
        className={`sd__rule sd__rule--${side}`}
        aria-hidden="true"
        style={{ transform: `scaleX(${ruleE.toFixed(3)})`, opacity: ruleE.toFixed(3) }}
      />
      <PanelBody id={id} n={n} lineE={lineE} numE={instant ? 1 : op} />
    </aside>
  );
}

export default function SidePanels({
  progress,
  instant = false,
}: {
  progress: number;
  instant?: boolean;
}) {
  const p = clamp01(progress);
  return (
    <div className="sidedeck" aria-hidden="true">
      {SIDE_PANELS.map((d) => (
        <SidePanel
          key={d.id}
          id={d.id}
          side={d.side}
          p0={d.p0}
          p1={d.p1}
          p={p}
          dockTop={d.dockTop}
          instant={instant}
        />
      ))}
    </div>
  );
}

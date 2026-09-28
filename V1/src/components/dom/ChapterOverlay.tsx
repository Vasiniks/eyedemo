import { beats, lenses, brands, insurers, insurerAriaLabel, SHOW_DRAFT_COPY } from '../../data';
import type { DraftLine } from '../../data';

// Lane E — ChapterOverlay (PLAN-MASTER step 10, §6 beat table).
// Carries ALL film meaning: 9 dark-beat <section>s with real headings so the
// story survives without canvas. Restrained: eyebrow micro-caps + short
// display lines only; B8/B9 carry no copy (geometry leads).
//
// Driven EXCLUSIVELY by a progress prop (Lane B's master timeline passes
// filmProgress.p; Lane E never implements Lenis/scroll itself). Every visual
// state is a pure function of p: reload-at-depth, reverse and flick reproduce
// identical DOM. Masked line reveals (skill: masked-reveal) use line masks,
// 0.9s expo.out, stagger 0.09 (PLAN-MASTER §1-C9 white-headline token).
//
// mode="stacked" renders all beats statically (reduced-motion / no-JS branch,
// PLAN-MASTER §10: 9 static chapters with full DOM copy).

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

function beatLocal(p: number, start: number, end: number) {
  return clamp01((p - start) / Math.max(1e-6, end - start));
}

function DraftTag({ line }: { line: DraftLine }) {
  // Brief §6d: DRAFT lines are not rendered at all unless SHOW_DRAFT_COPY.
  if (!SHOW_DRAFT_COPY || !line.draft) return null;
  return (
    <span className="eyeq-e__draft-tag" title={`Client-approval draft (${line.ref ?? 'COPY-DRAFTS.md'})`}>
      DRAFT
    </span>
  );
}

// Brief §6d: a line renders only if it is verbatim or SHOW_DRAFT_COPY is set.
function visible(line: DraftLine | null | undefined): line is DraftLine {
  return !!line && (SHOW_DRAFT_COPY || !line.draft);
}

function MaskedWords({ text, shown, stagger = 0.09 }: { text: string; shown: boolean; stagger?: number }) {
  const words = text.split(/\s+/);
  return (
    <span className={shown ? 'is-in' : ''}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="eyeq-e__mask">
            <span
              style={{
                transitionDelay: `${(i * stagger).toFixed(2)}s`,
              }}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

function Reg({ name }: { name: string }) {
  // Renders ®/™ at 60%, roman, never bold (ART §1.2). Name is verbatim;
  // the visible parts already spell the full name (no sr-only duplicate).
  const parts = name.split(/(®|™)/g);
  return (
    <>
      {parts.map((part, i) =>
        part === '®' || part === '™' ? (
          <span key={i} className="eyeq-reg">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function ChapterOverlay({ progress = 0, mode = 'scrub' }: { progress?: number; mode?: 'scrub' | 'stacked' }) {
  const stacked = mode === 'stacked';
  const p = stacked ? 1 : clamp01(progress);

  return (
    <div className={`eyeq-e eyeq-chapters${stacked ? ' eyeq-chapters--stacked' : ''}`} data-testid="chapter-overlay">
      {beats.map((beat) => {
        const [s, e] = beat.range;
        const local = stacked ? 1 : beatLocal(p, s, e);
        const active = stacked || (p >= s && p <= e + 0.001);
        // Reveal over first 35% of the beat (expo-shaped), exit over last 20%
        // (shifts up 24px + fades, PLAN-MASTER §6-B2).
        const reveal = stacked ? 1 : expoOut(clamp01(local / 0.35));
        const exit = stacked ? 0 : clamp01((local - 0.8) / 0.2);
        const opacity = stacked ? 1 : active ? 1 - exit : 0;
        const rise = stacked ? 0 : (1 - reveal) * 24;

        const sectionStyle = stacked
          ? undefined
          : {
              opacity,
              transform: `translateY(${rise.toFixed(1)}px)`,
              visibility: (active ? 'visible' : 'hidden') as 'visible' | 'hidden',
            };

        return (
          <section
            key={beat.id}
            className={`eyeq-chapter eyeq-chapter--${beat.id.toLowerCase()}`}
            style={sectionStyle}
            aria-label={`Film chapter ${beat.id}`}
            aria-hidden={stacked ? undefined : !active}
          >
            <div className="eyeq-chapter__copy" aria-hidden="true" />
            {visible(beat.eyebrow) && (
              <p className="eyeq-microcap eyeq-microcap--dark eyeq-chapter__eyebrow">
                <MaskedWords text={beat.eyebrow.text} shown={stacked || reveal > 0.5} stagger={0.045} />
                <DraftTag line={beat.eyebrow} />
              </p>
            )}
            {visible(beat.display) && (
              <h2 className="eyeq-chapter__display">
                <MaskedWords text={beat.display.text} shown={stacked || reveal > 0.5} />
                <DraftTag line={beat.display} />
              </h2>
            )}
            {visible(beat.microLabel) && (
              <p className="eyeq-microcap eyeq-microcap--dark eyeq-chapter__microlabel">
                <MaskedWords text={beat.microLabel.text} shown={stacked || reveal > 0.5} stagger={0.045} />
                <DraftTag line={beat.microLabel} />
              </p>
            )}
            {visible(beat.heading) && (
              <h2 className="eyeq-chapter__b7head">
                <MaskedWords text={beat.heading.text} shown={stacked || reveal > 0.5} />
              </h2>
            )}
            {visible(beat.sub) && (
              <p className="eyeq-chapter__b7sub">
                {beat.sub.text}
                <DraftTag line={beat.sub} />
              </p>
            )}

            {beat.lensList && (
              <>
                <h3 className="eyeq-sr-only">High-definition lenses named in this chapter</h3>
                <ul className="eyeq-chapter__lenslist">
                  {lenses.map((lens, i) => {
                    // One name per ~1/7 of the beat (PLAN-MASTER §6-B5).
                    const q = stacked ? 1 : clamp01((local - 0.08 - i * 0.11) / 0.08);
                    return (
                      <li
                        key={lens.name}
                        style={stacked ? undefined : { opacity: expoOut(q), transform: `translateY(${((1 - expoOut(q)) * 12).toFixed(1)}px)` }}
                      >
                        <Reg name={lens.name} />
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {beat.brandList === 'brands' && (
              <ul className="eyeq-chapter__logosr" aria-label="Featured eyewear brands">
                {brands.map((b) => (
                  <li key={b.name}>{b.name}</li>
                ))}
              </ul>
            )}
            {beat.brandList === 'insurers' && (
              <ul className="eyeq-chapter__logosr" aria-label={insurerAriaLabel}>
                {insurers.map((b) => (
                  <li key={b.name}>{b.name}</li>
                ))}
              </ul>
            )}

            {!beat.eyebrow && !beat.display && !beat.heading && !beat.microLabel && (
              <h2 className="eyeq-sr-only">
                {beat.id === 'B8' ? 'Approaching the lens' : 'Passing through the lens into daylight'}
              </h2>
            )}
            {/* Brief §6d: when DRAFT copy is hidden a beat may carry no visible
                caption (its 3D/logos still tell the story) — keep a screen-reader
                heading so the 9-chapter story survives without canvas. */}
            {(() => {
              const hasVisibleCopy =
                visible(beat.eyebrow) || visible(beat.display) || visible(beat.heading) || visible(beat.microLabel);
              if (hasVisibleCopy || (!beat.eyebrow && !beat.display && !beat.heading && !beat.microLabel)) return null;
              return <h2 className="eyeq-sr-only">Film chapter {beat.id}</h2>;
            })()}
          </section>
        );
      })}
    </div>
  );
}

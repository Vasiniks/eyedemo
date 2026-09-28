import { tokens } from '../tokens'

// Lane A acceptance page: type scale + swatches on Void and Paper (§2).
// Screenshot targets: docs/phase4/qa/A/tokens-1440.png + tokens-390.png.
// No business copy; specimens use neutral words (never VISION/FOCUS/CLARITY).
const swatches: Array<[string, string]> = [
  ['Void', tokens.void],
  ['Stage', tokens.stage],
  ['Graphite-800', tokens.graphite800],
  ['Graphite-700', tokens.graphite700],
  ['Graphite-600', tokens.graphite600],
  ['Steel-edge', tokens.steelEdge],
  ['Muted-on-dark', tokens.mutedOnDark],
  ['Velvet-shadow', tokens.velvetShadow],
  ['Oxblood', tokens.oxblood],
  ['Oxblood-lift', tokens.oxbloodLift],
  ['Sheen', tokens.sheen],
  ['Bone', tokens.bone],
  ['Bone-dim', tokens.boneDim],
  ['Paper', tokens.paper],
  ['Card-white', tokens.cardWhite],
  ['Ink', tokens.ink],
  ['Ink-body', tokens.inkBody],
  ['Ink-muted', tokens.inkMuted],
  ['Lamp-amber', tokens.lampAmber],
]

function SwatchGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 16,
      }}
    >
      {swatches.map(([name, hex]) => (
        <figure key={name} style={{ margin: 0 }}>
          <div
            style={{
              background: hex,
              height: 64,
              borderRadius: 2,
              border: '1px solid rgba(128,128,128,0.4)',
            }}
          />
          <figcaption style={{ fontSize: 12, marginTop: 8 }}>
            {name}
            <br />
            <span className="eyeq-numerals">{hex}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function TypeScale({ dark }: { dark: boolean }) {
  const cap = dark ? 'eyeq-microcap eyeq-microcap--dark' : 'eyeq-microcap eyeq-microcap--light'
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <p className={cap}>Micro-cap · 11px Inter 500 +0.18em</p>
        <p className="eyeq-display">Display — Fraunces 300, evening frames</p>
      </div>
      <h2 className="eyeq-h2">
        H2 — Fraunces 300 <em>with one allowed italic</em>
      </h2>
      <p style={{ fontSize: 22, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400 }}>
        H3 — Fraunces 400, 22px
      </p>
      <p>Body — Inter 400, 16px/26px. The quick brown fox jumps over the lazy dog 0123456789.</p>
      <p style={{ fontSize: 14, lineHeight: 1.55 }}>
        Small — Inter 400, 14px/22px. Pack my box with five dozen liquor jugs.
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.5 }}>
        Lens-name list — 13px Inter roman, ® at 60%: Varilux<span style={{ fontSize: '60%' }}>®</span>{' '}
        Physio Extensee<span style={{ fontSize: '60%' }}>™</span>
      </p>
      <p className="eyeq-numerals">Numerals — Inter 600 tabular: 905-497-0227 · 4.9 (208)</p>
    </div>
  )
}

export function TokensQA() {
  return (
    <main>
      <section style={{ background: tokens.void, color: tokens.bone, padding: '56px 32px' }}>
        <p className="eyeq-microcap eyeq-microcap--dark">Lane A · tokens on Void</p>
        <h1 className="eyeq-h1">Type scale + swatches</h1>
        <div style={{ height: 32 }} />
        <TypeScale dark />
        <div style={{ height: 48 }} />
        <SwatchGrid />
      </section>
      <section style={{ background: tokens.paper, color: tokens.inkBody, padding: '56px 32px' }}>
        <p className="eyeq-microcap eyeq-microcap--light">Lane A · tokens on Paper</p>
        <h1 className="eyeq-h1" style={{ color: tokens.ink }}>
          Type scale + swatches
        </h1>
        <div style={{ height: 32 }} />
        <TypeScale dark={false} />
        <div style={{ height: 48 }} />
        <SwatchGrid />
      </section>
    </main>
  )
}

// Lane D isolated dev harness (PLAN-MASTER step 7/8 QA).
// Own files only: dev-D.html + this module. Never imported by the real app;
// integration into Home happens in Lane B after all lanes finish.
// Open http://localhost:5104/dev-D.html — progress slider + wave stops +
// legibility readout. Drive headlessly via window.__D.setProgress(p).

import { Suspense, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { SceneStage, exposureFor, fogDensityFor } from '../../canvas/SceneStage'
import { SponsorField, projectedHeightPx, type WaveFilter } from '../../canvas/SponsorField'
import { computeSlots } from '../../canvas/stage/slots'
import { FALLBACK_ASPECTS, logosFor } from '../../canvas/stage/logos'
import { clamp01, smoothstep } from '../../canvas/stage/math'

declare global {
  interface Window {
    __D: { setProgress: (p: number) => void; getProgress: () => number }
  }
}

type CompactMode = 'auto' | 'on' | 'off'

const STOPS: [string, number][] = [
  ['B1 case', 0.05],
  ['B2 velvet', 0.17],
  ['B5 info', 0.62],
  // Round-2 flight sequence: Miu Miu (W1 i=3, start 0.733, flight 0.060) —
  // tiny → rush → decel → settled.
  ['W1 seq tiny', 0.741],
  ['W1 seq rush', 0.745],
  ['W1 seq decel', 0.752],
  ['W1 seq settled', 0.8],
  ['W1 settled', 0.85],
  ['W2 flight', 0.87],
  ['W1+W2 settled', 0.96],
]

/** Harness camera FOV: base 35 desk / 44 mobile (+9°) + W1 kick +8 / W2 kick +3. */
export function fovFor(p: number, mobile: boolean): number {
  const w1 = Math.sin(Math.PI * clamp01((p - 0.7) / 0.15))
  const w2 = Math.sin(Math.PI * clamp01((p - 0.85) / 0.07))
  return (mobile ? 44 : 35) + 8 * Math.pow(w1, 0.8) + 3 * Math.pow(w2, 0.8)
}

// Round 2: harness frames with the REAL film numbers (feedback D-round1 P0-1,
// requests/D-camera-notes.md) so QA matches the film: wave-beat hold ≈0.78 m
// desktop, ≥1.5 m mobile. Do NOT "improve" these for prettier captures.
const CAM_POS = new THREE.Vector3(0, 0.02, 0.78)
const CAM_POS_MOBILE = new THREE.Vector3(0, 0.0, 1.52)
const CAM_TGT = new THREE.Vector3(0, -0.02, -0.12)
const CAM_TGT_MOBILE = new THREE.Vector3(0, -0.1, -0.1)

function HarnessCamera({ progress, mobile }: { progress: number; mobile: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  useFrame(() => {
    const p = clamp01(progress)
    camera.position.copy(mobile ? CAM_POS_MOBILE : CAM_POS)
    camera.lookAt(mobile ? CAM_TGT_MOBILE : CAM_TGT)
    camera.fov = fovFor(p, mobile)
    camera.updateProjectionMatrix()
    // Harness-owned stand-in for Lane B's conductor (CameraRig/sampleCamera
    // owns these in production per B §4 — single writer). Uses Lane D ramps.
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = exposureFor(p)
    const fog = scene.fog
    if (fog && fog instanceof THREE.FogExp2) fog.density = fogDensityFor(p)
  })
  return null
}

/** Graphite stand-in so stage lighting reads without Lane C heroes.
 *  HARNESS ONLY — never ships; Lane C owns the real case + glasses.
 *  Round 2: two poses from master progress — centre-close for B1–B5, then a
 *  drift to right-third for B6+ (PLAN-MASTER §6 B6: "glasses drift
 *  right-third"), so wave captures prove the hero exclusion zone. */
function StandIn({ progress, mobile }: { progress: number; mobile: boolean }) {
  const p = clamp01(progress)
  const drift = smoothstep(0.7, 0.75, p)
  // Wave beats: shrink to glasses-scale (~110 mm ≈ the real rimless width).
  // Desktop parks centre-right-low (B6 "glasses drift right-third"); mobile
  // parks top-left (PLAN-MASTER §6: object top-of-frame, copy bottom-sheet),
  // leaving the lower frame to the logo bands. Captures prove non-overlap.
  const pos: [number, number, number] = mobile
    ? [0 - 0.06 * drift, -0.02 + 0.19 * drift, 0.12 + -0.14 * drift]
    : [0 + 0.1 * drift, -0.02 + -0.01 * drift, 0.12 + -0.14 * drift]
  const s = 1 - (mobile ? 0.5 : 0.45) * drift
  return (
    <group position={pos} scale={s} rotation={[0.1, -0.35, 0]}>
      <RoundedBox args={[0.2, 0.045, 0.07]} radius={0.008} smoothness={3}>
        <meshStandardMaterial color="#121519" metalness={0.6} roughness={0.45} />
      </RoundedBox>
      <mesh position={[0.02, 0.028, 0.005]} rotation={[-Math.PI / 2 + 0.15, 0, 0.1]}>
        <circleGeometry args={[0.032, 48]} />
        <meshPhysicalMaterial
          color="#05070a"
          metalness={0.1}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={0.7}
        />
      </mesh>
    </group>
  )
}

function useCanvasHeight(): number {
  const [h, setH] = useState(() => window.innerHeight)
  useEffect(() => {
    const onResize = () => setH(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return h
}

function LegibilityReadout({ compact, canvasH }: { compact: boolean; canvasH: number }) {
  const rows = useMemo(() => {
    const out: { wave: string; name: string; hPx: number; wPx: number }[] = []
    for (const wave of ['w1', 'w2'] as const) {
      const logos = logosFor(wave)
      const aspects = logos.map((l) => FALLBACK_ASPECTS[l.id] ?? 2)
      const slots = computeSlots(wave, aspects, compact)
      const fov = wave === 'w1' ? 35 : 38
      slots.forEach((s, i) => {
        const dist = CAM_POS.z - s.pos[2]
        const hPx = projectedHeightPx(s.size[1], dist, fov, canvasH)
        out.push({ wave, name: logos[i].name, hPx, wPx: hPx * aspects[i] })
      })
    }
    return out
  }, [compact, canvasH])
  const minH = Math.min(...rows.map((r) => r.hPx))
  const minW = Math.min(...rows.map((r) => r.wPx))
  return (
    <div>
      <div style={{ color: minH >= 28 ? '#9fd49f' : '#e0a3a3' }}>
        settled min height {minH.toFixed(0)}px · min width {minW.toFixed(0)}px (floor: readable @canvas height{' '}
        {canvasH}px)
      </div>
      {rows.map((r) => (
        <div key={`${r.wave}-${r.name}`} style={{ color: '#8F97A3' }}>
          [{r.wave}] {r.name}: {r.wPx.toFixed(0)}×{r.hPx.toFixed(0)}px
        </div>
      ))}
    </div>
  )
}

function readParams(): {
  p: number
  wave: WaveFilter
  standin: boolean
  streaks: boolean | null
  compactMode: CompactMode
  ui: boolean
  solo: number | undefined
} {
  const q = new URLSearchParams(window.location.search)
  const p = Number(q.get('p') ?? '0.775')
  const w = q.get('waves') ?? q.get('wave') ?? 'both'
  const soloRaw = Number(q.get('solo') ?? '')
  return {
    p: Number.isFinite(p) ? clamp01(p) : 0.775,
    wave: w === '1' || w === 'w1' ? 1 : w === '2' || w === 'w2' ? 2 : 'both',
    standin: q.get('standin') !== '0',
    streaks: q.get('streaks') === '0' ? false : q.get('streaks') === '1' ? true : null,
    compactMode: q.get('compact') === 'on' ? 'on' : q.get('compact') === 'off' ? 'off' : 'auto',
    ui: q.get('ui') !== '0',
    solo: q.get('solo') === null || !Number.isInteger(soloRaw) || soloRaw < 0 || soloRaw > 7 ? undefined : soloRaw,
  }
}

function App() {
  const initial = useMemo(readParams, [])
  const [p, setP] = useState(initial.p)
  const [wave, setWave] = useState<WaveFilter>(initial.wave)
  const [standin, setStandin] = useState(initial.standin)
  const [streaks, setStreaks] = useState<boolean | null>(initial.streaks)
  const [compactMode, setCompactMode] = useState<CompactMode>(initial.compactMode)
  const canvasH = useCanvasHeight()
  const narrow = window.innerWidth < 768
  const compact = compactMode === 'on' || (compactMode === 'auto' && narrow)

  useEffect(() => {
    window.__D = { setProgress: (v: number) => setP(clamp01(v)), getProgress: () => p }
  }, [p])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050607' }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 35, near: 0.01, far: 60, position: CAM_POS.toArray() }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <HarnessCamera progress={p} mobile={narrow} />
        <SceneStage progress={p} />
        <Suspense fallback={null}>
          <SponsorField
            progress={p}
            wave={wave}
            streaks={streaks ?? undefined}
            compact={compactMode === 'auto' ? undefined : compactMode === 'on'}
            solo={initial.solo}
          />
        </Suspense>
        {standin && (
          <Suspense fallback={null}>
            <StandIn progress={p} mobile={narrow} />
          </Suspense>
        )}
      </Canvas>
      {initial.ui && (
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          maxWidth: 430,
          padding: '10px 12px',
          background: 'rgba(5,6,7,0.82)',
          border: '1px solid rgba(233,226,211,0.14)',
          borderRadius: 2,
          color: '#E9E2D3',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: '#C5BCA6' }}>
          LANE D harness · p={p.toFixed(3)} · fov={fovFor(p, narrow).toFixed(1)}° ·{' '}
          {compact ? 'compact' : 'full'} · {standin ? 'stand-in ON' : 'stand-in off'}
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={p}
          onChange={(e) => setP(Number(e.target.value))}
          style={{ width: '100%' }}
          aria-label="Film progress"
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {STOPS.map(([label, v]) => (
            <button key={label} onClick={() => setP(v)} style={btn(p === v)}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
          {(['both', 1, 2] as WaveFilter[]).map((w) => (
            <button key={String(w)} onClick={() => setWave(w)} style={btn(wave === w)}>
              wave:{w === 'both' ? 'both' : `w${w}`}
            </button>
          ))}
          <button onClick={() => setStreaks(streaks === null ? true : streaks ? false : null)} style={btn(false)}>
            streaks:{streaks === null ? 'auto' : streaks ? 'on' : 'off'}
          </button>
          <button
            onClick={() => setCompactMode(compactMode === 'auto' ? 'on' : compactMode === 'on' ? 'off' : 'auto')}
            style={btn(false)}
          >
            compact:{compactMode}
          </button>
          <button onClick={() => setStandin(!standin)} style={btn(standin)}>
            stand-in
          </button>
        </div>
        <div style={{ marginTop: 6 }}>
          <LegibilityReadout compact={compact} canvasH={canvasH} />
        </div>
      </div>
      )}
    </div>
  )
}

function btn(active: boolean): React.CSSProperties {
  return {
    background: active ? '#E9E2D3' : 'transparent',
    color: active ? '#050607' : '#E9E2D3',
    border: '1px solid rgba(233,226,211,0.24)',
    borderRadius: 2,
    fontSize: 11,
    padding: '2px 6px',
    cursor: 'pointer',
  }
}

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root')
createRoot(root).render(<App />)

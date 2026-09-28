/* eslint-disable react-refresh/only-export-components -- Lane C QA harness:
 * single-file dev entry (dev-C.html), never ships; fast-refresh irrelevant. */
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { CaseRig } from '../../canvas/CaseRig'
import { GlassesRig, type FoldAxis } from '../../canvas/GlassesRig'
import { caseFlapAngle, glassesFold, smoothstep } from '../../canvas/rigs/progressMap'
import { runLaneCVerification, type LaneCVerifyResult } from './verify'

/**
 * Lane C isolated dev harness (owns: dev-C.html + src/__dev__/C/*).
 * TEMPORARY lights — the film's real stage belongs to Lane D (SceneStage).
 * URL params for scripted QA captures:
 *   ?q=0.35 &mode=both|case|glasses &inspectFolded=1
 *   &foldAxis=y &signR=1 &signL=-1 &ui=0 &side=1 &macro=1
 *   &g=/models/glasses.glb &c=/models/case.glb &verify=1
 * `verify=1` steps q 0→1 (0.02) through the LIVE rigs and logs
 * `LANEC-VERIFY <json>` (round-2 binding checks a/b/c).
 */

RectAreaLightUniformsLib.init()

type Mode = 'both' | 'case' | 'glasses'

function readParams(): {
  q: number
  mode: Mode
  inspectFolded: boolean
  foldAxis: FoldAxis
  signR: number
  signL: number
  ui: boolean
} {
  const p = new URLSearchParams(window.location.search)
  const qRaw = Number.parseFloat(p.get('q') ?? 'NaN')
  const modeRaw = p.get('mode')
  const mode: Mode = modeRaw === 'case' || modeRaw === 'glasses' ? modeRaw : 'both'
  const ax = p.get('foldAxis')
  const foldAxis: FoldAxis = ax === 'x' || ax === 'z' ? ax : 'y'
  return {
    q: Number.isFinite(qRaw) ? Math.min(1, Math.max(0, qRaw)) : 0.3,
    mode,
    inspectFolded: p.get('inspectFolded') === '1',
    foldAxis,
    signR: p.get('signR') === '-1' ? -1 : 1,
    signL: p.get('signL') === '1' ? 1 : -1,
    ui: p.get('ui') !== '0',
  }
}

/** TEMP strip-light cards were visible junk in frame (no envmap in the
 *  harness, so emissive planes contribute no reflections) — removed.
 *  The two RectAreaLights below remain the strip-light stand-ins. */

const Q_STOPS = [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0]

/**
 * Fixed 3/4 camera azimuth (deg) of this harness: atan2(0.24, 0.43) ≈ 29°.
 * The hero yaw stages the lenses to face it (check (c) gate).
 */
const HERO_YAW_34_DEG = 29

/** Round-2 binding checks against the live rig scene (?verify=1). */
function VerifyRunner({
  setQ,
  heroYawDeg,
  onDone,
}: {
  setQ: (q: number) => void
  heroYawDeg: number
  onDone: (r: LaneCVerifyResult) => void
}) {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    runLaneCVerification({ scene, camera, setQ, heroYawDeg })
      .then(onDone)
      .catch((err: unknown) => console.log('LANEC-VERIFY-ERROR ' + String(err)))
  }, [scene, camera, setQ, heroYawDeg, onDone])
  return null
}

/**
 * Harness-only light discipline: the warm velvet practical must NEVER tint
 * the graphite shell (binding: neutral graphite). The spot lives on layer 1
 * and only the velvet cushion joins it; key/rect/hemi stay on layer 0 and
 * light everything neutrally. (The film's real stage belongs to Lane D —
 * this just proves the MATERIALS are neutral under any staging.)
 */
function SpotLayers({ lightRef }: { lightRef: React.RefObject<THREE.SpotLight | null> }) {
  const scene = useThree((s) => s.scene)
  const armed = useRef(false)
  useFrame(() => {
    if (armed.current) return
    const cushion = scene.getObjectByName('Velvet_Cushion')
    const light = lightRef.current
    if (!cushion || !light) return
    cushion.traverse((o) => {
      o.layers.enable(1)
    })
    light.layers.set(1)
    armed.current = true
  })
  return null
}

/** One-shot geometry probe: logs world bboxes so fold axes are facts. */
function Probe() {
  const done = useRef(false)
  useFrame(({ scene }) => {
    if (done.current || !scene.getObjectByName('G_Root')) return
    done.current = true
    const box = new THREE.Box3()
    const out: Record<string, unknown> = {}
    for (const name of ['G_Arm_R', 'G_Arm_L', 'G_Front', 'G_Lenses', 'G_Root']) {
      const o = scene.getObjectByName(name)
      if (!o) {
        out[name] = 'MISSING'
        continue
      }
      box.setFromObject(o)
      const p = new THREE.Vector3()
      o.getWorldPosition(p)
      const info: Record<string, unknown> = {
        type: o.type,
        pos: p.toArray().map((v) => +v.toFixed(5)),
        rot: [o.rotation.x, o.rotation.y, o.rotation.z].map((v) => +v.toFixed(4)),
        localPos: o.position.toArray().map((v) => +v.toFixed(5)),
        parent: o.parent ? `${o.parent.type}:${o.parent.name}` : null,
        bboxMin: box.min.toArray().map((v) => +v.toFixed(5)),
        bboxMax: box.max.toArray().map((v) => +v.toFixed(5)),
      }
      // If this object has a same-named mesh child, report it too.
      const kids: unknown[] = []
      o.children.forEach((c) => {
        kids.push(`${c.type}:${c.name}@${c.position.toArray().map((v) => +v.toFixed(4)).join(',')}`)
      })
      info.children = kids
      // Local geometry bounds of direct mesh children.
      const local = new THREE.Box3()
      o.children.forEach((c) => {
        const m = c as THREE.Mesh
        if (m.isMesh) {
          m.geometry.computeBoundingBox()
          const b = m.geometry.boundingBox
          if (b) {
            local.min.set(Math.min(local.min.x, b.min.x), Math.min(local.min.y, b.min.y), Math.min(local.min.z, b.min.z))
            local.max.set(Math.max(local.max.x, b.max.x), Math.max(local.max.y, b.max.y), Math.max(local.max.z, b.max.z))
          }
        }
      })
      if (!local.isEmpty()) {
        info.geoLocalMin = local.min.toArray().map((v) => +v.toFixed(5))
        info.geoLocalMax = local.max.toArray().map((v) => +v.toFixed(5))
      }
      out[name] = info
    }
    console.log('LANEC-PROBE ' + JSON.stringify(out))
  }, 1)
  return null
}

function Harness() {
  const initial = useMemo(() => readParams(), [])
  const [q, setQ] = useState(initial.q)
  const [mode, setMode] = useState<Mode>(initial.mode)
  const [foldAxis, setFoldAxis] = useState<FoldAxis>(initial.foldAxis)
  const [signR, setSignR] = useState(initial.signR)
  const [signL, setSignL] = useState(initial.signL)
  const [inspectFolded, setInspectFolded] = useState(initial.inspectFolded)
  // Static per page load — plain reads, no memo needed.
  const pageParams = new URLSearchParams(window.location.search)
  const probe = pageParams.get('probe') === '1'
  const verify = pageParams.get('verify') === '1'
  const glassesUrl = pageParams.get('g') ?? '/models/glasses.glb'
  const caseUrl = pageParams.get('c') ?? '/models/case.glb'
  const side = pageParams.get('side') === '1'
  const macro = pageParams.get('macro') === '1'
  const [verifyResult, setVerifyResult] = useState<LaneCVerifyResult | null>(null)
  const handleVerifyDone = useCallback((r: LaneCVerifyResult) => setVerifyResult(r), [])
  // Harness-only practical ref (see SpotLayers — warm light never touches graphite).
  const velvetSpot = useRef<THREE.SpotLight | null>(null)

  const flap = caseFlapAngle(q)
  const fold = glassesFold(q)

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050607' }}>
      <Canvas
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        camera={{
          fov: 35,
          near: 0.002,
          far: 60,
          position: macro ? [0.14, 0.13, 0.1] : side ? [0.48, 0.09, 0.03] : [0.24, 0.17, 0.43],
        }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <color attach="background" args={['#050607']} />
        {/* ---- TEMP LIGHTS (Lane C harness only — Lane D owns the stage) ---- */}
        <hemisphereLight args={['#1A1D24', '#050607', 0.5]} />
        <directionalLight color="#FFF2E2" intensity={2.2} position={[-0.3, 0.4, 0.25]} />
        {/* Velvet spot: tight front-raking cone on the cushion only — the
            graphite shell must stay neutral (physical falloff: E = I/d²).
            Rakes from front-above so the flap crown can't catch a pink
            specular; gated down once the glasses occlude the bowl.
            SpotLayers() additionally confines this light to the cushion. */}
        <spotLight
          ref={velvetSpot}
          color="#FF8A7A"
          intensity={(flap > 1 ? 0.3 : 0.18) * (1 - 0.55 * smoothstep(0.45, 0.65, q))}
          position={[0, 0.16, 0.12]}
          angle={0.14}
          penumbra={0.5}
          target-position={[0, -0.01, -0.01]}
        />
        <rectAreaLight color="#E8F0FF" intensity={3.5} width={0.5} height={0.06} position={[0.3, 0.2, -0.2]} rotation={[-0.4, -0.6, 0]} />
        <rectAreaLight color="#E8F0FF" intensity={3.5} width={0.5} height={0.06} position={[-0.3, 0.2, -0.2]} rotation={[-0.4, 0.6, 0]} />
        {/* ---- HERO OBJECTS ---- */}
        <Suspense fallback={null}>
          {(mode === 'both' || mode === 'case') && <CaseRig progress={q} url={caseUrl} />}
          {(mode === 'both' || mode === 'glasses') && (
            <GlassesRig
              progress={q}
              url={glassesUrl}
              debugFoldAxis={foldAxis}
              debugFoldSignR={signR}
              debugFoldSignL={signL}
              inspectFolded={inspectFolded}
              heroYawDeg={HERO_YAW_34_DEG}
            />
          )}
        </Suspense>
        <OrbitControls
          target={macro ? [0.07, 0.1, -0.015] : side ? [0, 0.05, -0.02] : [0, 0.055, 0]}
          enableDamping={false}
        />
        {probe && <Probe />}
        {verify && <VerifyRunner setQ={setQ} heroYawDeg={HERO_YAW_34_DEG} onDone={handleVerifyDone} />}
        <SpotLayers lightRef={velvetSpot} />
      </Canvas>

      {verifyResult && (
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            padding: 12,
            background: verifyResult.ok ? 'rgba(8,40,16,0.9)' : 'rgba(48,10,10,0.9)',
            color: '#E9E2D3',
            font: '12px/1.5 monospace, sans-serif',
            border: '1px solid rgba(233,226,211,0.2)',
            borderRadius: 4,
            maxWidth: 560,
            whiteSpace: 'pre-wrap',
          }}
        >
          {`LANEC-VERIFY ok=${verifyResult.ok ? 'PASS' : 'FAIL'}\n` +
            `attach R/L spread: ${verifyResult.attachR.spreadMm.toFixed(3)}/${verifyResult.attachL.spreadMm.toFixed(3)}mm\n` +
            `arm R/L spread: ${verifyResult.armR.spreadMm.toFixed(3)}/${verifyResult.armL.spreadMm.toFixed(3)}mm\n` +
            `clearance: viol=${verifyResult.clearance.violations} min=${verifyResult.clearance.minClearanceMm.toFixed(1)}mm @q=${verifyResult.clearance.worstQ.toFixed(2)}\n` +
            `facing: worstDot=${verifyResult.facing.worstDot.toFixed(4)} @q=${verifyResult.facing.worstQ.toFixed(2)}`}
        </div>
      )}

      {initial.ui && (
        <div
          style={{
            position: 'absolute',
            left: 12,
            bottom: 12,
            padding: 12,
            background: 'rgba(10,12,14,0.85)',
            color: '#E9E2D3',
            font: '12px/1.5 system-ui, sans-serif',
            border: '1px solid rgba(233,226,211,0.2)',
            borderRadius: 4,
            maxWidth: 420,
          }}
        >
          <div>
            q{' '}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={q}
              onChange={(e) => setQ(Number(e.target.value))}
              style={{ width: 220 }}
            />{' '}
            <b>{q.toFixed(2)}</b>
          </div>
          <div style={{ marginTop: 6 }}>
            {Q_STOPS.map((s) => (
              <button key={s} onClick={() => setQ(s)} style={{ marginRight: 4 }}>
                {s.toFixed(1)}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 6 }}>
            mode:{' '}
            {(['both', 'case', 'glasses'] as Mode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{ marginRight: 4, fontWeight: m === mode ? 'bold' : 'normal' }}>
                {m}
              </button>
            ))}
            <label style={{ marginLeft: 8 }}>
              <input type="checkbox" checked={inspectFolded} onChange={(e) => setInspectFolded(e.target.checked)} /> inspectFolded
            </label>
          </div>
          <div style={{ marginTop: 6 }}>
            foldAxis:{' '}
            {(['x', 'y', 'z'] as FoldAxis[]).map((a) => (
              <button key={a} onClick={() => setFoldAxis(a)} style={{ marginRight: 4, fontWeight: a === foldAxis ? 'bold' : 'normal' }}>
                {a}
              </button>
            ))}
            signR:{' '}
            <button onClick={() => setSignR((s) => -s)}>{signR > 0 ? '+1' : '−1'}</button>{' '}
            signL: <button onClick={() => setSignL((s) => -s)}>{signL > 0 ? '+1' : '−1'}</button>
          </div>
          <div style={{ marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
            flap {flap.toFixed(1)}° · foldL {fold.foldL.toFixed(1)}° · foldR {fold.foldR.toFixed(1)}°
          </div>
        </div>
      )}
    </div>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')
createRoot(root).render(<Harness />)

// EyeQ Vision Care — Lane B isolated harness: box stand-ins (Lane B, step 4).
// Proves the full §6 camera path BEFORE .glb integration. Real rigs (Lane C)
// and stage/waves (Lane D) replace these stand-ins 1:1 inside <FilmCanvas>.
// Stand-in geometry (metres): case 0.198×0.042×0.070 (as-built shell),
// glasses hovering above, right-lens centre == STAND_IN_LENS_ANCHOR.

import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { LensPortal } from '../../components/canvas/LensPortal'
import { STAND_IN_LENS_ANCHOR } from '../../motion/chapters'
import { filmProgress } from '../../motion/progress'

const GRAPHITE = '#121519'
const VELVET = '#4B0F16'
const STEEL = '#4B5563'

function CaseStandIn() {
  return (
    <group>
      {/* Shell body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.198, 0.042, 0.07]} />
        <meshStandardMaterial color={GRAPHITE} roughness={0.45} metalness={0.6} />
      </mesh>
      {/* Shell crown highlight strip (chamfer catchlight read) */}
      <mesh position={[0, 0.0215, 0]}>
        <boxGeometry args={[0.19, 0.0015, 0.062]} />
        <meshStandardMaterial color={STEEL} roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Velvet cushion (inner lining) */}
      <mesh position={[0, 0.024, 0]}>
        <boxGeometry args={[0.17, 0.008, 0.05]} />
        <meshStandardMaterial color={VELVET} roughness={0.95} metalness={0} />
      </mesh>
      {/* Flap stand-in (static; Lane C animates Case_Flap 0→40°) */}
      <mesh position={[0, 0.032, -0.033]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.198, 0.006, 0.036]} />
        <meshStandardMaterial color={GRAPHITE} roughness={0.45} metalness={0.6} />
      </mesh>
    </group>
  )
}

function GlassesStandIn() {
  const c = STAND_IN_LENS_ANCHOR.center
  const armZ = c[2] - 0.055
  return (
    <group>
      {/* Front bar */}
      <mesh position={[0, c[1] + 0.012, c[2]]}>
        <boxGeometry args={[0.14, 0.008, 0.01]} />
        <meshStandardMaterial color="#0b0c0e" roughness={0.35} metalness={1} />
      </mesh>
      {/* Left lens rim (stand-in ring; right lens = LensPortal disc) */}
      <mesh position={[-0.048, c[1], c[2]]}>
        <torusGeometry args={[0.032, 0.0035, 12, 48]} />
        <meshStandardMaterial color="#0b0c0e" roughness={0.35} metalness={1} />
      </mesh>
      <mesh position={[-0.048, c[1], c[2]]}>
        <circleGeometry args={[0.03, 48]} />
        <meshStandardMaterial color="#101315" roughness={0.05} metalness={0.2} />
      </mesh>
      {/* Right lens rim ring (disc itself comes from LensPortal) */}
      <mesh position={[c[0], c[1], c[2]]}>
        <torusGeometry args={[0.032, 0.0035, 12, 48]} />
        <meshStandardMaterial color="#0b0c0e" roughness={0.35} metalness={1} />
      </mesh>
      {/* Folded arms (static stand-in; Lane C staggers L→R unfold) */}
      <mesh position={[-0.068, c[1], armZ]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.008, 0.006, 0.11]} />
        <meshStandardMaterial color="#0b0c0e" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0.068, c[1], armZ]} rotation={[0, -0.5, 0]}>
        <boxGeometry args={[0.008, 0.006, 0.11]} />
        <meshStandardMaterial color="#0b0c0e" roughness={0.4} metalness={0.8} />
      </mesh>
    </group>
  )
}

/** Temp lights emulating the §6 choreography until SceneStage (Lane D) lands. */
function StandInLights() {
  const key = useRef<THREE.DirectionalLight | null>(null)
  const strip = useRef<THREE.RectAreaLight | null>(null)
  useFrame(() => {
    const { p } = filmProgress
    if (key.current) {
      // B1 reveal ramp 0→2.5, hold ~2, collapse toward the portal.
      const ramp = Math.min(1, p / 0.1)
      key.current.intensity = ramp < 1 ? 2.5 * ramp : p > 0.92 ? 0.4 : 2.0
    }
    if (strip.current) {
      // Dark-field strips sweep up B3–B4, fire at the portal.
      strip.current.intensity = p < 0.25 ? 1 : p > 0.92 ? 6.0 : 4.0
    }
  })
  return (
    <group>
      <directionalLight
        ref={key}
        position={[-0.4, 0.55, 0.35]}
        color="#FFF2E2"
        intensity={0}
      />
      <hemisphereLight args={['#1A1D24', '#050607', 0.25]} />
      <rectAreaLight
        ref={strip}
        position={[0.3, 0.25, -0.2]}
        color="#E8F0FF"
        intensity={1}
        width={0.4}
        height={0.1}
      />
    </group>
  )
}

export function StandInStage() {
  return (
    <group>
      <StandInLights />
      <CaseStandIn />
      <GlassesStandIn />
      <LensPortal />
      <ContactShadows position={[0, -0.0215, 0]} opacity={0.65} blur={2.2} far={0.4} resolution={512} color="#000000" />
    </group>
  )
}

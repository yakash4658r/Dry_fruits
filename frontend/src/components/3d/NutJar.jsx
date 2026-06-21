import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, RoundedBox, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/* ─ Single floating nut (organic sphere with noise bump) ─ */
function Nut({ position, color = '#C8901A', size = 0.14, speed = 1, shape = 'almond' }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    ref.current.rotation.x = t * 0.4
    ref.current.rotation.y = t * 0.6
    ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.12
  })
  return (
    <mesh ref={ref} position={position} castShadow>
      {shape === 'almond'
        ? <sphereGeometry args={[size, 12, 8]} />
        : <dodecahedronGeometry args={[size, 0]} />}
      <meshStandardMaterial
        color={color}
        roughness={0.55}
        metalness={0.05}
        envMapIntensity={0.8}
      />
    </mesh>
  )
}

/* ─ Jar lid ─ */
function JarLid({ y = 1.62 }) {
  return (
    <group position={[0, y, 0]}>
      {/* Lid body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.18, 64]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Lid rim */}
      <mesh position={[0, -0.1, 0]}>
        <torusGeometry args={[0.72, 0.04, 16, 64]} />
        <meshStandardMaterial color="#AA820A" metalness={0.95} roughness={0.08} />
      </mesh>
      {/* Logo disc on top */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.01, 32]} />
        <meshStandardMaterial color="#0A2E28" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  )
}

/* ─ Main exported Jar component ─ */
export default function NutJar({ scrollY = 0 }) {
  const jarGroupRef = useRef()
  const glassRef    = useRef()
  const nutsRef     = useRef()

  /* Random nut positions inside the jar */
  const nutData = useMemo(() => {
    const nuts = []
    const colors = ['#C8901A', '#B87333', '#D4A017', '#8B4513', '#CD853F', '#DEB887']
    const shapes = ['almond', 'walnut']
    for (let i = 0; i < 18; i++) {
      nuts.push({
        position: [
          (Math.random() - 0.5) * 0.9,
          -0.5 + Math.random() * 1.0,
          (Math.random() - 0.5) * 0.9,
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 0.09 + Math.random() * 0.1,
        speed: 0.4 + Math.random() * 0.5,
        shape: shapes[i % 2],
      })
    }
    return nuts
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!jarGroupRef.current) return

    // Gentle idle float
    jarGroupRef.current.position.y = Math.sin(t * 0.7) * 0.12
    jarGroupRef.current.rotation.y = t * 0.18

    // Scroll-driven tilt
    jarGroupRef.current.rotation.x = scrollY * 0.0008
  })

  return (
    <group ref={jarGroupRef}>
      {/* ── Glass Jar Body ── */}
      <mesh ref={glassRef} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.65, 3.0, 64, 1, true]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          resolution={512}
          transmission={0.95}
          roughness={0.02}
          thickness={0.25}
          ior={1.5}
          chromaticAberration={0.04}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.05}
          color="#CCFFE8"
          attenuationColor="#4AFFC4"
          attenuationDistance={1.2}
        />
      </mesh>

      {/* Jar bottom cap */}
      <mesh position={[0, -1.5, 0]} receiveShadow>
        <cylinderGeometry args={[0.65, 0.6, 0.12, 64]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.15} />
      </mesh>

      {/* Inner jar rim (top opening) */}
      <mesh position={[0, 1.52, 0]}>
        <torusGeometry args={[0.75, 0.04, 16, 64]} />
        <MeshTransmissionMaterial transmission={0.9} roughness={0.03} thickness={0.1} color="#CCFFE8" />
      </mesh>

      {/* Label band */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.76, 0.76, 1.2, 64, 1, true]} />
        <meshStandardMaterial
          color="#FAF8F5"
          roughness={0.9}
          metalness={0}
          opacity={0.88}
          transparent
        />
      </mesh>

      {/* Label gold accent line */}
      <mesh position={[0, 0.4, 0]}>
        <torusGeometry args={[0.765, 0.008, 8, 64]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <torusGeometry args={[0.765, 0.008, 8, 64]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Lid */}
      <JarLid y={1.62} />

      {/* Nuts inside (visible through glass) */}
      <group ref={nutsRef}>
        {nutData.map((n, i) => <Nut key={i} {...n} />)}
      </group>

      {/* Sparkles around the jar */}
      <Sparkles
        count={60}
        scale={3}
        size={1.2}
        speed={0.3}
        opacity={0.6}
        color="#D4AF37"
      />
    </group>
  )
}

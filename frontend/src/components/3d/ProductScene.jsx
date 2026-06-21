import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, PerspectiveCamera, AdaptiveDpr } from '@react-three/drei'
import NutJar from './NutJar'
import * as THREE from 'three'

/* Floating ambient nut particles (outside the jar) */
function AmbientNuts({ count = 24 }) {
  const ref = useRef()
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6 - 2,
    ),
    speed:  0.2 + Math.random() * 0.5,
    offset: Math.random() * Math.PI * 2,
    size:   0.06 + Math.random() * 0.12,
    color:  ['#C8901A','#B87333','#8B4513','#D4A017','#A0522D'][Math.floor(Math.random() * 5)],
  })), [count])

  return (
    <group ref={ref}>
      {data.map((d, i) => (
        <FloatingNut key={i} {...d} />
      ))}
    </group>
  )
}

function FloatingNut({ position, speed, offset, size, color }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = position.y + Math.sin(t * speed + offset) * 0.5
    ref.current.rotation.x = t * speed * 0.6
    ref.current.rotation.z = t * speed * 0.4
    ref.current.position.x = position.x + Math.cos(t * speed * 0.3 + offset) * 0.2
  })
  return (
    <mesh ref={ref} position={position.toArray()} castShadow>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
    </mesh>
  )
}

/* Scene lighting */
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFF8E1" castShadow
        shadow-mapSize={[1024, 1024]} shadow-camera-far={30} />
      <pointLight position={[-4, 2, 3]} intensity={1.2} color="#D4AF37" />
      <pointLight position={[4, -2, -3]} intensity={0.8} color="#0A2E28" />
    </>
  )
}

/* ── Main exported 3D Canvas Scene ── */
export default function ProductScene({ scrollY = 0 }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ width: '100%', height: '100%' }}
    >
      <AdaptiveDpr pixelated />
      <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={45} />

      <Suspense fallback={null}>
        <SceneLights />

        {/* HDR environment for glass reflections */}
        <Environment preset="night" />

        {/* Main 3D Jar */}
        <NutJar scrollY={scrollY} />

        {/* Ambient floating nuts */}
        <AmbientNuts count={20} />

        {/* Ground contact shadow */}
        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.5}
          scale={6}
          blur={2.5}
          far={4}
          color="#0A2E28"
        />
      </Suspense>
    </Canvas>
  )
}

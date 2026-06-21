import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

/* Golden dust particles scattered in 3D space */
function GoldenParticles({ count = 800 }) {
  const ref = useRef()
  const clock = useRef(0)

  // Randomly position particles in a sphere
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const r     = 5 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      // Gold colour with slight variation
      col[i * 3]     = 0.83 + Math.random() * 0.15  // R
      col[i * 3 + 1] = 0.69 + Math.random() * 0.15  // G
      col[i * 3 + 2] = 0.10 + Math.random() * 0.20  // B
    }
    return [pos, col]
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current) return
    clock.current += delta
    ref.current.rotation.y = clock.current * 0.04
    ref.current.rotation.x = Math.sin(clock.current * 0.02) * 0.1
  })

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        vertexColors
        transparent
        opacity={0.75}
        size={0.045}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

/* Floating torus-knot "nut" shape */
function FloatingNut({ position = [0, 0, 0], speed = 1 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = clock.getElapsedTime() * 0.3 * speed
    ref.current.rotation.y = clock.getElapsedTime() * 0.5 * speed
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * speed) * 0.3
  })

  return (
    <mesh ref={ref} position={position} castShadow>
      <torusKnotGeometry args={[0.45, 0.15, 120, 16]} />
      <meshStandardMaterial
        color="#D4AF37"
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1.2}
      />
    </mesh>
  )
}

/* Icosahedron "walnut" */
function FloatingSphere({ position = [0, 0, 0], speed = 0.8, color = '#AA820A' }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.x = t * 0.4 * speed
    ref.current.rotation.z = t * 0.2 * speed
    ref.current.position.y = position[1] + Math.sin(t * speed + 2) * 0.4
  })

  return (
    <mesh ref={ref} position={position} castShadow>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.3}
        wireframe={false}
      />
    </mesh>
  )
}

/* Main exported component */
export default function ParticleScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#F3E0A2" />
      <pointLight position={[-10, -5, -10]} intensity={0.6} color="#D4AF37" />

      {/* 3D Particle Dust */}
      <GoldenParticles count={700} />

      {/* Floating Shapes */}
      <FloatingNut  position={[3.5, 1.2, -2]}  speed={0.7} />
      <FloatingNut  position={[-3,  -1,  -3]}  speed={1.1} />
      <FloatingSphere position={[-3.5, 1.5, -1]} speed={0.9} color="#C8A415" />
      <FloatingSphere position={[3,  -1.5,  -2]} speed={0.65} color="#E8C84A" />
    </Canvas>
  )
}

import { useRef, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Component that renders Earth as a red sphere at the center of the scene
function Earth() {
  return (
    // Sphere is a helper from drei that creates a 3D ball
    // args=[radius, widthSegments, heightSegments] - more segments = smoother sphere
    <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
      {/* meshPhongMaterial makes the sphere shiny and responsive to lighting */}
      {/* Using red (#dc2626) with slight glow for cyberpunk vibe */}
      <meshPhongMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.2} />
    </Sphere>
  );
}

// Component that renders a ring/orbit around Earth with hover distance markers
// Rings represent orbital paths where asteroids travel
function OrbitRing({ radius, color }: { radius: number; color: string }) {
  // Track hover state for showing distance markers
  const [hovered, setHovered] = useState(false);

  // Create a torus (donut shape) to represent the ring as a solid circle
  // This creates a ring geometry instead of segmented line
  const torusGeometry = new THREE.TorusGeometry(
    radius,      // radius of the ring (distance from center)
    0.02,        // tube radius (thickness of the ring line) - much thinner
    16,          // radial segments (how many segments around the circle)
    100          // tubular segments (smoothness of the circle)
  );

  return (
    <group
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Mesh renders the ring as a solid opaque circle */}
      <mesh geometry={torusGeometry} rotation={[Math.PI / 2, 0, 0]}>
        {/* meshBasicMaterial colors the ring with full opacity */}
        {/* Using lighter red than the planet (#ef5555 is lighter than planet's #dc2626) */}
        <meshBasicMaterial
          color="#ef5555"
          transparent={false}
          depthWrite={true}
        />
      </mesh>

      {/* Distance marker text that shows on hover */}
      {hovered && (
        <Text position={[radius + 0.5, 0.5, 0]} fontSize={0.3} anchorX="left" color="#ffffff">
          {radius.toFixed(1)} AU
        </Text>
      )}
    </group>
  );
}

// Component that generates and renders a starfield background
// Stars are positioned behind all other objects (lower z-index equivalent)
function Starfield() {
  // Generate random star positions once and memoize them
  // This prevents stars from moving around on re-renders
  const stars = useMemo(() => {
    const starArray = [];
    // Create 500 random stars distributed around the scene
    for (let i = 0; i < 500; i++) {
      starArray.push({
        position: [
          (Math.random() - 0.5) * 200,  // Random x between -100 and 100
          (Math.random() - 0.5) * 200,  // Random y between -100 and 100
          (Math.random() - 0.5) * 200,  // Random z between -100 and 100
        ] as [number, number, number],
        size: Math.random() * 0.1 + 0.05, // Random size between 0.05 and 0.15
      });
    }
    return starArray;
  }, []);

  return (
    <>
      {stars.map((star, i) => (
        // Each star is a tiny white sphere
        <Sphere
          key={i}
          args={[star.size, 4, 4]}
          position={star.position}
        >
          {/* White material makes stars glow */}
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
      ))}
    </>
  );
}

// Component that renders a single asteroid as a small grey cube
// Takes a position prop to place it in 3D space [x, y, z]
function Asteroid({ position }: { position: [number, number, number] }) {
  // useRef lets us access the mesh directly if we need to animate it later
  const ref = useRef<THREE.Mesh>(null);

  return (
    // mesh is the container for a 3D object (geometry + material)
    <mesh ref={ref} position={position}>
      {/* boxGeometry creates a cube with specified dimensions [width, height, depth] */}
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      {/* meshPhongMaterial gives it a grey color and makes it reflective */}
      <meshPhongMaterial color="#888888" />
    </mesh>
  );
}

// Main scene component - this is where the 3D magic happens
export default function Scene() {
  return (
    // Canvas is the root Three Fiber component - it creates the 3D rendering context
    <Canvas
      // camera controls where the viewer is looking from
      // position=[x, y, z]: y=15 means we're locked looking straight down (top-down view)
      // fov=50 is the field of view angle in degrees
      camera={{ position: [0, 15, 0], fov: 50 }}
      // Make the canvas fill its container completely
      style={{ width: '100%', height: '100%' }}
      // Dark background for cyberpunk vibe
      gl={{ antialias: true, alpha: true }}
    >
      {/* Set a pure black background like classic arcade Asteroids */}
      <color attach="background" args={['#000000']} />

      {/* ambientLight provides overall illumination so objects aren't completely dark */}
      {/* Dimmer for a more dramatic cyberpunk look */}
      <ambientLight intensity={0.4} color="#ffffff" />

      {/* pointLight is like a light bulb - it shines from a specific point in space */}
      {/* Neutral white light from above */}
      <pointLight position={[0, 20, 0]} intensity={1} color="#ffffff" />

      {/* Render the starfield first (renders behind everything else) */}
      <Starfield />

      {/* Render Earth at the center */}
      <Earth />

      {/* Render multiple orbit rings at different distances */}
      {/* All rings are now red with slight transparency */}
      <OrbitRing radius={3} color="#ef4444" />
      <OrbitRing radius={5} color="#f87171" />
      <OrbitRing radius={7} color="#ef4444" />
      <OrbitRing radius={9} color="#f87171" />

      {/* Sample asteroids positioned in a circle around Earth */}
      {/* These are placeholder positions - will be replaced with real NASA data later */}
      <Asteroid position={[3, 0, 0]} />
      <Asteroid position={[0, 0, 3]} />
      <Asteroid position={[-3, 0, 0]} />
      <Asteroid position={[0, 0, -3]} />

      {/* OrbitControls - allows free rotation and zoom */}
      <OrbitControls
        enableZoom={true}
        enableRotate={true}
        enablePan={true}
        autoRotate={false}
      />
    </Canvas>
  );
}

import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '@/stores/gameStore';

export const DefaultPath = () => {
  const meshRef = useRef<Mesh>(null);
  const { camera } = useThree();
  const lastSafeChoiceLocation = useGameStore((state) => state.lastSafeChoiceLocation);
  const awakeningLevel = useGameStore((state) => state.awakeningLevel);

  // Only appear after first awakening
  if (!lastSafeChoiceLocation || awakeningLevel < 1) return null;

  const entityPosition: [number, number, number] = [
    lastSafeChoiceLocation.x,
    1.6,
    lastSafeChoiceLocation.z,
  ];

  useFrame(() => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = 1.6 + Math.sin(Date.now() * 0.001) * 0.1;

      // Check distance to player for audio cue
      const distance = camera.position.distanceTo(meshRef.current.position);
      
      if (distance < 10) {
        // TODO: Play low drone audio
        console.log('Entity nearby - distance:', distance.toFixed(2));
      }

      if (distance < 3) {
        // TODO: Intensify audio, apply slow effect
        console.log('Entity very close!');
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={entityPosition}
    >
      <capsuleGeometry args={[0.3, 1.4, 8, 16]} />
      <meshStandardMaterial
        color="#0a0015"
        emissive="#2b0f3a"
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

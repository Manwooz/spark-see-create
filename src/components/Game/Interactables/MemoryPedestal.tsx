import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { useGameStore } from '@/stores/gameStore';
import { generateAutoEntry } from '@/utils/proceduralText';

interface MemoryPedestalProps {
  position: [number, number, number];
  memoryId: string;
}

export const MemoryPedestal = ({ position, memoryId }: MemoryPedestalProps) => {
  const meshRef = useRef<Mesh>(null);
  const [interacted, setInteracted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { camera } = useThree();
  const addJournal = useGameStore((state) => state.addJournal);

  useFrame(() => {
    if (meshRef.current && !interacted) {
      // Glow animation
      meshRef.current.rotation.y += 0.01;
      
      // Check distance to player
      const distance = camera.position.distanceTo(meshRef.current.position);
      setShowPrompt(distance < 3);
    }
  });

  const handleInteraction = () => {
    if (!interacted) {
      setInteracted(true);
      
      // Generate and add journal entry
      const memoryText = generateAutoEntry();
      addJournal({
        id: `memory_${memoryId}_${Date.now()}`,
        text: memoryText,
        timestamp: new Date().toISOString(),
        title: 'Memory Fragment',
      });
      
      // Play audio cue (placeholder)
      console.log('Playing record_scratch.mp3');
    }
  };

  // Listen for E key
  useFrame(() => {
    if (showPrompt && !interacted) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'e') {
          handleInteraction();
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
        <meshStandardMaterial
          color={interacted ? '#3e6b4a' : '#2b0f3a'}
          emissive={interacted ? '#000000' : '#2b0f3a'}
          emissiveIntensity={interacted ? 0 : 0.5}
        />
      </mesh>
      
      {!interacted && (
        <Sparkles
          count={20}
          scale={2}
          size={2}
          speed={0.3}
          color="#2b0f3a"
          position={[0, 1, 0]}
        />
      )}
      
      {showPrompt && !interacted && (
        <mesh position={[0, 2, 0]}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshBasicMaterial color="#9e9e9e" opacity={0.8} transparent />
        </mesh>
      )}
    </group>
  );
};

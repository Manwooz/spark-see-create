import { useRef } from 'react';
import { Mesh } from 'three';
import { useGameStore } from '@/stores/gameStore';
import { MemoryPedestal } from '../Interactables/MemoryPedestal';
import { ChoiceChamber } from '../Interactables/ChoiceChamber';

export const Corridor = () => {
  const awakeningLevel = useGameStore((state) => state.awakeningLevel);
  
  // Darken walls based on awakening level
  const wallColor = awakeningLevel >= 2 ? '#1a1a1a' : '#2b2b2b';
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0f0f0f" />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-10, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[100, 4]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[10, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[100, 4]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 2, -20]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 4]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      
      {/* Memory Pedestals */}
      <MemoryPedestal position={[-5, 0, -5]} memoryId="m1" />
      <MemoryPedestal position={[5, 0, -10]} memoryId="m2" />
      
      {/* Choice Chamber */}
      <ChoiceChamber position={[0, 0, -15]} choiceId="c1" />
      
      {/* Flickering point lights */}
      <pointLight position={[0, 3, -5]} intensity={0.4} color="#9e9e9e" />
      <pointLight position={[0, 3, -15]} intensity={0.3} color="#2b0f3a" />
    </group>
  );
};

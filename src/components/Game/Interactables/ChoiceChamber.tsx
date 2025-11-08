import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '@/stores/gameStore';
import choicesData from '@/data/choices_data.json';

interface ChoiceChamberProps {
  position: [number, number, number];
  choiceId: string;
}

export const ChoiceChamber = ({ position, choiceId }: ChoiceChamberProps) => {
  const meshRef = useRef<Mesh>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const { camera } = useThree();
  
  const updateBindingScore = useGameStore((state) => state.updateBindingScore);
  const addChoice = useGameStore((state) => state.addChoice);
  const setLastSafeChoiceLocation = useGameStore((state) => state.setLastSafeChoiceLocation);

  const choice = choicesData.choice_chambers.find((c) => c.id === choiceId);

  useFrame(() => {
    if (meshRef.current) {
      const distance = camera.position.distanceTo(meshRef.current.position);
      setShowPrompt(distance < 3 && !showChoice);
    }
  });

  const handleChoice = (option: 'a' | 'b') => {
    if (!choice) return;

    const change = option === 'a' ? choice.a_change : choice.b_change;
    updateBindingScore(change);
    
    addChoice({
      choiceId: choice.id,
      selectedOption: option,
      timestamp: new Date().toISOString(),
      location: { x: position[0], y: position[1], z: position[2] },
    });

    // If it's a "safe" choice (positive binding), update entity location
    if (change > 0) {
      setLastSafeChoiceLocation(position[0], position[1], position[2]);
    }

    setShowChoice(false);
  };

  // Listen for E key to open choice
  useFrame(() => {
    if (showPrompt && !showChoice) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'e') {
          setShowChoice(true);
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  });

  if (!choice) return null;

  return (
    <>
      <group position={position}>
        <mesh ref={meshRef} position={[0, 2, 0]}>
          <boxGeometry args={[2, 4, 0.2]} />
          <meshStandardMaterial color="#2b0f3a" emissive="#2b0f3a" emissiveIntensity={0.3} />
        </mesh>
        
        {showPrompt && !showChoice && (
          <mesh position={[0, 3, 0]}>
            <planeGeometry args={[2, 0.4]} />
            <meshBasicMaterial color="#9e9e9e" opacity={0.8} transparent />
          </mesh>
        )}
      </group>

      {/* Choice UI Overlay */}
      {showChoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/90 z-50 pointer-events-auto">
          <div className="bg-card border border-border p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-6">Choice Chamber</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleChoice('a')}
                className="w-full p-6 bg-primary hover:bg-primary/80 text-primary-foreground rounded-md transition-colors text-left"
              >
                <div className="text-xl font-semibold mb-2">{choice.label_a}</div>
                <div className="text-sm opacity-80">The familiar path</div>
              </button>
              <button
                onClick={() => handleChoice('b')}
                className="w-full p-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors text-left"
              >
                <div className="text-xl font-semibold mb-2">{choice.label_b}</div>
                <div className="text-sm opacity-80">The uncertain path</div>
              </button>
            </div>
            <button
              onClick={() => setShowChoice(false)}
              className="mt-4 text-muted-foreground hover:text-foreground text-sm"
            >
              [Press ESC to close]
            </button>
          </div>
        </div>
      )}
    </>
  );
};

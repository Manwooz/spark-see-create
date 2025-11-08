import { useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useGameStore } from '@/stores/gameStore';
import { generateThought } from '@/utils/proceduralText';

export const IntrusiveThought = () => {
  const [currentThought, setCurrentThought] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0);
  const { camera } = useThree();
  const bindingScore = useGameStore((state) => state.bindingScore);
  const isPaused = useGameStore((state) => state.isPaused);
  const isJournalOpen = useGameStore((state) => state.isJournalOpen);

  useEffect(() => {
    if (isPaused || isJournalOpen) return;

    const spawnThought = () => {
      const thought = generateThought(bindingScore);
      setCurrentThought(thought);

      // Fade in
      setTimeout(() => setOpacity(1), 100);

      // Hold
      setTimeout(() => {
        // Fade out
        setOpacity(0);
        setTimeout(() => setCurrentThought(null), 2000);
      }, 5000);
    };

    // First thought after 5 seconds
    const initialTimeout = setTimeout(spawnThought, 5000);

    // Then every 40 seconds
    const interval = setInterval(spawnThought, 40000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [bindingScore, isPaused, isJournalOpen]);

  if (!currentThought) return null;

  // Position slightly off-center from camera
  const position = camera.position.clone();
  position.x += 1;
  position.y -= 0.5;
  position.z -= 3;

  return (
    <Text
      position={[position.x, position.y, position.z]}
      fontSize={0.15}
      color="#b0b0b0"
      anchorX="center"
      anchorY="middle"
      maxWidth={2}
      textAlign="center"
      fillOpacity={opacity}
    >
      {currentThought}
    </Text>
  );
};

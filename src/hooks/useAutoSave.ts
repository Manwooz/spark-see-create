import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { setupAutoSave, loadGame } from '@/utils/saveSystem';

export const useAutoSave = () => {
  const loadGameState = useGameStore((state) => state.loadGameState);

  useEffect(() => {
    // Load saved game on mount
    const savedGame = loadGame();
    if (savedGame) {
      loadGameState(savedGame);
      console.log('Game loaded from save');
    }

    // Setup auto-save
    const cleanup = setupAutoSave(() => useGameStore.getState());

    return cleanup;
  }, [loadGameState]);
};

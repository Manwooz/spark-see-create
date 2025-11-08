import { GameState, SaveData } from '@/types/game.types';

const SAVE_KEY = 'mindspace_save_v1';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export const saveGame = (gameState: GameState): void => {
  const saveData: SaveData = {
    ...gameState,
    version: '1.0.0',
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log('Game saved successfully');
  } catch (error) {
    console.error('Failed to save game:', error);
  }
};

export const loadGame = (): GameState | null => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) return null;

    const parseData: SaveData = JSON.parse(savedData);
    console.log('Game loaded successfully');
    
    // Return just the game state, not the save metadata
    const { version, savedAt, ...gameState } = parseData;
    return gameState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
};

export const exportSave = (gameState: GameState): void => {
  const saveData: SaveData = {
    ...gameState,
    version: '1.0.0',
    savedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(saveData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mindspace_save_${gameState.worldSeed}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importSave = (file: File): Promise<GameState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const saveData: SaveData = JSON.parse(result);
        const { version, savedAt, ...gameState } = saveData;
        resolve(gameState);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const setupAutoSave = (getGameState: () => GameState): () => void => {
  const interval = setInterval(() => {
    const state = getGameState();
    if (!state.isPaused) {
      saveGame(state);
    }
  }, AUTOSAVE_INTERVAL);

  return () => clearInterval(interval);
};

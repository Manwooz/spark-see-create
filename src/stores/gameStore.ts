import { create } from 'zustand';
import { GameState, ChoiceHistory, Journal } from '@/types/game.types';

interface GameStore extends GameState {
  updateBindingScore: (change: number) => void;
  updateClarity: () => void;
  updatePlayerPosition: (x: number, y: number, z: number) => void;
  updatePlayerRotation: (x: number, y: number) => void;
  addChoice: (choice: ChoiceHistory) => void;
  addJournal: (journal: Journal) => void;
  updateJournalEntry: (id: string, text: string) => void;
  setLastSafeChoiceLocation: (x: number, y: number, z: number) => void;
  setCurrentRoom: (room: string) => void;
  toggleJournal: () => void;
  togglePause: () => void;
  checkAwakeningLevel: () => void;
  resetGame: () => void;
  loadGameState: (state: GameState) => void;
}

const initialState: GameState = {
  bindingScore: 0,
  clarity: 100,
  playerPosition: { x: 0, y: 1.6, z: 5 },
  playerRotation: { x: 0, y: 0 },
  choicesHistory: [],
  journals: [
    {
      id: 'j0',
      text: 'You start in a corridor of grey light.',
      timestamp: new Date().toISOString(),
      title: 'Beginning',
    },
  ],
  worldSeed: Math.random().toString(36).substring(7),
  currentRoom: 'corridor_of_comfort',
  lastSafeChoiceLocation: null,
  isJournalOpen: false,
  isPaused: false,
  awakeningLevel: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  updateBindingScore: (change: number) => {
    set((state) => {
      const newScore = Math.max(0, Math.min(100, state.bindingScore + change));
      return { bindingScore: newScore };
    });
    get().updateClarity();
    get().checkAwakeningLevel();
  },

  updateClarity: () => {
    set((state) => ({
      clarity: 100 - state.bindingScore,
    }));
  },

  updatePlayerPosition: (x: number, y: number, z: number) => {
    set({ playerPosition: { x, y, z } });
  },

  updatePlayerRotation: (x: number, y: number) => {
    set({ playerRotation: { x, y } });
  },

  addChoice: (choice: ChoiceHistory) => {
    set((state) => ({
      choicesHistory: [...state.choicesHistory, choice],
    }));
  },

  addJournal: (journal: Journal) => {
    set((state) => ({
      journals: [...state.journals, journal],
    }));
  },

  updateJournalEntry: (id: string, text: string) => {
    set((state) => ({
      journals: state.journals.map((j) =>
        j.id === id ? { ...j, text } : j
      ),
    }));
  },

  setLastSafeChoiceLocation: (x: number, y: number, z: number) => {
    set({ lastSafeChoiceLocation: { x, y, z } });
  },

  setCurrentRoom: (room: string) => {
    set({ currentRoom: room });
  },

  toggleJournal: () => {
    set((state) => ({ isJournalOpen: !state.isJournalOpen }));
  },

  togglePause: () => {
    set((state) => ({ isPaused: !state.isPaused }));
  },

  checkAwakeningLevel: () => {
    const { bindingScore } = get();
    let newLevel = 0;
    if (bindingScore >= 90) newLevel = 3;
    else if (bindingScore >= 60) newLevel = 2;
    else if (bindingScore >= 30) newLevel = 1;

    set((state) => {
      if (newLevel > state.awakeningLevel) {
        // Add journal entry for awakening moment
        const awakeningMessages = [
          { title: 'The First Whisper', text: 'Something changed. The air feels heavier. You hear whispers at the edge of perception.' },
          { title: 'The Weight', text: 'Your steps are slower now. The walls seem closer. Everything familiar feels like a trap.' },
          { title: 'The Chains', text: 'You see them now - the spectral chains you forged yourself. Comfort is a darker kind of prison.' },
        ];
        
        if (newLevel > 0 && newLevel <= 3) {
          const message = awakeningMessages[newLevel - 1];
          get().addJournal({
            id: `awakening_${newLevel}_${Date.now()}`,
            title: message.title,
            text: message.text,
            timestamp: new Date().toISOString(),
          });
        }
        
        return { awakeningLevel: newLevel };
      }
      return state;
    });
  },

  resetGame: () => {
    set({
      ...initialState,
      worldSeed: Math.random().toString(36).substring(7),
    });
  },

  loadGameState: (state: GameState) => {
    set(state);
  },
}));

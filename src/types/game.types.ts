import { Vector3 } from 'three';

export interface Choice {
  id: string;
  label_a: string;
  label_b: string;
  a_change: number;
  b_change: number;
}

export interface ChoiceHistory {
  choiceId: string;
  selectedOption: 'a' | 'b';
  timestamp: string;
  location: { x: number; y: number; z: number };
}

export interface Journal {
  id: string;
  text: string;
  timestamp: string;
  title?: string;
}

export interface GameState {
  bindingScore: number;
  clarity: number;
  playerPosition: { x: number; y: number; z: number };
  playerRotation: { x: number; y: number };
  choicesHistory: ChoiceHistory[];
  journals: Journal[];
  worldSeed: string;
  currentRoom: string;
  lastSafeChoiceLocation: { x: number; y: number; z: number } | null;
  isJournalOpen: boolean;
  isPaused: boolean;
  awakeningLevel: number; // 0, 1, 2, 3 for thresholds
}

export interface SaveData extends GameState {
  version: string;
  savedAt: string;
}

export interface IntrusiveThought {
  text: string;
  id: string;
}

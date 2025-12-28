export enum Screen {
  CASTLE = 'CASTLE',
  MAP = 'MAP',
  PUZZLE = 'PUZZLE',
  SHOP = 'SHOP',
  ORACLE = 'ORACLE'
}

export enum EntityType {
  HERO = 'HERO',
  ENEMY = 'ENEMY',
  TREASURE = 'TREASURE',
  LAVA = 'LAVA',
  WATER = 'WATER',
  EMPTY = 'EMPTY',
}

export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}

export interface Settings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface GameState {
  gold: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  currentLevelId: number;
  castleLevel: number;
  unlockedLevels: number[];
  settings: Settings;
}

export interface LevelConfig {
  id: number;
  name: string;
  difficulty: number;
  reward: number;
  layout: PuzzleLayout;
  hint: string; // Used for AI context
}

export interface PuzzleLayout {
  // A simplified representation for the puzzle engine
  // Zones are vertical chambers. Pins separating them.
  zones: {
    id: string;
    content: EntityType;
    amount: number; // For fluid or gold
  }[];
  connections: {
    from: string;
    to: string;
    pinId: string; // The ID of the pin blocking this connection
  }[];
}
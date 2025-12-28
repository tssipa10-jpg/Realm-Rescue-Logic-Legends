import { LevelConfig, EntityType } from './types';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    name: "The First Chamber",
    difficulty: 1,
    reward: 100,
    hint: "Gravity is your friend. Clear the path to the gold.",
    layout: {
      zones: [
        { id: 'z1', content: EntityType.HERO, amount: 1 },
        { id: 'z2', content: EntityType.EMPTY, amount: 0 },
        { id: 'z3', content: EntityType.TREASURE, amount: 50 },
      ],
      connections: [
        { from: 'z1', to: 'z2', pinId: 'p1' }, // Hero falls to Middle
        { from: 'z3', to: 'z2', pinId: 'p2' }, // Treasure falls to Middle
      ]
    }
  },
  {
    id: 2,
    name: "Lava Falls",
    difficulty: 2,
    reward: 250,
    hint: "Water turns lava into harmless stone. Don't let the hero burn.",
    layout: {
      zones: [
        { id: 'z1', content: EntityType.WATER, amount: 10 },
        { id: 'z2', content: EntityType.LAVA, amount: 10 },
        { id: 'z3', content: EntityType.HERO, amount: 1 },
        { id: 'z4', content: EntityType.TREASURE, amount: 100 },
      ],
      connections: [
        { from: 'z1', to: 'z2', pinId: 'p1' }, // Water (Top) -> Lava (Below)
        { from: 'z2', to: 'z3', pinId: 'p2' }, // Lava (Below Water) -> Hero (Below Lava)
        { from: 'z3', to: 'z4', pinId: 'p3' }, // Hero -> Treasure (Bottom)
      ]
    }
  },
  {
    id: 3,
    name: "Goblin Ambush",
    difficulty: 3,
    reward: 500,
    hint: "Lava can defeat enemies. Use the environment to clear the threat.",
    layout: {
      zones: [
        { id: 'z1', content: EntityType.LAVA, amount: 10 },
        { id: 'z2', content: EntityType.ENEMY, amount: 1 },
        { id: 'z3', content: EntityType.HERO, amount: 1 },
        { id: 'z4', content: EntityType.TREASURE, amount: 200 },
      ],
      connections: [
        { from: 'z1', to: 'z2', pinId: 'p1' }, // Lava -> Enemy
        { from: 'z2', to: 'z3', pinId: 'p2' }, // Enemy -> Hero
        { from: 'z3', to: 'z4', pinId: 'p3' }, // Hero -> Treasure
      ]
    }
  }
];

export const UPGRADE_COST_MULTIPLIER = 1.5;
export const BASE_CASTLE_COST = 500;
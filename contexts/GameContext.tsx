import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, Screen, Settings } from '../types';

interface GameContextType {
  gameState: GameState;
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  addGold: (amount: number) => void;
  upgradeCastle: () => void;
  completeLevel: (levelId: number, reward: number) => void;
  unlockLevel: (levelId: number) => void;
  spendEnergy: (amount: number) => boolean;
  toggleSound: () => void;
  toggleHaptics: () => void;
  resetGame: () => void;
}

const defaultSettings: Settings = {
  soundEnabled: true,
  hapticsEnabled: true,
};

const defaultState: GameState = {
  gold: 0,
  gems: 10,
  energy: 5,
  maxEnergy: 5,
  currentLevelId: 1,
  castleLevel: 1,
  unlockedLevels: [1],
  settings: defaultSettings,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage with safe merge to prevent crashes on schema updates
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('realmRescueState');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge defaults to ensure new fields (like settings) exist in old saves
        return { ...defaultState, ...parsed, settings: { ...defaultState.settings, ...parsed.settings } };
      }
    } catch (e) {
      console.error("Failed to load save state", e);
    }
    return defaultState;
  });

  const [currentScreen, setScreen] = useState<Screen>(Screen.CASTLE);

  useEffect(() => {
    localStorage.setItem('realmRescueState', JSON.stringify(gameState));
  }, [gameState]);

  const addGold = (amount: number) => {
    setGameState(prev => ({ ...prev, gold: prev.gold + amount }));
  };

  const upgradeCastle = () => {
    setGameState(prev => ({ ...prev, castleLevel: prev.castleLevel + 1 }));
  };

  const unlockLevel = (levelId: number) => {
    setGameState(prev => {
        if (prev.unlockedLevels.includes(levelId)) return prev;
        return { ...prev, unlockedLevels: [...prev.unlockedLevels, levelId] };
    });
  };

  const completeLevel = (levelId: number, reward: number) => {
    addGold(reward);
    unlockLevel(levelId + 1);
  };

  const spendEnergy = (amount: number): boolean => {
    if (gameState.energy >= amount) {
      setGameState(prev => ({ ...prev, energy: prev.energy - amount }));
      return true;
    }
    return false;
  };

  const toggleSound = () => {
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled }
    }));
  };

  const toggleHaptics = () => {
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, hapticsEnabled: !prev.settings.hapticsEnabled }
    }));
  };

  const resetGame = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      setGameState(defaultState);
      setScreen(Screen.CASTLE);
    }
  };

  return (
    <GameContext.Provider value={{
      gameState,
      currentScreen,
      setScreen,
      addGold,
      upgradeCastle,
      completeLevel,
      unlockLevel,
      spendEnergy,
      toggleSound,
      toggleHaptics,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
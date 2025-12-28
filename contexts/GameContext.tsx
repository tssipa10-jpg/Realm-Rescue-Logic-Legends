import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, Screen } from '../types';

interface GameContextType {
  gameState: GameState;
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  addGold: (amount: number) => void;
  upgradeCastle: () => void;
  completeLevel: (levelId: number, reward: number) => void;
  unlockLevel: (levelId: number) => void;
  spendEnergy: (amount: number) => boolean;
}

const defaultState: GameState = {
  gold: 0,
  gems: 10,
  energy: 5,
  maxEnergy: 5,
  currentLevelId: 1,
  castleLevel: 1,
  unlockedLevels: [1],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage if available, else default
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('realmRescueState');
    return saved ? JSON.parse(saved) : defaultState;
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
    // Return to map after short delay handled by UI, but here we update data
  };

  const spendEnergy = (amount: number): boolean => {
    if (gameState.energy >= amount) {
      setGameState(prev => ({ ...prev, energy: prev.energy - amount }));
      return true;
    }
    return false;
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
      spendEnergy
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
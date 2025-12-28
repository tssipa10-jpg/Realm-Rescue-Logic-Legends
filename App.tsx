import React, { useState } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { Screen, Difficulty } from './types';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { CastleScreen } from './screens/CastleScreen';
import { MapScreen } from './screens/MapScreen';
import { PuzzleScreen } from './screens/PuzzleScreen';
import { ShopScreen } from './screens/ShopScreen';
import { OracleScreen } from './screens/OracleScreen';

const MainLayout: React.FC = () => {
  const { currentScreen, setScreen } = useGame();
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.NORMAL);

  const handleStartLevel = (levelId: number, difficulty: Difficulty) => {
    setSelectedLevelId(levelId);
    setSelectedDifficulty(difficulty);
    setScreen(Screen.PUZZLE);
  };

  return (
    <div className="relative w-full h-screen max-w-md mx-auto bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
      {/* HUD (Hide on Puzzle) */}
      {currentScreen !== Screen.PUZZLE && <TopBar />}

      {/* Screens */}
      <div className="flex-1 overflow-hidden relative">
        {currentScreen === Screen.CASTLE && <CastleScreen />}
        {currentScreen === Screen.MAP && <MapScreen onStartLevel={handleStartLevel} />}
        {currentScreen === Screen.PUZZLE && <PuzzleScreen levelId={selectedLevelId} difficulty={selectedDifficulty} />}
        {currentScreen === Screen.SHOP && <ShopScreen />}
        {currentScreen === Screen.ORACLE && <OracleScreen />}
      </div>

      {/* Nav (Hide on Puzzle) */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainLayout />
    </GameProvider>
  );
}